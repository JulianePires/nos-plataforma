import { spawnSync } from "node:child_process";
import { renameSync, rmSync, writeFileSync } from "node:fs";

const TARGET = "packages/db/src/database.types.ts";
const TEMP = `${TARGET}.tmp`;

// Constant command through the shell so Windows resolves the CLI shim; no user input reaches it.
const result = spawnSync("supabase gen types typescript --local", {
  encoding: "utf8",
  shell: true,
  maxBuffer: 16 * 1024 * 1024,
  stdio: ["ignore", "pipe", "inherit"],
});
const types = result.stdout ?? "";

// The CLI may exit 0 with no output; an empty file would break every consumer of the types.
if (result.error || result.status !== 0 || types.trim() === "") {
  if (result.error) console.error(result.error.message);
  console.error(`db:types failed; ${TARGET} left unchanged.`);
  process.exit(result.status || 1);
}

try {
  writeFileSync(TEMP, types);
  renameSync(TEMP, TARGET);
} finally {
  rmSync(TEMP, { force: true });
}
