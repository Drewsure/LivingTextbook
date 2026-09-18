import {
  validateLocalBundleHandoffPacket,
  type LocalBundleHandoffCheck,
  type LocalBundleHandoffPacket,
} from "./localBundleHandoff";
import type { LocalBundleHandoffReviewRequest } from "./localBundleHandoffReview";

export interface LocalBundleHandoffItemRecord {
  itemId: string;
  owner: string;
  artifact: string;
  status: string;
  blocker: string;
  nextAction: string;
}

export interface LocalBundleHandoffRecord {
  handoffId: string;
  tenantId: string;
  bundleId: string;
  packageId: string;
  packetId: string;
  mode: "review-only";
  summary: string;
  checks: LocalBundleHandoffCheck[];
  blockedActions: string[];
  items: LocalBundleHandoffItemRecord[];
  blockedCount: number;
  offlineReadyAllowed: boolean;
}

export interface LocalBundleHandoffReviewReadResult {
  status: "available" | "blocked";
  provider: string | null;
  record: LocalBundleHandoffRecord | null;
  errors: string[];
}

export interface LocalBundleHandoffReviewProvider {
  readonly provider: string | null;
  read(request: LocalBundleHandoffReviewRequest): LocalBundleHandoffReviewReadResult;
}

export interface LocalBundleHandoffRecordSource {
  packet: LocalBundleHandoffPacket;
  packageId: string;
  items: LocalBundleHandoffItemRecord[];
}

export function mapLocalBundleHandoffPacketToRecord(source: LocalBundleHandoffRecordSource): LocalBundleHandoffRecord {
  const packetErrors = validateLocalBundleHandoffPacket(source.packet);
  if (packetErrors.length > 0) {
    throw new Error(`Local bundle handoff packet cannot be mapped: ${packetErrors.join(" ")}`);
  }
  if (!source.packageId.trim()) {
    throw new Error("Local bundle handoff record requires packageId.");
  }
  if (source.items.some((item) => !item.itemId.trim() || !item.owner.trim() || !item.artifact.trim())) {
    throw new Error("Local bundle handoff record items require itemId, owner, and artifact.");
  }

  const blockedCount = source.packet.checks.filter((check) => check.status !== "passed").length
    + source.items.filter((item) => item.status !== "passed").length;

  return {
    handoffId: source.packet.packetId,
    tenantId: source.packet.tenantId,
    bundleId: source.packet.bundleId,
    packageId: source.packageId,
    packetId: source.packet.packetId,
    mode: "review-only",
    summary: source.packet.summary,
    checks: source.packet.checks.map((check) => ({ ...check })),
    blockedActions: [...source.packet.blockedActions],
    items: source.items.map((item) => ({ ...item })),
    blockedCount,
    offlineReadyAllowed: source.packet.offlineReadyAllowed && blockedCount === 0,
  };
}

export function validateLocalBundleHandoffRecord(
  record: LocalBundleHandoffRecord,
  request?: Pick<LocalBundleHandoffReviewRequest, "tenantId" | "bundleId" | "packetId">,
): string[] {
  const errors: string[] = [];
  for (const field of ["handoffId", "tenantId", "bundleId", "packageId", "packetId", "summary"] as const) {
    if (!record[field].trim()) errors.push(`Local bundle handoff record requires ${field}.`);
  }
  if (record.mode !== "review-only") errors.push("Local bundle handoff record must remain review-only.");
  if (record.blockedCount < 0 || !Number.isInteger(record.blockedCount)) {
    errors.push("Local bundle handoff record blockedCount must be a non-negative integer.");
  }
  if (record.offlineReadyAllowed && record.blockedCount !== 0) {
    errors.push("Local bundle handoff record cannot allow offline readiness with blocked items.");
  }
  if (request) {
    if (record.tenantId !== request.tenantId) errors.push("Local bundle handoff record tenant does not match the review request.");
    if (record.bundleId !== request.bundleId) errors.push("Local bundle handoff record bundle does not match the review request.");
    if (record.packetId !== request.packetId) errors.push("Local bundle handoff record packet does not match the review request.");
  }
  return [...new Set(errors)];
}
