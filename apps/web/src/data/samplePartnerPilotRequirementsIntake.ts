export type PartnerPilotRequirementStatus =
  | "demo-supplied"
  | "needed"
  | "policy-required"
  | "needs-decision"
  | "premium-optional"
  | "blocked";

export type PartnerPilotRequirementCategory =
  | "source"
  | "media"
  | "games"
  | "entry"
  | "learner-data"
  | "reports"
  | "deployment"
  | "commercial"
  | "premium-ai"
  | "outside-prototypes";

export interface PartnerPilotRequirement {
  requirementId: string;
  category: PartnerPilotRequirementCategory;
  label: string;
  status: PartnerPilotRequirementStatus;
  owner: "publisher" | "school" | "platform" | "shared";
  requiredBeforeClassroomPilot: boolean;
  evidenceNeeded: string;
  currentFoundationEvidence: string;
  nextAction: string;
  sourceRoute: string;
}

export interface PartnerPilotRequirementsIntake {
  intakeId: string;
  tenantId: string;
  label: string;
  statusStatement: string;
  summary: string;
  pilotPosition: string;
  recommendedFirstPilotPath: string;
  requirements: PartnerPilotRequirement[];
  blockedActions: string[];
  noLiveCaptureStatement: string;
}

export const samplePartnerPilotRequirementsIntakes: PartnerPilotRequirementsIntake[] = [
  {
    intakeId: "sample-publisher-first-pilot-requirements-v2026-09-05",
    tenantId: "sample-publisher",
    label: "Partner pilot requirements intake",
    statusStatement: "Demo-ready, not classroom-ready",
    summary:
      "A review-only supply and decision checklist for a textbook publisher or school before a real Living Textbook classroom pilot.",
    pilotPosition:
      "We can demonstrate the white-label package flow now, but a real pilot needs reviewed source files, media rights, teacher entry rules, school policy, persistence, reports, and deployment choices first.",
    recommendedFirstPilotPath:
      "Start with a hosted PWA pilot for the lowest support cost, then keep local classroom server or packaged companion delivery as policy-gated paid options.",
    requirements: [
      {
        requirementId: "publisher-source-pdf-units",
        category: "source",
        label: "Source PDF or text units",
        status: "needed",
        owner: "publisher",
        requiredBeforeClassroomPilot: true,
        evidenceNeeded:
          "Final PDF or text source files, unit boundaries, page references, edition/version labels, and permission to extract teacher-reviewed learning payloads.",
        currentFoundationEvidence:
          "Source review workspaces exist, but real partner files and extraction evidence are not loaded.",
        nextAction: "Ask the publisher for the first pilot unit source files and edition/version notes.",
        sourceRoute: "/teacher/sources/sample-publisher",
      },
      {
        requirementId: "publisher-media-rights",
        category: "media",
        label: "Audio, music, video, poster, and image rights",
        status: "needed",
        owner: "publisher",
        requiredBeforeClassroomPilot: true,
        evidenceNeeded:
          "Owned/licensed file list, rights notes, intended unit bindings, replacement rules, background-media permissions, and local-bundle approval if needed.",
        currentFoundationEvidence:
          "Media library, media asset workspace, and bundle integrity gates show the required review shape.",
        nextAction: "Collect the media inventory before any upload, playlist, background music, or local package promise.",
        sourceRoute: "/teacher/media/sample-publisher",
      },
      {
        requirementId: "game-pathway-scope",
        category: "games",
        label: "Pilot activity pathway scope",
        status: "demo-supplied",
        owner: "platform",
        requiredBeforeClassroomPilot: true,
        evidenceNeeded:
          "Teacher-approved sequence of flashcards, memory, matching, Label It, quiz, sentence, spelling, fill, type answer, and speaking routes for the pilot unit.",
        currentFoundationEvidence:
          "Curated game routes and activity hubs are active local scaffolds with target-language audio and deterministic progress events.",
        nextAction: "Keep the first pilot pathway curated; do not offer a switch-to-anything panel.",
        sourceRoute: "/activities/partner-demo-unit-1",
      },
      {
        requirementId: "teacher-entry-mode",
        category: "entry",
        label: "QR, entry code, and learner code rules",
        status: "needs-decision",
        owner: "shared",
        requiredBeforeClassroomPilot: true,
        evidenceNeeded:
          "Decision on printed QR, front-door entry code, optional user code, classroom display flow, and fallback link policy.",
        currentFoundationEvidence:
          "Front-door, private assignment, and stable QR alias routes are visible as scaffolds.",
        nextAction: "Confirm whether the pilot starts from printed QR, teacher-shared entry code, or both.",
        sourceRoute: "/enter/sample-publisher",
      },
      {
        requirementId: "school-learner-data-policy",
        category: "learner-data",
        label: "Learner data and roster policy",
        status: "policy-required",
        owner: "school",
        requiredBeforeClassroomPilot: true,
        evidenceNeeded:
          "School acceptance for coded learner slots, retention period, deletion/export behavior, and real learner data boundaries.",
        currentFoundationEvidence:
          "Class roster and school policy gates show coded identity rules while real learner data remains blocked.",
        nextAction: "Use the policy handoff route before any real classroom launch.",
        sourceRoute:
          "/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet",
      },
      {
        requirementId: "teacher-report-policy",
        category: "reports",
        label: "Teacher report and export expectations",
        status: "policy-required",
        owner: "school",
        requiredBeforeClassroomPilot: true,
        evidenceNeeded:
          "Which progress fields teachers may view, whether exports are allowed, who receives them, and whether family-facing summaries are permitted.",
        currentFoundationEvidence:
          "Teacher report package routes show report structure, but export remains blocked.",
        nextAction: "Confirm report export policy before persistent progress is enabled.",
        sourceRoute: "/teacher/reporting",
      },
      {
        requirementId: "deployment-channel-choice",
        category: "deployment",
        label: "Deployment channel",
        status: "needs-decision",
        owner: "shared",
        requiredBeforeClassroomPilot: true,
        evidenceNeeded:
          "Choose hosted PWA first, local classroom server, or packaged companion; define offline, QR fallback, support, update, and rollback expectations.",
        currentFoundationEvidence:
          "Deployment workbench recommends hosted PWA first while local and packaged options stay gated.",
        nextAction: "Keep hosted PWA as the default pilot recommendation unless closed local operation is required.",
        sourceRoute: "/teacher/deployment",
      },
      {
        requirementId: "commercial-package-boundary",
        category: "commercial",
        label: "Package tier and support boundary",
        status: "needs-decision",
        owner: "shared",
        requiredBeforeClassroomPilot: false,
        evidenceNeeded:
          "Decide whether the partner needs core classroom PWA only, premium AI authoring, premium speech/AI Tutor, hosted storage, or local companion support.",
        currentFoundationEvidence:
          "Entitlement workbench separates core and paid package behavior without billing or child-facing upsell.",
        nextAction: "Discuss paid options with adults only after core pilot requirements are understood.",
        sourceRoute: "/teacher/entitlements",
      },
      {
        requirementId: "ai-tutor-speech-policy",
        category: "premium-ai",
        label: "AI Tutor and speech scoring option",
        status: "premium-optional",
        owner: "school",
        requiredBeforeClassroomPilot: false,
        evidenceNeeded:
          "Teacher/school decision, budget ceiling, privacy policy, raw-audio exclusion, transcript rules, and level/mode eligibility.",
        currentFoundationEvidence:
          "AI Tutor and microphone scoring are disabled premium options; local record/replay has no API cost.",
        nextAction: "Do not include AI Tutor in the first core pilot unless the school explicitly adopts the paid package.",
        sourceRoute: "/teacher/entitlements",
      },
      {
        requirementId: "zai-prototype-intake",
        category: "outside-prototypes",
        label: "Z.ai or outside prototype intake",
        status: "blocked",
        owner: "platform",
        requiredBeforeClassroomPilot: false,
        evidenceNeeded:
          "Codex integration alert, fixture replay, event replay, target-language audio coverage, scoring replay, mobile evidence, and wrapper-boundary proof.",
        currentFoundationEvidence:
          "Prototype review workbenches exist, but Codex has not requested outside source handoff yet.",
        nextAction: "Keep Z.ai work isolated until the intake alert changes to ready-for-review.",
        sourceRoute: "/teacher/game-readiness",
      },
    ],
    blockedActions: [
      "No upload button",
      "No file picker writes",
      "No policy acceptance",
      "No live storage write",
      "No report export",
      "No classroom launch",
      "No local package activation",
      "No premium AI Tutor activation",
      "No Z.ai source handoff request",
    ],
    noLiveCaptureStatement:
      "This intake is a requirements map only. It does not upload files, save partner answers, accept policy, select storage, bill premium services, or launch student sessions.",
  },
];

export function getPartnerPilotRequirementsIntake(
  tenantId: string,
): PartnerPilotRequirementsIntake | undefined {
  return samplePartnerPilotRequirementsIntakes.find((intake) => intake.tenantId === tenantId);
}

export function countPartnerPilotRequirements(
  intake: PartnerPilotRequirementsIntake,
  status: PartnerPilotRequirementStatus,
): number {
  return intake.requirements.filter((requirement) => requirement.status === status).length;
}
