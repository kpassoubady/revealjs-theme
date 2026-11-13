#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function versionToTag(version) {
  const parts = version.replace(/^v/, '').split('.').map(Number);
  const [major = 0, minor = 0, patch = 0] = parts;
  if (patch === 0) {
    if (minor === 0) return `v${major}`;
    return `v${major}.${minor}`;
  }
  return `v${major}.${minor}.${patch}`;
}

function bumpVersion(currentVersion, bumpType) {
  const parts = currentVersion.split('.').map(Number);
  let [major = 1, minor = 0, patch = 0] = parts;

  switch (bumpType.toLowerCase()) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      if (/^[vV]?[0-9]+(\.[0-9]+)*$/.test(bumpType)) {
        const clean = bumpType.replace(/^v/, '');
        const segs = clean.split('.');
        while (segs.length < 3) segs.push('0');
        return segs.slice(0, 3).join('.');
      }
      throw new Error(`Invalid version or bump type: "${bumpType}". Expected major, minor, patch, or x.y.z`);
  }
}

function updateChangelog(content, version) {
  if (content.includes(`## [${version}]`)) {
    return content;
  }

  const today = new Date().toISOString().slice(0, 10);
  const unreleasedRegex = /##\s*\[Unreleased\]/i;

  if (!unreleasedRegex.test(content)) {
    const firstVersionMatch = content.match(/##\s*\[[0-9]+\.[0-9]+(\.[0-9]+)?\]/);
    if (firstVersionMatch) {
      const idx = firstVersionMatch.index;
      return content.slice(0, idx) +
        `## [Unreleased]\n\n## [${version}] - ${today}\n\n` +
        content.slice(idx);
    }
    return content;
  }

  const unreleasedIdx = content.search(unreleasedRegex);
  const afterUnreleased = content.slice(unreleasedIdx);
  const nextHeaderMatch = afterUnreleased.slice(1).match(/##\s*\[[0-9]+\.[0-9]+(\.[0-9]+)?\]/);

  if (nextHeaderMatch) {
    const unreleasedBlock = afterUnreleased.slice(0, nextHeaderMatch.index + 1);
    const rest = afterUnreleased.slice(nextHeaderMatch.index + 1);
    const body = unreleasedBlock.replace(unreleasedRegex, '').trim();

    if (body) {
      return content.slice(0, unreleasedIdx) +
        `## [Unreleased]\n\n## [${version}] - ${today}\n\n${body}\n\n` +
        rest;
    } else {
      return content.slice(0, unreleasedIdx) +
        `## [Unreleased]\n\n## [${version}] - ${today}\n\n` +
        rest;
    }
  }

  const body = afterUnreleased.replace(unreleasedRegex, '').trim();
  return content.slice(0, unreleasedIdx) +
    `## [Unreleased]\n\n## [${version}] - ${today}\n\n${body}\n`;
}

async function main() {
  const args = process.argv.slice(2);
  const pkgPath = resolve(root, 'package.json');
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));
  const currentVersion = pkg.version;
  const currentTag = versionToTag(currentVersion);

  const bumpArg = args.find(a => !a.startsWith('--'));
  const shouldTag = args.includes('--tag');
  const dryRun = args.includes('--dry-run');

  if (!bumpArg) {
    console.log(`Current version: ${currentVersion} (${currentTag})`);
    console.log(`\nUsage:`);
    console.log(`  node scripts/release.mjs <major|minor|patch|x.y.z> [--tag] [--dry-run]`);
    console.log(`  npm run release <major|minor|patch|x.y.z>`);
    process.exit(0);
  }

  const nextVersion = bumpVersion(currentVersion, bumpArg);
  const nextTag = versionToTag(nextVersion);

  console.log(`\nBumping version: ${currentVersion} (${currentTag}) -> ${nextVersion} (${nextTag})\n`);

  if (dryRun) {
    console.log('[dry-run] Would update package.json, README.md, and run tests.');
    return;
  }

  // 1. Update package.json
  pkg.version = nextVersion;
  await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  console.log(`✓ Updated package.json version to ${nextVersion}`);

  // 2. Update README.md CDN references and tag notes
  const readmePath = resolve(root, 'README.md');
  let readme = await readFile(readmePath, 'utf8');
  readme = readme.replaceAll(
    /revealjs-theme@v[0-9]+(\.[0-9]+)*/g,
    `revealjs-theme@${nextTag}`
  );
  readme = readme.replaceAll(
    /tag \(`@v[0-9]+(\.[0-9]+)*`\)/g,
    `tag (\`@${nextTag}\`)`
  );
  await writeFile(readmePath, readme, 'utf8');
  console.log(`✓ Updated README.md CDN URLs and tag notes to ${nextTag}`);

  // 3. Update CHANGELOG.md
  const changelogPath = resolve(root, 'CHANGELOG.md');
  try {
    let changelog = await readFile(changelogPath, 'utf8');
    changelog = updateChangelog(changelog, nextVersion);
    await writeFile(changelogPath, changelog, 'utf8');
    console.log(`✓ Updated CHANGELOG.md for [${nextVersion}]`);
  } catch {
    // optional
  }

  // 4. Update intermediate-devops.md if reference exists
  const devopsDocPath = resolve(root, 'docs/intermediate-devops.md');
  try {
    let devopsDoc = await readFile(devopsDocPath, 'utf8');
    devopsDoc = devopsDoc.replace(/As of theme v[0-9]+(\.[0-9]+)*/g, `As of theme ${nextTag}`);
    await writeFile(devopsDocPath, devopsDoc, 'utf8');
    console.log(`✓ Updated docs/intermediate-devops.md reference to ${nextTag}`);
  } catch {
    // optional doc
  }

  // 5. Run tests to verify consistency
  console.log('\nRunning test suite to verify release consistency...');
  execSync('npm test', { cwd: root, stdio: 'inherit' });
  console.log('✓ All tests passed!\n');

  if (shouldTag) {
    console.log(`Creating git commit and tag ${nextTag}...`);
    execSync(`git add package.json README.md CHANGELOG.md docs/intermediate-devops.md`, { cwd: root, stdio: 'inherit' });
    execSync(`git commit -m "RELEASE: ${nextTag}"`, { cwd: root, stdio: 'inherit' });
    execSync(`git tag ${nextTag}`, { cwd: root, stdio: 'inherit' });
    console.log(`✓ Committed and tagged ${nextTag}.`);
    console.log(`\nTo push release to origin:`);
    console.log(`  git push origin main && git push origin ${nextTag}\n`);
  } else {
    console.log(`Next steps:`);
    console.log(` 1. Review git diff`);
    console.log(` 2. Commit: git commit -am "RELEASE: ${nextTag}"`);
    console.log(` 3. Tag:    git tag ${nextTag}`);
    console.log(` 4. Push:   git push origin main && git push origin ${nextTag}\n`);
  }
}

main().catch(err => {
  console.error('\nRelease failed:', err.message);
  process.exit(1);
});
