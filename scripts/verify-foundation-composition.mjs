import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

execFileSync(process.execPath, [fileURLToPath(new URL("./verify-standards-integrity.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-curated-pathway-boundary.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-content-model-public-boundary.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-locale-independent-content-matching.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-cross-route-persistence.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-durable-progression-storage.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-durable-progression-operations.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-teacher-operations-authorization.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-persistence-adapter-seam.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-shared-app-shell-accessibility.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-audio-accessibility.mjs", import.meta.url))], {
  stdio: "inherit",
});
execFileSync(process.execPath, [fileURLToPath(new URL("./verify-app-shell-navigation.mjs", import.meta.url))], {
  stdio: "inherit",
});

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const scripts = packageJson.scripts ?? {};
const foundation = scripts["verify:foundation"] ?? "";
const requiredCommands = [
  "npm run verify:content-model-boundary",
  "npm run verify:ai-service",
  "npm run verify:phaser-source-evidence-contract",
  "npm run verify:phaser-scene-inventory",
  "npm run verify:persistence-runtime",
  "npm run verify:report-runtime",
  "npm run verify:asset-runtime",
  "npm run verify:content-package-runtime",
  "npm run verify:launch-runtime",
  "npm run verify:assignment-runtime",
  "npm run verify:source-runtime",
  "npm run verify:release-runtime",
  "npm run verify:recovery-runtime",
  "npm run verify:progression-runtime",
  "npm run verify:reward-runtime",
  "npm run verify:entitlement-runtime",
  "npm run verify:runtime-behavior",
  "npm run typecheck:ai-service",
  "npm run typecheck --workspace @living-textbook/web",
  "npm run build --workspace @living-textbook/web",
  "npm run verify:routes",
];
const missing = requiredCommands.filter((command) => !foundation.includes(command));

if (typeof scripts["verify:ai-service"] !== "string") missing.push("scripts.verify:ai-service");
if (typeof scripts["verify:persistence-runtime"] !== "string") missing.push("scripts.verify:persistence-runtime");
if (typeof scripts["typecheck:ai-service"] !== "string") missing.push("scripts.typecheck:ai-service");

if (missing.length > 0) {
  for (const item of missing) console.error(`FAIL foundation composition missing: ${item}`);
  process.exit(1);
}

console.log(`PASS foundation composition includes ${requiredCommands.length} critical runtime, type, build, and route checks.`);
