import { validateEvidenceAttachmentStorageHandoffBinding } from "./evidenceAttachmentStorageHandoff";
import { validateEvidenceAttachmentStorageReconciliation } from "./evidenceAttachmentStorageReconciliation";
import { validateAssetEvidencePacket, type AssetEvidencePacket } from "./assetEvidencePacket";
import { validateUploadQuarantineAdmissionHandoffBinding } from "./uploadQuarantineAdmissionHandoff";
import { validatePersistenceProviderSelectionPreflight, type PersistenceProviderSelectionPreflight } from "./persistenceProviderSelectionPreflight";

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
  assetEvidencePackets: AssetEvidencePacket[];
  admissionBindings: import("./uploadQuarantineAdmissionHandoff").UploadQuarantineAdmissionHandoffBinding[];
  storageReadinessBinding: import("./evidenceAttachmentStorageHandoff").EvidenceAttachmentStorageHandoffBinding;
  storageReconciliation: import("./evidenceAttachmentStorageReconciliation").EvidenceAttachmentStorageReconciliation;
  storageSelectionPreflight: PersistenceProviderSelectionPreflight;
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
  const assetEvidencePackets = Array.isArray(packet.assetEvidencePackets) ? packet.assetEvidencePackets : [];
  if (assetEvidencePackets.length === 0) errors.push("Evidence packet handoff must include asset evidence packets.");
  validateUniqueIds(assetEvidencePackets, "packetId", "asset evidence packet", errors);
  for (const assetEvidencePacket of assetEvidencePackets) {
    const packetErrors = validateAssetEvidencePacket(assetEvidencePacket);
    errors.push(...packetErrors.map((error) => `Evidence packet handoff asset evidence: ${error}`));
    if (assetEvidencePacket.tenantId !== packet.tenantId) {
      errors.push(`Evidence packet handoff asset evidence ${assetEvidencePacket.packetId} must match handoff tenant.`);
    }
    if (assetEvidencePacket.packageId !== packet.packageId) {
      errors.push(`Evidence packet handoff asset evidence ${assetEvidencePacket.packetId} must match handoff package.`);
    }
  }
  const admissionBindings = Array.isArray(packet.admissionBindings) ? packet.admissionBindings : [];
  if (admissionBindings.length === 0) errors.push("Evidence packet handoff must include upload admission bindings.");
  for (const binding of admissionBindings) {
    const bindingErrors = validateUploadQuarantineAdmissionHandoffBinding(binding);
    errors.push(...bindingErrors.map((error) => `Evidence packet handoff admission binding: ${error}`));
  }
  const storageBindingErrors = validateEvidenceAttachmentStorageHandoffBinding(packet.storageReadinessBinding);
  errors.push(...storageBindingErrors.map((error) => `Evidence packet handoff storage binding: ${error}`));
  const reconciliationErrors = validateEvidenceAttachmentStorageReconciliation(packet.storageReconciliation);
  errors.push(...reconciliationErrors.map((error) => `Evidence packet handoff storage reconciliation: ${error}`));
  if (packet.storageReconciliation?.tenantId !== packet.tenantId) {
    errors.push("Evidence packet handoff storage reconciliation must match handoff tenant.");
  }
  if (packet.storageReconciliation?.packageId !== packet.packageId) {
    errors.push("Evidence packet handoff storage reconciliation must match handoff package.");
  }
  if (packet.storageReconciliation?.storageBindingId !== packet.storageReadinessBinding?.bindingId) {
    errors.push("Evidence packet handoff storage reconciliation must match storage binding.");
  }
  if (packet.storageReconciliation?.storageSelectionPreflightId !== packet.storageSelectionPreflight?.preflightId) {
    errors.push("Evidence packet handoff storage reconciliation must match storage selection preflight.");
  }
  if (packet.storageReconciliation?.storageSelectionGateId !== packet.storageSelectionPreflight?.evidenceStorageGateId) {
    errors.push("Evidence packet handoff storage reconciliation must match storage selection gate.");
  }
  const storageSelectionErrors = validatePersistenceProviderSelectionPreflight(packet.storageSelectionPreflight);
  errors.push(...storageSelectionErrors.map((error) => `Evidence packet handoff storage selection: ${error}`));
  if (packet.storageSelectionPreflight?.status !== "blocked") {
    errors.push("Evidence packet handoff storage selection must remain blocked until human policy review.");
  }
  if (packet.storageSelectionPreflight?.tenantId !== packet.tenantId) {
    errors.push("Evidence packet handoff storage selection must match handoff tenant.");
  }
  if (packet.storageSelectionPreflight?.packageId !== packet.packageId) {
    errors.push("Evidence packet handoff storage selection must match handoff package.");
  }
  if (packet.storageSelectionPreflight?.evidenceStorageGateId !== packet.storageReadinessBinding?.selectionGateId) {
    errors.push("Evidence packet handoff storage selection must match storage selection gate.");
  }
  if (packet.storageSelectionPreflight?.preflightId !== packet.storageReadinessBinding?.storageSelectionPreflightId) {
    errors.push("Evidence packet handoff storage selection must match storage readiness preflight.");
  }
  const assetPacketIds = new Set(assetEvidencePackets.map((assetPacket) => assetPacket.packetId));
  const attachmentIds = new Set(assetEvidencePackets.flatMap((assetPacket) => assetPacket.attachments.map((attachment) => attachment.attachmentId)));
  for (const assetPacketId of packet.storageReconciliation?.assetPacketIds ?? []) {
    if (!assetPacketIds.has(assetPacketId)) errors.push(`Evidence packet handoff storage reconciliation references unknown asset packet ${assetPacketId}.`);
  }
  for (const attachmentId of packet.storageReconciliation?.attachmentIds ?? []) {
    if (!attachmentIds.has(attachmentId)) errors.push(`Evidence packet handoff storage reconciliation references unknown attachment ${attachmentId}.`);
  }
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
