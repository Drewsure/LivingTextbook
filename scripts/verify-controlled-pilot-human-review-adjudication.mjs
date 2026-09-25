import { readFileSync, rmSync, mkdtempSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const output = mkdtempSync(join(tmpdir(), "living-textbook-controlled-pilot-adjudication-"));
const contract = readFileSync(new URL("../packages/content-model/src/controlledPilotHumanReviewAdjudication.ts", import.meta.url), "utf8");
const panel = readFileSync(new URL("../apps/web/src/features/pilot/ControlledPilotHumanReviewAdjudicationPanel.tsx", import.meta.url), "utf8");
const route = readFileSync(new URL("../apps/web/src/app/teacher/release-control/[tenantId]/page.tsx", import.meta.url), "utf8");

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  writeFileSync(join(output, "adjudication.js"), ts.transpileModule(contract, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, "utf8");
  const model = await import(pathToFileURL(join(output, "adjudication.js")).href);

  const binding = {
    bindingId: "decision-snapshot-binding-a",
    snapshotId: "snapshot-a",
    decisionId: "decision-a",
    releaseReadinessId: "readiness-a",
    tenantId: "tenant-a",
    packageId: "package-a",
    status: "blocked-preview",
    scopeDrift: ["Evidence is incomplete."],
  };
  const releaseReviewBinding = {
    bindingId: "release-review-binding-a",
    tenantId: "tenant-a",
    packageId: "package-a",
    status: "blocked-preview",
    scopeDrift: [],
  };
  const packet = {
    packetId: "human-review-packet-a",
    readinessId: "readiness-a",
    tenantId: "tenant-a",
    packageId: "package-a",
    status: "blocked",
  };
  const blocked = model.createReviewOnlyControlledPilotHumanReviewAdjudication(binding, releaseReviewBinding, packet, {
    reviewerRole: "publisher-admin",
    reviewerRef: "publisher-admin:tenant-a",
    decision: "blocked",
    reviewerNote: "Evidence is incomplete.",
    recordedAt: "2026-09-25T09:00:00.000Z",
  });
  assert(blocked.status === "blocked-by-evidence", "blocked evidence must remain blocked");
  assert(model.validateControlledPilotHumanReviewAdjudication(blocked, binding, releaseReviewBinding, packet).length === 0, "blocked adjudication must validate");
  const readyBinding = { ...binding, status: "linked-review-only", scopeDrift: [] };
  const readyReleaseReviewBinding = { ...releaseReviewBinding, status: "review-ready-after-evidence" };
  const readyPacket = { ...packet, status: "awaiting-human-review" };
  const accepted = model.createReviewOnlyControlledPilotHumanReviewAdjudication(readyBinding, readyReleaseReviewBinding, readyPacket, {
    reviewerRole: "school-admin",
    reviewerRef: "school-admin:tenant-a",
    decision: "accepted-for-next-gate",
    reviewerNote: "Evidence may advance to the next review gate.",
    recordedAt: "2026-09-25T09:01:00.000Z",
  });
  assert(accepted.status === "accepted-for-next-gate" && accepted.blockingReasons.length === 0, "clear evidence may advance only to the next gate");
  assert(model.validateControlledPilotHumanReviewAdjudication(accepted, readyBinding, readyReleaseReviewBinding, readyPacket).length === 0, "accepted adjudication must validate");
  assert(model.validateControlledPilotHumanReviewAdjudication(accepted, readyBinding, readyReleaseReviewBinding, { ...readyPacket, tenantId: "tenant-b" }).some((error) => error.includes("packet scope")), "cross-tenant packet must be rejected");
  assert(model.validateControlledPilotHumanReviewAdjudication({ ...accepted, approvalCaptureAllowed: true }, readyBinding, readyReleaseReviewBinding, readyPacket).some((error) => error.includes("approvalCaptureAllowed must remain false")), "approval capture drift must be rejected");

  for (const marker of ["Controlled-pilot evidence adjudication", "Human review outcome without release authority", "No release authority", "Blocked actions", "Student launch"]) assert(panel.includes(marker), `adjudication panel missing marker: ${marker}`);
  for (const marker of ["ControlledPilotHumanReviewAdjudicationPanel", "buildSampleControlledPilotHumanReviewAdjudication", "sampleControlledPilotHumanReviewPacket"]) assert(route.includes(marker), `release-control route missing marker: ${marker}`);
  console.log("PASS controlled-pilot human-review adjudication preserves evidence scope, next-gate semantics, and review-only release boundaries.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}
