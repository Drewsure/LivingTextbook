export type PrototypeIntakeAlertDecision = "not-ready" | "ready-for-review" | "blocked";

export interface PrototypeIntakeReadinessSignal {
  status: string;
  lanes: Array<{ laneId: string; status: string }>;
}

const structuralBlockingLaneIds = new Set([
  "evidence-alignment",
  "returned-package-manifest-contract",
]);

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
