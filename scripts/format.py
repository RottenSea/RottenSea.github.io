#!/usr/bin/env -S uv run
# /// script
# requires-python = ">=3.10"
# ///
"""
Format blog articles according to Chinese typography rules in CLAUDE.md.

Usage:
    uv run scripts/format.py                        # Format git-modified blog articles
    uv run scripts/format.py --all                  # Format all blog articles
    uv run scripts/format.py <file.md>              # Format specific files
"""

import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent
if not (REPO_ROOT / "src/content/blog").is_dir():
    REPO_ROOT = REPO_ROOT.parent
BLOG_DIR = REPO_ROOT / "src/content/blog"

# CJK Unified Ideographs range
CJK = "一-鿿㐀-䶿豈-﫿"
LATIN = "A-Za-z"
DIGIT = "0-9"

RE_CJK = re.compile(f"[{CJK}]")


def has_cjk(text: str) -> bool:
    return bool(RE_CJK.search(text))


# ---------------------------------------------------------------------------
# Protection: URLs (prevent casing/spacing rules from mangling links)
# ---------------------------------------------------------------------------

URL_PATTERN = re.compile(r"https?://[^\s()<>\"']+")

def protect_urls(content: str) -> tuple[str, dict[str, str]]:
    """Replace URLs with sentinel placeholders."""
    placeholders: dict[str, str] = {}
    counter = 0

    def _replacer(m: re.Match) -> str:
        nonlocal counter
        key = f"\x00URL{counter}\x00"
        placeholders[key] = m.group(0)
        counter += 1
        return key

    text = URL_PATTERN.sub(_replacer, content)
    return text, placeholders


def restore_placeholders(text: str, placeholders: dict[str, str]) -> str:
    for key, value in placeholders.items():
        text = text.replace(key, value)
    return text


# ---------------------------------------------------------------------------
# Protection: code blocks and inline code
# ---------------------------------------------------------------------------

def protect_code(content: str) -> tuple[str, dict[str, str]]:
    """Replace fenced code blocks and inline code with sentinel placeholders."""
    placeholders: dict[str, str] = {}
    counter = 0

    def _protect(pattern: str, text: str) -> str:
        nonlocal counter

        def _replacer(m: re.Match) -> str:
            nonlocal counter
            key = f"\x00CODE{counter}\x00"
            placeholders[key] = m.group(0)
            counter += 1
            return key

        return re.sub(pattern, _replacer, text)

    # Fenced code blocks (``` … ```)
    text = _protect(r"```[\s\S]*?```", content)
    # Inline code (`…`)
    text = _protect(r"(?<!`)`[^`\n]+`(?!`)", text)
    return text, placeholders


def restore_code(text: str, placeholders: dict[str, str]) -> str:
    return restore_placeholders(text, placeholders)


# ---------------------------------------------------------------------------
# Protection: quoted text (spacing rules skip inside "")
# ---------------------------------------------------------------------------

def protect_quotes(body: str) -> tuple[str, dict[str, str]]:
    """Replace the inner content of "…" with placeholders, keeping quote
    marks visible so spacing rules can add spaces around the quotes."""
    placeholders: dict[str, str] = {}
    counter = 0

    def _replacer(m: re.Match) -> str:
        nonlocal counter
        key = f"\x00QUOTE{counter}\x00"
        # Keep the quote marks in place:  "知识"  →  "\x00QUOTE0\x00"
        placeholders[key] = m.group(1)
        counter += 1
        return f'"{key}"'

    text = re.sub(r'"([^"]*)"', _replacer, body)
    return text, placeholders


def restore_quotes(text: str, placeholders: dict[str, str]) -> str:
    return restore_placeholders(text, placeholders)


# ---------------------------------------------------------------------------
# Formatting rules
# ---------------------------------------------------------------------------

def fix_curly_quotes(text: str) -> str:
    """Curly/smart quotes → straight (MUST run before protect_quotes)."""
    text = re.sub(r"[“”]", '"', text)
    text = re.sub(r"[‘’]", "'", text)
    return text


def fix_punctuation(text: str) -> str:
    """Full-width punctuation → half-width + trailing space."""
    text = re.sub(r"，", ", ", text)
    text = re.sub(r"。", ". ", text)
    text = re.sub(r"？", "? ", text)
    text = re.sub(r"！", "! ", text)
    text = re.sub(r"：", ": ", text)
    text = re.sub(r"、", ", ", text)
    text = re.sub(r"——", " -- ", text)
    # Full-width parens → half-width
    text = re.sub(r"（", "(", text)
    text = re.sub(r"）", ")", text)
    # Collapse multiple spaces left by replacements
    text = re.sub(r"  +", " ", text)
    return text


def fix_spacing(text: str) -> str:
    """Add space between CJK and Latin / digits / quotes / brackets."""
    # CJK followed by Latin
    text = re.sub(rf"([{CJK}])([{LATIN}])", r"\1 \2", text)
    # Latin followed by CJK
    text = re.sub(rf"([{LATIN}])([{CJK}])", r"\1 \2", text)
    # CJK followed by digit
    text = re.sub(rf"([{CJK}])([{DIGIT}])", r"\1 \2", text)
    # Digit followed by CJK
    text = re.sub(rf"([{DIGIT}])([{CJK}])", r"\1 \2", text)
    # CJK followed by straight quote
    text = re.sub(rf'([{CJK}])"', r'\1 "', text)
    # Straight quote followed by CJK
    text = re.sub(rf'"([{CJK}])', r'" \1', text)
    # Closing bracket/paren followed by CJK
    text = re.sub(rf"([\]\)])([{CJK}])", r"\1 \2", text)
    # CJK followed by opening bracket/paren (already handled by fix_bracket_spacing for ( and [)
    return text


def fix_bracket_spacing(text: str) -> str:
    """Space before ( for non-link contexts; no space inside [] or ()."""
    # Add space before ( — exclude `](` (markdown link) and `((` (nested)
    text = re.sub(r"([^\s(\]])\(", r"\1 (", text)
    # Add space before [ when preceded by CJK (NOT general \S — would break ![image])
    text = re.sub(rf"([{CJK}])\[", r"\1 [", text)
    # No space inside [] or ()
    text = re.sub(r"\[\s+", "[", text)
    text = re.sub(r"\s+\]", "]", text)
    text = re.sub(r"\(\s+", "(", text)
    text = re.sub(r"\s+\)", ")", text)
    return text


def fix_trailing_whitespace(text: str) -> str:
    """Remove trailing spaces / tabs from every line."""
    return re.sub(r"[ \t]+$", "", text, flags=re.MULTILINE)


def fix_casing(text: str) -> str:
    """Correct common proper noun casing (word-boundary aware)."""
    replacements = [
        (r"(?<!\w)Github(?!\w)", "GitHub"),
        (r"(?<!\w)github(?!\w)", "GitHub"),
        (r"(?<!\w)Nodejs(?!\w)", "Node.js", re.IGNORECASE),
        (r"(?<!\w)Node\.js", "Node.js"),
        (r"(?<!\w)Powershell(?!\w)", "PowerShell", re.IGNORECASE),
        (r"(?<!\w)Macos(?!\w)", "macOS", re.IGNORECASE),
        (r"(?<!\w)Mac OS(?!\w)", "macOS"),
        (r"(?<!\w)Opencode(?!\w)", "OpenCode"),
        (r"(?<!\w)Github\s*Actions", "GitHub Actions"),
    ]
    for pattern, repl, *flags in replacements:
        kwargs = {}
        if flags:
            kwargs["flags"] = flags[0]
        text = re.sub(pattern, repl, text, **kwargs)
    return text


# ---------------------------------------------------------------------------
# File-level pipeline
# ---------------------------------------------------------------------------

def format_file(filepath: str | Path) -> bool:
    """Format one markdown file.  Returns True if changed."""
    fp = Path(filepath)
    original = fp.read_text(encoding="utf-8")
    content = original

    # 1. Protect URLs (prevent casing/spacing rules from mangling links)
    content, url_map = protect_urls(content)

    # 2. Protect code blocks and inline code
    content, code_map = protect_code(content)

    # 3. Separate frontmatter (keep it untouched)
    fm_match = re.match(r"^---\n.*?\n---\n", content, re.DOTALL)
    if fm_match:
        frontmatter = fm_match.group(0)
        body = content[fm_match.end() :]
    else:
        frontmatter = ""
        body = content

    # 4. Convert curly quotes to straight BEFORE quote protection,
    #    so protect_quotes can match them and prevent spacing inside.
    body = fix_curly_quotes(body)

    # 5. Protect quoted content in body from spacing rules
    body, quote_map = protect_quotes(body)

    # 6. Apply formatting rules
    body = fix_punctuation(body)
    body = fix_spacing(body)
    body = fix_bracket_spacing(body)
    body = fix_casing(body)

    # 7. Restore
    body = restore_quotes(body, quote_map)

    # 8. Reassemble
    content = frontmatter + body
    content = restore_code(content, code_map)
    content = restore_placeholders(content, url_map)

    # 9. Clean up trailing whitespace (whole file)
    content = fix_trailing_whitespace(content)

    if content != original:
        fp.write_text(content, encoding="utf-8")
        return True
    return False


def revision_bump(filepath: str | Path) -> bool:
    """Increment `revision` frontmatter field by 1.  Returns True if changed."""
    fp = Path(filepath)
    text = fp.read_text(encoding="utf-8")
    new_text, n = re.subn(
        r"^(revision:\s*)(\d+)$",
        lambda m: f"{m.group(1)}{int(m.group(2)) + 1}",
        text,
        count=1,
        flags=re.MULTILINE,
    )
    if n:
        fp.write_text(new_text, encoding="utf-8")
        return True
    return False


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> None:
    args = sys.argv[1:]

    do_all = "--all" in args
    clean_args = [a for a in args if a not in ("--all",)]

    files: list[Path] = []
    if not clean_args and not do_all:
        # Default: git-modified blog articles
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True,
            text=True,
            cwd=REPO_ROOT,
        )
        for line in result.stdout.strip().split("\n"):
            line = line.strip()
            if not line:
                continue
            status = line[:2].strip()
            path = line[3:]
            if status in ("M", "??") and path.endswith(".md") and "blog" in path:
                files.append(Path(path))
        if not files:
            print("No modified blog articles found.")
            return
    elif do_all:
        files = sorted(BLOG_DIR.glob("*.md"))
    else:
        for f in clean_args:
            p = Path(f)
            if p.suffix == ".md":
                files.append(p)

    formatted = 0
    bumped = 0
    for f in files:
        if not f.exists():
            print(f"  ! {f} — not found, skipping")
            continue
        if format_file(f):
            formatted += 1
            if revision_bump(f):
                bumped += 1

    print(f"Formatted: {formatted} file(s)")
    print(f"Revision bumped: {bumped} file(s)")


if __name__ == "__main__":
    main()
