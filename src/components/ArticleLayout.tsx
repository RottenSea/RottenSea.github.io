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
    <div className="article-layout">
      <div className="article-layout__content">{children}</div>
      {tocHeadings.length > 0 && (
        <aside className="article-layout__toc">
          <nav>
            <h3 className="toc-heading">Contents</h3>
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
