export type TeacherAuthoringStatus = "planned" | "ready" | "blocked";
export type TeacherAuthoringOwner = "teacher" | "tenant-admin" | "verifier" | "platform";

export interface TeacherAuthoringLane {
  laneId: string;
  label: string;
  owner: TeacherAuthoringOwner;
  status: TeacherAuthoringStatus;
  purpose: string;
  allowedActions: string[];
  blockedActions: string[];
  requiredBeforeStudentUse: string[];
  nextStep: string;
}

export interface TeacherAuthoringGate {
  gateId: string;
  label: string;
  status: TeacherAuthoringStatus;
  protects: string;
  evidence: string;
  blocksStudentAssignment: boolean;
  nextStep: string;
}

export interface TeacherAuthoringReadinessPlan {
  planId: string;
  tenantId: string;
  label: string;
  summary: string;
  releaseRule: string;
  lanes: TeacherAuthoringLane[];
  gates: TeacherAuthoringGate[];
}

export const sampleTeacherAuthoringReadinessPlan: TeacherAuthoringReadinessPlan = {
  planId: "sample-publisher-teacher-authoring-readiness",
  tenantId: "sample-publisher",
  label: "Teacher authoring readiness",
  summary:
    "Teacher authoring should eventually feel fast, but no draft, edit, AI suggestion, copied package, printable, or activity pathway becomes student-facing until review, audio, rights, route, and package gates pass.",
  releaseRule:
    "Fast authoring creates draft packages only. Student assignment requires reviewed package data, target-language progression rules, audio coverage, route readiness, and teacher or tenant approval.",
  lanes: [
    {
      laneId: "quick-draft",
      label: "Quick draft from reviewed source",
      owner: "teacher",
      status: "planned",
      purpose: "Let a teacher create a fast draft from typed content, PDF-derived source, or AI-assisted structure.",
      allowedActions: ["Create draft", "Preview teacher-only", "Save privately", "Submit for verification"],
      blockedActions: ["Assign directly to students", "Publish publicly", "Skip audio plan"],
      requiredBeforeStudentUse: ["Schema check", "Audio support check", "Teacher approval", "Package version record"],
      nextStep: "Design draft ownership and save/preview behavior after auth and persistence are selected.",
    },
    {
      laneId: "copy-edit",
      label: "Copy and edit reviewed package",
      owner: "teacher",
      status: "planned",
      purpose: "Allow teachers to adapt a tenant-approved package without overwriting the original.",
      allowedActions: ["Copy package", "Edit vocabulary draft", "Edit teacher notes", "Request review"],
      blockedActions: ["Modify original package", "Lose source lineage", "Change target language trigger without review"],
      requiredBeforeStudentUse: ["Copy lineage", "Version snapshot", "Verifier pass", "Approval ledger entry"],
      nextStep: "Connect to the private tenant library and package versioning contracts.",
    },
    {
      laneId: "activity-pathway-edit",
      label: "Activity pathway edit",
      owner: "tenant-admin",
      status: "planned",
      purpose: "Let approved staff choose required, optional, premium, printable, teacher-review, and blocked activities for a unit.",
      allowedActions: ["Choose offered activities", "Set recommended order", "Mark blocked conversions", "Set teacher-only controls"],
      blockedActions: ["Offer unsupported mode", "Bypass audio coverage", "Expose premium upsell to children"],
      requiredBeforeStudentUse: ["Activity compatibility pass", "Game mode coverage pass", "Audio coverage pass"],
      nextStep: "Promote activity pathway compatibility from sample data to package manifest after review.",
    },
    {
      laneId: "printable-authoring",
      label: "Printable authoring",
      owner: "teacher",
      status: "planned",
      purpose: "Let teachers generate printable vocabulary sheets, sentence worksheets, and answer keys from reviewed package data.",
      allowedActions: ["Preview printable", "Choose worksheet variant", "Print teacher copy"],
      blockedActions: ["Export PDF before gates", "Imply automatic mastery", "Print unreviewed media or rights data"],
      requiredBeforeStudentUse: ["Printable readiness pass", "QR/audio bridge", "Version and rights snapshot"],
      nextStep: "Build browser-print preview before PDF export.",
    },
    {
      laneId: "direct-ai-publish",
      label: "Direct AI publish",
      owner: "platform",
      status: "blocked",
      purpose: "Prevent live AI output from becoming student-facing without review.",
      allowedActions: ["None for v1"],
      blockedActions: ["AI draft to assignment", "AI translation to student view", "AI clue generation without review"],
      requiredBeforeStudentUse: ["Human review", "Verifier pass", "Tenant approval"],
      nextStep: "Keep blocked until a mature review workflow and audit trail exist.",
    },
  ],
  gates: [
    {
      gateId: "draft-ownership",
      label: "Draft ownership",
      status: "blocked",
      protects: "Teachers can save drafts without cross-tenant leakage or overwriting reviewed packages.",
      evidence: "Auth, teacher identity, and draft persistence are not selected yet.",
      blocksStudentAssignment: true,
      nextStep: "Define owner, tenant, source package, copy lineage, and draft visibility records.",
    },
    {
      gateId: "review-before-assignment",
      label: "Review before assignment",
      status: "ready",
      protects: "Student-facing work always passes schema, audio, route, rights, and teacher approval gates.",
      evidence: "AI authoring verifier and package readiness gates already exist.",
      blocksStudentAssignment: false,
      nextStep: "Keep `npm run verify:foundation` as the local hard gate for sample readiness.",
    },
    {
      gateId: "audio-before-students",
      label: "Audio before students",
      status: "ready",
      protects: "Young learners do not receive silent text-only activities.",
      evidence: "Package readiness and game mode verifiers require audio support.",
      blocksStudentAssignment: false,
      nextStep: "Extend this to real package manifests after persistence is selected.",
    },
    {
      gateId: "rights-version-audit",
      label: "Rights and version audit",
      status: "blocked",
      protects: "Teacher-edited packages preserve source, edition, media rights, and approval history.",
      evidence: "Versioning and approval ledgers are still scaffolded, not durable records.",
      blocksStudentAssignment: true,
      nextStep: "Promote package versioning and approval ledger into persistence before live teacher authoring.",
    },
  ],
};
