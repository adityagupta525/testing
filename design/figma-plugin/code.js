// Centricity NRI · Onboarding Builder (Figma Plugin API)
// Self-contained: creates design tokens (Variables) AND builds onboarding frames.
// No Tokens Studio required. One install, one run.

figma.showUI(__html__, { width: 340, height: 600 });

// ---------- logging ----------
const log  = (text, level) => figma.ui.postMessage({ type: 'log', text, level });
const ok   = (t) => log(t, 'ok');
const warn = (t) => log(t, 'warn');
const err  = (t) => log(t, 'err');
const done = ()  => figma.ui.postMessage({ type: 'done' });

// ---------- embedded design tokens (mirrors design/tokens/tokens.json) ----------
const TOKENS = {
  core: {
    color: {
      paper: {
        "100": { value: "#FAF7F1", type: "color" },
        "200": { value: "#F2EEE3", type: "color" },
        "300": { value: "#ECE7DA", type: "color" },
        canvas: { value: "#E9E4D6", type: "color" },
        "canvas-grid": { value: "#F0EEE9", type: "color" }
      },
      ink: {
        "100": { value: "#1F2024", type: "color" },
        "200": { value: "#3D3F46", type: "color" },
        "300": { value: "#6B6E78", type: "color" },
        "400": { value: "#B0B2BA", type: "color" },
        line: { value: "#2A2C32", type: "color" },
        "line-soft": { value: "#9A9CA4", type: "color" }
      },
      gold:   { fill: { value: "#F4D58A", type: "color" }, border: { value: "#B8911C", type: "color" }, ink: { value: "#7A5A1E", type: "color" } },
      warn:   { fill: { value: "#F4B27F", type: "color" }, border: { value: "#B86614", type: "color" }, ink: { value: "#7B3F12", type: "color" } },
      danger: { fill: { value: "#EFA9A0", type: "color" }, border: { value: "#962A1E", type: "color" }, ink: { value: "#7A1F15", type: "color" } },
      good:   { fill: { value: "#B9DDB7", type: "color" }, border: { value: "#3F7A3B", type: "color" }, ink: { value: "#2C5A2A", type: "color" } },
      info:   { fill: { value: "#B9D2E4", type: "color" }, border: { value: "#2D6188", type: "color" }, ink: { value: "#1F4663", type: "color" } },
      note:   { fill: { value: "#FFE9A8", type: "color" }, border: { value: "#C9A93E", type: "color" }, ink: { value: "#4B3A00", type: "color" }, pin: { value: "#E94B3C", type: "color" }, "pin-border": { value: "#7A1F15", type: "color" } }
    },
    spacing: {
      "0": { value: 0, type: "spacing" }, "2": { value: 2, type: "spacing" }, "3": { value: 3, type: "spacing" },
      "4": { value: 4, type: "spacing" }, "6": { value: 6, type: "spacing" }, "8": { value: 8, type: "spacing" },
      "10": { value: 10, type: "spacing" }, "12": { value: 12, type: "spacing" }, "14": { value: 14, type: "spacing" },
      "16": { value: 16, type: "spacing" }, "18": { value: 18, type: "spacing" }, "20": { value: 20, type: "spacing" },
      "24": { value: 24, type: "spacing" }, "30": { value: 30, type: "spacing" }
    },
    radius: {
      xs: { value: 4, type: "borderRadius" }, sm: { value: 6, type: "borderRadius" }, md: { value: 8, type: "borderRadius" },
      lg: { value: 10, type: "borderRadius" }, xl: { value: 14, type: "borderRadius" },
      phone: { value: 30, type: "borderRadius" }, pill: { value: 999, type: "borderRadius" }
    },
    stroke: {
      hairline: { value: 1.2, type: "borderWidth" }, thin: { value: 1.3, type: "borderWidth" },
      soft: { value: 1.4, type: "borderWidth" }, default: { value: 1.5, type: "borderWidth" },
      bold: { value: 2, type: "borderWidth" }, heavy: { value: 2.5, type: "borderWidth" }, extra: { value: 3, type: "borderWidth" }
    },
    size: {
      "phone-w": { value: 340, type: "sizing" }, "phone-h": { value: 700, type: "sizing" },
      "screen-h": { value: 670, type: "sizing" }, "tabbar-h": { value: 60, type: "sizing" },
      "topbar-h": { value: 48, type: "sizing" }, "input-h": { value: 40, type: "sizing" },
      "input-lg-h": { value: 60, type: "sizing" }, "btn-h": { value: 44, type: "sizing" },
      "btn-sm-h": { value: 32, type: "sizing" }, "row-min-h": { value: 44, type: "sizing" },
      "otp-cell-h": { value: 36, type: "sizing" }, avatar: { value: 26, type: "sizing" },
      "tab-icon": { value: 22, type: "sizing" }, "tab-icon-invest": { value: 38, type: "sizing" }
    },
    font: {
      size: {
        "8-5": { value: 8.5, type: "fontSizes" }, "9": { value: 9, type: "fontSizes" }, "9-5": { value: 9.5, type: "fontSizes" },
        "10": { value: 10, type: "fontSizes" }, "11": { value: 11, type: "fontSizes" }, "11-5": { value: 11.5, type: "fontSizes" },
        "12": { value: 12, type: "fontSizes" }, "13": { value: 13, type: "fontSizes" }, "14": { value: 14, type: "fontSizes" },
        "15": { value: 15, type: "fontSizes" }, "16": { value: 16, type: "fontSizes" }, "18": { value: 18, type: "fontSizes" },
        "20": { value: 20, type: "fontSizes" }, "22": { value: 22, type: "fontSizes" }, "26": { value: 26, type: "fontSizes" }, "28": { value: 28, type: "fontSizes" }
      }
    }
  },
  semantic: {
    background: {
      canvas:  { value: "{core.color.paper.canvas}", type: "color" },
      surface: { value: "{core.color.paper.100}",    type: "color" },
      subtle:  { value: "{core.color.paper.200}",    type: "color" },
      filled:  { value: "{core.color.paper.300}",    type: "color" },
      inverse: { value: "{core.color.ink.line}",     type: "color" }
    },
    text: {
      primary:     { value: "{core.color.ink.100}", type: "color" },
      secondary:   { value: "{core.color.ink.200}", type: "color" },
      tertiary:    { value: "{core.color.ink.300}", type: "color" },
      disabled:    { value: "{core.color.ink.400}", type: "color" },
      "on-inverse":{ value: "{core.color.paper.100}", type: "color" }
    },
    border: {
      default: { value: "{core.color.ink.line}",      type: "color" },
      soft:    { value: "{core.color.ink.line-soft}", type: "color" },
      hairline:{ value: "{core.color.ink.300}",       type: "color" },
      faint:   { value: "{core.color.ink.400}",       type: "color" }
    },
    feedback: {
      success: { bg: { value: "{core.color.good.fill}",   type: "color" }, border: { value: "{core.color.good.border}",   type: "color" }, fg: { value: "{core.color.good.ink}",   type: "color" } },
      warning: { bg: { value: "{core.color.warn.fill}",   type: "color" }, border: { value: "{core.color.warn.border}",   type: "color" }, fg: { value: "{core.color.warn.ink}",   type: "color" } },
      error:   { bg: { value: "{core.color.danger.fill}", type: "color" }, border: { value: "{core.color.danger.border}", type: "color" }, fg: { value: "{core.color.danger.ink}", type: "color" } },
      info:    { bg: { value: "{core.color.info.fill}",   type: "color" }, border: { value: "{core.color.info.border}",   type: "color" }, fg: { value: "{core.color.info.ink}",   type: "color" } }
    },
    accent: {
      gold: { bg: { value: "{core.color.gold.fill}", type: "color" }, border: { value: "{core.color.gold.border}", type: "color" }, fg: { value: "{core.color.gold.ink}", type: "color" } },
      note: { bg: { value: "{core.color.note.fill}", type: "color" }, border: { value: "{core.color.note.border}", type: "color" }, fg: { value: "{core.color.note.ink}", type: "color" } }
    }
  }
};

const COLLECTION_NAMES = { core: 'Core', semantic: 'Semantic' };
const TYPE_MAP = {
  color: 'COLOR',
  spacing: 'FLOAT',
  borderRadius: 'FLOAT',
  borderWidth: 'FLOAT',
  sizing: 'FLOAT',
  fontSizes: 'FLOAT',
};

// ---------- helpers ----------
function hexToRgba(hex) {
  if (typeof hex !== 'string') return { r: 0, g: 0, b: 0, a: 1 };
  if (hex.startsWith('rgba')) {
    const m = hex.match(/rgba?\(([^)]+)\)/);
    const [r, g, b, a = '1'] = m[1].split(',').map(s => parseFloat(s.trim()));
    return { r: r/255, g: g/255, b: b/255, a: parseFloat(a) };
  }
  const h = hex.replace('#','');
  return {
    r: parseInt(h.slice(0,2),16)/255,
    g: parseInt(h.slice(2,4),16)/255,
    b: parseInt(h.slice(4,6),16)/255,
    a: 1
  };
}

// Walk Tokens Studio tree, yielding { path: 'color/paper/100', type, value }
function* walkTokens(node, prefix) {
  if (node && typeof node === 'object' && 'value' in node && 'type' in node) {
    if (TYPE_MAP[node.type]) {
      yield { path: prefix.join('/'), type: node.type, value: node.value };
    }
    return;
  }
  if (node && typeof node === 'object') {
    for (const k of Object.keys(node)) {
      yield* walkTokens(node[k], prefix.concat(k));
    }
  }
}

// ---------- variable setup ----------
async function setupVariables() {
  ok('Setting up design tokens as Figma Variables…');
  const existing = await figma.variables.getLocalVariablesAsync();
  if (existing.length > 0) {
    warn(`Found ${existing.length} existing variables. Skipping creation to avoid duplicates.`);
    warn('If you want a clean install, delete them first (Local variables panel → ⋮ → Delete).');
    done();
    return;
  }

  // Pass 1 — create collections + variables with placeholder values
  const collections = {};
  const created = {}; // 'core/color/paper/100' → Variable

  for (const setKey of ['core', 'semantic']) {
    const coll = figma.variables.createVariableCollection(COLLECTION_NAMES[setKey]);
    collections[setKey] = coll;
    let n = 0;
    for (const tok of walkTokens(TOKENS[setKey], [])) {
      const figType = TYPE_MAP[tok.type];
      if (!figType) continue;
      const name = `${setKey}/${tok.path}`;
      const v = figma.variables.createVariable(name, coll, figType);
      created[name] = v;
      n++;
    }
    ok(`  ✓ Collection "${COLLECTION_NAMES[setKey]}" — ${n} variables created`);
  }

  // Pass 2 — set values (resolving aliases)
  for (const setKey of ['core', 'semantic']) {
    const coll = collections[setKey];
    const modeId = coll.modes[0].modeId;
    for (const tok of walkTokens(TOKENS[setKey], [])) {
      const figType = TYPE_MAP[tok.type];
      if (!figType) continue;
      const name = `${setKey}/${tok.path}`;
      const v = created[name];
      let value;
      if (typeof tok.value === 'string' && tok.value.startsWith('{') && tok.value.endsWith('}')) {
        const ref = tok.value.slice(1, -1).replace(/\./g, '/');
        const refVar = created[ref];
        if (!refVar) { err(`  ✗ alias not found: ${ref}`); continue; }
        value = { type: 'VARIABLE_ALIAS', id: refVar.id };
      } else if (figType === 'COLOR') {
        value = hexToRgba(tok.value);
      } else if (figType === 'FLOAT') {
        value = parseFloat(tok.value);
      } else {
        value = String(tok.value);
      }
      v.setValueForMode(modeId, value);
    }
  }

  ok('✓ Variables ready. You can now build the splash screen.');
  done();
}

// ---------- variable lookup (for builders) ----------
let _allVars = null;
async function getVar(name) {
  if (!_allVars) _allVars = await figma.variables.getLocalVariablesAsync();
  const v = _allVars.find((x) => x.name === name);
  if (!v) throw new Error(`Variable not found: "${name}". Run "Setup variables" first.`);
  return v;
}

async function solidVar(varName) {
  const v = await getVar(varName);
  const paint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
  return figma.variables.setBoundVariableForPaint(paint, 'color', v);
}

// ---------- font loader ----------
async function loadFonts() {
  await Promise.all([
    figma.loadFontAsync({ family: 'Patrick Hand',   style: 'Regular' }),
    figma.loadFontAsync({ family: 'Caveat',         style: 'Regular' }).catch(() => {}),
    figma.loadFontAsync({ family: 'Caveat',         style: 'Bold'    }).catch(() => {}),
    figma.loadFontAsync({ family: 'JetBrains Mono', style: 'Regular' }),
  ]);
}

// ---------- screen builders ----------
async function makePhoneShell() {
  const phone = figma.createFrame();
  phone.name = 'Phone';
  phone.resize(340, 700);
  phone.cornerRadius = 30;
  phone.fills = [await solidVar('semantic/background/surface')];
  phone.strokes = [await solidVar('semantic/border/default')];
  phone.strokeWeight = 2;
  phone.clipsContent = true;
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

async function buildSplash() {
  ok('Loading fonts…');
  await loadFonts();
  ok('Building S-01 Splash…');
  _allVars = null;

  const phone = await makePhoneShell();

  // Notch
  const notch = figma.createRectangle();
  notch.name = 'notch';
  notch.resize(90, 14);
  notch.cornerRadius = 8;
  notch.fills = [await solidVar('semantic/background/inverse')];
  notch.x = (340 - 90) / 2;
  notch.y = 8;
  phone.appendChild(notch);

  // Status bar
  const bar = figma.createFrame();
  bar.name = 'status-bar';
  bar.layoutMode = 'HORIZONTAL';
  bar.primaryAxisAlignItems = 'SPACE_BETWEEN';
  bar.counterAxisAlignItems = 'CENTER';
  bar.paddingLeft = 18; bar.paddingRight = 18;
  bar.fills = [];
  bar.resize(340, 14);
  bar.primaryAxisSizingMode = 'FIXED';
  bar.counterAxisSizingMode = 'FIXED';
  bar.x = 0; bar.y = 8;

  const tLeft = figma.createText();
  tLeft.fontName = { family: 'JetBrains Mono', style: 'Regular' };
  tLeft.fontSize = 9;
  tLeft.characters = '10:24';
  tLeft.fills = [await solidVar('semantic/text/secondary')];

  const tRight = figma.createText();
  tRight.fontName = { family: 'JetBrains Mono', style: 'Regular' };
  tRight.fontSize = 9;
  tRight.characters = '5G  •••  87%';
  tRight.fills = [await solidVar('semantic/text/secondary')];

  bar.appendChild(tLeft);
  bar.appendChild(tRight);
  phone.appendChild(bar);

  // Center stack
  const center = figma.createFrame();
  center.name = 'center-stack';
  center.layoutMode = 'VERTICAL';
  center.primaryAxisAlignItems = 'CENTER';
  center.counterAxisAlignItems = 'CENTER';
  center.itemSpacing = 16;
  center.paddingLeft = 24; center.paddingRight = 24;
  center.paddingTop = 24;  center.paddingBottom = 24;
  center.primaryAxisSizingMode = 'AUTO';
  center.counterAxisSizingMode = 'AUTO';
  center.fills = [];

  // Logo square
  const logo = figma.createFrame();
  logo.name = 'logo';
  logo.resize(64, 64);
  logo.cornerRadius = 14;
  logo.fills = [await solidVar('semantic/background/surface')];
  logo.strokes = [await solidVar('semantic/border/default')];
  logo.strokeWeight = 2;
  logo.layoutMode = 'VERTICAL';
  logo.primaryAxisAlignItems = 'CENTER';
  logo.counterAxisAlignItems = 'CENTER';
  logo.primaryAxisSizingMode = 'FIXED';
  logo.counterAxisSizingMode = 'FIXED';
  const c = figma.createText();
  c.fontName = { family: 'Patrick Hand', style: 'Regular' };
  c.fontSize = 28;
  c.characters = 'C';
  c.fills = [await solidVar('semantic/text/primary')];
  logo.appendChild(c);

  // Title
  const title = figma.createText();
  title.fontName = { family: 'Patrick Hand', style: 'Regular' };
  title.fontSize = 22;
  title.characters = 'Centricity';
  title.fills = [await solidVar('semantic/text/primary')];

  // Sub
  const sub = figma.createText();
  sub.fontName = { family: 'Patrick Hand', style: 'Regular' };
  sub.fontSize = 11.5;
  sub.characters = 'Wealth, for Indians abroad.';
  sub.fills = [await solidVar('semantic/text/secondary')];

  // Spacer
  const spacer = figma.createFrame();
  spacer.name = 'spacer';
  spacer.resize(1, 24);
  spacer.fills = [];

  // Loading
  const loading = figma.createText();
  loading.fontName = { family: 'JetBrains Mono', style: 'Regular' };
  loading.fontSize = 9.5;
  loading.characters = 'loading...';
  loading.opacity = 0.5;
  loading.fills = [await solidVar('semantic/text/secondary')];

  center.appendChild(logo);
  center.appendChild(title);
  center.appendChild(sub);
  center.appendChild(spacer);
  center.appendChild(loading);

  phone.appendChild(center);
  center.x = (340 - center.width) / 2;
  center.y = 30 + (670 - center.height) / 2;

  // Home indicator
  const home = figma.createRectangle();
  home.name = 'home-indicator';
  home.resize(100, 4);
  home.cornerRadius = 2;
  home.fills = [await solidVar('semantic/text/tertiary')];
  home.x = (340 - 100) / 2;
  home.y = 700 - 10;
  phone.appendChild(home);

  // Place near viewport center
  const cx = figma.viewport.center.x;
  const cy = figma.viewport.center.y;
  phone.x = cx - 170;
  phone.y = cy - 350;
  figma.currentPage.appendChild(phone);

  // Caption
  const cap = figma.createFrame();
  cap.name = 'cap · S-01';
  cap.layoutMode = 'VERTICAL';
  cap.itemSpacing = 2;
  cap.fills = [];
  cap.primaryAxisSizingMode = 'AUTO';
  cap.counterAxisSizingMode = 'AUTO';

  const capId = figma.createText();
  capId.fontName = { family: 'JetBrains Mono', style: 'Regular' };
  capId.fontSize = 9.5;
  capId.characters = 'S-01';
  capId.fills = [await solidVar('semantic/text/tertiary')];

  const capT = figma.createText();
  capT.fontName = { family: 'Patrick Hand', style: 'Regular' };
  capT.fontSize = 15;
  capT.characters = 'Splash';
  capT.fills = [await solidVar('semantic/text/primary')];

  const capS = figma.createText();
  capS.fontName = { family: 'Patrick Hand', style: 'Regular' };
  capS.fontSize = 12;
  capS.characters = 'cold-open · loading';
  capS.fills = [await solidVar('semantic/text/secondary')];

  cap.appendChild(capId);
  cap.appendChild(capT);
  cap.appendChild(capS);
  figma.currentPage.appendChild(cap);
  cap.x = phone.x;
  cap.y = phone.y + 700 + 12;

  ok('✓ S-01 placed.');
  figma.viewport.scrollAndZoomIntoView([phone, cap]);
  done();
}

// ---------- dispatcher ----------
figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === 'setup-variables') return await setupVariables();
    if (msg.type === 'build' && msg.screen === 'S-01') return await buildSplash();
    if (msg.type === 'build') {
      warn(`"${msg.screen}" not yet implemented — only S-01 is in this first cut.`);
      warn('Approve S-01 against screenshots/S-01.png; then I extend the plugin to S-02…O-13.');
      return done();
    }
  } catch (e) {
    err('ERROR: ' + (e && e.message ? e.message : String(e)));
    if (e && e.stack) err(String(e.stack).split('\n').slice(0, 5).join('\n'));
    done();
  }
};
