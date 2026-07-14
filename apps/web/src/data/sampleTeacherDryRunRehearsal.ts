import { samplePilotEvidencePacket, type PilotEvidencePacket } from "@/data/samplePilotEvidencePacket";
import { samplePilotHandoffPackage, type PilotHandoffPackage } from "@/data/samplePilotHandoffPackage";
import { samplePilotLaunchChecklist, type PilotLaunchChecklist } from "@/data/samplePilotLaunchChecklist";

export type TeacherDryRunStageStatus = "ready-for-rehearsal" | "needs-review" | "blocked";
export type TeacherDryRunStageOwner = "platform" | "publisher" | "school" | "teacher" | "shared";

export interface TeacherDryRunStage {
  stageId: string;
  label: string;
  category: string;
  status: TeacherDryRunStageStatus;
  owner: TeacherDryRunStageOwner;
  source: string;
  routePath: string;
  teacherAction: string;
  expectedEvidence: string;
  mustConfirm: string[];
  blockedActions: string[];
}

export interface TeacherDryRunRehearsal {
  rehearsalId: string;
  label: string;
  tenantId: string;
  packageId: string;
  releaseCandidate: string;
  workspacePath: string;
  sourceOfTruth: string;
  studentLaunchStatus: string;
  evidenceStatus: string;
  summary: string;
  stages: TeacherDryRunStage[];
  operatingRules: string[];
}

export const sampleTeacherDryRunRehearsal = createTeacherDryRunRehearsal({
  checklist: samplePilotLaunchChecklist,
  evidencePacket: samplePilotEvidencePacket,
  handoffPackage: samplePilotHandoffPackage,
});

export function createTeacherDryRunRehearsal({
  checklist,
  evidencePacket,
  handoffPackage,
}: {
  checklist: PilotLaunchChecklist;
  evidencePacket: PilotEvidencePacket;
  handoffPackage: PilotHandoffPackage;
}): TeacherDryRunRehearsal {
  const routePathById = new Map(handoffPackage.routes.map((route) => [route.routeId, route.path]));
  const routeCount = handoffPackage.routes.length;
  const openEvidenceCount = evidencePacket.gateEvidence
    .concat(evidencePacket.approvalEvidence)
    .filter((item) => item.status !== "attached").length;

  return {
    rehearsalId: `${handoffPackage.packageId}-teacher-dry-run`,
    label: "Teacher dry-run rehearsal preview",
    tenantId: handoffPackage.tenantId,
    packageId: handoffPackage.packageId,
    releaseCandidate: checklist.releaseCandidate,
    workspacePath: `/teacher/dry-run/${handoffPackage.packageId}-teacher-dry-run`,
    sourceOfTruth: "Source of truth: pilot launch checklist and pilot handoff package",
    studentLaunchStatus: "No student launch action",
    evidenceStatus: "Dry-run evidence only",
    summary:
      "This teacher-only rehearsal turns the pilot checklist into a concrete pre-classroom script. It verifies routes, learner audio, support-language limits, media behavior, report previews, and policy blockers before any real students are invited.",
    stages: [
      {
        stageId: "front-door-route",
        label: "Entry and route rehearsal",
        category: "Entry and route rehearsal",
        status: "ready-for-rehearsal",
        owner: "teacher",
        source: "Pilot handoff route map",
        routePath: routePathById.get("partner-front-door") ?? "/enter/sample-publisher",
        teacherAction:
          "Open the partner front door, enter the sample entry code, enter a non-real learner code, and confirm the student sees the correct tenant package.",
        expectedEvidence: "Teacher can reach the package without MiniStar branding assumptions or a fragile local file path.",
        mustConfirm: [
          "Use a rehearsal learner code only.",
          "Confirm route language does not imply live class launch.",
          "Confirm QR/front-door flow still supports teacher-led onboarding.",
        ],
        blockedActions: ["Do not collect real learner names, real student IDs, or parent contact details during the dry run."],
      },
      {
        stageId: "unit-progression",
        label: "Flashcards and unlock rehearsal",
        category: "Entry and route rehearsal",
        status: "ready-for-rehearsal",
        owner: "teacher",
        source: "Pilot launch checklist",
        routePath: routePathById.get("partner-direct-launch") ?? "/launch/partner-demo-unit-1",
        teacherAction:
          "Open the direct unit launch route, complete flashcard practice, and confirm the next activity unlocks only from target-language practice.",
        expectedEvidence: "Flashcards, completion event, reward preview, and next-game unlock can be demonstrated in sequence.",
        mustConfirm: [
          "Target-language text is the progression trigger.",
          "Support-language taps help comprehension but do not unlock activities.",
          "Rewards remain deterministic and mastery-based.",
        ],
        blockedActions: ["Do not let support language, media play, or background audio substitute for target-language activity completion."],
      },
      {
        stageId: "game-audio",
        label: "Game and audio rehearsal",
        category: "Game and audio rehearsal",
        status: "needs-review",
        owner: "shared",
        source: "Assigned game/audio coverage",
        routePath: "/sentence/partner-demo-unit-1",
        teacherAction:
          "Open Sentence Builder and Speak It, tap every visible learner text item, and confirm each instruction, word, sentence, and action has a learning-audio control.",
        expectedEvidence: "Teacher can rehearse game audio coverage before assigning the activity to children.",
        mustConfirm: [
          "Listen/replay controls are separate from submit controls.",
          "Microphone practice remains local unless the school enables a paid speech service later.",
          "Speech matching and AI Tutor features remain tenant-gated and cost-visible.",
        ],
        blockedActions: ["Do not upload recordings, create transcripts, or enable AI speech scoring during the foundation dry run."],
      },
      {
        stageId: "media-support-language",
        label: "Media and support-language rehearsal",
        category: "Media and support-language rehearsal",
        status: "needs-review",
        owner: "shared",
        source: "Media playlist and assist-language rules",
        routePath: "/media/playlist-sample-publisher-l1-u1-routines",
        teacherAction:
          "Open the media playlist, test audio/video controls, and confirm media engagement is reported as support-only enrichment.",
        expectedEvidence: "Teacher sees that playlists, background media, and Japanese assist text cannot award mastery by themselves.",
        mustConfirm: [
          "Learning audio has priority over background music or chants.",
          "Media-only events are support-only.",
          "Assist language remains tenant-reviewed package data, not live AI translation.",
        ],
        blockedActions: ["Do not treat media playback, video completion, or assist-language use as a game unlock or mastery event."],
      },
      {
        stageId: "report-policy",
        label: "Report and policy rehearsal",
        category: "Report and policy rehearsal",
        status: openEvidenceCount > 0 ? "blocked" : "needs-review",
        owner: "school",
        source: "Teacher session monitor and evidence packet",
        routePath: routePathById.get("partner-teacher-session") ?? "/teacher/sessions/partner-demo-unit-1",
        teacherAction:
          "Open the teacher session monitor and report package preview, then confirm report export and durable storage remain blocked.",
        expectedEvidence: `${openEvidenceCount} evidence item(s) remain missing or blocked before live learner reporting.`,
        mustConfirm: [
          "Event acceptance gate is visible.",
          "Report package export remains blocked.",
          "School privacy, retention, and access policy are not bypassed by the rehearsal.",
        ],
        blockedActions: ["Do not store live progress, export reports, or claim classroom pilot readiness before policy and persistence are accepted."],
      },
      {
        stageId: "local-fallback",
        label: "Local fallback rehearsal",
        category: "Report and policy rehearsal",
        status: "needs-review",
        owner: "platform",
        source: "Local companion compatibility",
        routePath: "/local/sample-publisher",
        teacherAction:
          "Open the local companion preview and confirm it is a compatibility plan, not an offline-ready installer promise.",
        expectedEvidence: `${routeCount} handoff route(s) stay compatible with hosted-first pilot planning.`,
        mustConfirm: [
          "Hosted PWA remains the recommended first pilot.",
          "Local package needs backup, update, export, media bundle, and access-control procedures.",
          "Printed textbook QR codes should not point to local-only file paths.",
        ],
        blockedActions: ["Do not promise a closed local app until local release gates, backup, update, and export procedures exist."],
      },
    ],
    operatingRules: [
      "Teacher dry run is teacher-only rehearsal, not classroom launch.",
      "Do not collect real learner data during rehearsal.",
      "Dry-run evidence can inform partner planning but cannot approve a pilot.",
      "Every rehearsal step should preserve target-language progression, support-only media, and blocked report export rules.",
      "Failed rehearsal items return to intake, review, media, audio, route, policy, or persistence work before children use the package.",
    ],
  };
}
