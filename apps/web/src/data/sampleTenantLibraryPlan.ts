export type TenantLibraryStageStatus = "planned" | "ready" | "blocked";
export type TenantLibraryVisibility = "private-draft" | "tenant-approved" | "school-shared" | "public-community";

export interface TenantLibraryStage {
  stageId: string;
  label: string;
  visibility: TenantLibraryVisibility;
  status: TenantLibraryStageStatus;
  owner: "teacher" | "tenant-admin" | "school" | "platform";
  purpose: string;
  allowedActions: string[];
  guardrails: string[];
  blocker: string;
  nextStep: string;
}

export interface TenantLibraryGovernanceGate {
  gateId: string;
  label: string;
  status: TenantLibraryStageStatus;
  protects: string;
  evidence: string;
  nextStep: string;
}

export interface TenantLibraryPlan {
  planId: string;
  tenantId: string;
  label: string;
  summary: string;
  publicLibraryDecision: string;
  stages: TenantLibraryStage[];
  gates: TenantLibraryGovernanceGate[];
}

export const sampleTenantLibraryPlan: TenantLibraryPlan = {
  planId: "sample-publisher-private-library-plan",
  tenantId: "sample-publisher",
  label: "Private tenant library plan",
  summary:
    "A private tenant library is the near-term workaround for community-resource expectations. Teachers and publishers can reuse reviewed materials inside one tenant before any public marketplace exists.",
  publicLibraryDecision:
    "Public community library blocked for v1. Moderation, copyright, privacy, tenant isolation, quality control, and abuse-reporting policy must exist before public sharing.",
  stages: [
    {
      stageId: "teacher-private-drafts",
      label: "Teacher private drafts",
      visibility: "private-draft",
      status: "planned",
      owner: "teacher",
      purpose: "Let a teacher save draft package edits, printable ideas, or unit variants without making them student-facing.",
      allowedActions: ["Create draft", "Edit draft", "Preview locally", "Submit for review"],
      guardrails: ["No student assignment", "No public sharing", "No AI draft without review"],
      blocker: "Teacher accounts and draft ownership are not implemented.",
      nextStep: "Design ownership and copy/edit records after auth and persistence are selected.",
    },
    {
      stageId: "tenant-approved-library",
      label: "Tenant-approved package library",
      visibility: "tenant-approved",
      status: "planned",
      owner: "tenant-admin",
      purpose: "Store reviewed packages, printable outputs, media manifests, and activity pathways for one publisher or school brand.",
      allowedActions: ["Approve package", "Copy package", "Version package", "Assign package"],
      guardrails: ["Reviewed package only", "Tenant-scoped visibility", "Versioned source records"],
      blocker: "Package versioning and approval persistence are planning contracts only.",
      nextStep: "Promote package publish gate and approval ledger into durable records before library work.",
    },
    {
      stageId: "school-shared-library",
      label: "School shared library",
      visibility: "school-shared",
      status: "planned",
      owner: "school",
      purpose: "Allow sharing across teachers inside the same school or tenant without exposing content publicly.",
      allowedActions: ["Share with school", "Copy to class", "Retire package", "View usage summary"],
      guardrails: ["Same-tenant only", "No student data copied", "Rights and source stay attached"],
      blocker: "School roster, roles, and sharing policy are not implemented.",
      nextStep: "Add after class roster and teacher role boundaries exist.",
    },
    {
      stageId: "public-community-library",
      label: "Public community library",
      visibility: "public-community",
      status: "blocked",
      owner: "platform",
      purpose: "Potential long-term public marketplace or community resource library.",
      allowedActions: ["Not allowed in v1"],
      guardrails: ["Requires moderation", "Requires copyright review", "Requires privacy policy", "Requires quality review"],
      blocker: "Moderation, copyright, privacy, tenant isolation, quality control, and abuse reporting do not exist.",
      nextStep: "Revisit only after private tenant libraries and governance prove stable.",
    },
  ],
  gates: [
    {
      gateId: "ownership-and-copy",
      label: "Ownership and copy/edit records",
      status: "blocked",
      protects: "Teachers can adapt resources without overwriting originals or violating tenant ownership.",
      evidence: "No persistent teacher ownership model exists yet.",
      nextStep: "Define owner, copy source, version, and edit lineage records.",
    },
    {
      gateId: "rights-and-source",
      label: "Rights and source preservation",
      status: "planned",
      protects: "Copied packages keep source, media rights, edition, and tenant identity attached.",
      evidence: "Package rights and source fields exist in planning data.",
      nextStep: "Bind library copies to package versioning and approval ledger records.",
    },
    {
      gateId: "student-data-separation",
      label: "Student data separation",
      status: "blocked",
      protects: "Library sharing never copies student identities, progress, recordings, or report exports.",
      evidence: "Teacher reports are still export-blocked until policy and persistence are accepted.",
      nextStep: "Keep library records separate from session/report records.",
    },
    {
      gateId: "public-governance",
      label: "Public sharing governance",
      status: "blocked",
      protects: "Public community sharing cannot expose unmoderated, copyrighted, unsafe, or low-quality content.",
      evidence: "No moderation or public abuse-reporting workflow exists.",
      nextStep: "Do not build public community surfaces in v1.",
    },
  ],
};
