# FusionCAD

**Extract structured Bill of Materials (BoM) data from .DWG architectural drawings** using a blend of spatial logic and semantic AI.

## 🔍 Overview

DWG files lack formal object–text bindings. This tool:

- Parses DWG into objects, text labels, and connecting lines.
- Builds a spatial graph of entities based on coordinates.
- Infers semantic relationships between text and geometry.
- Extracts fields like material, dimensions, U‑values, etc.
- Outputs traceable, structured BoM entries.
- Supports a manual correction loop for human validation and AI retraining.

## 🚀 Features

- **DWG Parsing** – Convert drawings into JSON: `objects.json`, `lines.json`, `text.json`.
- **Spatial Relation Engine** – Follow line chains and proximity to infer connections.
- **Semantic AI** – Leverage sentence-transformers and OpenAI to match text to objects.
- **Extensible Pipeline** – Modular stages for parsing, graph construction, AI inference, and export.
- **Human-in-the-Loop** – Review and correct mappings for continuous improvement.
- **Scalable Deployment** – Dockerized microservices for production.

## 🛠 Installation

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

## 🎯 Quick Start

```bash
# Parse a DWG and generate BoM JSON
python -m src.parser.dxf_parser \
  --input data/sample.dwg \
  --output output/bom_entries.json
```

Pipeline steps:

1. **Parsing** – Extract entities from DWG.
2. **Spatial Graph** – Link text and objects by lines and coordinates.
3. **AI Inference** – Run semantic engine to label relations.
4. **Validation** – Manually review and correct mappings.
5. **Export** – Finalize and export structured BoM.

## 📂 Project Structure

```
<project_root>/
├── src/
│   ├── cleaner/
│   │   ├── exporter.py
│   │   └── normalizer.py
│   ├── data/
│   │   ├── drawing.dwg
│   │   └── drawing.dxf
│   ├── parser/
│   │   ├── __init__.py
│   │   ├── core.py
│   │   ├── entities.py
│   │   ├── hybridBom.py
│   │   └── relations.py
│   └── utils/
│       ├── __init__.py
│       ├── duplicate.py
│       ├── file.io.py
│       ├── geometry.py
│       └── optimizer.py
├── dxf_toolkit.egg-info/
├── bom.ai.json
├── bom.csv
├── cleaned.json
├── clustered-texts.json
├── dwg.js
├── dxf_main.py
├── pythonStyling.yaml
└── README.md
```

## 🧩 Development Guidelines

- **Single Responsibility** – One module = one task.
- **Small, Testable Functions** – Favor functions over monolithic scripts.
- **Docstrings & Comments** – Use clear docstrings for inputs/outputs.
- **Follow Style Guide** – See `pythonStyling.yaml` for conventions.
- **Run Tests**

  ```bash
  pytest --cov
  ```

## 🤝 Contributing

1. Fork the repo.
2. Create a branch: `feature/your-feature`.
3. Commit: `git commit -m "Add feature"`.
4. Push and open a PR.
5. Ensure tests pass and code follows the style guide.

##
