import { readFileSync } from "node:fs";

const routeListPath = new URL("../docs/ACTIVE_ROUTE_VERIFICATION_LIST.md", import.meta.url);
const routeList = readFileSync(routeListPath, "utf8");
const activeRouteSection = routeList.split("## Planned QR Route, Not Active Yet")[0] ?? routeList;
const urls = Array.from(activeRouteSection.matchAll(/`(http:\/\/127\.0\.0\.1:3000\/[^`]*)`/g), (match) => match[1]);

if (urls.length === 0) {
  console.error("No active local routes found in docs/ACTIVE_ROUTE_VERIFICATION_LIST.md.");
  process.exit(1);
}

const results = [];

for (const url of urls) {
  try {
    const response = await fetch(url, { redirect: "manual" });
    results.push({ url, status: response.status, ok: response.status >= 200 && response.status < 400 });
  } catch (error) {
    results.push({ url, status: "error", ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}

for (const result of results) {
  const marker = result.ok ? "PASS" : "FAIL";
  const detail = result.error ? ` ${result.error}` : "";
  console.log(`${marker} ${result.status} ${result.url}${detail}`);
}

const failed = results.filter((result) => !result.ok);

if (failed.length > 0) {
  console.error(`${failed.length} active route check(s) failed.`);
  process.exit(1);
}

console.log(`${results.length} active route check(s) passed.`);
