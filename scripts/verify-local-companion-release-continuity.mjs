import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-local-continuity-"));
const failures = [];

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  const source = readFileSync(join(root, "packages/content-model/src/localCompanionReleaseContinuity.ts"), "utf8");
  writeFileSync(join(output, "localCompanionReleaseContinuity.js"), ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, "utf8");
  const { validateLocalCompanionReleaseContinuityPacket } = require(join(output, "localCompanionReleaseContinuity.js"));

  const packet = {
    packetId: "continuity-packet",
    tenantId: "tenant-one",
    packageId: "package-one",
    bundleId: "bundle-one",
    version: "1.0.0",
    status: "blocked",
    installer: {
      status: "blocked",
      artifactRef: "pending:installer",
      checksumRef: "pending:checksum",
      supportedPlatforms: ["pending:device"],
      installInstructionsRef: "pending:install-guide",
      deviceTestRef: "pending:device-test",
    },
    updates: {
      status: "blocked",
      currentVersion: "1.0.0",
      targetVersion: "pending:next",
      updateStrategy: "replace-package",
      updateInstructionsRef: "pending:update-guide",
      migrationPlanRef: "pending:migration",
      rollbackCheckpointRef: "pending:rollback",
    },
    recovery: {
      status: "open",
      backupPacketRef: "pending:backup",
      restoreRehearsalRef: "pending:restore",
      retentionPolicyRef: "pending:retention",
      operatorHandoffRef: "pending:operator",
    },
    evidenceBindings: ["package:package-one", "bundle:bundle-one", "recovery:pending"],
    missingEvidence: ["installer", "update", "recovery"],
    installExecutionAllowed: false,
    updateExecutionAllowed: false,
    recoveryExecutionAllowed: false,
    packageWriteAllowed: false,
    routeMutationAllowed: false,
    studentPromotionAllowed: false,
    exportAllowed: false,
    sideEffect: "none",
    blockedActions: [
      "installer-execution",
      "update-execution",
      "recovery-execution",
      "package-write",
      "route-mutation",
      "student-promotion",
      "export",
    ],
  };

  assert(validateLocalCompanionReleaseContinuityPacket(packet).length === 0, "complete review packet should validate");
  assert(
    validateLocalCompanionReleaseContinuityPacket({ ...packet, installExecutionAllowed: true }).some((error) => error.includes("installExecutionAllowed")),
    "installer execution must remain blocked",
  );
  assert(
    validateLocalCompanionReleaseContinuityPacket({ ...packet, blockedActions: packet.blockedActions.filter((action) => action !== "update-execution") }).some((error) => error.includes("update-execution")),
    "update execution must remain an explicit blocked action",
  );
  assert(
    validateLocalCompanionReleaseContinuityPacket({ ...packet, missingEvidence: [], status: "blocked" }).some((error) => error.includes("missing evidence")),
    "blocked packets must explain missing evidence",
  );
} finally {
  rmSync(output, { recursive: true, force: true });
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exitCode = 1;
} else {
  console.log("PASS local companion continuity packet binds installer, update, recovery, and blocked execution boundaries.");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}
