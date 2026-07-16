import { sampleClassroomLaunchGate, type ClassroomLaunchGate } from "@/data/sampleClassroomLaunchGate";
import { samplePilotPolicyPlans } from "@/data/samplePilotPolicyPlan";
import { sampleTeacherDryRunRehearsal, type TeacherDryRunRehearsal } from "@/data/sampleTeacherDryRunRehearsal";

export type SchoolLaunchPolicyGateStatus = "ready-for-review" | "policy-needed" | "blocked";
export type SchoolLaunchPolicyGateOwner = "school" | "platform" | "publisher" | "shared";

export interface SchoolLaunchPolicyGateLane {
  laneId: string;
  label: string;
  status: SchoolLaunchPolicyGateStatus;
  owner: SchoolLaunchPolicyGateOwner;
  evidenceSource: string;
  currentEvidence: string;
  requiredBeforeLiveLaunch: string[];
  blockedActions: string[];
}

export interface SchoolLaunchPolicyGate {
  gateId: string;
  label: string;
  tenantId: string;
  packageId: string;
  releaseCandidate: string;
  sourceOfTruth: string;
  launchDecisionStatus: string;
  summary: string;
  lanes: SchoolLaunchPolicyGateLane[];
  operatingRules: string[];
}

export const sampleSchoolLaunchPolicyGate = createSchoolLaunchPolicyGate({
  launchGate: sampleClassroomLaunchGate,
  rehearsal: sampleTeacherDryRunRehearsal,
});

export function createSchoolLaunchPolicyGate({
  launchGate,
  rehearsal,
}: {
  launchGate: ClassroomLaunchGate;
  rehearsal: TeacherDryRunRehearsal;
}): SchoolLaunchPolicyGate {
  const requiredPolicyItems = samplePilotPolicyPlans.flatMap((plan) =>
    plan.requirements.filter((requirement) => requirement.requiredBeforePilot && requirement.status !== "accepted"),
  );
  const blockedLaunchItems = launchGate.items.filter((item) => item.status === "blocked");
  const openDryRunStages = rehearsal.stages.filter((stage) => stage.status !== "ready-for-rehearsal");

  return {
    gateId: `${launchGate.gateId}-school-policy-gate`,
    label: "School launch policy gate preview",
    tenantId: launchGate.tenantId,
    packageId: launchGate.packageId,
    releaseCandidate: launchGate.releaseCandidate,
    sourceOfTruth: "Source of truth: pilot policy readiness, classroom launch gate, and teacher dry-run rehearsal",
    launchDecisionStatus: "School launch decision blocked",
    summary:
      "This review packet separates a polished partner demo from a school-approved classroom launch. It names the school, publisher, and platform decisions that must close before real children, real learner data, report export, or local deployment are allowed.",
    lanes: [
      {
        laneId: "school-privacy-retention",
        label: "School privacy and retention acceptance",
        status: requiredPolicyItems.length > 0 ? "blocked" : "ready-for-review",
        owner: "school",
        evidenceSource: "Pilot policy readiness",
        currentEvidence: `${requiredPolicyItems.length} required school policy item(s) remain open before live learner data is allowed.`,
        requiredBeforeLiveLaunch: [
          "Student progress retention policy accepted.",
          "Teacher report export policy accepted.",
          "Access-control owner confirmed.",
          "Data deletion, export, and parent/school visibility rules accepted.",
        ],
        blockedActions: [
          "No real learner data collection",
          "No durable progress storage",
          "No teacher report export",
          "No family-facing report summary",
        ],
      },
      {
        laneId: "school-classroom-operating-mode",
        label: "Classroom operating mode acceptance",
        status: blockedLaunchItems.length > 0 ? "blocked" : "policy-needed",
        owner: "school",
        evidenceSource: "Classroom launch gate",
        currentEvidence: `${blockedLaunchItems.length} launch-blocking item(s) still prevent the package from being used with students.`,
        requiredBeforeLiveLaunch: [
          "Teacher-led QR/front-door onboarding scope accepted.",
          "Student self-progression limits accepted.",
          "Support-language boundaries accepted.",
          "Microphone, AI Tutor, and background-media policies accepted or disabled.",
        ],
        blockedActions: [
          "No launch button",
          "No private assignment promotion",
          "No production student accounts",
          "No support-language-only progression",
        ],
      },
      {
        laneId: "publisher-media-and-local-package",
        label: "Publisher media and local package acceptance",
        status: "policy-needed",
        owner: "publisher",
        evidenceSource: "Media rights and local deployment plans",
        currentEvidence:
          "Partner-owned music, videos, posters, captions, local bundle media, and replacement policy still need final rights and maintenance acceptance.",
        requiredBeforeLiveLaunch: [
          "Audio/video rights and replacement terms accepted.",
          "Optional game background media policy accepted.",
          "Local/closed deployment backup and update policy accepted when required.",
          "Media cannot become a mastery trigger by itself.",
        ],
        blockedActions: [
          "No live media upload",
          "No playlist promotion",
          "No local folder activation",
          "No media-only mastery",
        ],
      },
      {
        laneId: "teacher-dry-run-evidence",
        label: "Teacher dry-run evidence acceptance",
        status: openDryRunStages.length > 0 ? "policy-needed" : "ready-for-review",
        owner: "shared",
        evidenceSource: "Teacher dry-run rehearsal",
        currentEvidence: `${openDryRunStages.length} dry-run stage(s) still need teacher-only rehearsal evidence.`,
        requiredBeforeLiveLaunch: [
          "Entry code and learner code rehearsal completed.",
          "Flashcards, quiz, sentence, speaking, media, and report preview checked.",
          "Target-language-only progress triggers confirmed.",
          "Fallback route and local companion expectations checked.",
        ],
        blockedActions: [
          "No dry-run-as-approval shortcut",
          "No live classroom session",
          "No report export",
          "No real learner data during rehearsal",
        ],
      },
      {
        laneId: "platform-release-and-storage",
        label: "Platform release and storage acceptance",
        status: "blocked",
        owner: "platform",
        evidenceSource: "Backend selection, evidence storage, release control, and active route verifiers",
        currentEvidence:
          "Persistence adapter, evidence storage adapter, release-state mutation policy, and route promotion policy remain blocked.",
        requiredBeforeLiveLaunch: [
          "Backend and storage adapter selected.",
          "Evidence packet storage and attachment policy accepted.",
          "Release-control mutation policy accepted.",
          "Active route verification passes against the pilot package.",
        ],
        blockedActions: [
          "No release-state mutation",
          "No evidence export",
          "No launch-ready status",
          "No production QR promise",
        ],
      },
    ],
    operatingRules: [
      "School launch policy gates are review packets, not approval buttons.",
      "A partner demo can look polished while school launch remains blocked.",
      "The school owns privacy, access, retention, report-export, and learner-data acceptance.",
      "The publisher owns media rights, year-on-year replacement, and local package asset acceptance.",
      "The platform owns storage, evidence, release-control, active route, and launch safety gates.",
      "No live classroom workflow can start from this preview.",
    ],
  };
}
