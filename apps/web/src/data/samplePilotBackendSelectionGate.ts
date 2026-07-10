export type BackendGateStatus = "passed" | "open" | "blocked";

export interface BackendGateCriterion {
  criterionId: string;
  label: string;
  status: BackendGateStatus;
  owner: "platform" | "tenant" | "joint";
  requirement: string;
  nextAction: string;
}

export interface PilotBackendSelectionGate {
  gateId: string;
  label: string;
  decision: string;
  rule: string;
  costControl: string;
  localCompatibility: string;
  criteria: BackendGateCriterion[];
}

export const samplePilotBackendSelectionGate: PilotBackendSelectionGate = {
  gateId: "first-pilot-backend-selection-gate",
  label: "First pilot backend selection gate",
  decision:
    "Do not choose the first real backend until privacy, reporting, release-control, schema, migration sequence, deployment mode, and cost limits are reviewed together.",
  rule:
    "The selected backend must store reviewed package records, stable QR routes, teacher launch sessions, coded learner progress, and report policy records without storing raw learner audio by default.",
  costControl:
    "Prefer the lowest monthly operating cost that still supports durable teacher reports, tenant separation, export, and future local/closed deployment migration.",
  localCompatibility:
    "Hosted pilot records must remain exportable into a later local classroom package so the white-label product can serve both hosted PWA and closed textbook-companion deployments.",
  criteria: [
    {
      criterionId: "privacy-policy",
      label: "Student privacy and retention",
      status: "open",
      owner: "joint",
      requirement:
        "Retention, export, deletion, role access, and school/tenant ownership must be approved before real student progress is stored.",
      nextAction: "Draft pilot privacy defaults for roster slots, coded learners, teacher reports, and progress events.",
    },
    {
      criterionId: "schema-contract",
      label: "Vendor-neutral schema contract",
      status: "passed",
      owner: "platform",
      requirement:
        "Core records must stay portable: tenant, route registry, package release, approval ledger, launch session, progress event, and report policy.",
      nextAction: "Keep migration specs backend-agnostic until the pilot gate is ready to close.",
    },
    {
      criterionId: "release-control",
      label: "Release control records",
      status: "open",
      owner: "platform",
      requirement:
        "Publish gates and approval ledgers must be durable enough to prove no unreviewed package was assigned to students.",
      nextAction: "Promote release-control write intents into the selected backend migration plan.",
    },
    {
      criterionId: "media-storage",
      label: "Media storage and rights",
      status: "open",
      owner: "joint",
      requirement:
        "Audio, video, playlist manifests, and optional background media need rights-managed storage and local-bundle decisions.",
      nextAction: "Confirm which pilot media can be hosted, bundled locally, or replaced with placeholders.",
    },
    {
      criterionId: "ai-cost-boundaries",
      label: "Optional AI service boundaries",
      status: "blocked",
      owner: "tenant",
      requirement:
        "AI Tutor and speech scoring are premium package choices. They must not be required for the base pilot or silently generate storage cost.",
      nextAction: "Keep AI Tutor disabled unless a tenant opts into the higher-cost package.",
    },
  ],
};
