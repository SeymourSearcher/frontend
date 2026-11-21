// Requests every route in scripts/routes.mjs against a running site and fails on any non-200.
// Usage: npm run smoke -- https://seymoursearcher.com
import { ROUTES } from "./routes.mjs";

const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const TIMEOUT_MS = 20_000;

async function check(path) {
  const started = Date.now();
  try {
    const res = await fetch(base + path, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    return { path, status: res.status, ms: Date.now() - started };
  } catch (e) {
    return { path, status: e.name, ms: Date.now() - started };
  }
}

const paths = Object.values(ROUTES).filter(Boolean);
const results = await Promise.all(paths.map(check));
for (const r of results) console.log(`${r.status === 200 ? "ok  " : "FAIL"} ${r.status} ${r.ms}ms ${r.path}`);

const failed = results.filter((r) => r.status !== 200);
if (failed.length) {
  console.error(`${failed.length}/${results.length} routes failed on ${base}`);
  process.exit(1);
}
console.log(`All ${results.length} routes OK on ${base}`);
