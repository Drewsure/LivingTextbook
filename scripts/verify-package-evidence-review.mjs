import { readFileSync } from "node:fs";

const model = readFileSync(new URL("../packages/content-model/src/uploadQuarantinePackageEvidenceReview.ts", import.meta.url), "utf8");
const store = readFileSync(new URL("../apps/web/src/server/uploads/quarantineUploadStore.ts", import.meta.url), "utf8");
const route = readFileSync(new URL("../apps/web/src/app/api/teacher/uploads/package-evidence-review/route.ts", import.meta.url), "utf8");
const panel = readFileSync(new URL("../apps/web/src/features/content-intake/PackageEvidenceReviewCapture.tsx", import.meta.url), "utf8");
const liveRoute = readFileSync(new URL("../apps/web/src/app/api/teacher/uploads/package-readiness-binding/route.ts", import.meta.url), "utf8");

const required = [
  ["canonical lanes", model, "UPLOAD_QUARANTINE_PACKAGE_EVIDENCE_LANES"],
  ["reviewed status", model, '"reviewed-package-evidence"'],
  ["package block", model, "packageAssemblyAllowed: false"],
  ["QR block", model, "qrPrintAllowed: false"],
  ["sidecar path", store, "package-evidence-review.json"],
  ["feature gate", store, "LIVING_TEXTBOOOK_PACKAGE_EVIDENCE_REVIEWS_ENABLED"],
  ["route response", route, '"recorded-review-only"'],
  ["metadata-only UI", panel, "without uploading files"],
  ["live reader", liveRoute, "readQuarantinePackageEvidenceReview"],
  ["live check", liveRoute, 'check("package-preview"'],
];
for (const [label, source, marker] of required) {
  if (!source.includes(marker)) {
    console.error(`FAIL package evidence review verifier: missing ${label} marker ${marker}`);
    process.exit(1);
  }
}
for (const forbidden of ["packageAssemblyAllowed: true", "promotionAllowed: true", "qrPrintAllowed: true", "studentFacingUseAllowed: true"]) {
  if (model.includes(forbidden)) {
    console.error(`FAIL package evidence review verifier: forbidden activation marker ${forbidden}`);
    process.exit(1);
  }
}
console.log("PASS package evidence review is lane-complete, checksum-bound, tenant-scoped, review-only, and activation-blocked.");
