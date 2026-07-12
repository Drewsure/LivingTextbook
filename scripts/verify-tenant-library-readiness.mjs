import { readFileSync } from "node:fs";

const plan = readSource("../apps/web/src/data/sampleTenantLibraryPlan.ts");
const panel = readSource("../apps/web/src/features/publisher/TenantLibraryPlanPanel.tsx");
const routeVerifier = readSource("./verify-active-routes.mjs");
const docs = readSource("../docs/COMPETITIVE_FEATURE_COVERAGE_MATRIX.md");
const failures = [];

const plannedStages = ["teacher-private-drafts", "tenant-approved-library", "school-shared-library"];
const blockedStages = ["public-community-library"];
const governanceGates = ["ownership-and-copy", "rights-and-source", "student-data-separation", "public-governance"];

for (const stageId of plannedStages) {
  requireStageStatus(stageId, "planned");
}

for (const stageId of blockedStages) {
  requireStageStatus(stageId, "blocked");
}

for (const gateId of governanceGates) {
  requireText(plan, `gateId: "${gateId}"`, `Tenant library governance gate missing: ${gateId}`);
}

requireText(plan, "Public community library blocked for v1", "Tenant library plan must explicitly block public community v1.");
requireText(plan, "No student assignment", "Private drafts must not become student-facing.");
requireText(plan, "No student data copied", "School sharing must not copy student data.");
requireText(panel, "Private tenant library", "Tenant library panel must expose its heading.");
requireText(panel, "Public community decision", "Tenant library panel must expose public community decision.");
requireText(routeVerifier, "Private tenant library", "Active route verifier must check tenant library panel.");
requireText(routeVerifier, "Teacher private drafts", "Active route verifier must check private drafts.");
requireText(routeVerifier, "Tenant-approved package library", "Active route verifier must check tenant-approved library.");
requireText(docs, "Private teacher drafts inside one tenant", "Competitive matrix docs must preserve private library first path.");
requireText(docs, "Public community sharing is not a v1 requirement", "Competitive matrix docs must preserve public community deferral.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(
  `PASS tenant library readiness covers ${plannedStages.length} planned private stage(s), ${blockedStages.length} blocked public stage(s), and ${governanceGates.length} governance gate(s).`,
);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}

function requireStageStatus(stageId, status) {
  const escaped = stageId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`stageId:\\s*"${escaped}"[\\s\\S]*?status:\\s*"${status}"`, "m");

  if (!pattern.test(plan)) {
    failures.push(`Tenant library stage ${stageId} must have status ${status}.`);
  }
}
