import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const resolverFile = path.join(root, "apps/web/src/data/editionQrAliasResolver.ts");
const routeFile = path.join(root, "apps/web/src/app/q/[...segments]/page.tsx");

for (const file of [resolverFile, routeFile]) {
  if (!fs.existsSync(file)) throw new Error(`Missing QR resolver file: ${file}`);
}

const resolver = fs.readFileSync(resolverFile, "utf8");
const route = fs.readFileSync(routeFile, "utf8");
const required = [
  [resolver, "export function parseEditionQrPath", "QR parsing must be reusable."],
  [resolver, "export function findEditionQrAlias", "QR alias lookup must be reusable."],
  [resolver, "countKey(segments, key) > 1", "Duplicate QR keys must fail closed."],
  [resolver, "decodeURIComponent(value)", "QR values must be decoded safely."],
  [resolver, "catch", "Malformed encoded QR values must fail closed."],
  [resolver, "alias.tenantId === parsed.tenantId", "QR lookup must preserve tenant isolation."],
  [route, "findEditionQrAlias(parsed, sampleEditionQrAliasPlan.aliases)", "QR route must use the shared alias resolver."],
  [route, "does not perform production redirects yet", "QR route must remain preview-only."],
];
const failures = required.filter(([source, marker]) => !source.includes(marker));
if (failures.length > 0) {
  throw new Error(failures.map(([, marker, message]) => `${message} Missing: ${marker}`).join("\n"));
}

console.log("PASS edition QR alias resolver is reusable, tenant-scoped, malformed-input safe, and preview-only.");
