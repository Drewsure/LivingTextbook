import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("..", import.meta.url));
const output = mkdtempSync(join(tmpdir(), "living-textbook-media-binding-"));
const source = readFileSync(join(root, "packages", "content-model", "src", "localBundleMediaEvidenceBinding.ts"), "utf8");
writeFileSync(join(output, "localBundleMediaEvidenceBinding.js"), ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, "utf8");

try {
  const { validateLocalBundleMediaEvidenceBinding } = require(join(output, "localBundleMediaEvidenceBinding.js"));
  const binding = {
    bindingId: "binding-1", manifestId: "manifest-1", tenantId: "tenant-1", bundleId: "bundle-1", packageId: "package-1", packageVersion: "2026.1", storageSelectionPreflightId: "storage-preflight-1", storageSelectionGateId: "storage-gate-1", storageSelectionStatus: "blocked", storageSelectionAllowed: false, mode: "review-only", status: "blocked",
    assets: [
      { assetId: "audio", label: "Audio", kind: "audio", relativePath: "media/audio.mp3", sourceRef: "source", rightsStatus: "unknown", rightsEvidenceRef: "rights", checksum: "missing", scanStatus: "pending", targetMappingReviewed: false, transcriptOrCaptionRef: "transcript.txt", posterRef: null, altTextReady: true, localEligibility: "blocked", blockers: ["review"] },
      { assetId: "video", label: "Video", kind: "video", relativePath: "media/video.mp4", sourceRef: "source", rightsStatus: "unknown", rightsEvidenceRef: "rights", checksum: "missing", scanStatus: "pending", targetMappingReviewed: false, transcriptOrCaptionRef: "captions.vtt", posterRef: "poster.jpg", altTextReady: true, localEligibility: "blocked", blockers: ["review"] },
      { assetId: "image", label: "Image", kind: "image", relativePath: "media/image.png", sourceRef: "source", rightsStatus: "unknown", rightsEvidenceRef: "rights", checksum: "missing", scanStatus: "pending", targetMappingReviewed: false, transcriptOrCaptionRef: null, posterRef: null, altTextReady: false, localEligibility: "blocked", blockers: ["review"] },
    ],
    assetCopyAllowed: false, packageWriteAllowed: false, studentFacingAllowed: false, localActivationAllowed: false,
    blockedActions: ["file-upload", "media-copy", "package-write", "local-activation", "student-promotion", "qr-mutation"], sideEffect: "none",
  };
  assert(validateLocalBundleMediaEvidenceBinding(binding).length === 0, "complete media evidence binding must validate");
  assert(validateLocalBundleMediaEvidenceBinding({ ...binding, storageSelectionGateId: "" }).some((error) => error.includes("storageSelectionGateId")), "media evidence must carry storage gate identity");
  assert(validateLocalBundleMediaEvidenceBinding({ ...binding, storageSelectionAllowed: true }).some((error) => error.includes("storageSelectionAllowed: false")), "media evidence storage selection must remain disallowed");
  assert(validateLocalBundleMediaEvidenceBinding({ ...binding, assets: binding.assets.map((asset) => asset.assetId === "video" ? { ...asset, relativePath: "file:///unsafe" } : asset) }).some((error) => error.includes("safe relative path")), "unsafe media paths must be rejected");
  assert(validateLocalBundleMediaEvidenceBinding({ ...binding, assetCopyAllowed: true }).some((error) => error.includes("assetCopyAllowed: false")), "media copy must remain blocked");
  assert(validateLocalBundleMediaEvidenceBinding({ ...binding, assets: binding.assets.map((asset) => asset.assetId === "audio" ? { ...asset, transcriptOrCaptionRef: null } : asset) }).some((error) => error.includes("audio asset")), "audio transcript evidence must be required");
  assert(validateLocalBundleMediaEvidenceBinding({ ...binding, assets: binding.assets.map((asset) => asset.assetId === "image" ? { ...asset, altTextReady: undefined } : asset) }).some((error) => error.includes("alt-text readiness state")), "image alt-text state must be explicit");
  console.log("PASS local media evidence binding preserves rights, checksum, accessibility, path, and no-copy boundaries.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
