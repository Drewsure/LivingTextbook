import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-backend-contract-"));

try {
  const tsc = join(root, "node_modules", "typescript", "bin", "tsc");
  const compile = spawnSync(process.execPath, [
    tsc,
    "--module", "commonjs",
    "--target", "ES2022",
    "--moduleResolution", "node",
    "--skipLibCheck",
    "--rootDir", join(root, "apps", "web", "src"),
    "--outDir", output,
    "apps/web/src/data/backendContractAlignment.ts",
    "apps/web/src/data/sampleBackendContractAlignment.ts",
  ], { cwd: root, encoding: "utf8" });

  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    process.exit(1);
  }

  const sample = require(join(output, "data", "sampleBackendContractAlignment.js"));
  if (sample.sampleBackendContractAlignmentErrors.length > 0) {
    throw new Error(sample.sampleBackendContractAlignmentErrors.join("\n"));
  }

  console.log("PASS backend contract alignment resolves all sample schema entities, migration candidates, and migration specs.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

