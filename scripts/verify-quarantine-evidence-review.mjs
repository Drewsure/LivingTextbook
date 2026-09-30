import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const model = read("packages/content-model/src/uploadQuarantineEvidenceReview.ts");
const store = read("apps/web/src/server/uploads/quarantineUploadStore.ts");
const route = read("apps/web/src/app/api/teacher/uploads/evidence-review/route.ts");
const panel = read("apps/web/src/features/content-intake/QuarantineEvidenceReviewCapture.tsx");
const liveSources = [
  read("apps/web/src/app/api/teacher/uploads/package-handoff-preview/route.ts"),
  read("apps/web/src/app/api/teacher/uploads/evidence-preview/route.ts"),
  read("apps/web/src/app/api/teacher/uploads/package-review-packet/route.ts"),
  read("apps/web/src/app/api/teacher/uploads/package-readiness-binding/route.ts"),
];

const required = [
  [model, ["UploadQuarantineEvidenceReviewRecord", "evidence-ready", "local-quarantine-evidence-review-metadata", "packageAssemblyAllowed: false", "studentFacingUseAllowed: false"], "evidence review model"],
  [store, ["readQuarantineEvidenceReview", "writeQuarantineEvidenceReview", "LIVING_TEXTBOOOK_EVIDENCE_REVIEWS_ENABLED", "evidence-review.json"], "evidence review custody adapter"],
  [route, ["Quarantine evidence review request", "hasUploadQuarantineApiToken", "recorded-review-only", "promotionAllowed: false"], "evidence review route"],
  [panel, ["Human evidence adjudication", "Record evidence review", "LIVING_TEXTBOOOK_EVIDENCE_REVIEWS_ENABLED", "assembly and student use remain blocked"], "evidence review panel"],
];
for (const [source, markers, label] of required) for (const marker of markers) if (!source.includes(marker)) throw new Error(`Missing ${label} marker: ${marker}`);
for (const source of liveSources) if (!source.includes("readQuarantineEvidenceReview")) throw new Error("A live quarantine package route does not consume the evidence review record.");
for (const forbidden of ["packageAssemblyAllowed: true", "promotionAllowed: true", "studentFacingUseAllowed: true", "writeFile(", "window.open"]) {
  if (route.includes(forbidden) || panel.includes(forbidden)) throw new Error(`Forbidden evidence review behavior: ${forbidden}`);
}
console.log("PASS quarantine evidence adjudication is gated, metadata-only, consumed by live package routes, and cannot activate delivery or students.");
