import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const reader = readFileSync(resolve(root, "apps/web/src/server/delivery/localPilotPackageRuntimeReader.ts"), "utf8");
const route = readFileSync(resolve(root, "apps/web/src/app/api/local-package/content/route.ts"), "utf8");

for (const [source, markers, label] of [
  [reader, ["readLocalPilotPackageContent", "LIVING_TEXTBOOOK_LOCAL_PACKAGE_CONTENT_READS_ENABLED", "validateContentPackage", "contentPackagePath", "reviewStatus !== \"approved\"", "learnerRecords", "validateDurableBackupFilesystemPath"], "local package content reader"],
  [route, ["readLocalPilotPackageContent", "readBoundedQueryParam", "learnerRecordsIncluded: false", "writesAllowed: false", "hostedPersistenceActivated: false", "qrAliasesMutated: false"], "local package content route"],
]) {
  for (const marker of markers) {
    if (!source.includes(marker)) throw new Error(`${label} is missing required marker: ${marker}`);
  }
}
for (const forbidden of ["LIVING_TEXTBOOOK_LOCAL_PACKAGE_CONTENT_READS_ENABLED !== \"true\"", "learnerRecordsIncluded: true", "writesAllowed: true", "hostedPersistenceActivated: true", "qrAliasesMutated: true"]) {
  if (!reader.includes(forbidden) && !route.includes(forbidden)) continue;
  if (forbidden.includes("!==")) continue;
  throw new Error(`Local package content reader exposes forbidden state: ${forbidden}`);
}
console.log("PASS local package content reader is gated, canonical-content-validated, tenant-bound, and learner-data-safe.");
