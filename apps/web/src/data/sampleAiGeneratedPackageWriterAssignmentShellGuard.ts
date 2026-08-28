import {
  sampleAiGeneratedPackageWriterLocalCompanionPackageGuards,
  type AiGeneratedPackageWriterLocalCompanionPackageGuard,
} from "@/data/sampleAiGeneratedPackageWriterLocalCompanionPackageGuard";
import {
  getAiGeneratedPackageWriterAssignmentShellGuardCollectionWarnings,
  validateAiGeneratedPackageWriterAssignmentShellGuards,
  type AiGeneratedPackageWriterAssignmentShellGuard,
  type AiGeneratedPackageWriterAssignmentShellGuardStatus,
  type AiGeneratedPackageWriterAssignmentShellSurface,
  type AiGeneratedPackageWriterAssignmentShellSurfaceStatus,
} from "@living-textbook/content-model/src/aiPackageWriterAssignmentShellGuard";

export type {
  AiGeneratedPackageWriterAssignmentShellGuard,
  AiGeneratedPackageWriterAssignmentShellGuardStatus,
  AiGeneratedPackageWriterAssignmentShellSurface,
  AiGeneratedPackageWriterAssignmentShellSurfaceStatus,
};

export const sampleAiGeneratedPackageWriterAssignmentShellGuards: AiGeneratedPackageWriterAssignmentShellGuard[] =
  sampleAiGeneratedPackageWriterLocalCompanionPackageGuards.map((guard) => createAssignmentShellGuard(guard));

export const sampleAiGeneratedPackageWriterAssignmentShellGuardErrors =
  validateAiGeneratedPackageWriterAssignmentShellGuards(sampleAiGeneratedPackageWriterAssignmentShellGuards);

export const sampleAiGeneratedPackageWriterAssignmentShellGuardWarnings =
  getAiGeneratedPackageWriterAssignmentShellGuardCollectionWarnings(
    sampleAiGeneratedPackageWriterAssignmentShellGuards,
  );

export function filterAiGeneratedPackageWriterAssignmentShellGuardsByTenant(
  guards: AiGeneratedPackageWriterAssignmentShellGuard[],
  tenantId: string,
): AiGeneratedPackageWriterAssignmentShellGuard[] {
  return guards.filter((guard) => guard.tenantId === tenantId);
}

function createAssignmentShellGuard(
  localCompanionGuard: AiGeneratedPackageWriterLocalCompanionPackageGuard,
): AiGeneratedPackageWriterAssignmentShellGuard {
  const isMiniStar = localCompanionGuard.tenantId === "ministar";
  const packageIdPreview = localCompanionGuard.packageIdPreview;
  const assignmentPreview = isMiniStar
    ? "assignment-ministar-generated-greetings-preview-blocked"
    : "assignment-sample-publisher-generated-routines-preview-blocked";

  return {
    guardId: `ai-generated-package-writer-assignment-shell-guard-${localCompanionGuard.requestId}`,
    tenantId: localCompanionGuard.tenantId,
    requestId: localCompanionGuard.requestId,
    localCompanionGuardId: localCompanionGuard.guardId,
    label: isMiniStar ? "MiniStar assignment shell guard" : "AI package writer assignment shell guard",
    summary: isMiniStar
      ? "Assignment shell work stays blocked until English assignment triggers, hiragana support-only rules, teacher QR/front-door setup, no real learner data, launch gate, and reporting privacy are reviewed."
      : "Assignment shell work stays blocked until target-language assignment triggers, teacher QR/front-door setup, no real learner data, launch gate, and reporting privacy are reviewed.",
    status: "blocked",
    guardState: "Assignment shell blocked pending review",
    packageIdPreview,
    protectedAssignmentSurfaces: [
      {
        surfaceId: `${assignmentPreview}-assignment-shell`,
        label: "Assignment shell guard",
        surfaceKind: "assignment_shell",
        status: "blocked",
        sourceRecord: packageIdPreview,
        requiredProofs: [
          localCompanionGuard.guardId,
          "Teacher QR/front-door assignment review",
          "Target-language trigger assignment check",
          "School policy acceptance preflight",
        ],
        blockedActions: ["No assignment shell write", "No assignment activation from generated package"],
      },
      {
        surfaceId: `${assignmentPreview}-private-link`,
        label: "Private assignment link guard",
        surfaceKind: "private_assignment_link",
        status: "blocked",
        sourceRecord: "private-assignment-link-preview",
        requiredProofs: [
          "Private assignment link policy",
          "Teacher access boundary",
          "Classroom launch gate review",
        ],
        blockedActions: ["No private assignment link activation", "No public sharing"],
      },
      {
        surfaceId: `${assignmentPreview}-class-roster`,
        label: "Class roster scope guard",
        surfaceKind: "class_roster_scope",
        status: "blocked",
        sourceRecord: "class-roster-plan-preview",
        requiredProofs: [
          "Class roster identity boundary",
          "No real learner data collection check",
          "School policy acceptance preflight",
        ],
        blockedActions: ["No class roster binding", "No real learner data collection"],
      },
      {
        surfaceId: `${assignmentPreview}-progress-events`,
        label: "Progress event contract guard",
        surfaceKind: "progress_event_contract",
        status: "blocked",
        sourceRecord: "progress-event-taxonomy-preview",
        requiredProofs: [
          "Progress event taxonomy check",
          "Target-language trigger assignment check",
          "Only target-language game events can trigger mastery",
        ],
        blockedActions: ["No progress event stream activation", "No support-language-only assignment approval"],
      },
      {
        surfaceId: `${assignmentPreview}-teacher-report`,
        label: "Teacher report preview guard",
        surfaceKind: "teacher_report_preview",
        status: "blocked",
        sourceRecord: "teacher-report-package-preview",
        requiredProofs: [
          "Teacher report privacy check",
          "No raw microphone audio or transcript check",
          "Teacher reporting export policy review",
        ],
        blockedActions: ["No teacher report export", "No learner transcript storage"],
      },
      {
        surfaceId: `${assignmentPreview}-launch-gate`,
        label: "Classroom launch gate guard",
        surfaceKind: "launch_gate_binding",
        status: "blocked",
        sourceRecord: "classroom-launch-gate-preview",
        requiredProofs: [
          "Classroom launch gate review",
          "School policy acceptance preflight",
          "Teacher dry-run evidence required",
        ],
        blockedActions: ["No live classroom launch", "No launch-ready status"],
      },
    ],
    assignmentSafetyChecks: [
      "Teacher QR/front-door assignment review",
      "Target-language trigger assignment check",
      "No real learner data collection check",
      "School policy acceptance preflight",
      ...(isMiniStar ? ["English assignment trigger protected"] : []),
    ],
    reportingSafetyChecks: [
      "Teacher report privacy check",
      "Progress event taxonomy check",
      "No raw microphone audio or transcript check",
      "No report export from guard",
      ...(isMiniStar ? ["Hiragana assignment support remains support-only"] : []),
    ],
    blockedAssignmentActions: [
      "No assignment shell write",
      "No private assignment link activation",
      "No class roster binding",
      "No progress event stream activation",
      "No teacher report export",
      "No live classroom launch",
      "No assignment activation from generated package",
      "No support-language-only assignment approval",
      "No writer execution",
    ],
    nextRequiredRecords: [
      "Assignment shell guard storage contract",
      "Classroom launch gate review",
      "Teacher reporting export policy review",
      "Signed approval preflight",
      "School policy acceptance preflight",
    ],
    supportLanguageBoundary: localCompanionGuard.supportLanguageBoundary,
  };
}
