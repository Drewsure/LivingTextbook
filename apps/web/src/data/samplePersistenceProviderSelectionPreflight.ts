import {
  validatePersistenceProviderSelectionPreflight,
  type PersistenceProviderSelectionPreflight,
} from "@living-textbook/content-model";

export const samplePersistenceProviderSelectionPreflight: PersistenceProviderSelectionPreflight = {
  preflightId: "sample-publisher-persistence-provider-selection-preflight",
  tenantId: "sample-publisher",
  packageId: "sample-publisher-l1-u1-routines-package",
  label: "Sample publisher persistence provider selection preflight",
  status: "blocked",
  providerNeutral: true,
  backendMatrixId: "first-pilot-backend-matrix",
  evidenceStorageGateId: "sample-publisher-evidence-storage-adapter-selection-gate",
  implementationReadinessId: "sample-publisher-pilot-review-decision-implementation-readiness",
  canonicalScopeValid: true,
  candidates: [
    {
      candidateId: "hosted-managed-first-pilot",
      label: "Hosted managed persistence candidate",
      deploymentFit: "hosted",
      costPosture: "controlled",
      whiteLabelFit: "Best first pilot fit for tenant-scoped records, teacher reports, and stable QR routes.",
      requiredEvidence: ["Tenant isolation", "Retention and deletion policy", "Export and rollback rehearsal"],
      unresolvedRisks: ["Provider and access-control policy are not selected.", "Monthly usage limits need tenant approval."],
    },
    {
      candidateId: "closed-local-companion",
      label: "Closed-local persistence candidate",
      deploymentFit: "local",
      costPosture: "higher",
      whiteLabelFit: "Supports publisher-owned textbook companions and offline operation, with greater support burden.",
      requiredEvidence: ["Local backup and restore", "Installer/update procedure", "Offline access and encryption policy"],
      unresolvedRisks: ["Operational ownership is not assigned.", "No local package activation or restore path is approved."],
    },
    {
      candidateId: "hybrid-registry-local-media",
      label: "Hybrid registry plus local media candidate",
      deploymentFit: "hybrid",
      costPosture: "variable",
      whiteLabelFit: "Long-term publisher fit when hosted QR registry and local media bundles share one manifest.",
      requiredEvidence: ["Manifest versioning", "Cross-adapter rollback", "Hosted/local deletion parity"],
      unresolvedRisks: ["Two deployment paths must remain synchronized.", "Archive migration is not yet authorized."],
    },
  ],
  recommendedCandidateId: "hosted-managed-first-pilot",
  providerSelected: false,
  selectionAllowed: false,
  migrationAllowed: false,
  writesAllowed: false,
  activationAllowed: false,
  requiredEvidence: [
    "Accepted retention, deletion, and audit policy",
    "Accepted school or tenant data policy",
    "Implementation-readiness handoff with matching tenant and package",
    "Provider capability and cost evidence",
    "Hosted/local rollback and export rehearsal",
  ],
  blockedActions: [
    "No provider selected",
    "No provider-specific implementation",
    "No migration",
    "No persistence writes",
    "No activation",
  ],
  nextSteps: [
    "Complete human policy acceptance for the scoped pilot package.",
    "Compare provider capabilities and cost against the accepted evidence.",
    "Create a provider-specific work order only after the selection gate passes.",
  ],
  note: "This is a comparison preflight, not a provider decision. It keeps selection and implementation blocked until policy and evidence are accepted.",
};

export const samplePersistenceProviderSelectionPreflightErrors = validatePersistenceProviderSelectionPreflight(
  samplePersistenceProviderSelectionPreflight,
);
