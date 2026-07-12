import type { ContentPackage, LaunchSession } from "@living-textbook/content-model";
import type { TeacherAssignmentPlan } from "@living-textbook/content-model/src/teacherAssignment";
import type { TenantConfig } from "@/features/tenant/types";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";
import { sampleLaunchSession } from "./sampleLaunchSession";
import { sampleMultimediaContentPackage } from "./sampleMultimediaPackage";
import { samplePartnerContentPackage, samplePartnerLaunchSession } from "./samplePartnerPackage";
import { sampleTeacherAssignmentPlans } from "./sampleTeacherAssignmentPlans";
import { getPrivateAssignmentPath, getTeacherSessionMonitorPath } from "@/features/routes/routeContracts";

export interface PrivateAssignmentLinkContext {
  assignmentId: string;
  label: string;
  tenant: TenantConfig;
  contentPackage: ContentPackage;
  launchSession: LaunchSession;
  assignmentPlan: TeacherAssignmentPlan;
  assignmentPath: string;
  studentTargetPath: string;
  teacherReportPath: string;
  accessSummary: string;
  safetyBoundaries: string[];
}

export const samplePrivateAssignmentLinks: PrivateAssignmentLinkContext[] = [
  buildPrivateAssignmentLink({
    tenant: ministarTenant,
    contentPackage: sampleMultimediaContentPackage,
    launchSession: sampleLaunchSession,
    assignmentPlan: findAssignment("assignment-ministar-demo-whole-class"),
    accessSummary: "Direct teacher QR assignment for classroom preview. Student can open the launch path without a production account.",
  }),
  buildPrivateAssignmentLink({
    tenant: samplePublisherTenant,
    contentPackage: samplePartnerContentPackage,
    launchSession: samplePartnerLaunchSession,
    assignmentPlan: findAssignment("assignment-sample-publisher-front-door"),
    accessSummary: "Front-door assignment for a textbook partner. Student uses teacher-provided entry and learner codes before the unit opens.",
  }),
];

export function resolveSamplePrivateAssignmentLink(assignmentId: string): PrivateAssignmentLinkContext | undefined {
  const decoded = decodeURIComponent(assignmentId);

  return samplePrivateAssignmentLinks.find((assignment) => assignment.assignmentId === decoded);
}

function buildPrivateAssignmentLink(args: {
  tenant: TenantConfig;
  contentPackage: ContentPackage;
  launchSession: LaunchSession;
  assignmentPlan: TeacherAssignmentPlan;
  accessSummary: string;
}): PrivateAssignmentLinkContext {
  return {
    assignmentId: args.assignmentPlan.assignmentId,
    label: args.assignmentPlan.label,
    tenant: args.tenant,
    contentPackage: args.contentPackage,
    launchSession: args.launchSession,
    assignmentPlan: args.assignmentPlan,
    assignmentPath: getPrivateAssignmentPath(args.assignmentPlan.assignmentId),
    studentTargetPath: args.assignmentPlan.access.routePath,
    teacherReportPath: getTeacherSessionMonitorPath(args.launchSession.launchCode),
    accessSummary: args.accessSummary,
    safetyBoundaries: [
      "Private assignment link only; not public community sharing.",
      "No iframe embed or public activity discovery in v1.",
      "Student route hides teacher/admin review controls.",
      "Teacher reports remain policy-blocked until persistence and retention rules are accepted.",
      "Support language, media engagement, and microphone practice cannot unlock target-language mastery by themselves.",
    ],
  };
}

function findAssignment(assignmentId: string): TeacherAssignmentPlan {
  const assignment = sampleTeacherAssignmentPlans.find((plan) => plan.assignmentId === assignmentId);

  if (!assignment) {
    throw new Error(`Missing sample assignment: ${assignmentId}`);
  }

  return assignment;
}
