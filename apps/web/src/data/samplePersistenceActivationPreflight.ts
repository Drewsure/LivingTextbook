export type PersistenceActivationCheckStatus = "passed" | "open" | "blocked";

export interface PersistenceActivationCheck {
  checkId: string;
  label: string;
  owner: "platform" | "tenant" | "joint";
  status: PersistenceActivationCheckStatus;
  evidence: string;
  nextAction: string;
}

export interface PersistenceActivationPreflight {
  packetId: string;
  tenantId: string;
  packageId: string;
  requestedMode: "durable-managed";
  status: "blocked" | "ready";
  summary: string;
  canActivate: false;
  blockedReasons: string[];
  checks: PersistenceActivationCheck[];
}

export const samplePersistenceActivationPreflight: PersistenceActivationPreflight = {
  packetId: "sample-publisher-durable-write-activation-preflight",
  tenantId: "sample-publisher",
  packageId: "sample-publisher-l1-u1-routines-package",
  requestedMode: "durable-managed",
  status: "blocked",
  summary:
    "This preflight aggregates the evidence needed before a named pilot can accept durable learner progress. It is a review decision, not an activation control.",
  canActivate: false,
  blockedReasons: [
    "School policy and retention acceptance are not recorded.",
    "Tenant-scoped teacher operations authorization is not active for a pilot.",
    "Release and deployment approvals are still review-only.",
  ],
  checks: [
    {
      checkId: "session-boundary",
      label: "Student session boundary",
      owner: "platform",
      status: "passed",
      evidence: "Student session identity is tenant, package, launch, and learner-session scoped.",
      nextAction: "Preserve the same identity boundary in the selected pilot deployment.",
    },
    {
      checkId: "teacher-operations-authorization",
      label: "Teacher operations authorization",
      owner: "joint",
      status: "blocked",
      evidence: "The review surface proves the authorization contract, but no expiring pilot operations session is active.",
      nextAction: "Name the school operator role and complete tenant-scoped authorization rehearsal.",
    },
    {
      checkId: "school-policy",
      label: "School privacy and retention policy",
      owner: "tenant",
      status: "open",
      evidence: "Policy text and retention fields are visible in the handoff materials; acceptance has not been recorded.",
      nextAction: "Record the approved scope, retention duration, export path, and deletion owner for the pilot.",
    },
    {
      checkId: "release-approval",
      label: "Reviewed package release approval",
      owner: "joint",
      status: "open",
      evidence: "Package and media release controls remain review-only and no student assignment is authorized by this packet.",
      nextAction: "Complete package, media-rights, audio, and QR release evidence for the named pilot version.",
    },
    {
      checkId: "operations-readiness",
      label: "Backup, recovery, and operations readiness",
      owner: "platform",
      status: "open",
      evidence: "Backup, restore, export, retention, and rollback rehearsals exist as bounded evidence flows without live execution.",
      nextAction: "Approve the operating procedure and demonstrate sanitized recovery evidence against the pilot scope.",
    },
    {
      checkId: "deployment-configuration",
      label: "Named deployment configuration",
      owner: "joint",
      status: "blocked",
      evidence: "The SQLite adapter is the reference durable implementation, but no hosted or local pilot deployment has been approved.",
      nextAction: "Choose hosted-managed or local-companion deployment and bind its environment, cost, and rollback record.",
    },
    {
      checkId: "data-minimization",
      label: "Data minimization and media exclusion",
      owner: "platform",
      status: "passed",
      evidence: "Core persistence excludes raw microphone audio and transcripts and returns safe status evidence only.",
      nextAction: "Keep the exclusion in the pilot policy and verify it in the selected adapter deployment.",
    },
    {
      checkId: "provider-neutral-parity",
      label: "Hosted/local contract parity",
      owner: "platform",
      status: "passed",
      evidence: "Hosted and local adapter plans use the same tenant-bound event, report, recovery, export, and rollback contracts.",
      nextAction: "Re-run parity checks after a pilot provider is selected; do not fork the learner event shape.",
    },
  ],
};
