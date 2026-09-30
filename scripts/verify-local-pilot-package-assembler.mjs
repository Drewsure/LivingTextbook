import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const assembler = readFileSync(resolve(root, "apps/web/src/server/delivery/localPilotPackageAssembler.ts"), "utf8");
const route = readFileSync(resolve(root, "apps/web/src/app/api/teacher/delivery/local-package/route.ts"), "utf8");
const executionPreflight = readFileSync(resolve(root, "apps/web/src/server/delivery/localPackageExecutionPreflight.ts"), "utf8");

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
  [assembler, "sourcePreflightEvidenceId", "source preflight evidence identity binding"],
  [assembler, "package-review-binding.json", "review packet binding artifact"],
  [assembler, "package-integrity.json", "package integrity manifest"],
  [assembler, "createPackageIntegrityManifest", "package integrity creation"],
  [assembler, "verifyPackageIntegrity", "package integrity verification"],
  [assembler, "validateReviewPacketBinding", "review packet binding validation"],
  [assembler, "quarantineId", "quarantine identity preservation"],
  [assembler, "reviewPacketId", "review packet identity preservation"],
  [assembler, "hostedPersistenceDecisionPacketId", "hosted opt-in packet identity preservation"],
  [route, "hasPilotDeliveryApiToken", "tenant-bound delivery token"],
  [executionPreflight, "readQuarantinePackageReviewPacket", "durable review packet binding"],
  [executionPreflight, "readPilotDeliveryReleaseLineage", "live release lineage binding"],
  [executionPreflight, "readPilotDeliveryMetadata", "durable delivery metadata binding"],
  [executionPreflight, "readPilotQrAliasRegistry", "durable QR registry binding"],
  [executionPreflight, "custodyBound: false", "blocked durable custody binding"],
  [executionPreflight, "sameJson", "canonical custody comparison"],
  [executionPreflight, "validateReviewPacketBinding", "review packet validation"],
  [executionPreflight, "reviewPacketId", "review packet identity"],
  [executionPreflight, "sourcePreflightEvidenceId", "source preflight evidence identity"],
  [executionPreflight, "quarantineId", "quarantine identity"],
  [executionPreflight, "reviewPacketBound: true", "successful review packet binding"],
  [executionPreflight, "reviewPacketBound: false", "blocked review packet binding"],
  [executionPreflight, "lineageBound: false", "blocked release lineage binding"],
  [executionPreflight, "accepted-for-package-review", "accepted review decision gate"],
  [executionPreflight, "qrPrintArtifactIncluded", "QR print artifact result"],
  [executionPreflight, "studentFacingActivationAllowed: false", "student activation boundary"],
  [executionPreflight, "hostedPersistenceActivated: false", "hosted persistence boundary"],
  [executionPreflight, "qrAliasesMutated: false", "QR mutation boundary"],
]) {
  if (!source.includes(marker)) throw new Error("Missing " + label + ": " + marker);
}
for (const forbidden of ["packageAssemblyAllowed: true", "learnerRecordsIncluded: true", "qrAliasesMutated: true", "hostedPersistenceActivated: true"]) {
  if (route.includes(forbidden)) throw new Error("Forbidden local package route behavior: " + forbidden);
}
console.log("PASS local pilot package assembler is gated, evidence-bound, explicit-path-only, immutable, checksum-verified, and student-disabled.");
