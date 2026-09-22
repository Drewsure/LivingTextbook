import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const files = {
  model: "packages/content-model/src/phaserCandidateEvidenceAdjudication.ts",
  sample: "apps/web/src/data/samplePhaserCandidateEvidenceAdjudication.ts",
  panel: "apps/web/src/features/game-offers/PhaserCandidateEvidenceAdjudicationPanel.tsx",
  page: "apps/web/src/app/teacher/game-readiness/page.tsx",
};
const sources = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, readFileSync(new URL(file, root), "utf8")]));
const failures = [];
const markers = [
  ["model", "PhaserCandidateEvidenceAdjudication"],
  ["model", "awaiting-external-return"],
  ["model", "returned-awaiting-codex-review"],
  ["model", "No wrapper proposal execution"],
  ["model", "No integration approval"],
  ["sample", "memory-match-evidence-adjudication-ministar-v1"],
  ["sample", "Await the evidence-only return packet"],
  ["panel", "Evidence adjudication state"],
  ["panel", "Approval disabled"],
  ["page", "PhaserCandidateEvidenceAdjudicationPanel"],
];
for (const [sourceName, marker] of markers) {
  if (!sources[sourceName].includes(marker)) failures.push(`${sourceName}: missing adjudication marker: ${marker}`);
}
for (const forbidden of ["Math.random", "localStorage", "sessionStorage", "fetch(", "window.", "importAllowed: true"]) {
  if (sources.model.includes(forbidden) || sources.sample.includes(forbidden) || sources.panel.includes(forbidden)) failures.push(`adjudication must remain review-only: ${forbidden}`);
}
if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}
console.log("PASS Phaser candidate evidence adjudication remains explicit, owner-bound, and approval-disabled.");
