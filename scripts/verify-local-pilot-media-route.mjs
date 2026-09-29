import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const page = readFileSync(resolve(root, "apps/web/src/app/local/package/[tenantId]/[packageId]/[version]/media/[playlistId]/page.tsx"), "utf8");
const flow = readFileSync(resolve(root, "apps/web/src/features/multimedia/LocalPackageMediaFlow.tsx"), "utf8");
const reader = readFileSync(resolve(root, "apps/web/src/server/delivery/localPilotPackageRuntimeReader.ts"), "utf8");
const api = readFileSync(resolve(root, "apps/web/src/app/api/local-package/media/route.ts"), "utf8");
const contracts = readFileSync(resolve(root, "apps/web/src/features/routes/routeContracts.ts"), "utf8");

for (const marker of [
  "readLocalPilotPackageContent",
  "LocalPackageMediaFlow",
  "playlistId",
  "createLaunchSession",
  "accessMode: \"teacher-qr\"",
]) {
  if (!page.includes(marker)) throw new Error(`Local package media route is missing: ${marker}`);
}
for (const marker of [
  "UnitMediaEngagementPanel",
  "getLocalPilotPackageMediaPath",
  "appendLocalSessionEvidence",
  "mediaResolutionMode=\"hosted-first\"",
]) {
  if (!flow.includes(marker)) throw new Error(`Local package media flow is missing: ${marker}`);
}
for (const marker of [
  "readLocalPilotPackageMedia",
  "LIVING_TEXTBOOOK_LOCAL_PACKAGE_MEDIA_READS_ENABLED",
  "isSafeRelativePackagePath",
  "getMediaContentType",
]) {
  if (!reader.includes(marker)) throw new Error(`Local package media reader is missing: ${marker}`);
}
for (const marker of ["readLocalPilotPackageMedia", "assetId", "part", "Content-Disposition", "nosniff"]) {
  if (!api.includes(marker)) throw new Error(`Local package media API is missing: ${marker}`);
}
for (const marker of ["getLocalPilotPackageMediaPath", "getLocalPilotPackageMediaRoutePath", "/media/"]) {
  if (!contracts.includes(marker)) throw new Error(`Local package media route contract is missing: ${marker}`);
}
for (const forbidden of ["resolveSampleLaunchContext", "studentRecords", "writeFile", "unlink", "mkdir"]) {
  if (page.includes(forbidden) || flow.includes(forbidden) || api.includes(forbidden)) throw new Error(`Local package media lane must not use forbidden side effect: ${forbidden}`);
}

console.log("PASS local package media route serves only approved package assets through a gated, bounded, read-only playback lane.");
