#!/usr/bin/env node

const fs        = require('fs');
const path      = require('path');
const DxfParser = require('dxf-parser');

if (process.argv.length < 3) {
  console.error('Usage: node bom‐from‐dxf.js path/to/file.dxf');
  process.exit(1);
}

const dxfPath = path.resolve(process.argv[2]);
let content;
try {
  content = fs.readFileSync(dxfPath, 'utf-8');
} catch (err) {
  console.error(`Failed to read "${dxfPath}":`, err.message);
  process.exit(1);
}

const parser = new DxfParser();
let dxf;
try {
  dxf = parser.parseSync(content);
} catch (err) {
  console.error('DXF parse error:', err.message);
  process.exit(1);
}

// strip formatting and unify newlines
function cleanText(raw) {
  if (!raw) return '';
  return raw
    .replace(/\\f[^;]*;/g, '')   // strip font codes
    .replace(/\\P/g, ' ')        // paragraph marks → space
    .trim();
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// 1) collect all TEXT & MTEXT from modelspace
const textEntities = (dxf.entities || [])
  .filter(e => e.type === 'TEXT' || e.type === 'MTEXT')
  .map(e => ({
    x: e.position.x,
    y: e.position.y,
    text: cleanText(e.text || e.plainText?.() || '')
  }));

// 2) collect all INSERTs (block references) with position & ATTRIBs
const inserts = [];
;(function extractInserts(entities) {
  if (!Array.isArray(entities)) return;
  for (const ent of entities) {
    if (ent.type === 'INSERT') {
      const pos = ent.position || { x: 0, y: 0, z: 0 };
      // map ATTRIBs
      const attrs = {};
      (ent.attributes || []).forEach(a => {
        attrs[a.tag] = cleanText(a.text || a.value);
      });
      // find all callouts within RADIUS
      const RADIUS = 200;  // adjust to your drawing units
      const notes = textEntities
        .filter(t => distance(t, pos) <= RADIUS)
        .map(t => t.text)
        .filter(t => t.length > 0);
      inserts.push({
        block: ent.name,
        position: pos,
        attrs,
        notes
      });
    }
    // if you need nested inside blocks/blocks['...'].entities, do that too
  }
})(dxf.entities);

// 3) group into a BOM map
const bomMap = new Map();
for (const ins of inserts) {
  const key = ins.block;
  if (!bomMap.has(key)) {
    bomMap.set(key, {
      block: key,
      qty: 0,
      attrs: {},        // will merge common ATTRIBs
      notes: new Set()  // use a Set to dedupe identical callouts
    });
  }
  const entry = bomMap.get(key);
  entry.qty++;
  // merge ATTRIBs (last‐one‐wins)
  Object.assign(entry.attrs, ins.attrs);
  // collect notes
  ins.notes.forEach(n => entry.notes.add(n));
}

// 4) produce final JSON
const bom = Array.from(bomMap.values()).map(e => ({
  block:       e.block,
  qty:         e.qty,
  attrs:       e.attrs,
  notes:       Array.from(e.notes)
}));

console.log(JSON.stringify(bom, null, 2));
