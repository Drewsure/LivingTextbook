import {
  validatePhaserCandidateContractReviews,
  type PhaserCandidateContractReview,
} from "@living-textbook/content-model";

const sourceSnapshotId = "ministar-lab-frozen-2026-09-12-eb79ddf";
const sourceCommitSha = "eb79ddf5940ab47cc3c45c119c67ee1b6b958e55";
const sourceFiles = {
  memoryMatchScene: {
    path: "src/game/scenes/MemoryMatchScene.ts",
    sha256: "d1c60fa17bf4bee63627e485ae0b096894832705fdcf173576bf3b28b8656888",
  },
  balloonPopScene: {
    path: "src/game/scenes/BalloonPopScene.ts",
    sha256: "72904e8ad3a7760dda7779b93216975cd192a5c959b0b71d68c74efb926440e0",
  },
  baseEngine: {
    path: "src/game/BaseEngine.ts",
    sha256: "d1ef0d207dcb225363fc15a8720838d228596f568696ad61285d2b50fb9a37b5",
  },
  types: {
    path: "src/lib/types.ts",
    sha256: "3c2218c70a7dc7d5b34f601707f4f1e4dd61709ea00f93141dea4ae401b0a904",
  },
  audio: {
    path: "src/lib/audio.ts",
    sha256: "8e63a2054c8235fe8de8e69257c74620f1c2279366e2ec0d7281122c2c8344f3",
  },
} as const;

export const samplePhaserCandidateContractReviews: PhaserCandidateContractReview[] = [
  {
    reviewId: "phaser-contract-review-ministar-memory-match",
    tenantId: "ministar",
    queueItemId: "intake-ministar-memory-match-phaser",
    sourceRepository: "Drewsure/ministar-lab",
    sourceSnapshotId,
    sourceCommitSha,
    sourceFiles: [sourceFiles.memoryMatchScene, sourceFiles.baseEngine, sourceFiles.types, sourceFiles.audio],
    gameMode: "memory-match",
    parentEngine: "pairing",
    status: "mapped-review-only",
    approval: {
      decisionId: "phaser-wrapper-decision-ministar-memory-match",
      status: "blocked",
      decidedAt: "2026-09-13T00:00:00.000Z",
      blockers: [
        "Pairing payload adapter review",
        "Canonical event replay report",
        "Target-language audio coverage report",
        "Deterministic ordering/replay report",
        "Keyboard and touch accessibility evidence",
      ],
    },
    summary:
      "The frozen Memory Match scene has a bounded pair loop and useful motion polish, but BaseEngine owns score, local persistence, fixed audio, and non-replayable random ordering.",
    findings: [
      {
        findingId: "memory-match-payload",
        area: "payload",
        status: "gap",
        observedBehavior: "Scene consumes the MiniStar TermItem shape and builds pairs internally.",
        platformRequirement: "Adapter must consume the validated UnitPayload and canonical vocabulary/audio manifest.",
        evidenceReference: "src/game/scenes/MemoryMatchScene.ts:buildGrid",
      },
      {
        findingId: "memory-match-events",
        area: "events",
        status: "gap",
        observedBehavior: "BaseEngine records internal answers and xAPI-style completion events.",
        platformRequirement: "Wrapper must emit the canonical game_started, round_shown, answer_submitted, answer_result, game_completed, and mastery_updated events.",
        evidenceReference: "src/game/BaseEngine.ts:recordAnswer/finishGame",
      },
      {
        findingId: "memory-match-audio",
        area: "audio",
        status: "gap",
        observedBehavior: "Card speech and feedback use the source audioBus and browser voice behavior.",
        platformRequirement: "Audio must resolve through the tenant/unit cue manifest with support-only semantics.",
        evidenceReference: "src/game/scenes/MemoryMatchScene.ts:audioBus",
      },
      {
        findingId: "memory-match-scoring",
        area: "scoring",
        status: "blocked",
        observedBehavior: "BaseEngine.recordAnswer mutates score and streak inside the scene hierarchy.",
        platformRequirement: "Platform scoring profile owns attempts, correctness, Star Dust, mastery, and retry decisions.",
        evidenceReference: "src/game/BaseEngine.ts:recordAnswer",
      },
      {
        findingId: "memory-match-persistence",
        area: "persistence",
        status: "blocked",
        observedBehavior: "The source engine persists identity/settings/stickers through browser storage.",
        platformRequirement: "Session identity, persistence, rewards, and reporting remain platform-owned and tenant-scoped.",
        evidenceReference: "src/game/BaseEngine.ts:localStorage",
      },
      {
        findingId: "memory-match-replay",
        area: "replay",
        status: "gap",
        observedBehavior: "Card order and entrance animation use runtime randomness without session evidence.",
        platformRequirement: "Ordering and replay behavior must be deterministic or carry a platform-supplied replay seed.",
        evidenceReference: "src/game/scenes/MemoryMatchScene.ts:Phaser.Utils.Array.Shuffle/Math.random",
      },
      {
        findingId: "memory-match-accessibility",
        area: "accessibility",
        status: "gap",
        observedBehavior: "Interaction is primarily canvas pointer handling with limited semantic controls.",
        platformRequirement: "Provide keyboard, touch, readable DOM or equivalent assist controls before release.",
        evidenceReference: "src/game/scenes/MemoryMatchScene.ts:setupGlobalPointer",
      },
    ],
    missingEvidence: [
      "Pairing payload adapter review",
      "Canonical event replay report",
      "Target-language audio coverage report",
      "Deterministic ordering/replay report",
      "Keyboard and touch accessibility evidence",
    ],
    blockedActions: [
      "No direct source import",
      "No route replacement",
      "No scene-owned scoring",
      "No browser persistence ownership",
      "No package promotion",
      "No student assignment",
    ],
  },
  {
    reviewId: "phaser-contract-review-ministar-balloon-pop",
    tenantId: "ministar",
    queueItemId: "intake-ministar-balloon-pop-phaser",
    sourceRepository: "Drewsure/ministar-lab",
    sourceSnapshotId,
    sourceCommitSha,
    sourceFiles: [sourceFiles.balloonPopScene, sourceFiles.baseEngine, sourceFiles.types, sourceFiles.audio],
    gameMode: "balloon-pop",
    parentEngine: "selection",
    status: "mapped-review-only",
    approval: {
      decisionId: "phaser-wrapper-decision-ministar-balloon-pop",
      status: "blocked",
      decidedAt: "2026-09-13T00:00:00.000Z",
      blockers: [
        "Selection payload adapter review",
        "Canonical correct/wrong/missed event replay",
        "Target-language audio priority report",
        "Deterministic timing/scoring replay report",
        "Touch, keyboard, slow-mode, and reduced-motion evidence",
      ],
    },
    summary:
      "The frozen Balloon Pop scene provides valuable motion and timing ideas, but random spawn behavior, direct audio, scene-owned scoring, and escape semantics must be defined by the platform first.",
    findings: [
      {
        findingId: "balloon-pop-payload",
        area: "payload",
        status: "gap",
        observedBehavior: "Scene selects MiniStar terms and definitions internally for each round.",
        platformRequirement: "Adapter must use reviewed selection rounds from the canonical UnitPayload and audio manifest.",
        evidenceReference: "src/game/scenes/BalloonPopScene.ts:_buildDefBoxes",
      },
      {
        findingId: "balloon-pop-events",
        area: "events",
        status: "gap",
        observedBehavior: "Source relies on BaseEngine answer recording and direct finish behavior.",
        platformRequirement: "Wrapper must normalize round, submission, result, completion, and mastery events.",
        evidenceReference: "src/game/scenes/BalloonPopScene.ts:popBalloon",
      },
      {
        findingId: "balloon-pop-audio",
        area: "audio",
        status: "gap",
        observedBehavior: "Prompt and feedback use audioBus.speak with source-language assumptions.",
        platformRequirement: "Audio must resolve through reviewed tenant/unit cues and never outrank learning audio.",
        evidenceReference: "src/game/scenes/BalloonPopScene.ts:audioBus.speak",
      },
      {
        findingId: "balloon-pop-scoring",
        area: "scoring",
        status: "blocked",
        observedBehavior: "Correct, wrong, and missed timing paths feed BaseEngine score/streak behavior.",
        platformRequirement: "Platform scoring must define attempt, miss, escape, retry, Star Dust, and mastery semantics.",
        evidenceReference: "src/game/scenes/BalloonPopScene.ts:recordAnswer",
      },
      {
        findingId: "balloon-pop-persistence",
        area: "persistence",
        status: "blocked",
        observedBehavior: "Shared source engine owns browser identity/settings/reward persistence.",
        platformRequirement: "The scene must not write identity, progress, rewards, or teacher reports.",
        evidenceReference: "src/game/BaseEngine.ts:localStorage",
      },
      {
        findingId: "balloon-pop-replay",
        area: "replay",
        status: "gap",
        observedBehavior: "Term selection, color, position, and timing use runtime randomness.",
        platformRequirement: "A platform seed and replay fixture must reproduce correct, wrong, missed, and escaped outcomes.",
        evidenceReference: "src/game/scenes/BalloonPopScene.ts:Phaser.Utils.Array.Shuffle",
      },
      {
        findingId: "balloon-pop-accessibility",
        area: "accessibility",
        status: "gap",
        observedBehavior: "Moving targets are controlled through global canvas pointer hit testing.",
        platformRequirement: "Provide touch, keyboard, slow/reduced-motion, and accessible fallback behavior before release.",
        evidenceReference: "src/game/scenes/BalloonPopScene.ts:setupGlobalPointer",
      },
    ],
    missingEvidence: [
      "Selection payload adapter review",
      "Canonical correct/wrong/missed event replay",
      "Target-language audio priority report",
      "Deterministic timing/scoring replay report",
      "Touch, keyboard, slow-mode, and reduced-motion evidence",
    ],
    blockedActions: [
      "No direct source import",
      "No route replacement",
      "No scene-owned scoring",
      "No browser persistence ownership",
      "No package promotion",
      "No student assignment",
    ],
  },
];

export const samplePhaserCandidateContractReviewErrors = validatePhaserCandidateContractReviews(
  samplePhaserCandidateContractReviews,
);

export function filterPhaserCandidateContractReviewsByTenant(
  reviews: PhaserCandidateContractReview[],
  tenantId: string,
): PhaserCandidateContractReview[] {
  return reviews.filter((review) => review.tenantId === tenantId);
}
