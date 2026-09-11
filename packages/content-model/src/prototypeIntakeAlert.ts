export type PrototypeIntakeAlertDecision = "not-ready" | "ready-for-review" | "blocked";

export type PrototypeIntakeReadinessStatus = "not-ready" | "evidence-review-needed" | "ready-for-codex-alert";

export type PrototypeIntakeCodexAlertState =
  | "Codex alert not issued"
  | "Codex alert blocked by structural evidence"
  | "Codex alert ready";

export interface PrototypeIntakeReadinessSignal {
  status: string;
  lanes: Array<{ laneId: string; status: string }>;
}

const structuralBlockingLaneIds = new Set([
  "evidence-alignment",
  "returned-package-manifest-contract",
]);

export function derivePrototypeIntakeReadinessStatus(
  lanes: Array<{ status: string }>,
): PrototypeIntakeReadinessStatus {
  if (lanes.some((lane) => lane.status === "missing")) {
    return "not-ready";
  }
  if (lanes.some((lane) => lane.status === "blocked")) {
    return "evidence-review-needed";
  }
  if (lanes.length > 0 && lanes.every((lane) => lane.status === "ready")) {
    return "ready-for-codex-alert";
  }
  return "not-ready";
}

export function derivePrototypeIntakeCodexAlertState(
  decision: PrototypeIntakeAlertDecision,
): PrototypeIntakeCodexAlertState {
  if (decision === "ready-for-review") {
    return "Codex alert ready";
  }
  if (decision === "blocked") {
    return "Codex alert blocked by structural evidence";
  }
  return "Codex alert not issued";
}

export function derivePrototypeIntakeAlertDecision(
  signal: PrototypeIntakeReadinessSignal,
): PrototypeIntakeAlertDecision {
  if (signal.lanes.some((lane) => structuralBlockingLaneIds.has(lane.laneId) && lane.status === "blocked")) {
    return "blocked";
  }
  if (signal.status === "ready-for-codex-alert" && signal.lanes.every((lane) => lane.status === "ready")) {
    return "ready-for-review";
  }
  return "not-ready";
}
