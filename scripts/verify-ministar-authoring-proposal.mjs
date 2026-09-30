import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-ministar-authoring-proposal-"));
const source = readFileSync(
  join(root, "apps", "web", "src", "data", "sampleMinistarUnitAuthoringProposal.ts"),
  "utf8",
);

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  writeFileSync(
    join(output, "sampleMinistarUnitAuthoringProposal.js"),
    ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    "utf8",
  );
  const { sampleMinistarUnitAuthoringProposal: proposal } = require(
    join(output, "sampleMinistarUnitAuthoringProposal.js"),
  );

  assert(proposal.status === "proposed-review-only", "proposal must remain review-only");
  assert(proposal.targetSentenceDrafts.length === 2, "proposal must contain exactly two sentence candidates");
  assert(proposal.sourceTerms.length === 8, "proposal must preserve the eight extracted source terms");
  assert(proposal.sentenceProvenance.includes("not present"), "proposal must disclose that sentence text is not source-extracted");
  assert(proposal.canAssignToStudents === false, "proposal must block student assignment");
  assert(proposal.canCreateReleasePackage === false, "proposal must block release package creation");
  assert(proposal.canPrintQrCodes === false, "proposal must block QR printing");
  assert(
    proposal.reviewGates.some((gate) => gate.gateId === "proposal-teacher-approval" && gate.status === "blocked"),
    "teacher approval must remain blocked",
  );
  assert(
    proposal.reviewGates.some((gate) => gate.gateId === "proposal-audio-support" && gate.status === "blocked"),
    "English audio support must remain blocked",
  );
  console.log("PASS MiniStar Unit 1 authoring proposal preserves two-sentence, eight-term, review-only invariants.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}
