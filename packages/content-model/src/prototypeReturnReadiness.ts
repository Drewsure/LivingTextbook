export type PrototypeReturnReadinessStatus =
  | "not-ready"
  | "evidence-review-needed"
  | "ready-for-codex-return-review";

export type PrototypeReturnReviewState =
  | "Codex return review not opened"
  | "Codex return review blocked by evidence"
  | "Codex return review ready";

export function derivePrototypeReturnReadinessStatus(
  lanes: Array<{ status: string }>,
): PrototypeReturnReadinessStatus {
  if (lanes.some((lane) => lane.status === "missing")) {
    return "not-ready";
  }
  if (lanes.some((lane) => lane.status === "blocked")) {
    return "evidence-review-needed";
  }
  if (lanes.length > 0 && lanes.every((lane) => lane.status === "ready")) {
    return "ready-for-codex-return-review";
  }
  return "not-ready";
}

export function derivePrototypeReturnReviewState(
  status: PrototypeReturnReadinessStatus,
): PrototypeReturnReviewState {
  if (status === "ready-for-codex-return-review") {
    return "Codex return review ready";
  }
  if (status === "evidence-review-needed") {
    return "Codex return review blocked by evidence";
  }
  return "Codex return review not opened";
}
