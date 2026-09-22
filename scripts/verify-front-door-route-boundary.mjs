import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registry = fs.readFileSync(
  path.join(root, "apps/web/src/data/sampleTenantRouteRegistry.ts"),
  "utf8",
);
const resolver = fs.readFileSync(
  path.join(root, "apps/web/src/data/sampleFrontDoorResolver.ts"),
  "utf8",
);
const page = fs.readFileSync(
  path.join(root, "apps/web/src/app/enter/[tenantId]/page.tsx"),
  "utf8",
);
const failures = [];

for (const fragment of [
  "validateSampleFrontDoorRouteRegistry",
  "Duplicate front-door route path",
  "cross-tenant content package",
  "cross-tenant access policy",
  "front-door launch session",
  "progression is not bound to its launch session",
  "encodeURIComponent(route.tenant.id)",
]) {
  if (!registry.includes(fragment)) failures.push(`registry is missing ${fragment}`);
}

if (!resolver.includes("getSampleFrontDoorRouteByTenantId")) failures.push("resolver must use the tenant-scoped registry");
if (!page.includes("notFound()")) failures.push("front-door page must fail closed for an unknown tenant");

const routeEntries = [...registry.matchAll(/routeId: "([^"]+)"/g)].map((match) => match[1]);
if (new Set(routeEntries).size !== routeEntries.length) failures.push("sample route ids must be unique");

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`PASS tenant-scoped front-door route boundary checks (${routeEntries.length} reviewed sample routes).`);
}
