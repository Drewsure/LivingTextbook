import type { TenantId } from "@living-textbook/content-model";
import {
  getLocalCompanionPreviewPath,
  getTeacherAiGameGeneratorPath,
  getTeacherAssignmentRolloutWorkbenchPath,
  getTeacherEvidencePacketHandoffPath,
  getTeacherEvidencePacketReviewPath,
  getTeacherLabelledDiagramAssetWorkspacePath,
  getTeacherMediaAssetWorkspacePath,
  getTeacherMediaLibraryPath,
  getTeacherPackageEntitlementsPath,
  getTeacherPersistenceReadinessPath,
  getTeacherPrototypeReviewPath,
  getTeacherPublisherMaintenancePath,
  getTeacherReleaseControlPath,
  getTeacherReportingReadinessPath,
  getTeacherSessionMonitorPath,
  getTeacherSessionSettingsWorkbenchPath,
  getTeacherSourceReviewWorkspacePath,
  getTeacherUploadWorkspacePath,
} from "@/features/routes/routeContracts";

export type TenantNavigationBoundaryStatus = "shared" | "tenant-scoped" | "sample-only" | "not-created-yet";

export interface TenantNavigationBoundaryLane {
  laneId: string;
  label: string;
  scope: string;
  status: TenantNavigationBoundaryStatus;
  purpose: string;
  routeExamples: string[];
  requiredBeforeExpansion: string[];
  blockedActions: string[];
}

export interface TenantNavigationBoundaryPlan {
  planId: string;
  label: string;
  summary: string;
  reviewRule: string;
  lanes: TenantNavigationBoundaryLane[];
  guardrails: string[];
  blockedActions: string[];
}

const ministarTenantId = "ministar" as TenantId;
const samplePublisherTenantId = "sample-publisher" as TenantId;

export const sampleTenantNavigationBoundaryPlan: TenantNavigationBoundaryPlan = {
  planId: "tenant-navigation-boundary-v2026-09-02",
  label: "White-label navigation boundary",
  summary:
    "Tenant navigation is a product boundary. Shared platform routes can serve every tenant, tenant-scoped review routes must resolve from the current tenant, and sample-publisher-only operational routes stay out of MiniStar pages until equivalent MiniStar routes are intentionally created.",
  reviewRule:
    "Review shortcut only: route links make readiness visible, but they do not activate uploads, releases, assignments, local packages, storage writes, or classroom launch.",
  lanes: [
    {
      laneId: "shared-platform-routes",
      label: "Shared platform routes",
      scope: "All tenants",
      status: "shared",
      purpose: "Cross-tenant teacher/admin workbenches that inspect common package, assignment, persistence, reporting, entitlement, and session policy readiness.",
      routeExamples: [
        "/teacher/intake",
        getTeacherAssignmentRolloutWorkbenchPath(),
        getTeacherSessionSettingsWorkbenchPath(),
        getTeacherReportingReadinessPath(),
        getTeacherPackageEntitlementsPath(),
        getTeacherPersistenceReadinessPath(),
      ],
      requiredBeforeExpansion: ["Tenant shell branding required", "Route helpers required", "Shared blockers remain visible"],
      blockedActions: ["No live workflow from navigation", "No assignment activation", "No release-state mutation"],
    },
    {
      laneId: "tenant-scoped-review-routes",
      label: "Tenant-scoped review routes",
      scope: "MiniStar and sample publisher",
      status: "tenant-scoped",
      purpose:
        "Review routes that can exist for each tenant when tenant data, ownership labels, target-language rules, support-language rules, and route helpers are present.",
      routeExamples: [
        getTeacherSourceReviewWorkspacePath(ministarTenantId),
        getTeacherSourceReviewWorkspacePath(samplePublisherTenantId),
        getTeacherAiGameGeneratorPath(ministarTenantId),
        getTeacherAiGameGeneratorPath(samplePublisherTenantId),
        getTeacherPrototypeReviewPath(ministarTenantId),
        getTeacherPrototypeReviewPath(samplePublisherTenantId),
        getTeacherMediaLibraryPath(ministarTenantId),
        getTeacherMediaLibraryPath(samplePublisherTenantId),
        getLocalCompanionPreviewPath(ministarTenantId),
        getLocalCompanionPreviewPath(samplePublisherTenantId),
      ],
      requiredBeforeExpansion: ["No cross-tenant navigation bleed", "Tenant-owned media labels", "Target-language-only progress proof"],
      blockedActions: ["No upload activation", "No local package export", "No student-facing promotion"],
    },
    {
      laneId: "sample-publisher-only-operational-routes",
      label: "Sample-publisher-only operational routes",
      scope: "Sample publisher pilot only",
      status: "sample-only",
      purpose:
        "Deeper pilot workbenches currently exist for the sample publisher route set and must not appear in MiniStar navigation until MiniStar-specific data and review records exist.",
      routeExamples: [
        getTeacherUploadWorkspacePath(samplePublisherTenantId),
        getTeacherEvidencePacketReviewPath(samplePublisherTenantId),
        getTeacherEvidencePacketHandoffPath(samplePublisherTenantId),
        getTeacherPublisherMaintenancePath(samplePublisherTenantId),
        getTeacherReleaseControlPath(samplePublisherTenantId),
        getTeacherLabelledDiagramAssetWorkspacePath("sample-publisher-l1-u1-labelled-diagram"),
        getTeacherMediaAssetWorkspacePath("sample-publisher-l1-u1-routines-media"),
        getTeacherSessionMonitorPath("partner-demo-unit-1"),
      ],
      requiredBeforeExpansion: ["Partner policy evidence", "Pilot release candidate records", "Sample publisher asset manifests"],
      blockedActions: ["No MiniStar shortcut reuse", "No generic tenant rollout", "No live upload from pilot route"],
    },
    {
      laneId: "ministar-not-created-yet",
      label: "MiniStar not created yet",
      scope: "Future MiniStar equivalents",
      status: "not-created-yet",
      purpose:
        "MiniStar upload, evidence, asset, maintenance, and release-control equivalents should be created only when the MiniStar-specific data model and review records justify them.",
      routeExamples: [
        "/teacher/uploads/ministar",
        "/teacher/evidence/ministar",
        "/teacher/maintenance/ministar",
        "/teacher/release-control/ministar",
        "/teacher/assets/labelled-diagram/ministar-l1-u1-labelled-diagram",
        "/teacher/assets/media/ministar-l1-u1-greetings-media",
      ],
      requiredBeforeExpansion: ["MiniStar source evidence", "MiniStar media rights records", "Hiragana support-language checks"],
      blockedActions: ["No sample-publisher-only links on MiniStar pages", "No copied asset workspace", "No release-state mutation"],
    },
  ],
  guardrails: [
    "No cross-tenant navigation bleed",
    "Route helpers required",
    "Tenant shell branding required",
    "No sample-publisher-only links on MiniStar pages",
    "No MiniStar-only media state on sample publisher pages",
    "Target-language actions remain the only mastery triggers",
    "Support-language content remains support-only",
  ],
  blockedActions: [
    "No upload activation",
    "No release-state mutation",
    "No local package export",
    "No assignment activation",
    "No live workflow from navigation",
    "No storage write from route shortcuts",
    "No student-facing promotion",
  ],
};
