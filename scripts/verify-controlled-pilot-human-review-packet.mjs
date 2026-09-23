import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-controlled-pilot-review-packet-"));
const source = readFileSync(join(root, "packages", "content-model", "src", "controlledPilotHumanReviewPacket.ts"), "utf8");
writeFileSync(join(output, "controlledPilotHumanReviewPacket.js"), transpile(source), "utf8");

try {
  const model = require(join(output, "controlledPilotHumanReviewPacket.js"));
  const readiness = {
    readinessId: "readiness-a",
    releaseBindingId: "release-binding-a",
    pilotDecisionId: "pilot-a",
    reviewerGateId: "reviewer-a",
    tenantId: "tenant-a",
    packageId: "package-a",
    status: "blocked-by-release-control",
    mode: "review-only",
    approvalCaptureAllowed: false,
    releaseMutationAllowed: false,
    studentLaunchAllowed: false,
    blockingReasons: ["Resolve release-control blockers."],
    requiredHumanRecords: ["authenticated reviewer identity record"],
    nextGate: "Resolve the listed evidence, release-control, and reviewer-gate blockers before human approval review.",
  };
  const packet = model.createControlledPilotHumanReviewPacket(readiness);
  assert(packet.status === "blocked", "blocked readiness must create a blocked human review packet");
  assert(model.validateControlledPilotHumanReviewPacket(packet).length === 0, "blocked human review packet must validate");
  for (const field of ["approvalIntentCaptured", "signedApprovalCaptured", "packetFreezeAllowed", "approvalCaptureAllowed", "releaseMutationAllowed", "studentLaunchAllowed"]) {
    assert(packet[field] === false, `${field} must remain false`);
  }

  const readyPacket = model.createControlledPilotHumanReviewPacket({
    ...readiness,
    status: "ready-for-human-review",
    blockingReasons: [],
    nextGate: "A separately authorized human approval workflow may be designed after policy and storage acceptance.",
  });
  assert(readyPacket.status === "awaiting-human-review", "ready readiness must become awaiting-human-review");
  assert(model.validateControlledPilotHumanReviewPacket(readyPacket).length === 0, "awaiting human review packet must validate");
  console.log("PASS controlled pilot human review packet preserves exact evidence scope without capturing approval or freezing release state.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function transpile(source) {
  return ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
