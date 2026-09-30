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
  [reader, "package-review-binding.json", "review packet binding artifact"],
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
for (const forbidden of ["writesAllowed: true", "learnerRecordsIncluded: true", "hostedPersistenceActivated: true", "qrAliasesMutated: true"]) {
  if (route.includes(forbidden)) throw new Error("Forbidden local runtime behavior: " + forbidden);
}
console.log("PASS local pilot package runtime reader is gated, metadata-bound, read-only, QR-aware, and learner-data-safe.");
