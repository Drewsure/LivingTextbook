import { validateReleaseControlEvidence, type ReleaseControlEvidence } from "./releaseControlEvidence";
import type { TeacherReportPackageSnapshotDeployment } from "./teacherReportPackageSnapshot";

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

export interface PilotHandoffReportSnapshotEvidence {
  snapshotId: string;
  tenantId: string;
  packageId: string;
  launchCode: string;
  snapshotFingerprint: string;
  deploymentModes: TeacherReportPackageSnapshotDeployment[];
  recoveryPacketsValid: boolean;
  exportAllowed: false;
  writesAllowed: false;
  rawLearnerAudioIncluded: false;
  learnerTranscriptIncluded: false;
  realLearnerIdentifiersIncluded: false;
}

export interface PilotHandoffPersistenceGateEvidence {
  status: "ready" | "blocked" | "rehearsal";
  mode: "durable-managed" | "non-durable-rehearsal";
  ready: boolean;
  tenantId: string;
  packageId: string;
  launchCode: string;
  checkedAt: string;
  blockedReasons: string[];
  writesAllowed: false;
}

export interface PilotHandoffActivationPreflightEvidence {
  packetId: string;
  tenantId: string;
  packageId: string;
  deploymentDecisionId: string;
  policyAcceptancePreflightId: string;
  acceptanceRecordPreviewId: string;
  deploymentSelectionStatus: "unselected" | "selected-review-only";
  policyAcceptanceStatus: "not-accepted";
  requestedMode: "durable-managed";
  status: "ready" | "blocked";
  passedChecks: number;
  openChecks: number;
  blockedChecks: number;
  blockedReasons: string[];
  canActivate: false;
}

export interface PilotHandoffApprovalEvidence {
  ledgerId: string;
  tenantId: string;
  packageId: string;
  status: "ready" | "needs-review" | "blocked";
  totalRequiredSignoffs: number;
  signedRequiredSignoffs: number;
  openRequiredSignoffs: number;
  blockedRequiredSignoffs: number;
  approvalCaptureAllowed: false;
  packagePromotionAllowed: false;
  mode: "review-only";
}

export interface PilotHandoffPackage {
  packageId: string;
  routeKey: string;
  tenantId: string;
  label: string;
  mode: "review-only";
  recommendedPilotWindow: string;
  recommendedDeployment: string;
  summary: string;
  releaseControlEvidence: ReleaseControlEvidence;
  approvalEvidence: PilotHandoffApprovalEvidence;
  reportSnapshotEvidence: PilotHandoffReportSnapshotEvidence;
  persistenceGateEvidence: PilotHandoffPersistenceGateEvidence;
  activationPreflightEvidence: PilotHandoffActivationPreflightEvidence;
  storageSelectionPreflightId: string;
  storageSelectionGateId: string;
  storageSelectionStatus: "blocked";
  storageSelectionAllowed: false;
  routes: PilotHandoffRoute[];
  assets: PilotHandoffAsset[];
  decisions: PilotHandoffDecision[];
  handoffNotes: string[];
}

export interface PilotHandoffLineageSources {
  deploymentDecision: {
    decisionId: string;
    tenantId: string;
    packageId: string;
    policyAcceptancePreflightId: string;
    acceptanceRecordPreviewId: string;
    selectionStatus: "unselected" | "selected-review-only";
    policyAcceptanceStatus: "not-accepted";
    status: "review-only";
    policyAccepted: false;
    persistenceActivationAllowed: false;
    classroomLaunchAllowed: false;
  };
  policyAcceptancePreflight: {
    preflightId: string;
    tenantId: string;
    packageId: string;
    acceptanceStatus: string;
  };
  acceptanceRecordPreview: {
    previewId: string;
    tenantId: string;
    packageId: string;
    statusLabel: string;
  };
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
  requireText(packet.routeKey, "routeKey", errors);
  requireText(packet.tenantId, "tenantId", errors);
  requireText(packet.label, "label", errors);
  requireText(packet.recommendedPilotWindow, "recommendedPilotWindow", errors);
  requireText(packet.recommendedDeployment, "recommendedDeployment", errors);
  requireText(packet.summary, "summary", errors);
  errors.push(...validateReleaseControlEvidence(packet.releaseControlEvidence).map((error) => `Pilot handoff ${error.charAt(0).toLowerCase()}${error.slice(1)}`));

  const approvalEvidence = packet.approvalEvidence;
  if (!approvalEvidence || typeof approvalEvidence !== "object" || Array.isArray(approvalEvidence)) {
    errors.push("Pilot handoff approval evidence is required.");
  } else {
    for (const field of ["ledgerId", "tenantId", "packageId"] as const) {
      requireText(approvalEvidence[field], `approval ${field}`, errors);
    }
    if (approvalEvidence.tenantId !== packet.tenantId) {
      errors.push("Pilot handoff approval tenant must match the handoff tenant.");
    }
    if (approvalEvidence.packageId !== packet.packageId) {
      errors.push("Pilot handoff approval package must match the handoff package.");
    }
    for (const field of ["totalRequiredSignoffs", "signedRequiredSignoffs", "openRequiredSignoffs", "blockedRequiredSignoffs"] as const) {
      if (!Number.isSafeInteger(approvalEvidence[field]) || approvalEvidence[field] < 0) {
        errors.push(`Pilot handoff approval ${field} must be a non-negative safe integer.`);
      }
    }
    if (approvalEvidence.signedRequiredSignoffs + approvalEvidence.openRequiredSignoffs !== approvalEvidence.totalRequiredSignoffs) {
      errors.push("Pilot handoff approval sign-off counts must reconcile.");
    }
    const expectedApprovalStatus = approvalEvidence.blockedRequiredSignoffs > 0
      ? "blocked"
      : approvalEvidence.openRequiredSignoffs > 0
        ? "needs-review"
        : "ready";
    if (approvalEvidence.status !== expectedApprovalStatus) {
      errors.push("Pilot handoff approval status must match its sign-off counts.");
    }
    if (approvalEvidence.approvalCaptureAllowed !== false) {
      errors.push("Pilot handoff approval capture must remain false.");
    }
    if (approvalEvidence.packagePromotionAllowed !== false) {
      errors.push("Pilot handoff package promotion must remain false.");
    }
    if (approvalEvidence.mode !== "review-only") {
      errors.push("Pilot handoff approval evidence must remain review-only.");
    }
  }

  requireText(packet.storageSelectionPreflightId, "storage selection preflight id", errors);
  requireText(packet.storageSelectionGateId, "storage selection gate id", errors);
  if (packet.storageSelectionStatus !== "blocked") {
    errors.push("Pilot handoff storage selection status must remain blocked.");
  }
  if (packet.storageSelectionAllowed !== false) {
    errors.push("Pilot handoff storage selection must remain false.");
  }

  const reportSnapshotEvidence = packet.reportSnapshotEvidence;
  if (!reportSnapshotEvidence || typeof reportSnapshotEvidence !== "object" || Array.isArray(reportSnapshotEvidence)) {
    errors.push("Pilot handoff report snapshot evidence is required.");
  } else {
    for (const field of ["snapshotId", "tenantId", "packageId", "launchCode", "snapshotFingerprint"] as const) {
      requireText(reportSnapshotEvidence[field], `report snapshot ${field}`, errors);
    }
    if (reportSnapshotEvidence.tenantId !== packet.tenantId) {
      errors.push("Pilot handoff report snapshot tenant must match the handoff tenant.");
    }
    if (reportSnapshotEvidence.packageId !== packet.packageId) {
      errors.push("Pilot handoff report snapshot package must match the handoff package.");
    }
    const expectedSnapshotId = `teacher-report-package-snapshot-v1:${reportSnapshotEvidence.tenantId}:${reportSnapshotEvidence.packageId}:${reportSnapshotEvidence.launchCode}`;
    if (reportSnapshotEvidence.snapshotId !== expectedSnapshotId) {
      errors.push("Pilot handoff report snapshot id must match its tenant, package, and launch scope.");
    }
    if (!reportSnapshotEvidence.snapshotFingerprint.startsWith("teacher-report-package-snapshot-fnv1a-v1:")) {
      errors.push("Pilot handoff report snapshot fingerprint must use the canonical snapshot fingerprint prefix.");
    }
    if (!Array.isArray(reportSnapshotEvidence.deploymentModes) || reportSnapshotEvidence.deploymentModes.length !== 2 || !reportSnapshotEvidence.deploymentModes.includes("hosted-managed") || !reportSnapshotEvidence.deploymentModes.includes("local-classroom")) {
      errors.push("Pilot handoff report snapshot evidence must cover hosted-managed and local-classroom modes.");
    }
    if (reportSnapshotEvidence.recoveryPacketsValid !== true) {
      errors.push("Pilot handoff report snapshot recovery packets must be valid before pilot review.");
    }
    for (const field of ["exportAllowed", "writesAllowed", "rawLearnerAudioIncluded", "learnerTranscriptIncluded", "realLearnerIdentifiersIncluded"] as const) {
      if (reportSnapshotEvidence[field] !== false) errors.push(`Pilot handoff report snapshot ${field} must remain false.`);
    }
  }

  const persistenceGateEvidence = packet.persistenceGateEvidence;
  if (!persistenceGateEvidence || typeof persistenceGateEvidence !== "object" || Array.isArray(persistenceGateEvidence)) {
    errors.push("Pilot handoff persistence gate evidence is required.");
  } else {
    for (const field of ["tenantId", "packageId", "launchCode", "checkedAt"] as const) {
      requireText(persistenceGateEvidence[field], `persistence gate ${field}`, errors);
    }
    if (persistenceGateEvidence.tenantId !== packet.tenantId) {
      errors.push("Pilot handoff persistence gate tenant must match the handoff tenant.");
    }
    if (persistenceGateEvidence.packageId !== packet.packageId) {
      errors.push("Pilot handoff persistence gate package must match the handoff package.");
    }
    if (reportSnapshotEvidence && persistenceGateEvidence.packageId !== reportSnapshotEvidence.packageId) {
      errors.push("Pilot handoff persistence gate package must match the report snapshot package.");
    }
    if (reportSnapshotEvidence && persistenceGateEvidence.launchCode !== reportSnapshotEvidence.launchCode) {
      errors.push("Pilot handoff persistence gate launch must match the report snapshot launch.");
    }
    if (!PILOT_HANDOFF_STATUSES.has(persistenceGateEvidence.status === "rehearsal" ? "needs-review" : persistenceGateEvidence.status)) {
      errors.push("Pilot handoff persistence gate has an unsupported status.");
    }
    if (persistenceGateEvidence.ready !== (persistenceGateEvidence.status === "ready")) {
      errors.push("Pilot handoff persistence gate ready flag must match its status.");
    }
    if (!isIsoTimestamp(persistenceGateEvidence.checkedAt)) {
      errors.push("Pilot handoff persistence gate checkedAt must be an ISO timestamp.");
    }
    if (!Array.isArray(persistenceGateEvidence.blockedReasons)) {
      errors.push("Pilot handoff persistence gate blockedReasons must be an array.");
    } else {
      if (persistenceGateEvidence.blockedReasons.some((reason) => typeof reason !== "string" || reason.trim().length === 0)) {
        errors.push("Pilot handoff persistence gate blockedReasons must contain only non-empty strings.");
      }
      const normalizedReasons = persistenceGateEvidence.blockedReasons.filter((reason): reason is string => typeof reason === "string").map((reason) => reason.trim());
      if (new Set(normalizedReasons).size !== normalizedReasons.length) errors.push("Pilot handoff persistence gate blockedReasons must be unique.");
      if (persistenceGateEvidence.status === "ready" && persistenceGateEvidence.blockedReasons.length > 0) {
        errors.push("Pilot handoff ready persistence gate cannot include blockers.");
      } else if (persistenceGateEvidence.status !== "ready" && persistenceGateEvidence.blockedReasons.length === 0) {
        errors.push("Pilot handoff blocked or rehearsal persistence gate must include a blocker or explanation.");
      }
    }
    if (persistenceGateEvidence.writesAllowed !== false) {
      errors.push("Pilot handoff persistence gate writesAllowed must remain false.");
    }
  }

  const activationPreflightEvidence = packet.activationPreflightEvidence;
  if (!activationPreflightEvidence || typeof activationPreflightEvidence !== "object" || Array.isArray(activationPreflightEvidence)) {
    errors.push("Pilot handoff activation preflight evidence is required.");
  } else {
    for (const field of [
      "packetId",
      "tenantId",
      "packageId",
      "deploymentDecisionId",
      "policyAcceptancePreflightId",
      "acceptanceRecordPreviewId",
    ] as const) {
      requireText(activationPreflightEvidence[field], `activation preflight ${field}`, errors);
    }
    if (activationPreflightEvidence.tenantId !== packet.tenantId) {
      errors.push("Pilot handoff activation preflight tenant must match the handoff tenant.");
    }
    if (activationPreflightEvidence.packageId !== packet.packageId) {
      errors.push("Pilot handoff activation preflight package must match the handoff package.");
    }
    if (activationPreflightEvidence.deploymentSelectionStatus !== "unselected" && activationPreflightEvidence.deploymentSelectionStatus !== "selected-review-only") {
      errors.push("Pilot handoff activation preflight deployment selection status is unsupported.");
    }
    if (activationPreflightEvidence.policyAcceptanceStatus !== "not-accepted") {
      errors.push("Pilot handoff activation preflight policy acceptance status must remain not-accepted.");
    }
    if (activationPreflightEvidence.requestedMode !== "durable-managed") {
      errors.push("Pilot handoff activation preflight requested mode must be durable-managed.");
    }
    if (activationPreflightEvidence.status !== "ready" && activationPreflightEvidence.status !== "blocked") {
      errors.push("Pilot handoff activation preflight has an unsupported status.");
    }
    for (const field of ["passedChecks", "openChecks", "blockedChecks"] as const) {
      if (!Number.isSafeInteger(activationPreflightEvidence[field]) || activationPreflightEvidence[field] < 0) {
        errors.push(`Pilot handoff activation preflight ${field} must be a non-negative safe integer.`);
      }
    }
    if (activationPreflightEvidence.status === "blocked" && activationPreflightEvidence.blockedChecks < 1) {
      errors.push("Pilot handoff blocked activation preflight must include a blocked check.");
    }
    if (!Array.isArray(activationPreflightEvidence.blockedReasons)) {
      errors.push("Pilot handoff activation preflight blockedReasons must be an array.");
    } else {
      if (activationPreflightEvidence.blockedReasons.some((reason) => typeof reason !== "string" || reason.trim().length === 0)) {
        errors.push("Pilot handoff activation preflight blockedReasons must contain only non-empty strings.");
      }
      const normalizedReasons = activationPreflightEvidence.blockedReasons.filter((reason): reason is string => typeof reason === "string").map((reason) => reason.trim());
      if (new Set(normalizedReasons).size !== normalizedReasons.length) errors.push("Pilot handoff activation preflight blockedReasons must be unique.");
      if (activationPreflightEvidence.status === "blocked" && activationPreflightEvidence.blockedReasons.length === 0) {
        errors.push("Pilot handoff blocked activation preflight must include blocker reasons.");
      }
    }
    if (activationPreflightEvidence.canActivate !== false) {
      errors.push("Pilot handoff activation preflight canActivate must remain false.");
    }
  }

  const releaseControlEvidence = packet.releaseControlEvidence;
  if (releaseControlEvidence.tenantId !== packet.tenantId) {
    errors.push("Pilot handoff release-control tenant must match the handoff tenant.");
  }
  if (releaseControlEvidence.packageId !== packet.packageId) {
    errors.push("Pilot handoff release-control package must match the handoff package.");
  }

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

  const handoffNotes = Array.isArray(packet.handoffNotes) ? packet.handoffNotes : [];
  for (const note of handoffNotes) {
    requireText(note, "handoff note", errors);
  }
  const normalizedNotes = handoffNotes.filter((note): note is string => typeof note === "string").map((note) => note.trim());
  if (new Set(normalizedNotes).size !== normalizedNotes.length) {
    errors.push("Pilot handoff notes must be unique.");
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

export function validatePilotHandoffLineageBinding(
  packet: PilotHandoffPackage,
  sources: PilotHandoffLineageSources,
): string[] {
  const errors: string[] = [];
  const evidence = packet.activationPreflightEvidence;
  const decision = sources.deploymentDecision;
  const policyPreflight = sources.policyAcceptancePreflight;
  const acceptancePreview = sources.acceptanceRecordPreview;

  requireText(decision.decisionId, "lineage deployment decision id", errors);
  requireText(policyPreflight.preflightId, "lineage policy preflight id", errors);
  requireText(acceptancePreview.previewId, "lineage acceptance preview id", errors);

  if (packet.tenantId !== decision.tenantId || packet.packageId !== decision.packageId) {
    errors.push("Pilot handoff lineage deployment decision must match the handoff tenant and package.");
  }
  if (evidence.deploymentDecisionId !== decision.decisionId) {
    errors.push("Pilot handoff lineage deployment decision id must match its source record.");
  }
  if (evidence.policyAcceptancePreflightId !== decision.policyAcceptancePreflightId || evidence.policyAcceptancePreflightId !== policyPreflight.preflightId) {
    errors.push("Pilot handoff lineage policy preflight id must match both source records.");
  }
  if (evidence.acceptanceRecordPreviewId !== decision.acceptanceRecordPreviewId || evidence.acceptanceRecordPreviewId !== acceptancePreview.previewId) {
    errors.push("Pilot handoff lineage acceptance preview id must match both source records.");
  }
  if (decision.selectionStatus !== evidence.deploymentSelectionStatus) {
    errors.push("Pilot handoff lineage deployment selection status must match the deployment decision.");
  }
  if (decision.policyAcceptanceStatus !== evidence.policyAcceptanceStatus) {
    errors.push("Pilot handoff lineage policy acceptance status must match the deployment decision.");
  }
  if (decision.status !== "review-only" || decision.policyAccepted !== false || decision.persistenceActivationAllowed !== false || decision.classroomLaunchAllowed !== false) {
    errors.push("Pilot handoff lineage deployment decision must remain review-only and activation-blocked.");
  }

  for (const [source, label] of [
    [policyPreflight, "policy preflight"],
    [acceptancePreview, "acceptance preview"],
  ] as const) {
    if (source.tenantId !== packet.tenantId) errors.push(`Pilot handoff lineage ${label} tenant must match the handoff tenant.`);
    if (source.packageId !== packet.packageId) errors.push(`Pilot handoff lineage ${label} package must match the handoff package.`);
  }

  if (/\baccepted\b/i.test(policyPreflight.acceptanceStatus) || /\baccepted\b/i.test(acceptancePreview.statusLabel)) {
    errors.push("Pilot handoff lineage source records must remain non-accepted review evidence.");
  }

  return [...new Set(errors)];
}

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value)) && value.includes("T");
}
