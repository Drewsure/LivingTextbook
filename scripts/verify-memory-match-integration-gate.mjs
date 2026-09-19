import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const files = {
  gate: "apps/web/src/data/sampleCanonicalMemoryMatchIntegrationGate.ts",
  panel: "apps/web/src/features/game-offers/CanonicalMemoryMatchIntegrationGatePanel.tsx",
  readinessPage: "apps/web/src/app/teacher/game-readiness/page.tsx",
  candidateReview: "apps/web/src/data/samplePhaserCandidateContractReview.ts",
  readinessRollup: "apps/web/src/data/sampleAiPrototypeIntegrationReadinessGate.ts",
  canonicalGameVerifier: "scripts/verify-canonical-game-integrations.mjs",
  sourceIdentity: "packages/content-model/src/phaserCandidateSourceIdentity.ts",
};

const sources = Object.fromEntries(
  Object.entries(files).map(([key, relativePath]) => [key, readFileSync(new URL(relativePath, root), "utf8")]),
);
const failures = [];

const requiredMarkers = [
  ["gate", "canonical-memory-match-integration-gate-ministar"],
  ["gate", 'gameMode: "memory-match"'],
  ["gate", 'parentEngine: "pairing"'],
  ["gate", "PairingMemoryMatchGame.tsx"],
  ["gate", "apps/web/src/app/memory/[code]/page.tsx"],
  ["gate", "MemoryMatchDemoFlow"],
  ["gate", "pairing-reinforcement-v1"],
  ["sourceIdentity", "PHASER_CANDIDATE_SOURCE_SNAPSHOT_ID"],
  ["sourceIdentity", "PHASER_CANDIDATE_SOURCE_COMMIT_SHA"],
  ["gate", "prototype_wrapper_adapter_review"],
  ["gate", "prototype_fixture_replay_report"],
  ["gate", "prototype_event_replay_report"],
  ["gate", "prototype_audio_coverage_report"],
  ["gate", "prototype_scoring_replay_report"],
  ["gate", "prototype_mobile_accessibility_report"],
  ["gate", "codex_integration_review_decision"],
  ["gate", "No direct source import"],
  ["gate", "No package promotion or student assignment"],
  ["panel", "Canonical game integration gate"],
  ["panel", "Active reference surface"],
  ["panel", "Evidence only; not promoted"],
  ["panel", "No live handoff"],
  ["readinessPage", "sampleCanonicalMemoryMatchIntegrationGate"],
  ["readinessPage", "CanonicalMemoryMatchIntegrationGatePanel"],
  ["candidateReview", "phaser-contract-review-ministar-memory-match"],
  ["candidateReview", "No direct source import"],
  ["candidateReview", "No scene-owned scoring"],
  ["readinessRollup", "prototype-integration-readiness-gate-"],
  ["canonicalGameVerifier", 'id: "memory-match"'],
  ["canonicalGameVerifier", "PairingMemoryMatchGame.tsx"],
];

for (const [sourceName, marker] of requiredMarkers) {
  if (!sources[sourceName].includes(marker)) {
    failures.push(`${sourceName}: missing Memory Match gate marker: ${marker}`);
  }
}

for (const forbidden of ["import.*MemoryMatchScene", "from \"@/legacy\"", "sourceFiles.push"]) {
  const expression = new RegExp(forbidden);
  if (expression.test(sources.gate) || expression.test(sources.panel) || expression.test(sources.readinessPage)) {
    failures.push(`active Memory Match gate surface contains a forbidden source-promotion pattern: ${forbidden}`);
  }
}

const laneCount = sources.gate.match(/laneId: \"/g)?.length ?? 0;
if (laneCount !== 9) {
  failures.push(`Memory Match gate must define nine evidence lanes; found ${laneCount}.`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS canonical Memory Match gate preserves frozen provenance, pairing ownership, evidence lanes, and promotion blockers.");
