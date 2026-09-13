import { readFileSync } from "node:fs";

const verifier = readFileSync(new URL("./verify-phaser-candidate-package.mjs", import.meta.url), "utf8");
const profileManifest = readFileSync(
  new URL("../packages/content-model/src/phaserCandidateProfiles.json", import.meta.url),
  "utf8",
);
const reviewGuide = readFileSync(
  new URL("../docs/verification/PHASER_CANDIDATE_PACKAGE_CHECKS.md", import.meta.url),
  "utf8",
);
const behaviorTest = readFileSync(new URL("./verify-phaser-candidate-package-behavior.mjs", import.meta.url), "utf8");
const verifierSource = `${verifier}\n${profileManifest}`;

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
  "candidateProfiles",
  "balloon-pop",
  "requiredScenarios",
  "miss",
  "approved candidate profiles",
  "phaserCandidateProfiles.json",
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
  "cross-session audio",
  "PASS Phaser candidate package behavior",
];

const failures = [
  ...verifierMarkers
    .filter((marker) => !verifierSource.includes(marker))
    .map((marker) => `FAIL candidate package verifier is missing marker: ${marker}`),
  ...guideMarkers
    .filter((marker) => !reviewGuide.toLowerCase().includes(marker))
    .map((marker) => `FAIL candidate package review guide is missing marker: ${marker}`),
  ...behaviorMarkers
    .filter((marker) => !behaviorTest.includes(marker))
    .map((marker) => `FAIL candidate package behavior test is missing marker: ${marker}`),
];

let profiles;
try {
  profiles = JSON.parse(profileManifest);
} catch (error) {
  failures.push(`FAIL shared Phaser candidate profile manifest is not valid JSON: ${error.message}`);
}

if (!Array.isArray(profiles) || profiles.length < 2) {
  failures.push("FAIL shared Phaser candidate profile manifest must contain at least two approved profiles.");
} else {
  const modes = profiles.map((profile) => profile?.targetMode);
  if (new Set(modes).size !== modes.length) failures.push("FAIL shared Phaser candidate profiles must have unique target modes.");
  for (const profile of profiles) {
    if (!profile?.targetMode || !profile?.label || !profile?.parentEngine || !Array.isArray(profile?.requiredScenarios)) {
      failures.push("FAIL every shared Phaser candidate profile requires targetMode, label, parentEngine, and requiredScenarios.");
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("PASS Phaser candidate package gate covers fixture shape, replay, audio, scoring, accessibility, source, and wrapper evidence.");
