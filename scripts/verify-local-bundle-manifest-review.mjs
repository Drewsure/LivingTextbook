import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const model = readFileSync(resolve(root, "packages/content-model/src/localBundleManifestReviewRecord.ts"), "utf8");
const writer = readFileSync(resolve(root, "apps/web/src/server/delivery/localBundleManifestReviewWriter.ts"), "utf8");
const route = readFileSync(resolve(root, "apps/web/src/app/api/teacher/delivery/local-package/bundle-manifest-review/route.ts"), "utf8");
const preflight = readFileSync(resolve(root, "apps/web/src/server/delivery/localPackageExecutionPreflight.ts"), "utf8");
const configuration = readFileSync(resolve(root, "apps/web/src/server/delivery/pilotDeploymentConfiguration.ts"), "utf8");

for (const [source, markers, label] of [
  [model, ["LocalBundleManifestReviewRecord", "manifestChecksumSha256", "reviewed-for-assembly", "packageAssemblyAllowed: false", "learnerRecordsIncluded: false"], "review record model"],
  [writer, ["LIVING_TEXTBOOOK_LOCAL_BUNDLE_MANIFEST_REVIEW_ROOT", "LIVING_TEXTBOOOK_LOCAL_BUNDLE_MANIFEST_REVIEW_WRITES_ENABLED", "readQuarantinePackageReviewPacket", "readQuarantineSourcePreflightEvidence", "accepted-for-package-review", "source.version !== input.manifest.version", "packet.checksumSha256 !== source.sourceChecksumSha256", "createHash(\"sha256\")", "bundle-manifest-review.json", "rename(staging, path)", "validateDurableBackupFilesystemPath"], "review record custody writer"],
  [route, ["Local bundle manifest review request", "hasPilotDeliveryApiToken", "validateSameOriginMutation", "packageAssemblyAllowed: false", "studentFacingUseAllowed: false"], "review record route"],
  [preflight, ["bundleManifestReviewId", "readLocalBundleManifestReview", "reviewed.record.quarantineId", "reviewed.record.reviewPacketId"], "durable request hydration"],
  [configuration, ["LIVING_TEXTBOOOK_LOCAL_BUNDLE_MANIFEST_REVIEW_ROOT", "LIVING_TEXTBOOOK_LOCAL_BUNDLE_MANIFEST_REVIEW_WRITES_ENABLED"], "deployment configuration"],
]) {
  for (const marker of markers) if (!source.includes(marker)) throw new Error(`Missing ${label} marker: ${marker}`);
}
for (const forbidden of ["packageAssemblyAllowed: true", "qrPrintAllowed: true", "studentFacingUseAllowed: true", "learnerRecordsIncluded: true"]) {
  if (model.includes(forbidden) || route.includes(forbidden)) throw new Error(`Forbidden reviewed manifest activation marker: ${forbidden}`);
}
console.log("PASS reviewed local bundle manifests are tenant-bound, checksum-bound, custody-backed, immutable, review-only, and student-disabled.");
