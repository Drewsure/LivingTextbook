export type LocalBundleHandoffCheckStatus = "passed" | "open" | "blocked";

export interface LocalBundleHandoffCheck {
  checkId: string;
  label: string;
  status: LocalBundleHandoffCheckStatus;
  detail: string;
}

export interface LocalBundleHandoffPacket {
  packetId: string;
  tenantId: string;
  bundleId: string;
  mode: "review-only";
  summary: string;
  offlineReadyAllowed: boolean;
  checks: LocalBundleHandoffCheck[];
  blockedActions: string[];
}

const REQUIRED_CHECKS = ["manifest", "asset-evidence", "route-resolution", "release-gate", "side-effects"] as const;
const REQUIRED_BLOCKED_ACTIONS = ["package-write", "offline-activation", "student-promotion", "hosted-redirect-mutation"] as const;

export function validateLocalBundleHandoffPacket(packet: LocalBundleHandoffPacket): string[] {
  const errors: string[] = [];

  if (!packet.packetId.trim()) errors.push("Local bundle handoff packet requires packetId.");
  if (!packet.tenantId.trim()) errors.push("Local bundle handoff packet requires tenantId.");
  if (!packet.bundleId.trim()) errors.push("Local bundle handoff packet requires bundleId.");
  if (packet.mode !== "review-only") errors.push("Local bundle handoff packet must remain review-only.");

  const checksById = new Map<string, LocalBundleHandoffCheck>();
  for (const check of packet.checks) {
    if (checksById.has(check.checkId)) errors.push(`Local bundle handoff packet contains duplicate check ${check.checkId}.`);
    checksById.set(check.checkId, check);
  }
  for (const checkId of REQUIRED_CHECKS) {
    if (!checksById.has(checkId)) errors.push(`Local bundle handoff packet is missing required check ${checkId}.`);
  }

  const blockedActions = new Set(packet.blockedActions);
  for (const action of REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedActions.has(action)) errors.push(`Local bundle handoff packet must block ${action}.`);
  }

  if (packet.offlineReadyAllowed && packet.checks.some((check) => check.status !== "passed")) {
    errors.push("Local bundle handoff packet cannot allow offline readiness while a check is open or blocked.");
  }
  if (checksById.get("side-effects")?.status !== "passed") {
    errors.push("Local bundle handoff packet must prove live side effects remain disabled.");
  }

  return [...new Set(errors)];
}
