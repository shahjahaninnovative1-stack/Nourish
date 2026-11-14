#!/usr/bin/env node
/**
 * Exercises the real analysis path (photo -> server function -> structured
 * result -> diary) against e2e/serve-with-api.js, which stubs only the model
 * provider.   BASE_URL=http://localhost:4500 node e2e/ai-check.js
 */
const { chromium, devices } = require('playwright');
const BASE = (process.env.BASE_URL || 'http://localhost:4500').replace(/\/$/, '');
const EXEC = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const results = []; const errs = [];
let page;
const check = async (label, fn) => { try { results.push({ ok: true, label, note: (await fn()) || '' }); } catch (e) { results.push({ ok: false, label, note: e.message.split('\n')[0].slice(0, 130) }); } };
const tap = async (t, exact = false) => { await page.getByText(t, { exact }).first().click(); await page.waitForTimeout(280); };
const body = () => page.locator('body').innerText();
const has = async (t) => { if (!(await body()).includes(t)) throw new Error(`not found: "${t}"`); return `saw "${t}"`; };
const lacks = async (t) => { if ((await body()).includes(t)) throw new Error(`unexpected: "${t}"`); return `no "${t}"`; };
const circle = async (color, min, max) => {
  const pt = await page.evaluate(({ color, min, max }) => { for (const e of document.querySelectorAll('div')) { const r = e.getBoundingClientRect();
    if (r.width < min || r.width > max || Math.abs(r.width - r.height) > 6 || r.bottom > innerHeight + 2 || r.top < innerHeight - 200) continue;
    if (getComputedStyle(e).backgroundColor === color) return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; } return null; }, { color, min, max });
  if (!pt) throw new Error('control not found'); await page.mouse.click(pt.x, pt.y); await page.waitForTimeout(400);
};

(async () => {
  const browser = await chromium.launch({ executablePath: EXEC });
  page = await (await browser.newContext({ ...devices['iPhone 13'], locale: 'en-GB' })).newPage();
  page.setDefaultTimeout(8000);
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(1200);
  const PHOTO = require('path').join(require('os').tmpdir(), 'savora-ai-meal.jpg');
  await page.screenshot({ path: PHOTO, type: 'jpeg', quality: 60 });
  for (const t of ['Continue', 'Continue']) await tap(t, true);
  await tap('Build my plan'); await page.getByText(/All set|Continue without/).first().click(); await page.waitForTimeout(700);

  const eaten = async () => parseInt((await body()).match(/([\d,]+)\s*\n?\s*eaten/)[1].replace(/,/g, ''));
  const before = await eaten();

  await check('A1. Camera asks consent first', async () => { await circle('rgb(225, 85, 43)', 46, 64); await has('Before your first analysis'); await tap('Allow & continue'); return 'granted'; });
  await check('A2. Photo is analysed by the service', async () => {
    const [fc] = await Promise.all([page.waitForEvent('filechooser'), circle('rgb(255, 255, 255)', 68, 80)]);
    await fc.setFiles(PHOTO);
    await page.waitForFunction(() => /tap a dish to adjust/i.test(document.body.innerText), null, { timeout: 20000 });
    return has('AI estimate');
  });
  await check('A3. Result is the service\'s, not sample data', async () => { await has('Grilled chicken'); await has('Brown rice'); await lacks('sample data'); return lacks('Roti (tandoori)'); });
  await check('A4. Total is the sum of the returned dishes', () => has('Log 506 kcal'));
  await check('A5. Model notes and hidden oil are shown', async () => { await has('Dressing amount is uncertain'); return has('1.5 tsp'); });
  await check('A6. Allergen on the user\'s list is flagged, never "safe"', async () => { await tap('Yoghurt dip'); await has('Usually contains lactose'); return lacks('safe'); });
  await check('A7. Portion change rescales the total', async () => { await tap('Brown rice'); await page.getByLabel('Larger portion').click(); await page.waitForTimeout(250); return has('Log 614 kcal'); });
  await check('A8. Logging lands in the diary with its source', async () => { await tap('Log 614 kcal'); await page.waitForTimeout(500); await has('Logged by you'); await has('Grilled chicken'); return has('Photo scan'); });
  await check('A9. Calories eaten rise by exactly the logged amount', async () => { await tap('Home', true); const af = await eaten(); if (af !== before + 614) throw new Error(`${before} -> ${af}`); return `${before} -> ${af}`; });

  await check('B1. Typed description is parsed by the service', async () => {
    await circle('rgb(243, 236, 224)', 26, 40);
    await page.getByLabel('What you ate').fill('a bowl of porridge and a banana');
    await tap('Work it out');
    await page.waitForFunction(() => /Heard 2 items/i.test(document.body.innerText), null, { timeout: 15000 });
    await has('Oat porridge'); return lacks('sample data');
  });
  await check('B2. Removing an item changes the total', async () => { await page.getByLabel('Remove Banana').click(); await page.waitForTimeout(250); return has('Log 158 kcal'); });
  await check('B3. Voice log lands in the diary', async () => { await tap('Log 158 kcal'); await page.waitForTimeout(500); await has('Oat porridge'); return has('Described'); });

  // ---- free daily allowance (3 real scans) ----
  const scanOnce = async () => {
    const [fc] = await Promise.all([page.waitForEvent('filechooser'), circle('rgb(255, 255, 255)', 68, 80)]);
    await fc.setFiles(PHOTO);
    await page.waitForFunction(() => /tap a dish to adjust/i.test(document.body.innerText), null, { timeout: 20000 });
  };
  await check('D1. Allowance counts down after a real scan', async () => { await tap('Home', true); await circle('rgb(225, 85, 43)', 46, 64); return has('2 of 3 free scans left today'); });
  await check('D2. Second and third scans still work', async () => {
    await scanOnce(); await page.getByLabel('Retake').click(); await page.waitForTimeout(300); await has('1 of 3 free scans left today');
    await scanOnce(); await page.getByLabel('Retake').click(); await page.waitForTimeout(300); return 'used 3';
  });
  await check('D3. Fourth scan is blocked, with a way forward', async () => { await has("Today's free scans are used"); await has('Describe it instead'); return 'blocked'; });
  await check('D4. The limit survives closing and reopening the app', async () => {
    await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(1500);
    await circle('rgb(225, 85, 43)', 46, 64); return has("Today's free scans are used");
  });
  await page.getByText('\u2715', { exact: true }).first().click(); await page.waitForTimeout(300);

  const reqs = await (await fetch(BASE + '/__requests')).json();
  await check('C1. Four provider calls (3 scans + 1 description), none after the limit', async () => {
    if (reqs.length !== 4) throw new Error(`${reqs.length} calls`);
    if (!reqs.every((r) => r.hasKey && r.forcedTool === 'record_meal')) throw new Error('missing key or tool'); return '4 calls';
  });
  await check('C2. Only cuisine and plate size accompany the meal', async () => {
    const all = reqs.map((r) => r.text).join(' ');
    if (!all.includes('South Asian') || !all.includes('26 cm')) throw new Error('context missing');
    for (const leak of ['68', 'Female', 'Lose weight', 'Peanuts']) if (all.includes(leak)) throw new Error(`profile leaked: ${leak}`);
    return 'no age, sex, weight, goal or allergies sent';
  });

  console.log(results.map((r) => `${r.ok ? 'PASS' : 'FAIL'}  ${r.label}${r.note ? '  —  ' + r.note : ''}`).join('\n'));
  console.log(`\n==== ${results.filter((r) => r.ok).length}/${results.length} passed  (real analysis path) ====`);
  console.log('PAGE/CONSOLE ERRORS: ' + (errs.length ? '\n' + errs.join('\n') : 'none'));
  await browser.close(); process.exit(results.some((r) => !r.ok) || errs.length ? 1 : 0);
})().catch((e) => { console.error('HARNESS CRASH', e); process.exit(2); });
