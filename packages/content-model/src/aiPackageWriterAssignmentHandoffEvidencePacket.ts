export type AiGeneratedPackageWriterAssignmentHandoffEvidencePacketStatus = "blocked" | "review-only";

export interface AiGeneratedPackageWriterAssignmentHandoffEvidenceLane {
  laneId: string;
  label: string;
  sourceRecords: string[];
  requiredEvidence: string[];
  acceptanceChecks: string[];
  blockedGaps: string[];
}

export interface AiGeneratedPackageWriterAssignmentHandoffEvidencePacket {
  evidencePacketId: string;
  tenantId: string;
  requestId: string;
  assignmentShellGuardId: string;
  label: string;
  summary: string;
  status: AiGeneratedPackageWriterAssignmentHandoffEvidencePacketStatus;
  evidenceState: string;
  packageIdPreview: string;
  assignmentPreviewId: string;
  evidenceLanes: AiGeneratedPackageWriterAssignmentHandoffEvidenceLane[];
  missingEvidence: string[];
  blockedHandoffActions: string[];
  nextRequiredRecords: string[];
  supportLanguageBoundary: string[];
}

export const AI_PACKAGE_WRITER_ASSIGNMENT_HANDOFF_REQUIRED_LANE_LABELS = [
  "Assignment shell evidence lane",
  "Private link evidence lane",
  "Roster and privacy evidence lane",
  "Progress and reporting evidence lane",
  "Launch and rollback evidence lane",
] as const;

export const AI_PACKAGE_WRITER_ASSIGNMENT_HANDOFF_REQUIRED_ITEMS = [
  "Assignment shell guard storage contract",
  "Teacher QR/front-door assignment review",
  "Target-language trigger assignment check",
  "No real learner data collection proof",
  "Teacher report privacy proof",
  "Classroom launch gate review",
] as const;

export const AI_PACKAGE_WRITER_ASSIGNMENT_HANDOFF_REQUIRED_BLOCKED_ACTIONS = [
  "No assignment shell write",
  "No private assignment link activation",
  "No class roster binding",
  "No progress event stream activation",
  "No teacher report export",
  "No live classroom launch",
  "No assignment activation from generated package",
  "No support-language-only assignment handoff",
  "No raw learner audio or transcript storage",
] as const;

export function validateAiGeneratedPackageWriterAssignmentHandoffEvidencePacket(packet: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(packet)) {
    return ["AI generated package writer assignment handoff evidence packet must be a JSON object."];
  }

  const evidencePacketId = readString(packet, "evidencePacketId");
  const tenantId = readString(packet, "tenantId");
  const requestId = readString(packet, "requestId");
  const assignmentShellGuardId = readString(packet, "assignmentShellGuardId");
  const status = readString(packet, "status");
  const evidenceState = readString(packet, "evidenceState");
  const packageIdPreview = readString(packet, "packageIdPreview");
  const assignmentPreviewId = readString(packet, "assignmentPreviewId");
  const evidenceLanes = readArray(packet, "evidenceLanes");
  const missingEvidence = readStringArray(packet, "missingEvidence");
  const blockedHandoffActions = readStringArray(packet, "blockedHandoffActions");
  const supportLanguageBoundary = readStringArray(packet, "supportLanguageBoundary");

  if (!evidencePacketId || !tenantId || !requestId || !assignmentShellGuardId) {
    errors.push(
      "AI generated package writer assignment handoff evidence packet must include evidencePacketId, tenantId, requestId, and assignmentShellGuardId.",
    );
  }

  if (status !== "blocked") {
    errors.push("AI generated package writer assignment handoff evidence packet status must stay blocked.");
  }

  if (!evidenceState.toLowerCase().includes("assignment handoff blocked")) {
    errors.push(
      "AI generated package writer assignment handoff evidence packet must state that assignment handoff is blocked.",
    );
  }

  if (!packageIdPreview || !assignmentPreviewId) {
    errors.push(
      "AI generated package writer assignment handoff evidence packet must include packageIdPreview and assignmentPreviewId.",
    );
  }

  const laneLabels = evidenceLanes.flatMap((lane) => (isRecord(lane) ? [readString(lane, "label")] : []));

  for (const requiredLane of AI_PACKAGE_WRITER_ASSIGNMENT_HANDOFF_REQUIRED_LANE_LABELS) {
    if (!laneLabels.includes(requiredLane)) {
      errors.push(`AI generated package writer assignment handoff evidence packet must include lane: ${requiredLane}.`);
    }
  }

  const laneEvidence = evidenceLanes.flatMap((lane) =>
    isRecord(lane) ? readStringArray(lane, "requiredEvidence") : [],
  );

  for (const requiredEvidence of AI_PACKAGE_WRITER_ASSIGNMENT_HANDOFF_REQUIRED_ITEMS) {
    if (!laneEvidence.includes(requiredEvidence)) {
      errors.push(
        `AI generated package writer assignment handoff evidence packet must require evidence: ${requiredEvidence}.`,
      );
    }
  }

  for (const requiredAction of AI_PACKAGE_WRITER_ASSIGNMENT_HANDOFF_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedHandoffActions.includes(requiredAction)) {
      errors.push(`AI generated package writer assignment handoff evidence packet must block: ${requiredAction}.`);
    }
  }

  if (missingEvidence.length === 0) {
    errors.push("AI generated package writer assignment handoff evidence packet must list missingEvidence while blocked.");
  }

  for (const lane of evidenceLanes) {
    if (!isRecord(lane)) {
      errors.push("AI generated package writer assignment handoff evidence lanes must be objects.");
      continue;
    }

    const laneId = readString(lane, "laneId");
    const sourceRecords = readStringArray(lane, "sourceRecords");
    const requiredEvidence = readStringArray(lane, "requiredEvidence");
    const acceptanceChecks = readStringArray(lane, "acceptanceChecks");
    const blockedGaps = readStringArray(lane, "blockedGaps");

    if (!laneId) {
      errors.push("AI generated package writer assignment handoff evidence lanes must include laneId.");
    }

    if (
      sourceRecords.length === 0 ||
      requiredEvidence.length === 0 ||
      acceptanceChecks.length === 0 ||
      blockedGaps.length === 0
    ) {
      errors.push(
        `AI generated package writer assignment handoff evidence lane ${laneId || "(missing)"} must include sourceRecords, requiredEvidence, acceptanceChecks, and blockedGaps.`,
      );
    }

    if (!blockedGaps.every((blockedGap) => blockedGap.startsWith("No "))) {
      errors.push(
        `AI generated package writer assignment handoff evidence lane ${laneId || "(missing)"} blockedGaps must be explicit No rules.`,
      );
    }
  }

  if (supportLanguageBoundary.length === 0 || !supportLanguageBoundary.join(" ").toLowerCase().includes("support")) {
    errors.push(
      "AI generated package writer assignment handoff evidence packet must preserve a support-language boundary.",
    );
  }

  if (tenantId === "ministar") {
    const packetText = [
      readString(packet, "summary"),
      ...evidenceLanes.flatMap((lane) => (isRecord(lane) ? readStringArray(lane, "acceptanceChecks") : [])),
      ...supportLanguageBoundary,
    ]
      .join(" ")
      .toLowerCase();

    if (!packetText.includes("english")) {
      errors.push("MiniStar assignment handoff evidence packet must preserve English as the target-language trigger.");
    }

    if (!packetText.includes("hiragana")) {
      errors.push("MiniStar assignment handoff evidence packet must preserve hiragana support-language rules.");
    }
  }

  return errors;
}

export function getAiGeneratedPackageWriterAssignmentHandoffEvidencePacketWarnings(packet: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(packet)) {
    return warnings;
  }

  const nextRequiredRecords = readStringArray(packet, "nextRequiredRecords");

  if (!nextRequiredRecords.includes("Assignment handoff evidence packet storage contract")) {
    warnings.push("AI generated package writer assignment handoff evidence packet should require its storage contract.");
  }

  if (!nextRequiredRecords.includes("Teacher assignment rollout gate")) {
    warnings.push("AI generated package writer assignment handoff evidence packet should require rollout gate review.");
  }

  if (!nextRequiredRecords.includes("Teacher report export policy review")) {
    warnings.push(
      "AI generated package writer assignment handoff evidence packet should require report export policy review.",
    );
  }

  return warnings;
}

export function validateAiGeneratedPackageWriterAssignmentHandoffEvidencePackets(packets: unknown[]): string[] {
  return packets.flatMap((packet) => validateAiGeneratedPackageWriterAssignmentHandoffEvidencePacket(packet));
}

export function getAiGeneratedPackageWriterAssignmentHandoffEvidencePacketCollectionWarnings(
  packets: unknown[],
): string[] {
  return packets.flatMap((packet) => getAiGeneratedPackageWriterAssignmentHandoffEvidencePacketWarnings(packet));
}

function readArray(source: Record<string, unknown>, key: string): unknown[] {
  const value = source[key];
  return Array.isArray(value) ? value : [];
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function readStringArray(source: Record<string, unknown>, key: string): string[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
