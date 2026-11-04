// Builds Twikoo's Cloudflare backend, which is not on npm, from source in .twikoo/.
// To update, change TAG and COMMIT together, from
//   git ls-remote https://github.com/twikoojs/twikoo.git refs/tags/<tag>
// The build stops if the tag has moved.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TAG = "2.0.17";
const COMMIT = "b13ef7c018b0cb1bb4b9ac82d98728322ae5e79b";

const source = join(import.meta.dirname, ".twikoo");
const stamp = join(source, ".built-commit");
const run = (command: string, args: string[]) =>
  execFileSync(command, args, {
    cwd: source,
    stdio: "inherit",
    shell: process.platform === "win32"
  });

if (existsSync(stamp) && readFileSync(stamp, "utf8") === COMMIT) {
  console.log(`Twikoo ${TAG} is already built in ${source}.`);
} else {
  rmSync(source, { recursive: true, force: true });
  execFileSync(
    "git",
    [
      "clone",
      "--depth",
      "1",
      "--branch",
      TAG,
      "https://github.com/twikoojs/twikoo.git",
      source
    ],
    { stdio: "inherit" }
  );
  const head = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: source,
    encoding: "utf8"
  }).trim();
  if (head !== COMMIT)
    throw new Error(`Twikoo ${TAG} is at ${head}, not ${COMMIT}.`);

  const { packageManager } = JSON.parse(
    readFileSync(join(source, "package.json"), "utf8")
  );
  // Only the backend and the workspace packages it is built from.
  run("npx", [
    "--yes",
    packageManager,
    "install",
    "--frozen-lockfile",
    "--filter",
    "@twikoojs/cloudflare..."
  ]);
  // The source says 0.0.0; the admin panel compares the real version with the browser script's.
  run("node", ["scripts/release-set-version.mjs", TAG]);
  run("npx", [
    "--yes",
    packageManager,
    "--recursive",
    "--filter",
    "@twikoojs/cloudflare...",
    "build"
  ]);
  writeFileSync(stamp, COMMIT);
}
