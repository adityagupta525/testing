/**
 * Transforms tokens/tokens.json (Tokens Studio format) into Figma REST
 * Variables API payload, then POSTs it to the target file.
 *
 * Env required:
 *   FIGMA_TOKEN     — personal access token with file_variables:write
 *   FIGMA_FILE_KEY  — file key (default: SZ95PmSFUty2V23TDRtdIm)
 *
 * Usage:
 *   FIGMA_TOKEN=figd_xxx node design/scripts/push-to-figma.js [--dry-run]
 *
 * Notes:
 * - The Variables write endpoint is Enterprise-only at present. On Free/Pro/Org
 *   this script will report a 403 and exit cleanly so you can fall back to
 *   the Tokens Studio plugin import (Path A).
 * - We first GET the file to verify auth + reachability, then POST.
 * - The script is idempotent: it sends `temporaryId` for each new variable so
 *   reruns don't create duplicates if you keep the id-map.
 */
const fs   = require('fs');
const path = require('path');
const https = require('https');

const TOKEN    = process.env.FIGMA_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY || 'SZ95PmSFUty2V23TDRtdIm';
const DRY      = process.argv.includes('--dry-run');

if (!TOKEN) {
  console.error('Missing FIGMA_TOKEN. Set it in env or in .env file.');
  process.exit(2);
}

const TOKENS = JSON.parse(fs.readFileSync(
  path.resolve(__dirname, '..', 'tokens', 'tokens.json'), 'utf8'
));

// ---- helpers ----------------------------------------------------------------
const hexToRgba = (hex) => {
  if (hex.startsWith('rgba')) {
    const m = hex.match(/rgba?\(([^)]+)\)/);
    const [r, g, b, a = '1'] = m[1].split(',').map(s => parseFloat(s.trim()));
    return { r: r/255, g: g/255, b: b/255, a: parseFloat(a) };
  }
  const h = hex.replace('#','');
  const r = parseInt(h.slice(0,2),16)/255;
  const g = parseInt(h.slice(2,4),16)/255;
  const b = parseInt(h.slice(4,6),16)/255;
  return { r, g, b, a: 1 };
};

// Walk Tokens Studio tree, yielding {path, type, value}
function* walk(node, prefix = []) {
  if (node && typeof node === 'object' && 'value' in node && 'type' in node) {
    yield { path: prefix.join('/'), type: node.type, value: node.value };
    return;
  }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      yield* walk(v, [...prefix, k]);
    }
  }
}

// Map Tokens Studio token type → Figma Variable resolved type
const TYPE_MAP = {
  color: 'COLOR',
  spacing: 'FLOAT',
  borderRadius: 'FLOAT',
  borderWidth: 'FLOAT',
  sizing: 'FLOAT',
  fontSizes: 'FLOAT',
  fontWeights: 'STRING',
  fontFamilies: 'STRING',
  letterSpacing: 'STRING',
  lineHeights: 'STRING',
  // skipped (composite — created as text/effect styles by Tokens Studio):
  typography: null,
  boxShadow: null,
};

// Build variable creation payload, grouped per collection.
const COLLECTIONS = {
  core:      'Core',
  semantic:  'Semantic',
  components:'Components',
};

const variableCreates = [];
const variableModes   = [];
const variableValues  = [];
const collectionCreates = [];

for (const [setKey, collectionName] of Object.entries(COLLECTIONS)) {
  const collectionId = `tmp_col_${setKey}`;
  const modeId = `tmp_mode_${setKey}`;
  collectionCreates.push({
    action: 'CREATE',
    id: collectionId,
    name: collectionName,
    initialModeId: modeId,
  });
  variableModes.push({
    action: 'UPDATE',
    id: modeId,
    name: 'Default',
    variableCollectionId: collectionId,
  });

  for (const tok of walk(TOKENS[setKey], [])) {
    const figType = TYPE_MAP[tok.type];
    if (!figType) continue; // skip typography / boxShadow composites
    const varId = `tmp_${setKey}_${tok.path.replace(/[^a-zA-Z0-9]/g,'_')}`;
    variableCreates.push({
      action: 'CREATE',
      id: varId,
      name: `${setKey}/${tok.path}`,
      variableCollectionId: collectionId,
      resolvedType: figType,
    });
    // value (handle alias: {core.color.paper.100})
    let value;
    if (typeof tok.value === 'string' && tok.value.startsWith('{') && tok.value.endsWith('}')) {
      const ref = tok.value.slice(1,-1).split('.');
      const refSet = ref.shift();
      const refPath = ref.join('/');
      const refId = `tmp_${refSet}_${refPath.replace(/[^a-zA-Z0-9]/g,'_')}`;
      value = { type: 'VARIABLE_ALIAS', id: refId };
    } else if (figType === 'COLOR') {
      value = hexToRgba(tok.value);
    } else if (figType === 'FLOAT') {
      value = parseFloat(tok.value);
    } else {
      value = String(tok.value);
    }
    variableValues.push({
      action: 'UPDATE',
      id: varId,
      variableId: varId,
      modeId,
      value,
    });
  }
}

const payload = {
  variableCollections: collectionCreates,
  variableModes,
  variables: variableCreates,
  variableModeValues: variableValues,
};

if (DRY) {
  console.log(JSON.stringify({
    summary: {
      collections: collectionCreates.length,
      variables:   variableCreates.length,
      values:      variableValues.length,
    },
    sample: {
      collection: collectionCreates[0],
      variable:   variableCreates[0],
      value:      variableValues[0],
    }
  }, null, 2));
  process.exit(0);
}

// ---- POST -------------------------------------------------------------------
function request(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      host: 'api.figma.com',
      port: 443,
      method,
      path: urlPath,
      headers: {
        'X-Figma-Token': TOKEN,
        'Content-Type': 'application/json',
      },
    }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

(async () => {
  console.log('1. Verifying token + file reachability…');
  const meta = await request('GET', `/v1/files/${FILE_KEY}?depth=1`);
  if (meta.status !== 200) {
    console.error(`   ✗ GET file failed (${meta.status})`);
    console.error('  ', meta.body.slice(0, 400));
    process.exit(1);
  }
  const fileInfo = JSON.parse(meta.body);
  console.log(`   ✓ File: "${fileInfo.name}" (last modified ${fileInfo.lastModified})`);

  console.log('2. POSTing variables payload…');
  const res = await request('POST', `/v1/files/${FILE_KEY}/variables`, payload);
  console.log(`   status: ${res.status}`);
  console.log('   body:  ', res.body.slice(0, 1000));

  if (res.status === 403) {
    console.error('\n→ 403 likely means your Figma plan does not include the Variables Write REST API (Enterprise-only).');
    console.error('  Fall back to Path A (Tokens Studio plugin import). See design/README.md.');
    process.exit(1);
  }
  if (res.status >= 400) process.exit(1);
  console.log('\n✓ Variables pushed.');
})().catch((e) => { console.error(e); process.exit(1); });
