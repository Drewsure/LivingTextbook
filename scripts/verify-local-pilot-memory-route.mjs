import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const page = readFileSync(resolve(root, "apps/web/src/app/local/package/[tenantId]/[packageId]/[version]/memory/[unitId]/page.tsx"), "utf8");
const contracts = readFileSync(resolve(root, "apps/web/src/features/routes/routeContracts.ts"), "utf8");

for (const marker of [
  "readLocalPilotPackageContent",
  "MemoryMatchDemoFlow",
  "createLaunchSession",
  "getInitialStudentProgression",
  "audioCues={contentResult.contentPackage.audioCues}",
  "packageId={packageId}",
]) {
  if (!page.includes(marker)) throw new Error(`Local package Memory Match route is missing: ${marker}`);
}
for (const marker of ["getLocalPilotPackageMemoryMatchPath", "/memory/"]) {
  if (!contracts.includes(marker)) throw new Error(`Local package Memory Match route contract is missing: ${marker}`);
}
for (const forbidden of ["resolveSampleLaunchContext", "studentRecords", "fetch(", "fetch("]) {
  if (page.includes(forbidden)) throw new Error(`Local package Memory Match route must not use forbidden parallel path: ${forbidden}`);
}
for (const forbidden of ["completeEntryPractice(", "occurredAt: \"2026-09-29T00:01:00.000Z\""]) {
  if (page.includes(forbidden)) throw new Error(`Local package Memory Match route must not self-unlock through: ${forbidden}`);
}
if (!page.includes("Direct package game URLs start locked")) {
  throw new Error("Local package Memory Match route must document the direct-route lock boundary.");
}
console.log("PASS local package Memory Match route starts locked and accepts only the validated front-door handoff.");
