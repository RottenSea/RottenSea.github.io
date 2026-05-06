# Personal Blog - Design Specification

## Overview

A minimal, text-focused personal blog built with Astro 6 + React 19 + Partytown. Content is authored in Markdown via Obsidian and managed through Astro Content Collections. The blog consists of three pages: homepage (article listing), about page, and article detail page.

## Tech Stack

- **Framework:** Astro 6.2.2 (static site generation)
- **UI Layer:** React 19 (for interactive components only)
- **Third-party Scripts:** @astrojs/partytown (ready for future analytics)
- **Content:** Astro Content Collections (Markdown)
- **Search:** Fuse.js (client-side fuzzy search on build-time JSON index)

## Core Architecture

```
src/
├── content/
│   └── posts/              # Markdown articles (Obsidian-compatible)
├── layouts/
│   └── Layout.astro        # Global HTML wrapper, theme CSS variables
├── components/
│   ├── Header.tsx           # Navigation bar with theme-aware styling
│   ├── ArticleLayout.tsx    # Article detail page (content + TOC sidebar)
│   ├── DarkModeToggle.tsx   # Theme toggle button
│   └── Search.tsx           # Search panel (overlay/modal)
├── pages/
│   ├── index.astro          # Homepage: article list
│   ├── about.astro          # About page
│   └── posts/
│       └── [slug].astro     # Article detail route
├── styles/
│   └── global.css           # CSS custom properties, theme definitions
└── lib/
    └── search.ts            # Search index generation (build-time)
```

**Key principle:** Astro handles routing and data fetching; React handles all interactive/stateful UI (Header with theme awareness, article page with TOC, search panel). Pure content pages (about) use only Astro.

## Pages

### 1. Homepage (index.astro)

- Header with site title, navigation links (Home, About), dark mode toggle
- Article list rendered as cards, each showing: title (h2), publication date, excerpt, read link
- Excerpt from Markdown frontmatter or auto-truncated first paragraph
- Search icon/input in header area
- Data flow: Astro fetches all posts from Content Collections, renders list

### 2. Article Detail ([slug].astro)

- Route param `[slug]` maps to Content Collection document
- React `ArticleLayout` component renders:
  - Main content area: title, date, reading time, Markdown-rendered body, code blocks
  - Sidebar: table of contents with IntersectionObserver-driven auto-highlight
  - Optional: reading progress indicator (top bar or side indicator)
- Code syntax highlighting via Shiki (Astro built-in, server-rendered, zero JS)
- Mobile: TOC collapses to floating button / drawer

### 3. About (about.astro)

- Pure Astro page, no interactive elements
- Personal introduction, social links (GitHub, etc.)
- Static content

## Interactive Features

### Dark/Light Mode

- React `DarkModeToggle` component in Header
- Toggles `data-theme="dark|light"` on `<html>` element
- All colors driven by CSS custom properties
- Preference persisted to `localStorage`
- Inline `<script>` in `<head>` reads localStorage and sets theme before paint (prevents FOUC)

### Table of Contents Auto-Highlight

- React component extracts headings from article Markdown
- IntersectionObserver watches heading positions during scroll
- Current section highlighted in sidebar TOC
- Click TOC item to smooth-scroll to heading

### Client-Side Search

- Build-time script scans all posts, generates `search-index.json` (title, excerpt, slug, tags)
- React `Search` component loads index on first interaction
- Fuse.js provides fuzzy matching
- Results displayed in overlay/panel with links to articles
- No server, no API calls

## Content Management

- Articles stored as Markdown files in `src/content/posts/`
- Frontmatter: `title`, `date`, `excerpt` (optional), `tags` (optional)
- Compatible with Obsidian vault structure
- Astro Content Collections provides type-safe querying

## Partytown

- Configured in `astro.config.mjs` but inactive until third-party scripts are added
- Future use: Google Analytics, other analytics scripts offloaded to web worker

## Design Direction

- Minimal text-first aesthetic (user selected "minimal text style")
- Clean whitespace, focus on typography and readability
- Dark/light mode via CSS custom properties
- Responsive: mobile-first layout with adaptive TOC behavior
