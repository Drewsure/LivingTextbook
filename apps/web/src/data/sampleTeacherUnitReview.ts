import { getUnitKey } from "@living-textbook/content-model";
import type { ContentPackage, LaunchSession, UnitPayload } from "@living-textbook/content-model";
import type { TeacherAssignmentPlan } from "@living-textbook/content-model/src/teacherAssignment";
import type { TenantConfig } from "@/features/tenant/types";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";
import { sampleLaunchSession } from "./sampleLaunchSession";
import { sampleMultimediaContentPackage } from "./sampleMultimediaPackage";
import {
  samplePartnerContentPackage,
  samplePartnerLaunchSession,
} from "./samplePartnerPackage";
import { findSampleTeacherAssignmentPlan } from "./sampleTeacherAssignmentPlans";
import { sampleUnitPackageReadiness } from "./sampleUnitPackageReadiness";
import type { UnitPackageReadinessSummary } from "./sampleUnitPackageReadiness";
import {
  getFrontDoorPath,
  getMediaPlaylistPath,
  getPrintableWorksheetPath,
  getQuizPath,
  getSentenceBuilderPath,
  getSpeakItPath,
  getStudentLaunchPath,
  getTeacherSessionMonitorPath,
  getTrainingAcademyPath,
} from "@/features/routes/routeContracts";

export interface TeacherUnitReviewRoute {
  label: string;
  href: string;
  status: "ready" | "review" | "blocked";
  note: string;
}

export interface TeacherUnitReviewContext {
  reviewId: string;
  unitKey: string;
  tenant: TenantConfig;
  unit: UnitPayload;
  contentPackage: ContentPackage;
  launchSession: LaunchSession;
  packageReadiness?: UnitPackageReadinessSummary;
  assignmentPlan?: TeacherAssignmentPlan;
  routes: TeacherUnitReviewRoute[];
}

const reviewAliases = new Map<string, string>([
  ["ministar-l1-u1-greetings", getUnitKey(sampleMultimediaContentPackage.units[0].unitMeta)],
  ["sample-publisher-l1-u1-routines", getUnitKey(samplePartnerContentPackage.units[0].unitMeta)],
]);

export const sampleTeacherUnitReviewContexts: TeacherUnitReviewContext[] = [
  buildTeacherUnitReviewContext({
    reviewId: "teacher-unit-review-ministar-l1-u1",
    tenant: ministarTenant,
    contentPackage: sampleMultimediaContentPackage,
    unit: sampleMultimediaContentPackage.units[0],
    launchSession: sampleLaunchSession,
  }),
  buildTeacherUnitReviewContext({
    reviewId: "teacher-unit-review-sample-publisher-l1-u1",
    tenant: samplePublisherTenant,
    contentPackage: samplePartnerContentPackage,
    unit: samplePartnerContentPackage.units[0],
    launchSession: samplePartnerLaunchSession,
  }),
];

export function resolveSampleTeacherUnitReview(unitKeyOrAlias: string): TeacherUnitReviewContext | undefined {
  const decoded = decodeURIComponent(unitKeyOrAlias);
  const resolvedKey = reviewAliases.get(decoded) ?? decoded;

  return sampleTeacherUnitReviewContexts.find((context) => context.unitKey === resolvedKey);
}

function buildTeacherUnitReviewContext(args: {
  reviewId: string;
  tenant: TenantConfig;
  contentPackage: ContentPackage;
  unit: UnitPayload;
  launchSession: LaunchSession;
}): TeacherUnitReviewContext {
  const unitKey = getUnitKey(args.unit.unitMeta);
  const playlist = args.contentPackage.playlists?.find((candidate) => candidate.unitKey === unitKey);
  const packageReadiness = sampleUnitPackageReadiness.find(
    (summary) => summary.packageId === args.contentPackage.meta.packageId,
  );
  const assignmentPlan = findSampleTeacherAssignmentPlan(args.launchSession.launchCode);

  return {
    ...args,
    unitKey,
    packageReadiness,
    assignmentPlan,
    routes: [
      {
        label: "Front door",
        href: getFrontDoorPath(args.tenant.id),
        status: assignmentPlan?.access.accessMode === "front-door-code" ? "review" : "ready",
        note: "Use when a teacher or textbook partner needs entry-code and learner-code grouping.",
      },
      {
        label: "Student launch",
        href: getStudentLaunchPath(args.launchSession.launchCode),
        status: "ready",
        note: "Flashcards, unlock flow, Memory Match, media shortcut, and student summary.",
      },
      ...(playlist
        ? [
            {
              label: "Unit media playlist",
              href: getMediaPlaylistPath(playlist.playlistId),
              status: "review" as const,
              note: "Audio/video companion path. Media is support-only and does not unlock mastery.",
            },
          ]
        : []),
      {
        label: "Printable worksheet",
        href: getPrintableWorksheetPath(args.launchSession.launchCode),
        status: "review",
        note: "Browser-print preview is available; PDF export remains blocked.",
      },
      {
        label: "Quiz",
        href: getQuizPath(args.launchSession.launchCode),
        status: "ready",
        note: "Selection-engine review path with audio-supported prompts.",
      },
      {
        label: "Sentence Builder",
        href: getSentenceBuilderPath(args.launchSession.launchCode),
        status: "ready",
        note: "Text-spelling path for reviewed target sentence construction.",
      },
      {
        label: "Speak It",
        href: getSpeakItPath(args.launchSession.launchCode),
        status: "review",
        note: "Teacher-controlled speaking/listening practice with local microphone replay only.",
      },
      {
        label: "Training Academy",
        href: getTrainingAcademyPath(args.launchSession.launchCode),
        status: "ready",
        note: "Deterministic recovery lane for missed vocabulary or sentence practice.",
      },
      {
        label: "Teacher monitor",
        href: getTeacherSessionMonitorPath(args.launchSession.launchCode),
        status: "review",
        note: "Teacher-visible event stream, roster boundary, settings snapshot, and report preview.",
      },
      {
        label: "Report package",
        href: `${getTeacherSessionMonitorPath(args.launchSession.launchCode)}/report-package`,
        status: "blocked",
        note: "Read-only evidence package preview. Export remains blocked until policy and persistence are accepted.",
      },
    ],
  };
}
