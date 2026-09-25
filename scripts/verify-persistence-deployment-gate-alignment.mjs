import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`missing ${relativePath}`);
    return "";
  }
  return fs.readFileSync(absolutePath, "utf8");
}

function requireFragments(label, source, fragments) {
  for (const fragment of fragments) {
    if (!source.includes(fragment)) failures.push(`${label}: missing ${fragment}`);
  }
}

const gate = read("apps/web/src/server/persistence/persistenceDeploymentGate.ts");
const status = read("apps/web/src/app/api/persistence/status/route.ts");
const studentSession = read("apps/web/src/app/api/student/session/route.ts");
const progression = read("apps/web/src/app/api/persistence/progression/route.ts");
const events = read("apps/web/src/app/api/persistence/events/route.ts");

requireFragments("shared deployment gate", gate, [
  "getDurableOperationsPolicySnapshot",
  "getDurableDatabasePathPolicySnapshot",
  "getPersistenceProviderConfiguration",
  "derivePersistenceDeploymentGate",
  "isTeacherSessionConfigured",
  "operationsReady: durable && policy.errors.length === 0",
  "databasePathReady: databasePath.valid",
]);

for (const [label, source] of [
  ["status route", status],
  ["student session route", studentSession],
  ["progression route", progression],
  ["event route", events],
]) {
  requireFragments(label, source, ["getPersistenceDeploymentGateSnapshot", "deployment.gate"]);
}

requireFragments("student session route", studentSession, [
  'deployment.gate.status === "rehearsal"',
  "deployment.gate.ready",
  "deployment.gate.blockedReasons",
  'durability: deployment.gate.mode',
]);
requireFragments("progression route", progression, [
  "if (!deployment.gate.ready)",
  'durability: "durable-managed"',
]);
requireFragments("event route", events, [
  "if (!deployment.gate.ready)",
  'durability: "durable-managed"',
]);

for (const [label, source] of [
  ["progression route", progression],
  ["event route", events],
]) {
  if (source.includes("function getDurableDeploymentPolicyErrors")) {
    failures.push(`${label}: duplicated durable policy gate must be removed`);
  }
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS student sessions, progression writes, event writes, and status use one deployment gate.");
}
