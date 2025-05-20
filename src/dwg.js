#!/usr/bin/env node

const { execFile } = require('child_process');
const fs           = require('fs');
const path         = require('path');
const DxfParser    = require('dxf-parser');

if (process.argv.length < 2+1) {
  console.error('Usage: ./dwg.js path/to/file.dwg');
  process.exit(1);
}

const dwgPath = path.resolve(process.argv[2]);
if (!fs.existsSync(dwgPath)) {
  console.error(`ERROR: DWG not found at ${dwgPath}`);
  process.exit(1);
}

const dxfPath = dwgPath.replace(/\.dwg$/i, '.dxf');

execFile('dwg2dxf', ['-y', dwgPath, dxfPath], (err, _stdout, stderr) => {
  if (err) {
    console.error('Conversion failed:\n', stderr.trim());
    process.exit(1);
  }
  console.log(`✔ Converted to DXF: ${dxfPath}`);

  // now parse the DXF
  let content;
  try {
    content = fs.readFileSync(dxfPath, 'utf8');
  } catch (e) {
    console.error('Failed to read DXF:', e.message);
    process.exit(1);
  }

  let dxf;
  try {
    dxf = new DxfParser().parseSync(content);
  } catch (e) {
    console.error('DXF parse error:', e.message);
    process.exit(1);
  }

  function cleanText(raw) {
    return (raw||'')
      .replace(/\\f[^;]*;/g, '')
      .replace(/\\P/g, ' ')
      .trim();
  }

  const inserts = [];
  function scan(ents) {
    if (!Array.isArray(ents)) return;
    for (const e of ents) {
      if (e.type === 'INSERT') {
        inserts.push({
          block: e.name,
          attrs: (e.attributes||[]).map(a => ({
            tag: a.tag,
            text: cleanText(a.text||a.value)
          }))
        });
      }
      if (e.entities) scan(e.entities);
    }
  }

  scan(dxf.entities);
  for (const blk of Object.values(dxf.blocks)) {
    scan(blk.entities);
  }

  const bom = [];
  const map = new Map();
  for (const ins of inserts) {
    const key = ins.block;
    if (!map.has(key)) {
      map.set(key, { partNumber: key, qty: 0, notes: {} });
    }
    const ent = map.get(key);
    ent.qty++;
    for (const { tag, text } of ins.attrs) {
      if (!text) continue;
      ent.notes[tag] = ent.notes[tag] || [];
      ent.notes[tag].push(text);
    }
  }
  console.log(JSON.stringify(Array.from(map.values()), null, 2));
});
