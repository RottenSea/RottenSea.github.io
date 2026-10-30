// A post's revisions, read from the repository's history at build time. Every commit that changed
// the post's file counts as one, following the file through renames. Node only: the browser never
// imports this.
import { execFileSync } from "node:child_process";

export interface FileHistory {
  /** How many commits changed the file. 0 for a file never committed. */
  revisions: number;
  /** When the last of them was written, as an ISO 8601 instant. */
  lastChanged?: string;
}

const git = (...args: string[]) =>
  execFileSync("git", args, { encoding: "utf8" }).trim();

let warned = false;
/** Says once per build why the counts may be short. */
function warn(message: string) {
  if (warned) return;
  warned = true;
  console.warn(`[revisions] ${message}`);
}

const cache = new Map<string, FileHistory>();

export function fileHistory(path: string): FileHistory {
  const cached = cache.get(path);
  if (cached) return cached;
  let history: FileHistory = { revisions: 0 };
  try {
    // A shallow clone holds only the latest commits, so every file would look new.
    if (git("rev-parse", "--is-shallow-repository") === "true") {
      warn(
        "this is a shallow clone, so revision counts and update dates are incomplete. Fetch the full history first, such as with `git fetch --unshallow`."
      );
    }
    const dates = git("log", "--follow", "--format=%aI", "--", path)
      .split("\n")
      .filter(Boolean);
    history = { revisions: dates.length, lastChanged: dates[0] };
  } catch {
    warn("git could not be run, so posts show no revision counts.");
  }
  cache.set(path, history);
  return history;
}
