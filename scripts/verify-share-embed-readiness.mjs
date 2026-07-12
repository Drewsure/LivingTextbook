import { readFileSync } from "node:fs";

const plan = readSource("../apps/web/src/data/sampleShareEmbedReadinessPlan.ts");
const panel = readSource("../apps/web/src/features/routes/ShareEmbedReadinessPanel.tsx");
const routeVerifier = readSource("./verify-active-routes.mjs");
const competitiveMatrix = readSource("../docs/COMPETITIVE_FEATURE_COVERAGE_MATRIX.md");
const failures = [];

const requiredLanes = [
  ["private-assignment-link", "planned"],
  ["teacher-colleague-share", "planned"],
  ["public-share-link", "blocked"],
  ["website-embed", "optional"],
  ["public-community-discovery", "blocked"],
];

const requiredGates = [
  "focused-assignment-surface",
  "tenant-access-control",
  "reporting-boundary",
  "embed-origin-policy",
  "rights-visibility",
];

for (const [laneId, status] of requiredLanes) {
  requireLaneStatus(laneId, status);
}

for (const gateId of requiredGates) {
  requireText(plan, `gateId: "${gateId}"`, `Share/embed gate missing: ${gateId}`);
}

requireText(plan, "Private assignment links are the first share path", "Plan must prefer private assignment links first.");
requireText(plan, "Public sharing and iframe embeds stay blocked for v1", "Plan must block public sharing and iframe embeds for v1.");
requireText(plan, "IFrame embed blocked for v1", "Plan must explicitly block iframe embed for v1.");
requireText(plan, "Public community library", "Plan must preserve public community blocking.");
requireText(plan, "Teacher-visible reporting", "Plan must preserve teacher reporting for assignment sharing.");
requireText(panel, "Share and embed readiness", "Panel must expose share/embed heading.");
requireText(panel, "Blocks public release", "Panel must show public release blockers.");
requireText(routeVerifier, "Share and embed readiness", "Active route verifier must check share/embed panel.");
requireText(routeVerifier, "Public sharing blocked", "Active route verifier must check public sharing block.");
requireText(competitiveMatrix, "Embed on websites", "Competitive matrix must preserve embed coverage.");
requireText(competitiveMatrix, "Public sharing links", "Competitive matrix must preserve public sharing coverage.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(
  `PASS share/embed readiness covers ${requiredLanes.length} share lane(s) and ${requiredGates.length} release gate(s).`,
);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}

function requireLaneStatus(laneId, status) {
  const escaped = laneId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`laneId:\\s*"${escaped}"[\\s\\S]*?status:\\s*"${status}"`, "m");

  if (!pattern.test(plan)) {
    failures.push(`Share/embed lane ${laneId} must have status ${status}.`);
  }
}
