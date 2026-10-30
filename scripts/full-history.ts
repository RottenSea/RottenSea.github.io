// Workers Builds does not say how deep it clones the repository. The personal website counts each
// post's revisions and dates its last update from git log, so on a shallow clone it would count
// too few. This fetches the rest of the history when the clone is shallow; if that fails, the
// build fails with it.
import { execFileSync } from "node:child_process";

const shallow = execFileSync("git", ["rev-parse", "--is-shallow-repository"], {
  encoding: "utf8"
}).trim();

if (shallow === "true") {
  console.log("The clone is shallow: fetching the whole history.");
  execFileSync("git", ["fetch", "--unshallow"], { stdio: "inherit" });
}
