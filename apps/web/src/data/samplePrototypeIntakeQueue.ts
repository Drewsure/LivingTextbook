export type PrototypeIntakeQueueStatus = "inventory-only" | "awaiting-evidence" | "ready-for-codex-review" | "deferred";
export type PrototypeIntakeSurface = "dom-reference" | "phaser" | "hybrid";
export type PrototypeIntakePriority = "now" | "next" | "later";

export interface PrototypeIntakeQueueItem {
  itemId: string;
  tenantId: string;
  sourceRepo: string;
  gameMode: string;
  parentEngine: string;
  targetSurface: PrototypeIntakeSurface;
  priority: PrototypeIntakePriority;
  status: PrototypeIntakeQueueStatus;
  summary: string;
  requiredEvidence: string[];
  missingEvidence: string[];
  blockedActions: string[];
  reviewRoute: string;
}

export const samplePrototypeIntakeQueue: PrototypeIntakeQueueItem[] = [
  {
    itemId: "intake-ministar-sentence-builder-dom",
    tenantId: "ministar",
    sourceRepo: "Drewsure/ministar-lab",
    gameMode: "sentence-builder",
    parentEngine: "text-spelling",
    targetSurface: "dom-reference",
    priority: "now",
    status: "awaiting-evidence",
    summary:
      "Best first controlled intake candidate because it tests syntax construction, tap-to-speak text, deterministic scoring, and standard events without Phaser rendering complexity.",
    requiredEvidence: [
      "JSON fixture replay",
      "Tile order correctness evidence",
      "Target-language tap-to-speak coverage",
      "Standard event replay",
      "Mobile layout screenshot",
      "No support-language progress trigger proof",
    ],
    missingEvidence: [
      "Returned prototype package",
      "Fixture replay report",
      "Audio coverage report",
      "Mobile accessibility evidence",
      "Codex wrapper decision",
    ],
    blockedActions: [
      "No app file import",
      "No route creation",
      "No scoring mutation",
      "No package promotion",
      "No student assignment",
    ],
    reviewRoute: "/teacher/prototypes/ministar#return-evidence",
  },
  {
    itemId: "intake-ministar-balloon-pop-phaser",
    tenantId: "ministar",
    sourceRepo: "Drewsure/ministar-lab",
    gameMode: "balloon-pop",
    parentEngine: "selection",
    targetSurface: "phaser",
    priority: "next",
    status: "inventory-only",
    summary:
      "Useful Phaser candidate because motion and reflex timing matter, but it must prove a wrapper boundary and learning-audio priority before integration review.",
    requiredEvidence: [
      "Phaser wrapper review",
      "Selection payload adapter",
      "Correct and incorrect answer events",
      "Learning-audio priority proof",
      "Background media ducking proof",
      "Mobile performance check",
    ],
    missingEvidence: [
      "Wrapper adapter review",
      "Standard event replay",
      "Audio priority report",
      "Scoring replay report",
      "Accessibility fallback plan",
    ],
    blockedActions: [
      "No canvas-only learning text",
      "No one-off scoring",
      "No background music override",
      "No direct reward inventory write",
      "No active route replacement",
    ],
    reviewRoute: "/teacher/prototypes/ministar#return-evidence",
  },
  {
    itemId: "intake-ministar-whack-a-mole-phaser",
    tenantId: "ministar",
    sourceRepo: "Drewsure/ministar-lab",
    gameMode: "whack-a-mole",
    parentEngine: "selection",
    targetSurface: "phaser",
    priority: "next",
    status: "inventory-only",
    summary:
      "Good second Phaser wrapper candidate after Balloon Pop because hit timing, spawn rules, and correct/incorrect targets need strong event and scoring discipline.",
    requiredEvidence: [
      "Spawn timing rules",
      "Correct hit event replay",
      "Incorrect hit event replay",
      "Pause and teacher-friendly control proof",
      "Target-language prompt audio coverage",
      "Deterministic scoring replay",
    ],
    missingEvidence: [
      "Returned prototype package",
      "Selection payload adapter",
      "Event replay report",
      "Scoring replay report",
      "Pause-state evidence",
    ],
    blockedActions: [
      "No random target scoring",
      "No hard-coded MiniStar-only art",
      "No route creation",
      "No package promotion",
      "No student assignment",
    ],
    reviewRoute: "/teacher/prototypes/ministar#return-evidence",
  },
  {
    itemId: "intake-sample-publisher-fill-blank-dom",
    tenantId: "sample-publisher",
    sourceRepo: "Drewsure/ministar-lab",
    gameMode: "fill-in-the-blank",
    parentEngine: "text-spelling",
    targetSurface: "dom-reference",
    priority: "later",
    status: "deferred",
    summary:
      "Structurally useful, but should wait until Sentence Builder proves the text-spelling intake pattern and report mapping is stable.",
    requiredEvidence: [
      "Prompt and answer-choice fixture replay",
      "Audio-supported choices",
      "Standard answer events",
      "Teacher report mapping",
      "Support-language support-only proof",
    ],
    missingEvidence: [
      "Text-spelling intake precedent",
      "Report mapping decision",
      "Returned prototype package",
      "Audio coverage report",
    ],
    blockedActions: [
      "No unreviewed generated distractors",
      "No canvas-only sentence text",
      "No hidden scoring logic",
      "No route creation",
    ],
    reviewRoute: "/teacher/prototypes/sample-publisher#return-evidence",
  },
];

export function filterPrototypeIntakeQueueByTenant(
  items: PrototypeIntakeQueueItem[],
  tenantId: string,
): PrototypeIntakeQueueItem[] {
  return items.filter((item) => item.tenantId === tenantId);
}
