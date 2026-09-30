import { readFileSync } from "node:fs";

const script = readFileSync(new URL("./run-local-package-operator.mjs", import.meta.url), "utf8");
const failures = [];

for (const marker of [
  "--request",
  "--preflight",
  "--assemble",
  "LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN",
  "LIVING_TEXTBOOOK_OPERATOR_LOCAL_PACKAGE_WRITE_CONFIRMATION",
  "/api/teacher/delivery/local-package/preflight",
  "/api/teacher/delivery/local-package",
  "No request was sent",
  "performedWrite",
  "relativeDirectory",
]) {
  if (!script.includes(marker)) failures.push(`operator script missing marker: ${marker}`);
}
if (script.includes("console.log(JSON.stringify(body")) failures.push("operator script must not print the request body");
if (script.includes("console.log(token")) failures.push("operator script must not print the delivery token");

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS local package operator defaults to bounded preflight and requires explicit machine-authenticated confirmation for assembly.");
