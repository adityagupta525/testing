/**
 * Builds a single contact-sheet PNG of all onboarding screens
 * laid out 7-up across 3 rows, with screen-id captions.
 *
 * Usage:  node design/scripts/contact-sheet.js
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS = path.resolve(__dirname, '..', 'screenshots');
const OUT = path.resolve(SCREENSHOTS, 'contact-sheet.png');

const ROWS = [
  [['S-01','Splash'],      ['S-02','Value Prop'],   ['S-03','Sign In'],    ['O-01','Mobile OTP'],  ['O-02','Email OTP'],  ['O-03','Country'],     ['O-04','PFIC (US)']],
  [['O-05','PAN'],         ['O-06a','CKYCR fast'],  ['O-08','Passport OCR'],['O-08c','Video KYC'], ['O-09a','Bank form'], ['O-09b','Bank verify'],['O-09c','Bank done']],
  [['O-10','Risk'],        ['O-11','Nominee'],      ['O-12','eSign'],      ['O-13','Account ✓']],
];

(async () => {
  const cells = ROWS.flatMap((row, r) => row.map(([id, t], c) => ({ id, t, r, c })));
  const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Patrick+Hand&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<style>
  body { margin: 0; padding: 32px; background: #E9E4D6; font-family: "Patrick Hand", sans-serif; }
  h1 { font-family: "Caveat"; font-size: 36px; color: #1F2024; margin: 0 0 4px; }
  .sub { font-family: "JetBrains Mono"; font-size: 11px; color: #6B6E78; letter-spacing: 0.08em; margin-bottom: 28px; text-transform: uppercase; }
  .grid { display: grid; grid-template-columns: repeat(7, 200px); gap: 32px 24px; }
  .cell { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
  .cell img { width: 200px; height: auto; border-radius: 18px; box-shadow: 2px 2px 0 #2A2C32; }
  .id { font-family: "JetBrains Mono"; font-size: 10px; color: #6B6E78; letter-spacing: 0.08em; }
  .t  { font-family: "Patrick Hand"; font-size: 14px; color: #1F2024; font-weight: 700; }
</style></head><body>
  <h1>Centricity NRI · Onboarding flow</h1>
  <div class="sub">Flow A · Pre-Auth + Onboarding · 18 screens · for Figma reference</div>
  <div class="grid">
    ${cells.map(({id,t}) => `
      <div class="cell">
        <img src="${id}.png" />
        <div class="id">${id}</div>
        <div class="t">${t}</div>
      </div>
    `).join('')}
  </div>
</body></html>`;

  fs.writeFileSync(path.join(SCREENSHOTS, '_contact-sheet.html'), html);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('file://' + path.join(SCREENSHOTS, '_contact-sheet.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const body = await page.$('body');
  await body.screenshot({ path: OUT });
  await browser.close();
  fs.unlinkSync(path.join(SCREENSHOTS, '_contact-sheet.html'));
  console.log('✓', OUT);
})().catch((e) => { console.error(e); process.exit(1); });
