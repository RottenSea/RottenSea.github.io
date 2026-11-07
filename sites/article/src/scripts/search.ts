// The nav's search, answered from the Pagefind index that `pnpm build` writes to dist/pagefind.
// The index loads the first time the panel opens. `astro dev` has no index, so the panel says so.

interface PagefindResult {
  data(): Promise<{
    url: string;
    excerpt: string;
    meta: Record<string, string | undefined>;
  }>;
}

interface Pagefind {
  init(): Promise<void>;
  debouncedSearch(
    query: string,
    options?: object,
    wait?: number
  ): Promise<{ results: PagefindResult[] } | null>;
}

type Panel = HTMLElement & {
  setLoading(loading: boolean): void;
  setResults(
    results: { title: string; href: string; meta?: string; excerpt?: string }[],
    message?: string
  ): void;
};

/** How many posts a search shows at most. */
const LIMIT = 8;
const INDEX = "/pagefind/pagefind.js";

const panel = document.querySelector<Panel>("ds-search-panel");
let pagefind: Promise<Pagefind | null> | undefined;

const load = () => {
  pagefind ??= import(/* @vite-ignore */ INDEX)
    .then(async (module: Pagefind) => {
      await module.init();
      return module;
    })
    .catch(() => null);
  return pagefind;
};

panel?.addEventListener("ds-open", () => {
  load();
});

/** The query in the box now. An answer that comes back for an older one is dropped. */
let latest = "";

panel?.addEventListener("ds-query", async (event) => {
  const query = (event as CustomEvent<string>).detail;
  latest = query;
  // Clearing the box calls no search, so a search still waiting is not cancelled by Pagefind.
  if (!query) {
    panel.setResults([]);
    return;
  }
  panel.setLoading(true);
  const index = await load();
  if (query !== latest) return;
  if (!index) {
    panel.setResults([], "Search works on the built site, after pnpm build.");
    return;
  }
  // A newer query cancels this one, and Pagefind then answers null.
  const search = await index.debouncedSearch(query);
  if (!search || query !== latest) return;
  const found = await Promise.all(
    search.results.slice(0, LIMIT).map((result) => result.data())
  );
  if (query !== latest) return;
  panel.setResults(
    found.map((post) => ({
      title: post.meta.title ?? "",
      // Pages are built as /blog/000001.html and served without the extension.
      href: post.url.replace(/\.html$/, ""),
      meta: [post.meta.date, post.meta.category].filter(Boolean).join(" · "),
      excerpt: post.excerpt
    }))
  );
});
