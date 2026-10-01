import { createServer } from "node:http";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const root = join(fileURLToPath(new URL("..", import.meta.url)));
const scriptPath = join(root, "scripts", "run-local-package-operator.mjs");
const temporaryDirectory = await mkdtemp(join(tmpdir(), "living-textbook-local-package-operator-check-"));
const requestPath = join(temporaryDirectory, "operator-request.json");
const request = {
  tenantId: "self-test-publisher",
  packageId: "self-test-package",
  version: "2026.1",
  quarantineId: "q-00000000-0000-4000-8000-000000000001",
  reviewPacketId: "review-self-test",
  bundleManifestReviewId: "bundle-review-self-test",
  operatorId: "operator-self-test",
  writtenAt: "2026-10-01T00:00:00.000Z",
};
await writeFile(requestPath, `${JSON.stringify(request)}\n`, "utf8");

const received = [];
const server = createServer((incoming, response) => {
  const chunks = [];
  incoming.on("data", (chunk) => chunks.push(chunk));
  incoming.on("end", () => {
    received.push({
      method: incoming.method,
      url: incoming.url,
      authorization: incoming.headers.authorization,
      body: JSON.parse(Buffer.concat(chunks).toString("utf8")),
    });
    const isAssembly = incoming.url === "/api/teacher/delivery/local-package";
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(isAssembly
      ? { status: "accepted", executionReady: true, packageAssemblyAllowed: true, performedWrite: true, idempotent: false, relativeDirectory: "self-test-package", sourceFileCount: 2, errors: [] }
      : { status: "ready-for-assembly", executionReady: true, packageAssemblyAllowed: false, performedWrite: false, idempotent: false, relativeDirectory: null, sourceFileCount: 2, errors: [] }));
  });
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
try {
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  const baseUrl = `http://127.0.0.1:${port}`;
  const baseEnv = {
    ...process.env,
    LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN: "self-test-delivery-token",
  };

  await expectFailure(
    ["--request", requestPath, "--assemble", "--base-url", baseUrl],
    baseEnv,
    "ASSEMBLE_LOCAL_PACKAGE",
  );
  if (received.length !== 0) throw new Error("assembly without explicit confirmation sent a request");

  await runOperator(["--request", requestPath, "--preflight", "--base-url", baseUrl], baseEnv);
  await runOperator(["--request", requestPath, "--assemble", "--base-url", baseUrl], {
    ...baseEnv,
    LIVING_TEXTBOOOK_OPERATOR_LOCAL_PACKAGE_WRITE_CONFIRMATION: "ASSEMBLE_LOCAL_PACKAGE",
  });

  if (received.length !== 2) throw new Error(`expected two operator requests, received ${received.length}`);
  assertRequest(received[0], "/api/teacher/delivery/local-package/preflight");
  assertRequest(received[1], "/api/teacher/delivery/local-package");
  console.log("PASS local package operator behavior enforces explicit assembly confirmation, tenant credential, route selection, and bounded request forwarding.");
} finally {
  await new Promise((resolve) => server.close(resolve));
  await rm(temporaryDirectory, { recursive: true, force: true });
}

async function runOperator(args, env) {
  try {
    await execFileAsync(process.execPath, [scriptPath, ...args], { encoding: "utf8", env });
  } catch (error) {
    throw new Error(`operator behavior self-test failed: ${error.stdout ?? ""}${error.stderr ?? error.message}`);
  }
}

async function expectFailure(args, env, forbiddenConfirmation) {
  try {
    await execFileAsync(process.execPath, [scriptPath, ...args], { encoding: "utf8", env });
    throw new Error("assembly without confirmation unexpectedly succeeded");
  } catch (error) {
    const output = `${error.stdout ?? ""}${error.stderr ?? error.message}`;
    if (!output.includes(forbiddenConfirmation) || !output.toLowerCase().includes("requires")) {
      throw new Error(`assembly confirmation failure was not explicit: ${output}`);
    }
  }
}

function assertRequest(record, expectedUrl) {
  if (record.method !== "POST" || record.url !== expectedUrl) throw new Error(`unexpected operator request: ${record.method} ${record.url}`);
  if (record.authorization !== "Bearer self-test-delivery-token") throw new Error("operator did not use the server-side delivery credential");
  if (JSON.stringify(record.body).includes("self-test-delivery-token")) throw new Error("operator leaked the delivery credential into the body");
  if (record.body.tenantId !== request.tenantId || record.body.packageId !== request.packageId || record.body.version !== request.version) {
    throw new Error("operator did not forward the tenant/package/version identity");
  }
}
