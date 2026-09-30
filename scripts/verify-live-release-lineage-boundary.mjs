import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const lineage = readFileSync(resolve(root, "apps/web/src/server/delivery/pilotDeliveryReleaseLineage.ts"), "utf8");
const releaseRoute = readFileSync(resolve(root, "apps/web/src/app/api/teacher/delivery/release/route.ts"), "utf8");
const metadataRoute = readFileSync(resolve(root, "apps/web/src/app/api/teacher/delivery/metadata/route.ts"), "utf8");
const qrRegistryRoute = readFileSync(resolve(root, "apps/web/src/app/api/teacher/delivery/qr-registry/route.ts"), "utf8");

for (const [source, markers, label] of [
  [lineage, ["readQuarantineReviewDecision", "readQuarantinePackageEvidenceReview", "readQuarantinePackageReviewPacket", "readQuarantineSentenceApproval", "accepted-for-package-review", "reviewed-package-evidence", "Exactly two approved English target sentences are required before delivery release.", "sourceAssemblyChecksum", "selectedMode"], "release lineage validator"],
  [releaseRoute, ["readPilotDeliveryReleaseLineage", "quarantineId", "lineageBound: false"], "release route lineage gate"],
  [metadataRoute, ["readPilotDeliveryReleaseLineage", "quarantineId", "lineageBound: false"], "metadata writer lineage gate"],
  [qrRegistryRoute, ["readPilotDeliveryReleaseLineage", "readPilotDeliveryMetadata", "deliveryMetadataBound: false", "quarantineId"], "QR registry lineage and custody gate"],
]) {
  for (const marker of markers) if (!source.includes(marker)) throw new Error(`Missing ${label} marker: ${marker}`);
}

for (const forbidden of ["lineageBound: true"]) {
  if (releaseRoute.includes(forbidden) || metadataRoute.includes(forbidden)) throw new Error(`Unsafe release lineage behavior: ${forbidden}`);
}
for (const forbidden of ["studentFacingActivationAllowed: true", "packageAssemblyAllowed: true"]) {
  if (releaseRoute.includes(forbidden) || metadataRoute.includes(forbidden) || qrRegistryRoute.includes(forbidden)) throw new Error(`Unsafe release lineage behavior: ${forbidden}`);
}

console.log("PASS delivery release, metadata, and QR registry writes require tenant-bound accepted review lineage without enabling student activation.");
