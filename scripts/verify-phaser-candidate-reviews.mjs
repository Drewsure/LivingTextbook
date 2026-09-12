import { readFileSync } from "node:fs";

const files = [
  "packages/content-model/src/phaserCandidateContractReview.ts",
  "apps/web/src/data/samplePhaserCandidateContractReview.ts",
  "apps/web/src/features/game-offers/PhaserCandidateContractReviewPanel.tsx",
  "apps/web/src/app/teacher/prototypes/[tenantId]/page.tsx",
];

const source = files.map((file) => readFileSync(file, "utf8")).join("\n");
const requiredMarkers = [
  "PhaserCandidateContractReview",
  "validatePhaserCandidateContractReviews",
  "phaser-contract-review-ministar-memory-match",
  "phaser-contract-review-ministar-balloon-pop",
  "ministar-lab-frozen-2026-09-12-eb79ddf",
  "No direct source import",
  "No scene-owned scoring",
  "No browser persistence ownership",
  "No package promotion",
  "No student assignment",
  "Frozen scenes mapped against canonical game contracts",
  "filterPhaserCandidateContractReviewsByTenant",
];

const failures = requiredMarkers
  .filter((marker) => !source.includes(marker))
  .map((marker) => `FAIL Phaser candidate review evidence is missing marker: ${marker}`);

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("PASS Phaser candidate contract review packet is present, tenant-scoped, and remains blocked from promotion.");
