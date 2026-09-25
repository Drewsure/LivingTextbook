import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const files = {
  model: "packages/content-model/src/controlledPilotHumanReviewNextGateHandoff.ts",
  sample: "apps/web/src/data/sampleControlledPilotHumanReviewNextGateHandoff.ts",
  panel: "apps/web/src/features/pilot/ControlledPilotHumanReviewNextGateHandoffPanel.tsx",
  route: "apps/web/src/app/teacher/release-control/[tenantId]/page.tsx",
};
const sources = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, readFileSync(new URL(file, root), "utf8")]));
const failures = [];
for (const [source, marker] of [
  ["model", "ControlledPilotHumanReviewNextGateHandoff"],
  ["model", "ready-for-next-gate"],
  ["model", "No approval capture"],
  ["model", "No persistence write"],
  ["model", "validateControlledPilotHumanReviewNextGateHandoff"],
  ["sample", "buildSampleControlledPilotHumanReviewNextGateHandoff"],
  ["panel", "Controlled-pilot next-gate handoff"],
  ["panel", "Evidence handoff with no approval authority"],
  ["route", "ControlledPilotHumanReviewNextGateHandoffPanel"],
]) {
  if (!sources[source].includes(marker)) failures.push(`${source}: missing ${marker}`);
}
for (const forbidden of ["Math.random", "localStorage", "sessionStorage", "fetch(", "window."]) {
  if (Object.values(sources).some((source) => source.includes(forbidden))) failures.push(`next-gate handoff must remain deterministic and review-only: ${forbidden}`);
}

const moduleSource = readFileSync(new URL("packages/content-model/src/controlledPilotHumanReviewNextGateHandoff.ts", root), "utf8");
if (!moduleSource.includes("status === \"ready-for-next-gate\"")) failures.push("next-gate handoff must derive readiness from accepted adjudication.");
if (!moduleSource.includes("status === \"blocked\"")) failures.push("next-gate handoff must preserve blocked evidence outcomes.");

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

execFileSync(process.execPath, [fileURLToPath(new URL("./verify-controlled-pilot-human-review-adjudication.mjs", import.meta.url))], { stdio: "inherit" });
console.log("PASS controlled-pilot next-gate handoff keeps adjudication lineage, derived status, and operational boundaries explicit.");
