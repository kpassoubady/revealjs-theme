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

test('all bundled font URLs resolve and include redistribution licenses', async () => {
  const css = await read('blue-theme.css');
  for (const [, path] of css.matchAll(/url\("([^"]+)"\)/g)) {
    await access(resolve(root, path));
  }
  for (const font of ['Manrope', 'SpaceGrotesk']) {
    assert.match(await read(`assets/fonts/${font}-OFL.txt`), /SIL OPEN FONT LICENSE/);
  }
});

test('sample exercises every activity and both title formats', async () => {
  const html = await read('examples/index.html');
  for (const name of ['lead', 'divider', 'title-slide', 'concept', 'demo', 'discussion',
    'discussion-answer', 'chat-check', 'chat-check-answer', 'chat-waterfall',
    'chat-waterfall-answer', 'lab', 'kahoot']) {
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
    'chat-check-answer', 'chat-waterfall', 'chat-waterfall-answer', 'lab', 'kahoot']) {
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
    for (const path of ['/', '/blue-theme.css', '/blue-polished.css', '/blue-polished-gradients.css', '/assets/fonts/Manrope.ttf']) {
      assert.equal((await fetch(base + path)).status, 200, path);
    }
    assert.match((await fetch(base + '/blue-theme.css')).headers.get('content-type'), /text\/css/);
    for (const path of ['/.git/config', '/%2e%2e%2fmarp-themes/blue-theme.css', '/missing']) {
      assert.ok([403, 404].includes((await fetch(base + path)).status), path);
    }
  } finally {
    child.kill();
    await once(child, 'exit');
  }
});
