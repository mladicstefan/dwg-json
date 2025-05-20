from setuptools import setup, find_packages

setup(
    name="dxf_toolkit",
    version="0.1.0",
    packages=find_packages(),
    install_requires=["ezdxf", "openai", "dotenv", "certifi"],
    entry_points={
        "console_scripts": [
            "dxf-parse=dxf_main:main",
        ]
    },
)
