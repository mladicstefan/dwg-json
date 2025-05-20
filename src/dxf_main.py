import argparse
from pathlib import Path
from parser.core import ParserService
from cleaner.exporter import CleanerService


def main():
    p = argparse.ArgumentParser()
    p.add_argument("dxf_file")
    p.add_argument("--line_tol", type=float, default=1.0)
    p.add_argument("--chain_tol", type=float, default=1.0)
    p.add_argument("--max_tol", type=float, default=500.0)
    args = p.parse_args()
    ParserService(args.dxf_file, args.line_tol, args.chain_tol, args.max_tol).run()
    CleanerService(Path("objects-with-notes.json")).run()


if __name__ == "__main__":
    main()
