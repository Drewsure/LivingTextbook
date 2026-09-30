import { readFileSync } from "node:fs";

const script = readFileSync(new URL("./create-local-package-request-draft.mjs", import.meta.url), "utf8");
const failures = [];

for (const marker of [
  "--output",
  "--tenant",
  "--package",
  "--version",
  "--quarantine",
  "--review-packet",
  "--bundle-review-id",
  "--operator",
  "flag: \"wx\"",
  "never overwrites",
  "does not call the server",
  "nextCommand",
]) {
  if (!script.includes(marker)) failures.push(`request draft generator missing marker: ${marker}`);
}
if (script.includes("LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN")) failures.push("request draft generator must not handle delivery credentials");

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS local package request draft generator creates bounded, non-overwriting durable-records drafts without server or credential access.");
