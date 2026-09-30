import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const reader = readFileSync(resolve(root, "apps/web/src/server/delivery/localPilotPackageRuntimeReader.ts"), "utf8");
const route = readFileSync(resolve(root, "apps/web/src/app/api/local-package/status/route.ts"), "utf8");

for (const [source, marker, label] of [
  [reader, "readLocalPilotPackageRuntime", "local package runtime reader"],
  [reader, "LIVING_TEXTBOOOK_LOCAL_PACKAGE_READS_ENABLED", "explicit local runtime read gate"],
  [reader, "validateDurableBackupFilesystemPath", "local package custody boundary"],
  [reader, "validateBinding", "local package metadata binding"],
  [reader, "learnerRecordsIncluded: false", "learner privacy boundary"],
  [reader, "qrPrintArtifactReady: true", "QR artifact readiness"],
  [reader, "qrAliasRegistryReady: true", "QR alias registry readiness"],
  [reader, "validatePilotQrAliasRegistryRecord", "QR alias registry runtime validation"],
  [reader, "qr-alias-registry.json", "QR alias registry runtime artifact"],
  [reader, "readLocalPilotPackageQrPrintSheet", "QR print sheet runtime reader"],
  [reader, "readLocalPilotPackageHandoff", "package handoff runtime reader"],
  [reader, "LIVING_TEXTBOOOK_LOCAL_PACKAGE_HANDOFF_READS_ENABLED", "explicit package handoff read gate"],
  [reader, "LIVING_TEXTBOOOK_LOCAL_PACKAGE_PRINT_READS_ENABLED", "explicit QR print read gate"],
  [reader, "htmlChecksum", "QR print HTML checksum binding"],
  [reader, "package-review-binding.json", "review packet binding artifact"],
  [reader, "package-integrity.json", "package integrity manifest"],
  [reader, "validateLocalPilotPackageIntegrity", "package integrity validation"],
  [reader, "verifyPackageIntegrity", "package integrity verification"],
  [reader, "readLocalPilotPackageIntegrity", "package integrity runtime reader"],
  [reader, "LIVING_TEXTBOOOK_LOCAL_PACKAGE_INTEGRITY_READS_ENABLED", "explicit package integrity read gate"],
  [reader, "reviewPacketId", "review packet identity"],
  [reader, "quarantineId", "quarantine identity"],
  [reader, "reviewPacketBindingValue", "review packet runtime validation"],
  [route, "readBoundedQueryParam", "bounded runtime identity"],
  [route, "writesAllowed: false", "runtime write boundary"],
  [route, "hostedPersistenceActivated: false", "runtime hosted boundary"],
  [route, "hostedPersistenceDecisionPacketId", "runtime hosted opt-in packet binding"],
  [route, "qrAliasesMutated: false", "runtime QR boundary"],
]) {
  if (!source.includes(marker)) throw new Error("Missing " + label + ": " + marker);
}
const printRoute = readFileSync(resolve(root, "apps/web/src/app/api/local-package/qr-print/route.ts"), "utf8");
for (const marker of ["readLocalPilotPackageQrPrintSheet", "readBoundedQueryParam", "Content-Security-Policy", "writesAllowed: false", "qrAliasesMutated: false"]) {
  if (!printRoute.includes(marker)) throw new Error(`QR print route is missing: ${marker}`);
}
const handoffRoute = readFileSync(resolve(root, "apps/web/src/app/api/local-package/handoff/route.ts"), "utf8");
for (const marker of ["readLocalPilotPackageHandoff", "readBoundedQueryParam", "writesAllowed: false", "qrAliasesMutated: false"]) {
  if (!handoffRoute.includes(marker)) throw new Error(`Package handoff route is missing: ${marker}`);
}
const integrityRoute = readFileSync(resolve(root, "apps/web/src/app/api/local-package/integrity/route.ts"), "utf8");
for (const marker of ["readLocalPilotPackageIntegrity", "readBoundedQueryParam", "writesAllowed: false", "exportAllowed: false"]) {
  if (!integrityRoute.includes(marker)) throw new Error(`Package integrity route is missing: ${marker}`);
}
for (const forbidden of ["writesAllowed: true", "exportAllowed: true", "writeFile", "unlink", "mkdir"]) {
  if (integrityRoute.includes(forbidden)) throw new Error(`Package integrity route exposes forbidden behavior: ${forbidden}`);
}
for (const forbidden of ["writesAllowed: true", "qrAliasesMutated: true", "writeFile", "unlink", "mkdir"]) {
  if (handoffRoute.includes(forbidden)) throw new Error(`Package handoff route exposes forbidden behavior: ${forbidden}`);
}
for (const forbidden of ["writesAllowed: true", "qrAliasesMutated: true", "writeFile", "unlink", "mkdir"]) {
  if (printRoute.includes(forbidden)) throw new Error(`QR print route exposes forbidden behavior: ${forbidden}`);
}
for (const forbidden of ["writesAllowed: true", "learnerRecordsIncluded: true", "hostedPersistenceActivated: true", "qrAliasesMutated: true"]) {
  if (route.includes(forbidden)) throw new Error("Forbidden local runtime behavior: " + forbidden);
}
console.log("PASS local pilot package runtime reader is gated, metadata-bound, read-only, QR-aware, and learner-data-safe.");
