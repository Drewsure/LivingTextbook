export type PrototypeIntakeReadinessStatus = "not-ready" | "evidence-review-needed" | "ready-for-codex-alert";

export interface PrototypeIntakeReadinessLane {
  laneId: string;
  label: string;
  status: "ready" | "missing" | "blocked";
  summary: string;
}

export interface PrototypeIntakeReadinessSummary {
  summaryId: string;
  label: string;
  status: PrototypeIntakeReadinessStatus;
  codexAlertState: string;
  summary: string;
  lanes: PrototypeIntakeReadinessLane[];
  blockedNextActions: string[];
}

export const samplePrototypeIntakeReadinessSummary: PrototypeIntakeReadinessSummary = {
  summaryId: "prototype-intake-readiness-summary-foundation",
  label: "Prototype intake readiness summary",
  status: "not-ready",
  codexAlertState: "Codex alert not issued",
  summary:
    "The foundation can inventory and review outside game work, but controlled Z.ai intake is still blocked until evidence packets and wrapper-review records exist for a specific candidate.",
  lanes: [
    {
      laneId: "queue-visible",
      label: "Queue visible",
      status: "ready",
      summary: "The prototype intake queue is visible on game-readiness and tenant prototype review workbenches.",
    },
    {
      laneId: "storage-contract-visible",
      label: "Storage contract visible",
      status: "ready",
      summary: "The prototype intake queue storage contract and hosted/local write intents are visible and verified.",
    },
    {
      laneId: "evidence-flow-visible",
      label: "Evidence flow visible",
      status: "ready",
      summary: "The prototype evidence packet flow defines source, fixture, event/scoring, audio, mobile, and wrapper lanes.",
    },
    {
      laneId: "returned-package-missing",
      label: "Returned prototype package",
      status: "missing",
      summary: "No specific returned prototype package has been accepted into review.",
    },
    {
      laneId: "replay-reports-missing",
      label: "Replay reports",
      status: "missing",
      summary: "Fixture, event, scoring, audio, and mobile/accessibility reports are still missing.",
    },
    {
      laneId: "codex-wrapper-decision-blocked",
      label: "Codex wrapper decision",
      status: "blocked",
      summary: "Codex cannot issue a wrapper or integration decision until evidence packets are complete.",
    },
  ],
  blockedNextActions: [
    "No Codex green-light alert yet",
    "No returned prototype upload",
    "No app file import",
    "No active route replacement",
    "No scoring mutation",
    "No reward inventory write",
    "No playlist write",
    "No package promotion",
    "No student assignment",
  ],
};
