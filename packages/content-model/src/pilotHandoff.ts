import { validateReleaseControlEvidence, type ReleaseControlEvidence } from "./releaseControlEvidence";

export type PilotHandoffStatus = "ready" | "needs-review" | "blocked";
export type PilotHandoffOwner = "codex" | "tenant" | "school" | "shared";
export type PilotHandoffCostImpact = "low" | "controlled" | "higher";

export interface PilotHandoffAsset {
  assetId: string;
  label: string;
  status: PilotHandoffStatus;
  owner: PilotHandoffOwner;
  evidence: string;
  nextStep: string;
}

export interface PilotHandoffRoute {
  routeId: string;
  label: string;
  path: string;
  status: PilotHandoffStatus;
  purpose: string;
}

export interface PilotHandoffDecision {
  decisionId: string;
  label: string;
  status: PilotHandoffStatus;
  owner: PilotHandoffOwner;
  costImpact: PilotHandoffCostImpact;
  note: string;
}

export interface PilotHandoffPackage {
  packageId: string;
  tenantId: string;
  label: string;
  mode: "review-only";
  recommendedPilotWindow: string;
  recommendedDeployment: string;
  summary: string;
  releaseControlEvidence: ReleaseControlEvidence;
  routes: PilotHandoffRoute[];
  assets: PilotHandoffAsset[];
  decisions: PilotHandoffDecision[];
  handoffNotes: string[];
}

const PILOT_HANDOFF_STATUSES = new Set<PilotHandoffStatus>(["ready", "needs-review", "blocked"]);
const PILOT_HANDOFF_OWNERS = new Set<PilotHandoffOwner>(["codex", "tenant", "school", "shared"]);
const PILOT_HANDOFF_COSTS = new Set<PilotHandoffCostImpact>(["low", "controlled", "higher"]);

function requireText(value: string, label: string, errors: string[]): void {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`Pilot handoff ${label} must be a non-empty string.`);
  }
}

function validateUniqueIds<T, K extends keyof T>(
  records: T[],
  idKey: K,
  label: string,
  errors: string[],
): Map<string, T> {
  const byId = new Map<string, T>();
  for (const record of records) {
    const id = record[idKey];
    if (typeof id !== "string" || id.trim().length === 0) {
      errors.push(`Pilot handoff ${label} must have a non-empty ${String(idKey)}.`);
      continue;
    }
    if (byId.has(id)) {
      errors.push(`Pilot handoff contains duplicate ${label} ${id}.`);
    }
    byId.set(id, record);
  }
  return byId;
}

export function validatePilotHandoffPackage(packet: PilotHandoffPackage): string[] {
  const errors: string[] = [];

  requireText(packet.packageId, "packageId", errors);
  requireText(packet.tenantId, "tenantId", errors);
  requireText(packet.label, "label", errors);
  requireText(packet.recommendedPilotWindow, "recommendedPilotWindow", errors);
  requireText(packet.recommendedDeployment, "recommendedDeployment", errors);
  requireText(packet.summary, "summary", errors);
  errors.push(...validateReleaseControlEvidence(packet.releaseControlEvidence).map((error) => `Pilot handoff ${error.charAt(0).toLowerCase()}${error.slice(1)}`));

  if (packet.mode !== "review-only") {
    errors.push("Pilot handoff package must remain review-only.");
  }

  if (!Array.isArray(packet.routes) || packet.routes.length === 0) {
    errors.push("Pilot handoff package must include at least one route.");
  }
  if (!Array.isArray(packet.assets) || packet.assets.length === 0) {
    errors.push("Pilot handoff package must include at least one asset.");
  }
  if (!Array.isArray(packet.decisions) || packet.decisions.length === 0) {
    errors.push("Pilot handoff package must include at least one human decision.");
  }
  if (!Array.isArray(packet.handoffNotes) || packet.handoffNotes.length === 0) {
    errors.push("Pilot handoff package must include at least one handoff note.");
  }

  const routes = Array.isArray(packet.routes) ? packet.routes : [];
  const assets = Array.isArray(packet.assets) ? packet.assets : [];
  const decisions = Array.isArray(packet.decisions) ? packet.decisions : [];

  const routesById = validateUniqueIds(routes, "routeId", "route", errors);
  validateUniqueIds(assets, "assetId", "asset", errors);
  const decisionsById = validateUniqueIds(decisions, "decisionId", "decision", errors);

  for (const route of routes) {
    requireText(route.label, `route ${route.routeId} label`, errors);
    requireText(route.path, `route ${route.routeId} path`, errors);
    requireText(route.purpose, `route ${route.routeId} purpose`, errors);
    if (!PILOT_HANDOFF_STATUSES.has(route.status)) {
      errors.push(`Pilot handoff route ${route.routeId} has an unsupported status.`);
    }
    if (typeof route.path !== "string" || !route.path.startsWith("/")) {
      errors.push(`Pilot handoff route ${route.routeId} must use an internal absolute path.`);
    }
    if (typeof route.path === "string" && /^(file:|https?:\/\/|\\\\|[A-Za-z]:)/i.test(route.path)) {
      errors.push(`Pilot handoff route ${route.routeId} must not point to an external or local-file location.`);
    }
  }

  for (const asset of assets) {
    requireText(asset.label, `asset ${asset.assetId} label`, errors);
    requireText(asset.evidence, `asset ${asset.assetId} evidence`, errors);
    requireText(asset.nextStep, `asset ${asset.assetId} nextStep`, errors);
    if (!PILOT_HANDOFF_STATUSES.has(asset.status)) {
      errors.push(`Pilot handoff asset ${asset.assetId} has an unsupported status.`);
    }
    if (!PILOT_HANDOFF_OWNERS.has(asset.owner)) {
      errors.push(`Pilot handoff asset ${asset.assetId} has an unsupported owner.`);
    }
  }

  for (const decision of decisions) {
    requireText(decision.label, `decision ${decision.decisionId} label`, errors);
    requireText(decision.note, `decision ${decision.decisionId} note`, errors);
    if (!PILOT_HANDOFF_STATUSES.has(decision.status)) {
      errors.push(`Pilot handoff decision ${decision.decisionId} has an unsupported status.`);
    }
    if (!PILOT_HANDOFF_OWNERS.has(decision.owner)) {
      errors.push(`Pilot handoff decision ${decision.decisionId} has an unsupported owner.`);
    }
    if (!PILOT_HANDOFF_COSTS.has(decision.costImpact)) {
      errors.push(`Pilot handoff decision ${decision.decisionId} has an unsupported cost impact.`);
    }
  }

  for (const note of Array.isArray(packet.handoffNotes) ? packet.handoffNotes : []) {
    requireText(note, "handoff note", errors);
  }

  const requiredRoutePrefixes = ["/enter/", "/launch/", "/teacher/sessions/"];
  for (const prefix of requiredRoutePrefixes) {
    if (![...routesById.values()].some((route) => route.path.startsWith(prefix))) {
      errors.push(`Pilot handoff package must include a route beginning with ${prefix}.`);
    }
  }

  const studentDataDecision = decisionsById.get("student-data-policy");
  if (!studentDataDecision) {
    errors.push("Pilot handoff package must include the student-data-policy decision.");
  } else if (studentDataDecision.status !== "blocked") {
    errors.push("Pilot handoff student-data-policy decision must remain blocked before a real classroom pilot.");
  }

  return errors;
}
