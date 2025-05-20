# FusionCAD DXF Toolkit

A lightweight, modular toolkit to parse DXF files and clean up exported notes.

## Features

- **DXF Parsing**
  - Extract text entities (`TEXT`, `MTEXT`) with positions
  - Extract block inserts with attributes and computed bounding boxes
  - Extract line segments from `LINE`, `LWPOLYLINE`, and simple `CIRCLE` approximations
- **Command-Line Interface**
  - `dxf-parse --line_tol <float> --chain_tol <float> --max_tol <float> <dxf_file>`
  - Emits JSON to stdout
- **Data Cleaning**
  - Load an export with “notes” entries
  - Normalize raw text notes
  - Produce `cleaned.json` (records + BOM) and `bom.csv`

## Installation

```bash
git clone https://github.com/yourusername/fusioncad-dxf-toolkit.git
cd fusioncad-dxf-toolkit
pip install -e .
```
