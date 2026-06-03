// Centricity NRI · Onboarding Builder (Figma Plugin API)
// Self-contained: creates design tokens (Variables) AND builds all 18 onboarding frames.

figma.showUI(__html__, { width: 360, height: 640 });

// ---------- logging ----------
const log  = (text, level) => figma.ui.postMessage({ type: 'log', text, level });
const ok   = (t) => log(t, 'ok');
const warn = (t) => log(t, 'warn');
const err  = (t) => log(t, 'err');
const done = ()  => figma.ui.postMessage({ type: 'done' });

// ====================================================================
//  EMBEDDED DESIGN TOKENS  (mirrors design/tokens/tokens.json — primitives only)
// ====================================================================
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
      "input-h": { value: 40, type: "sizing" }, "input-lg-h": { value: 60, type: "sizing" },
      "btn-h": { value: 44, type: "sizing" }, "btn-sm-h": { value: 32, type: "sizing" },
      "row-min-h": { value: 44, type: "sizing" }, "otp-cell-h": { value: 36, type: "sizing" },
      avatar: { value: 26, type: "sizing" }
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
const TYPE_MAP = { color: 'COLOR', spacing: 'FLOAT', borderRadius: 'FLOAT', borderWidth: 'FLOAT', sizing: 'FLOAT' };

// ====================================================================
//  VARIABLE SETUP
// ====================================================================
function hexToRgba(hex) {
  if (typeof hex !== 'string') return { r: 0, g: 0, b: 0, a: 1 };
  if (hex.startsWith('rgba')) {
    const m = hex.match(/rgba?\(([^)]+)\)/);
    const [r, g, b, a = '1'] = m[1].split(',').map(s => parseFloat(s.trim()));
    return { r: r/255, g: g/255, b: b/255, a: parseFloat(a) };
  }
  const h = hex.replace('#','');
  return { r: parseInt(h.slice(0,2),16)/255, g: parseInt(h.slice(2,4),16)/255, b: parseInt(h.slice(4,6),16)/255, a: 1 };
}

function* walkTokens(node, prefix) {
  if (node && typeof node === 'object' && 'value' in node && 'type' in node) {
    if (TYPE_MAP[node.type]) yield { path: prefix.join('/'), type: node.type, value: node.value };
    return;
  }
  if (node && typeof node === 'object') {
    for (const k of Object.keys(node)) yield* walkTokens(node[k], prefix.concat(k));
  }
}

async function setupVariables() {
  ok('Setting up design tokens as Figma Variables…');
  const existing = await figma.variables.getLocalVariablesAsync();
  if (existing.length > 0) {
    warn(`Found ${existing.length} existing variables. Skipping creation to avoid duplicates.`);
    warn('To start fresh: open Local variables panel → select all → Delete → re-run.');
    done(); return;
  }
  const collections = {}, created = {};
  for (const setKey of ['core', 'semantic']) {
    const coll = figma.variables.createVariableCollection(COLLECTION_NAMES[setKey]);
    collections[setKey] = coll;
    let n = 0;
    for (const tok of walkTokens(TOKENS[setKey], [])) {
      const v = figma.variables.createVariable(`${setKey}/${tok.path}`, coll, TYPE_MAP[tok.type]);
      created[`${setKey}/${tok.path}`] = v;
      n++;
    }
    ok(`  ✓ Collection "${COLLECTION_NAMES[setKey]}" — ${n} variables created`);
  }
  for (const setKey of ['core', 'semantic']) {
    const coll = collections[setKey];
    const modeId = coll.modes[0].modeId;
    for (const tok of walkTokens(TOKENS[setKey], [])) {
      const name = `${setKey}/${tok.path}`;
      const v = created[name];
      let value;
      if (typeof tok.value === 'string' && tok.value.startsWith('{') && tok.value.endsWith('}')) {
        const ref = tok.value.slice(1, -1).replace(/\./g, '/');
        const refVar = created[ref];
        if (!refVar) { err(`  ✗ alias not found: ${ref}`); continue; }
        value = { type: 'VARIABLE_ALIAS', id: refVar.id };
      } else if (TYPE_MAP[tok.type] === 'COLOR') value = hexToRgba(tok.value);
      else value = parseFloat(tok.value);
      v.setValueForMode(modeId, value);
    }
  }
  ok('✓ Variables ready. Now click "Build all" or build a single screen.');
  done();
}

// ====================================================================
//  VARIABLE + FONT HELPERS
// ====================================================================
let _allVars = null;
async function getVar(name) {
  if (!_allVars) _allVars = await figma.variables.getLocalVariablesAsync();
  const v = _allVars.find(x => x.name === name);
  if (!v) throw new Error(`Variable not found: "${name}". Run "Setup variables" first.`);
  return v;
}
async function solidVar(name) {
  const v = await getVar(name);
  return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', v);
}

async function loadFonts() {
  await Promise.all([
    figma.loadFontAsync({ family: 'Patrick Hand',   style: 'Regular' }),
    figma.loadFontAsync({ family: 'Caveat',         style: 'Regular' }).catch(() => {}),
    figma.loadFontAsync({ family: 'Caveat',         style: 'Bold'    }).catch(() => {}),
    figma.loadFontAsync({ family: 'JetBrains Mono', style: 'Regular' }),
    figma.loadFontAsync({ family: 'JetBrains Mono', style: 'Bold'    }).catch(() => {}),
  ]);
}

// ====================================================================
//  PRIMITIVES
// ====================================================================
const FF = {
  hand: 'Patrick Hand',
  display: 'Caveat',
  mono: 'JetBrains Mono',
};

async function txt({ family = FF.hand, weight = 'Regular', size = 13, content = '', colorVar = 'semantic/text/primary', opacity = 1, letterSpacing = null, lineHeight = null, autoResize = 'HEIGHT' }) {
  const t = figma.createText();
  try { t.fontName = { family, style: weight }; }
  catch (e) { t.fontName = { family, style: 'Regular' }; }
  t.fontSize = size;
  t.characters = String(content);
  t.fills = [await solidVar(colorVar)];
  if (opacity !== 1) t.opacity = opacity;
  if (letterSpacing != null) t.letterSpacing = letterSpacing;
  if (lineHeight != null) t.lineHeight = lineHeight;
  if (autoResize) t.textAutoResize = autoResize;
  return t;
}

function autoFrame(direction, opts = {}) {
  const f = figma.createFrame();
  f.layoutMode = direction;
  f.itemSpacing = opts.gap || 0;
  f.paddingLeft  = opts.pl != null ? opts.pl : (opts.padX || 0);
  f.paddingRight = opts.pr != null ? opts.pr : (opts.padX || 0);
  f.paddingTop    = opts.pt != null ? opts.pt : (opts.padY || 0);
  f.paddingBottom = opts.pb != null ? opts.pb : (opts.padY || 0);
  f.primaryAxisAlignItems = opts.align || 'MIN';
  f.counterAxisAlignItems = opts.cross || 'MIN';
  f.primaryAxisSizingMode = opts.fixedMain ? 'FIXED' : 'AUTO';
  f.counterAxisSizingMode = opts.fixedCross ? 'FIXED' : 'AUTO';
  f.fills = [];
  if (opts.name) f.name = opts.name;
  return f;
}
const autoV = (opts) => autoFrame('VERTICAL', opts);
const autoH = (opts) => autoFrame('HORIZONTAL', opts);

async function colorFill(varName) { return await solidVar(varName); }
async function colorStroke(node, varName, weight, dashed) {
  node.strokes = [await solidVar(varName)];
  node.strokeWeight = weight;
  node.strokeAlign = 'INSIDE';
  if (dashed) node.dashPattern = [5, 5];
}

// ---- text-style helpers (mirror the typography spec) ----
const T = {
  eyebrow:  (c) => txt({ family: FF.mono,    weight: 'Bold',    size: 8.5,  content: c, colorVar: 'semantic/text/tertiary', letterSpacing: { value: 14, unit: 'PERCENT' } }),
  meta:     (c, col='semantic/text/secondary') => txt({ family: FF.mono, size: 9.5, content: c, colorVar: col }),
  status:   (c) => txt({ family: FF.mono,    size: 9,    content: c, colorVar: 'semantic/text/secondary' }),
  help:     (c, col='semantic/text/secondary') => txt({ family: FF.hand, size: 11.5, content: c, colorVar: col }),
  label:    (c, col='semantic/text/primary') => txt({ family: FF.hand, size: 13, content: c, colorVar: col }),
  h:        (c) => txt({ family: FF.hand,    size: 18,   content: c, colorVar: 'semantic/text/primary' }),
  h2:       (c) => txt({ family: FF.hand,    size: 15,   content: c, colorVar: 'semantic/text/primary' }),
  hHero:    (c) => txt({ family: FF.hand,    size: 22,   content: c, colorVar: 'semantic/text/primary' }),
  topbar:   (c) => txt({ family: FF.hand,    size: 16,   content: c, colorVar: 'semantic/text/primary' }),
  btn:      (c, col='semantic/text/primary') => txt({ family: FF.hand, size: 14, content: c, colorVar: col }),
  btnSm:    (c, col='semantic/text/primary') => txt({ family: FF.hand, size: 12, content: c, colorVar: col }),
  chip:     (c, col='semantic/text/primary') => txt({ family: FF.hand, size: 11, content: c, colorVar: col }),
  numXL:    (c, col='semantic/text/primary') => txt({ family: FF.mono, weight: 'Bold', size: 26, content: c, colorVar: col, letterSpacing: { value: -2, unit: 'PERCENT' } }),
  numL:     (c, col='semantic/text/primary') => txt({ family: FF.mono, weight: 'Bold', size: 20, content: c, colorVar: col, letterSpacing: { value: -2, unit: 'PERCENT' } }),
};

// ====================================================================
//  COMPONENT BUILDERS
// ====================================================================

async function buildPhoneShell() {
  const phone = figma.createFrame();
  phone.name = 'Phone';
  phone.resize(340, 700);
  phone.cornerRadius = 30;
  phone.fills = [await colorFill('semantic/background/surface')];
  await colorStroke(phone, 'semantic/border/default', 2);
  phone.clipsContent = true;
  phone.effects = [{ type: 'DROP_SHADOW', color: { r: 0x2A/255, g: 0x2C/255, b: 0x32/255, a: 1 }, offset: { x: 3, y: 3 }, radius: 0, spread: 0, visible: true, blendMode: 'NORMAL', showShadowBehindNode: false }];
  return phone;
}

async function buildPhoneChrome(phone, { hideHome = false } = {}) {
  // Notch
  const n = figma.createRectangle();
  n.name = 'notch'; n.resize(90, 14); n.cornerRadius = 8;
  n.fills = [await colorFill('semantic/background/inverse')];
  n.x = (340 - 90) / 2; n.y = 8;
  phone.appendChild(n);

  // Status bar
  const bar = autoH({ name: 'status-bar', pl: 18, pr: 18, align: 'SPACE_BETWEEN', cross: 'CENTER', fixedMain: true, fixedCross: true });
  bar.resize(340, 14);
  bar.x = 0; bar.y = 8;
  phone.appendChild(bar);
  bar.appendChild(await T.status('10:24'));
  bar.appendChild(await T.status('5G  •••  87%'));

  if (!hideHome) {
    const h = figma.createRectangle();
    h.name = 'home-indicator'; h.resize(100, 4); h.cornerRadius = 2;
    h.fills = [await colorFill('semantic/text/tertiary')];
    h.x = (340 - 100) / 2; h.y = 690;
    phone.appendChild(h);
  }
}

async function buildTopBar({ back = false, title = '', right = null }) {
  const bar = autoH({ name: 'TopBar', pl: 16, pr: 16, pt: 14, pb: 10, align: 'SPACE_BETWEEN', cross: 'CENTER', gap: 8, fixedMain: true });
  bar.resize(340, 48);
  bar.primaryAxisSizingMode = 'FIXED';
  bar.counterAxisSizingMode = 'AUTO';
  bar.fills = [await colorFill('semantic/background/surface')];
  bar.strokes = [await solidVar('semantic/border/hairline')];
  bar.strokeWeight = 1.5;
  bar.strokeAlign = 'INSIDE';
  bar.strokeBottomWeight = 1.5;
  bar.strokeTopWeight = 0;
  bar.strokeLeftWeight = 0;
  bar.strokeRightWeight = 0;

  const left = autoH({ name: 'left', gap: 6, cross: 'CENTER' });
  if (back) left.appendChild(await T.label('‹'));
  left.appendChild(await T.topbar(title));
  bar.appendChild(left);

  if (right) bar.appendChild(right);
  else { const sp = figma.createFrame(); sp.fills = []; sp.resize(1, 1); bar.appendChild(sp); }
  return bar;
}

async function buildScroll() {
  const s = autoV({ name: 'Scroll', pl: 14, pr: 14, pt: 12, pb: 12, gap: 10, fixedMain: true, fixedCross: true });
  s.resize(340, 622);
  s.fills = [await colorFill('semantic/background/surface')];
  return s;
}

async function buildStickyCTA(children) {
  const cta = autoH({ name: 'StickyCTA', pl: 14, pr: 14, pt: 10, pb: 20, gap: 8, cross: 'CENTER', fixedMain: true });
  cta.resize(340, 74);
  cta.primaryAxisSizingMode = 'FIXED';
  cta.counterAxisSizingMode = 'AUTO';
  cta.fills = [await colorFill('semantic/background/surface')];
  cta.strokes = [await solidVar('semantic/border/hairline')];
  cta.strokeWeight = 1.5; cta.strokeAlign = 'INSIDE';
  cta.strokeTopWeight = 1.5; cta.strokeBottomWeight = 0; cta.strokeLeftWeight = 0; cta.strokeRightWeight = 0;
  for (const c of children) cta.appendChild(c);
  return cta;
}

// ---- Box ----
const BOX_VARIANTS = {
  default: { bg: 'semantic/background/surface', border: 'semantic/border/default', fg: 'semantic/text/primary' },
  soft:    { bg: 'semantic/background/subtle',  border: 'semantic/border/default', fg: 'semantic/text/primary' },
  filled:  { bg: 'semantic/background/filled',  border: 'semantic/border/default', fg: 'semantic/text/primary' },
  ink:     { bg: 'semantic/background/inverse', border: 'semantic/background/inverse', fg: 'semantic/text/on-inverse' },
  gold:    { bg: 'semantic/accent/gold/bg',     border: 'semantic/accent/gold/border', fg: 'semantic/accent/gold/fg' },
  warn:    { bg: 'semantic/feedback/warning/bg', border: 'semantic/feedback/warning/border', fg: 'semantic/feedback/warning/fg' },
  danger:  { bg: 'semantic/feedback/error/bg',   border: 'semantic/feedback/error/border',   fg: 'semantic/feedback/error/fg' },
  good:    { bg: 'semantic/feedback/success/bg', border: 'semantic/feedback/success/border', fg: 'semantic/feedback/success/fg' },
  info:    { bg: 'semantic/feedback/info/bg',    border: 'semantic/feedback/info/border',    fg: 'semantic/feedback/info/fg' },
};

async function buildBox({ variant = 'default', dashed = false, children = [], gap = 6, padX = 12, padY = 10 } = {}) {
  const v = BOX_VARIANTS[variant] || BOX_VARIANTS.default;
  const box = autoV({ name: `Box · ${variant}`, padX, padY, gap });
  box.cornerRadius = 10;
  box.fills = [await colorFill(v.bg)];
  await colorStroke(box, v.border, 1.5, dashed);
  for (const c of children) {
    box.appendChild(c);
    if (c.type === 'TEXT' || c.type === 'FRAME') {
      try { c.layoutSizingHorizontal = 'FILL'; } catch (e) {}
    }
  }
  return box;
}

// ---- Button ----
const BTN_VARIANTS = {
  default: { bg: 'semantic/background/surface', fg: 'semantic/text/primary',    border: 'semantic/border/default' },
  primary: { bg: 'semantic/background/inverse', fg: 'semantic/text/on-inverse', border: 'semantic/background/inverse' },
  gold:    { bg: 'semantic/accent/gold/bg',     fg: 'semantic/accent/gold/fg',  border: 'semantic/accent/gold/border' },
  ghost:   { bg: null,                          fg: 'semantic/text/secondary',  border: 'semantic/border/hairline' },
};

async function buildBtn({ variant = 'default', size = 'md', full = false, label = '', leading = null, trailing = null } = {}) {
  const v = BTN_VARIANTS[variant] || BTN_VARIANTS.default;
  const isSm = size === 'sm';
  const btn = autoH({ name: `Btn · ${variant}`, padX: isSm ? 12 : 16, gap: 6, align: 'CENTER', cross: 'CENTER', fixedCross: true });
  btn.resize(0, isSm ? 32 : 44);
  btn.counterAxisSizingMode = 'FIXED';
  btn.primaryAxisSizingMode = 'AUTO';
  btn.cornerRadius = isSm ? 8 : 10;
  if (v.bg) btn.fills = [await colorFill(v.bg)]; else btn.fills = [];
  await colorStroke(btn, v.border, 1.5);
  if (leading) btn.appendChild(leading);
  btn.appendChild(await (isSm ? T.btnSm : T.btn)(label, v.fg));
  if (trailing) btn.appendChild(trailing);
  if (full) {
    btn.primaryAxisSizingMode = 'FIXED';
    btn.layoutAlign = 'STRETCH';
  }
  return btn;
}

// ---- Input ----
async function buildInput({ value = '', trailing = null, state = 'default' } = {}) {
  const v = state === 'error' ? { bg: 'semantic/feedback/error/bg', border: 'semantic/feedback/error/border', fg: 'semantic/feedback/error/fg' }
                              : { bg: 'semantic/background/surface', border: 'semantic/border/default', fg: 'semantic/text/secondary' };
  const inp = autoH({ name: 'Input', padX: 12, gap: 6, align: 'SPACE_BETWEEN', cross: 'CENTER', fixedCross: true });
  inp.resize(0, 40);
  inp.counterAxisSizingMode = 'FIXED';
  inp.cornerRadius = 8;
  inp.fills = [await colorFill(v.bg)];
  await colorStroke(inp, v.border, 1.5);
  inp.appendChild(await T.label(value, v.fg));
  if (trailing) inp.appendChild(await T.label(trailing, v.fg));
  return inp;
}

// ---- OTP Input ----
async function buildOTP({ filled = 0, error = false } = {}) {
  const wrap = autoH({ name: 'OTP', gap: 6 });
  for (let i = 0; i < 6; i++) {
    const cell = autoV({ name: `cell-${i}`, align: 'CENTER', cross: 'CENTER', fixedMain: true, fixedCross: true });
    cell.resize(46, 36);
    cell.cornerRadius = 6;
    cell.fills = [await colorFill(error ? 'semantic/feedback/error/bg' : 'semantic/background/surface')];
    await colorStroke(cell, error ? 'semantic/feedback/error/border' : 'semantic/border/default', 1.5);
    if (i < filled) {
      const d = await txt({ family: FF.mono, weight: 'Bold', size: 16, content: String((i + 3) % 10), colorVar: 'semantic/text/primary' });
      cell.appendChild(d);
    }
    wrap.appendChild(cell);
  }
  return wrap;
}

// ---- Chip ----
const CHIP_VARIANTS = {
  default: { bg: 'semantic/background/surface', fg: 'semantic/text/primary', border: 'semantic/border/default' },
  gold:    { bg: 'semantic/accent/gold/bg',     fg: 'semantic/accent/gold/fg', border: 'semantic/accent/gold/border' },
  good:    { bg: 'semantic/feedback/success/bg',fg: 'semantic/feedback/success/fg',border: 'semantic/feedback/success/border' },
  warn:    { bg: 'semantic/feedback/warning/bg',fg: 'semantic/feedback/warning/fg',border: 'semantic/feedback/warning/border' },
  danger:  { bg: 'semantic/feedback/error/bg',  fg: 'semantic/feedback/error/fg',  border: 'semantic/feedback/error/border' },
  ink:     { bg: 'semantic/background/inverse', fg: 'semantic/text/on-inverse',    border: 'semantic/background/inverse' },
};

async function buildChip({ variant = 'default', dashed = false, label = '' } = {}) {
  const v = CHIP_VARIANTS[variant] || CHIP_VARIANTS.default;
  const c = autoH({ name: `Chip · ${variant}`, padX: 10, padY: 4, gap: 4, align: 'CENTER', cross: 'CENTER' });
  c.cornerRadius = 999;
  c.fills = [await colorFill(v.bg)];
  await colorStroke(c, v.border, 1.3, dashed);
  c.appendChild(await T.chip(label, v.fg));
  return c;
}

async function buildChipRow(chips) {
  const row = autoH({ name: 'ChipRow', gap: 6 });
  row.layoutWrap = 'WRAP';
  row.counterAxisSpacing = 6;
  for (const c of chips) row.appendChild(c);
  return row;
}

// ---- Row ----
async function buildRow({ avatar = null, left = '', leftSub = null, right = null, rightSub = null, selected = false } = {}) {
  const row = autoH({ name: 'Row', padX: 10, padY: 9, gap: 8, align: 'SPACE_BETWEEN', cross: 'CENTER' });
  row.cornerRadius = 8;
  row.fills = [await colorFill(selected ? 'semantic/background/subtle' : 'semantic/background/surface')];
  await colorStroke(row, 'semantic/border/default', selected ? 2 : 1.5);
  row.minHeight = 44;

  const leftStack = autoH({ name: 'left', gap: 8, cross: 'CENTER' });
  if (avatar) {
    const a = figma.createRectangle();
    a.resize(26, 26);
    a.cornerRadius = avatar === '●' ? 999 : 6;
    a.fills = [await colorFill('semantic/background/subtle')];
    await colorStroke(a, 'semantic/border/default', 1.3);
    leftStack.appendChild(a);
    if (typeof avatar === 'string' && avatar !== '●') {
      // we can't put text inside the rect easily; use a separate text node aligned to it
      // skip for plugin simplicity — the rect represents the avatar slot
    }
  }
  const txtStack = autoV({ name: 'txt', gap: 2 });
  txtStack.appendChild(await T.label(left));
  if (leftSub) txtStack.appendChild(await T.meta(leftSub));
  leftStack.appendChild(txtStack);
  row.appendChild(leftStack);

  if (right) {
    const rightStack = autoV({ name: 'right', gap: 2, cross: 'MAX' });
    if (typeof right === 'string') rightStack.appendChild(await T.label(right));
    else rightStack.appendChild(right);
    if (rightSub) rightStack.appendChild(await T.meta(rightSub));
    row.appendChild(rightStack);
  }
  return row;
}

// ---- Segmented ----
async function buildSegmented({ options = [], active = '' } = {}) {
  const seg = autoH({ name: 'Segmented' });
  seg.cornerRadius = 8;
  seg.fills = [await colorFill('semantic/background/surface')];
  await colorStroke(seg, 'semantic/border/default', 1.5);
  seg.clipsContent = true;
  for (let i = 0; i < options.length; i++) {
    const opt = options[i];
    const isActive = opt === active;
    const cell = autoV({ name: `seg-${i}`, padX: 4, padY: 7, align: 'CENTER', cross: 'CENTER' });
    cell.fills = [await colorFill(isActive ? 'semantic/background/inverse' : 'semantic/background/surface')];
    cell.appendChild(await T.chip(opt, isActive ? 'semantic/text/on-inverse' : 'semantic/text/secondary'));
    seg.appendChild(cell);
    cell.layoutGrow = 1;
    try { cell.layoutSizingHorizontal = 'FILL'; } catch (e) {}
  }
  return seg;
}

// ---- Toggle (pill segmented) ----
async function buildToggle({ options = [], active = '' } = {}) {
  const t = autoH({ name: 'Toggle' });
  t.cornerRadius = 999;
  t.fills = [await colorFill('semantic/background/subtle')];
  await colorStroke(t, 'semantic/border/default', 1.5);
  t.clipsContent = true;
  for (const opt of options) {
    const isA = opt === active;
    const cell = autoV({ name: opt, padX: 10, padY: 5, align: 'CENTER', cross: 'CENTER' });
    if (isA) cell.fills = [await colorFill('semantic/background/inverse')];
    else cell.fills = [];
    cell.appendChild(await T.chip(opt, isA ? 'semantic/text/on-inverse' : 'semantic/text/secondary'));
    t.appendChild(cell);
  }
  return t;
}

// ---- Progress ----
async function buildProgress({ value = 50 } = {}) {
  const wrap = autoH({ name: 'Progress', fixedCross: true });
  wrap.resize(0, 6);
  wrap.cornerRadius = 999;
  wrap.fills = [await colorFill('semantic/background/subtle')];
  await colorStroke(wrap, 'semantic/border/hairline', 1.2);
  wrap.clipsContent = true;

  const fill = figma.createRectangle();
  fill.resize(Math.max(1, value), 6);
  fill.fills = [await colorFill('semantic/background/inverse')];
  wrap.appendChild(fill);
  fill.constraints = { horizontal: 'MIN', vertical: 'STRETCH' };
  return wrap;
}

// ---- Image placeholder ----
async function buildImg({ label = '', height = 200, dark = false } = {}) {
  const img = autoV({ name: 'Img', align: 'CENTER', cross: 'CENTER', fixedCross: true });
  img.resize(0, height);
  img.cornerRadius = 8;
  img.fills = [await colorFill(dark ? 'semantic/background/inverse' : 'semantic/background/subtle')];
  await colorStroke(img, 'semantic/border/default', 1.5);
  if (label) img.appendChild(await T.meta(label, dark ? 'semantic/text/on-inverse' : 'semantic/text/tertiary'));
  return img;
}

// ---- Spread row (k/v with dashed bottom) ----
async function buildSpread(k, v, dashedBottom = true) {
  const r = autoH({ name: 'Spread', pt: 4, pb: 5, align: 'SPACE_BETWEEN', cross: 'CENTER' });
  if (dashedBottom) {
    r.strokes = [await solidVar('semantic/border/faint')];
    r.strokeWeight = 1; r.strokeAlign = 'INSIDE';
    r.strokeTopWeight = 0; r.strokeBottomWeight = 1; r.strokeLeftWeight = 0; r.strokeRightWeight = 0;
    r.dashPattern = [3, 3];
  } else r.fills = [];
  r.appendChild(await T.meta(k));
  r.appendChild(await txt({ family: FF.hand, size: 12, content: v, colorVar: 'semantic/text/primary' }));
  return r;
}

// ---- KV ROW (label : value, no border) ----
async function buildKV(label, value) {
  const r = autoH({ align: 'SPACE_BETWEEN', cross: 'CENTER' });
  r.appendChild(await T.meta(label));
  r.appendChild(await T.label(value));
  return r;
}

// ====================================================================
//  SCREEN COMPOSITION HELPER
// ====================================================================
async function buildScreen(builder) {
  await loadFonts();
  _allVars = null;
  const phone = await buildPhoneShell();
  await buildPhoneChrome(phone);
  await builder(phone);
  return phone;
}

// Adds a Scroll auto-layout area to the phone, positioned right under the topbar
async function addScroll(phone, topbarOpts) {
  const topbar = await buildTopBar(topbarOpts);
  topbar.x = 0; topbar.y = 30;
  phone.appendChild(topbar);

  const scroll = await buildScroll();
  scroll.x = 0;
  scroll.y = 30 + topbar.height;
  scroll.resize(340, 700 - 10 - (30 + topbar.height));
  phone.appendChild(scroll);
  return scroll;
}

async function addStickyCTA(phone, children) {
  const cta = await buildStickyCTA(children);
  cta.x = 0;
  cta.y = 700 - cta.height;
  phone.appendChild(cta);
  return cta;
}

// Add a child to scroll and fill its width
async function pushScroll(scroll, child) {
  scroll.appendChild(child);
  try { child.layoutSizingHorizontal = 'FILL'; } catch (e) {}
  return child;
}

// ====================================================================
//  SCREENS
// ====================================================================

// --- S-01 Splash (already done in v1, keep here) ---
async function S01_Splash() {
  const phone = await buildPhoneShell();
  await buildPhoneChrome(phone);

  const center = autoV({ name: 'center', align: 'CENTER', cross: 'CENTER', padX: 24, padY: 24, gap: 16 });
  const logo = autoV({ name: 'logo', align: 'CENTER', cross: 'CENTER', fixedMain: true, fixedCross: true });
  logo.resize(64, 64);
  logo.cornerRadius = 14;
  logo.fills = [await colorFill('semantic/background/surface')];
  await colorStroke(logo, 'semantic/border/default', 2);
  logo.appendChild(await txt({ family: FF.hand, size: 28, content: 'C' }));

  center.appendChild(logo);
  center.appendChild(await T.hHero('Centricity'));
  center.appendChild(await T.help('Wealth, for Indians abroad.'));
  const sp = figma.createFrame(); sp.fills = []; sp.resize(1, 24); center.appendChild(sp);
  const ld = await T.status('loading...'); ld.opacity = 0.5; center.appendChild(ld);

  phone.appendChild(center);
  center.x = (340 - center.width) / 2;
  center.y = 30 + (670 - center.height) / 2;
  return phone;
}

// --- S-02 Value Prop ---
async function S02_ValueProp() {
  const phone = await buildPhoneShell();
  await buildPhoneChrome(phone);

  const scroll = await buildScroll();
  scroll.x = 0; scroll.y = 30;
  scroll.resize(340, 700 - 10 - 30);
  phone.appendChild(scroll);

  await pushScroll(scroll, await buildImg({ label: 'DTAA / zero-tax illustration', height: 200, dark: true }));
  await pushScroll(scroll, await T.eyebrow('SLIDE 1 OF 3'));
  await pushScroll(scroll, await T.h('Invest. Pay zero tax. Legally.'));
  await pushScroll(scroll, await T.help('UAE & Singapore NRIs claim 0% capital-gains tax via India-DTAA treaty. We do the paperwork.'));

  // carousel dots
  const dots = autoH({ gap: 6, align: 'CENTER', cross: 'CENTER' });
  const d1 = figma.createRectangle(); d1.resize(18, 4); d1.cornerRadius = 2; d1.fills = [await colorFill('semantic/background/inverse')]; dots.appendChild(d1);
  const d2 = figma.createRectangle(); d2.resize(6, 4); d2.cornerRadius = 2; d2.fills = [await colorFill('semantic/text/disabled')]; dots.appendChild(d2);
  const d3 = figma.createRectangle(); d3.resize(6, 4); d3.cornerRadius = 2; d3.fills = [await colorFill('semantic/text/disabled')]; dots.appendChild(d3);
  await pushScroll(scroll, dots);

  await addStickyCTA(phone, [
    await buildBtn({ variant: 'primary', full: true, label: 'Get started' }),
  ]);
  // Note: we want a stacked CTA — wrap two buttons in a V container, then push as one child
  // Easier: build the CTA as a V-stack instead. Implement inline:
  // (we'll override the simpler CTA above; remove and rebuild)
  const oldCTA = phone.children.find(c => c.name === 'StickyCTA');
  if (oldCTA) oldCTA.remove();
  const ctaV = autoV({ name: 'StickyCTA', pl: 14, pr: 14, pt: 10, pb: 20, gap: 8, fixedMain: true });
  ctaV.resize(340, 0);
  ctaV.primaryAxisSizingMode = 'FIXED';
  ctaV.counterAxisSizingMode = 'AUTO';
  ctaV.fills = [await colorFill('semantic/background/surface')];
  ctaV.strokes = [await solidVar('semantic/border/hairline')];
  ctaV.strokeWeight = 1.5; ctaV.strokeAlign = 'INSIDE';
  ctaV.strokeTopWeight = 1.5; ctaV.strokeBottomWeight = 0; ctaV.strokeLeftWeight = 0; ctaV.strokeRightWeight = 0;
  const b1 = await buildBtn({ variant: 'primary', full: true, label: 'Get started' });
  const b2 = await buildBtn({ variant: 'ghost',   full: true, label: 'I already have an account' });
  ctaV.appendChild(b1); ctaV.appendChild(b2);
  try { b1.layoutSizingHorizontal = 'FILL'; b2.layoutSizingHorizontal = 'FILL'; } catch(e) {}
  phone.appendChild(ctaV);
  ctaV.x = 0; ctaV.y = 700 - ctaV.height;
  return phone;
}

// --- S-03 Sign In ---
async function S03_SignIn() {
  const phone = await buildPhoneShell();
  await buildPhoneChrome(phone);
  const scroll = await addScroll(phone, { back: true, title: 'Sign in' });
  await pushScroll(scroll, await T.label('Mobile number'));
  await pushScroll(scroll, await buildInput({ value: '+971 · 50 123 4567' }));
  await pushScroll(scroll, await T.help("We'll send a 6-digit OTP. Standard SMS rates apply."));
  const sp = figma.createFrame(); sp.fills = []; sp.resize(1, 8); await pushScroll(scroll, sp);
  await pushScroll(scroll, await buildBtn({ variant: 'primary', full: true, label: 'Send OTP' }));
  const wrap = autoV({ align: 'CENTER', cross: 'CENTER', pt: 8 });
  wrap.appendChild(await buildChip({ dashed: true, label: 'Use Face ID instead' }));
  await pushScroll(scroll, wrap);
  return phone;
}

// --- O-01 Mobile OTP ---
async function O01_MobileOTP() {
  const phone = await buildPhoneShell(); await buildPhoneChrome(phone);
  const scroll = await addScroll(phone, { back: true, title: 'Verify mobile' });
  await pushScroll(scroll, await T.help('Code sent to +971 50 ••• 4567'));
  await pushScroll(scroll, await buildOTP({ filled: 4 }));
  const row = autoH({ align: 'SPACE_BETWEEN', cross: 'CENTER', gap: 8 });
  row.appendChild(await T.meta('Resend in 0:42'));
  row.appendChild(await buildChip({ dashed: true, label: 'Change number' }));
  await pushScroll(scroll, row);
  await pushScroll(scroll, await buildBox({ variant: 'info', dashed: true, children: [
    await T.meta('Auto-detected: UAE +971 number', 'semantic/feedback/info/fg'),
  ]}));
  await pushScroll(scroll, await buildBtn({ variant: 'primary', full: true, label: 'Verify & continue' }));
  return phone;
}

// --- O-02 Email OTP ---
async function O02_EmailOTP() {
  const phone = await buildPhoneShell(); await buildPhoneChrome(phone);
  const scroll = await addScroll(phone, { back: true, title: 'Verify email' });
  await pushScroll(scroll, await T.label('Email'));
  await pushScroll(scroll, await buildInput({ value: 'rahul.s@gmail.com' }));
  await pushScroll(scroll, await T.help('Code sent. Check inbox + spam.'));
  await pushScroll(scroll, await buildOTP({ filled: 6 }));
  await pushScroll(scroll, await buildBox({ variant: 'good', dashed: true, children: [
    await T.meta('✓ Email verified', 'semantic/feedback/success/fg'),
  ]}));
  await pushScroll(scroll, await buildBtn({ variant: 'primary', full: true, label: 'Continue' }));
  return phone;
}

// --- O-03 Country ---
async function O03_Country() {
  const phone = await buildPhoneShell(); await buildPhoneChrome(phone);
  const scroll = await addScroll(phone, { back: true, title: 'Where do you live?' });
  await pushScroll(scroll, await T.help('Your tax residence — drives DTAA, FATCA, PFIC rules.'));
  const countries = [
    ['🇦🇪 UAE', 'DTAA · 0% gains', 'gold'],
    ['🇸🇬 Singapore', 'DTAA · 0% gains', 'gold'],
    ['🇬🇧 United Kingdom', 'DTAA · FTC available', 'default'],
    ['🇺🇸 United States', 'PFIC disclosure required', 'warn'],
    ['🇨🇦 Canada', 'FAPI disclosure required', 'warn'],
    ['Other', 'Standard NRI flow', 'default'],
  ];
  for (const [name, sub, chipV] of countries) {
    await pushScroll(scroll, await buildRow({
      left: name,
      right: await buildChip({ variant: chipV, label: sub }),
    }));
  }
  return phone;
}

// --- O-04 PFIC ---
async function O04_PFIC() {
  const phone = await buildPhoneShell(); await buildPhoneChrome(phone);
  const scroll = await addScroll(phone, { back: true, title: 'US tax notice' });
  const chipWrap = autoH({ gap: 6 });
  chipWrap.appendChild(await buildChip({ variant: 'warn', label: 'US NRI · mandatory' }));
  await pushScroll(scroll, chipWrap);
  await pushScroll(scroll, await T.h('PFIC disclosure'));
  await pushScroll(scroll, await T.help('Indian mutual funds are classified as Passive Foreign Investment Companies under US tax law. This affects how you file Form 8621.'));
  await pushScroll(scroll, await buildBox({ variant: 'warn', children: [
    await T.label('What you should know', 'semantic/feedback/warning/fg'),
    await T.meta('• Annual Form 8621 filing', 'semantic/feedback/warning/fg'),
    await T.meta('• Mark-to-market or QEF election', 'semantic/feedback/warning/fg'),
    await T.meta('• Consult a US tax advisor', 'semantic/feedback/warning/fg'),
  ]}));
  await pushScroll(scroll, await buildBox({ dashed: true, children: [
    await T.label('I understand and acknowledge'),
    await T.meta('☑ Signed · Rahul S · 03 Jun 2026'),
  ]}));
  await addStickyCTA(phone, [await buildBtn({ variant: 'primary', full: true, label: 'Acknowledge & continue' })]);
  return phone;
}

// --- O-05 PAN ---
async function O05_PAN() {
  const phone = await buildPhoneShell(); await buildPhoneChrome(phone);
  const scroll = await addScroll(phone, { back: true, title: 'PAN' });
  await pushScroll(scroll, await T.help('Step 4 of 10 · Onboarding'));
  await pushScroll(scroll, await buildProgress({ value: 124 })); // 40% of ~312
  await pushScroll(scroll, await T.label('Permanent Account Number'));
  await pushScroll(scroll, await buildInput({ value: 'ABCDE 1234 F' }));
  await pushScroll(scroll, await buildBox({ variant: 'info', children: [
    await T.meta('⟳ Verifying with NSDL…', 'semantic/feedback/info/fg'),
  ]}));
  await pushScroll(scroll, await buildBox({ variant: 'good', children: [
    await T.meta('✓ Match · Rahul Sharma · 12 Mar 1985', 'semantic/feedback/success/fg'),
  ]}));
  await pushScroll(scroll, await T.help("We don't store your PAN image. Only the number, encrypted."));
  await addStickyCTA(phone, [await buildBtn({ variant: 'primary', full: true, label: 'Continue' })]);
  return phone;
}

// --- O-06a CKYCR fast ---
async function O06a_CKYCR() {
  const phone = await buildPhoneShell(); await buildPhoneChrome(phone);
  const scroll = await addScroll(phone, { back: true, title: 'Confirm details' });
  await pushScroll(scroll, await buildBox({ variant: 'gold', children: [
    await T.label('CKYCR record found ✓', 'semantic/accent/gold/fg'),
    await T.meta("You're KYC-compliant. Skipping document upload.", 'semantic/accent/gold/fg'),
  ]}));
  await pushScroll(scroll, await T.help('Confirm these details are still correct.'));
  for (const [k, v] of [['Name', 'Rahul Sharma'], ['DOB', '12 Mar 1985'], ['Address', 'Marina, Dubai, UAE'], ['KYC date', '08 Aug 2023']]) {
    await pushScroll(scroll, await buildSpread(k, v));
  }
  const cr = await buildChipRow([
    await buildChip({ dashed: true, label: 'Edit details' }),
    await buildChip({ dashed: true, label: 'Looks correct' }),
  ]);
  await pushScroll(scroll, cr);
  await addStickyCTA(phone, [await buildBtn({ variant: 'primary', full: true, label: 'Confirm & continue' })]);
  return phone;
}

// --- O-08 Passport OCR ---
async function O08_Passport() {
  const phone = await buildPhoneShell(); await buildPhoneChrome(phone);
  const scroll = await addScroll(phone, { back: true, title: 'Passport scan' });
  await pushScroll(scroll, await T.help('Step 5 of 10 · Full KYC path'));
  await pushScroll(scroll, await buildProgress({ value: 155 }));
  await pushScroll(scroll, await buildImg({ label: 'camera viewfinder · passport bio page', height: 200, dark: true }));
  await pushScroll(scroll, await buildChipRow([
    await buildChip({ variant: 'ink', label: 'Front' }),
    await buildChip({ dashed: true, label: 'Back' }),
  ]));
  await pushScroll(scroll, await buildBox({ dashed: true, children: [
    await T.meta('Auto-read: Sharma, Rahul · M · IND · expires 14 Aug 2030'),
  ]}));
  const ctaRow = autoH({ pl: 14, pr: 14, pt: 10, pb: 20, gap: 8, cross: 'CENTER', fixedMain: true });
  ctaRow.resize(340, 0);
  ctaRow.primaryAxisSizingMode = 'FIXED';
  ctaRow.counterAxisSizingMode = 'AUTO';
  ctaRow.fills = [await colorFill('semantic/background/surface')];
  ctaRow.strokes = [await solidVar('semantic/border/hairline')];
  ctaRow.strokeWeight = 1.5; ctaRow.strokeAlign = 'INSIDE';
  ctaRow.strokeTopWeight = 1.5; ctaRow.strokeBottomWeight = 0; ctaRow.strokeLeftWeight = 0; ctaRow.strokeRightWeight = 0;
  ctaRow.name = 'StickyCTA';
  const b1 = await buildBtn({ label: 'Retake' });
  const b2 = await buildBtn({ variant: 'primary', full: true, label: 'Looks good' });
  ctaRow.appendChild(b1); ctaRow.appendChild(b2);
  try { b2.layoutSizingHorizontal = 'FILL'; } catch(e) {}
  phone.appendChild(ctaRow);
  ctaRow.x = 0; ctaRow.y = 700 - ctaRow.height;
  return phone;
}

// --- O-08c Video KYC ---
async function O08c_VideoKYC() {
  const phone = await buildPhoneShell(); await buildPhoneChrome(phone);
  const scroll = await addScroll(phone, { back: true, title: 'Video KYC' });
  await pushScroll(scroll, await T.help('Live, agent-assisted. ~5 minutes. English / Hindi.'));

  const todayChips = await Promise.all(['10:30','11:00','11:30','12:00','14:00','14:30'].map(t =>
    buildChip({ variant: t === '11:30' ? 'ink' : 'default', label: t })));
  await pushScroll(scroll, await buildBox({ children: [
    await T.eyebrow('PICK A SLOT · TODAY'),
    await buildChipRow(todayChips),
  ]}));
  const tomChips = await Promise.all(['09:30','10:00','10:30','11:00'].map(t => buildChip({ label: t })));
  await pushScroll(scroll, await buildBox({ children: [
    await T.eyebrow('TOMORROW'),
    await buildChipRow(tomChips),
  ]}));
  await pushScroll(scroll, await buildBox({ variant: 'info', dashed: true, children: [
    await T.meta('Times shown in IST (Asia/Kolkata). Your timezone: Asia/Dubai · –2:30h.', 'semantic/feedback/info/fg'),
  ]}));
  await addStickyCTA(phone, [await buildBtn({ variant: 'primary', full: true, label: 'Confirm 11:30 IST' })]);
  return phone;
}

// --- O-09a Bank form ---
async function O09a_BankForm() {
  const phone = await buildPhoneShell(); await buildPhoneChrome(phone);
  const scroll = await addScroll(phone, { back: true, title: 'Link bank account' });
  await pushScroll(scroll, await T.help('Step 6 of 10'));
  await pushScroll(scroll, await buildProgress({ value: 186 }));
  await pushScroll(scroll, await T.label('Account type'));
  await pushScroll(scroll, await buildSegmented({ options: ['NRE (Repatriable)', 'NRO (Non-Repat)'], active: 'NRE (Repatriable)' }));
  await pushScroll(scroll, await T.help('NRE — for foreign earnings, fully repatriable. NRO — for India income, capped repatriation (USD 1M/yr).'));
  await pushScroll(scroll, await T.label('Bank'));
  await pushScroll(scroll, await buildInput({ value: 'HDFC Bank', trailing: '▾' }));
  await pushScroll(scroll, await T.label('Account number'));
  await pushScroll(scroll, await buildInput({ value: '•••• •••• 4521' }));
  await pushScroll(scroll, await T.label('IFSC'));
  await pushScroll(scroll, await buildInput({ value: 'HDFC0001234' }));
  await pushScroll(scroll, await buildBox({ variant: 'info', dashed: true, children: [
    await T.meta("We'll send ₹1 to verify · refunded instantly", 'semantic/feedback/info/fg'),
  ]}));
  await addStickyCTA(phone, [await buildBtn({ variant: 'primary', full: true, label: 'Verify account' })]);
  return phone;
}

// --- O-09b Bank verifying ---
async function O09b_BankVerifying() {
  const phone = await buildPhoneShell(); await buildPhoneChrome(phone);
  const scroll = await addScroll(phone, { back: true, title: 'Link bank account' });
  scroll.primaryAxisAlignItems = 'CENTER';
  scroll.counterAxisAlignItems = 'CENTER';
  // dashed ring
  const ring = figma.createEllipse();
  ring.resize(56, 56);
  ring.fills = [];
  ring.strokes = [await solidVar('semantic/border/default')];
  ring.strokeWeight = 2.5;
  ring.dashPattern = [5, 5];
  await pushScroll(scroll, ring);
  await pushScroll(scroll, await T.h('Verifying...'));
  await pushScroll(scroll, await T.help('Sending ₹1 to HDFC NRE ••••4521.\nUsually 10–30 seconds.'));
  return phone;
}

// --- O-09c Bank verified ---
async function O09c_BankVerified() {
  const phone = await buildPhoneShell(); await buildPhoneChrome(phone);
  const scroll = await addScroll(phone, { back: true, title: 'Link bank account' });
  await pushScroll(scroll, await buildBox({ variant: 'good', children: [
    await T.label('✓ HDFC NRE ••••4521 verified', 'semantic/feedback/success/fg'),
    await T.meta('Penny credit successful · marked as primary', 'semantic/feedback/success/fg'),
  ]}));
  await pushScroll(scroll, await buildBox({ dashed: true, children: [
    await (async () => {
      const r = autoH({ align: 'SPACE_BETWEEN', cross: 'CENTER' });
      r.appendChild(await T.label('+ Add NRO account'));
      r.appendChild(await T.meta('optional'));
      return r;
    })(),
    await T.help('Useful for redemptions on India-sourced funds.'),
  ]}));
  await addStickyCTA(phone, [await buildBtn({ variant: 'primary', full: true, label: 'Continue' })]);
  return phone;
}

// --- O-10 Risk Profile ---
async function O10_Risk() {
  const phone = await buildPhoneShell(); await buildPhoneChrome(phone);
  const scroll = await addScroll(phone, { back: true, title: 'Risk profile' });
  await pushScroll(scroll, await T.help('Question 3 of 5'));
  await pushScroll(scroll, await buildProgress({ value: 186 }));
  await pushScroll(scroll, await T.h('If your portfolio dropped 20% in a month, you would…'));
  for (const [opt, sel] of [
    ['Sell everything to cut losses', false],
    ['Sell some, hold the rest', false],
    ['Hold and wait it out', true],
    ['Buy more at lower prices', false],
  ]) {
    await pushScroll(scroll, await buildRow({ avatar: sel ? '●' : '○', left: opt, selected: sel }));
  }
  await addStickyCTA(phone, [await buildBtn({ variant: 'primary', full: true, label: 'Next' })]);
  return phone;
}

// --- O-11 Nominee ---
async function O11_Nominee() {
  const phone = await buildPhoneShell(); await buildPhoneChrome(phone);
  const scroll = await addScroll(phone, { back: true, title: 'Add nominee' });
  await pushScroll(scroll, await T.help('Optional, but recommended. You can edit anytime.'));
  await pushScroll(scroll, await T.label('Name'));
  await pushScroll(scroll, await buildInput({ value: 'Priya Sharma' }));

  const grid = autoH({ gap: 8 });
  const col1 = autoV({ gap: 4 });
  col1.appendChild(await T.label('Relationship'));
  col1.appendChild(await buildInput({ value: 'Spouse', trailing: '▾' }));
  const col2 = autoV({ gap: 4 });
  col2.appendChild(await T.label('Share'));
  col2.appendChild(await buildInput({ value: '100%', trailing: '%' }));
  grid.appendChild(col1); grid.appendChild(col2);
  try { col1.layoutSizingHorizontal = 'FILL'; col2.layoutSizingHorizontal = 'FILL'; } catch(e){}
  await pushScroll(scroll, grid);

  await pushScroll(scroll, await T.label('DOB'));
  await pushScroll(scroll, await buildInput({ value: '14 Jul 1988' }));
  await pushScroll(scroll, await buildBox({ dashed: true, children: [
    await (async () => {
      const r = autoH({ align: 'SPACE_BETWEEN', cross: 'CENTER' });
      r.appendChild(await T.label('+ Add another nominee'));
      r.appendChild(await T.meta('must sum to 100%'));
      return r;
    })(),
  ]}));
  await pushScroll(scroll, await buildChipRow([await buildChip({ dashed: true, label: 'Set up later' })]));
  await addStickyCTA(phone, [await buildBtn({ variant: 'primary', full: true, label: 'Save & continue' })]);
  return phone;
}

// --- O-12 eSign ---
async function O12_ESign() {
  const phone = await buildPhoneShell(); await buildPhoneChrome(phone);
  const scroll = await addScroll(phone, { back: true, title: 'Review & eSign' });
  await pushScroll(scroll, await T.help('Step 9 of 10 · Almost done'));
  const reviewItems = [
    ['Name', 'Rahul Sharma'],
    ['Tax residency', 'UAE'],
    ['PAN', 'ABCDE••••F'],
    ['Bank', 'HDFC NRE ••••4521'],
    ['Risk profile', 'Moderate'],
    ['Nominee', 'Priya Sharma (100%)'],
  ];
  const children = [];
  for (const [k, v] of reviewItems) children.push(await buildSpread(k, v));
  await pushScroll(scroll, await buildBox({ variant: 'soft', children }));
  await pushScroll(scroll, await buildBox({ dashed: true, children: [
    await T.meta('SEBI brokerage disclosure · AMFI ARN-12345 · Tap to read full T&C'),
  ]}));
  await pushScroll(scroll, await buildBox({ variant: 'info', children: [
    await T.meta('OTP-based eSign · Aadhaar-linked', 'semantic/feedback/info/fg'),
  ]}));
  await addStickyCTA(phone, [await buildBtn({ variant: 'primary', full: true, label: 'eSign with OTP' })]);
  return phone;
}

// --- O-13 Account Active ---
async function O13_AccountActive() {
  const phone = await buildPhoneShell(); await buildPhoneChrome(phone);
  const center = autoV({ name: 'center', align: 'CENTER', cross: 'CENTER', padX: 20, padY: 20, gap: 12 });
  const ring = figma.createEllipse();
  ring.resize(72, 72);
  ring.fills = [await colorFill('semantic/feedback/success/bg')];
  ring.strokes = [await solidVar('semantic/feedback/success/fg')];
  ring.strokeWeight = 3;
  center.appendChild(ring);
  const check = await txt({ family: FF.hand, size: 32, content: '✓', colorVar: 'semantic/feedback/success/fg' });
  // Note: check is placed below ring; would need overlay. Skipping overlay for now.
  center.appendChild(await T.h('Account Active!'));
  center.appendChild(await T.help('Welcome to Centricity, Rahul.\nYour portfolio starts at ₹0.'));

  const goldBox = await buildBox({ variant: 'gold', children: [
    await T.label('Claim your 0% tax', 'semantic/accent/gold/fg'),
    await T.meta('UAE has a DTAA treaty with India. You may save ~₹2.3L this FY.', 'semantic/accent/gold/fg'),
    await buildBtn({ variant: 'gold', size: 'sm', label: 'Activate DTAA →' }),
  ]});
  center.appendChild(goldBox);
  try { goldBox.layoutSizingHorizontal = 'FILL'; } catch(e){}
  center.appendChild(await buildBtn({ variant: 'ghost', full: true, label: 'Maybe later, go to home' }));

  phone.appendChild(center);
  center.resize(312, center.height);
  center.x = 14;
  center.y = 30 + (670 - center.height) / 2;
  return phone;
}

// ====================================================================
//  CAPTION + GRID LAYOUT
// ====================================================================
async function buildCaption(id, title, sub) {
  const cap = autoV({ name: `cap · ${id}`, gap: 2 });
  cap.appendChild(await txt({ family: FF.mono, size: 9.5, content: id, colorVar: 'semantic/text/tertiary', letterSpacing: { value: 8, unit: 'PERCENT' } }));
  cap.appendChild(await txt({ family: FF.hand, size: 15, content: title, colorVar: 'semantic/text/primary' }));
  cap.appendChild(await txt({ family: FF.hand, size: 12, content: sub, colorVar: 'semantic/text/secondary' }));
  return cap;
}

const SCREENS = [
  { id: 'S-01',  title: 'Splash',           sub: 'cold-open · loading',                   fn: S01_Splash },
  { id: 'S-02',  title: 'Value Prop',       sub: 'DTAA carousel · 1 of 3',                fn: S02_ValueProp },
  { id: 'S-03',  title: 'Sign In',          sub: 'phone OTP entry',                       fn: S03_SignIn },
  { id: 'O-01',  title: 'Mobile OTP',       sub: '6-digit · auto-detect country',          fn: O01_MobileOTP },
  { id: 'O-02',  title: 'Email OTP',        sub: '6-digit · verified',                     fn: O02_EmailOTP },
  { id: 'O-03',  title: 'Country',          sub: 'DTAA / PFIC / FAPI routing',             fn: O03_Country },
  { id: 'O-04',  title: 'PFIC Disclosure',  sub: 'US branch · mandatory',                  fn: O04_PFIC },
  { id: 'O-05',  title: 'PAN',              sub: 'verify with NSDL · idle/loading/done',   fn: O05_PAN },
  { id: 'O-06a', title: 'CKYCR fast-track', sub: 'KYC record found · confirm',             fn: O06a_CKYCR },
  { id: 'O-08',  title: 'Passport OCR',     sub: 'full-KYC fallback',                      fn: O08_Passport },
  { id: 'O-08c', title: 'Video KYC',        sub: 'slot picker · IST/UAE tz hint',          fn: O08c_VideoKYC },
  { id: 'O-09a', title: 'Bank · form',      sub: 'NRE/NRO segmented',                      fn: O09a_BankForm },
  { id: 'O-09b', title: 'Bank · verifying', sub: 'penny credit pending',                   fn: O09b_BankVerifying },
  { id: 'O-09c', title: 'Bank · verified',  sub: '+ optional NRO add',                     fn: O09c_BankVerified },
  { id: 'O-10',  title: 'Risk Profile',     sub: 'Q3 of 5 · radio list',                   fn: O10_Risk },
  { id: 'O-11',  title: 'Nominee',          sub: 'optional · multiple allowed',            fn: O11_Nominee },
  { id: 'O-12',  title: 'Review + eSign',   sub: 'Aadhaar OTP eSign',                      fn: O12_ESign },
  { id: 'O-13',  title: 'Account Active',   sub: 'DTAA upsell · go to home',               fn: O13_AccountActive },
];

const COLS = 7;
const FRAME_GAP_X = 48;
const FRAME_GAP_Y = 120; // caption + extra
const ORIGIN_X = -1500;
const ORIGIN_Y = -1200;

async function buildOneScreen(id) {
  const def = SCREENS.find(s => s.id === id);
  if (!def) { err('Unknown screen: ' + id); done(); return; }
  ok('Loading fonts…'); await loadFonts(); _allVars = null;
  ok(`Building ${id} · ${def.title}…`);
  const phone = await def.fn();
  const cap = await buildCaption(def.id, def.title, def.sub);
  const cx = figma.viewport.center.x, cy = figma.viewport.center.y;
  phone.x = cx - 170; phone.y = cy - 350;
  figma.currentPage.appendChild(phone);
  figma.currentPage.appendChild(cap);
  cap.x = phone.x; cap.y = phone.y + 712;
  ok(`✓ ${id} placed.`);
  figma.viewport.scrollAndZoomIntoView([phone, cap]);
  done();
}

async function buildAllScreens() {
  ok('Loading fonts…'); await loadFonts(); _allVars = null;
  // Section frame as parent
  const section = figma.createFrame();
  section.name = 'Flow A · Pre-Auth + Onboarding';
  section.fills = [{ type: 'SOLID', color: hexToRgba('#E9E4D6'), opacity: 1 }];
  section.clipsContent = false;
  section.layoutMode = 'NONE';
  section.resize(COLS * 340 + (COLS - 1) * FRAME_GAP_X + 80, 3 * 700 + 2 * FRAME_GAP_Y + 80);
  section.x = ORIGIN_X; section.y = ORIGIN_Y;
  figma.currentPage.appendChild(section);

  let idx = 0;
  for (const def of SCREENS) {
    const col = idx % COLS;
    const row = Math.floor(idx / COLS);
    ok(`(${idx + 1}/${SCREENS.length}) ${def.id} · ${def.title}`);
    try {
      const phone = await def.fn();
      const cap = await buildCaption(def.id, def.title, def.sub);
      section.appendChild(phone);
      section.appendChild(cap);
      phone.x = 40 + col * (340 + FRAME_GAP_X);
      phone.y = 40 + row * (700 + FRAME_GAP_Y);
      cap.x = phone.x;
      cap.y = phone.y + 712;
    } catch (e) {
      err(`  ✗ ${def.id} failed: ${e.message}`);
    }
    idx++;
  }
  ok(`✓ All ${SCREENS.length} screens placed in section "Flow A".`);
  figma.viewport.scrollAndZoomIntoView([section]);
  done();
}

// ====================================================================
//  DISPATCHER
// ====================================================================
figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === 'setup-variables') return await setupVariables();
    if (msg.type === 'build-all')       return await buildAllScreens();
    if (msg.type === 'build')           return await buildOneScreen(msg.screen);
  } catch (e) {
    err('ERROR: ' + (e && e.message ? e.message : String(e)));
    if (e && e.stack) err(String(e.stack).split('\n').slice(0, 5).join('\n'));
    done();
  }
};
