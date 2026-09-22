import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = {
  schema: fs.readFileSync(path.join(root, "apps/web/src/data/sampleBackendSchemaDraft.ts"), "utf8"),
  candidate: fs.readFileSync(path.join(root, "apps/web/src/data/sampleBackendMigrationCandidates.ts"), "utf8"),
  spec: fs.readFileSync(path.join(root, "apps/web/src/data/sampleBackendMigrationSpecs.ts"), "utf8"),
  contract: fs.readFileSync(path.join(root, "packages/content-model/src/qrAliasRuntime.ts"), "utf8"),
};
const failures = [];

const sharedFields = [
  "printed_qr_id",
  "package_release_id",
  "previous_release_id",
  "release_version",
  "fallback_target",
  "rollback_evidence_id",
  "rollback_approval_state",
  "route_mutation_allowed",
  "rollback_execution_allowed",
  "learner_data_mutation_allowed",
];

for (const field of sharedFields) {
  if (!files.schema.includes(`name: "${field}"`)) failures.push(`schema draft is missing ${field}`);
  if (!files.spec.includes(`name: "${field}"`)) failures.push(`migration spec is missing ${field}`);
}

for (const fragment of [
  "QR alias rollback contract accepted",
  "Release lineage fields accepted",
  "Route mutation without release approval",
  "Learner-data mutation during rollback",
]) {
  if (!files.candidate.includes(fragment)) failures.push(`migration candidate is missing ${fragment}`);
}

for (const fragment of [
  "rollback route mutation must remain blocked",
  "rollback execution must remain blocked",
  "rollback learner-data mutation must remain blocked",
  "No production QR redirect mutation",
]) {
  if (!files.contract.includes(fragment)) failures.push(`shared runtime contract is missing ${fragment}`);
}

if (files.schema.includes('name: "learner_audio"') || files.schema.includes('name: "learner_transcript"')) {
  failures.push("route alias schema must not store raw learner audio or transcripts");
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS QR alias runtime, schema draft, migration candidate, and migration spec remain aligned.");
}
