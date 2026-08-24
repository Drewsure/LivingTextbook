export type PrototypeReturnPackageStatus = "not-returned" | "evidence-needed" | "ready-for-return-review";
export type PrototypeReturnPackageItemStatus = "required" | "missing" | "blocked" | "ready-preview";

export interface PrototypeReturnPackageChecklistItem {
  itemId: string;
  label: string;
  status: PrototypeReturnPackageItemStatus;
  requiredContents: string[];
  blocksUntil: string;
}

export interface PrototypeReturnPackageChecklist {
  checklistId: string;
  tenantId: string;
  queueItemId: string;
  label: string;
  status: PrototypeReturnPackageStatus;
  sourceRepo: string;
  targetMode: string;
  parentEngine: string;
  targetSurface: string;
  summary: string;
  packageItems: PrototypeReturnPackageChecklistItem[];
  requiredBeforeCodexReview: string[];
  blockedActions: string[];
}

export const samplePrototypeReturnPackageChecklists: PrototypeReturnPackageChecklist[] = [
  {
    checklistId: "prototype-return-package-ministar-sentence-builder",
    tenantId: "ministar",
    queueItemId: "intake-ministar-sentence-builder-dom",
    label: "Returned prototype package checklist",
    status: "not-returned",
    sourceRepo: "Drewsure/ministar-lab",
    targetMode: "sentence-builder",
    parentEngine: "text-spelling",
    targetSurface: "DOM reference",
    summary:
      "Sentence Builder is the safest first outside-prototype return candidate. The package must prove fixture-driven text-spelling behavior, target-language audio, deterministic scoring, and standard events before Codex considers a wrapper review.",
    packageItems: [
      createChecklistItem({
        itemId: "source-archive-manifest",
        label: "Source archive manifest",
        status: "missing",
        requiredContents: [
          "source repository",
          "branch or commit snapshot",
          "prototype folder path",
          "dependency list",
          "checksum or archive notes",
        ],
        blocksUntil: "Returned source can be tied to one exact review snapshot.",
      }),
      createChecklistItem({
        itemId: "reviewed-fixture-folder",
        label: "Reviewed fixture folder",
        status: "missing",
        requiredContents: [
          "sample JSON fixture",
          "8-12 vocabulary terms",
          "exactly 2 target sentence structures",
          "audio_cues array",
          "support_language_progress_allowed false",
        ],
        blocksUntil: "Prototype can prove it is not hard-coded.",
      }),
      createChecklistItem({
        itemId: "event-and-scoring-replay",
        label: "Event and scoring replay",
        status: "missing",
        requiredContents: [
          "game_started",
          "round_shown",
          "audio_requested",
          "answer_submitted",
          "answer_result",
          "mastery_updated",
          "game_completed",
          "deterministic score snapshot",
        ],
        blocksUntil: "Parent engine remains the scoring authority.",
      }),
      createChecklistItem({
        itemId: "audio-coverage-map",
        label: "Target-language audio coverage map",
        status: "missing",
        requiredContents: [
          "tap-to-speak word tiles",
          "tap-to-speak target sentence",
          "instruction replay control",
          "feedback replay control",
          "background media ducking notes",
        ],
        blocksUntil: "Every visible learner text has target-language audio support.",
      }),
      createChecklistItem({
        itemId: "mobile-accessibility-capture",
        label: "Mobile accessibility capture",
        status: "missing",
        requiredContents: [
          "phone screenshot",
          "touch target notes",
          "readable text notes",
          "keyboard or focus fallback notes",
          "no hidden black-button text proof",
        ],
        blocksUntil: "The prototype is usable for QR-led classroom devices.",
      }),
      createChecklistItem({
        itemId: "wrapper-boundary-notes",
        label: "Wrapper boundary notes",
        status: "blocked",
        requiredContents: [
          "no apps/web import request",
          "no route registry write",
          "no scoring profile write",
          "no audio manifest write",
          "no playlist write",
          "no student assignment request",
        ],
        blocksUntil: "Codex can decide whether a wrapper-first plan is even possible.",
      }),
    ],
    requiredBeforeCodexReview: [
      "Returned package is supplied as evidence, not copied into apps/web.",
      "Package manifest names the exact source snapshot and target queue item.",
      "Fixture replay, event replay, audio coverage, scoring, and mobile evidence are attached.",
      "Support-language activity is proven support-only and cannot unlock progress.",
      "Codex wrapper decision is still separate from package return.",
    ],
    blockedActions: [
      "No archive import",
      "No direct file copy into apps/web",
      "No active route replacement",
      "No scoring mutation",
      "No reward inventory write",
      "No playlist creation",
      "No package promotion",
      "No student assignment",
    ],
  },
  {
    checklistId: "prototype-return-package-ministar-balloon-pop",
    tenantId: "ministar",
    queueItemId: "intake-ministar-balloon-pop-phaser",
    label: "Returned Phaser package checklist",
    status: "evidence-needed",
    sourceRepo: "Drewsure/ministar-lab",
    targetMode: "balloon-pop",
    parentEngine: "selection",
    targetSurface: "Phaser wrapper candidate",
    summary:
      "Balloon Pop can remain a strong younger-learner Phaser candidate, but the return package must prove that canvas motion is wrapped by the selection parent engine and does not hide learning text, audio, or scoring.",
    packageItems: [
      createChecklistItem({
        itemId: "phaser-source-archive-manifest",
        label: "Phaser source archive manifest",
        status: "missing",
        requiredContents: ["source repository", "branch or commit snapshot", "Phaser version", "asset manifest", "dependency list"],
        blocksUntil: "Returned Phaser source has a stable review snapshot.",
      }),
      createChecklistItem({
        itemId: "selection-fixture-replay",
        label: "Selection fixture replay",
        status: "missing",
        requiredContents: ["correct target list", "incorrect target list", "reviewed JSON fixture", "payload adapter notes"],
        blocksUntil: "The prototype proves selection logic comes from the reviewed payload.",
      }),
      createChecklistItem({
        itemId: "phaser-wrapper-events",
        label: "Wrapper event replay",
        status: "missing",
        requiredContents: ["spawn event notes", "correct hit event", "incorrect hit event", "pause event", "completion event"],
        blocksUntil: "Phaser reports through the standard event contract.",
      }),
      createChecklistItem({
        itemId: "phaser-audio-priority",
        label: "Learning-audio priority proof",
        status: "blocked",
        requiredContents: ["target text replay", "feedback replay", "background media ducking", "support-language blocked"],
        blocksUntil: "Target-language audio remains louder and more important than game effects.",
      }),
    ],
    requiredBeforeCodexReview: [
      "Phaser source remains outside apps/web.",
      "Wrapper event replay proves parent-engine ownership.",
      "Canvas text has accessible DOM or replay controls.",
      "Learning audio priority is documented before polish.",
    ],
    blockedActions: [
      "No archive import",
      "No direct file copy into apps/web",
      "No Phaser direct route",
      "No canvas-only learning text",
      "No one-off scoring",
      "No reward inventory write",
      "No student assignment",
    ],
  },
  {
    checklistId: "prototype-return-package-sample-publisher-fill-blank",
    tenantId: "sample-publisher",
    queueItemId: "intake-sample-publisher-fill-blank-dom",
    label: "Returned prototype package checklist",
    status: "not-returned",
    sourceRepo: "Drewsure/ministar-lab",
    targetMode: "fill-in-the-blank",
    parentEngine: "text-spelling",
    targetSurface: "DOM reference",
    summary:
      "Fill in the Blank is deferred until the Sentence Builder return pattern is proven. The checklist still shows partner tenants what a future return package must contain.",
    packageItems: [
      createChecklistItem({
        itemId: "partner-source-archive-manifest",
        label: "Source archive manifest",
        status: "missing",
        requiredContents: ["source repository", "snapshot id", "prototype folder path", "README"],
        blocksUntil: "Partner return evidence can be matched to an approved source snapshot.",
      }),
      createChecklistItem({
        itemId: "partner-fixture-replay",
        label: "Prompt and answer fixture replay",
        status: "missing",
        requiredContents: ["reviewed JSON fixture", "prompt list", "answer key", "distractor policy"],
        blocksUntil: "No unreviewed generated distractors can enter a student route.",
      }),
      createChecklistItem({
        itemId: "partner-audio-map",
        label: "Audio-supported choices",
        status: "missing",
        requiredContents: ["target-language prompt audio", "choice audio", "instruction audio", "feedback audio"],
        blocksUntil: "Learner-facing text is audio-supported before partner review.",
      }),
    ],
    requiredBeforeCodexReview: [
      "Text-spelling intake pattern has been accepted from the first return package.",
      "Partner fixture replay and report mapping are documented.",
      "Returned prototype remains evidence-only.",
    ],
    blockedActions: [
      "No archive import",
      "No direct file copy into apps/web",
      "No unreviewed generated distractors",
      "No direct route creation",
      "No scoring mutation",
      "No student assignment",
    ],
  },
];

export function filterPrototypeReturnPackageChecklistsByTenant(
  checklists: PrototypeReturnPackageChecklist[],
  tenantId: string,
): PrototypeReturnPackageChecklist[] {
  return checklists.filter((checklist) => checklist.tenantId === tenantId);
}

function createChecklistItem(item: PrototypeReturnPackageChecklistItem): PrototypeReturnPackageChecklistItem {
  return item;
}
