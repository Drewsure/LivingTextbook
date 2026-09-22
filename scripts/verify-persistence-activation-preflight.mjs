import { readFileSync } from "node:fs";

const failures = [];

function read(relativePath) {
  try {
    return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
  } catch {
    failures.push(`missing ${relativePath}`);
    return "";
  }
}

function requireFragments(label, source, fragments) {
  for (const fragment of fragments) {
    if (!source.includes(fragment)) failures.push(`${label}: missing ${fragment}`);
  }
}

const data = read("apps/web/src/data/samplePersistenceActivationPreflight.ts");
const panel = read("apps/web/src/features/persistence/PersistenceActivationPreflightPanel.tsx");
const page = read("apps/web/src/app/teacher/persistence/page.tsx");
const handoffModel = read("packages/content-model/src/pilotHandoff.ts");
const handoffFixture = read("apps/web/src/data/samplePilotHandoffPackage.ts");
const handoffPanel = read("apps/web/src/features/pilot/PilotHandoffPackagePanel.tsx");

requireFragments("activation preflight data", data, [
  'requestedMode: "durable-managed"',
  'status: "blocked"',
  "canActivate: false",
  'checkId: "teacher-operations-authorization"',
  'checkId: "school-policy"',
  'checkId: "deployment-configuration"',
  'label: "Hosted/local contract parity"',
]);
requireFragments("activation preflight panel", panel, [
  "Durable-write activation preflight",
  "Activation blocked",
  "No activation control",
  "cannot activate a provider",
  "preflight.checks.map",
]);
requireFragments("persistence workbench", page, [
  "PersistenceActivationPreflightPanel",
  "samplePersistenceActivationPreflight",
]);
requireFragments("pilot handoff contract", handoffModel, [
  "PilotHandoffActivationPreflightEvidence",
  "activationPreflightEvidence",
  "Pilot handoff activation preflight tenant must match the handoff tenant.",
  "Pilot handoff activation preflight requested mode must be durable-managed.",
  "Pilot handoff activation preflight canActivate must remain false.",
]);
requireFragments("pilot handoff fixture", handoffFixture, [
  "samplePersistenceActivationPreflight",
  "activationPreflightEvidence",
  "canActivate: false",
]);
requireFragments("pilot handoff panel", handoffPanel, [
  "Activation preflight binding",
  "handoffPackage.activationPreflightEvidence",
  "Can activate",
]);

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS durable-write activation preflight is review-only, explicitly blocked, and mounted in the persistence workbench.");
}
