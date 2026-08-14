export type PublisherMaintenanceStatus = "ready" | "needs-owner" | "blocked";
export type PublisherMaintenanceDomain = "content" | "media" | "games" | "routes" | "reports";
export type PublisherMaintenanceChangeStatus = "draft" | "review-required" | "blocked" | "ready-for-release";
export type PublisherMaintenanceRouteImpact = "none" | "alias-preserved" | "requires-redirect";

export interface PublisherMaintenanceItem {
  itemId: string;
  label: string;
  domain: PublisherMaintenanceDomain;
  owner: string;
  cadence: string;
  status: PublisherMaintenanceStatus;
  whiteLabelRule: string;
  evidence: string;
  nextStep: string;
  notAllowedYet: string[];
}

export interface PublisherReleaseWindow {
  releaseId: string;
  label: string;
  timing: string;
  purpose: string;
  requiredProof: string[];
}

export interface PublisherMaintenanceChangeRequest {
  requestId: string;
  label: string;
  domain: PublisherMaintenanceDomain;
  requestedBy: string;
  targetEdition: string;
  changeType: string;
  status: PublisherMaintenanceChangeStatus;
  routeImpact: PublisherMaintenanceRouteImpact;
  mediaImpact: string;
  gameImpact: string;
  reportImpact: string;
  requiredApprovals: string[];
  blockedBy: string[];
  nextAction: string;
}

export interface PublisherMaintenancePlan {
  planId: string;
  label: string;
  summary: string;
  partnerPromise: string;
  items: PublisherMaintenanceItem[];
  releaseWindows: PublisherReleaseWindow[];
  changeRequests: PublisherMaintenanceChangeRequest[];
  standingRules: string[];
}

export const PUBLISHER_MAINTENANCE_REQUIRED_DOMAINS = ["content", "media", "games", "routes", "reports"] as const;

export const PUBLISHER_MAINTENANCE_REQUIRED_RELEASE_WINDOWS = [
  "pilot-package",
  "annual-edition",
  "midyear-refresh",
] as const;

export const PUBLISHER_MAINTENANCE_REQUIRED_CHANGE_DOMAINS = ["media", "games", "routes"] as const;

export function validatePublisherMaintenancePlan(plan: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(plan)) {
    return ["Publisher maintenance plan must be a JSON object."];
  }

  const planId = readString(plan, "planId");
  const label = readString(plan, "label");
  const summary = readString(plan, "summary");
  const partnerPromise = readString(plan, "partnerPromise");
  const items = readArray(plan, "items");
  const releaseWindows = readArray(plan, "releaseWindows");
  const changeRequests = readArray(plan, "changeRequests");
  const standingRules = readStringArray(plan, "standingRules");

  if (!planId || !label || !summary || !partnerPromise) {
    errors.push("Publisher maintenance plan must include plan id, label, summary, and partner promise.");
  }

  if (!partnerPromise.toLowerCase().includes("stable routes")) {
    errors.push("Publisher maintenance plan must preserve the stable route promise.");
  }

  for (const domain of PUBLISHER_MAINTENANCE_REQUIRED_DOMAINS) {
    if (!items.some((item) => isRecord(item) && readString(item, "domain") === domain)) {
      errors.push(`Publisher maintenance plan must include maintenance domain: ${domain}.`);
    }
  }

  for (const releaseWindow of PUBLISHER_MAINTENANCE_REQUIRED_RELEASE_WINDOWS) {
    if (!releaseWindows.some((item) => isRecord(item) && readString(item, "releaseId") === releaseWindow)) {
      errors.push(`Publisher maintenance plan must include release window: ${releaseWindow}.`);
    }
  }

  for (const domain of PUBLISHER_MAINTENANCE_REQUIRED_CHANGE_DOMAINS) {
    if (!changeRequests.some((request) => isRecord(request) && readString(request, "domain") === domain)) {
      errors.push(`Publisher maintenance change queue must include ${domain} request coverage.`);
    }
  }

  if (!textListIncludes(standingRules, "Publisher maintenance is a first-class white-label feature")) {
    errors.push("Publisher maintenance plan must state that maintenance is a first-class white-label feature.");
  }

  if (!textListIncludes(standingRules, "core learner audio remains separate")) {
    errors.push("Publisher maintenance plan must preserve the learner-audio separation rule.");
  }

  if (!textListIncludes(standingRules, "Old printed QR codes must continue resolving")) {
    errors.push("Publisher maintenance plan must preserve printed QR continuity.");
  }

  for (const item of items) {
    if (!isRecord(item)) {
      errors.push("Publisher maintenance item must be an object.");
      continue;
    }

    const itemId = readString(item, "itemId");
    const itemDomain = readString(item, "domain");
    const status = readString(item, "status");
    const owner = readString(item, "owner");
    const evidence = readString(item, "evidence");
    const nextStep = readString(item, "nextStep");
    const notAllowedYet = readStringArray(item, "notAllowedYet");

    if (!itemId || !PUBLISHER_MAINTENANCE_REQUIRED_DOMAINS.includes(itemDomain as PublisherMaintenanceDomain)) {
      errors.push(`Publisher maintenance item must include a valid id and domain: ${itemId || "(missing)"}.`);
    }

    if (status !== "ready" && status !== "needs-owner" && status !== "blocked") {
      errors.push(`Publisher maintenance item must use a supported status: ${itemId || "(missing)"}.`);
    }

    if (!owner || !evidence || !nextStep || notAllowedYet.length === 0) {
      errors.push(`Publisher maintenance item must include owner, evidence, next step, and guardrails: ${itemId || "(missing)"}.`);
    }
  }

  for (const releaseWindow of releaseWindows) {
    if (!isRecord(releaseWindow)) {
      errors.push("Publisher release window must be an object.");
      continue;
    }

    const releaseId = readString(releaseWindow, "releaseId");
    const requiredProof = readStringArray(releaseWindow, "requiredProof");

    if (!releaseId || requiredProof.length < 3) {
      errors.push(`Publisher release window must include id and enough required proof: ${releaseId || "(missing)"}.`);
    }
  }

  for (const request of changeRequests) {
    if (!isRecord(request)) {
      errors.push("Publisher maintenance change request must be an object.");
      continue;
    }

    const requestId = readString(request, "requestId");
    const status = readString(request, "status");
    const domain = readString(request, "domain");
    const routeImpact = readString(request, "routeImpact");
    const mediaImpact = readString(request, "mediaImpact");
    const gameImpact = readString(request, "gameImpact");
    const reportImpact = readString(request, "reportImpact");
    const requiredApprovals = readStringArray(request, "requiredApprovals");
    const blockedBy = readStringArray(request, "blockedBy");
    const nextAction = readString(request, "nextAction");

    if (!requestId || !PUBLISHER_MAINTENANCE_REQUIRED_DOMAINS.includes(domain as PublisherMaintenanceDomain)) {
      errors.push(`Publisher maintenance change request must include a valid id and domain: ${requestId || "(missing)"}.`);
    }

    if (status !== "draft" && status !== "review-required" && status !== "blocked" && status !== "ready-for-release") {
      errors.push(`Publisher maintenance change request must use a supported status: ${requestId || "(missing)"}.`);
    }

    if (routeImpact !== "none" && routeImpact !== "alias-preserved" && routeImpact !== "requires-redirect") {
      errors.push(`Publisher maintenance change request must use a supported route impact: ${requestId || "(missing)"}.`);
    }

    if (!mediaImpact || !gameImpact || !reportImpact || requiredApprovals.length === 0 || !nextAction) {
      errors.push(
        `Publisher maintenance change request must include media, game, report, approval, and next-action evidence: ${
          requestId || "(missing)"
        }.`,
      );
    }

    if (status === "ready-for-release" && blockedBy.length > 0) {
      errors.push(`Publisher maintenance change request cannot be ready for release while blockers remain: ${requestId}.`);
    }

    if (routeImpact === "requires-redirect" && status !== "blocked") {
      errors.push(`Publisher maintenance route redirects must stay blocked until rollback and notice rules are reviewed: ${requestId}.`);
    }
  }

  return errors;
}

export function getPublisherMaintenancePlanWarnings(plan: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(plan)) {
    return warnings;
  }

  const items = readArray(plan, "items");
  const changeRequests = readArray(plan, "changeRequests");
  const standingRules = readStringArray(plan, "standingRules");

  if (!items.some((item) => isRecord(item) && readString(item, "status") === "needs-owner")) {
    warnings.push("Publisher maintenance plans should keep owner-decision needs visible until real partner roles are assigned.");
  }

  if (!changeRequests.some((request) => isRecord(request) && readString(request, "status") === "blocked")) {
    warnings.push("Publisher maintenance change queues should keep at least one blocked route/release example visible in the foundation.");
  }

  if (!textListIncludes(standingRules, "Hosted and local packages must share")) {
    warnings.push("Publisher maintenance plans should state hosted/local manifest compatibility.");
  }

  return warnings;
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

function textListIncludes(items: string[], expected: string): boolean {
  const normalizedExpected = expected.toLowerCase();
  return items.some((item) => item.toLowerCase().includes(normalizedExpected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
