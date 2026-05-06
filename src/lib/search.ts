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
    slug: post.id.replace(/\.\w+$/, ''),
    tags: post.data.tags || [],
    date: post.data.date.toISOString().split('T')[0],
  }));
}
