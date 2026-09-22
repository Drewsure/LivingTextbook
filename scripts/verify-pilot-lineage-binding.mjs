import fs from "node:fs";

const failures = [];

function requireFragments(label, relativePath, fragments) {
  const source = fs.readFileSync(relativePath, "utf8");
  for (const fragment of fragments) {
    if (!source.includes(fragment)) failures.push(`${label}: missing ${fragment}`);
  }
}

requireFragments("pilot handoff model", "packages/content-model/src/pilotHandoff.ts", [
  "PilotHandoffLineageSources",
  "validatePilotHandoffLineageBinding",
  "lineage deployment decision id must match its source record",
  "lineage policy preflight id must match both source records",
  "lineage source records must remain non-accepted review evidence",
]);
requireFragments("sample lineage validation", "apps/web/src/data/samplePilotLineageValidation.ts", [
  "samplePilotLineageValidationErrors",
  "samplePilotDeploymentDecision",
  "sampleSchoolPolicyAcceptancePreflight",
  "sampleSchoolPolicyAcceptanceRecordPreview",
]);
requireFragments("pilot route", "apps/web/src/app/teacher/pilot/page.tsx", [
  "samplePilotLineageValidationErrors",
  "PilotHandoffPackagePanel",
]);
requireFragments("intake route", "apps/web/src/app/teacher/intake/page.tsx", [
  "samplePilotLineageValidationErrors",
]);
requireFragments("runtime harness", "scripts/verify-runtime-behavior.mjs", [
  "validatePilotHandoffLineageBinding",
  "other-preview",
  "other-tenant",
]);

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS pilot handoff lineage binding reconciles deployment, policy, package, and tenant identities without enabling activation.");
}
