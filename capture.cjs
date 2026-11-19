const { firefox } = require('/opt/sandbox-clis/node_modules/playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const [state, sha, url, output] = process.argv.slice(2);
  assert(['before', 'after'].includes(state));
  const expected = state === 'before' ? 'A LITTLE DEMO, NOTHING REAL' : 'SMALL DEMO. BIG POSSIBILITIES.';
  const browser = await firefox.launch({ executablePath: '/opt/camoufox/camoufox', headless: true });
  const results = [];
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844], ['narrow-mobile', 320, 740]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('.demo-badge').innerText(), expected);
      assert.equal(await page.getByRole('status').textContent(), 'ⓘReady when you are. Try a button below.');
      const layout = await page.evaluate(() => {
        const badge = document.querySelector('.demo-badge');
        const b = badge.getBoundingClientRect();
        const w = document.querySelector('.wordmark').getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(badge);
        const text = range.getBoundingClientRect();
        return {
          viewportWidth: innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          badge: { left: b.left, right: b.right, width: b.width, height: b.height },
          wordmarkRight: w.right,
          text: { left: text.left, right: text.right },
        };
      });
      assert(layout.documentWidth <= width, `horizontal overflow at ${width}`);
      assert(layout.badge.left >= layout.wordmarkRight, `header overlap at ${width}`);
      assert(layout.text.left >= 0 && layout.text.right <= width, `clipped slogan at ${width}`);
      assert.deepEqual(errors, []);
      const filename = `${state}-${name}.png`;
      await page.screenshot({ path: path.join(output, filename), fullPage: true });
      results.push({ state, sha, route: '/', viewport: { width, height }, deviceScaleFactor: 1, interaction: 'fresh initial state', filename, expected, layout, pageErrors: errors });
      await page.close();
    }
    fs.writeFileSync(path.join(output, `${state}-manifest.json`), JSON.stringify(results, null, 2) + '\n');
    console.log(JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
