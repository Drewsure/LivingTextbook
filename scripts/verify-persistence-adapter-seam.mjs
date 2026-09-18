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

const adapter = read("apps/web/src/server/persistence/progressionPersistenceAdapter.ts");
const progressionRoute = read("apps/web/src/app/api/persistence/progression/route.ts");
const operationsRoute = read("apps/web/src/app/api/persistence/operations/route.ts");
const statusRoute = read("apps/web/src/app/api/persistence/status/route.ts");
const checklist = read("docs/verification/PERSISTENCE_ADAPTER_SEAM_CHECKS.md");

requireFragments("provider adapter", adapter, [
  "ProgressionPersistenceAdapter",
  'PersistenceProvider = "process-memory" | "sqlite"',
  'PersistenceDurability = "non-durable-rehearsal" | "durable-managed"',
  "getConfiguredPersistenceProvider",
  "getPersistenceProviderConfiguration",
  "valid: false",
  "Unsupported persistence provider configuration",
  "getProgressionPersistenceAdapter",
  "processMemoryAdapter",
  "getDurableProgressionStore",
  "idempotency key is already bound",
]);
requireFragments("progression route", progressionRoute, [
  "getConfiguredPersistenceProvider",
  "getProgressionPersistenceAdapter",
  "adapter.write(record)",
  "adapter.read(lookup)",
]);
if (progressionRoute.includes('from "@/server/persistence/sqliteProgressionStore"')) {
  failures.push("progression route must not select the SQLite implementation directly");
}
if (progressionRoute.includes("__livingTextbookHostedProgressionRehearsal")) {
  failures.push("progression route must not own the process-memory store");
}
requireFragments("operations route", operationsRoute, ["getConfiguredPersistenceProvider"]);
requireFragments("operations route", operationsRoute, ["getPersistenceProviderConfiguration", "status: \"blocked\""]);
requireFragments("status route", statusRoute, ["getConfiguredPersistenceProvider", "getPersistenceProviderConfiguration", "status: !providerConfiguration.valid ? \"blocked\""]);
requireFragments("verification checklist", checklist, ["provider-neutral adapter", "Process-memory", "SQLite", "No provider credentials"]);

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS progression persistence uses one provider-neutral server adapter seam.");
}
