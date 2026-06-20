# Project-Level Instructions

## Vision

Always use the `vision` skill (invoke via `/vision`) for image recognition. Do not use the Read tool's built-in multimodal capability for image content analysis.

## Standalone Operations

These are independent operations. Do not chain them together — run only what is asked.

### Formatting

- `uv run scripts/format.py` — Apply Chinese typography rules and bump revision on changed articles
- `uv run scripts/format.py --all` — Same as above, for all blog articles
- `uv run scripts/format.py <file.md>` — Same as above, for specific files

### Image Processing

- `uv run scripts/process_images.py` — Process all images (rename, move to `src/assets/images/`, update article references, remove unreferenced images)
- `uv run scripts/process_images.py --dry-run` — Preview only, no actual modifications
- `uv run scripts/process_images.py --vision-alt` — Scan for images with filename-based alt text

### Vision Alt Text

When asked to update image alt text, use the `vision` skill to analyze each image and write a proper description.
