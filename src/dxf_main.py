from dotenv import load_dotenv

load_dotenv()

import logging
from pathlib import Path
import argparse

from parser.core import ParserService
from cleaner.exporter import CleanerService
from parser.hybridBom import HybridBomBuilder


def main() -> None:
    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s"
    )
    logger = logging.getLogger(__name__)
    logger.info("Starting FusionCAD DXF toolkit")

    parser = argparse.ArgumentParser()
    parser.add_argument("dxf_file", help="Path to input DXF file")
    args = parser.parse_args()

    dxf_path = Path(args.dxf_file)
    logger.info("Parsing DXF: %s", dxf_path)
    ParserService(str(dxf_path)).run()

    notes_path = Path("objects-with-notes.json")
    logger.info("Cleaning extracted notes: %s", notes_path)
    CleanerService(notes_path).run()

    logger.info("Building AI-enhanced BOM")
    HybridBomBuilder(notes_json=notes_path, output_json=Path("bom_ai.json")).run()

    logger.info("All steps complete")


if __name__ == "__main__":
    main()
