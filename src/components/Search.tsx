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
      <button className="theme-toggle" onClick={() => setOpen(true)} aria-label="Search">
        &#128269;
      </button>

      {open && (
        <div className="search-overlay" onClick={handleOverlayClick}>
          <div className="search-panel">
            <input
              ref={inputRef}
              className="search-input"
              type="text"
              placeholder="Search posts... (press Esc to close)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && results.length === 0 && (
              <p className="search-empty">No results found for "{query}"</p>
            )}
            {results.map((item) => (
              <a key={item.slug} href={`/posts/${item.slug}`} className="search-result" onClick={() => setOpen(false)}>
                <div className="search-result__title">{item.title}</div>
                <div className="search-result__excerpt">{item.excerpt}</div>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
