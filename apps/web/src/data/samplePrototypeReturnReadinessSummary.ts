export type PrototypeReturnReadinessStatus = "not-ready" | "evidence-review-needed" | "ready-for-codex-return-review";

export interface PrototypeReturnReadinessLane {
  laneId: string;
  label: string;
  status: "ready" | "missing" | "blocked";
  summary: string;
}

export interface PrototypeReturnReadinessSummary {
  summaryId: string;
  label: string;
  status: PrototypeReturnReadinessStatus;
  codexReviewState: string;
  summary: string;
  lanes: PrototypeReturnReadinessLane[];
  blockedNextActions: string[];
}

export const samplePrototypeReturnReadinessSummary: PrototypeReturnReadinessSummary = {
  summaryId: "prototype-return-readiness-summary-foundation",
  label: "Prototype return readiness summary",
  status: "not-ready",
  codexReviewState: "Codex return review not opened",
  summary:
    "Returned Z.ai, Phaser, DOM reference, or outside-game work is not ready for Codex review until the returned package checklist, storage guard, evidence packets, replay reports, audio coverage, and wrapper boundary are complete.",
  lanes: [
    {
      laneId: "return-checklist-visible",
      label: "Return checklist visible",
      status: "ready",
      summary: "Returned prototype package checklists are visible for MiniStar and sample publisher candidates.",
    },
    {
      laneId: "return-storage-guard-visible",
      label: "Return storage guard visible",
      status: "ready",
      summary: "The prototype return package checklist storage contract is visible with hosted/local write intents.",
    },
    {
      laneId: "source-manifest-missing",
      label: "Source archive manifest",
      status: "missing",
      summary: "No returned package has supplied a reviewed source archive manifest tied to a single snapshot.",
    },
    {
      laneId: "fixture-replay-missing",
      label: "Reviewed fixture replay",
      status: "missing",
      summary: "Returned packages still need fixture replay evidence proving payload-driven behavior.",
    },
    {
      laneId: "audio-mobile-scoring-missing",
      label: "Audio, mobile, and scoring proof",
      status: "missing",
      summary: "Target-language audio, mobile accessibility, and deterministic scoring replay evidence are still missing.",
    },
    {
      laneId: "codex-return-review-blocked",
      label: "Codex return review",
      status: "blocked",
      summary: "Codex cannot open return review until the returned package evidence is complete and storage boundaries are satisfied.",
    },
  ],
  blockedNextActions: [
    "No Codex return review yet",
    "No returned archive import",
    "No direct file copy into apps/web",
    "No active route replacement",
    "No scoring mutation",
    "No reward inventory write",
    "No playlist write",
    "No package promotion",
    "No student assignment",
    "No support-language progress trigger",
  ],
};
