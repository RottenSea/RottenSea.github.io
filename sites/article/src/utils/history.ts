// Where the posts' history starts. On 2026-11-03 every post up to then was removed in this commit,
// and the example post moved into 000000. Revision counts (git.ts) and the numbers pnpm new-post
// hands out only read the commits after it, so 000000 does not inherit the old post's revisions
// and numbering starts again from 000001. Node only, like git.ts; scripts/new-post.ts imports it
// too.

/** The commit that removed the old posts; only commits after it count. */
export const HISTORY_START = "d4636865c1633ac7688f29514a958cd9e008c187";

/** The git revision range for the posts' history: every commit after HISTORY_START. */
export const HISTORY_RANGE = `${HISTORY_START}..HEAD`;
