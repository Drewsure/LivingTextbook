import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const files = {
  model: "packages/content-model/src/phaserCandidateWrapperBridge.ts",
  index: "packages/content-model/src/index.ts",
  sample: "apps/web/src/data/sampleMemoryMatchWrapperBridge.ts",
  panel: "apps/web/src/features/game-offers/MemoryMatchWrapperBridgePanel.tsx",
  page: "apps/web/src/app/teacher/game-readiness/page.tsx",
};
const sources = Object.fromEntries(Object.entries(files).map(([key, path]) => [key, readFileSync(new URL(path, root), "utf8")]));
const failures = [];

for (const [name, marker] of [
  ["model", "PhaserCandidateWrapperBridge"],
  ["model", "PHASER_CANDIDATE_WRAPPER_BRIDGE_REQUIRED_CHECKS"],
  ["model", "No direct source import"],
  ["model", "pairing-reinforcement-v1"],
  ["index", 'export * from "./phaserCandidateWrapperBridge";'],
  ["sample", "memory-match-wrapper-bridge-2026-10-02"],
  ["sample", 'status: "blocked"'],
  ["sample", "memory-match-v1"],
  ["sample", "keyboard navigation"],
  ["model", "No scene-owned scoring, mastery, Star Dust, rewards, persistence, or reporting"],
  ["panel", "Wrapper bridge review"],
  ["panel", "Admission checks"],
  ["panel", "Required normalization"],
  ["page", "MemoryMatchWrapperBridgePanel"],
]) {
  if (!sources[name].includes(marker)) failures.push(`${name}: missing wrapper bridge marker: ${marker}`);
}

for (const forbidden of ["MemoryMatchScene.ts", "importAllowed: true", "routeWriteAllowed: true", "studentAssignmentAllowed: true"]) {
  if (sources.model.includes(forbidden) || sources.sample.includes(forbidden) || sources.panel.includes(forbidden)) {
    failures.push(`wrapper bridge must remain review-only: ${forbidden}`);
  }
}

const checkCount = sources.sample.match(/checkId: "/g)?.length ?? 0;
if (checkCount !== 8) failures.push(`wrapper bridge must expose eight admission checks; found ${checkCount}.`);

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS Memory Match wrapper bridge records external evidence normalization, canonical ownership, and promotion blockers.");
