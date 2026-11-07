// The home page's quotes, from src/content/blog/_quotes.md: each line that starts with "- " is a
// quote, and " — " starts its source. The file sits with the posts so it can be edited in Obsidian;
// the collection only loads folder/index.mdx, so it is never published as a post.
import source from "../content/blog/_quotes.md?raw";

export interface Quote {
  text: string;
  attribution?: string;
}

export const QUOTES: Quote[] = source
  .split("\n")
  .filter((line) => line.startsWith("- "))
  .map((line) => {
    // The last " — " starts the source, so a quote may hold the dash itself.
    const quote = line.slice(2);
    const dash = quote.lastIndexOf(" — ");
    const text = dash < 0 ? quote : quote.slice(0, dash);
    const attribution = dash < 0 ? "" : quote.slice(dash + 3);
    return { text: text.trim(), attribution: attribution.trim() || undefined };
  })
  .filter((quote) => quote.text);
