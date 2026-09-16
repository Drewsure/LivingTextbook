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

const route = read("apps/web/src/app/api/persistence/progression/route.ts");
const store = read("apps/web/src/server/persistence/sqliteProgressionStore.ts");
const model = read("packages/content-model/src/hostedProgressionPersistence.ts");
const client = read("apps/web/src/features/persistence/hostedProgressionPersistenceClient.ts");
const sessionRoute = read("apps/web/src/app/api/student/session/route.ts");
const sessionCookie = read("apps/web/src/server/persistence/studentSessionCookie.ts");
const envExample = read(".env.example");
const gitignore = read(".gitignore");

requireFragments("SQLite store", store, [
  'from "node:sqlite"',
  "class SqliteProgressionStore",
  "CREATE TABLE IF NOT EXISTS hosted_progression_records",
  "PRIMARY KEY (tenant_id, package_id, launch_code, student_session_id, idempotency_key)",
  "CREATE INDEX IF NOT EXISTS idx_hosted_progression_identity",
  "ORDER BY written_at DESC",
  "The idempotency key is already bound to a different tenant-scoped identity.",
  "JSON.stringify(record)",
]);

requireFragments("durable model", model, [
  '"durable-managed"',
  "allowDurableWrite",
  "retentionPolicyAccepted",
  "releaseApprovalAccepted",
  "school policy acceptance",
  'args.request.policy.mode === "durable-managed" ? "durable-managed" : "non-durable-rehearsal"',
]);

requireFragments("persistence route", route, [
  'runtime = "nodejs"',
  'dynamic = "force-dynamic"',
  "LIVING_TEXTBOOK_PERSISTENCE_PROVIDER",
  "LIVING_TEXTBOOK_PERSISTENCE_ALLOW_DURABLE_WRITES",
  "LIVING_TEXTBOOK_PERSISTENCE_API_TOKEN",
  "getDurableProgressionStore().write(record)",
  "getDurableProgressionStore().read(lookup)",
  "hasPersistenceWriteAuthorization",
  "Cache-Control",
]);

requireFragments("persistence client", client, ["provider", '"durable-managed"', '"no-store"']);
requireFragments("student session route", sessionRoute, [
  'runtime = "nodejs"',
  "resolveSampleFrontDoorContext",
  "setStudentSessionCookie",
  "LIVING_TEXTBOOK_PERSISTENCE_ALLOW_DURABLE_WRITES",
  'status: "authenticated"',
]);
requireFragments("student session cookie", sessionCookie, [
  "createHmac",
  "timingSafeEqual",
  "HttpOnly",
  "SameSite=Lax",
  "LIVING_TEXTBOOK_STUDENT_SESSION_SECRET",
]);
requireFragments("environment contract", envExample, [
  "LIVING_TEXTBOOK_PERSISTENCE_PROVIDER=process-memory",
  "LIVING_TEXTBOOK_PERSISTENCE_ALLOW_DURABLE_WRITES=false",
  "LIVING_TEXTBOOK_PERSISTENCE_API_TOKEN",
  "LIVING_TEXTBOOK_PROGRESSION_DB_PATH",
  "LIVING_TEXTBOOK_STUDENT_SESSION_SECRET",
]);
requireFragments("database ignore policy", gitignore, ["data/*.sqlite", "data/*.sqlite-wal"]);

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS durable multi-tenant progression storage boundary is present and gated.");
}
