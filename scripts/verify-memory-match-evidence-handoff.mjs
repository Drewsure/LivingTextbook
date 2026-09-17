import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const files = {
  packet: "apps/web/src/data/sampleMemoryMatchEvidenceHandoffPacket.ts",
  panel: "apps/web/src/features/game-offers/MemoryMatchEvidenceHandoffPacketPanel.tsx",
  page: "apps/web/src/app/teacher/game-readiness/page.tsx",
  gate: "apps/web/src/data/sampleCanonicalMemoryMatchIntegrationGate.ts",
};
const sources = Object.fromEntries(
  Object.entries(files).map(([key, file]) => [key, readFileSync(new URL(file, root), "utf8")]),
);
const failures = [];

const requiredMarkers = [
  ["packet", "memory-match-evidence-handoff-ministar-v1"],
  ["packet", 'targetBuilder: "Z.ai"'],
  ["packet", 'handoffState: "ready-for-human-handoff"'],
  ["packet", 'integrationState: "blocked"'],
  ["packet", "return-package-manifest.json"],
  ["packet", "reviewed-unit-fixture.json"],
  ["packet", "standard-event-replay.json"],
  ["packet", "audio-coverage-report.json"],
  ["packet", "deterministic-scoring-replay.json"],
  ["packet", "mobile-accessibility-report.json"],
  ["packet", "wrapper-adapter-review.md"],
  ["packet", "source-manifest.sha256"],
  ["packet", "README.md with setup and known limitations"],
  ["packet", "No direct source import into apps/web or apps/ai-service"],
  ["packet", "No package promotion, release, QR activation, or student assignment"],
  ["packet", "sampleCanonicalMemoryMatchIntegrationGate"],
  ["panel", "External evidence handoff packet"],
  ["panel", "Ready for human handoff"],
  ["panel", "Integration blocked"],
  ["panel", "No live dispatch"],
  ["panel", "Required return artifacts"],
  ["page", "sampleMemoryMatchEvidenceHandoffPacket"],
  ["page", "MemoryMatchEvidenceHandoffPacketPanel"],
  ["gate", "canonical-memory-match-integration-gate-ministar"],
];

for (const [sourceName, marker] of requiredMarkers) {
  if (!sources[sourceName].includes(marker)) {
    failures.push(`${sourceName}: missing evidence handoff marker: ${marker}`);
  }
}

const artifactMarkers = [
  "return-package-manifest.json",
  "reviewed-unit-fixture.json",
  "standard-event-replay.json",
  "audio-coverage-report.json",
  "deterministic-scoring-replay.json",
  "mobile-accessibility-report.json",
  "wrapper-adapter-review.md",
  "source-manifest.sha256",
  "README.md with setup and known limitations",
];
const artifactCount = artifactMarkers.filter((marker) => sources.packet.includes(marker)).length;
if (artifactCount !== 9) {
  failures.push("Memory Match evidence handoff must retain the nine-artifact return contract.");
}

for (const forbidden of ["Math.random", "localStorage", "sessionStorage", "MemoryMatchScene.ts"]) {
  if (sources.packet.includes(forbidden) || sources.panel.includes(forbidden)) {
    failures.push(`evidence handoff packet or panel contains forbidden runtime/source ownership: ${forbidden}`);
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS Memory Match evidence handoff packet is bounded, human-triggered, and blocked from integration.");
