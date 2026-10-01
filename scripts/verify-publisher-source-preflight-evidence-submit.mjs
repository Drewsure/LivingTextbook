import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const script = readFileSync(join(root, "scripts", "submit-publisher-source-preflight-evidence-request.mjs"), "utf8");
const creator = readFileSync(join(root, "scripts", "create-publisher-source-preflight-evidence-request.mjs"), "utf8");
const route = readFileSync(join(root, "apps", "web", "src", "app", "api", "teacher", "uploads", "source-preflight-evidence", "route.ts"), "utf8");
const required = [
  [script, "LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN", "server-side quarantine credential"],
  [script, "/api/teacher/uploads/source-preflight-evidence", "tenant evidence endpoint"],
  [script, "rawFilesIncluded !== false", "raw-file refusal"],
  [script, "uploadPerformed !== false", "upload refusal"],
  [script, "protectedActions", "protected action response"],
  [script, "recorded-review-only", "review-only success status"],
  [creator, "requestMode: \"review-only-source-preflight-evidence\"", "request mode"],
  [route, "writeQuarantineSourcePreflightEvidence", "durable evidence writer"],
  [route, "studentFacingUseAllowed: false", "student block"],
];
const failures = required.filter(([source, marker]) => !source.includes(marker)).map(([, , label]) => `missing ${label}`);
if (script.includes("payload.report") || script.includes("body.report.files")) failures.push("submitter must not transmit a transformed raw payload");
if (failures.length > 0) { for (const failure of failures) console.error(`FAIL ${failure}`); process.exit(1); }
await runSubmitterSelfTest();
console.log("PASS source preflight evidence submission is credential-gated, tenant-bound, metadata-only, and protected-action blocked.");

async function runSubmitterSelfTest() {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), "living-textbook-source-evidence-submit-check-"));
  const requestPath = join(temporaryDirectory, "request.json");
  const request = {
    tenantId: "self-test-publisher",
    quarantineId: "q-00000000-0000-4000-8000-000000000001",
    packageId: "self-test-package",
    report: { recordVersion: 1, tenantId: "self-test-publisher", packageId: "self-test-package", inventoryStatus: "complete", files: [] },
    requestMode: "review-only-source-preflight-evidence",
    rawFilesIncluded: false,
    uploadPerformed: false,
    packageAssemblyAllowed: false,
    packagePromotionAllowed: false,
    qrPrintAllowed: false,
    hostedPersistenceActivationAllowed: false,
    studentFacingUseAllowed: false,
  };
  await writeFile(requestPath, `${JSON.stringify(request)}\n`, "utf8");
  let received = null;
  const server = createServer((incoming, response) => {
    const chunks = [];
    incoming.on("data", (chunk) => chunks.push(chunk));
    incoming.on("end", () => {
      received = { method: incoming.method, url: incoming.url, authorization: incoming.headers.authorization, body: JSON.parse(Buffer.concat(chunks).toString("utf8")) };
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ status: "recorded-review-only", idempotent: false, record: { evidenceId: "evidence:self-test" }, errors: [] }));
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const address = server.address();
    const port = typeof address === "object" && address ? address.port : 0;
    const scriptPath = join(root, "scripts", "submit-publisher-source-preflight-evidence-request.mjs");
    let result;
    try {
      result = await execFileAsync(process.execPath, [scriptPath, "--request", requestPath, "--base-url", `http://127.0.0.1:${port}`], { encoding: "utf8", env: { ...process.env, LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN: "self-test-token" } });
    } catch (error) {
      throw new Error(`submitter self-test failed: ${error.stdout ?? ""}${error.stderr ?? error.message}`);
    }
    if (!received || received.method !== "POST" || received.url !== "/api/teacher/uploads/source-preflight-evidence" || received.authorization !== "Bearer self-test-token") throw new Error("submitter self-test did not use the expected endpoint credential");
    const sentKeys = Object.keys(received.body).sort();
    if (sentKeys.join(",") !== "packageId,quarantineId,report,tenantId") throw new Error(`submitter sent unexpected fields: ${sentKeys.join(",")}`);
    if (JSON.stringify(received.body).includes("self-test-token") || "rawFilesIncluded" in received.body || "packageAssemblyAllowed" in received.body) throw new Error("submitter sent a credential or protected-action field");
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}
