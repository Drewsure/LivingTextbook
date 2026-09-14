import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-selection-engine-"));

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
    "--rootDir", join(root, "apps", "web", "src"),
    "--outDir", output,
    "apps/web/src/features/game-shell/selection/selectionEngineAdapter.ts",
  ], { cwd: root, encoding: "utf8" });

  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    process.exit(1);
  }

  const engine = require(join(output, "features", "game-shell", "selection", "selectionEngineAdapter.js"));
  const unit = {
    unitMeta: {
      tenantId: "selection-runtime",
      curriculumId: "starter-english",
      level: 1,
      unitNumber: 1,
      theme: "Greetings",
      engineId: "selection",
    },
    pedagogicalPayload: {
      vocabularyTerms: ["hello", "goodbye", "teacher", "friend", "morning", "afternoon", "please", "thank you"],
      targetSentences: ["Hello, teacher.", "Thank you, friend."],
    },
  };

  const first = engine.buildSelectionEnginePreview(unit);
  const second = engine.buildSelectionEnginePreview(unit);
  assert(JSON.stringify(first) === JSON.stringify(second), "selection preview must be deterministic");
  assert(first.engineId === "selection", "selection preview must identify its parent engine");
  assert(first.audioRequired === true, "selection preview must require audio");
  assert(first.rounds.length === 4, "selection preview must contain three vocabulary rounds and one syntax round");
  assert(first.rounds.slice(0, 3).every((round) => round.skillFocus === "vocabulary"), "leading selection rounds must target vocabulary");
  assert(first.rounds[3]?.skillFocus === "syntax", "final selection round must target syntax");

  for (const round of first.rounds) {
    assert(round.promptText.trim().length > 0, `${round.roundId} must have prompt text`);
    assert(round.promptAudioText.trim().length > 0, `${round.roundId} must have prompt audio text`);
    assert(round.options.length >= 2, `${round.roundId} must have at least two options`);
    assert(new Set(round.options.map((option) => option.optionId)).size === round.options.length, `${round.roundId} option ids must be unique`);
    assert(round.options.filter((option) => option.isCorrect).length === 1, `${round.roundId} must have exactly one correct option`);
    assert(round.options.some((option) => option.optionId === round.correctOptionId && option.isCorrect), `${round.roundId} correct option must be explicit`);
    assert(round.options.every((option) => option.label.trim().length > 0 && option.audioText.trim().length > 0), `${round.roundId} options must carry text and audio`);
    assert(round.expectedEvents.includes("round_shown"), `${round.roundId} must expect round evidence`);
    assert(round.expectedEvents.includes("answer_submitted"), `${round.roundId} must expect submission evidence`);
    assert(round.expectedEvents.includes("answer_result"), `${round.roundId} must expect result evidence`);
  }

  assert(first.rounds[3].expectedEvents.includes("mastery_updated"), "syntax selection must expect mastery evidence");
  assert(first.standardEvents.includes("game_started"), "selection contract must include game start evidence");
  assert(first.standardEvents.includes("game_completed"), "selection contract must include completion evidence");

  console.log("PASS selection engine runtime covers deterministic rounds, unique options, single-answer correctness, prompt/option audio, syntax coverage, and shared event expectations.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
