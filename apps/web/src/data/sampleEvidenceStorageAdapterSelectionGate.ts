export type EvidenceStorageAdapterSelectionStatus =
  | "recommended-first-pilot"
  | "blocked-preview"
  | "deferred";

export type EvidenceStorageAdapterCostPosture = "controlled" | "higher" | "variable";

export interface EvidenceStorageAdapterCandidate {
  adapterId: string;
  label: string;
  status: EvidenceStorageAdapterSelectionStatus;
  deploymentFit: "hosted" | "local" | "hybrid";
  costPosture: EvidenceStorageAdapterCostPosture;
  suitableFor: string;
  mustProve: string[];
  blockedUntilPolicy: string[];
  notAllowedYet: string[];
}

export interface EvidenceStorageAdapterSelectionGate {
  gateId: string;
  tenantId: string;
  label: string;
  summary: string;
  selectionStatus: string;
  firstPilotRecommendation: string;
  recommendationReason: string;
  candidates: EvidenceStorageAdapterCandidate[];
  vendorNeutralRequirements: string[];
  selectionRules: string[];
  blockedActions: string[];
}

export const sampleEvidenceStorageAdapterSelectionGate: EvidenceStorageAdapterSelectionGate = {
  gateId: "sample-publisher-evidence-storage-adapter-selection-gate",
  tenantId: "sample-publisher",
  label: "Evidence storage adapter selection gate",
  summary:
    "Compares hosted, closed local, and hybrid evidence storage paths before a backend vendor or local storage package is selected. This is a decision gate only; no bucket, folder, archive, signed URL, upload, download, migration, or retention clock is created.",
  selectionStatus: "Storage adapter selection blocked",
  firstPilotRecommendation: "Hosted managed evidence storage candidate",
  recommendationReason:
    "For the first controlled white-label pilot, hosted managed storage is the cheapest practical path to test review, access control, audit logs, and export policy before investing in installer, local backup, and sync tooling.",
  candidates: [
    {
      adapterId: "hosted-managed-evidence-storage",
      label: "Hosted managed evidence storage candidate",
      status: "recommended-first-pilot",
      deploymentFit: "hosted",
      costPosture: "controlled",
      suitableFor:
        "First partner pilot, school preview, publisher review, and evidence packets where the platform operates the storage boundary.",
      mustProve: [
        "tenant-scoped object namespace",
        "database metadata separate from binary storage",
        "quarantine-first upload path",
        "checksum and malware scan capture",
        "reviewer access-control policy",
        "audit log retention",
        "export and deletion policy",
      ],
      blockedUntilPolicy: [
        "storage adapter selected",
        "object storage provider approved",
        "access-control policy accepted",
        "retention period accepted",
        "delete/export policy accepted",
      ],
      notAllowedYet: [
        "No object bucket creation",
        "No signed URL generation",
        "No direct file upload",
        "No attachment download",
      ],
    },
    {
      adapterId: "closed-local-evidence-store",
      label: "Closed local evidence store candidate",
      status: "blocked-preview",
      deploymentFit: "local",
      costPosture: "higher",
      suitableFor:
        "Publisher-owned local companion apps, school server installs, and textbook packages that must self-contain evidence and media data.",
      mustProve: [
        "approved local root",
        "relative path manifest",
        "backup and restore procedure",
        "offline malware scan procedure",
        "local admin access policy",
        "installer and update path",
        "export/import restore test",
      ],
      blockedUntilPolicy: [
        "local backup responsibility accepted",
        "school or publisher storage owner named",
        "restore procedure tested",
        "local encryption policy accepted",
        "offline update policy accepted",
      ],
      notAllowedYet: [
        "No local evidence folder activation",
        "No folder placement acceptance",
        "No offline approval bypass",
        "No local attachment download",
      ],
    },
    {
      adapterId: "hybrid-evidence-archive",
      label: "Hybrid archive evidence store candidate",
      status: "deferred",
      deploymentFit: "hybrid",
      costPosture: "variable",
      suitableFor:
        "Later movement between hosted and local deployments after the hosted pilot proves the package, evidence, and release-control records.",
      mustProve: [
        "archive manifest schema",
        "attachment checksum manifest",
        "import quarantine path",
        "release-control state binding",
        "duplicate evidence detection",
        "cross-adapter rollback policy",
        "recipient identity confirmation",
      ],
      blockedUntilPolicy: [
        "hosted adapter validated",
        "local adapter validated",
        "archive import policy accepted",
        "cross-adapter deletion policy accepted",
        "release mutation policy accepted",
      ],
      notAllowedYet: [
        "No evidence archive export",
        "No evidence archive import",
        "No cross-adapter migration",
        "No downloadable evidence bundle",
      ],
    },
  ],
  vendorNeutralRequirements: [
    "tenant isolation",
    "metadata separate from binary files",
    "quarantine-first storage",
    "checksum required",
    "malware scan status",
    "access-control policy",
    "audit log retention",
    "delete/export policy",
    "local backup responsibility",
    "release-control mutation block",
  ],
  selectionRules: [
    "Choose hosted managed evidence storage first unless a partner requires a closed local install for the pilot.",
    "Treat local storage as a premium/closed-deployment path because it adds installer, backup, restore, and update obligations.",
    "Treat hybrid archive movement as a later migration lane after hosted and local adapters both pass the same evidence attachment contract.",
    "Do not let vendor selection create live upload, download, signed URL, folder activation, or release-state behavior.",
  ],
  blockedActions: [
    "No storage adapter selected",
    "No object bucket creation",
    "No local evidence folder activation",
    "No signed URL generation",
    "No direct file upload",
    "No attachment migration",
    "No production retention clock",
    "No release-state mutation",
  ],
};
