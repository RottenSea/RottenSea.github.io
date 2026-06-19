# Project-Level Instructions

## Format Workflow

Before formatting, back up all blog files, then run the formatter and review changes:

1. **Back up**: Copy all blog markdown files to `temp_format_backup/`
2. **Format**: Run `uv run scripts/format.py --all`
3. **Review**: Compare backup vs formatted files, summarize changes, check for unexpected modifications
4. **Fix**: If anything looks wrong, ask the user how to fix it and apply corrections
5. **Clean up**: Remove `temp_format_backup/`

Format commands:
- `uv run scripts/format.py` — apply Chinese Typography rules and bump revision on changed articles
- `uv run scripts/format.py --all` — same, but for all blog articles
- `uv run scripts/format.py <file.md>` — same, but for specific files only

Image processing is handled by a separate script:
- `uv run scripts/process_images.py` — process all images (rename, move to `src/assets/images/`, update article references, remove unreferenced)
- `uv run scripts/process_images.py --dry-run` — preview only, no modifications
- `uv run scripts/process_images.py --vision-alt` — scan for images with filename-based alt text
