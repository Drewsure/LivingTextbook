import { readFileSync } from "node:fs";

const verifier = readFileSync(new URL("./verify-phaser-candidate-package.mjs", import.meta.url), "utf8");
const reviewGuide = readFileSync(
  new URL("../docs/verification/PHASER_CANDIDATE_PACKAGE_CHECKS.md", import.meta.url),
  "utf8",
);
const behaviorTest = readFileSync(new URL("./verify-phaser-candidate-package-behavior.mjs", import.meta.url), "utf8");

const verifierMarkers = [
  "validateFixture",
  "validateEventReplay",
  "validateAudioCoverage",
  "validateScoringReplay",
  "validateSourceManifest",
  "validateAccessibility",
  "validateWrapperNotes",
  "validateReadme",
  "unit_meta.tenant_id",
  "vocabulary_terms must be unique",
  "exactly two target_sentences",
  "replay-v1:",
  "audio_requested events must include cueText",
  "randomRewards === false",
  "source-manifest.sha256",
  "reduced motion",
  "No direct file copy into apps/web",
];

const guideMarkers = [
  "fixture shape",
  "event replay",
  "audio map",
  "scoring replay",
  "accessibility evidence",
  "wrapper boundaries",
  "review-only",
];

const behaviorMarkers = [
  "assertVerifierPasses",
  "assertVerifierRejects",
  "randomRewards: true",
  "PASS Phaser candidate package behavior",
];

const failures = [
  ...verifierMarkers
    .filter((marker) => !verifier.includes(marker))
    .map((marker) => `FAIL candidate package verifier is missing marker: ${marker}`),
  ...guideMarkers
    .filter((marker) => !reviewGuide.toLowerCase().includes(marker))
    .map((marker) => `FAIL candidate package review guide is missing marker: ${marker}`),
  ...behaviorMarkers
    .filter((marker) => !behaviorTest.includes(marker))
    .map((marker) => `FAIL candidate package behavior test is missing marker: ${marker}`),
];

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("PASS Phaser candidate package gate covers fixture shape, replay, audio, scoring, accessibility, source, and wrapper evidence.");
