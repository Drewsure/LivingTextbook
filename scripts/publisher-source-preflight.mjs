import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const model = await import(pathToFileURL(fileURLToPath(new URL("../packages/content-model/src/publisherSourcePackagePreflight.ts", import.meta.url))).href);

if (process.argv.includes("--self-test")) {
  await runSelfTest();
  process.exit(0);
}

const sourceDirectory = process.env.LIVING_TEXTBOOOK_PUBLISHER_SOURCE_DIRECTORY?.trim();
const outputPath = process.env.LIVING_TEXTBOOOK_PUBLISHER_PREFLIGHT_OUTPUT?.trim();
if (!sourceDirectory) {
  console.error("FAIL Set LIVING_TEXTBOOOK_PUBLISHER_SOURCE_DIRECTORY or run with --self-test.");
  process.exit(1);
}

const report = await preflightDirectory(resolve(sourceDirectory));
if (outputPath) {
  await mkdir(dirname(resolve(outputPath)), { recursive: true });
  await writeFile(resolve(outputPath), `${JSON.stringify(report, null, 2)}\n`, "utf8");
}
console.log(JSON.stringify({ reportId: report.reportId, inventoryStatus: report.inventoryStatus, counts: report.counts, blockers: report.blockers, outputPath: outputPath ? resolve(outputPath) : null }, null, 2));
process.exit(report.inventoryStatus === "complete" ? 0 : 2);

async function preflightDirectory(root) {
  const manifestPath = join(root, "publisher-source-manifest.json");
  let manifest;
  let manifestBytes;
  try {
    manifestBytes = await readFile(manifestPath);
    manifest = JSON.parse(manifestBytes.toString("utf8"));
  } catch {
    throw new Error(`Publisher source directory must contain publisher-source-manifest.json: ${manifestPath}`);
  }
  const manifestErrors = model.validatePublisherSourcePackageManifest(manifest);
  if (manifestErrors.length > 0) {
    const report = model.createPublisherSourcePackagePreflightReport({ manifest: normalizeManifest(manifest), observedFiles: [], manifestChecksumSha256: checksum(manifestBytes), inventoryChecksumSha256: checksum(Buffer.from("", "utf8")) });
    report.blockers.unshift(...manifestErrors.filter((error) => !report.blockers.includes(error)));
    report.inventoryStatus = "incomplete";
    return report;
  }
  const observedFiles = await scanDirectory(root, root, manifest.entries);
  return model.createPublisherSourcePackagePreflightReport({ manifest, observedFiles, manifestChecksumSha256: checksum(manifestBytes), inventoryChecksumSha256: inventoryChecksum(observedFiles) });
}

async function scanDirectory(root, directory, entries) {
  const observed = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolutePath = join(directory, entry.name);
    const relativePath = relative(root, absolutePath).replaceAll("\\", "/");
    if (relativePath === "publisher-source-manifest.json") continue;
    if (entry.isDirectory()) {
      observed.push(...await scanDirectory(root, absolutePath, entries));
      continue;
    }
    const declared = entries.find((item) => item.relativePath === relativePath);
    if (entry.isSymbolicLink()) {
      observed.push({ assetId: declared?.assetId, relativePath, exists: true, detectedType: "symbolic-link" });
      continue;
    }
    if (!entry.isFile()) continue;
    const fileStat = await stat(absolutePath);
    const bytes = await readFile(absolutePath);
    const checksumSha256 = `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
    observed.push({ assetId: declared?.assetId, relativePath, exists: true, sizeBytes: fileStat.size, checksumSha256, detectedType: mimeTypeFor(relativePath) });
  }
  return observed;
}

function mimeTypeFor(relativePath) {
  const extension = relativePath.toLowerCase().split(".").pop();
  return ({ pdf: "application/pdf", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", mp3: "audio/mpeg", wav: "audio/wav", mp4: "video/mp4", webm: "video/webm", txt: "text/plain", vtt: "text/vtt", srt: "application/x-subrip", ttf: "font/ttf", otf: "font/otf", woff: "font/woff", woff2: "font/woff2" })[extension] ?? "application/octet-stream";
}

function checksum(bytes) {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

function inventoryChecksum(observedFiles) {
  const canonicalInventory = observedFiles
    .map((file) => JSON.stringify({ assetId: file.assetId ?? null, relativePath: file.relativePath, exists: file.exists, sizeBytes: file.sizeBytes ?? null, checksumSha256: file.checksumSha256 ?? null, detectedType: file.detectedType ?? null }))
    .sort()
    .join("\n");
  return checksum(Buffer.from(canonicalInventory, "utf8"));
}

function normalizeManifest(value) {
  return { recordVersion: 1, manifestId: String(value?.manifestId ?? "invalid-manifest"), tenantId: String(value?.tenantId ?? "invalid-tenant"), packageId: String(value?.packageId ?? "invalid-package"), version: String(value?.version ?? "invalid-version"), entries: Array.isArray(value?.entries) ? value.entries : [], reviewOnly: true, quarantineWriteAllowed: false, packageAssemblyAllowed: false, studentFacingUseAllowed: false };
}

async function runSelfTest() {
  const root = await mkdtemp(join(tmpdir(), "living-textbook-publisher-source-preflight-"));
  try {
    const manifest = { recordVersion: 1, manifestId: "self-test-manifest", tenantId: "self-test-publisher", packageId: "self-test-package", version: "1.0.0", entries: [{ assetId: "source", kind: "textbook-source", relativePath: "unit-1/source.pdf", unitKey: "self-test:unit-1", acceptedTypes: ["application/pdf"], required: true }], reviewOnly: true, quarantineWriteAllowed: false, packageAssemblyAllowed: false, studentFacingUseAllowed: false };
    await mkdir(join(root, "unit-1"), { recursive: true });
    await writeFile(join(root, "publisher-source-manifest.json"), `${JSON.stringify(manifest)}\n`, "utf8");
    await writeFile(join(root, "unit-1", "source.pdf"), "publisher source fixture", "utf8");
    const complete = await preflightDirectory(root);
    const completeErrors = [...model.validatePublisherSourcePackageManifest(manifest), ...model.validatePublisherSourcePackagePreflightReport(complete)];
    if (complete.inventoryStatus !== "complete" || complete.counts.verified !== 1 || completeErrors.length > 0) throw new Error(`complete source fixture failed: ${JSON.stringify({ complete, completeErrors })}`);
    if (!/^sha256:[0-9a-f]{64}$/.test(complete.manifestChecksumSha256) || !/^sha256:[0-9a-f]{64}$/.test(complete.inventoryChecksumSha256)) throw new Error("complete source fixture did not produce stable manifest and inventory fingerprints");
    const tampered = model.validatePublisherSourcePackagePreflightReport({ ...complete, manifestChecksumSha256: "sha256:tampered" });
    if (!tampered.some((error) => error.includes("manifestChecksumSha256"))) throw new Error("tampered manifest fingerprint was not rejected");
    await writeFile(join(root, "unit-1", "unlisted.txt"), "unlisted", "utf8");
    const blocked = await preflightDirectory(root);
    if (blocked.inventoryStatus !== "incomplete" || blocked.counts.unlisted !== 1 || blocked.studentFacingUseAllowed !== false) throw new Error(`unlisted source fixture was not blocked: ${JSON.stringify(blocked)}`);
    if (blocked.inventoryChecksumSha256 === complete.inventoryChecksumSha256) throw new Error("inventory fingerprint did not change after an unlisted file was added");
    console.log("PASS publisher source preflight verifies declared files, checksums, supported types, and unlisted-file blocking without package side effects.");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}
