#!/usr/bin/env python3
"""
build.py — Inline content.js, world.js, and engine.js into index.html.

index.html is the deployable artifact (Vercel serves it as a static file).
The three source files are inlined into <script> blocks so the game works
with no network requests and no module loading. Run this after editing any
of the .js files:

    python3 build.py

Each block is wrapped in try/catch and sets window.__loaded_<name> so the
diagnostic footer in index.html can report which file failed to parse.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent
SOURCES = ["content", "world", "engine"]


def block_for(name: str) -> str:
    src = (ROOT / f"{name}.js").read_text()
    return (
        "<script>try{\n"
        + src.rstrip("\n")
        + f"\n\nwindow.__loaded_{name} = true; }}catch(e){{window.__err_{name}"
        + "=e&&e.stack?e.stack:String(e);}</script>"
    )


def main() -> int:
    html_path = ROOT / "index.html"
    html = html_path.read_text()
    for name in SOURCES:
        # Match the existing inlined block for this source file. Anchor on the
        # file's header comment so a non-greedy match can't span other blocks.
        pattern = re.compile(
            r"<script>try\{\n/\* =+\n   " + name + r"\.js.*?window\.__loaded_" + name
            + r" = true; \}catch\(e\)\{window\.__err_" + name
            + r"=e&&e\.stack\?e\.stack:String\(e\);\}</script>",
            re.DOTALL,
        )
        new_html, n = pattern.subn(lambda _m: block_for(name), html, count=1)
        if n != 1:
            print(f"ERROR: could not find inlined block for {name}.js in index.html", file=sys.stderr)
            return 1
        html = new_html
    html_path.write_text(html)
    print("index.html rebuilt from " + ", ".join(f"{s}.js" for s in SOURCES))
    return 0


if __name__ == "__main__":
    sys.exit(main())
