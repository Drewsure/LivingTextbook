import { readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import {
  validateLocalBundleManifest,
  validatePilotDeliveryManifest,
  validatePilotDeliveryPackageIndex,
  validatePilotDeliveryReleaseReceipt,
  validateContentPackage,
  type LocalBundleManifest,
  type ContentPackage,
  type PilotDeliveryManifest,
  type PilotDeliveryPackageIndex,
  type PilotDeliveryReleaseReceipt,
} from "@living-textbook/content-model";
import { validateDurableBackupFilesystemPath } from "../persistence/backupPathPolicy";

export interface LocalPilotPackageRuntimeIdentity {
  tenantId: string;
  packageId: string;
  version: string;
}

export interface LocalPilotPackageRuntimeRoute {
  qrId: string;
  unitId: string;
  targetType: string;
  targetId: string;
  localFallbackPath: string;
}

interface LocalPilotPackageReviewBinding {
  recordVersion: 1;
  tenantId: string;
  quarantineId: string;
  packetId: string;
  packageId: string;
  sourceChecksumSha256: string;
  status: "ready-for-next-gate";
}

export interface LocalPilotPackageRuntimeSummary {
  tenantId: string;
  packageId: string;
  version: string;
  bundleId: string;
  mode: PilotDeliveryManifest["mode"];
  relativeDirectory: string;
  routes: LocalPilotPackageRuntimeRoute[];
  gameRoutePaths: string[];
  mediaKinds: string[];
  contentPackagePath: string;
  quarantineId: string;
  reviewPacketId: string;
  qrPrintArtifactReady: boolean;
  hostedPersistence: PilotDeliveryManifest["hostedPersistence"];
  hostedPersistenceDecisionPacketId: PilotDeliveryManifest["hostedPersistenceDecisionPacketId"];
  learnerRecordsIncluded: false;
}

export type LocalPilotPackageRuntimeReadResult =
  | { status: "blocked" | "not-found"; summary: null; errors: string[] }
  | { status: "available"; summary: LocalPilotPackageRuntimeSummary; errors: [] };

export type LocalPilotPackageContentReadResult =
  | { status: "blocked" | "not-found"; contentPackage: null; errors: string[] }
  | { status: "available"; contentPackage: ContentPackage; errors: [] };

export type LocalPilotPackageMediaPart = "media" | "poster" | "transcript";

export type LocalPilotPackageMediaReadResult =
  | { status: "blocked" | "not-found"; bytes: null; contentType: null; errors: string[] }
  | { status: "available"; bytes: Uint8Array; contentType: string; errors: [] };

export async function readLocalPilotPackageRuntime(identity: LocalPilotPackageRuntimeIdentity): Promise<LocalPilotPackageRuntimeReadResult> {
  const identityErrors = validateIdentity(identity);
  if (identityErrors.length > 0) return { status: "blocked", summary: null, errors: identityErrors };
  if (process.env.LIVING_TEXTBOOOK_LOCAL_PACKAGE_READS_ENABLED !== "true") {
    return { status: "blocked", summary: null, errors: ["Local pilot package runtime reads are disabled. Enable the explicit local-package read gate before reading a package."] };
  }

  const configuredRoot = process.env.LIVING_TEXTBOOOK_LOCAL_PACKAGE_ROOT?.trim();
  if (!configuredRoot) return { status: "blocked", summary: null, errors: ["Local pilot package runtime reads require an explicit package root."] };
  const root = resolve(configuredRoot);
  const directory = resolve(root, identity.tenantId, identity.packageId, identity.version);
  const boundaryErrors = validateDurableBackupFilesystemPath(directory, root);
  if (boundaryErrors.length > 0) return { status: "blocked", summary: null, errors: boundaryErrors };

  try {
    const [packageIndexValue, manifestValue, receiptValue, bundleValue, assemblyValue, qrPrintValue, reviewPacketBindingValue] = await Promise.all([
      readJson(join(directory, "metadata/delivery-package.json")),
      readJson(join(directory, "metadata/delivery-manifest.json")),
      readJson(join(directory, "metadata/release-receipt.json")),
      readJson(join(directory, "metadata/local-bundle-manifest.json")),
      readJson(join(directory, "metadata/assembly-record.json")),
      readJson(join(directory, "metadata/qr-print-sheet.json")),
      readJson(join(directory, "metadata/package-review-binding.json")),
    ]);
    const packageIndexErrors = validatePilotDeliveryPackageIndex(packageIndexValue);
    const manifestErrors = validatePilotDeliveryManifest(manifestValue);
    const receiptErrors = validatePilotDeliveryReleaseReceipt(receiptValue);
    const bundleValidation = validateLocalBundleManifest(bundleValue);
    const bindingErrors = validateBinding(packageIndexValue, manifestValue, receiptValue, bundleValue, assemblyValue, qrPrintValue, reviewPacketBindingValue);
    const errors = [...packageIndexErrors, ...manifestErrors, ...receiptErrors, ...bundleValidation.errors, ...bindingErrors];
    if (errors.length > 0) return { status: "blocked", summary: null, errors: [...new Set(errors)] };

    const manifest = manifestValue as PilotDeliveryManifest;
    const packageIndex = packageIndexValue as PilotDeliveryPackageIndex;
    const bundle = bundleValue as LocalBundleManifest;
    const assembly = assemblyValue as Record<string, unknown>;
    const reviewPacketBinding = reviewPacketBindingValue as LocalPilotPackageReviewBinding;
    return {
      status: "available",
      summary: {
        tenantId: identity.tenantId,
        packageId: identity.packageId,
        version: identity.version,
        bundleId: bundle.bundle_id,
        mode: manifest.mode,
        relativeDirectory: relative(root, directory).replaceAll("\\", "/"),
        routes: bundle.routes.map((route) => ({
          qrId: route.qr_id,
          unitId: route.unit_id,
          targetType: route.target_type,
          targetId: route.target_id,
          localFallbackPath: route.local_fallback_path,
        })),
        gameRoutePaths: packageIndex.gameRoutePaths.slice(),
        mediaKinds: packageIndex.mediaKinds.slice(),
        contentPackagePath: bundle.content_package_path,
        quarantineId: reviewPacketBinding.quarantineId,
        reviewPacketId: reviewPacketBinding.packetId,
        qrPrintArtifactReady: true,
        hostedPersistence: packageIndex.hostedPersistence,
        hostedPersistenceDecisionPacketId: packageIndex.hostedPersistenceDecisionPacketId,
        learnerRecordsIncluded: assembly.learnerRecordsIncluded as false,
      },
      errors: [],
    };
  } catch {
    return { status: "not-found", summary: null, errors: ["The local pilot package metadata could not be read from the configured package root."] };
  }
}

export async function readLocalPilotPackageContent(identity: LocalPilotPackageRuntimeIdentity): Promise<LocalPilotPackageContentReadResult> {
  if (process.env.LIVING_TEXTBOOOK_LOCAL_PACKAGE_CONTENT_READS_ENABLED !== "true") {
    return { status: "blocked", contentPackage: null, errors: ["Local pilot package content reads are disabled. Enable the explicit local-package content read gate before serving student content."] };
  }

  const runtime = await readLocalPilotPackageRuntime(identity);
  if (runtime.status !== "available") return { status: runtime.status, contentPackage: null, errors: runtime.errors };

  const configuredRoot = process.env.LIVING_TEXTBOOOK_LOCAL_PACKAGE_ROOT?.trim();
  if (!configuredRoot) return { status: "blocked", contentPackage: null, errors: ["Local pilot package content reads require an explicit package root."] };
  const root = resolve(configuredRoot);
  const directory = resolve(root, identity.tenantId, identity.packageId, identity.version);
  const contentPath = resolve(directory, runtime.summary.contentPackagePath);
  const boundaryErrors = validateDurableBackupFilesystemPath(contentPath, directory);
  if (boundaryErrors.length > 0) return { status: "blocked", contentPackage: null, errors: boundaryErrors };

  try {
    const value = JSON.parse(await readFile(contentPath, "utf8")) as unknown;
    if (!isRecord(value)) return { status: "blocked", contentPackage: null, errors: ["Local pilot package content must be an object record."] };
    const contentPackage = value as ContentPackage;
    const errors = validateContentPackage(contentPackage);
    if (contentPackage.meta?.tenantId !== identity.tenantId) errors.push("Local pilot package content tenant does not match the runtime identity.");
    if (contentPackage.meta?.packageId !== identity.packageId) errors.push("Local pilot package content package does not match the runtime identity.");
    if (contentPackage.meta?.reviewStatus !== "approved") errors.push("Local pilot package content must have approved review status before student-facing reads.");
    if (containsLearnerState(value)) errors.push("Local pilot package content must not contain learner records or progression state.");
    if (errors.length > 0) return { status: "blocked", contentPackage: null, errors: [...new Set(errors)] };
    return { status: "available", contentPackage, errors: [] };
  } catch {
    return { status: "not-found", contentPackage: null, errors: ["The approved local pilot content package could not be read from the configured package root."] };
  }
}

export async function readLocalPilotPackageMedia(
  identity: LocalPilotPackageRuntimeIdentity,
  assetId: string,
  part: LocalPilotPackageMediaPart = "media",
): Promise<LocalPilotPackageMediaReadResult> {
  if (process.env.LIVING_TEXTBOOOK_LOCAL_PACKAGE_MEDIA_READS_ENABLED !== "true") {
    return { status: "blocked", bytes: null, contentType: null, errors: ["Local pilot package media reads are disabled. Enable the explicit local-package media read gate before serving package media."] };
  }
  if (!isSafeSegment(assetId)) {
    return { status: "blocked", bytes: null, contentType: null, errors: ["Local package media asset identity must be a bounded filesystem-safe identity."] };
  }
  if (!(["media", "poster", "transcript"] as const).includes(part)) {
    return { status: "blocked", bytes: null, contentType: null, errors: ["Local package media part is unsupported."] };
  }

  const contentResult = await readLocalPilotPackageContent(identity);
  if (contentResult.status !== "available") {
    return { status: contentResult.status, bytes: null, contentType: null, errors: contentResult.errors };
  }
  const asset = (contentResult.contentPackage.mediaAssets ?? []).find((candidate) => candidate.mediaAssetId === assetId);
  if (!asset) {
    return { status: "not-found", bytes: null, contentType: null, errors: ["The requested local package media asset is not declared by the approved content package."] };
  }

  const configuredRoot = process.env.LIVING_TEXTBOOOK_LOCAL_PACKAGE_ROOT?.trim();
  if (!configuredRoot) {
    return { status: "blocked", bytes: null, contentType: null, errors: ["Local pilot package media reads require an explicit package root."] };
  }
  const root = resolve(configuredRoot);
  const directory = resolve(root, identity.tenantId, identity.packageId, identity.version);
  const bundlePath = join(directory, "metadata/local-bundle-manifest.json");
  try {
    const bundle = JSON.parse(await readFile(bundlePath, "utf8")) as LocalBundleManifest;
    const bundleAsset = bundle.assets.find((candidate) => candidate.asset_id === assetId);
    const relativeAssetPath = part === "media"
      ? asset.localBundlePath ?? bundleAsset?.local_path
      : part === "poster"
        ? bundleAsset?.poster_path
        : bundleAsset?.transcript_path;
    if (!relativeAssetPath || !isSafeRelativePackagePath(relativeAssetPath)) {
      return { status: "not-found", bytes: null, contentType: null, errors: [`The approved local package has no safe ${part} file for media asset ${assetId}.`] };
    }
    const mediaPath = resolve(directory, relativeAssetPath);
    const boundaryErrors = validateDurableBackupFilesystemPath(mediaPath, directory);
    if (boundaryErrors.length > 0) {
      return { status: "blocked", bytes: null, contentType: null, errors: boundaryErrors };
    }
    const bytes = new Uint8Array(await readFile(mediaPath));
    return { status: "available", bytes, contentType: getMediaContentType(relativeAssetPath, part), errors: [] };
  } catch {
    return { status: "not-found", bytes: null, contentType: null, errors: ["The requested local package media file could not be read from the configured package root."] };
  }
}

function validateIdentity(identity: LocalPilotPackageRuntimeIdentity): string[] {
  const errors: string[] = [];
  for (const [label, value] of Object.entries(identity)) {
    if (!isSafeSegment(value)) errors.push("Local package runtime " + label + " must be a bounded filesystem-safe identity.");
  }
  return errors;
}

function validateBinding(packageIndexValue: unknown, manifestValue: unknown, receiptValue: unknown, bundleValue: unknown, assemblyValue: unknown, qrPrintValue: unknown, reviewPacketBindingValue: unknown): string[] {
  if (!isRecord(packageIndexValue) || !isRecord(manifestValue) || !isRecord(receiptValue) || !isRecord(bundleValue) || !isRecord(assemblyValue) || !isRecord(qrPrintValue) || !isRecord(reviewPacketBindingValue)) {
    return ["Local package runtime metadata must contain object records only."];
  }
  const errors: string[] = [];
  for (const field of ["tenantId", "packageId", "version"] as const) {
    if (packageIndexValue[field] !== manifestValue[field] || packageIndexValue[field] !== receiptValue[field] || packageIndexValue[field] !== assemblyValue[field]) errors.push("Local package runtime identity does not match across metadata records.");
  }
  if (manifestValue.tenantId !== bundleValue.tenant_id || manifestValue.version !== bundleValue.version) errors.push("Local package runtime bundle identity does not match the delivery manifest.");
  if (manifestValue.manifestId !== receiptValue.manifestId || manifestValue.sourceAssemblyChecksum !== receiptValue.sourceAssemblyChecksum) errors.push("Local package runtime receipt binding does not match the delivery manifest.");
  if (manifestValue.hostedPersistenceDecisionPacketId !== receiptValue.hostedPersistenceDecisionPacketId || manifestValue.hostedPersistenceDecisionPacketId !== packageIndexValue.hostedPersistenceDecisionPacketId) errors.push("Local package runtime hosted opt-in packet binding does not match across delivery metadata.");
  if (manifestValue.hostedPersistenceDecisionPacketId !== assemblyValue.hostedPersistenceDecisionPacketId) errors.push("Local package runtime assembly hosted opt-in packet binding does not match the delivery manifest.");
  if (assemblyValue.bundleId !== bundleValue.bundle_id || assemblyValue.manifestId !== manifestValue.manifestId || assemblyValue.receiptId !== receiptValue.receiptId) errors.push("Local package runtime assembly binding does not match the package metadata.");
  if (reviewPacketBindingValue.recordVersion !== 1 || reviewPacketBindingValue.status !== "ready-for-next-gate") errors.push("Local package runtime review packet binding is not ready for the next gate.");
  if (reviewPacketBindingValue.tenantId !== manifestValue.tenantId || reviewPacketBindingValue.packageId !== manifestValue.packageId || reviewPacketBindingValue.sourceChecksumSha256 !== String(manifestValue.sourceAssemblyChecksum).replace(/^sha256:/, "")) errors.push("Local package runtime review packet binding does not match the approved delivery identity.");
  if (!isSafeSegment(String(reviewPacketBindingValue.quarantineId ?? "")) || !isNonEmptyString(reviewPacketBindingValue.packetId)) errors.push("Local package runtime review packet binding identity is unsafe or incomplete.");
  if (assemblyValue.quarantineId !== reviewPacketBindingValue.quarantineId || assemblyValue.reviewPacketId !== reviewPacketBindingValue.packetId) errors.push("Local package runtime assembly record does not preserve review packet identity.");
  if (assemblyValue.publisherPayloadIncluded !== true || assemblyValue.learnerRecordsIncluded !== false || assemblyValue.sideEffect !== "local-package-assembly") errors.push("Local package runtime assembly record has an unsafe privacy or side-effect marker.");
  if (qrPrintValue.artifactVersion !== 1 || qrPrintValue.printAuthorized !== true || qrPrintValue.sideEffect !== "local-package-assembly" || !Array.isArray(qrPrintValue.entries) || qrPrintValue.entries.length === 0) errors.push("Local package runtime QR print artifact is incomplete or unauthorized.");
  if (qrPrintValue.packageId !== manifestValue.packageId || qrPrintValue.version !== manifestValue.version) errors.push("Local package runtime QR print artifact does not match the package version.");
  if (manifestValue.status !== "ready-for-manual-release" || receiptValue.status !== "manual-release-approved" || packageIndexValue.releaseStatus !== "manual-release-approved") errors.push("Local package runtime requires approved release metadata.");
  return [...new Set(errors)];
}

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, "utf8")) as unknown;
}

function isSafeSegment(value: string): boolean {
  return typeof value === "string" && value.length > 0 && value.length <= 160 && /^[A-Za-z0-9._-]+$/.test(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSafeRelativePackagePath(value: string): boolean {
  return value.length > 0
    && value.length <= 2048
    && !value.startsWith("/")
    && !value.startsWith("\\")
    && !value.includes("\\")
    && !value.split("/").some((segment) => segment === "" || segment === "." || segment === "..");
}

function getMediaContentType(path: string, part: LocalPilotPackageMediaPart): string {
  if (part === "transcript") {
    return path.toLowerCase().endsWith(".vtt") ? "text/vtt; charset=utf-8" : "text/plain; charset=utf-8";
  }
  const extension = path.toLowerCase().split(".").pop() ?? "";
  const types: Record<string, string> = {
    mp3: "audio/mpeg",
    m4a: "audio/mp4",
    wav: "audio/wav",
    ogg: "audio/ogg",
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    avif: "image/avif",
  };
  return types[extension] ?? (part === "poster" ? "image/*" : "application/octet-stream");
}

function isRecord(value: unknown): value is Record<string, any> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function containsLearnerState(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(containsLearnerState);
  if (!isRecord(value)) return false;
  const forbiddenKeys = new Set(["learnerRecords", "studentRecords", "progressionState", "studentProgression", "rawLearnerAudio"]);
  return Object.entries(value).some(([key, nested]) => forbiddenKeys.has(key) || containsLearnerState(nested));
}
