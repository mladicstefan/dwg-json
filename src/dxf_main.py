import logging
from pathlib import Path
import argparse
from parser.core import ParserService
from cleaner.exporter import CleanerService


def main():
    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s"
    )
    logger = logging.getLogger(__name__)
    logger.info("Starting FusionCAD DXF toolkit")

    p = argparse.ArgumentParser()
    p.add_argument("dxf_file", help="Path to input DXF file")
    args = p.parse_args()

    logger.info("Parsing DXF: %s", args.dxf_file)
    ParserService(args.dxf_file).run()

    logger.info("Cleaning extracted notes")
    CleanerService(Path("objects-with-notes.json")).run()
    logger.info("Done")


if __name__ == "__main__":
    main()
