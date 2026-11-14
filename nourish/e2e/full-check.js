#!/usr/bin/env node
/**
 * End-to-end check of all 20 screens, covering navigation and computed logic
 * (calorie target recalculation, allergen flagging, recipe filtering, share
 * splitting, voice parsing) rather than rendering alone.
 *
 *   BASE_URL=http://localhost:4300 node e2e/full-check.js
 *
 * Notes for anyone extending this:
 *  - Icon-only controls are located in the DOM by colour+size. Hardcoded pixel
 *    coordinates are not safe: the emulated iPhone 13 viewport is 390x664, and
 *    off-screen content below the fold can otherwise match.
 *  - Detail screens have no tab bar. Use toTabbed() before touching it; the
 *    permissions gate in particular has no back control at all, only its CTA.
 */
const { chromium, devices } = require('playwright');

const BASE = (process.env.BASE_URL || 'http://localhost:4300').replace(/\/$/, '');
const EXEC = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const results = [];
const errs = [];
const failed = [];
let page;

const check = async (label, fn) => {
  try { results.push({ ok: true, label, note: (await fn()) || '' }); }
  catch (e) { results.push({ ok: false, label, note: e.message.split('\n')[0].slice(0, 120) }); }
};
const tap = async (text, exact = true) => {
  await page.getByText(text, { exact }).first().click();
  await page.waitForTimeout(260);
};
const seen = async (text) => {
  if (!(await page.getByText(text, { exact: false }).count())) throw new Error(`not found: "${text}"`);
  return `saw "${text}"`;
};
const body = () => page.locator('body').innerText();

(async () => {
  const browser = await chromium.launch({ executablePath: EXEC });
  const ctx = await browser.newContext({ ...devices['iPhone 13'], locale: 'en-GB' });
  page = await ctx.newPage();
  page.setDefaultTimeout(6000);
  page.on('pageerror', e => errs.push('PAGEERROR ' + String(e).slice(0, 160)));
  page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 160)); });
  page.on('response', r => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });

  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // Return to a screen that has the tab bar. Detail screens expose a back
  // arrow, the camera/voice screens an X, and the permissions gate only a CTA.
  const toTabbed = async () => {
    for (let i = 0; i < 5; i++) {
      if (await page.getByText('Move', { exact: true }).count()) return;
      const back = page.getByText('←', { exact: true }).first();
      if (await back.count()) { await back.click(); await page.waitForTimeout(340); continue; }
      const close = page.getByText('✕', { exact: true }).first();
      if (await close.count()) { await close.click(); await page.waitForTimeout(340); continue; }
      const cta = page.getByText(/All set|Continue without/).first();
      if (await cta.count()) { await cta.click(); await page.waitForTimeout(420); continue; }
      return;
    }
  };
  const clickCircle = async (name, { color, min, max, nearBottom }) => {
    const pt = await page.evaluate(({ color, min, max, nearBottom }) => {
      for (const e of document.querySelectorAll('div')) {
        const r = e.getBoundingClientRect();
        if (r.width < min || r.width > max) continue;
        if (Math.abs(r.width - r.height) > 6) continue;
        if (r.bottom > window.innerHeight + 2 || r.top < 0) continue;   // on-screen only
        if (nearBottom && r.top < window.innerHeight - nearBottom) continue;
        const bg = getComputedStyle(e).backgroundColor;
        if (!(Array.isArray(color) ? color.includes(bg) : bg === color)) continue;
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
      return null;
    }, { color, min, max, nearBottom });
    if (!pt) throw new Error(`${name} not located in DOM`);
    await page.mouse.click(pt.x, pt.y);
    await page.waitForTimeout(450);
    return `${name} @ ${Math.round(pt.x)},${Math.round(pt.y)}`;
  };
  const openScan     = () => clickCircle('scan tab button', { color: 'rgb(225, 85, 43)',   min: 46, max: 64, nearBottom: 200 });
  const openVoiceTab = () => clickCircle('mic tab button',  { color: 'rgb(243, 236, 224)', min: 26, max: 40, nearBottom: 95  });
  // The shutter opens the OS camera / file picker; hand it a real JPEG.
  const PHOTO = require('path').join(require('os').tmpdir(), 'savora-e2e-meal.jpg');
  await page.screenshot({ path: PHOTO, type: 'jpeg', quality: 60 });
  const shoot = async () => {
    const [chooser] = await Promise.all([page.waitForEvent('filechooser'), pressShutter()]);
    await chooser.setFiles(PHOTO);
    await page.waitForFunction(() => /tap a dish to adjust|no food found/i.test(document.body.innerText), null, { timeout: 20000 });
  };
  const pressShutter = () => clickCircle('shutter',         { color: 'rgb(255, 255, 255)', min: 68, max: 80, nearBottom: 200 });

  // ---- onboarding ----
  await check('1. Onboarding renders', () => seen("Let's size up"));
  await check('2. Sex toggle', async () => { await tap('Male'); return 'tapped'; });
  await check('3. Age stepper', async () => {
    const b4 = await page.getByText(/\d+ yrs/).first().textContent();
    await page.getByText('+', { exact: true }).first().click(); await page.waitForTimeout(200);
    const af = await page.getByText(/\d+ yrs/).first().textContent();
    if (b4 === af) throw new Error('age unchanged'); return `${b4} -> ${af}`;
  });
  await check('4. Units -> imperial', async () => { await tap('Switch to imperial', false); return seen('lb'); });
  await check('5. Units -> metric', async () => { await tap('Switch to metric', false); return seen('kg'); });
  await check('6. Goals step', async () => { await tap('Continue'); return seen('What are we'); });
  await check('7. Goal select', async () => { await tap('Build muscle'); return 'selected'; });
  await check('8. Activity select', async () => { await tap('Athlete'); return 'selected'; });
  await check('9. Allergies step', async () => { await tap('Continue'); return seen('Anything we'); });
  await check('10. Allergy chip', async () => { await tap('Gluten'); return 'toggled'; });
  await check('11. Region select', async () => { await tap('South Asian'); return 'selected'; });
  await check('12. -> permissions', async () => { await tap('Build my plan', false); return seen('Three things'); });
  await check('13. Permission detail', () => seen('on-device'));
  await check('14. -> home', async () => { await page.getByText(/All set|Continue without/).first().click(); await page.waitForTimeout(700); return seen('kcal left'); });

  // ---- computed logic ----
  await check('15. LOGIC: target recomputed', async () => {
    const m = (await body()).match(/([\d,]+)\s*\n?\s*target/);
    if (!m) throw new Error('no target');
    const t = parseInt(m[1].replace(/,/g, ''));
    if (t < 2500 || t > 3400) throw new Error(`target ${t} outside band for male/athlete/bulk`);
    return `target=${t} (derived, not hardcoded)`;
  });
  await check('16. AI ambient card', () => seen('Protein is trailing'));
  await check('17. Quick add', () => seen('Chai with sugar'));
  await check('18. Voice banner', () => seen('Just say what you ate'));

  await check('18a. LOGIC: quick add really logs', async () => {
    const eaten = async () => parseInt((await body()).match(/([\d,]+)\s*\n?\s*eaten/)[1].replace(/,/g, ''));
    const b4 = await eaten();
    await page.getByText('+', { exact: true }).first().click(); await page.waitForTimeout(300);
    const af = await eaten();
    if (af <= b4) throw new Error(`eaten stayed ${b4}`); return `${b4} -> ${af}`;
  });
  await check('18b. Real date, neutral greeting', async () => {
    const b = await body();
    if (b.includes('5 Sept') || b.includes('Assalam')) throw new Error('hardcoded date/greeting remains');
    if (!/Good (morning|afternoon|evening)/.test(b)) throw new Error('no greeting'); return 'ok';
  });

  // ---- tabs ----
  await check('19. Diary tab', async () => { await tap('Diary'); return seen('Aloo paratha'); });
  await check('20. Diary meals', () => seen('Suggested: shakshuka'));
  await check('21. Move tab', async () => { await tap('Move'); return seen('Steps this week'); });
  await check('22. Connected apps', () => seen('Google Fit'));
  await check('22a. LOGIC: workout log raises burned', async () => {
    const burned = async () => parseInt((await body()).match(/Total burned today: ([\d,]+)/)[1].replace(/,/g, ''));
    const b4 = await burned();
    await tap('Run', false); await tap('Log run', false); await page.waitForTimeout(300);
    const af = await burned();
    if (af <= b4) throw new Error(`burned stayed ${b4}`);
    await seen('logged by you'); return `${b4} -> ${af} kcal`;
  });
  await check('23. Me tab', async () => { await tap('Me'); return seen('Ayesha K.'); });
  await check('24. LOGIC: BMI', async () => { if (!/\d\d\.\d/.test(await body())) throw new Error('no BMI'); return 'present'; });

  const viaMe = async (row, expect) => {
    await toTabbed();
    await page.getByText('Me', { exact: true }).first().click(); await page.waitForTimeout(320);
    await page.getByText(row, { exact: false }).first().click(); await page.waitForTimeout(450);
    return seen(expect);
  };
  await check('25. Nudges & quotes', () => viaMe('Nudges & healthy quotes', 'Quote of the day'));
  await check('26. Quote cycling', async () => {
    const b4 = await body(); await tap('Another one', false);
    if (b4 === await body()) throw new Error('quote unchanged'); return 'rotated';
  });
  await check('27. Notification toggle', async () => { await tap('Water reminders', false); return 'toggled'; });
  await check('28. Future you', () => viaMe('Future you', 'Projected trajectory'));
  await check('29. LOGIC: horizon changes projection', async () => {
    const b4 = await body(); await tap('24 wk', false);
    if (b4 === await body()) throw new Error('projection unchanged'); return 'recomputed';
  });
  await check('30. Medical disclaimer', () => seen('not a medical prediction'));
  await check('31. Plate calibration', () => viaMe('Plate calibration', 'Reference found'));
  await check('32. Plate select', async () => { await tap('Dinner plate', false); return 'selected'; });
  await check('33. Permissions from Me', () => viaMe('Camera, mic & alerts', 'Three things'));
  await check('34. AI feed', () => viaMe('What Savora noticed', 'Label flag'));
  await check('35. Kitchen fingerprint', () => viaMe('Kitchen fingerprint', 'Accuracy on your food'));
  await check('36. Allergy shield', () => viaMe('Allergy shield card', 'Do not serve me'));
  await check('37. LOGIC: shield reflects allergies', async () => {
    if (!(await body()).includes('Gluten')) throw new Error('Gluten from onboarding missing');
    return 'lists Gluten';
  });
  await check('38. Shield Hindi', () => seen('एलर्जी'));
  await check('39. Shield Urdu', () => seen('الرجی'));
  await check('40. Micronutrients', () => viaMe('Micronutrient history', 'Vitamin B12'));
  await check('41. Weekly insights', () => viaMe('Weekly insights', 'Thali score'));
  await check('42. Recipes', () => viaMe('Saved recipes', 'World kitchen'));
  await check('43. LOGIC: cuisine filter', async () => {
    const b4 = await body(); await tap('Nordic', false); const af = await body();
    if (b4 === af) throw new Error('no effect');
    if (af.includes('Baked palak paneer')) throw new Error('South Asian recipe shown under Nordic');
    return 'filtered';
  });
  await check('44. LOGIC: allergen flagging', async () => {
    await tap('All', true); const b = await body();
    const m = b.match(/\d+ flagged for your allergies|No flagged allergens listed/);
    if (!m) throw new Error('no allergy status line'); return m[0];
  });
  await check('45. LOGIC: empty state', async () => {
    await tap('Nordic', false); await tap('Vegan', false);
    if (!(await body()).includes('Nothing matches')) throw new Error('expected empty state');
    return 'shown';
  });

  await check('45a. Allergen caveat shown', () => seen('cannot detect cross-contamination'));
  await check('45b. Legal screen', () => viaMe('Privacy, terms', 'Not medical advice'));
  await check('45c. Demo build disclosed', () => seen('This is a demo build'));
  await check('45e. Free data export offered', () => seen('Export my data'));
  await check('45d. No body-render imagery', async () => {
    await viaMe('Future you', 'Projected trajectory');
    if ((await body()).includes('AI render')) throw new Error('body render still present');
    return 'trajectory chart only';
  });

  // ---- scan / split / leftover ----
  await check('46. Scan (aim)', async () => { await toTabbed(); await openScan(); return seen('Frame the whole plate'); });
  await check('46a. Consent asked before first analysis', async () => {
    await seen('Before your first analysis');
    await tap('Allow & continue', false); return 'granted';
  });
  await check('47. Label scan', async () => { await tap('Label / barcode', false); return seen('Everyday Elaichi Rusk'); });
  await check('48. Label allergy warning', () => seen('Not for you'));
  await check('49. Ingredients decoded', () => seen('Ingredients, decoded'));
  await check('50. Back to scan', async () => { await tap('←', false); return seen('Frame the whole plate'); });
  await check('51. Photo -> result', async () => { await shoot(); return seen('Tap a dish to adjust'); });
  await check('51a. No backend -> labelled as demo, never passed off as real', async () => {
    await seen('Demo result'); return seen('sample data, not your photo');
  });
  await check('52. Result pins', () => seen('Roti (tandoori)'));
  await check('53. LOGIC: pin switches detail', async () => {
    const b4 = await body(); await tap('Chicken karahi · 310', false);
    if (b4 === await body()) throw new Error('no effect'); return 'switched';
  });
  await check('53a. LOGIC: portion stepper rescales the dish and the total', async () => {
    const total = async () => parseInt((await body()).match(/Log ([\d,]+) kcal/)[1].replace(/,/g, ''));
    const b4 = await total();
    await page.getByLabel('Larger portion').click(); await page.waitForTimeout(250);
    const af = await total();
    if (af !== b4 + 155) throw new Error(`expected ${b4 + 155}, got ${af}`);   // karahi 310 x 0.5
    await page.getByLabel('Smaller portion').click(); await page.waitForTimeout(250);
    return `${b4} -> ${af} -> back`;
  });
  await check('54. Hidden-oil meter', () => seen('Hidden-oil meter'));
  await check('55. Shared plate', async () => { await tap('Split this dish', false); return seen('Chicken karahi handi'); });
  await check('56. LOGIC: share stepper', async () => {
    const b4 = await body();
    await page.getByText('+', { exact: true }).first().click(); await page.waitForTimeout(250);
    if (b4 === await body()) throw new Error('no effect'); return 'recomputed';
  });
  await check('57. LOGIC: split reconciliation', async () => {
    const m = (await body()).match(/unclaimed|more than was in the pot|The pot adds up/);
    if (!m) throw new Error('no reconciliation note'); return m[0];
  });
  await check('58. Leftover re-scan', async () => {
    await toTabbed(); await openScan(); await shoot();
    await tap('Scan leftovers', false); return seen('You left food on the plate');
  });
  await check('59. Leftover correction', () => seen('207 kcal'));

  // ---- voice ----
  await check('60. Voice idle', async () => { await toTabbed(); await openVoiceTab(); return seen('Talk it in'); });
  await check('61. Voice examples', () => seen('Do roti, ek katori dal aur chai'));
  await check('62. Describe a meal -> parsed', async () => {
    await tap('Do roti, ek katori dal aur chai', false);
    await tap('Work it out', false);
    await page.waitForFunction(() => document.body.innerText.includes('HEARD') || document.body.innerText.includes('Heard'), null, { timeout: 15000 });
    return seen('4 items');
  });
  await check('63. Parsed total', () => seen('591 kcal'));
  await check('64. LOGIC: drop item recalculates', async () => {
    const b4 = await body();
    await page.getByText('✕', { exact: true }).nth(1).click(); await page.waitForTimeout(350);
    const af = await body();
    if (b4 === af) throw new Error('no effect');
    if (af.includes('591 kcal')) throw new Error('total not recalculated');
    return 'recomputed';
  });

  // ---- persistence + deletion ----
  await check('65. Profile survives reload', async () => {
    await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(1500);
    await seen('kcal left');           // returning user lands on Home, not onboarding
    const m = (await body()).match(/([\d,]+)\s*\n?\s*target/);
    if (!m || parseInt(m[1].replace(/,/g, '')) < 2500) throw new Error('saved profile not restored');
    return 'restored to Home with saved target';
  });
  await check('66. Delete my data', async () => {
    await viaMe('Privacy, terms', 'Not medical advice');
    await tap('Delete my data from this device', false); await page.waitForTimeout(500);
    return seen("Let's size up");      // back to a clean onboarding
  });
  await check('67. Adults only (18+)', async () => {
    for (let i = 0; i < 14; i++) { await page.getByText('\u2212', { exact: true }).first().click(); }
    await page.waitForTimeout(200);
    const age = parseInt(await page.getByText(/\d+ yrs/).first().textContent());
    if (age < 18) throw new Error(`age went to ${age}`);
    return `floor held at ${age}`;
  });

  console.log(results.map(r => `${r.ok ? 'PASS' : 'FAIL'}  ${r.label}${r.note ? '  —  ' + r.note : ''}`).join('\n'));
  console.log(`\n==== ${results.filter(r => r.ok).length}/${results.length} passed  (${BASE}) ====`);
  console.log('PAGE/CONSOLE ERRORS: ' + (errs.length ? '\n' + errs.join('\n') : 'none'));
  console.log('FAILED REQUESTS:     ' + (failed.length ? '\n' + failed.slice(0, 10).join('\n') : 'none'));
  await browser.close();
  process.exit(results.some(r => !r.ok) ? 1 : 0);
})().catch(e => { console.error('HARNESS CRASH', e); process.exit(2); });
