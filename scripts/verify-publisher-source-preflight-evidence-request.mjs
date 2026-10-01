import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

const root = await mkdtemp(join(tmpdir(), "living-textbook-source-evidence-request-check-"));
try {
  const sourceRoot = join(root, "source");
  const outputPath = join(root, "evidence-request.json");
  await mkdir(join(sourceRoot, "unit-1"), { recursive: true });
  await writeFile(join(sourceRoot, "publisher-source-manifest.json"), `${JSON.stringify({
    recordVersion: 1,
    manifestId: "publisher-source:self-test-publisher:self-test-publisher-example-book-l1-u1-pilot:1.0.0",
    tenantId: "self-test-publisher",
    packageId: "self-test-publisher-example-book-l1-u1-pilot",
    version: "1.0.0",
    entries: [{ assetId: "source", kind: "textbook-source", relativePath: "unit-1/source.pdf", unitKey: "self-test-publisher:example-book:L1:U1", acceptedTypes: ["application/pdf"], required: true }],
    reviewOnly: true,
    quarantineWriteAllowed: false,
    packageAssemblyAllowed: false,
    studentFacingUseAllowed: false,
  }, null, 2)}\n`, "utf8");
  await writeFile(join(sourceRoot, "unit-1", "source.pdf"), "source fixture", "utf8");

  const script = "scripts/create-publisher-source-preflight-evidence-request.mjs";
  const args = [script, "--root", sourceRoot, "--output", outputPath, "--tenant", "self-test-publisher", "--quarantine", "q-00000000-0000-4000-8000-000000000001"];
  const created = spawnSync(process.execPath, args, { encoding: "utf8" });
  if (created.status !== 0) throw new Error(`request creation failed: ${created.stdout}\n${created.stderr}`);
  const request = JSON.parse(await readFile(outputPath, "utf8"));
  if (request.requestMode !== "review-only-source-preflight-evidence" || request.rawFilesIncluded !== false || request.report.inventoryStatus !== "complete" || request.report.packageAssemblyAllowed !== false) throw new Error("request did not preserve complete review-only source evidence boundary");
  const second = spawnSync(process.execPath, args, { encoding: "utf8" });
  if (second.status === 0 || !`${second.stdout}${second.stderr}`.includes("Could not create")) throw new Error(`request creation must refuse overwrite: ${second.stdout}${second.stderr}`);
  console.log("PASS source preflight evidence request creation runs the canonical preflight, writes metadata only, and refuses overwrite.");
} finally {
  await rm(root, { recursive: true, force: true });
}
