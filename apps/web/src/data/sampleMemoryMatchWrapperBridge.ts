import {
  PHASER_CANDIDATE_WRAPPER_BRIDGE_BLOCKED_ACTIONS,
  validatePhaserCandidateWrapperBridge,
  type PhaserCandidateWrapperBridge,
} from "@living-textbook/content-model";

export const sampleMemoryMatchWrapperBridge: PhaserCandidateWrapperBridge = {
  bridgeId: "memory-match-wrapper-bridge-2026-10-02",
  candidatePackageId: "memory-match-candidate-2026-10-02",
  tenantId: "sample",
  gameMode: "memory-match",
  parentEngine: "pairing",
  status: "blocked",
  summary:
    "The returned Z.ai evidence package is admitted as a review input only. Its fixture and audio map are useful, but its event and scoring evidence still require normalization to the platform-owned pairing contract before a wrapper proposal can be considered.",
  source: {
    repository: "Drewsure/ministar-lab",
    snapshotId: "frozen-2026-09-12-aaa-stable",
    commitSha: "eb79ddf5940ab47cc3c45c119c67ee1b6b958e55",
  },
  canonicalSurface: {
    component: "apps/web/src/features/game-shell/pairing/PairingMemoryMatchGame.tsx",
    route: "apps/web/src/app/memory/[code]/page.tsx",
    scoringProfile: "pairing-reinforcement-v1",
  },
  normalizationPlan: [
    "Map the reviewed fixture into the validated tenant UnitPayload and inject tenant theme/media configuration.",
    "Re-run the event replay through the canonical event validator with platform-generated replay identity.",
    "Replace the candidate memory-match-v1 scoring label with a platform-owned pairing-reinforcement-v1 replay, without rewriting the evidence as if it had already passed.",
    "Require mastery_updated and game_completed to carry the canonical pairing parent engine and platform-owned Star Dust result.",
    "Address keyboard navigation, visible focus, reduced motion, and small-screen label readability before any wrapper proposal.",
  ],
  checks: [
    { checkId: "source-identity", label: "Frozen source identity", status: "passed", evidence: "The returned package binds to Drewsure/ministar-lab at the frozen 2026-09-12 snapshot and commit." },
    { checkId: "fixture-normalization", label: "Fixture normalization", status: "passed", evidence: "The fixture contains eight unique vocabulary terms, two target sentences, memory-match mode, and the pairing engine." },
    { checkId: "canonical-event-sequence", label: "Canonical event sequence", status: "blocked", evidence: "The supplied replay is a useful external trace but is not yet a canonical platform replay.", requiredCorrection: "Replay through the platform event contract and preserve platform-owned completion validation." },
    { checkId: "canonical-scoring-profile", label: "Canonical scoring profile", status: "blocked", evidence: "The candidate evidence names memory-match-v1; the platform contract requires pairing-reinforcement-v1.", requiredCorrection: "Return a deterministic replay using pairing-reinforcement-v1 and the platform Star Dust cap." },
    { checkId: "target-language-audio", label: "Target-language audio", status: "passed", evidence: "The reviewed audio map covers all eight terms plus instruction, feedback, and critical-control cues in English." },
    { checkId: "state-ownership", label: "State ownership", status: "passed", evidence: "The wrapper notes keep scoring, mastery, persistence, rewards, and reporting platform-owned." },
    { checkId: "accessibility", label: "Mobile and accessibility readiness", status: "blocked", evidence: "The returned evidence honestly records missing keyboard navigation, focus management, and reduced-motion handling.", requiredCorrection: "Address the documented gaps in the wrapper or return an accepted platform-side accessibility plan." },
    { checkId: "codex-decision", label: "Codex integration decision", status: "blocked", evidence: "No wrapper approval or integration work order exists.", requiredCorrection: "Complete the normalization checks, then issue a separate Codex decision before any route or source change." },
  ],
  blockedActions: [...PHASER_CANDIDATE_WRAPPER_BRIDGE_BLOCKED_ACTIONS],
  nextAction: "Keep the package in the external review folder and request a corrected evidence replay; do not import or promote the Phaser source.",
};

export const sampleMemoryMatchWrapperBridgeErrors = validatePhaserCandidateWrapperBridge(sampleMemoryMatchWrapperBridge);
