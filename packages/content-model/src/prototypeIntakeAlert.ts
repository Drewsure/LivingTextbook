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

export const PROTOTYPE_INTAKE_ALERT_REQUIRED_EVIDENCE = [
  "JSON fixture replay",
  "Standard event replay",
  "Target-language audio coverage",
  "Deterministic scoring replay",
  "Mobile layout evidence",
  "Phaser wrapper review when Phaser is used",
] as const;

export const PROTOTYPE_INTAKE_ALERT_REQUIRED_BLOCKED_ACTIONS = [
  "No direct app file writes",
  "No route creation",
  "No scoring mutation",
  "No reward inventory mutation",
  "No audio manifest mutation",
  "No playlist creation",
  "No package promotion",
  "No student assignment",
] as const;

export function validatePrototypeIntakeAlert(alert: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(alert)) {
    return ["Prototype intake alert must be a JSON object."];
  }

  const alertId = readString(alert, "alertId");
  const label = readString(alert, "label");
  const status = readString(alert, "status");
  const summary = readString(alert, "summary");
  const humanSignalRule = readString(alert, "humanSignalRule");
  const currentHumanAction = readString(alert, "currentHumanAction");
  const notNeededYet = readStringArray(alert, "notNeededYet");
  const readyWhen = readStringArray(alert, "readyWhen");
  const requiredEvidence = readStringArray(alert, "requiredEvidence");
  const blockedUntilReady = readStringArray(alert, "blockedUntilReady");
  const ownerRule = readString(alert, "ownerRule");

  if (!alertId || !label) {
    errors.push("Prototype intake alert must include alertId and label.");
  }
  if (!label.includes("Z.ai prototype intake alert")) {
    errors.push("Prototype intake alert label must identify the Z.ai prototype intake alert.");
  }
  if (status !== "not-ready" && status !== "ready-for-review" && status !== "blocked") {
    errors.push("Prototype intake alert must use a supported status.");
  }
  if (!summary.includes("Codex will explicitly alert the user")) {
    errors.push("Prototype intake alert summary must keep the Codex-owned handoff signal explicit.");
  }
  if (!humanSignalRule.includes("only after the intake alert changes")) {
    errors.push("Prototype intake alert human signal rule must keep handoff timing explicit.");
  }
  if (!currentHumanAction.includes("Drewsure/ministar-lab")) {
    errors.push("Prototype intake alert current human action must preserve isolated Z.ai repository scope.");
  }
  if (notNeededYet.length === 0 || readyWhen.length === 0) {
    errors.push("Prototype intake alert must include not-needed-yet and ready-when guidance.");
  }
  for (const evidence of PROTOTYPE_INTAKE_ALERT_REQUIRED_EVIDENCE) {
    if (!requiredEvidence.includes(evidence)) {
      errors.push(`Prototype intake alert must require evidence: ${evidence}.`);
    }
  }
  for (const blockedAction of PROTOTYPE_INTAKE_ALERT_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedUntilReady.includes(blockedAction)) {
      errors.push(`Prototype intake alert must block action: ${blockedAction}.`);
    }
  }
  if (!ownerRule.includes("Codex owns architecture")) {
    errors.push("Prototype intake alert owner rule must preserve Codex architecture ownership.");
  }

  return errors;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function readStringArray(source: Record<string, unknown>, key: string): string[] {
  const value = source[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim())
    : [];
}
