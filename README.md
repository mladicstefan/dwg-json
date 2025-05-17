npx tsc matching.ts
node matching.js \
  --bom ./data/bom_test.xlsx \
  --price ./data/price_list.xlsx \
  --out ./data/matches.xlsx

Usage:
on linux:
node dwg.js ./drawing.dwg --> Decodes DWG to DXF
node dxf.js ./drawing.dxf --> Makes DXF to Searliazed JSON