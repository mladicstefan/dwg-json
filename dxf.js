#!/usr/bin/env node


const fs        = require('fs');
const path      = require('path');
const DxfParser = require('dxf-parser');

if (process.argv.length < 3) {
  console.error('Usage: node extract-notes-full.js <file.dxf>');
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



const textEntities = (dxf.entities || [])
  .filter(e => e.type === 'TEXT' || e.type === 'MTEXT')
  .map(e => {
    const pos = e.position || e.insertionPoint || { x: 0, y: 0, z: 0 };
    return {
      handle:   e.handle,
      type:     e.type,
      layer:    e.layer,
      position: { x: pos.x, y: pos.y },
      entity:   JSON.parse(JSON.stringify(e))  // deep-clone all props
    };
  });


const inserts = [];
;(function walk(ents) {
  for (const ent of ents) {
    if (ent.type === 'INSERT') {
      const pos = ent.position || { x: 0, y: 0, z: 0 };
      // collect ATTRIB tags
      const attrs = {};
      (ent.attributes || []).forEach(a => {
        attrs[a.tag] = a.text != null
          ? a.text.trim()
          : (a.value != null ? String(a.value).trim() : '');
      });

      // **DROP THE RADIUS FILTER** — include every note
      const allNotes = textEntities.map(t => t.entity);

      inserts.push({
        block:    ent.name,
        attrs,
        notes:    allNotes,
        position: { x: pos.x, y: pos.y }
      });
    }
    // recurse into nested block definitions
    if (Array.isArray(ent.entities)) {
      walk(ent.entities);
    }
  }
})(dxf.entities);


const bomMap = new Map();
for (const ins of inserts) {
  const key = ins.block;
  if (!bomMap.has(key)) {
    bomMap.set(key, {
      block: key,
      qty:   0,
      attrs: {},
      notes: new Map()   // handle → entity
    });
  }
  const entry = bomMap.get(key);
  entry.qty++;
  Object.assign(entry.attrs, ins.attrs);
  ins.notes.forEach(n => {
    if (n.handle) entry.notes.set(n.handle, n);
  });
}


const bom = Array.from(bomMap.values()).map(e => ({
  block: e.block,
  qty:   e.qty,
  attrs: e.attrs,
  // Array of TEXT/MTEXT entities (deduped by handle)
  notes: Array.from(e.notes.values())
}));

console.log(JSON.stringify(bom, null, 2));
