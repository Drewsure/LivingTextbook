import {
  readPilotDeploymentConfiguration,
  type PilotDeploymentMode,
} from "./pilotDeploymentConfiguration";

export type PilotOperatorGateStatus = "ready-for-review" | "blocked" | "manual";
export type PilotOperatorGateOwner = "platform" | "publisher" | "school" | "shared";

export interface PilotOperatorGate {
  gateId: string;
  order: number;
  label: string;
  owner: PilotOperatorGateOwner;
  status: PilotOperatorGateStatus;
  evidence: string;
  nextAction: string;
}

export interface PilotOperatorGateSequenceSnapshot {
  sequenceId: string;
  tenantId: string;
  packageId: string;
  mode: PilotDeploymentMode;
  status: "blocked" | "awaiting-human-review";
  nextGateId: string;
  gates: PilotOperatorGate[];
  blockers: string[];
  writesEnabled: false;
  studentActivationAllowed: false;
  sideEffect: "none";
}

/**
 * Derive the ordered human worklist for a named pilot package. This is a
 * read-only planning boundary: it never records decisions, enables writes, or
 * treats a configured server as proof that a package is releasable.
 */
export function readPilotOperatorGateSequence(
  tenantId: string,
  packageId: string,
  mode: PilotDeploymentMode,
): PilotOperatorGateSequenceSnapshot {
  const safeTenantId = tenantId.trim();
  const safePackageId = packageId.trim();
  const configuration = readPilotDeploymentConfiguration(safeTenantId, mode);
  const gates: PilotOperatorGate[] = [
    {
      gateId: "deployment-configuration",
      order: 1,
      label: "Server deployment configuration",
      owner: "platform",
      status: configuration.ready ? "ready-for-review" : "blocked",
      evidence: configuration.ready
        ? "The named tenant has the required server-side configuration shape for this delivery mode."
        : "The deployment configuration preflight has open blockers.",
      nextAction: configuration.ready
        ? "Keep the configuration review-only and continue to package evidence review."
        : "Resolve the deployment preflight blockers without enabling any write gate.",
    },
    {
      gateId: "publisher-source-and-rights",
      order: 2,
      label: "Publisher source and rights evidence",
      owner: "publisher",
      status: "manual",
      evidence: `Package scope ${safePackageId || "(missing)"} still requires a real source owner, unit mapping, scan, rights, and retention record.`,
      nextAction: "Submit the publisher Unit 1 source and attach rights evidence for every content and media asset.",
    },
    {
      gateId: "reviewed-package",
      order: 3,
      label: "Reviewed multimedia and game package",
      owner: "shared",
      status: "manual",
      evidence: "Content, target-language audio, support-language policy, curated games, accessibility, and media evidence must be reconciled to the same package identity.",
      nextAction: "Complete review-only package evidence and record the immutable package review packet.",
    },
    {
      gateId: "delivery-mode",
      order: 4,
      label: "Delivery mode and persistence decision",
      owner: "shared",
      status: "manual",
      evidence: "Hosted, closed-local, and hybrid paths remain comparison states until the publisher or school chooses one and accepts its policy and cost boundaries.",
      nextAction: "Choose the first delivery mode and document persistence, retention, backup, and rollback expectations.",
    },
    {
      gateId: "qr-and-local-fallback",
      order: 5,
      label: "QR print and fallback review",
      owner: "platform",
      status: "manual",
      evidence: "QR registry, print artifact, package version, checksum, and fallback route must all point to the same reviewed release.",
      nextAction: "Run the QR print authorization preflight after package and release evidence are complete; do not print yet.",
    },
    {
      gateId: "teacher-browser-rehearsal",
      order: 6,
      label: "Teacher browser rehearsal",
      owner: "school",
      status: "manual",
      evidence: "Teacher entry, target-language audio, flashcards, curated game progression, media, and teacher evidence need observation on the selected device path.",
      nextAction: "Run the teacher-only rehearsal with synthetic learner identities and record browser/privacy/tenant evidence.",
    },
    {
      gateId: "release-authorization",
      order: 7,
      label: "Human release authorization",
      owner: "shared",
      status: "manual",
      evidence: "Human approval, school policy, rollback evidence, and the final package/QR/integrity identities are not captured by this sequence.",
      nextAction: "Record explicit adult approval only after every preceding gate is accepted; no route here performs that action.",
    },
  ];

  const firstOpenGate = gates.find((gate) => gate.status !== "ready-for-review") ?? gates[gates.length - 1];
  const blockers = configuration.blockers.map((blocker) => `Deployment configuration: ${blocker}`);
  if (!safeTenantId) blockers.push("Tenant identity is required.");
  if (!safePackageId) blockers.push("Package identity is required.");

  return {
    sequenceId: `pilot-gate-sequence:${safeTenantId || "missing-tenant"}:${safePackageId || "missing-package"}:${mode}`,
    tenantId: safeTenantId,
    packageId: safePackageId,
    mode,
    status: blockers.length > 0 ? "blocked" : "awaiting-human-review",
    nextGateId: firstOpenGate.gateId,
    gates,
    blockers,
    writesEnabled: false,
    studentActivationAllowed: false,
    sideEffect: "none",
  };
}
