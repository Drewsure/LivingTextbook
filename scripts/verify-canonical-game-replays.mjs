import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-canonical-game-replays-"));

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  const tsc = join(root, "node_modules", "typescript", "bin", "tsc");
  const compile = spawnSync(process.execPath, [
    tsc,
    "--module", "commonjs",
    "--target", "ES2022",
    "--moduleResolution", "node",
    "--resolveJsonModule",
    "--esModuleInterop",
    "--skipLibCheck",
    "--rootDir", join(root, "packages", "content-model", "src"),
    "--outDir", output,
    "packages/content-model/src/canonicalGameIntegration.ts",
  ], { cwd: root, encoding: "utf8" });

  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    process.exit(1);
  }

  const canonicalGame = require(join(output, "canonicalGameIntegration.js"));
  const modes = Object.keys(canonicalGame.CANONICAL_GAME_SCORING_PROFILE_BY_MODE);
  const targetLanguages = ["en", "ja"];

  for (const targetLanguage of targetLanguages) {
    const tenantId = `replay-harness-${targetLanguage}`;
    const unitKey = `${tenantId}:starter:L1:U1`;
    const launchCode = `${tenantId}-launch`;
    const studentSessionId = `${tenantId}-session`;

    for (const mode of modes) {
      const scoringProfileId = canonicalGame.CANONICAL_GAME_SCORING_PROFILE_BY_MODE[mode];
      const dustCap = canonicalGame.CANONICAL_GAME_COMPLETION_DUST_CAP_BY_MODE[mode];
      const earnedStarDust = Math.min(1, dustCap);
      const replaySeed = `replay-v1:canonical-${targetLanguage}-${mode}`;
      const context = { tenantId, unitKey, gameMode: mode, launchCode, studentSessionId };
      const events = [
        event(context, "game_started", replaySeed, "2026-09-14T00:00:00.000Z"),
        event(context, "round_shown", replaySeed, "2026-09-14T00:00:01.000Z"),
        event(context, "answer_submitted", replaySeed, "2026-09-14T00:00:02.000Z"),
        event(context, "answer_result", replaySeed, "2026-09-14T00:00:03.000Z", { correct: true }),
        event(context, "audio_requested", replaySeed, "2026-09-14T00:00:04.000Z", {
          cueKind: "instruction",
          cueText: `Listen for ${mode}.`,
          language: targetLanguage,
          masteryCreditAllowed: false,
        }),
        event(context, "mastery_updated", replaySeed, "2026-09-14T00:00:05.000Z", {
          completed: true,
          earnedStarDust,
          scoringProfileId,
        }),
        event(context, "game_completed", replaySeed, "2026-09-14T00:00:06.000Z", {
          earnedStarDust,
          scoringProfileId,
        }),
      ];
      const result = canonicalGame.validateCanonicalGameEventSequence(
        events,
        mode,
        tenantId,
        earnedStarDust,
        { unitKey, launchCode, studentSessionId },
        targetLanguage,
      );

      if (!result.valid) {
        throw new Error(`${targetLanguage}/${mode} replay was rejected:\n${result.errors.join("\n")}`);
      }
    }
  }

  console.log(`PASS canonical game replay harness validates ${modes.length * targetLanguages.length} replay(s) across ${modes.length} active mode(s) and ${targetLanguages.length} target language(s) with deterministic scoring, replay identity, and ordered completion evidence.`);
} finally {
  rmSync(output, { recursive: true, force: true });
}

function event(context, type, replaySeed, occurredAt, metadata = {}) {
  return {
      ...context,
    type,
    occurredAt,
    metadata: {
      tenantId: context.tenantId,
      replaySeed,
      ...metadata,
    },
  };
}
