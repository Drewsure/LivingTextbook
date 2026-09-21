import { createRequire } from "node:module";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("..", import.meta.url));
const output = mkdtempSync(join(tmpdir(), "living-textbook-target-policy-"));

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  const tsc = join(root, "node_modules", "typescript", "bin", "tsc");
  const compile = spawnSync(process.execPath, [
    tsc,
    "--module", "commonjs",
    "--target", "ES2022",
    "--moduleResolution", "node",
    "--skipLibCheck",
    "--rootDir", join(root, "packages", "content-model", "src"),
    "--outDir", output,
    "packages/content-model/src/targetLanguagePolicy.ts",
  ], { cwd: root, encoding: "utf8" });

  if (compile.status !== 0) {
    process.stdout.write(compile.stdout ?? "");
    process.stderr.write(compile.stderr ?? "");
    process.exit(1);
  }

  const { validateTargetLanguagePolicy } = require(join(output, "targetLanguagePolicy.js"));
  const japaneseTarget = {
    tenantId: "sample-japanese-school",
    targetLanguage: "ja",
    assistLanguages: ["en"],
    policy: {
      language: "ja",
      progressionRole: "target",
      scriptPolicy: "hiragana-first",
      segmentationPolicy: "japanese-aware",
      targetLanguageAudioRequired: true,
      supportLanguageProgressAllowed: false,
    },
  };
  const validErrors = validateTargetLanguagePolicy(japaneseTarget);
  if (validErrors.length > 0) {
    throw new Error(`Valid Japanese target policy rejected: ${validErrors.join("; ")}`);
  }

  const invalidSupportProgress = validateTargetLanguagePolicy({
    ...japaneseTarget,
    policy: { ...japaneseTarget.policy, supportLanguageProgressAllowed: true },
  });
  if (!invalidSupportProgress.some((error) => error.includes("support-language progress"))) {
    throw new Error("Support-language progress must be rejected.");
  }

  const invalidSegmentation = validateTargetLanguagePolicy({
    ...japaneseTarget,
    policy: { ...japaneseTarget.policy, segmentationPolicy: "whitespace" },
  });
  if (!invalidSegmentation.some((error) => error.includes("Japanese-aware"))) {
    throw new Error("English whitespace segmentation must be rejected for Japanese target content.");
  }

  console.log("PASS target-language policy validates Japanese target configuration and rejects unsafe progression/segmentation rules.");
} finally {
  rmSync(output, { recursive: true, force: true });
}
