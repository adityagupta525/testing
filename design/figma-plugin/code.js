// Centricity NRI · Onboarding Builder plugin (Figma Plugin API)
// Builds onboarding screens bound to Variables imported via Tokens Studio.

figma.showUI(__html__, { width: 320, height: 560 });

// ---------- logging ----------
const log  = (text, level) => figma.ui.postMessage({ type: 'log', text, level });
const ok   = (t) => log(t, 'ok');
const warn = (t) => log(t, 'warn');
const err  = (t) => log(t, 'err');
const done = ()  => figma.ui.postMessage({ type: 'done' });

// ---------- variable lookup ----------
// Variables imported by Tokens Studio are named e.g.  core/color/paper/100
// We resolve by exact name across all local collections.
let _allVars = null;
async function getVar(name) {
  if (!_allVars) {
    _allVars = await figma.variables.getLocalVariablesAsync();
  }
  const v = _allVars.find((x) => x.name === name);
  if (!v) throw new Error(`Variable not found: "${name}". Did Tokens Studio import succeed?`);
  return v;
}

// Bind a color variable to a SOLID paint
async function solidVar(varName) {
  const v = await getVar(varName);
  const paint = figma.util.solidPaint('#000000'); // placeholder; variable overrides
  return figma.variables.setBoundVariableForPaint(paint, 'color', v);
}

// Plain solid (for cases where we don't have a variable, e.g. transparent)
function solid(hex, opacity = 1) {
  const h = hex.replace('#','');
  const r = parseInt(h.slice(0,2),16)/255;
  const g = parseInt(h.slice(2,4),16)/255;
  const b = parseInt(h.slice(4,6),16)/255;
  return { type: 'SOLID', color: { r, g, b }, opacity };
}

// Bind a float variable to a numeric property via plugin API
async function bindNumber(node, prop, varName) {
  const v = await getVar(varName);
  node.setBoundVariable(prop, v);
}

// ---------- font loader ----------
async function loadFonts() {
  await Promise.all([
    figma.loadFontAsync({ family: 'Patrick Hand',   style: 'Regular' }),
    figma.loadFontAsync({ family: 'Caveat',         style: 'Regular' }),
    figma.loadFontAsync({ family: 'Caveat',         style: 'Bold'    }),
    figma.loadFontAsync({ family: 'JetBrains Mono', style: 'Regular' }),
    figma.loadFontAsync({ family: 'JetBrains Mono', style: 'Medium'  }),
    figma.loadFontAsync({ family: 'JetBrains Mono', style: 'Bold'    }),
  ]);
}

// ---------- low-level builders ----------

async function makePhoneShell() {
  const phone = figma.createFrame();
  phone.name = 'Phone';
  phone.resize(340, 700);
  phone.cornerRadius = 30;
  phone.fills = [await solidVar('semantic/background/surface')];
  phone.strokes = [await solidVar('semantic/border/default')];
  phone.strokeWeight = 2;
  phone.clipsContent = true;
  // sketch shadow: 3,3,0,#2A2C32
  phone.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0x2A/255, g: 0x2C/255, b: 0x32/255, a: 1 },
    offset: { x: 3, y: 3 },
    radius: 0,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
    showShadowBehindNode: false,
  }];
  return phone;
}

async function makeNotch() {
  const n = figma.createRectangle();
  n.name = 'notch';
  n.resize(90, 14);
  n.cornerRadius = 8;
  n.fills = [await solidVar('semantic/background/inverse')];
  return n;
}

async function makeStatusBar() {
  // 18px from each side, 9px font, ink-200
  const bar = figma.createFrame();
  bar.name = 'status-bar';
  bar.layoutMode = 'HORIZONTAL';
  bar.primaryAxisAlignItems = 'SPACE_BETWEEN';
  bar.counterAxisAlignItems = 'CENTER';
  bar.paddingLeft = 18;
  bar.paddingRight = 18;
  bar.paddingTop = 0;
  bar.paddingBottom = 0;
  bar.itemSpacing = 0;
  bar.fills = [];
  bar.resize(340, 14);
  bar.primaryAxisSizingMode = 'FIXED';
  bar.counterAxisSizingMode = 'FIXED';

  const left = figma.createText();
  left.fontName = { family: 'JetBrains Mono', style: 'Regular' };
  left.fontSize = 9;
  left.characters = '10:24';
  left.fills = [await solidVar('semantic/text/secondary')];

  const right = figma.createText();
  right.fontName = { family: 'JetBrains Mono', style: 'Regular' };
  right.fontSize = 9;
  right.characters = '5G  •••  87%';
  right.fills = [await solidVar('semantic/text/secondary')];

  bar.appendChild(left);
  bar.appendChild(right);
  return bar;
}

async function makeHomeIndicator() {
  const h = figma.createRectangle();
  h.name = 'home-indicator';
  h.resize(100, 4);
  h.cornerRadius = 2;
  h.fills = [await solidVar('semantic/text/tertiary')];
  return h;
}

// ---------- screens ----------

async function buildSplash() {
  ok('Loading fonts…');
  await loadFonts();
  ok('Building S-01 Splash…');

  const phone = await makePhoneShell();

  // Notch (absolute)
  const notch = await makeNotch();
  notch.x = (340 - 90) / 2;
  notch.y = 8;
  phone.appendChild(notch);

  // Status bar (absolute)
  const status = await makeStatusBar();
  status.x = 0;
  status.y = 8;
  phone.appendChild(status);

  // Center stack — Auto-Layout V, place at center
  const center = figma.createFrame();
  center.name = 'center-stack';
  center.layoutMode = 'VERTICAL';
  center.primaryAxisAlignItems = 'CENTER';
  center.counterAxisAlignItems = 'CENTER';
  center.itemSpacing = 16;
  center.paddingLeft = 24;
  center.paddingRight = 24;
  center.paddingTop = 24;
  center.paddingBottom = 24;
  center.primaryAxisSizingMode = 'AUTO';
  center.counterAxisSizingMode = 'AUTO';
  center.fills = [];

  // Logo square 64x64, radius 14, stroke 2 ink
  const logoFrame = figma.createFrame();
  logoFrame.name = 'logo';
  logoFrame.resize(64, 64);
  logoFrame.cornerRadius = 14;
  logoFrame.fills = [await solidVar('semantic/background/surface')];
  logoFrame.strokes = [await solidVar('semantic/border/default')];
  logoFrame.strokeWeight = 2;
  logoFrame.layoutMode = 'VERTICAL';
  logoFrame.primaryAxisAlignItems = 'CENTER';
  logoFrame.counterAxisAlignItems = 'CENTER';
  logoFrame.primaryAxisSizingMode = 'FIXED';
  logoFrame.counterAxisSizingMode = 'FIXED';

  const c = figma.createText();
  c.fontName = { family: 'Patrick Hand', style: 'Regular' };
  c.fontSize = 28;
  c.characters = 'C';
  c.fills = [await solidVar('semantic/text/primary')];
  logoFrame.appendChild(c);

  // "Centricity" title
  const title = figma.createText();
  title.fontName = { family: 'Patrick Hand', style: 'Regular' };
  title.fontSize = 22;
  title.characters = 'Centricity';
  title.fills = [await solidVar('semantic/text/primary')];

  // "Wealth, for Indians abroad."
  const sub = figma.createText();
  sub.fontName = { family: 'Patrick Hand', style: 'Regular' };
  sub.fontSize = 11.5;
  sub.characters = 'Wealth, for Indians abroad.';
  sub.fills = [await solidVar('semantic/text/secondary')];

  // Spacer 24
  const spacer = figma.createFrame();
  spacer.resize(1, 24);
  spacer.fills = [];
  spacer.name = 'spacer';

  // "loading..." at 50% opacity
  const loading = figma.createText();
  loading.fontName = { family: 'JetBrains Mono', style: 'Regular' };
  loading.fontSize = 9.5;
  loading.characters = 'loading...';
  loading.opacity = 0.5;
  loading.fills = [await solidVar('semantic/text/secondary')];

  center.appendChild(logoFrame);
  center.appendChild(title);
  center.appendChild(sub);
  center.appendChild(spacer);
  center.appendChild(loading);

  phone.appendChild(center);
  // Place center stack vertically centered in screen area (30 → 700)
  // First we need final size; layout 'AUTO' computes on add.
  // Wait a tick for layout: Figma computes layout synchronously per parent.
  center.x = (340 - center.width) / 2;
  center.y = 30 + ((670 - center.height) / 2);

  // Home indicator (absolute)
  const home = await makeHomeIndicator();
  home.x = (340 - 100) / 2;
  home.y = 700 - 6 - 4;
  phone.appendChild(home);

  // Place phone in current page near viewport center
  const cx = figma.viewport.center.x;
  const cy = figma.viewport.center.y;
  phone.x = cx - 170;
  phone.y = cy - 350;
  figma.currentPage.appendChild(phone);

  // Caption under the phone
  await makeCaption(phone, 'S-01', 'Splash', 'cold-open · loading');

  ok('✓ S-01 placed at ' + phone.x.toFixed(0) + ',' + phone.y.toFixed(0));
  figma.viewport.scrollAndZoomIntoView([phone]);
  done();
}

async function makeCaption(phone, id, title, sub) {
  const cap = figma.createFrame();
  cap.name = `cap · ${id}`;
  cap.layoutMode = 'VERTICAL';
  cap.itemSpacing = 2;
  cap.fills = [];
  cap.paddingTop = 0;
  cap.primaryAxisSizingMode = 'AUTO';
  cap.counterAxisSizingMode = 'AUTO';

  const idText = figma.createText();
  idText.fontName = { family: 'JetBrains Mono', style: 'Regular' };
  idText.fontSize = 9.5;
  idText.characters = id;
  idText.letterSpacing = { value: 8, unit: 'PERCENT' };
  idText.fills = [await solidVar('semantic/text/tertiary')];

  const tText = figma.createText();
  tText.fontName = { family: 'Patrick Hand', style: 'Regular' };
  tText.fontSize = 15;
  tText.characters = title;
  tText.fills = [await solidVar('semantic/text/primary')];

  const sText = figma.createText();
  sText.fontName = { family: 'Patrick Hand', style: 'Regular' };
  sText.fontSize = 12;
  sText.characters = sub;
  sText.fills = [await solidVar('semantic/text/secondary')];

  cap.appendChild(idText);
  cap.appendChild(tText);
  cap.appendChild(sText);

  figma.currentPage.appendChild(cap);
  cap.x = phone.x;
  cap.y = phone.y + 700 + 12;
  return cap;
}

// ---------- token-check command ----------
async function checkTokens() {
  ok('Reading local variables…');
  _allVars = null;
  const all = await figma.variables.getLocalVariablesAsync();
  const collections = await figma.variables.getLocalVariableCollectionsAsync();

  log(`Collections: ${collections.length}`);
  collections.forEach((c) => log(`  • ${c.name} — ${c.variableIds.length} variables`));
  log(`Total variables: ${all.length}`);

  const must = [
    'semantic/background/surface',
    'semantic/background/inverse',
    'semantic/text/primary',
    'semantic/text/secondary',
    'semantic/text/tertiary',
    'semantic/border/default',
  ];
  let missing = 0;
  for (const m of must) {
    if (all.find((v) => v.name === m)) {
      ok('  ✓ ' + m);
    } else {
      err('  ✗ ' + m + ' MISSING');
      missing++;
    }
  }
  if (missing) {
    err(`${missing} required variables missing. Re-run Tokens Studio import.`);
  } else {
    ok('All required variables present. Ready to build.');
  }
  done();
}

// ---------- dispatcher ----------
figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === 'check-tokens') return await checkTokens();
    if (msg.type === 'build') {
      _allVars = null;
      if (msg.screen === 'S-01') return await buildSplash();
      if (msg.screen === 'all') {
        warn('Only S-01 is implemented in this first cut.');
        warn('Approve S-01 against screenshots/S-01.png first; then we extend the plugin.');
        return done();
      }
      warn(`Screen "${msg.screen}" not yet implemented in the first cut.`);
      warn('Approve S-01 against screenshots/S-01.png first; then we extend the plugin.');
      return done();
    }
  } catch (e) {
    err('ERROR: ' + (e && e.message ? e.message : String(e)));
    if (e && e.stack) err(e.stack.split('\n').slice(0, 4).join('\n'));
    done();
  }
};
