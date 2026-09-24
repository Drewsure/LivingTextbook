import { createServer } from "node:net";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const host = "127.0.0.1";
const startupTimeoutMs = Number(process.env.ACTIVE_ROUTE_PREVIEW_STARTUP_TIMEOUT_MS ?? 90000);
const pollIntervalMs = 250;

const port = await findFreePort();
const baseUrl = `http://${host}:${port}`;
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const previewCommand = process.platform === "win32" ? process.env.ComSpec ?? "cmd.exe" : npmCommand;
const previewArgs = process.platform === "win32"
  ? ["/d", "/s", "/c", `${npmCommand} run start --workspace @living-textbook/web -- --hostname ${host} --port ${port}`]
  : ["run", "start", "--workspace", "@living-textbook/web", "--", "--hostname", host, "--port", String(port)];
const preview = spawn(
  previewCommand,
  previewArgs,
  {
    cwd: repoRoot,
    env: { ...process.env, ACTIVE_ROUTE_BASE_URL: baseUrl },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  },
);

let previewOutput = "";
preview.stdout.on("data", (chunk) => {
  previewOutput += chunk.toString();
});
preview.stderr.on("data", (chunk) => {
  previewOutput += chunk.toString();
});

const stopPreview = () => {
  if (preview.exitCode !== null) return;

  if (process.platform === "win32" && preview.pid) {
    const killer = spawn("taskkill", ["/pid", String(preview.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true,
      detached: true,
    });
    killer.unref();
  } else {
    preview.kill("SIGTERM");
  }
  preview.stdout?.destroy();
  preview.stderr?.destroy();
  preview.unref();
};

process.once("SIGINT", () => {
  stopPreview();
  process.exit(130);
});
process.once("SIGTERM", () => {
  stopPreview();
  process.exit(143);
});

try {
  await waitForPreview(baseUrl, preview);
  const result = await runRouteVerifier(baseUrl);
  if (result.exitCode !== 0) {
    process.exitCode = result.exitCode ?? 1;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  stopPreview();
  if (process.exitCode && previewOutput.trim()) {
    console.error(previewOutput.trim());
  }
}

async function findFreePort() {
  if (process.env.ACTIVE_ROUTE_PREVIEW_PORT) {
    return Number(process.env.ACTIVE_ROUTE_PREVIEW_PORT);
  }

  return await new Promise((resolvePort, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, host, () => {
      const address = server.address();
      const selectedPort = typeof address === "object" && address ? address.port : undefined;
      server.close((error) => (error ? reject(error) : resolvePort(selectedPort)));
    });
  });
}

async function waitForPreview(url, child) {
  const deadline = Date.now() + startupTimeoutMs;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Preview server exited before becoming ready.\n${previewOutput.trim()}`);
    }

    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (response.ok) return;
    } catch {
      // The preview may still be binding its port.
    }

    await new Promise((resolveWait) => setTimeout(resolveWait, pollIntervalMs));
  }

  throw new Error(`Preview server did not become ready within ${startupTimeoutMs}ms.\n${previewOutput.trim()}`);
}

async function runRouteVerifier(baseUrl) {
  const verifier = spawn(
    process.execPath,
    [resolve(repoRoot, "scripts/verify-active-routes.mjs")],
    {
      cwd: repoRoot,
      env: { ...process.env, ACTIVE_ROUTE_BASE_URL: baseUrl },
      stdio: "inherit",
      windowsHide: true,
    },
  );

  return await new Promise((resolveResult, reject) => {
    verifier.once("error", reject);
    verifier.once("close", (exitCode, signal) => resolveResult({ exitCode: exitCode ?? (signal ? 1 : 0) }));
  });
}
