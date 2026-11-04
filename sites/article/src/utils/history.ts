// The commit that removed every earlier post (2026-11-03). Revision counts and new post numbers
// read only the history after it.

/** The commit that removed the old posts; only commits after it count. */
export const HISTORY_START = "d4636865c1633ac7688f29514a958cd9e008c187";

/** The git revision range for the posts' history: every commit after HISTORY_START. */
export const HISTORY_RANGE = `${HISTORY_START}..HEAD`;
