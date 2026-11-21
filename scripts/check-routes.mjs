// Fails the build when the compiled route list differs from scripts/routes.mjs,
// so a page that silently disappears (e.g. a lost page.tsx) never deploys.
import { readFileSync } from "node:fs";
import { ROUTES } from "./routes.mjs";

const manifest = JSON.parse(readFileSync(".next/app-path-routes-manifest.json", "utf8"));
const built = new Set(Object.values(manifest).filter((r) => !r.startsWith("/_")));
const expected = new Set(Object.keys(ROUTES));

const missing = [...expected].filter((r) => !built.has(r));
const unexpected = [...built].filter((r) => !expected.has(r));

if (missing.length) console.error(`Routes missing from the build: ${missing.join(", ")}`);
if (unexpected.length) console.error(`Routes not listed in scripts/routes.mjs: ${unexpected.join(", ")}`);
if (missing.length || unexpected.length) process.exit(1);
console.log(`Route check passed (${built.size} routes)`);
