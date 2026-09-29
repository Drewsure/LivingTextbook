import { createHash, randomUUID } from "node:crypto";
import { copyFile, mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import QRCode from "qrcode";
import {
  createPilotDeliveryPackageIndex,
  evaluateLocalBundleAssetEvidenceSet,
  validateLocalBundleManifest,
  validatePilotDeliveryManifest,
  validatePilotDeliveryPackageIndex,
  validatePilotDeliveryReleaseReceipt,
  type LocalBundleManifest,
  type PilotDeliveryManifest,
  type PilotDeliveryPackageIndex,
  type PilotDeliveryReleaseReceipt,
} from "@living-textbook/content-model";
import { validateDurableBackupFilesystemPath, validateDurableBackupPath } from "../persistence/backupPathPolicy";
import { validateQuarantineFilesystemPath } from "../uploads/quarantinePathPolicy";

export interface LocalPilotPackageAssemblyInput {
  manifest: PilotDeliveryManifest;
  receipt: PilotDeliveryReleaseReceipt;
  packageIndex: PilotDeliveryPackageIndex;
  bundleManifest: LocalBundleManifest;
  operatorId: string;
  writtenAt: string;
}

export interface LocalPilotPackageAssemblyResult {
  status: "accepted" | "blocked" | "conflict";
  idempotent: boolean;
  relativeDirectory: string | null;
  files: string[];
  copiedAssetCount: number;
  errors: string[];
}

interface AssemblyRecord {
  recordVersion: 1;
  tenantId: string;
  packageId: string;
  bundleId: string;
  version: string;
  manifestId: string;
  receiptId: string;
  sourceAssemblyChecksum: string;
  operatorId: string;
  writtenAt: string;
  qrPrintBaseUrl: string;
  files: string[];
  copiedAssetCount: number;
  publisherPayloadIncluded: true;
  learnerRecordsIncluded: false;
  sideEffect: "local-package-assembly";
}

const generatedFiles = [
  "metadata/delivery-package.json",
  "metadata/delivery-manifest.json",
  "metadata/release-receipt.json",
  "metadata/local-bundle-manifest.json",
  "metadata/route-map.json",
  "metadata/game-map.json",
  "metadata/qr-print-sheet.json",
  "metadata/qr-print-sheet.html",
  "metadata/assembly-record.json",
] as const;

export async function assembleLocalPilotPackage(input: LocalPilotPackageAssemblyInput): Promise<LocalPilotPackageAssemblyResult> {
  const validationErrors = validateAssemblyInput(input);
  if (validationErrors.length > 0) return blocked(validationErrors);
  if (process.env.LIVING_TEXTBOOOK_LOCAL_PACKAGE_WRITES_ENABLED !== "true") {
    return blocked(["Local pilot package writes are disabled. Enable the explicit local-package write gate before assembling a publisher package."]);
  }

  const packageRootValue = process.env.LIVING_TEXTBOOOK_LOCAL_PACKAGE_ROOT?.trim();
  const approvedAssetRootValue = process.env.LIVING_TEXTBOOOK_APPROVED_ASSET_ROOT?.trim();
  if (!packageRootValue) return blocked(["Local pilot package assembly requires an explicit package root."]);
  if (!approvedAssetRootValue) return blocked(["Local pilot package assembly requires an explicit approved asset root."]);
  const printBaseUrlResult = readPrintBaseUrl();
  if (!printBaseUrlResult.valid) return blocked([printBaseUrlResult.error]);

  const packageRoot = resolve(packageRootValue);
  const approvedAssetRoot = resolve(approvedAssetRootValue);
  const directory = resolve(packageRoot, safeSegment(input.manifest.tenantId), safeSegment(input.manifest.packageId), safeSegment(input.manifest.version));
  const relativeDirectory = relative(packageRoot, directory).replaceAll("\\", "/");
  const pathErrors = validateDurableBackupPath(directory, packageRoot);
  if (pathErrors.length > 0) return blocked(pathErrors);

  try {
    await mkdir(packageRoot, { recursive: true });
    const rootErrors = validateDurableBackupFilesystemPath(join(packageRoot, "boundary-check"), packageRoot);
    if (rootErrors.length > 0) return blocked(rootErrors);
    const sourceErrors = validateQuarantineFilesystemPath(join(approvedAssetRoot, "boundary-check"), approvedAssetRootValue);
    if (sourceErrors.length > 0) return blocked(sourceErrors);
    const sourceFiles = buildSourceFilePlan(input.bundleManifest);
    const sourcePlanErrors = await validateSourceFilePlan(sourceFiles, approvedAssetRoot);
    if (sourcePlanErrors.length > 0) return blocked(sourcePlanErrors);
    if (await pathExists(directory)) return reconcileExistingPackage(directory, relativeDirectory, input);

    const parent = dirname(directory);
    await mkdir(parent, { recursive: true });
    const staging = join(parent, "." + safeSegment(input.manifest.version) + ".staging-" + randomUUID());
    const stagingErrors = validateDurableBackupPath(staging, packageRoot);
    if (stagingErrors.length > 0) return blocked(stagingErrors);
    await mkdir(staging, { recursive: false });
    try {
      for (const source of sourceFiles) {
        const destination = join(staging, source.destinationPath);
        await mkdir(dirname(destination), { recursive: true });
        await copyFile(join(approvedAssetRoot, source.sourcePath), destination);
      }
      const packageIndex = createPilotDeliveryPackageIndex({ manifest: input.manifest, receipt: input.receipt });
      const qrPrintSheet = await createQrPrintSheet(input, printBaseUrlResult.value);
      const record = createAssemblyRecord(input, [...generatedFiles, ...sourceFiles.map((source) => source.destinationPath)], sourceFiles.length, printBaseUrlResult.value);
      await writeJsonFile(join(staging, "metadata/delivery-package.json"), packageIndex);
      await writeJsonFile(join(staging, "metadata/delivery-manifest.json"), input.manifest);
      await writeJsonFile(join(staging, "metadata/release-receipt.json"), input.receipt);
      await writeJsonFile(join(staging, "metadata/local-bundle-manifest.json"), input.bundleManifest);
      await writeJsonFile(join(staging, "metadata/route-map.json"), { routes: input.bundleManifest.routes, sideEffect: "local-package-assembly" });
      await writeJsonFile(join(staging, "metadata/game-map.json"), { gameRoutePaths: input.packageIndex.gameRoutePaths, sideEffect: "local-package-assembly" });
      await writeJsonFile(join(staging, "metadata/qr-print-sheet.json"), qrPrintSheet.manifest);
      await writeFile(join(staging, "metadata/qr-print-sheet.html"), qrPrintSheet.html, { encoding: "utf8", flag: "wx" });
      await writeJsonFile(join(staging, "metadata/assembly-record.json"), record);
      await verifyStagedPackage(staging, input, record, sourceFiles, qrPrintSheet);
      try {
        await rename(staging, directory);
      } catch {
        if (await pathExists(directory)) return reconcileExistingPackage(directory, relativeDirectory, input);
        throw new Error("Local pilot package staging directory could not be committed.");
      }
      return { status: "accepted", idempotent: false, relativeDirectory, files: record.files, copiedAssetCount: sourceFiles.length, errors: [] };
    } catch (error) {
      await rm(staging, { recursive: true, force: true }).catch(() => undefined);
      if (error instanceof Error && error.message === "Local pilot package staging directory could not be committed.") throw error;
      return blocked(["Local pilot package could not pass staged copy or read-back verification."]);
    }
  } catch {
    return blocked(["Local pilot package could not be assembled inside the configured package root."]);
  }
}

function validateAssemblyInput(input: LocalPilotPackageAssemblyInput): string[] {
  const errors = [
    ...validatePilotDeliveryManifest(input.manifest),
    ...validatePilotDeliveryReleaseReceipt(input.receipt),
    ...validatePilotDeliveryPackageIndex(input.packageIndex),
    ...validateLocalBundleManifest(input.bundleManifest).errors,
  ];
  errors.push(...evaluateLocalBundleAssetEvidenceSet(input.bundleManifest.assets).blockers);
  if (input.manifest.status !== "ready-for-manual-release" || !input.manifest.deliveryAllowed) errors.push("Local pilot package assembly requires an approved delivery manifest.");
  if (input.receipt.status !== "manual-release-approved" || !input.receipt.deliveryAllowed) errors.push("Local pilot package assembly requires an approved manual release receipt.");
  if (input.packageIndex.releaseStatus !== "manual-release-approved") errors.push("Local pilot package assembly requires a manually approved package index.");
  if (!input.manifest.qrPrintAllowed || !input.receipt.qrPrintAllowed) errors.push("Local pilot package assembly requires explicit QR print authorization.");
  if (input.manifest.qrAliasPaths.length === 0 || input.manifest.qrAliasPaths.length !== input.manifest.localFallbackPaths.length) errors.push("Approved QR aliases and local fallback paths must be non-empty and aligned.");
  for (const aliasPath of input.manifest.qrAliasPaths) {
    if (!isSafeQrAliasPath(aliasPath)) errors.push("Approved QR aliases must remain stable internal /q/ paths.");
  }
  for (const fallbackPath of input.manifest.localFallbackPaths) {
    if (!isSafeInternalPath(fallbackPath)) errors.push("Approved QR fallback paths must remain safe internal application paths.");
  }
  if (input.manifest.mode !== "closed-local" && input.manifest.mode !== "hybrid") errors.push("Local pilot package assembly supports only closed-local or hybrid delivery modes.");
  const gates = input.manifest.gates;
  if (!gates.sourceReview || !gates.packageReadiness || !gates.multimediaRights || !gates.gameAudio || !gates.qrRegistry || !gates.qrPrintAuthorization || !gates.localBundle || !gates.teacherPolicy || !gates.releaseApproval) {
    errors.push("Local pilot package assembly requires source, package, multimedia, game-audio, QR, local-bundle, teacher-policy, and release gates.");
  }
  if (!input.bundleManifest.offline_ready) errors.push("Local pilot package assembly requires an offline-ready bundle manifest.");
  if (input.bundleManifest.tenant_id !== input.manifest.tenantId) errors.push("Local bundle tenant does not match the approved delivery manifest.");
  if (input.bundleManifest.version !== input.manifest.version) errors.push("Local bundle version does not match the approved delivery manifest.");
  if (input.bundleManifest.requires_hosted_redirect) errors.push("Offline-ready local packages cannot require a hosted redirect.");
  if (!isSafeSegment(input.operatorId)) errors.push("Local pilot package assembly requires a bounded operator identity.");
  if (!isIsoTimestamp(input.writtenAt)) errors.push("Local pilot package assembly requires a valid write timestamp.");
  const expectedIndex = createPilotDeliveryPackageIndex({ manifest: input.manifest, receipt: input.receipt });
  if (stableJson(expectedIndex) !== stableJson(input.packageIndex)) errors.push("Local package index does not match the approved manifest and receipt.");
  return [...new Set(errors)];
}

function readPrintBaseUrl(): { valid: true; value: string } | { valid: false; error: string } {
  const configured = process.env.LIVING_TEXTBOOOK_PILOT_PRINT_BASE_URL?.trim();
  if (!configured) return { valid: false, error: "Local pilot package assembly requires an explicit print base URL for QR encoding." };
  try {
    const parsed = new URL(configured);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return { valid: false, error: "Pilot print base URL must use http or https." };
    if (parsed.username || parsed.password || parsed.search || parsed.hash) return { valid: false, error: "Pilot print base URL cannot contain credentials, query parameters, or fragments." };
    return { valid: true, value: parsed.toString().replace(/\/$/, "") };
  } catch {
    return { valid: false, error: "Pilot print base URL must be a valid absolute URL." };
  }
}

interface SourceFilePlan { sourcePath: string; destinationPath: string; }

function buildSourceFilePlan(bundle: LocalBundleManifest): SourceFilePlan[] {
  const paths = new Set<string>([bundle.content_package_path]);
  for (const asset of bundle.assets) {
    paths.add(asset.local_path);
    if (asset.poster_path) paths.add(asset.poster_path);
    if (asset.transcript_path) paths.add(asset.transcript_path);
  }
  return [...paths].map((path) => ({ sourcePath: path, destinationPath: path }));
}

async function validateSourceFilePlan(plan: SourceFilePlan[], approvedRoot: string): Promise<string[]> {
  const errors: string[] = [];
  for (const item of plan) {
    if (!isSafeRelativePath(item.sourcePath)) {
      errors.push("Local package source path " + item.sourcePath + " is not safe and relative.");
      continue;
    }
    const sourcePath = resolve(approvedRoot, item.sourcePath);
    errors.push(...validateQuarantineFilesystemPath(sourcePath, approvedRoot).map((error) => item.sourcePath + ": " + error));
    try {
      if (!(await stat(sourcePath)).isFile()) errors.push("Local package source path " + item.sourcePath + " must be a file.");
    } catch {
      errors.push("Local package source path " + item.sourcePath + " does not exist in the approved asset root.");
    }
  }
  return [...new Set(errors)];
}

interface QrPrintEntry {
  printedQrId: string;
  aliasPath: string;
  encodedUrl: string;
  fallbackPath: string;
  svg: string;
}

interface QrPrintManifest {
  artifactVersion: 1;
  packageId: string;
  version: string;
  baseUrl: string;
  printAuthorized: true;
  entries: QrPrintEntry[];
  sideEffect: "local-package-assembly";
}

interface QrPrintSheet {
  manifest: QrPrintManifest;
  html: string;
}

async function createQrPrintSheet(input: LocalPilotPackageAssemblyInput, baseUrl: string): Promise<QrPrintSheet> {
  const entries = await Promise.all(input.manifest.qrAliasPaths.map(async (aliasPath, index) => {
    const encodedUrl = new URL(aliasPath, baseUrl).toString();
    const svg = await QRCode.toString(encodedUrl, { type: "svg", errorCorrectionLevel: "M", margin: 2, width: 260 });
    return {
      printedQrId: input.bundleManifest.routes[index]?.qr_id ?? "qr-" + String(index + 1),
      aliasPath,
      encodedUrl,
      fallbackPath: input.manifest.localFallbackPaths[index],
      svg,
    };
  }));
  const manifest: QrPrintManifest = {
    artifactVersion: 1,
    packageId: input.manifest.packageId,
    version: input.manifest.version,
    baseUrl,
    printAuthorized: true,
    entries,
    sideEffect: "local-package-assembly",
  };
  const htmlEntries = entries.map((entry) => [
    "<article class=\"qr-card\">",
    "<h2>" + htmlEscape(entry.printedQrId) + "</h2>",
    "<p>Scan to open the approved Living Textbook route.</p>",
    "<div class=\"qr\" role=\"img\" aria-label=\"QR code for " + htmlEscape(entry.printedQrId) + "\">" + entry.svg + "</div>",
    "<p class=\"url\">" + htmlEscape(entry.encodedUrl) + "</p>",
    "<p class=\"fallback\">Local fallback: " + htmlEscape(entry.fallbackPath) + "</p>",
    "</article>",
  ].join("")).join("\n");
  const html = "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>" +
    htmlEscape(input.manifest.packageId + " QR print sheet " + input.manifest.version) +
    "</title><style>body{font-family:Arial,sans-serif;margin:24px;color:#111}h1{font-size:20px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}.qr-card{break-inside:avoid;border:1px solid #bbb;padding:18px}.qr{text-align:center;background:#fff;padding:8px}.qr svg{max-width:260px;width:100%;height:auto}.url,.fallback{font:12px monospace;overflow-wrap:anywhere}@media print{body{margin:10mm}.grid{gap:10mm}.qr-card{border-color:#888}}</style></head><body><h1>Living Textbook QR print sheet</h1><p>Package: " +
    htmlEscape(input.manifest.packageId) + " | Version: " + htmlEscape(input.manifest.version) + "</p><div class=\"grid\">" + htmlEntries + "</div></body></html>";
  return { manifest, html };
}

function htmlEscape(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}

async function verifyStagedPackage(staging: string, input: LocalPilotPackageAssemblyInput, record: AssemblyRecord, sourceFiles: SourceFilePlan[], expectedQrPrintSheet?: QrPrintSheet): Promise<void> {
  const packageIndex = JSON.parse(await readFile(join(staging, "metadata/delivery-package.json"), "utf8")) as unknown;
  const manifest = JSON.parse(await readFile(join(staging, "metadata/delivery-manifest.json"), "utf8")) as unknown;
  const receipt = JSON.parse(await readFile(join(staging, "metadata/release-receipt.json"), "utf8")) as unknown;
  const bundle = JSON.parse(await readFile(join(staging, "metadata/local-bundle-manifest.json"), "utf8")) as unknown;
  const qrPrintManifest = JSON.parse(await readFile(join(staging, "metadata/qr-print-sheet.json"), "utf8")) as QrPrintManifest;
  const qrPrintHtml = await readFile(join(staging, "metadata/qr-print-sheet.html"), "utf8");
  const errors = [...validatePilotDeliveryPackageIndex(packageIndex), ...validatePilotDeliveryManifest(manifest), ...validatePilotDeliveryReleaseReceipt(receipt), ...validateLocalBundleManifest(bundle).errors];
  if (stableJson(packageIndex) !== stableJson(input.packageIndex) || stableJson(manifest) !== stableJson(input.manifest) || stableJson(receipt) !== stableJson(input.receipt) || stableJson(bundle) !== stableJson(input.bundleManifest)) errors.push("Local package metadata read-back does not match the approved inputs.");
  const storedRecord = JSON.parse(await readFile(join(staging, "metadata/assembly-record.json"), "utf8")) as AssemblyRecord;
  errors.push(...validateAssemblyRecord(storedRecord, record));
  const printBaseUrl = readPrintBaseUrl();
  if (!printBaseUrl.valid) errors.push(printBaseUrl.error);
  else {
    const recomputedQrPrintSheet = await createQrPrintSheet(input, printBaseUrl.value);
    if (stableJson(qrPrintManifest) !== stableJson(recomputedQrPrintSheet.manifest)) errors.push("Local package QR print manifest read-back does not match the approved QR map.");
    if (qrPrintHtml !== recomputedQrPrintSheet.html) errors.push("Local package QR print sheet HTML read-back does not match the approved QR map.");
    if (expectedQrPrintSheet && (stableJson(qrPrintManifest) !== stableJson(expectedQrPrintSheet.manifest) || qrPrintHtml !== expectedQrPrintSheet.html)) errors.push("Local package QR print artifact does not match the staged artifact.");
  }
  for (const source of sourceFiles) {
    const expected = input.bundleManifest.assets.find((asset) => asset.local_path === source.sourcePath)?.checksum;
    if (!expected || expected === "sha256-placeholder-not-ready") continue;
    const actual = "sha256-" + createHash("sha256").update(await readFile(join(staging, source.destinationPath))).digest("hex");
    if (actual !== expected) errors.push("Local package checksum mismatch for " + source.sourcePath + ".");
  }
  if (errors.length > 0) throw new Error(errors.join(" "));
}

async function reconcileExistingPackage(directory: string, relativeDirectory: string, input: LocalPilotPackageAssemblyInput): Promise<LocalPilotPackageAssemblyResult> {
  try {
    const record = JSON.parse(await readFile(join(directory, "metadata/assembly-record.json"), "utf8")) as AssemblyRecord;
    const sourceFiles = buildSourceFilePlan(input.bundleManifest);
    const expectedFiles = [...generatedFiles, ...sourceFiles.map((source) => source.destinationPath)];
    const printBaseUrl = readPrintBaseUrl();
    if (!printBaseUrl.valid) return blocked([printBaseUrl.error]);
    const errors = validateAssemblyRecord(record, createAssemblyRecord(input, expectedFiles, sourceFiles.length, printBaseUrl.value));
    if (errors.length === 0) {
      await verifyStagedPackage(directory, input, record, sourceFiles);
      return { status: "accepted", idempotent: true, relativeDirectory, files: record.files, copiedAssetCount: record.copiedAssetCount, errors: [] };
    }
    return { status: "conflict", idempotent: false, relativeDirectory, files: record.files ?? [], copiedAssetCount: record.copiedAssetCount ?? 0, errors: ["A different or incomplete immutable local package already exists for this tenant, package, and version."] };
  } catch {
    return { status: "conflict", idempotent: false, relativeDirectory, files: [], copiedAssetCount: 0, errors: ["A different or incomplete immutable local package already exists for this tenant, package, and version."] };
  }
}

function createAssemblyRecord(input: LocalPilotPackageAssemblyInput, files: string[], copiedAssetCount: number, qrPrintBaseUrl: string): AssemblyRecord {
  return { recordVersion: 1, tenantId: input.manifest.tenantId, packageId: input.manifest.packageId, bundleId: input.bundleManifest.bundle_id, version: input.manifest.version, manifestId: input.manifest.manifestId, receiptId: input.receipt.receiptId, sourceAssemblyChecksum: input.manifest.sourceAssemblyChecksum, operatorId: input.operatorId, writtenAt: input.writtenAt, qrPrintBaseUrl, files: [...files], copiedAssetCount, publisherPayloadIncluded: true, learnerRecordsIncluded: false, sideEffect: "local-package-assembly" };
}

function validateAssemblyRecord(value: AssemblyRecord, expected: AssemblyRecord): string[] {
  const errors: string[] = [];
  if (!value || value.recordVersion !== 1 || value.publisherPayloadIncluded !== true || value.learnerRecordsIncluded !== false || value.sideEffect !== "local-package-assembly") errors.push("Local package assembly record has an unsafe marker.");
  if (stableJson(value) !== stableJson(expected)) errors.push("Local package assembly record does not match the approved assembly.");
  return errors;
}

async function writeJsonFile(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(value, null, 2) + "\n", { encoding: "utf8", flag: "wx" });
}

async function pathExists(path: string): Promise<boolean> {
  try { await stat(path); return true; } catch { return false; }
}

function blocked(errors: string[]): LocalPilotPackageAssemblyResult {
  return { status: "blocked", idempotent: false, relativeDirectory: null, files: [], copiedAssetCount: 0, errors: [...new Set(errors)] };
}

function safeSegment(value: string): string { return value.replaceAll(/[^A-Za-z0-9._-]+/g, "-").slice(0, 160) || "unknown"; }
function isSafeSegment(value: string): boolean { return typeof value === "string" && value.length > 0 && value.length <= 160 && /^[A-Za-z0-9._-]+$/.test(value); }
function isIsoTimestamp(value: string): boolean { return typeof value === "string" && !Number.isNaN(Date.parse(value)); }
function isSafeRelativePath(value: string): boolean { return Boolean(value) && !value.includes("\\") && !value.startsWith("/") && !/^[A-Za-z]:/.test(value) && !value.split("/").some((segment) => segment === "" || segment === "." || segment === ".."); }
function isSafeQrAliasPath(value: string): boolean { return isSafeInternalPath(value) && value.startsWith("/q/"); }
function isSafeInternalPath(value: string): boolean { return Boolean(value) && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\") && !value.includes("..") && !/^\/(?:\/|.*(?:https?:|file:|localhost|127\.0\.0\.1))/i.test(value); }
function stableJson(value: unknown): string { if (Array.isArray(value)) return "[" + value.map(stableJson).join(",") + "]"; if (!value || typeof value !== "object") return JSON.stringify(value); return "{" + Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, child]) => JSON.stringify(key) + ":" + stableJson(child)).join(",") + "}"; }
