import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const files = {
  model: "packages/content-model/src/phaserCandidateEvidenceReturnPacket.ts",
  sample: "apps/web/src/data/samplePhaserCandidateEvidenceReturnPacket.ts",
  panel: "apps/web/src/features/game-offers/PhaserCandidateEvidenceReturnPacketPanel.tsx",
  page: "apps/web/src/app/teacher/game-readiness/page.tsx",
};
const sources = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, readFileSync(new URL(file, root), "utf8")]));
const failures = [];
const markers = [
  ["model", "PhaserCandidateEvidenceReturnPacket"],
  ["model", "PHASER_CANDIDATE_REQUIRED_RETURN_ARTIFACT_NAMES"],
  ["model", 'status === "awaiting-return"'],
  ["model", "importAllowed"],
  ["model", "routeReplacementAllowed"],
  ["model", "studentAssignmentAllowed"],
  ["model", "artifactsById"],
  ["model", "cites unknown artifact"],
  ["model", "cites unverified artifact"],
  ["sample", "memory-match-evidence-return-ministar-v1"],
  ["sample", 'status: "awaiting-return"'],
  ["sample", 'status: "missing"'],
  ["sample", "validatePhaserCandidateEvidenceReturnPacket"],
  ["panel", "Returned evidence preflight"],
  ["panel", "Import disabled"],
  ["panel", "Codex review required"],
  ["page", "PhaserCandidateEvidenceReturnPacketPanel"],
];
for (const [sourceName, marker] of markers) {
  if (!sources[sourceName].includes(marker)) failures.push(`${sourceName}: missing evidence-return marker: ${marker}`);
}
for (const forbidden of ["Math.random", "localStorage", "sessionStorage", "fetch(", "window."]) {
  if (sources.model.includes(forbidden) || sources.sample.includes(forbidden) || sources.panel.includes(forbidden)) {
    failures.push(`evidence return packet must remain deterministic and review-only: ${forbidden}`);
  }
}
if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}
console.log("PASS Phaser candidate evidence return packet is review-only, lane-complete, and import-disabled.");
