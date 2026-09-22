export type EvidencePacketHandoffStatus = "preview-ready" | "blocked";

export interface EvidencePacketHandoffSection {
  sectionId: string;
  label: string;
  status: EvidencePacketHandoffStatus;
  sourceRoute: string;
  includedRecords: string[];
  missingBeforeExport: string[];
}

export interface EvidencePacketHandoffRecipient {
  recipientId: string;
  label: string;
  responsibility: string;
  blockedUntil: string[];
}

export interface EvidencePacketHandoffPackage {
  packageId: string;
  routeKey: string;
  tenantId: string;
  label: string;
  summary: string;
  reviewStatus: "handoff-preview-only";
  sourceIndexRoute: string;
  storageRecord: "evidence_packet";
  sections: EvidencePacketHandoffSection[];
  recipients: EvidencePacketHandoffRecipient[];
  exportBlockedActions: string[];
  nextGate: string[];
}

const HANDOFF_STATUSES = new Set<EvidencePacketHandoffStatus>(["preview-ready", "blocked"]);

export function validateEvidencePacketHandoffPackage(packet: EvidencePacketHandoffPackage): string[] {
  const errors: string[] = [];

  for (const field of ["packageId", "routeKey", "tenantId", "label", "summary", "sourceIndexRoute"] as const) {
    if (typeof packet[field] !== "string" || packet[field].trim().length === 0) {
      errors.push(`Evidence packet handoff ${field} must be a non-empty string.`);
    }
  }

  if (packet.reviewStatus !== "handoff-preview-only") {
    errors.push("Evidence packet handoff must remain preview-only.");
  }
  if (packet.storageRecord !== "evidence_packet") {
    errors.push("Evidence packet handoff must use the evidence_packet storage record.");
  }
  if (!isInternalPath(packet.sourceIndexRoute)) {
    errors.push("Evidence packet handoff source index must use an internal absolute path.");
  }

  const sections = Array.isArray(packet.sections) ? packet.sections : [];
  const recipients = Array.isArray(packet.recipients) ? packet.recipients : [];
  validateUniqueIds(sections, "sectionId", "section", errors);
  validateUniqueIds(recipients, "recipientId", "recipient", errors);

  if (sections.length === 0) errors.push("Evidence packet handoff must include sections.");
  if (recipients.length === 0) errors.push("Evidence packet handoff must include recipients.");

  for (const section of sections) {
    requireText(section.sectionId, "sectionId", errors);
    requireText(section.label, "section label", errors);
    if (!HANDOFF_STATUSES.has(section.status)) errors.push(`Evidence packet handoff section ${section.sectionId} has an unsupported status.`);
    if (!isInternalPath(section.sourceRoute)) errors.push(`Evidence packet handoff section ${section.sectionId} must use an internal absolute path.`);
    if (!Array.isArray(section.includedRecords) || section.includedRecords.length === 0) {
      errors.push(`Evidence packet handoff section ${section.sectionId} must include source records.`);
    }
    if (!Array.isArray(section.missingBeforeExport) || section.missingBeforeExport.length === 0) {
      errors.push(`Evidence packet handoff section ${section.sectionId} must state missing export evidence.`);
    }
  }

  for (const recipient of recipients) {
    requireText(recipient.recipientId, "recipientId", errors);
    requireText(recipient.label, "recipient label", errors);
    requireText(recipient.responsibility, "recipient responsibility", errors);
    if (!Array.isArray(recipient.blockedUntil) || recipient.blockedUntil.length === 0) {
      errors.push(`Evidence packet handoff recipient ${recipient.recipientId} must state its blocked-until conditions.`);
    }
  }

  if (!hasRequiredBlockedAction(packet.exportBlockedActions, "No evidence packet export")) {
    errors.push("Evidence packet handoff must block evidence packet export.");
  }
  if (!hasRequiredBlockedAction(packet.exportBlockedActions, "No signed approval capture")) {
    errors.push("Evidence packet handoff must block signed approval capture.");
  }
  if (!hasRequiredBlockedAction(packet.exportBlockedActions, "No publish action")) {
    errors.push("Evidence packet handoff must block package publish.");
  }
  if (!Array.isArray(packet.nextGate) || packet.nextGate.length === 0) {
    errors.push("Evidence packet handoff must include a next gate.");
  }

  return [...new Set(errors)];
}

function requireText(value: unknown, label: string, errors: string[]): void {
  if (typeof value !== "string" || value.trim().length === 0) errors.push(`Evidence packet handoff ${label} must be non-empty.`);
}

function validateUniqueIds<T extends object>(records: T[], key: keyof T, label: string, errors: string[]): void {
  const seen = new Set<string>();
  for (const record of records) {
    const id = record[key];
    if (typeof id !== "string" || id.trim().length === 0) continue;
    if (seen.has(id)) errors.push(`Evidence packet handoff contains duplicate ${label} ${id}.`);
    seen.add(id);
  }
}

function isInternalPath(value: unknown): value is string {
  return typeof value === "string"
    && value.startsWith("/")
    && !/^(?:\/\/|file:|https?:\/\/|[A-Za-z]:)/i.test(value);
}

function hasRequiredBlockedAction(actions: unknown, required: string): boolean {
  return Array.isArray(actions) && actions.some((action) => action === required);
}
