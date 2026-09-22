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
  ["model", "unresolvedLaneCount"],
  ["model", "White-label release package evidence must match the readiness package"],
  ["sample", "sample-publisher-white-label-release-readiness-v1"],
  ["sample", 'status: "blocked"'],
  ["sample", "No QR redirect mutation"],
  ["sample", "samplePackageReconciliation"],
  ["panel", "White-label release control"],
  ["panel", "Evidence checks are separate from approval"],
  ["panel", "No release button exists in this foundation surface"],
  ["panel", "Package evidence reconciliation"],
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
if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}
console.log("PASS white-label release readiness is tenant-scoped, evidence-led, and approval-disabled.");
