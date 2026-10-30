// The home page in the browser: filtering the posts by category, tag and calendar day, paging the
// result ten at a time, and counting the uptime. Without this script every post shows.

const PAGE_SIZE = 10;

/** When the site went live: 2026-05-20 10:49:12 UTC+8. */
const LAUNCHED_AT = Date.parse("2026-05-20T02:49:12Z");

interface Filters {
  category: string | null;
  tag: string | null;
  day: string | null;
}

type Calendar = HTMLElement & { draw(): void };

const pad = (n: number) => String(n).padStart(2, "0");

/** A post's day in the reader's own calendar, which is what the calendar shows. */
const localDay = (instant: string) => {
  const date = new Date(instant);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const cards = [...document.querySelectorAll<HTMLElement>("[data-post]")];
const pager = document.querySelector<HTMLElement>(".home-pager");
const empty = document.querySelector<HTMLElement>(".home-empty");
const calendar = document.querySelector<Calendar>(".home-calendar");
const filters: Filters = { category: null, tag: null, day: null };
let page = 1;

const posts = cards.map((card) => ({
  card,
  category: card.dataset.category ?? null,
  tags: JSON.parse(card.dataset.tags ?? "[]") as string[],
  day: localDay(card.dataset.published ?? "")
}));

function show() {
  const matches = posts.filter(
    (post) =>
      (!filters.category || post.category === filters.category) &&
      (!filters.tag || post.tags.includes(filters.tag)) &&
      (!filters.day || post.day === filters.day)
  );
  const pageCount = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  page = Math.min(page, pageCount);
  const shown = new Set(
    matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  );
  for (const post of posts) post.card.hidden = !shown.has(post);
  if (empty) empty.hidden = matches.length > 0;
  pager?.setAttribute("page-count", String(pageCount));
  pager?.setAttribute("page", String(page));
}

/** Scrolls to the top of the list, below the nav that floats over this page. */
const toList = () => {
  const main = document.getElementById("main");
  if (!main) return;
  const nav = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--nav-height")
  );
  window.scrollTo({
    top: window.scrollY + main.getBoundingClientRect().top - (nav || 0)
  });
};

// Each list sends ds-select with its choice, or null when the reader clears it.
const listen = (selector: string, key: keyof Filters) =>
  document.querySelector(selector)?.addEventListener("ds-select", (event) => {
    filters[key] = (event as CustomEvent<string | null>).detail;
    page = 1;
    show();
  });
listen(".home-categories", "category");
listen(".home-tags", "tag");
listen(".home-calendar", "day");

pager?.addEventListener("ds-page", (event) => {
  page = (event as CustomEvent<number>).detail;
  show();
  toList();
});

// The calendar was built with UTC dates; mark the days in the reader's own time zone instead.
if (calendar) {
  const counts: Record<string, number> = {};
  for (const post of posts) counts[post.day] = (counts[post.day] ?? 0) + 1;
  calendar.dataset.counts = JSON.stringify(counts);
  calendar.draw();
}

// A post's category and tags link here with ?category= or ?tag=. Filter by it once, go to the
// list, and put the address back to "/", since filtering on this page never changes the address.
// A #main in the link would be lost with the query before the browser scrolled to it.
type Selectable = HTMLElement & { select(value: string | null): void };
const query = new URLSearchParams(location.search);
const fromQuery = (key: "category" | "tag", selector: string) => {
  const value = query.get(key);
  const list = document.querySelector<Selectable>(selector);
  if (!value || !list?.querySelector(`[data-value="${CSS.escape(value)}"]`))
    return;
  filters[key] = value;
  list.select(value);
};
fromQuery("category", ".home-categories");
fromQuery("tag", ".home-tags");
show();
if (location.search) {
  history.replaceState(history.state, "", location.pathname);
  if (filters.category || filters.tag) toList();
}

const uptime = document.getElementById("uptime");
if (uptime) {
  const tick = () => {
    const seconds = Math.max(0, Math.floor((Date.now() - LAUNCHED_AT) / 1000));
    const days = Math.floor(seconds / 86400);
    const clock = `${pad(Math.floor((seconds % 86400) / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`;
    uptime.textContent = days > 0 ? `${days}d ${clock}` : clock;
  };
  tick();
  setInterval(tick, 1000);
}
