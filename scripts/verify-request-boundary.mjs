import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`missing ${relativePath}`);
    return "";
  }
  return fs.readFileSync(absolutePath, "utf8");
}

const helper = read("apps/web/src/server/persistence/requestBoundary.ts");
if (!helper.includes("PERSISTENCE_JSON_BODY_LIMIT_BYTES = 128 * 1024")) failures.push("persistence body limit is missing");
if (!helper.includes("SESSION_JSON_BODY_LIMIT_BYTES = 8 * 1024")) failures.push("session body limit is missing");
if (!helper.includes('mediaType !== "application/json"')) failures.push("content-type guard is missing");
if (!helper.includes("new TextEncoder().encode(source).byteLength")) failures.push("byte-length guard is missing");

for (const route of [
  "apps/web/src/app/api/persistence/progression/route.ts",
  "apps/web/src/app/api/persistence/events/route.ts",
]) {
  const source = read(route);
  if (!source.includes("readJsonRequestBody")) failures.push(`${route}: shared request boundary is not used`);
  if (!source.includes("PERSISTENCE_JSON_BODY_LIMIT_BYTES")) failures.push(`${route}: persistence limit is not used`);
  if (source.includes("request.json()")) failures.push(`${route}: direct request.json parsing bypasses the shared boundary`);
}

for (const route of [
  "apps/web/src/app/api/student/session/route.ts",
  "apps/web/src/app/api/teacher/session/route.ts",
]) {
  const source = read(route);
  if (!source.includes("readJsonRequestBody")) failures.push(`${route}: shared request boundary is not used`);
  if (!source.includes("SESSION_JSON_BODY_LIMIT_BYTES")) failures.push(`${route}: session limit is not used`);
  if (source.includes("request.json()")) failures.push(`${route}: direct request.json parsing bypasses the shared boundary`);
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS JSON request boundary, content-type, and byte-limit checks are present on persistence and session writes.");
}
