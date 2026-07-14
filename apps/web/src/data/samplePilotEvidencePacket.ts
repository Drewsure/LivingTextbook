import { samplePackageApprovalLedger, type PackageApprovalLedger } from "@/data/samplePackageApprovalLedger";
import {
  samplePackagePublishGate,
  type PackagePublishGate,
  type PackagePublishGateDomain,
  type PackagePublishGateOwner,
} from "@/data/samplePackagePublishGate";

export type PilotEvidencePacketStatus = "attached" | "missing" | "blocked";
export type PilotEvidencePacketSource = "publish-gate" | "approval-ledger";

export interface PilotEvidencePacketItem {
  evidenceId: string;
  label: string;
  source: PilotEvidencePacketSource;
  domain: PackagePublishGateDomain | "approval";
  owner: PackagePublishGateOwner | string;
  status: PilotEvidencePacketStatus;
  currentEvidence: string;
  requiredEvidence: string[];
  blockedBy: string[];
  nextStep: string;
}

export interface PilotEvidencePacket {
  packetId: string;
  label: string;
  tenantId: string;
  packageId: string;
  releaseCandidate: string;
  sourceOfTruth: string;
  summary: string;
  storageStatus: string;
  uploadStatus: string;
  signoffCaptureStatus: string;
  gateEvidence: PilotEvidencePacketItem[];
  approvalEvidence: PilotEvidencePacketItem[];
  blockedActions: string[];
}

export const samplePilotEvidencePacket = createPilotEvidencePacket(samplePackagePublishGate, samplePackageApprovalLedger);

export function createPilotEvidencePacket(gate: PackagePublishGate, ledger: PackageApprovalLedger): PilotEvidencePacket {
  return {
    packetId: `${gate.packageId}-${gate.releaseCandidate.toLowerCase().replaceAll(" ", "-")}-evidence-packet`,
    label: "Pilot evidence packet preview",
    tenantId: gate.tenantId,
    packageId: gate.packageId,
    releaseCandidate: gate.releaseCandidate,
    sourceOfTruth: "Source of truth: package publish gate and package approval ledger",
    summary:
      "This packet lists the proof a publisher, school, or platform reviewer must collect before a controlled demo can become a real pilot. It is metadata-first and does not enable uploads, signatures, or student assignment.",
    storageStatus: "Evidence storage required",
    uploadStatus: "No evidence upload",
    signoffCaptureStatus: "No signed approval capture",
    gateEvidence: gate.items.map((item) => ({
      evidenceId: `gate-${item.gateId}`,
      label: item.label,
      source: "publish-gate",
      domain: item.domain,
      owner: item.owner,
      status: item.status === "ready" ? "attached" : item.status === "blocked" ? "blocked" : "missing",
      currentEvidence: item.evidence,
      requiredEvidence: item.requiredBeforePilot,
      blockedBy: item.notAllowedYet,
      nextStep: item.nextStep,
    })),
    approvalEvidence: ledger.signoffs.map((signoff) => ({
      evidenceId: `approval-${signoff.signoffId}`,
      label: signoff.label,
      source: "approval-ledger",
      domain: "approval",
      owner: signoff.owner,
      status: signoff.status === "signed" ? "attached" : signoff.status === "blocked" ? "blocked" : "missing",
      currentEvidence: signoff.evidence,
      requiredEvidence: signoff.cannotApproveWhile,
      blockedBy: signoff.cannotApproveWhile,
      nextStep: signoff.nextStep,
    })),
    blockedActions: [
      "No evidence upload in foundation preview",
      "No signed approval capture before identity, storage, and retention rules exist",
      "No chat-only approval proof",
      "No pilot release from evidence packet alone",
      "No student assignment until release-control gates and approval ledger pass",
    ],
  };
}
