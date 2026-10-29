// Word counts and reading time, by the rule the old site used (the reading-time package's):
// every Han character is a word, every run of letters or digits in other scripts is a word, and a
// reader takes 200 words a minute.

const HAN = /\p{Script=Han}/gu;
const WORD = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;

/** The words of a post's Markdown, without its imports, tags and link targets. */
export function countWords(markdown: string): number {
  const text = markdown
    .replace(/^\s*(?:import|export)\s.*$/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\]\([^)]*\)/g, "]");
  const han = text.match(HAN)?.length ?? 0;
  const other = text.replace(HAN, " ").match(WORD)?.length ?? 0;
  return han + other;
}

/** Minutes to read, rounded, at least one. */
export const readingMinutes = (words: number) =>
  Math.max(1, Math.round(words / 200));
