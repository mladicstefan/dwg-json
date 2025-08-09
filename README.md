# FusionCAD

Extract data from architectrual drawings (.DWG) and infer relationships between datapoints for building of structured BOM (Bill Of Materials) using spacial geometry and AI semantics. Partially working, due to .DWG format limitaitons. This is a multi step pipeline.     

## Steps:
1. DWG->DXF via dwg.js 
2. DXF->JSON->CSV via dxf_main.py

## Installation
1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/DWG_BoM_Extractor.git
   cd DWG_BoM_Extractor
   ```
2. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```
3. **Configure environment**

   ```bash
   cp env.example .env && cp env.example /src/parser/.env
   # Edit .env with your AI credentials and DXF settings
   ```
## Quick Start

```bash
# Parse a DWG and generate BoM JSON
python -m src.parser.dxf_parser \
  --input data/sample.dwg \
  --output output/bom_entries.json
```

##
