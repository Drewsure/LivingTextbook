import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-source-extraction-preview-"));
const source = readFileSync(join(root, "packages", "content-model", "src", "sourceExtractionPreview.ts"), "utf8");

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  writeFileSync(join(output, "sourceExtractionPreview.js"), ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, "utf8");
  const { createReviewOnlySourceExtractionPreview, validateSourceExtractionPreviewRequest } = require(join(output, "sourceExtractionPreview.js"));
  const fixture = {
    previewId: "preview-sample-publisher-l1-u1-routines-v1",
    tenantId: "sample-publisher",
    sourceId: "source-unit-1-pdf",
    targetPackageId: "sample-publisher-l1-u1-routines-package",
    sourceType: "pdf",
    sourceChecksum: `sha256:${"a".repeat(64)}`,
    extractionMethod: "pdf-text",
    candidateUnitKeys: ["sample-publisher:partner-textbook-companion:L1:U1"],
    segments: [
      { segmentId: "p1-s2", pageNumber: 1, sequence: 2, kind: "activity", unitKey: "sample-publisher:partner-textbook-companion:L1:U1", text: "  Wake up   early. " },
      { segmentId: "p1-s1", pageNumber: 1, sequence: 1, kind: "heading", unitKey: "sample-publisher:partner-textbook-companion:L1:U1", text: "Daily routines" },
    ],
    mode: "review-only",
  };
  const result = createReviewOnlySourceExtractionPreview(fixture);
  assert(result.valid, "valid extracted source preview must pass");
  assert(result.sideEffect === "none", "source extraction preview must have no side effect");
  assert(result.preview?.segments[0]?.segmentId === "p1-s1", "preview segments must sort deterministically");
  assert(result.preview?.segments[1]?.normalizedText === "Wake up early.", "preview must normalize whitespace without losing text");
  assert(result.preview?.studentFacingPayloadAllowed === false, "preview must block student payloads");
  assert(result.preview?.storageWriteAllowed === false, "preview must block storage writes");
  assert(result.preview?.unitSummaries[0]?.pageStart === 1 && result.preview?.unitSummaries[0]?.pageEnd === 1, "unit page summary must be derived");

  const aiResult = createReviewOnlySourceExtractionPreview({ ...fixture, extractionMethod: "ai-assisted" });
  assert(aiResult.valid && aiResult.warnings.some((warning) => warning.includes("reviewer suggestion")), "AI extraction must remain visibly review-only");
  const invalidChecksum = validateSourceExtractionPreviewRequest({ ...fixture, sourceChecksum: "sha256-placeholder" });
  assert(invalidChecksum.some((error) => error.includes("sha256:<64 hexadecimal characters>")), "invalid source checksum must be rejected");
  const duplicateOrder = validateSourceExtractionPreviewRequest({ ...fixture, segments: [fixture.segments[0], { ...fixture.segments[1], sequence: 2 }] });
  assert(duplicateOrder.some((error) => error.includes("order 1:2")), "duplicate page/order evidence must be rejected");
  const crossUnit = validateSourceExtractionPreviewRequest({ ...fixture, segments: [{ ...fixture.segments[0], unitKey: "other-tenant:book:L1:U1" }, fixture.segments[1]] });
  assert(crossUnit.some((error) => error.includes("undeclared candidate unit")), "undeclared unit mappings must be rejected");
  const emptyUnit = validateSourceExtractionPreviewRequest({ ...fixture, candidateUnitKeys: [...fixture.candidateUnitKeys, "sample-publisher:partner-textbook-companion:L1:U2"] });
  assert(emptyUnit.some((error) => error.includes("must have at least one segment")), "empty candidate units must be rejected");
  console.log("PASS source extraction preview preserves tenant/source/page/unit lineage and remains review-only with no storage or student-payload side effects.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}
