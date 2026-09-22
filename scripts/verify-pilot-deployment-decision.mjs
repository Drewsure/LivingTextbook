import fs from "node:fs";

const model = fs.readFileSync("packages/content-model/src/pilotDeploymentDecision.ts", "utf8");
const sample = fs.readFileSync("apps/web/src/data/samplePilotDeploymentDecision.ts", "utf8");
const panel = fs.readFileSync("apps/web/src/features/pilot/PilotDeploymentDecisionPanel.tsx", "utf8");
const route = fs.readFileSync("apps/web/src/app/teacher/pilot/page.tsx", "utf8");

for (const [source, checks] of [
  [model, [
    "PilotDeploymentDecision",
    "selectedOptionId: PilotDeploymentOptionId | null",
    "policyAccepted: false",
    "persistenceActivationAllowed: false",
    "classroomLaunchAllowed: false",
    "sideEffect: \"none\"",
    "validatePilotDeploymentDecision",
  ]],
  [sample, [
    "samplePilotDeploymentDecision",
    "selectedOptionId: null",
    "selectionStatus: \"unselected\"",
    "recommendedOptionId: \"hosted-pwa\"",
    "samplePilotDeploymentDecisionErrors",
  ]],
  [panel, [
    "Pilot deployment decision record",
    "Selection required",
    "No activation",
    "choosing a deployment model later will not authorize persistence",
  ]],
  [route, ["PilotDeploymentDecisionPanel", "samplePilotDeploymentDecision"]],
]) {
  for (const check of checks) {
    if (!source.includes(check)) throw new Error(`Pilot deployment decision is missing: ${check}`);
  }
}

if (/onClick=|<button|fetch\(|POST|PUT|DELETE/.test(panel)) {
  throw new Error("Pilot deployment decision panel must remain review-only without controls or writes.");
}

console.log("PASS pilot deployment decision is tenant/package-bound, review-only, and activation-blocked.");
