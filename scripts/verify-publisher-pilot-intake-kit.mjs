import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const generator = join(root, "scripts/create-publisher-pilot-intake-kit.mjs");
const contract = await readFile(join(root, "packages/content-model/src/publisherPilotIntakeBrief.ts"), "utf8");
const preflight = await readFile(join(root, "scripts/publisher-pilot-intake-preflight.mjs"), "utf8");
const panel = await readFile(join(root, "apps/web/src/features/pilot/PublisherPilotInputKitPanel.tsx"), "utf8");
const route = await readFile(join(root, "apps/web/src/app/teacher/pilot/requirements/[tenantId]/page.tsx"), "utf8");
const failures = [];

const selfTest = spawnSync(process.execPath, [generator, "--self-test"], { encoding: "utf8" });
if (selfTest.status !== 0 || !selfTest.stdout.includes("PASS publisher pilot intake kit")) {
  failures.push(`generator self-test failed: ${selfTest.stderr || selfTest.stdout}`);
}
for (const marker of ["reviewOnly: true", "packageAssemblyAllowed: false", "studentFacingUseAllowed: false", "mediaRequests", "evidenceRequests", "qrPageReferences", "qrReferences"]) {
  if (!contract.includes(marker) && !generator.includes(marker)) failures.push(`contract/generator missing safety marker: ${marker}`);
}
for (const marker of ["--output", "flag: \"wx\"", "Evidence report written once"]) {
  if (!preflight.includes(marker)) failures.push(`preflight missing non-overwriting evidence report marker: ${marker}`);
}
for (const marker of ["Publisher pilot input kit", "Still blocked", "Assembly, QR, persistence, students", "create-publisher-pilot-intake-kit.mjs", "LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN", "submit-publisher-source-preflight-evidence-request.mjs", "never sends raw files"]) {
  if (!panel.includes(marker)) failures.push(`panel missing marker: ${marker}`);
}
if (!route.includes("PublisherPilotInputKitPanel")) failures.push("requirements route must mount the intake kit panel.");

if (failures.length > 0) {
  console.error(`FAIL publisher pilot intake kit verification\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log("PASS publisher pilot intake kit preserves review-only contract, generator safety, and requirements-route integration.");
