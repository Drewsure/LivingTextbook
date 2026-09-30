import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, relative, resolve } from "node:path";
import {
  validateLocalBundleManifest,
  validatePilotDeliveryManifest,
  validatePilotDeliveryPackageIndex,
  validatePilotDeliveryReleaseReceipt,
  validatePilotQrPrintArtifact,
  validatePilotQrAliasRegistryRecord,
  validateLocalPilotPackageIntegrity,
  createLocalPilotPackageOperatorChecklist,
  validateLocalPilotPackageOperatorChecklist,
  validateLocalPilotPackageHandoff,
  validateContentPackage,
  validateTenantConfig,
  type LocalBundleManifest,
  type ContentPackage,
  type PilotDeliveryManifest,
  type PilotDeliveryPackageIndex,
  type PilotDeliveryReleaseReceipt,
  type PilotQrAliasRegistryRecord,
  type TenantConfig,
  type LocalPilotPackageHandoff,
  type LocalPilotPackageIntegrity,
  type LocalPilotPackageOperatorChecklist,
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
  tenantConfig: TenantConfig;
  quarantineId: string;
  reviewPacketId: string;
  qrPrintArtifactReady: boolean;
  qrAliasRegistryReady: boolean;
  integrityManifestId: string;
  integrityFileCount: number;
  approvedAssetSourceScope: "package-scoped-promotion" | "legacy-flat-root";
  copiedAssetCount: number;
  operatorChecklist: LocalPilotPackageOperatorChecklist;
  hostedPersistence: PilotDeliveryManifest["hostedPersistence"];
  hostedPersistenceDecisionPacketId: PilotDeliveryManifest["hostedPersistenceDecisionPacketId"];
  learnerRecordsIncluded: false;
}

export type LocalPilotPackageRuntimeReadResult =
  | { status: "blocked" | "not-found"; summary: null; errors: string[] }
  | { status: "available"; summary: LocalPilotPackageRuntimeSummary; errors: [] };

export type LocalPilotPackageQrPrintReadResult =
  | { status: "blocked" | "not-found"; html: null; errors: string[] }
  | { status: "available"; html: string; errors: [] };

export type LocalPilotPackageHandoffReadResult =
  | { status: "blocked" | "not-found"; handoff: null; errors: string[] }
  | { status: "available"; handoff: LocalPilotPackageHandoff; errors: [] };

export type LocalPilotPackageIntegrityReadResult =
  | { status: "blocked" | "not-found"; integrity: null; errors: string[] }
  | { status: "available"; integrity: LocalPilotPackageIntegrity; errors: [] };

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
    const [packageIndexValue, manifestValue, receiptValue, bundleValue, assemblyValue, qrPrintValue, qrRegistryValue, reviewPacketBindingValue, integrityValue, qrPrintHtmlValue] = await Promise.all([
      readJson(join(directory, "metadata/delivery-package.json")),
      readJson(join(directory, "metadata/delivery-manifest.json")),
      readJson(join(directory, "metadata/release-receipt.json")),
      readJson(join(directory, "metadata/local-bundle-manifest.json")),
      readJson(join(directory, "metadata/assembly-record.json")),
      readJson(join(directory, "metadata/qr-print-sheet.json")),
      readJson(join(directory, "metadata/qr-alias-registry.json")),
      readJson(join(directory, "metadata/package-review-binding.json")),
      readJson(join(directory, "metadata/package-integrity.json")),
      readFile(join(directory, "metadata/qr-print-sheet.html"), "utf8"),
    ]);
    const packageIndexErrors = validatePilotDeliveryPackageIndex(packageIndexValue);
    const manifestErrors = validatePilotDeliveryManifest(manifestValue);
    const receiptErrors = validatePilotDeliveryReleaseReceipt(receiptValue);
    const bundleValidation = validateLocalBundleManifest(bundleValue);
    const integrityErrors = validateLocalPilotPackageIntegrity(integrityValue);
    const bindingErrors = validateBinding(packageIndexValue, manifestValue, receiptValue, bundleValue, assemblyValue, qrPrintValue, qrRegistryValue, reviewPacketBindingValue, integrityValue, qrPrintHtmlValue);
    const integrityReadErrors = isRecord(integrityValue) ? await verifyPackageIntegrity(directory, integrityValue as LocalPilotPackageIntegrity) : [];
    const errors = [...packageIndexErrors, ...manifestErrors, ...receiptErrors, ...bundleValidation.errors, ...integrityErrors, ...bindingErrors, ...integrityReadErrors];
    if (errors.length > 0) return { status: "blocked", summary: null, errors: [...new Set(errors)] };

    const manifest = manifestValue as PilotDeliveryManifest;
    const packageIndex = packageIndexValue as PilotDeliveryPackageIndex;
    const bundle = bundleValue as LocalBundleManifest;
    const assembly = assemblyValue as Record<string, unknown>;
    const reviewPacketBinding = reviewPacketBindingValue as LocalPilotPackageReviewBinding;
    const tenantConfig = bundle.tenant_config;
    if (!tenantConfig) return { status: "blocked", summary: null, errors: ["Local package runtime requires an embedded tenant configuration for white-label delivery."] };
    const tenantConfigErrors = validateTenantConfig(tenantConfig, identity.tenantId);
    if (tenantConfigErrors.length > 0) return { status: "blocked", summary: null, errors: tenantConfigErrors };
    const summary: LocalPilotPackageRuntimeSummary = {
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
        tenantConfig,
        quarantineId: reviewPacketBinding.quarantineId,
        reviewPacketId: reviewPacketBinding.packetId,
        qrPrintArtifactReady: true,
        qrAliasRegistryReady: true,
        integrityManifestId: String((integrityValue as Record<string, unknown>).integrityManifestId ?? ""),
        integrityFileCount: Number((integrityValue as Record<string, unknown>).fileCount ?? 0),
        approvedAssetSourceScope: assembly.approvedAssetSourceScope as "package-scoped-promotion" | "legacy-flat-root",
        copiedAssetCount: Number(assembly.copiedAssetCount ?? 0),
        hostedPersistence: packageIndex.hostedPersistence,
        hostedPersistenceDecisionPacketId: packageIndex.hostedPersistenceDecisionPacketId,
        operatorChecklist: createLocalPilotPackageOperatorChecklist({
          tenantId: identity.tenantId,
          packageId: identity.packageId,
          version: identity.version,
          bundleId: bundle.bundle_id,
          manifestId: manifest.manifestId,
          receiptId: String((receiptValue as Record<string, unknown>).receiptId ?? ""),
          sourceAssemblyChecksum: manifest.sourceAssemblyChecksum,
          approvedAssetSourceScope: assembly.approvedAssetSourceScope as "package-scoped-promotion" | "legacy-flat-root",
          copiedAssetCount: Number(assembly.copiedAssetCount ?? 0),
          qrPrintArtifactId: String((qrPrintValue as Record<string, unknown>).artifactId ?? ""),
          qrAliasRegistryRecordId: String((qrRegistryValue as Record<string, unknown>).recordId ?? ""),
          integrityManifestId: String((integrityValue as Record<string, unknown>).integrityManifestId ?? ""),
          integrityFileCount: Number((integrityValue as Record<string, unknown>).fileCount ?? 0),
          routeCount: bundle.routes.length,
          gameRouteCount: packageIndex.gameRoutePaths.length,
          hostedPersistence: packageIndex.hostedPersistence,
        }),
        learnerRecordsIncluded: assembly.learnerRecordsIncluded as false,
    };
    const checklistErrors = validateLocalPilotPackageOperatorChecklist(summary.operatorChecklist);
    if (checklistErrors.length > 0) return { status: "blocked", summary: null, errors: checklistErrors };
    return { status: "available", summary, errors: [] };
  } catch {
    return { status: "not-found", summary: null, errors: ["The local pilot package metadata could not be read from the configured package root."] };
  }
}

export async function readLocalPilotPackageQrPrintSheet(identity: LocalPilotPackageRuntimeIdentity): Promise<LocalPilotPackageQrPrintReadResult> {
  if (process.env.LIVING_TEXTBOOOK_LOCAL_PACKAGE_PRINT_READS_ENABLED !== "true") {
    return { status: "blocked", html: null, errors: ["Local pilot package QR print reads are disabled. Enable the explicit local-package print-read gate before serving a print sheet."] };
  }

  const runtime = await readLocalPilotPackageRuntime(identity);
  if (runtime.status !== "available") return { status: runtime.status, html: null, errors: runtime.errors };

  const configuredRoot = process.env.LIVING_TEXTBOOOK_LOCAL_PACKAGE_ROOT?.trim();
  if (!configuredRoot) return { status: "blocked", html: null, errors: ["Local pilot package QR print reads require an explicit package root."] };
  const root = resolve(configuredRoot);
  const directory = resolve(root, identity.tenantId, identity.packageId, identity.version);
  const printPath = resolve(directory, "metadata/qr-print-sheet.html");
  const boundaryErrors = validateDurableBackupFilesystemPath(printPath, directory);
  if (boundaryErrors.length > 0) return { status: "blocked", html: null, errors: boundaryErrors };

  try {
    const html = await readFile(printPath, "utf8");
    if (!html.trim()) return { status: "blocked", html: null, errors: ["The verified local package QR print sheet is empty."] };
    return { status: "available", html, errors: [] };
  } catch {
    return { status: "not-found", html: null, errors: ["The verified local package QR print sheet could not be read from the configured package root."] };
  }
}

export async function readLocalPilotPackageHandoff(identity: LocalPilotPackageRuntimeIdentity): Promise<LocalPilotPackageHandoffReadResult> {
  if (process.env.LIVING_TEXTBOOOK_LOCAL_PACKAGE_HANDOFF_READS_ENABLED !== "true") {
    return { status: "blocked", handoff: null, errors: ["Local pilot package handoff reads are disabled. Enable the explicit local-package handoff-read gate before serving a handoff receipt."] };
  }

  const runtime = await readLocalPilotPackageRuntime(identity);
  if (runtime.status !== "available") return { status: runtime.status, handoff: null, errors: runtime.errors };

  const configuredRoot = process.env.LIVING_TEXTBOOOK_LOCAL_PACKAGE_ROOT?.trim();
  if (!configuredRoot) return { status: "blocked", handoff: null, errors: ["Local pilot package handoff reads require an explicit package root."] };
  const root = resolve(configuredRoot);
  const directory = resolve(root, identity.tenantId, identity.packageId, identity.version);
  const boundaryErrors = validateDurableBackupFilesystemPath(directory, root);
  if (boundaryErrors.length > 0) return { status: "blocked", handoff: null, errors: boundaryErrors };

  try {
    const [manifestValue, receiptValue, qrPrintValue, qrRegistryValue] = await Promise.all([
      readJson(join(directory, "metadata/delivery-manifest.json")),
      readJson(join(directory, "metadata/release-receipt.json")),
      readJson(join(directory, "metadata/qr-print-sheet.json")),
      readJson(join(directory, "metadata/qr-alias-registry.json")),
    ]);
    if (!isRecord(manifestValue) || !isRecord(receiptValue) || !isRecord(qrPrintValue) || !isRecord(qrRegistryValue)) {
      return { status: "blocked", handoff: null, errors: ["Local pilot package handoff metadata must contain object records only."] };
    }
    const handoff: LocalPilotPackageHandoff = {
      handoffVersion: 1,
      handoffId: `${identity.packageId}:${identity.version}:local-package-handoff`,
      tenantId: identity.tenantId,
      packageId: identity.packageId,
      version: identity.version,
      bundleId: runtime.summary.bundleId,
      mode: runtime.summary.mode,
      manifestId: String(manifestValue.manifestId ?? ""),
      receiptId: String(receiptValue.receiptId ?? ""),
      sourceAssemblyChecksum: String(manifestValue.sourceAssemblyChecksum ?? ""),
      qrPrintArtifactId: String(qrPrintValue.artifactId ?? ""),
      qrPrintHtmlChecksum: String(qrPrintValue.htmlChecksum ?? ""),
      qrAliasRegistryRecordId: String(qrRegistryValue.recordId ?? ""),
      integrityManifestId: runtime.summary.integrityManifestId,
      integrityFileCount: runtime.summary.integrityFileCount,
      approvedAssetSourceScope: runtime.summary.approvedAssetSourceScope,
      copiedAssetCount: runtime.summary.copiedAssetCount,
      routeCount: runtime.summary.routes.length,
      gameRouteCount: runtime.summary.gameRoutePaths.length,
      mediaKinds: runtime.summary.mediaKinds.slice(),
      hostedPersistence: runtime.summary.hostedPersistence,
      hostedPersistenceDecisionPacketId: runtime.summary.hostedPersistenceDecisionPacketId,
      status: "verified-local-package",
      learnerRecordsIncluded: false,
      writesAllowed: false,
      hostedPersistenceActivated: false,
      qrAliasesMutated: false,
      sideEffect: "none",
    };
    const errors = validateLocalPilotPackageHandoff(handoff);
    if (handoff.tenantId !== String(manifestValue.tenantId ?? "") || handoff.packageId !== String(manifestValue.packageId ?? "") || handoff.version !== String(manifestValue.version ?? "")) errors.push("Local pilot package handoff identity does not match the delivery manifest.");
    if (handoff.manifestId !== String(receiptValue.manifestId ?? "") || handoff.sourceAssemblyChecksum !== String(receiptValue.sourceAssemblyChecksum ?? "")) errors.push("Local pilot package handoff release receipt binding does not match the delivery manifest.");
    if (handoff.manifestId !== String(qrPrintValue.manifestId ?? "") || handoff.receiptId !== String(qrPrintValue.receiptId ?? "") || handoff.sourceAssemblyChecksum !== String(qrPrintValue.sourceAssemblyChecksum ?? "")) errors.push("Local pilot package handoff QR print binding does not match the delivery manifest.");
    if (handoff.manifestId !== String(qrRegistryValue.manifestId ?? "") || handoff.receiptId !== String(qrRegistryValue.receiptId ?? "") || handoff.sourceAssemblyChecksum !== String(qrRegistryValue.sourceAssemblyChecksum ?? "")) errors.push("Local pilot package handoff QR registry binding does not match the delivery manifest.");
    if (errors.length > 0) return { status: "blocked", handoff: null, errors: [...new Set(errors)] };
    return { status: "available", handoff, errors: [] };
  } catch {
    return { status: "not-found", handoff: null, errors: ["The local pilot package handoff metadata could not be read from the configured package root."] };
  }
}

export async function readLocalPilotPackageIntegrity(identity: LocalPilotPackageRuntimeIdentity): Promise<LocalPilotPackageIntegrityReadResult> {
  if (process.env.LIVING_TEXTBOOOK_LOCAL_PACKAGE_INTEGRITY_READS_ENABLED !== "true") {
    return { status: "blocked", integrity: null, errors: ["Local pilot package integrity reads are disabled. Enable the explicit local-package integrity-read gate before serving a checksum ledger."] };
  }

  const runtime = await readLocalPilotPackageRuntime(identity);
  if (runtime.status !== "available") return { status: runtime.status, integrity: null, errors: runtime.errors };

  const configuredRoot = process.env.LIVING_TEXTBOOOK_LOCAL_PACKAGE_ROOT?.trim();
  if (!configuredRoot) return { status: "blocked", integrity: null, errors: ["Local pilot package integrity reads require an explicit package root."] };
  const root = resolve(configuredRoot);
  const directory = resolve(root, identity.tenantId, identity.packageId, identity.version);
  const integrityPath = resolve(directory, "metadata/package-integrity.json");
  const boundaryErrors = validateDurableBackupFilesystemPath(integrityPath, directory);
  if (boundaryErrors.length > 0) return { status: "blocked", integrity: null, errors: boundaryErrors };

  try {
    const value = await readJson(integrityPath);
    const errors = validateLocalPilotPackageIntegrity(value);
    if (isRecord(value) && (value.tenantId !== identity.tenantId || value.packageId !== identity.packageId || value.version !== identity.version || value.integrityManifestId !== runtime.summary.integrityManifestId)) {
      errors.push("Local pilot package integrity identity does not match the verified runtime package.");
    }
    if (errors.length > 0) return { status: "blocked", integrity: null, errors: [...new Set(errors)] };
    return { status: "available", integrity: value as LocalPilotPackageIntegrity, errors: [] };
  } catch {
    return { status: "not-found", integrity: null, errors: ["The local pilot package integrity ledger could not be read from the configured package root."] };
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

function validateBinding(packageIndexValue: unknown, manifestValue: unknown, receiptValue: unknown, bundleValue: unknown, assemblyValue: unknown, qrPrintValue: unknown, qrRegistryValue: unknown, reviewPacketBindingValue: unknown, integrityValue: unknown, qrPrintHtmlValue: unknown): string[] {
  if (!isRecord(packageIndexValue) || !isRecord(manifestValue) || !isRecord(receiptValue) || !isRecord(bundleValue) || !isRecord(assemblyValue) || !isRecord(qrPrintValue) || !isRecord(qrRegistryValue) || !isRecord(reviewPacketBindingValue) || !isRecord(integrityValue) || typeof qrPrintHtmlValue !== "string") {
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
  if (!["package-scoped-promotion", "legacy-flat-root"].includes(String(assemblyValue.approvedAssetSourceScope)) || !Number.isInteger(assemblyValue.copiedAssetCount) || Number(assemblyValue.copiedAssetCount) < 1) errors.push("Local package runtime assembly record does not preserve approved asset custody scope and count.");
  if (integrityValue.tenantId !== manifestValue.tenantId || integrityValue.packageId !== manifestValue.packageId || integrityValue.version !== manifestValue.version || integrityValue.bundleId !== bundleValue.bundle_id || integrityValue.sourceAssemblyChecksum !== manifestValue.sourceAssemblyChecksum) errors.push("Local package runtime integrity manifest does not match the approved delivery identity.");
  errors.push(...validatePilotQrPrintArtifact(qrPrintValue));
  errors.push(...validatePilotQrAliasRegistryRecord(qrRegistryValue));
  if (qrPrintValue.tenantId !== manifestValue.tenantId || qrPrintValue.packageId !== manifestValue.packageId || qrPrintValue.version !== manifestValue.version || qrPrintValue.manifestId !== manifestValue.manifestId || qrPrintValue.receiptId !== receiptValue.receiptId || qrPrintValue.sourceAssemblyChecksum !== manifestValue.sourceAssemblyChecksum) errors.push("Local package runtime QR print artifact does not match the approved delivery identity.");
  if (qrRegistryValue.tenantId !== manifestValue.tenantId || qrRegistryValue.packageId !== manifestValue.packageId || qrRegistryValue.version !== manifestValue.version || qrRegistryValue.manifestId !== manifestValue.manifestId || qrRegistryValue.receiptId !== receiptValue.receiptId || qrRegistryValue.sourceAssemblyChecksum !== manifestValue.sourceAssemblyChecksum) errors.push("Local package runtime QR alias registry record does not match the approved delivery identity.");
  if (qrPrintValue.htmlChecksum !== "sha256:" + createHash("sha256").update(qrPrintHtmlValue).digest("hex")) errors.push("Local package runtime QR print sheet HTML checksum does not match its approved print artifact.");
  const manifestAliases = Array.isArray(manifestValue.qrAliasPaths) ? manifestValue.qrAliasPaths : [];
  const manifestFallbacks = Array.isArray(manifestValue.localFallbackPaths) ? manifestValue.localFallbackPaths : [];
  const registryEntries = Array.isArray(qrRegistryValue.entries) ? qrRegistryValue.entries : [];
  if (registryEntries.map((entry) => entry?.aliasPath).join("|") !== manifestAliases.join("|") || registryEntries.map((entry) => entry?.fallbackPath).join("|") !== manifestFallbacks.join("|")) errors.push("Local package runtime QR alias registry paths do not match the approved delivery manifest.");
  if (manifestValue.status !== "ready-for-manual-release" || receiptValue.status !== "manual-release-approved" || packageIndexValue.releaseStatus !== "manual-release-approved") errors.push("Local package runtime requires approved release metadata.");
  return [...new Set(errors)];
}

async function verifyPackageIntegrity(directory: string, integrity: LocalPilotPackageIntegrity): Promise<string[]> {
  const errors: string[] = [];
  for (const entry of integrity.files) {
    try {
      const bytes = await readFile(join(directory, entry.path));
      const checksum = "sha256:" + createHash("sha256").update(bytes).digest("hex");
      if (bytes.byteLength !== entry.bytes || checksum !== entry.checksum) errors.push("Local package integrity checksum mismatch for " + entry.path + ".");
    } catch {
      errors.push("Local package integrity file is missing: " + entry.path + ".");
    }
  }
  return errors;
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
