import type { PublisherPilotIntakeBrief, PublisherPilotQrTargetType } from "./publisherPilotIntakeBrief";
import { validatePublisherPilotIntakeBrief } from "./publisherPilotIntakeBrief";

export interface PublisherPilotQrPreviewEntry {
  referenceId: string;
  printedQrId: string;
  pageReference: string;
  unitId: string;
  activitySlug: string;
  targetType: PublisherPilotQrTargetType;
  language: string;
  aliasPath: string;
  fallbackPath: string;
  status: "draft-only";
  printAllowed: false;
}

export interface PublisherPilotIntakeQrPreview {
  previewId: string;
  tenantId: string;
  packageId: string;
  version: string;
  entries: PublisherPilotQrPreviewEntry[];
  unresolvedRequirements: string[];
  blockedActions: string[];
  productionPrintAllowed: false;
  routeMutationAllowed: false;
  studentFacingActivationAllowed: false;
  sideEffect: "none";
}

export function createPublisherPilotQrPreview(brief: PublisherPilotIntakeBrief, packageId: string): PublisherPilotIntakeQrPreview {
  const errors = validatePublisherPilotIntakeBrief(brief);
  if (errors.length > 0) throw new Error(`Publisher pilot QR preview requires a valid intake brief: ${errors.join(" ")}`);
  if (!isSafeSegment(packageId)) throw new Error("packageId must be a safe QR package segment.");

  const entries = brief.qrReferences.map((reference) => {
    const printedQrId = `qr-${safeSegment(brief.tenantId)}-${safeSegment(reference.referenceId)}`;
    const aliasPath = `/q/tenant/${safeSegment(brief.tenantId)}/series/${safeSegment(brief.seriesName)}/book/${safeSegment(brief.bookTitle)}/unit/${safeSegment(reference.unitId)}/activity/${safeSegment(reference.activitySlug)}/language/${safeSegment(reference.language)}/edition/${safeSegment(brief.edition)}/version/${safeSegment(brief.version)}`;
    const fallbackPath = `/local/package/${safeSegment(brief.tenantId)}/${safeSegment(packageId)}/${safeSegment(brief.version)}/qr/${printedQrId}`;
    return { ...reference, printedQrId, aliasPath, fallbackPath, status: "draft-only" as const, printAllowed: false as const };
  });

  return {
    previewId: `publisher-qr-preview-${safeSegment(brief.tenantId)}-${safeSegment(packageId)}-${safeSegment(brief.version)}`,
    tenantId: brief.tenantId,
    packageId,
    version: brief.version,
    entries,
    unresolvedRequirements: [
      "Human package release approval is required before QR printing.",
      "Rollback and local fallback evidence must be reviewed for every alias.",
      "Durable QR registry persistence remains a separate gate.",
    ],
    blockedActions: [
      "No durable QR alias registry write",
      "No production QR print authorization",
      "No QR route mutation",
      "No student-facing activation",
    ],
    productionPrintAllowed: false,
    routeMutationAllowed: false,
    studentFacingActivationAllowed: false,
    sideEffect: "none",
  };
}

export function validatePublisherPilotQrPreview(preview: PublisherPilotIntakeQrPreview): string[] {
  const errors: string[] = [];
  for (const field of ["previewId", "tenantId", "packageId", "version"] as const) if (!isSafeSegment(preview[field])) errors.push(`QR preview ${field} must be safe.`);
  if (!Array.isArray(preview.entries) || preview.entries.length === 0) errors.push("QR preview requires at least one entry.");
  if (preview.productionPrintAllowed !== false || preview.routeMutationAllowed !== false || preview.studentFacingActivationAllowed !== false || preview.sideEffect !== "none") errors.push("QR preview must remain blocked and side-effect-free.");
  if (!Array.isArray(preview.unresolvedRequirements) || preview.unresolvedRequirements.length === 0 || !Array.isArray(preview.blockedActions) || preview.blockedActions.length === 0) errors.push("QR preview must name unresolved requirements and blocked actions.");
  const printedIds = new Set<string>();
  for (const entry of preview.entries ?? []) {
    if (!isSafeSegment(entry.printedQrId) || printedIds.has(entry.printedQrId)) errors.push("QR preview printed ids must be safe and unique.");
    printedIds.add(entry.printedQrId);
    if (!entry.aliasPath.startsWith("/q/tenant/") || !entry.fallbackPath.startsWith(`/local/package/${safeSegment(preview.tenantId)}/${safeSegment(preview.packageId)}/${safeSegment(preview.version)}/`)) errors.push(`QR preview ${entry.printedQrId} has unsafe or unbound paths.`);
    if (entry.status !== "draft-only" || entry.printAllowed !== false) errors.push(`QR preview ${entry.printedQrId} must remain print-blocked.`);
  }
  return [...new Set(errors)];
}

function safeSegment(value: string): string { return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120); }
function isSafeSegment(value: unknown): value is string { return typeof value === "string" && /^[a-z0-9][a-z0-9._-]{0,119}$/.test(value); }
