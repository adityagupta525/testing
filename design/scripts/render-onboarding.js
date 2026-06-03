/**
 * Renders each onboarding (Flow A) screen of source-wireframes.html
 * as a PNG at exact Figma frame size (340 × 700) plus a 2x retina version.
 *
 * Usage:  node design/scripts/render-onboarding.js
 *
 * Requires:  npx playwright install chromium  (one-time)
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SOURCE = path.resolve(__dirname, '..', 'source-wireframes.html');
const OUT   = path.resolve(__dirname, '..', 'screenshots');
fs.mkdirSync(OUT, { recursive: true });

// Onboarding screens — id → React component name in window
const SCREENS = [
  ['S-01', 'ScrSplash',        'Splash'],
  ['S-02', 'ScrValueProp',     'Value Prop Carousel'],
  ['S-03', 'ScrSignIn',        'Sign In'],
  ['O-01', 'ScrMobileOTP',     'Mobile OTP'],
  ['O-02', 'ScrEmailOTP',      'Email OTP'],
  ['O-03', 'ScrCountry',       'Country'],
  ['O-04', 'ScrPFIC',          'PFIC Disclosure'],
  ['O-05', 'ScrPAN',           'PAN Validation'],
  ['O-06a','ScrCKYCRFast',     'CKYCR Fast-track'],
  ['O-08', 'ScrPassportOCR',   'Passport OCR'],
  ['O-08c','ScrVideoKYC',      'Video KYC scheduling'],
  ['O-09a','ScrBankLink',      'Bank Link · form'],
  ['O-09b','ScrBankVerifying', 'Bank Link · verifying'],
  ['O-09c','ScrBankVerified',  'Bank Link · verified'],
  ['O-10', 'ScrRiskProfile',   'Risk Profile'],
  ['O-11', 'ScrNominee',       'Nominee'],
  ['O-12', 'ScrESign',         'Review + eSign'],
  ['O-13', 'ScrAccountActive', 'Account Active'],
];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ deviceScaleFactor: 2, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();

  page.on('console', (m) => {
    if (['error', 'warning'].includes(m.type())) console.log(`  [page ${m.type()}]`, m.text());
  });
  page.on('pageerror', (e) => console.log('  [pageerror]', e.message));

  // Load the source page once and wait for React + all babel script blocks to mount.
  await page.goto('file://' + SOURCE, { waitUntil: 'networkidle' });
  // Babel compiles in-browser; can take a while for the 7 big text/babel blocks.
  await page.waitForFunction(() => typeof window.ScrSplash === 'function', { timeout: 120000 });

  for (const [id, fn, title] of SCREENS) {
    console.log(`→ ${id} · ${title}`);

    // Render only the target screen onto a clean root so the screenshot is
    // exactly the 340×700 phone shell.
    await page.evaluate(({ fn }) => {
      const root = document.getElementById('root');
      root.innerHTML = '';
      const mount = document.createElement('div');
      mount.id = 'mount';
      mount.style.cssText = 'padding:0;background:#E9E4D6;display:inline-block;';
      root.appendChild(mount);
      // eslint-disable-next-line no-undef
      ReactDOM.render(React.createElement(window[fn]), mount);
    }, { fn });

    await page.waitForTimeout(120); // tiny settle for fonts
    await page.evaluate(() => document.fonts && document.fonts.ready);

    const handle = await page.$('#mount > *');
    if (!handle) {
      console.warn(`  skip ${id} (mount empty)`);
      continue;
    }
    const file1x = path.join(OUT, `${id}.png`);
    await handle.screenshot({ path: file1x, omitBackground: false });
    console.log(`  ✓ ${path.relative(process.cwd(), file1x)}`);
  }

  await browser.close();
  console.log('\nDone. Screenshots in:', OUT);
})().catch((e) => { console.error(e); process.exit(1); });
