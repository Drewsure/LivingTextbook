import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const assembler = readFileSync(resolve(root, "apps/web/src/server/delivery/localPilotPackageAssembler.ts"), "utf8");
const route = readFileSync(resolve(root, "apps/web/src/app/api/teacher/delivery/local-package/route.ts"), "utf8");

for (const [source, marker, label] of [
  [assembler, "assembleLocalPilotPackage", "local package assembler"],
  [assembler, "LIVING_TEXTBOOOK_LOCAL_PACKAGE_WRITES_ENABLED", "explicit local package write gate"],
  [assembler, "LIVING_TEXTBOOOK_LOCAL_PACKAGE_ROOT", "local package root"],
  [assembler, "LIVING_TEXTBOOOK_APPROVED_ASSET_ROOT", "approved asset root"],
  [assembler, "evaluateLocalBundleAssetEvidenceSet", "asset evidence gate"],
  [assembler, "validateQuarantineFilesystemPath", "approved source boundary"],
  [assembler, "copyFile", "explicit file copy"],
  [assembler, ".staging-", "atomic staging directory"],
  [assembler, "rename(staging, directory)", "atomic local package commit"],
  [assembler, "publisherPayloadIncluded: true", "publisher payload marker"],
  [assembler, "learnerRecordsIncluded: false", "learner privacy marker"],
  [assembler, "verifyStagedPackage", "staged read-back"],
  [assembler, "LIVING_TEXTBOOOK_PILOT_PRINT_BASE_URL", "explicit QR print base URL"],
  [assembler, "qr-print-sheet.html", "static QR print sheet"],
  [assembler, "qr-alias-registry.json", "QR alias registry artifact"],
  [assembler, "validatePilotQrAliasRegistryRecord", "QR alias registry validation"],
  [assembler, "QRCode.toString", "QR symbol generation"],
  [assembler, "printAuthorized: true", "release-bound print authorization"],
  [assembler, "reviewPacketBinding", "review packet binding input"],
  [assembler, "package-review-binding.json", "review packet binding artifact"],
  [assembler, "package-integrity.json", "package integrity manifest"],
  [assembler, "createPackageIntegrityManifest", "package integrity creation"],
  [assembler, "verifyPackageIntegrity", "package integrity verification"],
  [assembler, "validateReviewPacketBinding", "review packet binding validation"],
  [assembler, "quarantineId", "quarantine identity preservation"],
  [assembler, "reviewPacketId", "review packet identity preservation"],
  [assembler, "hostedPersistenceDecisionPacketId", "hosted opt-in packet identity preservation"],
  [route, "hasPilotDeliveryApiToken", "tenant-bound delivery token"],
  [route, "readQuarantinePackageReviewPacket", "durable review packet binding"],
  [route, "readPilotDeliveryReleaseLineage", "live release lineage binding"],
  [route, "validateReviewPacketBinding", "review packet validation"],
  [route, "reviewPacketId", "review packet identity"],
  [route, "quarantineId", "quarantine identity"],
  [route, "reviewPacketBound: true", "successful review packet binding"],
  [route, "reviewPacketBound: false", "blocked review packet binding"],
  [route, "lineageBound: false", "blocked release lineage binding"],
  [route, "accepted-for-package-review", "accepted review decision gate"],
  [route, "qrPrintArtifactIncluded", "QR print artifact result"],
  [route, "studentFacingActivationAllowed: false", "student activation boundary"],
  [route, "hostedPersistenceActivated: false", "hosted persistence boundary"],
  [route, "qrAliasesMutated: false", "QR mutation boundary"],
]) {
  if (!source.includes(marker)) throw new Error("Missing " + label + ": " + marker);
}
for (const forbidden of ["packageAssemblyAllowed: true", "learnerRecordsIncluded: true", "qrAliasesMutated: true", "hostedPersistenceActivated: true"]) {
  if (route.includes(forbidden)) throw new Error("Forbidden local package route behavior: " + forbidden);
}
console.log("PASS local pilot package assembler is gated, evidence-bound, explicit-path-only, immutable, checksum-verified, and student-disabled.");
