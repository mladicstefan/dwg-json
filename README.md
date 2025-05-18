# 🧐 Extract Text–Object Relations from DXF Files

A pipeline to parse `.dxf` files, extract entities, build structured JSON outputs, clean them, and match against a BOM for pricing estimates.

---

## 📅 Parse DXF and Build JSON Outputs

```bash
python dxf_parser.py <file.dxf> [lineTol] [chainTol] [maxTol]
```

### Example:

```bash
python dxf_parser.py drawing.dxf 50 50 500
```

Produces:

- `texts.json`
- `objects.json`
- `lines.json`
- `relations.json`
- `objects-with-notes.json`

---

## 🧹 Clean Up JSON Output

```bash
# Clean and normalize the JSON output
python cleanjson.py
```

This script:

- Removes empty or duplicate notes
- Normalizes all text fields
- Moves unpaired notes into null entries in the `relations`

---

## 🔄 Workflow Overview

1. **Convert `.DWG` to `.DXF`**
   Use a converter like `dwg.js` or another tool.

2. **Run Parser**

   ```bash
   python dxf_parser.py file.dxf
   ```

   Outputs:

   - `objects.json` — Object metadata
   - `lines.json` — Connection lines
   - `texts.json` — Text labels
   - `relations.json` — Links between objects and text
   - `objects-with-notes.json` — Grouped data for export

3. **Clean JSON**

   ```bash
   python cleanjson.py
   ```

4. **Match Against BOM**

   ```bash
   npx tsc matching.ts
   node matching.js \
     --bom ./data/bom_test.xlsx \
     --price ./data/price_list.xlsx \
     --out ./data/matches.xlsx
   ```

---

## 📁 Entity Data Structures

### 🧱 Objects

```jsonc
{
  "id": "<handle>",
  "block": "<block name>",
  "position": { "x": <mm>, "y": <mm> },
  "attrs": {
    // attribute tags
  },
  "bbox": {
    "minx": <mm>, "miny": <mm>,
    "maxx": <mm>, "maxy": <mm>
  }
}
```

### 📏 Lines

```jsonc
{
  "id": "<handle_or_PL_index>",
  "start": { "x": <mm>, "y": <mm> },
  "end":   { "x": <mm>, "y": <mm> }
}
```

### ✍️ Texts

```jsonc
{
  "id": "<handle>",
  "position": { "x": <mm>, "y": <mm> },
  "text": "<cleaned string>"
}
```

### 🔗 Relations

```jsonc
{
  "textId": "<handle>",
  "objectId": "<handle_or_null>",
  "note": "<text>",
  "linePath": ["<lineId>", ...]
}
```

---

## 🛠️ Requirements

- Python 3.x
- `ezdxf` library (`pip install ezdxf`)
- Node.js and TypeScript (`npm install -g typescript`)
- Excel files (`.xlsx`) for BOM and pricing

---

## 📦 Output

- Cleaned structured JSON data
- Matched Excel file with cost estimates
