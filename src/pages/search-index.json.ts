// src/pages/search-index.json.ts
import { getCollection } from 'astro:content';
import { buildSearchIndex } from '../lib/search';

export async function GET() {
  const posts = await getCollection('posts');
  const index = buildSearchIndex(posts);
  return new Response(JSON.stringify(index));
}
