import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contract = fs.readFileSync(path.join(root, "packages/content-model/src/qrAliasRuntime.ts"), "utf8");
const fixture = fs.readFileSync(path.join(root, "apps/web/src/data/sampleQrAliasRollbackEvidence.ts"), "utf8");
const plan = fs.readFileSync(path.join(root, "apps/web/src/data/sampleEditionQrAliasPlan.ts"), "utf8");
const failures = [];

for (const fragment of [
  "QrAliasRollbackEvidence",
  "reviewOnlyQrAliasBlockedActions",
  "validateQrAliasRuntimeRequest",
  "createReviewOnlyQrAliasRuntimeAdapter",
  "No production QR redirect mutation",
  "No rollback execution",
  "rollback route mutation must remain blocked",
  "production QR redirect mutation is blocked",
]) {
  if (!contract.includes(fragment)) failures.push(`shared QR contract is missing ${fragment}`);
}

for (const fragment of [
  'status: "draft"',
  'deploymentTarget: "hybrid"',
  'approvalState: "review-only"',
  "routeMutationAllowed: false",
  "rollbackExecutionAllowed: false",
  "learnerDataMutationAllowed: false",
]) {
  if (!fixture.includes(fragment)) failures.push(`sample rollback evidence is missing ${fragment}`);
}

for (const fragment of ["Printed QR codes resolve aliases", "Edition changes require a reviewed alias update and rollback note"]) {
  if (!plan.includes(fragment)) failures.push(`edition QR plan is missing ${fragment}`);
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS QR alias rollback contract remains tenant-scoped, review-only, and mutation-blocked.");
}
