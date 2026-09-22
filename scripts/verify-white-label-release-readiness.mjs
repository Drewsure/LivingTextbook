import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const files = {
  model: "packages/content-model/src/whiteLabelReleaseReadiness.ts",
  sample: "apps/web/src/data/sampleWhiteLabelReleaseReadiness.ts",
  panel: "apps/web/src/features/release/WhiteLabelReleaseReadinessPanel.tsx",
  page: "apps/web/src/app/teacher/release-readiness/page.tsx",
  nav: "apps/web/src/components/layout/AppShell.tsx",
  routes: "docs/ACTIVE_ROUTE_VERIFICATION_LIST.md",
};
const sources = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, readFileSync(new URL(file, root), "utf8")]));
const failures = [];
const markers = [
  ["model", "WhiteLabelReleaseReadiness"],
  ["model", "WHITE_LABEL_RELEASE_REQUIRED_PHASE_IDS"],
  ["model", "productionApprovalAllowed: false"],
  ["model", "studentProductionLaunchAllowed: false"],
  ["model", "WhiteLabelReleasePackageEvidence"],
  ["model", "WhiteLabelReleasePilotEvidence"],
  ["model", "WhiteLabelReleaseQualityEvidence"],
  ["model", "WhiteLabelReleaseControlEvidence"],
  ["model", "WhiteLabelReleaseRouteEvidence"],
  ["model", "exactly seven quality evidence records"],
  ["model", "unresolvedLaneCount"],
  ["model", "package evidence must match the readiness tenant"],
  ["model", "control evidence must match the readiness tenant"],
  ["model", "route evidence must match the readiness tenant"],
  ["model", "route evidence must match the readiness package"],
  ["model", "Pilot-ready white-label release readiness requires every quality check"],
  ["model", "Pilot-ready white-label release readiness requires every quality evidence record"],
  ["model", "Pilot-ready white-label release readiness requires review-only package evidence"],
  ["model", "Pilot-ready white-label release readiness requires pilot-ready pilot evidence"],
  ["model", "route evidence counts must reconcile"],
  ["model", "White-label release package evidence must match the readiness package"],
  ["sample", "sample-publisher-white-label-release-readiness-v1"],
  ["sample", 'status: "blocked"'],
  ["sample", "No QR redirect mutation"],
  ["sample", "samplePackageReconciliation"],
  ["sample", "tenantId: samplePackageReconciliation.tenantId"],
  ["sample", "tenantId: samplePackagePublishGate.tenantId"],
  ["sample", "packageId: samplePackageReconciliation.packageId"],
  ["sample", "samplePilotReviewDecision"],
  ["sample", "browser-rehearsal-evidence"],
  ["sample", "sample-active-route-matrix"],
  ["sample", "expectedActiveRouteCount: 89"],
  ["panel", "White-label release control"],
  ["panel", "Evidence checks are separate from approval"],
  ["panel", "No release button exists in this foundation surface"],
  ["panel", "Package evidence reconciliation"],
  ["panel", "Controlled pilot decision"],
  ["panel", "Evidence: "],
  ["panel", "Release-control evidence"],
  ["panel", "Publish gates and approvals are joined before promotion"],
  ["panel", "Route and deployment evidence"],
  ["panel", "Active routes reconcile before deployment decisions"],
  ["panel", "Evidence workbench map"],
  ["panel", "reviewLinks"],
  ["page", "WhiteLabelReleaseReviewLink"],
  ["page", "/teacher/game-readiness"],
  ["page", "/teacher/persistence"],
  ["page", "/teacher/pilot/requirements/"],
  ["page", "/teacher/intake"],
  ["page", "WhiteLabelReleaseReadinessPanel"],
  ["nav", "/teacher/release-readiness"],
  ["routes", "/teacher/release-readiness"],
];
for (const [sourceName, marker] of markers) {
  if (!sources[sourceName].includes(marker)) failures.push(`${sourceName}: missing release-readiness marker: ${marker}`);
}
for (const forbidden of ["Math.random", "localStorage", "sessionStorage", "fetch(", "window.", "productionApprovalAllowed: true", "studentProductionLaunchAllowed: true"]) {
  for (const sourceName of ["model", "sample", "panel"]) {
    if (sources[sourceName].includes(forbidden)) failures.push(`${sourceName}: release readiness must remain review-only: ${forbidden}`);
  }
}
if (sources.panel.includes("/teacher/pilot/requirements/sample-publisher")) {
  failures.push("panel: reusable release readiness must not hard-code the sample tenant requirements route");
}
if (!sources.page.includes("encodeURIComponent(samplePublisherTenant.id)")) {
  failures.push("page: sample release readiness must derive the requirements route from the tenant id");
}
if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}
console.log("PASS white-label release readiness is tenant-scoped, evidence-led, and approval-disabled.");
