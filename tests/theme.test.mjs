import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import test from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFile(resolve(root, path), 'utf8');

test('classic theme preserves the three Marp brand colors', async () => {
  const css = await read('blue-theme.css');
  for (const declaration of ['--color-primary: #1a73e8', '--color-primary-dark: #0d47a1', '--color-accent: #00bfa5']) {
    assert.ok(css.includes(declaration), declaration);
  }
});

test('all bundled asset URLs resolve and fonts include redistribution licenses', async () => {
  const css = await read('blue-theme.css');
  for (const [, path] of css.matchAll(/url\("([^"]+)"\)/g)) {
    await access(resolve(root, path));
  }
  for (const font of ['Manrope', 'SpaceGrotesk']) {
    assert.match(await read(`assets/fonts/${font}-OFL.txt`), /SIL OPEN FONT LICENSE/);
  }
});

test('branding uses the supplied SVGs with accessible slide-local markup', async () => {
  const css = await read('blue-theme.css');
  const html = await read('examples/index.html');
  for (const path of ['logo.svg', 'logo-white.svg']) {
    const svg = await read(path);
    assert.match(svg, /viewBox="0 0 200 50"/);
    assert.match(svg, />Kavin<\/text>/);
    assert.match(svg, />School<\/text>/);
    assert.doesNotMatch(svg, /<script|<foreignObject|href=/i);
    assert.ok(css.includes(`url("${path}")`), path);
  }
  assert.match(css, /\.reveal section:is\(\.lead, \.divider, \.title-slide\) \.slide-logo/);
  assert.match(html, /logo\.setAttribute\('role', 'img'\)/);
  assert.match(html, /logo\.setAttribute\('aria-label', 'Kavin School'\)/);
  assert.match(html, /slide\.querySelector\(':scope > section'\)/, 'stack wrappers must not get duplicate logos');
});

test('sample exercises every activity and both title formats', async () => {
  const html = await read('examples/index.html');
  for (const name of ['lead', 'divider', 'title-slide', 'concept', 'demo', 'discussion',
    'discussion-answer', 'chat-check', 'chat-check-answer', 'chat-waterfall',
    'chat-waterfall-answer', 'lab', 'kahoot', 'recap']) {
    assert.ok(html.includes(`class="${name}"`), name);
  }
  assert.match(html, /prefers-reduced-motion/);
  assert.match(html, /pdfSeparateFragments: false/);
  assert.doesNotMatch(html, /https?:\/\//, 'preview must not need a CDN');
});

test('third variant layers activity gradients without changing the original themes', async () => {
  const css = await read('blue-polished-gradients.css');
  const html = await read('examples/index.html');
  assert.match(css, /linear-gradient\(/);
  assert.match(css, /var\(--activity-fill\)/);
  assert.match(css, /var\(--activity-color\)/);
  assert.doesNotMatch(css, /:root|@font-face/, 'variant should inherit palette and typography');
  for (const name of ['concept', 'demo', 'discussion', 'discussion-answer', 'chat-check',
    'chat-check-answer', 'chat-waterfall', 'chat-waterfall-answer', 'lab', 'kahoot', 'recap']) {
    assert.ok(css.includes(`.${name}`), name);
  }
  assert.ok(html.indexOf('href="../blue-polished.css"') < html.indexOf('href="../blue-polished-gradients.css"'));
  for (const theme of ['classic', 'polished', 'polished-gradients']) {
    assert.ok(html.includes(`data-theme="${theme}"`), theme);
  }
  assert.match(html, /link\.hash = '#' \+ Reveal\.getSlidePath\(\)/, 'comparison should use the current Reveal slide');
  assert.match(html, /Reveal\.on\('slidechanged', syncComparisonLinks\)/, 'Reveal navigation should refresh comparison links');
});

test('preview server serves theme assets but not hidden or outside files', async () => {
  const child = spawn(process.execPath, ['scripts/serve.mjs'], {
    cwd: root, env: { ...process.env, PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe']
  });
  try {
    const [output] = await once(child.stdout, 'data');
    const base = output.toString().match(/http:\/\/localhost:\d+/)[0].replace('localhost', '127.0.0.1');
    for (const path of ['/', '/blue-theme.css', '/blue-polished.css', '/blue-polished-gradients.css', '/assets/fonts/Manrope.ttf', '/logo.svg', '/logo-white.svg']) {
      assert.equal((await fetch(base + path)).status, 200, path);
    }
    assert.match((await fetch(base + '/blue-theme.css')).headers.get('content-type'), /text\/css/);
    assert.match((await fetch(base + '/logo.svg')).headers.get('content-type'), /image\/svg\+xml/);
    for (const path of ['/.git/config', '/%2e%2e%2fmarp-themes/blue-theme.css', '/missing']) {
      assert.ok([403, 404].includes((await fetch(base + path)).status), path);
    }
  } finally {
    child.kill();
    await once(child, 'exit');
  }
});

test('lab divider provides a green gradient variant for hands-on activities', async () => {
  const classic = await read('blue-theme.css');
  const polished = await read('blue-polished.css');
  const html = await read('examples/index.html');
  assert.match(classic, /\.lab-divider/);
  assert.match(classic, /#007a6b/);
  assert.match(polished, /\.lab-divider/);
  assert.match(polished, /#022b24/);
  assert.ok(html.includes('class="divider lab-divider"'));
});

test('extended vocabulary supports recap, agenda, connect, personal icebreaker, summary pillars, and print styles', async () => {
  const classic = await read('blue-theme.css');
  const polished = await read('blue-polished.css');
  const html = await read('examples/index.html');

  // Recap activity
  assert.match(classic, /\.reveal section\.recap/);
  assert.match(classic, /--activity-label: "RECAP"/);

  // Connect slide
  assert.match(classic, /\.reveal \.slides section\.connect/);
  assert.match(classic, /\.reveal \.connect-card/);
  assert.match(classic, /\.reveal \.connect-btn/);
  assert.match(polished, /\.reveal \.slides section\.connect/);
  assert.ok(html.includes('class="connect"'));

  // Interactive agenda & personal icebreaker
  assert.match(classic, /\.reveal \.agenda-grid/);
  assert.match(classic, /\.reveal \.agenda-badge\.lecture/);
  assert.match(classic, /\.reveal \.agenda-badge\.lab/);
  assert.match(classic, /\.reveal \.personal-grid/);
  assert.match(classic, /\.reveal \.personal-card/);
  assert.ok(html.includes('class="agenda-grid"'));
  assert.ok(html.includes('class="personal-grid"'));

  // Summary pillars & journey grids
  assert.match(classic, /\.reveal :is\(\.summary-pillars-grid, \.course-journey-grid\)/);
  assert.match(classic, /\.reveal :is\(\.summary-next-banner, \.course-capstone-banner\)/);
  assert.ok(html.includes('class="summary-pillars-grid"'));

  // Utility tables and refs list
  assert.match(classic, /\.reveal table\.compact/);
  assert.match(classic, /\.reveal table\.dense/);
  assert.match(classic, /\.reveal ul\.refs/);
  assert.match(classic, /\.reveal ul\.refs\.two-col/);
  assert.match(classic, /\.reveal \.source/);
  assert.match(classic, /\.reveal \.code-wide \.cols-60-40/);
  assert.ok(html.includes('class="compact full"'));
  assert.ok(html.includes('class="refs"'));
  assert.ok(html.includes('class="refs two-col"'));
  assert.ok(html.includes('class="source"'));

  // PDF print page number color rules for title/lead/divider slides
  assert.match(classic, /html\.reveal-print \.reveal \.slides \.pdf-page:has\(:is\(\.lead, \.divider, \.title-slide\)\) \.slide-number-pdf/);
});

test('documentation CDN URLs and tag references are pinned to the current package version tag without drift', async () => {
  const pkg = JSON.parse(await read('package.json'));
  const readme = await read('README.md');
  const [major, minor, patch] = pkg.version.split('.').map(Number);
  const expectedTag = patch === 0
    ? (minor === 0 ? `v${major}` : `v${major}.${minor}`)
    : `v${major}.${minor}.${patch}`;

  const matches = [...readme.matchAll(/revealjs-theme@(v[0-9]+(?:\.[0-9]+)*)/g)];
  assert.ok(matches.length > 0, 'README.md must contain versioned CDN links');

  for (const [fullMatch, tag] of matches) {
    assert.equal(
      tag,
      expectedTag,
      `CDN reference "${fullMatch}" in README.md drifted from package.json version ${pkg.version} (${expectedTag})`
    );
  }

  assert.doesNotMatch(readme, /revealjs-theme@(main|latest)/, 'README.md must never reference mutable @main or @latest');
});

test('CHANGELOG.md records current package version without drift', async () => {
  const pkg = JSON.parse(await read('package.json'));
  const changelog = await read('CHANGELOG.md');
  assert.ok(
    changelog.includes(`## [${pkg.version}]`),
    `CHANGELOG.md must contain entry for current package version ${pkg.version}`
  );
});
