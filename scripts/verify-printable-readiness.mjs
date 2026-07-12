import { readFileSync } from "node:fs";

const plan = readSource("../apps/web/src/data/samplePrintableOutputPlan.ts");
const panel = readSource("../apps/web/src/features/content-intake/PrintableOutputReadinessPanel.tsx");
const routeVerifier = readSource("./verify-active-routes.mjs");
const docs = readSource("../docs/ACTIVITY_PATHWAY_COMPATIBILITY_MATRIX.md");
const failures = [];

const readyOutputs = ["vocabulary-listening-sheet", "sentence-practice-sheet"];
const plannedOutputs = ["teacher-answer-key"];
const blockedOutputs = ["word-search-printable", "crossword-printable"];
const readyGates = ["print-layout-renderer"];
const blockedGates = ["qr-audio-bridge", "version-and-rights", "teacher-export-policy"];

for (const outputId of readyOutputs) {
  requireItemStatus(outputId, "ready");
}

for (const outputId of plannedOutputs) {
  requireItemStatus(outputId, "planned");
}

for (const outputId of blockedOutputs) {
  requireItemStatus(outputId, "blocked");
}

for (const gateId of blockedGates) {
  requireGateStatus(gateId, "blocked");
}

for (const gateId of readyGates) {
  requireGateStatus(gateId, "ready");
}

requireText(plan, "PDF export blocked", "Printable plan must explicitly block PDF export.");
requireText(plan, "No automatic Star Dust or mastery", "Printable plan must not imply automatic digital mastery.");
requireText(plan, "Printed QR or short code must resolve", "Printable plan must preserve QR/audio bridge.");
requireText(plan, "/print/partner-demo-unit-1", "Printable plan must reference the sample publisher print route.");
requireText(panel, "Printable output readiness", "Printable readiness panel must expose its heading.");
requireText(panel, "PDF export blocked", "Printable readiness panel must expose export blocked state.");
requireText(routeVerifier, "Printable output readiness", "Active route verifier must check printable readiness panel.");
requireText(routeVerifier, "Vocabulary listening sheet", "Active route verifier must check printable vocabulary output.");
requireText(routeVerifier, "Sentence practice worksheet", "Active route verifier must check printable sentence output.");
requireText(routeVerifier, "/print/demo-unit-1", "Active route verifier must check MiniStar printable route.");
requireText(routeVerifier, "/print/partner-demo-unit-1", "Active route verifier must check sample publisher printable route.");
requireText(docs, "Printable vocabulary sheet", "Activity pathway docs must preserve printable vocabulary planning.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(
  `PASS printable readiness covers ${readyOutputs.length} ready preview output(s), ${plannedOutputs.length} planned output(s), ${blockedOutputs.length} blocked puzzle output(s), and ${blockedGates.length} export blocker(s).`,
);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}

function requireItemStatus(outputId, status) {
  const escaped = outputId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`outputId:\\s*"${escaped}"[\\s\\S]*?status:\\s*"${status}"`, "m");

  if (!pattern.test(plan)) {
    failures.push(`Printable output ${outputId} must have status ${status}.`);
  }
}

function requireGateStatus(gateId, status) {
  const escaped = gateId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`gateId:\\s*"${escaped}"[\\s\\S]*?status:\\s*"${status}"`, "m");

  if (!pattern.test(plan)) {
    failures.push(`Printable gate ${gateId} must have status ${status}.`);
  }
}
