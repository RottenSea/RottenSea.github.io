# Personal Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal text-focused personal blog with Astro 6 + React 19, supporting Markdown content via Astro Content Collections, dark/light mode, article TOC auto-highlight, and client-side search.

**Architecture:** Astro handles routing and all content rendering from Content Collections. React components provide interactivity where state is needed: Header (theme-aware nav + dark mode toggle), ArticleLayout (TOC sidebar with IntersectionObserver), and Search (Fuse.js overlay). Pure content pages (About) use only Astro. Build-time JSON endpoint generates the search index consumed by Fuse.js on the client.

**Tech Stack:** Astro 6.2.2, React 19, @astrojs/react, @astrojs/partytown, Fuse.js

---

### Task 1: Install Fuse.js and Set Up Content Collection

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/posts/hello-world.md`
- Create: `src/content/posts/building-with-astro.md`

- [ ] **Step 1: Install Fuse.js**

Run: `pnpm add fuse.js`

Expected: added to `package.json` dependencies and `pnpm-lock.yaml` updated.

- [ ] **Step 2: Create Content Collection config**

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { posts };
```

- [ ] **Step 3: Create sample post 1**

```markdown
---
title: Hello World
date: 2026-05-05
excerpt: Welcome to my new personal blog built with Astro and React.
tags: [hello, astro]
---

# Hello World

Welcome to my personal blog. This is built with **Astro** and **React**.

## What to Expect

I'll be writing about technology, projects, and things I'm learning.

## Why Astro

Astro is a great fit for content-focused sites. It ships zero JavaScript by default and only loads what's needed.
```

- [ ] **Step 4: Create sample post 2**

```markdown
---
title: Building with Astro and React
date: 2026-05-04
excerpt: A look at how Astro and React work together to build fast websites.
tags: [astro, react, tutorial]
---

# Building with Astro and React

Astro's island architecture lets you use React components only where interactivity is needed.

## Content Collections

Astro's Content Collections provide type-safe Markdown management with schema validation.

## Client-Side Interactivity

React components can be hydrated on demand with `client:load`, `client:visible`, or `client:idle` directives.
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add content collection config and sample posts"
```

---

### Task 2: Create Global CSS with Theme Variables

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create `src/styles/global.css`**

```css
/* src/styles/global.css */

:root,
[data-theme='light'] {
  --color-bg: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-text: #1a1a1a;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
  --color-accent: #3b82f6;
  --color-accent-hover: #2563eb;
  --color-code-bg: #f3f4f6;
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  --max-width: 48rem;
  --toc-width: 14rem;
}

[data-theme='dark'] {
  --color-bg: #0f0f0f;
  --color-bg-secondary: #1a1a1a;
  --color-text: #e5e5e5;
  --color-text-secondary: #9ca3af;
  --color-border: #27272a;
  --color-accent: #60a5fa;
  --color-accent-hover: #3b82f6;
  --color-code-bg: #1a1a1a;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  transition: background 0.3s, color 0.3s;
}

a {
  color: var(--color-accent);
  text-decoration: none;
}

a:hover {
  color: var(--color-accent-hover);
}

img {
  max-width: 100%;
  height: auto;
}

code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: var(--color-code-bg);
  padding: 0.2em 0.4em;
  border-radius: 4px;
}

pre {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  background: var(--color-code-bg);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  line-height: 1.5;
}

pre code {
  background: none;
  padding: 0;
  border-radius: 0;
}

h1, h2, h3, h4 {
  line-height: 1.3;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}

h1 { font-size: 2rem; }
h2 { font-size: 1.5rem; }
h3 { font-size: 1.25rem; }

p, ul, ol {
  margin-bottom: 1rem;
}

/* Article layout */
.article-layout {
  display: flex;
  gap: 3rem;
  max-width: calc(var(--max-width) + var(--toc-width) + 3rem);
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.article-layout__content {
  flex: 1;
  max-width: var(--max-width);
  min-width: 0;
}

.article-layout__content h2,
.article-layout__content h3 {
  scroll-margin-top: 80px;
}

.article-layout__toc {
  display: none;
}

@media (min-width: 1024px) {
  .article-layout__toc {
    display: block;
    width: var(--toc-width);
    flex-shrink: 0;
    position: sticky;
    top: 2rem;
    align-self: start;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
  }
}

/* TOC styles */
.toc-heading {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin-bottom: 0.75rem;
}

.toc-link {
  display: block;
  font-size: 0.8125rem;
  line-height: 1.5;
  padding: 0.25rem 0;
  color: var(--color-text-secondary);
  border-left: 2px solid transparent;
  padding-left: 0.5rem;
  transition: color 0.15s, border-color 0.15s;
}

.toc-link:hover {
  color: var(--color-accent);
}

.toc-link--active {
  color: var(--color-accent);
  border-left-color: var(--color-accent);
}

/* Header */
.header {
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background 0.3s;
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: calc(var(--max-width) + var(--toc-width) + 3rem);
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 3.5rem;
}

.header__title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header__nav a {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  transition: color 0.15s;
}

.header__nav a:hover {
  color: var(--color-text);
}

/* Dark mode toggle */
.theme-toggle {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.375rem 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  color: var(--color-text);
  transition: border-color 0.15s;
}

.theme-toggle:hover {
  border-color: var(--color-accent);
}

/* Homepage */
.home {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.home__heading {
  font-size: 1.75rem;
  margin-bottom: 2rem;
}

.post-card {
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.post-card:first-of-type {
  padding-top: 0;
}

.post-card__title {
  font-size: 1.25rem;
  margin: 0 0 0.25rem;
}

.post-card__title a {
  color: var(--color-text);
}

.post-card__title a:hover {
  color: var(--color-accent);
}

.post-card__meta {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
}

.post-card__excerpt {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* About */
.about {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.about h1 {
  margin-top: 0;
}

/* Search */
.search-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
  justify-content: center;
  padding-top: 4rem;
}

.search-panel {
  background: var(--color-bg);
  border-radius: 12px;
  width: 90%;
  max-width: 36rem;
  max-height: 60vh;
  overflow-y: auto;
  padding: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg);
  color: var(--color-text);
  margin-bottom: 1rem;
  outline: none;
}

.search-input:focus {
  border-color: var(--color-accent);
}

.search-result {
  display: block;
  padding: 0.75rem;
  border-radius: 8px;
  color: var(--color-text);
  transition: background 0.15s;
}

.search-result:hover {
  background: var(--color-bg-secondary);
}

.search-result__title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.search-result__excerpt {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}

.search-empty {
  text-align: center;
  color: var(--color-text-secondary);
  padding: 2rem;
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add global CSS with theme variables and layout styles"
```

---

### Task 3: Update Layout.astro with Theme Support and FOUC Prevention

**Files:**
- Modify: `src/layouts/Layout.astro`

- [ ] **Step 1: Rewrite `src/layouts/Layout.astro`**

```astro
---
// src/layouts/Layout.astro
export interface Props {
  title?: string;
}

const { title = 'RottenSea' } = Astro.props;
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
    <link rel="stylesheet" href="/src/styles/global.css" />
    <!-- FOUC prevention: set theme before paint -->
    <script is:inline>
      (function () {
        var theme = localStorage.getItem('theme');
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      })();
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: update Layout.astro with theme FOUC prevention"
```

---

### Task 4: Create DarkModeToggle React Component

**Files:**
- Create: `src/components/DarkModeToggle.tsx`

- [ ] **Step 1: Create `src/components/DarkModeToggle.tsx`**

```tsx
// src/components/DarkModeToggle.tsx
import { useState, useEffect } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setDark(isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <button class="theme-toggle" onClick={toggle} aria-label="Toggle dark mode">
      {dark ? '☀️' : '🌙'}
    </button>
  );
}
```

(Note: ☀️ and 🌙 are used as functional UI icons, not decorative emojis.)

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add DarkModeToggle React component"
```

---

### Task 5: Create Header React Component

**Files:**
- Create: `src/components/Header.tsx`

- [ ] **Step 1: Create `src/components/Header.tsx`**

```tsx
// src/components/Header.tsx
import DarkModeToggle from './DarkModeToggle';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'RottenSea' }: HeaderProps) {
  return (
    <header class="header">
      <div class="header__inner">
        <a href="/" class="header__title">{title}</a>
        <nav class="header__nav">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add Header React component with navigation and dark mode toggle"
```

---

### Task 6: Rewrite Homepage (index.astro)

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Rewrite `src/pages/index.astro`**

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header';
import { getCollection } from 'astro:content';

const posts = await getCollection('posts');
posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---

<Layout title="RottenSea">
  <Header client:load title="RottenSea" />
  <main class="home">
    <h1 class="home__heading">Blog</h1>
    {posts.length === 0 && (
      <p style="color: var(--color-text-secondary)">No posts yet.</p>
    )}
    {posts.map((post) => (
      <article class="post-card">
        <h2 class="post-card__title">
          <a href={`/posts/${post.slug}`}>{post.data.title}</a>
        </h2>
        <p class="post-card__meta">
          <time datetime={post.data.date.toISOString().split('T')[0]}>
            {post.data.date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {post.data.tags && post.data.tags.length > 0 && (
            <> · {post.data.tags.map((tag) => `#${tag}`).join(' ')}</>
          )}
        </p>
        {post.data.excerpt && (
          <p class="post-card__excerpt">{post.data.excerpt}</p>
        )}
      </article>
    ))}
  </main>
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: rewrite homepage with article listing from Content Collections"
```

---

### Task 7: Create ArticleLayout React Component

**Files:**
- Create: `src/components/ArticleLayout.tsx`

- [ ] **Step 1: Create `src/components/ArticleLayout.tsx`**

```tsx
// src/components/ArticleLayout.tsx
import { useState, useEffect, type ReactNode } from 'react';

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface ArticleLayoutProps {
  headings: Heading[];
  children: ReactNode;
}

export default function ArticleLayout({ headings, children }: ArticleLayoutProps) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const elements: Element[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    for (const h of headings) {
      const el = document.getElementById(h.slug);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    }

    return () => {
      for (const el of elements) {
        observer.unobserve(el);
      }
    };
  }, [headings]);

  // Only show h2 and h3 in TOC
  const tocHeadings = headings.filter((h) => h.depth <= 3);

  return (
    <div class="article-layout">
      <div class="article-layout__content">{children}</div>
      {tocHeadings.length > 0 && (
        <aside class="article-layout__toc">
          <nav>
            <h3 class="toc-heading">Contents</h3>
            {tocHeadings.map((h) => (
              <a
                key={h.slug}
                href={`#${h.slug}`}
                class={`toc-link ${activeId === h.slug ? 'toc-link--active' : ''}`}
                style={{ paddingLeft: `${(h.depth - 2) * 1}rem` }}
              >
                {h.text}
              </a>
            ))}
          </nav>
        </aside>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add ArticleLayout React component with TOC auto-highlight"
```

---

### Task 8: Create Article Detail Page

**Files:**
- Create: `src/pages/posts/[slug].astro`

- [ ] **Step 1: Create `src/pages/posts/[slug].astro`**

```astro
---
// src/pages/posts/[slug].astro
import Layout from '../../layouts/Layout.astro';
import Header from '../../components/Header';
import ArticleLayout from '../../components/ArticleLayout';
import { getCollection, getEntry, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content, headings } = await render(post);
---

<Layout title={post.data.title}>
  <Header client:load />
  <ArticleLayout client:load headings={headings}>
    <h1>{post.data.title}</h1>
    <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 2rem;">
      <time datetime={post.data.date.toISOString().split('T')[0]}>
        {post.data.date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </time>
    </p>
    <Content />
  </ArticleLayout>
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add article detail page with dynamic routing and TOC"
```

---

### Task 9: Create About Page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create `src/pages/about.astro`**

```astro
---
// src/pages/about.astro
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header';
---

<Layout title="About - RottenSea">
  <Header client:load />
  <main class="about">
    <h1>About</h1>
    <p>
      Welcome to my personal blog. I write about technology, projects, and things I'm learning.
    </p>
    <p>
      This site is built with <a href="https://astro.build">Astro</a> and <a href="https://react.dev">React</a>,
      styled with a minimal text-first design philosophy.
    </p>
    <h2>Links</h2>
    <ul>
      <li><a href="https://github.com/RottenSea">GitHub</a></li>
    </ul>
  </main>
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add about page"
```

---

### Task 10: Create Search Index Endpoint

**Files:**
- Create: `src/pages/search-index.json.ts`
- Create: `src/lib/search.ts`

- [ ] **Step 1: Create `src/lib/search.ts`**

```ts
// src/lib/search.ts
import type { CollectionEntry } from 'astro:content';

export interface SearchItem {
  title: string;
  excerpt: string;
  slug: string;
  tags: string[];
  date: string;
}

export function buildSearchIndex(posts: CollectionEntry<'posts'>[]): SearchItem[] {
  return posts.map((post) => ({
    title: post.data.title,
    excerpt: post.data.excerpt || '',
    slug: post.slug,
    tags: post.data.tags || [],
    date: post.data.date.toISOString().split('T')[0],
  }));
}
```

- [ ] **Step 2: Create `src/pages/search-index.json.ts`**

```ts
// src/pages/search-index.json.ts
import { getCollection } from 'astro:content';
import { buildSearchIndex } from '../lib/search';

export async function GET() {
  const posts = await getCollection('posts');
  const index = buildSearchIndex(posts);
  return new Response(JSON.stringify(index));
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add search index generation endpoint"
```

---

### Task 11: Create Search React Component

**Files:**
- Create: `src/components/Search.tsx`

- [ ] **Step 1: Create `src/components/Search.tsx`**

```tsx
// src/components/Search.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import Fuse from 'fuse.js';
import type { SearchItem } from '../lib/search';

export default function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<SearchItem[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/search-index.json')
      .then((r) => r.json())
      .then((data: SearchItem[]) => setIndex(data));
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const fuse = useRef<Fuse<SearchItem> | null>(null);
  if (index && !fuse.current) {
    fuse.current = new Fuse(index, {
      keys: ['title', 'excerpt', 'tags'],
      threshold: 0.4,
    });
  }

  const results = query && fuse.current
    ? fuse.current.search(query).map((r) => r.item)
    : [];

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setOpen(false);
  }, []);

  return (
    <>
      <button class="theme-toggle" onClick={() => setOpen(true)} aria-label="Search">
        &#128269;
      </button>

      {open && (
        <div class="search-overlay" onClick={handleOverlayClick}>
          <div class="search-panel">
            <input
              ref={inputRef}
              class="search-input"
              type="text"
              placeholder="Search posts... (press Esc to close)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && results.length === 0 && (
              <p class="search-empty">No results found for "{query}"</p>
            )}
            {results.map((item) => (
              <a key={item.slug} href={`/posts/${item.slug}`} class="search-result" onClick={() => setOpen(false)}>
                <div class="search-result__title">{item.title}</div>
                <div class="search-result__excerpt">{item.excerpt}</div>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add Search React component with Fuse.js client-side search"
```

---

### Task 12: Integrate Search into Header and Homepage

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Update Header to include Search button**

```tsx
// src/components/Header.tsx
import DarkModeToggle from './DarkModeToggle';
import Search from './Search';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'RottenSea' }: HeaderProps) {
  return (
    <header class="header">
      <div class="header__inner">
        <a href="/" class="header__title">{title}</a>
        <nav class="header__nav">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <Search />
          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: integrate Search into Header"
```

---

### Task 13: Clean Up Default Files

**Files:**
- Delete: `src/components/Welcome.astro`
- Delete: `src/assets/astro.svg`
- Delete: `src/assets/background.svg`

- [ ] **Step 1: Remove default scaffold files**

Run:
```bash
git rm src/components/Welcome.astro src/assets/astro.svg src/assets/background.svg
```

- [ ] **Step 2: Commit**

```bash
git commit -m "chore: remove default Astro scaffold files"
```

---

### Task 14: Build and Verify

**Files:** (none)

- [ ] **Step 1: Run full build**

Run: `pnpm run build`
Expected: Clean build with no errors. Output in `dist/` directory.

- [ ] **Step 2: Verify built output**

Run: `ls dist/`
Expected: Contains `index.html`, `about.html`, `posts/hello-world/index.html`, `posts/building-with-astro/index.html`, `search-index.json`, favicon, and other assets.

- [ ] **Step 3: Commit final state**

```bash
git add -A
git commit -m "chore: clean up and verify build"
```
