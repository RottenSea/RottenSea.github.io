# Project-Level Instructions

## Chinese Typography

### Parentheses
- Use `()` only — never `（）`
- Chinese before `(` → space: `文本 (text)`
- English before `(` → no space: `text(text)`
- No space before content inside: `(内容)` `(content)`

### Quotes
- Use straight `" "` — never curly `""`

### Punctuation
- Use half-width `, . ? ! :` instead of full-width `，。？！：`
- Use `, ` instead of `、` (enumeration comma)
- Use ` -- ` instead of `——` (em dash)

### Spacing
- Add space between Chinese and English: `欢迎使用 OpenCode`
- Add space between Chinese and numbers: `标题 1` / `5 小时` / `200 次`
- Add space after `, . ? !` when following Chinese text
- No space before `, . ? !` when following English text
- Spacing rules apply only outside `""`; content inside quotes is left untouched
- Add space before `[]()` when preceded by Chinese text: `参考 [链接](url)`
- No space inside `[]` or `()`: `[内容](url)`, not `[ 内容 ]( url )`
- No trailing whitespace at line endings

### Markdown Links
- Image syntax `![alt](path)` — alt text follows same spacing rules as content

### Case
- Proper nouns: `GitHub`, `Node.js`, `PowerShell`, `macOS`
- Tags: lowercase only (`agent`, not `Agent`)

### Width
- English, digits — half-width (ASCII)

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
