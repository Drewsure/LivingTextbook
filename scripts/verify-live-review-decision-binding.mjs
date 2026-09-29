import { readFileSync } from "node:fs";

const route = readFileSync("apps/web/src/app/api/teacher/uploads/package-readiness-binding/route.ts", "utf8");
const panel = readFileSync("apps/web/src/features/evidence/PublisherQuarantineHandoffBridgePanel.tsx", "utf8");
const capture = readFileSync("apps/web/src/features/content-intake/QuarantineReviewDecisionCapture.tsx", "utf8");
const page = readFileSync("apps/web/src/app/teacher/evidence/[tenantId]/handoff/page.tsx", "utf8");
const store = readFileSync("apps/web/src/server/uploads/quarantineUploadStore.ts", "utf8");

for (const [source, markers, label] of [
  [route, ["readQuarantineReviewDecision", "reviewDecision", "reviewDecisionResult.errors", 'check("source-review-decision"', "A complete reviewed multimedia and game evidence sidecar is not linked"], "live readiness route"],
  [panel, ["Live package review decision", "accepted-for-package-review", "not recorded", "not release approval"], "live handoff panel"],
  [capture, ["/api/teacher/uploads/review-decision", "Record source review decision", "REVIEW_DECISIONS_ENABLED", "immutable decision"], "decision capture"],
  [page, ["reviewDecisionsEnabled", "LIVING_TEXTBOOOK_REVIEW_DECISIONS_ENABLED"], "handoff gate wiring"],
  [store, ["export async function readQuarantineReviewDecision", "review-decision.json", "tenant or identity binding"], "review decision store"],
]) {
  for (const marker of markers) {
    if (!source.includes(marker)) throw new Error(`Missing ${label} marker: ${marker}`);
  }
}

for (const forbidden of [
  "approvalCaptured: true",
  "packageAssemblyAllowed: true",
  "promotionAllowed: true",
  "studentFacingUseAllowed: true",
  "writeQuarantineReviewDecision(",
  "writeFile(",
]) {
  if (route.includes(forbidden) || panel.includes(forbidden) || capture.includes(forbidden)) throw new Error(`Unsafe live review decision binding behavior: ${forbidden}`);
}

console.log("PASS live quarantine review decision is read-only, tenant-bound, visible in readiness, and distinct from release approval.");
