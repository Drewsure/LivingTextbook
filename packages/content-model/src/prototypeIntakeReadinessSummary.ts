import {
  derivePrototypeIntakeAlertDecision,
  derivePrototypeIntakeCodexAlertState,
  derivePrototypeIntakeReadinessStatus,
  type PrototypeIntakeReadinessSignal,
} from "./prototypeIntakeAlert";

const supportedLaneStatuses = new Set(["ready", "missing", "blocked"]);

export function validatePrototypeIntakeReadinessSummary(summary: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(summary)) {
    return ["Prototype intake readiness summary must be a JSON object."];
  }

  const summaryId = readString(summary, "summaryId");
  const label = readString(summary, "label");
  const tenantId = readString(summary, "tenantId");
  const status = readString(summary, "status");
  const codexAlertState = readString(summary, "codexAlertState");
  const summaryText = readString(summary, "summary");
  const lanes = summary.lanes;

  if (!summaryId || !label || !tenantId || !summaryText) {
    errors.push("Prototype intake readiness summary must include summaryId, label, tenantId, and summary text.");
  }
  if (!Array.isArray(lanes) || lanes.length === 0) {
    errors.push("Prototype intake readiness summary must include at least one readiness lane.");
    return errors;
  }

  const laneIds = new Set<string>();
  const normalizedLanes: Array<{ laneId: string; status: string }> = [];
  lanes.forEach((lane, index) => {
    if (!isRecord(lane)) {
      errors.push(`Prototype intake readiness lane ${index + 1} must be a JSON object.`);
      return;
    }
    const laneId = readString(lane, "laneId");
    const laneLabel = readString(lane, "label");
    const laneStatus = readString(lane, "status");
    const laneSummary = readString(lane, "summary");
    if (!laneId || !laneLabel || !laneSummary) {
      errors.push(`Prototype intake readiness lane ${index + 1} must include laneId, label, and summary.`);
    }
    if (!supportedLaneStatuses.has(laneStatus)) {
      errors.push(`Prototype intake readiness lane ${laneId || index + 1} has an unsupported status.`);
    }
    if (laneIds.has(laneId)) {
      errors.push(`Prototype intake readiness lane ID must be unique: ${laneId}.`);
    }
    laneIds.add(laneId);
    normalizedLanes.push({ laneId, status: laneStatus });
  });

  const signal: PrototypeIntakeReadinessSignal = { tenantId, status, lanes: normalizedLanes };
  const expectedStatus = derivePrototypeIntakeReadinessStatus(normalizedLanes);
  if (status !== expectedStatus) {
    errors.push(`Prototype intake readiness summary status must match its lanes: ${expectedStatus}.`);
  }
  const expectedAlertState = derivePrototypeIntakeCodexAlertState(
    derivePrototypeIntakeAlertDecision(signal),
  );
  if (codexAlertState !== expectedAlertState) {
    errors.push(`Prototype intake readiness Codex alert state must match its lanes: ${expectedAlertState}.`);
  }

  if (!Array.isArray(summary.blockedNextActions) || summary.blockedNextActions.some((item) => typeof item !== "string" || !item.trim())) {
    errors.push("Prototype intake readiness summary must include non-empty blocked next actions.");
  }

  return errors;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}
