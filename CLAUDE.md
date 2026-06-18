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

When the user requests formatting, run the script:

- `uv run scripts/format.py --all --images` — apply all Chinese Typography rules, bump revision on changed articles, and process images (move to `src/assets/images/`, rename as `{article-filename}{two-digit-seq}.{ext}`, update references, remove unreferenced images)
- `uv run scripts/format.py <file.md> --images` — same, but for specific files only
