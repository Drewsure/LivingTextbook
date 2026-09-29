import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const workspace = mkdtempSync(join(tmpdir(), "living-textbook-local-pilot-assembler-"));
const compiledRoot = join(workspace, "compiled");
const packageRoot = join(workspace, "packages");
const assetRoot = join(workspace, "approved-assets");
const failures = [];

try {
  compileSources();
  const { assembleLocalPilotPackage } = require(join(compiledRoot, "apps", "web", "src", "server", "delivery", "localPilotPackageAssembler.js"));
  const { readLocalPilotPackageRuntime } = require(join(compiledRoot, "apps", "web", "src", "server", "delivery", "localPilotPackageRuntimeReader.js"));
  const { createPilotDeliveryPackageIndex, createPilotDeliveryReleaseReceipt } = require(join(compiledRoot, "packages", "content-model", "src", "index.js"));
  const input = createFixture({ createPilotDeliveryPackageIndex, createPilotDeliveryReleaseReceipt });
  const environment = {
    LIVING_TEXTBOOOK_LOCAL_PACKAGE_WRITES_ENABLED: "true",
    LIVING_TEXTBOOOK_LOCAL_PACKAGE_READS_ENABLED: "true",
    LIVING_TEXTBOOOK_LOCAL_PACKAGE_ROOT: packageRoot,
    LIVING_TEXTBOOOK_APPROVED_ASSET_ROOT: assetRoot,
    LIVING_TEXTBOOOK_PILOT_PRINT_BASE_URL: "https://pilot.example.test",
  };
  const previousEnvironment = new Map(Object.keys(environment).map((name) => [name, process.env[name]]));
  try {
    applyEnvironment(environment);
    const first = await assembleLocalPilotPackage(input);
    assert(first.status === "accepted" && first.idempotent === false, "approved local package must assemble once");
    assert(first.copiedAssetCount === 3, "assembler must copy content, media, and transcript evidence");
    const assembledDirectory = join(packageRoot, "tenant-one", "package-one", "1.0.0");
    assert(existsSync(join(assembledDirectory, "metadata/qr-print-sheet.json")), "assembler must write a QR print manifest");
    assert(existsSync(join(assembledDirectory, "metadata/qr-print-sheet.html")), "assembler must write a printable QR sheet");
    assert(existsSync(join(assembledDirectory, "metadata/assembly-record.json")), "assembler must write an assembly record");
    const qrManifest = JSON.parse(readFileSync(join(assembledDirectory, "metadata/qr-print-sheet.json"), "utf8"));
    assert(qrManifest.printAuthorized === true, "QR print manifest must preserve print authorization");
    assert(qrManifest.entries.length === 1, "QR print manifest must contain the approved route count");
    assert(qrManifest.entries[0].encodedUrl === "https://pilot.example.test/q/tenant-one/unit-one", "QR print URL must use the configured safe base URL");
    assert(qrManifest.entries[0].fallbackPath === "/launch/unit-1", "QR print entry must preserve the local fallback path");
    assert(qrManifest.entries[0].svg.includes("<svg"), "QR print manifest must contain generated SVG evidence");
    const qrHtml = readFileSync(join(assembledDirectory, "metadata/qr-print-sheet.html"), "utf8");
    assert(qrHtml.includes("https://pilot.example.test/q/tenant-one/unit-one") && qrHtml.includes("<svg"), "printable QR HTML must contain the approved alias and SVG");
    const runtime = await readLocalPilotPackageRuntime({ tenantId: "tenant-one", packageId: "package-one", version: "1.0.0" });
    assert(runtime.status === "available", "assembled local package must be readable through the runtime reader");
    if (runtime.status === "available") {
      assert(runtime.summary.routes[0]?.localFallbackPath === "/launch/unit-1", "runtime reader must preserve the QR local fallback path");
      assert(runtime.summary.qrPrintArtifactReady === true, "runtime reader must expose the verified QR artifact state");
      assert(runtime.summary.learnerRecordsIncluded === false, "runtime reader must preserve the learner-record privacy boundary");
    }
    const unsafeIdentity = await readLocalPilotPackageRuntime({ tenantId: "../tenant-one", packageId: "package-one", version: "1.0.0" });
    assert(unsafeIdentity.status === "blocked", "runtime reader must reject traversal identities");
    const second = await assembleLocalPilotPackage(input);
    assert(second.status === "accepted" && second.idempotent === true, "exact local package replay must be idempotent");

    process.env.LIVING_TEXTBOOOK_LOCAL_PACKAGE_READS_ENABLED = "false";
    const disabledRead = await readLocalPilotPackageRuntime({ tenantId: "tenant-one", packageId: "package-one", version: "1.0.0" });
    assert(disabledRead.status === "blocked" && disabledRead.errors.some((error) => error.includes("reads are disabled")), "local package reads must remain fail-closed by default");

    process.env.LIVING_TEXTBOOOK_LOCAL_PACKAGE_WRITES_ENABLED = "false";
    const disabled = await assembleLocalPilotPackage(input);
    assert(disabled.status === "blocked" && disabled.errors.some((error) => error.includes("writes are disabled")), "local package writes must remain fail-closed by default");

    applyEnvironment({ ...environment, LIVING_TEXTBOOOK_PILOT_PRINT_BASE_URL: "file:///unsafe" });
    const unsafePrintUrl = await assembleLocalPilotPackage(input);
    assert(unsafePrintUrl.status === "blocked" && unsafePrintUrl.errors.some((error) => error.includes("http or https")), "QR printing must reject non-web base URLs");
  } finally {
    for (const [name, value] of previousEnvironment) restoreEnvironment(name, value);
  }
} catch (error) {
  failures.push(`Local package assembler behavior harness failed: ${error instanceof Error ? error.message : String(error)}`);
} finally {
  rmSync(workspace, { recursive: true, force: true });
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exitCode = 1;
} else {
  console.log("PASS local pilot package assembly and runtime reading prove approved QR print output, local fallback mapping, idempotence, privacy, and fail-closed write/read/base-URL gates.");
}

function compileSources() {
  mkdirSync(compiledRoot, { recursive: true });
  writeFileSync(join(compiledRoot, "package.json"), '{"type":"commonjs"}\n', "utf8");
  const tsc = join(root, "node_modules", "typescript", "bin", "tsc");
  const compile = spawnSync(process.execPath, [
    tsc,
    "--module", "commonjs",
    "--target", "ES2022",
    "--moduleResolution", "node",
    "--resolveJsonModule",
    "--esModuleInterop",
    "--skipLibCheck",
    "--noCheck",
    "--rootDir", root,
    "--outDir", compiledRoot,
    "apps/web/src/server/delivery/localPilotPackageAssembler.ts",
    "apps/web/src/server/delivery/localPilotPackageRuntimeReader.ts",
    "apps/web/src/server/persistence/backupPathPolicy.ts",
    "apps/web/src/server/uploads/quarantinePathPolicy.ts",
    "packages/content-model/src/index.ts",
  ], { cwd: root, encoding: "utf8" });
  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    throw new Error("TypeScript compilation failed.");
  }
  normalizeCompiledExtensions(compiledRoot);
  const contentModelPackage = join(compiledRoot, "node_modules", "@living-textbook", "content-model");
  mkdirSync(contentModelPackage, { recursive: true });
  writeFileSync(join(contentModelPackage, "package.json"), JSON.stringify({
    name: "@living-textbook/content-model",
    main: "../../../packages/content-model/src/index.js",
    type: "commonjs",
  }), "utf8");
  const qrCodePackage = join(compiledRoot, "node_modules", "qrcode");
  mkdirSync(qrCodePackage, { recursive: true });
  writeFileSync(join(qrCodePackage, "package.json"), JSON.stringify({
    name: "qrcode",
    main: join(root, "node_modules", "qrcode", "lib", "index.js"),
    type: "commonjs",
  }), "utf8");
}

function normalizeCompiledExtensions(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) normalizeCompiledExtensions(path);
    else if (entry.isFile() && entry.name.endsWith(".js")) {
      const source = readFileSync(path, "utf8");
      const normalized = source.replace(/require\("(\.[^"]+)\.ts"\)/g, 'require("$1.js")');
      if (normalized !== source) writeFileSync(path, normalized, "utf8");
    }
  }
}

function createFixture({ createPilotDeliveryPackageIndex, createPilotDeliveryReleaseReceipt }) {
  mkdirSync(join(assetRoot, "content", "transcripts"), { recursive: true });
  mkdirSync(join(assetRoot, "media"), { recursive: true });
  writeFileSync(join(assetRoot, "content", "package.json"), '{"tenant":"tenant-one","unit":"unit-1"}\n', "utf8");
  writeFileSync(join(assetRoot, "content", "transcripts", "greetings.en.txt"), "Hello, friend.\n", "utf8");
  writeFileSync(join(assetRoot, "media", "greetings.mp3"), "approved-audio-fixture\n", "utf8");
  const audioChecksum = "sha256-" + createHash("sha256").update(readFileSync(join(assetRoot, "media", "greetings.mp3"))).digest("hex");
  const manifest = {
    manifestId: "manifest-one",
    tenantId: "tenant-one",
    packageId: "package-one",
    version: "1.0.0",
    mode: "closed-local",
    sourceAssemblyChecksum: "sha256:" + "b".repeat(64),
    status: "ready-for-manual-release",
    contentPackagePath: "/packages/package-one/content/package.json",
    gameRoutePaths: ["/games/flashcards"],
    mediaKinds: ["audio"],
    qrAliasPaths: ["/q/tenant-one/unit-one"],
    localFallbackPaths: ["/launch/unit-1"],
    hostedPersistence: "not-selected",
    hostedPersistenceDecisionPacketId: null,
    gates: {
      sourceReview: true,
      packageReadiness: true,
      multimediaRights: true,
      gameAudio: true,
      qrRegistry: true,
      qrPrintAuthorization: true,
      localBundle: true,
      hostedPersistence: false,
      teacherPolicy: true,
      releaseApproval: true,
    },
    unresolvedRequirements: [],
    blockedActions: ["No package writer execution without manual release approval"],
    deliveryAllowed: true,
    qrPrintAllowed: true,
    studentFacingActivationAllowed: false,
    sideEffect: "none",
  };
  const receipt = createPilotDeliveryReleaseReceipt({
    manifest,
    reviewerId: "reviewer-one",
    reviewerRole: "school-admin",
    reviewedAt: "2026-09-30T00:00:00.000Z",
    releaseApproval: "approved",
    qrPrintAuthorization: "approved",
    rollbackReference: "rollback-one",
  });
  const packageIndex = createPilotDeliveryPackageIndex({ manifest, receipt });
  const bundleManifest = {
    bundle_id: "bundle-one",
    tenant_id: "tenant-one",
    curriculum_id: "curriculum-one",
    series_id: "series-one",
    book_id: "book-one",
    unit_ids: ["unit-1"],
    version: "1.0.0",
    created_at: "2026-09-30T00:00:00.000Z",
    content_package_path: "content/package.json",
    media_root: "media/",
    offline_ready: true,
    requires_hosted_redirect: false,
    cache_policy: {
      mode: "offline-ready",
      version: "1.0.0",
      cache_name: "living-textbook-bundle-one-v1.0.0",
      allowed_route_prefixes: ["/launch"],
      precache_asset_kinds: ["audio"],
      student_data_mode: "excluded",
      background_sync: false,
    },
    assets: [{
      asset_id: "greetings-audio",
      unit_id: "unit-1",
      kind: "audio",
      local_path: "media/greetings.mp3",
      checksum: audioChecksum,
      rights_status: "owned",
      scan_status: "passed",
      target_mapping_reviewed: true,
      transcript_path: "content/transcripts/greetings.en.txt",
    }],
    routes: [{
      qr_id: "qr-unit-1",
      unit_id: "unit-1",
      target_type: "unit-launch",
      target_id: "unit-1",
      local_fallback_path: "/launch/unit-1",
    }],
  };
  return {
    manifest,
    receipt,
    packageIndex,
    bundleManifest,
    reviewPacketBinding: {
      recordVersion: 1,
      tenantId: "tenant-one",
      quarantineId: "quarantine-one",
      packetId: "packet-one",
      packageId: "package-one",
      sourceChecksumSha256: "b".repeat(64),
      status: "ready-for-next-gate",
    },
    operatorId: "operator-one",
    writtenAt: "2026-09-30T00:00:00.000Z",
  };
}

function applyEnvironment(values) {
  for (const [name, value] of Object.entries(values)) process.env[name] = value;
}

function restoreEnvironment(name, value) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}
