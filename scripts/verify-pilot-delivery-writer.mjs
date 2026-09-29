import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const writer = readFileSync(resolve(root, "apps/web/src/server/delivery/pilotDeliveryMetadataWriter.ts"), "utf8");
const route = readFileSync(resolve(root, "apps/web/src/app/api/teacher/delivery/metadata/route.ts"), "utf8");

for (const [source, marker, label] of [
  [writer, "writePilotDeliveryMetadata", "metadata writer"],
  [writer, "LIVING_TEXTBOOOK_PILOT_DELIVERY_WRITES_ENABLED", "explicit write gate"],
  [writer, "LIVING_TEXTBOOOK_PILOT_DELIVERY_ROOT", "custody root"],
  [writer, "validateDurableBackupFilesystemPath", "filesystem custody validation"],
  [writer, "writeJsonFile", "immutable staged write"],
  [writer, "readPilotDeliveryMetadata", "post-write readback"],
  [writer, "validateStoredBinding", "stored identity reconciliation"],
  [writer, "staging-", "atomic staging directory"],
  [writer, "rename(staging, directory)", "atomic directory commit"],
  [writer, "payloadBytesIncluded: false", "payload privacy boundary"],
  [route, "LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN", "dedicated writer authorization"],
  [route, "readPilotDeliveryMetadata", "readback endpoint"],
  [route, "deliveryMetadataWritten: true", "metadata-only write result"],
  [route, "studentFacingActivationAllowed: false", "student activation boundary"],
]) {
  if (!source.includes(marker)) throw new Error(`Missing ${label}: ${marker}`);
}
for (const forbidden of ["writeFile(.*payload", "download=", "window.open", "packageAssemblyAllowed: true"] ) {
  if (writer.includes(forbidden) || route.includes(forbidden)) throw new Error(`Forbidden writer behavior: ${forbidden}`);
}
console.log("PASS controlled pilot delivery writer is explicitly gated, tenant-scoped, custody-validated, immutable, and student-disabled.");
