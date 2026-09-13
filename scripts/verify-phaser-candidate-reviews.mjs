import { readFileSync } from "node:fs";

const files = [
  "packages/content-model/src/phaserCandidateContractReview.ts",
  "apps/web/src/data/samplePhaserCandidateContractReview.ts",
  "apps/web/src/features/game-offers/PhaserCandidateContractReviewPanel.tsx",
  "apps/web/src/app/teacher/prototypes/[tenantId]/page.tsx",
  "docs/agent-briefs/ZAI_MEMORY_MATCH_EVIDENCE_REQUEST.md",
  "scripts/verify-phaser-candidate-package-contract.mjs",
];

const source = files.map((file) => readFileSync(file, "utf8")).join("\n");
const requiredMarkers = [
  "PhaserCandidateContractReview",
  "validatePhaserCandidateContractReviews",
  "phaser-contract-review-ministar-memory-match",
  "phaser-contract-review-ministar-balloon-pop",
  "ministar-lab-frozen-2026-09-12-eb79ddf",
  "eb79ddf5940ab47cc3c45c119c67ee1b6b958e55",
  "sourceCommitSha",
  "sourceFiles",
  "sha256",
  "Source evidence manifest",
  "approval",
  "approved-for-wrapper",
  "Wrapper:",
  "No direct source import",
  "No scene-owned scoring",
  "No browser persistence ownership",
  "No package promotion",
  "No student assignment",
  "Frozen scenes mapped against canonical game contracts",
  "filterPhaserCandidateContractReviewsByTenant",
  "Ready for controlled evidence handoff",
  "source-manifest.sha256",
  "broad source merge",
  "fixture replay",
  "target-language audio",
  "validateFixture",
  "validateEventReplay",
  "validateAudioCoverage",
  "validateScoringReplay",
  "validateAccessibility",
  "validateWrapperNotes",
];

const failures = requiredMarkers
  .filter((marker) => !source.includes(marker))
  .map((marker) => `FAIL Phaser candidate review evidence is missing marker: ${marker}`);

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("PASS Phaser candidate contract review packet is present, tenant-scoped, and remains blocked from promotion.");
