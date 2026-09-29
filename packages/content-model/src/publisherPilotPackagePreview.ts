export type PublisherPilotPackagePreviewStatus = "preview-ready" | "blocked";
export type PublisherPilotPackageArtifactKind =
  | "content-package"
  | "game-route-manifest"
  | "media-manifest"
  | "qr-registry"
  | "local-bundle-manifest"
  | "teacher-report-policy";
export type PublisherPilotPackageArtifactStatus = "preview-ready" | "blocked";
export type PublisherPilotQrStatus = "draft-only" | "blocked";

export interface PublisherPilotPackageArtifact {
  artifactId: string;
  kind: PublisherPilotPackageArtifactKind;
  label: string;
  proposedPath: string;
  status: PublisherPilotPackageArtifactStatus;
  sourceRecords: string[];
  missingEvidence: string[];
  writeAllowed: false;
  studentFacingAllowed: false;
}

export interface PublisherPilotQrPreview {
  printedQrId: string;
  aliasPath: string;
  fallbackPath: string;
  targetLabel: string;
  deploymentTargets: Array<"hosted-route" | "local-bundle" | "hybrid">;
  status: PublisherPilotQrStatus;
  printAllowed: false;
}

export interface PublisherPilotPackagePreview {
  previewId: string;
  tenantId: string;
  packageId: string;
  version: string;
  label: string;
  status: PublisherPilotPackagePreviewStatus;
  sourceReviewDecision: "not-recorded" | "accepted-for-package-review" | "changes-required";
  hostedPersistence: "opt-in-review-only";
  deploymentOptions: Array<"hosted-web" | "closed-local" | "hybrid">;
  gameModes: string[];
  mediaKinds: Array<"audio" | "video" | "image">;
  artifacts: PublisherPilotPackageArtifact[];
  qrPreviews: PublisherPilotQrPreview[];
  blockedActions: string[];
  nextGates: string[];
}

const safeIdentifierPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;
const requiredBlockedActions = [
  "No package archive export",
  "No production QR print authorization",
  "No student-facing promotion",
  "No persistence provider activation",
] as const;

export function validatePublisherPilotPackagePreview(preview: PublisherPilotPackagePreview): string[] {
  const errors: string[] = [];

  for (const field of ["previewId", "tenantId", "packageId", "version", "label"] as const) {
    const value = preview?.[field];
    if (typeof value !== "string" || value.trim().length === 0 || value.length > 240 || !safeIdentifierPattern.test(value.trim())) {
      errors.push(`Publisher pilot package preview ${field} must be a bounded safe value.`);
    }
  }

  if (!new Set(["preview-ready", "blocked"]).has(preview?.status)) errors.push("Publisher pilot package preview has an unsupported status.");
  if (!new Set(["not-recorded", "accepted-for-package-review", "changes-required"]).has(preview?.sourceReviewDecision)) {
    errors.push("Publisher pilot package preview has an unsupported source review decision.");
  }
  if (preview?.hostedPersistence !== "opt-in-review-only") errors.push("Publisher pilot package preview hosted persistence must remain opt-in review-only.");

  for (const field of ["deploymentOptions", "gameModes", "mediaKinds", "artifacts", "qrPreviews", "blockedActions", "nextGates"] as const) {
    if (!Array.isArray(preview?.[field])) errors.push(`Publisher pilot package preview ${field} must be an array.`);
  }
  if (Array.isArray(preview?.deploymentOptions) && preview.deploymentOptions.length === 0) errors.push("Publisher pilot package preview needs a deployment option.");
  if (Array.isArray(preview?.gameModes) && preview.gameModes.length === 0) errors.push("Publisher pilot package preview needs at least one game mode.");
  if (Array.isArray(preview?.artifacts) && preview.artifacts.length === 0) errors.push("Publisher pilot package preview needs artifacts.");
  if (Array.isArray(preview?.qrPreviews) && preview.qrPreviews.length === 0) errors.push("Publisher pilot package preview needs a QR preview.");

  const artifactIds = new Set<string>();
  for (const artifact of Array.isArray(preview?.artifacts) ? preview.artifacts : []) {
    if (typeof artifact?.artifactId !== "string" || !safeIdentifierPattern.test(artifact.artifactId)) errors.push("Publisher pilot package artifact id must be safe.");
    if (artifactIds.has(artifact.artifactId)) errors.push(`Publisher pilot package preview contains duplicate artifact ${artifact.artifactId}.`);
    artifactIds.add(artifact.artifactId);
    if (!artifact?.proposedPath || typeof artifact.proposedPath !== "string" || !artifact.proposedPath.startsWith("/")) errors.push(`Publisher pilot package artifact ${artifact.artifactId} needs an internal proposed path.`);
    if (!new Set(["preview-ready", "blocked"]).has(artifact?.status)) errors.push(`Publisher pilot package artifact ${artifact.artifactId} has an unsupported status.`);
    if (artifact?.writeAllowed !== false) errors.push(`Publisher pilot package artifact ${artifact.artifactId} must block writes.`);
    if (artifact?.studentFacingAllowed !== false) errors.push(`Publisher pilot package artifact ${artifact.artifactId} must block student-facing use.`);
    if (!Array.isArray(artifact?.sourceRecords) || artifact.sourceRecords.length === 0) errors.push(`Publisher pilot package artifact ${artifact.artifactId} needs source records.`);
    if (!Array.isArray(artifact?.missingEvidence) || artifact.missingEvidence.length === 0) errors.push(`Publisher pilot package artifact ${artifact.artifactId} needs missing-evidence records.`);
  }

  const qrIds = new Set<string>();
  for (const qr of Array.isArray(preview?.qrPreviews) ? preview.qrPreviews : []) {
    if (typeof qr?.printedQrId !== "string" || !safeIdentifierPattern.test(qr.printedQrId)) errors.push("Publisher pilot QR id must be safe.");
    if (qrIds.has(qr.printedQrId)) errors.push(`Publisher pilot package preview contains duplicate QR ${qr.printedQrId}.`);
    qrIds.add(qr.printedQrId);
    if (typeof qr?.aliasPath !== "string" || !isSafeInternalQrPath(qr.aliasPath)) errors.push(`Publisher pilot QR ${qr.printedQrId} must use a safe stable /q/ alias path.`);
    if (typeof qr?.fallbackPath !== "string" || !isSafeInternalPath(qr.fallbackPath)) errors.push(`Publisher pilot QR ${qr.printedQrId} needs a safe fallback path.`);
    if (!Array.isArray(qr?.deploymentTargets) || qr.deploymentTargets.length === 0) errors.push(`Publisher pilot QR ${qr.printedQrId} needs deployment targets.`);
    if (qr?.printAllowed !== false) errors.push(`Publisher pilot QR ${qr.printedQrId} must remain print-blocked until release gates pass.`);
  }

  const blockedActions = Array.isArray(preview?.blockedActions) ? preview.blockedActions : [];
  for (const required of requiredBlockedActions) if (!blockedActions.includes(required)) errors.push(`Publisher pilot package preview must block ${required}.`);
  if (preview?.status === "blocked" && preview?.nextGates?.length === 0) errors.push("Blocked publisher pilot package preview must name next gates.");

  return [...new Set(errors)];
}

function isSafeInternalQrPath(value: string): boolean {
  return value.startsWith("/q/")
    && !value.startsWith("//")
    && !value.includes("\\")
    && !value.includes("..")
    && !/^\/(?:\/|.*(?:https?:|file:|localhost|127\.0\.0\.1))/i.test(value);
}

function isSafeInternalPath(value: string): boolean {
  return value.startsWith("/")
    && !value.startsWith("//")
    && !value.includes("\\")
    && !value.includes("..")
    && !/^\/(?:\/|.*(?:https?:|file:|localhost|127\.0\.0\.1))/i.test(value);
}
