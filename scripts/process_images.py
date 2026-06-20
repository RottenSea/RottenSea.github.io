#!/usr/bin/env -S uv run
# /// script
# requires-python = ">=3.10"
# ///
"""
Process blog images: move to assets, rename, update article references, and clean up.

Usage:
    uv run scripts/process_images.py              # Scan, cache, process, clean
    uv run scripts/process_images.py --dry-run    # Only scan and cache, no modifications
    uv run scripts/process_images.py --vision-alt # Find images with non-descriptive alt text
"""

import json
import re
import shutil
import sys
from datetime import datetime
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
if not (REPO_ROOT / "src/content/blog").is_dir():
    REPO_ROOT = REPO_ROOT.parent
BLOG_DIR = REPO_ROOT / "src/content/blog"
ASSETS_DIR = REPO_ROOT / "src/assets/images"
SCRIPT_DIR = Path(__file__).resolve().parent
CACHE_DIR = SCRIPT_DIR / "cache"

# Obsidian-style wiki link: ![[filename]] or ![[filename|alt text]]
WIKI_IMG = re.compile(r'!\[\[([^\]|]+)(?:\|([^\]]*))?\]\]')
# Standard markdown image: ![alt](path)
MD_IMG = re.compile(r'!\[([^\]]*)\]\(([^)]+)\)')

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".bmp"}


def _next_seq(article_stem: str) -> int:
    """Find next available sequence number for an article's images."""
    max_seq = -1
    pattern = re.compile(rf'^{re.escape(article_stem)}(\d+)\.\w+$')
    for f in ASSETS_DIR.iterdir():
        m = pattern.match(f.name)
        if m:
            seq = int(m.group(1))
            if seq > max_seq:
                max_seq = seq
    return max_seq + 1

# Patterns indicating alt text is just a filename, not descriptive
FILENAME_ALT = re.compile(
    r'(?i)'
    r'(^.*\.(png|jpg|jpeg|gif|webp|svg)$)'   # ends with image extension
    r'|(^Screenshot\s+\d{4})'                  # starts with "Screenshot 2026..."
    r'|(^Pasted\s+image\s+\d{4})'              # starts with "Pasted image 2026..."
)


def _needs_alt_fix(alt: str) -> bool:
    """Check if alt text is filename-based and needs a descriptive replacement."""
    return bool(FILENAME_ALT.match(alt.strip()))


def _clean_filename(filename: str) -> str:
    """Convert a filename to a cleaner alt text by removing extension and formatting."""
    stem = Path(filename).stem
    # Remove date-like suffixes: "Screenshot 2026-06-19 035713 1" -> "Screenshot"
    cleaned = re.sub(r'\s+\d{4}[-_]\d{2}[-_]\d{2}.*', '', stem)
    cleaned = re.sub(r'\s{2,}', ' ', cleaned).strip()
    return cleaned if cleaned else stem


def scan_vision_alt() -> list[dict]:
    """Scan all articles and report images with non-descriptive alt text."""
    issues: list[dict] = []

    for md_file in sorted(BLOG_DIR.glob("*.md")):
        text = md_file.read_text(encoding="utf-8")

        # Find ALL image references (both Astro and non-Astro)
        for m in MD_IMG.finditer(text):
            alt = m.group(1).strip()
            path = m.group(2)
            if _needs_alt_fix(alt):
                issues.append({
                    "article": md_file.name,
                    "path": path,
                    "alt": alt,
                    "old_ref": m.group(0),
                })

    return issues


def scan_articles() -> list[dict]:
    """Scan all articles for non-Astro image references."""
    ops: list[dict] = []

    for md_file in sorted(BLOG_DIR.glob("*.md")):
        article_stem = md_file.stem
        text = md_file.read_text(encoding="utf-8")

        # Wiki links: ![[filename]] / ![[filename|alt]]
        for m in WIKI_IMG.finditer(text):
            fname = m.group(1).strip()
            alt = m.group(2).strip() if m.group(2) else _clean_filename(fname)
            ops.append({
                "article": md_file.name,
                "article_stem": article_stem,
                "type": "wiki",
                "old_ref": m.group(0),
                "filename": fname,
                "alt": alt,
                "status": "pending",
            })

        # Standard markdown: ![alt](local/path)
        for m in MD_IMG.finditer(text):
            path = m.group(2)
            # Skip URLs, absolute paths, and already-processed asset refs
            if path.startswith(("@", "http", "/", "data:")):
                continue
            fname = Path(path).name
            alt = m.group(1) or _clean_filename(fname)
            ops.append({
                "article": md_file.name,
                "article_stem": article_stem,
                "type": "md",
                "old_ref": m.group(0),
                "filename": fname,
                "alt": alt,
                "status": "pending",
            })

    return ops


def cache_report(ops: list[dict], summary: dict) -> Path:
    """Cache scan/process results to CACHE_DIR."""
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    report = {
        "timestamp": datetime.now().isoformat(),
        "summary": summary,
        "operations": ops,
    }
    cache_path = CACHE_DIR / "image_process_cache.json"
    cache_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    return cache_path


def process_ops(ops: list[dict]) -> list[dict]:
    """Execute all pending operations: rename, move, update refs."""
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)

    # Track sequence per article across multiple operations
    seq_tracker: dict[str, int] = {}

    def _get_seq(article_stem: str) -> int:
        if article_stem not in seq_tracker:
            seq_tracker[article_stem] = _next_seq(article_stem)
        else:
            seq_tracker[article_stem] += 1
        return seq_tracker[article_stem]

    for op in ops:
        article_stem = op["article_stem"]
        src_name = op["filename"]
        src = BLOG_DIR / src_name

        if not src.exists():
            op["status"] = "error"
            op["error"] = f"File not found: {src_name}"
            print(f"  ! {op['article']}: image not found -> {src_name}")
            continue

        # Determine new name
        seq = _get_seq(article_stem)
        ext = src.suffix or ".png"
        new_name = f"{article_stem}{seq:02d}{ext}"
        dest = ASSETS_DIR / new_name
        op["new_name"] = new_name

        # Move file
        shutil.move(str(src), str(dest))
        print(f"  → {src_name} → @/assets/images/{new_name}")

        # Update article reference
        article_path = BLOG_DIR / op["article"]
        content = article_path.read_text(encoding="utf-8")
        new_ref = f"![{op['alt']}](@/assets/images/{new_name})"
        if op["old_ref"] in content:
            content = content.replace(op["old_ref"], new_ref)
            article_path.write_text(content, encoding="utf-8")
            op["status"] = "processed"
        else:
            op["status"] = "warning"
            op["warning"] = f"Reference not found (may have been already updated): {op['old_ref']}"
            print(f"  ? {op['article']}: ref not found (already updated?)")

    return ops


def clean_unreferenced() -> int:
    """Remove image files from blog dir not referenced by any article."""
    all_refs: set[str] = set()
    for md_file in BLOG_DIR.glob("*.md"):
        text = md_file.read_text(encoding="utf-8")
        for m in WIKI_IMG.finditer(text):
            all_refs.add(m.group(1).strip())
        for m in MD_IMG.finditer(text):
            all_refs.add(Path(m.group(2)).name)

    removed = 0
    for f in sorted(BLOG_DIR.iterdir()):
        if f.suffix.lower() in IMAGE_EXTS and not f.name.startswith("."):
            if f.name not in all_refs:
                f.unlink()
                print(f"  ⊖ removed unreferenced: {f.name}")
                removed += 1

    return removed


def print_summary(ops: list[dict], cleaned: int, dry_run: bool) -> None:
    """Print a human-readable summary."""
    total = len(ops)
    processed = sum(1 for o in ops if o["status"] == "processed")
    errors = sum(1 for o in ops if o["status"] == "error")
    warnings = sum(1 for o in ops if o["status"] == "warning")

    print()
    if dry_run:
        print(f"Dry-run complete. Found {total} image(s) to process.")
        if total:
            print("Run without --dry-run to execute.")
    else:
        print(f"Processed: {processed} image(s)")
        if warnings:
            print(f"Warnings: {warnings}")
        if errors:
            print(f"Errors: {errors}")
        print(f"Unreferenced images removed: {cleaned}")

    cache_path = CACHE_DIR / "image_process_cache.json"
    print(f"Report cached: {cache_path}")


def main() -> None:
    args = sys.argv[1:]

    if "--vision-alt" in args:
        print("Scanning for images with non-descriptive alt text...")
        issues = scan_vision_alt()
        if not issues:
            print("  All images have descriptive alt text.")
        else:
            print(f"  Found {len(issues)} image(s) needing alt text improvements:\n")
            for issue in issues:
                print(f"  [{issue['article']}] {issue['path']}")
                print(f"      current alt: \"{issue['alt']}\"")
                print()
        return

    dry_run = "--dry-run" in args

    print("Scanning articles for non-Astro image references...")
    ops = scan_articles()

    summary = {
        "articles_scanned": len(list(BLOG_DIR.glob("*.md"))),
        "refs_found": len(ops),
    }
    print(f"  Found {summary['refs_found']} reference(s) across {summary['articles_scanned']} article(s).")

    if dry_run:
        cache_report(ops, {**summary, "mode": "dry-run"})
        print_summary(ops, 0, dry_run=True)
        return

    print("\nProcessing images...")
    ops = process_ops(ops)

    print("\nCleaning unreferenced images from blog dir...")
    cleaned = clean_unreferenced()

    cache_report(ops, {**summary, "mode": "full"})
    print_summary(ops, cleaned, dry_run=False)


if __name__ == "__main__":
    main()
