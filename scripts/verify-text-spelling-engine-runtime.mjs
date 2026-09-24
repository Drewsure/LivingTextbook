import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-text-spelling-engine-"));

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  const contentModelPackage = join(output, "node_modules", "@living-textbook", "content-model");
  mkdirSync(contentModelPackage, { recursive: true });
  writeFileSync(
    join(contentModelPackage, "package.json"),
    '{"name":"@living-textbook/content-model","main":"../../../packages/content-model/src/index.js","type":"commonjs"}\n',
    "utf8",
  );
  const tsc = join(root, "node_modules", "typescript", "bin", "tsc");
  const compile = spawnSync(process.execPath, [
    tsc,
    "--module", "commonjs",
    "--target", "ES2022",
    "--moduleResolution", "node",
    "--resolveJsonModule",
    "--esModuleInterop",
    "--skipLibCheck",
    "--rootDir", root,
    "--outDir", output,
    "apps/web/src/features/game-shell/text-spelling/textSpellingEngineAdapter.ts",
    "packages/content-model/src/index.ts",
  ], { cwd: root, encoding: "utf8" });

  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    process.exit(1);
  }

  const engine = require(join(output, "apps", "web", "src", "features", "game-shell", "text-spelling", "textSpellingEngineAdapter.js"));
  const fillInBlankSource = readFileSync(
    join(root, "apps", "web", "src", "features", "game-shell", "text-spelling", "FillInBlankPracticeGame.tsx"),
    "utf8",
  );
  const unit = {
    unitMeta: {
      tenantId: "text-spelling-runtime",
      curriculumId: "starter-english",
      level: 1,
      unitNumber: 1,
      theme: "Greetings",
      engineId: "text-spelling",
    },
    pedagogicalPayload: {
      vocabularyTerms: ["hello", "goodbye", "teacher", "friend", "morning", "afternoon", "please", "thank you"],
      targetSentences: ["Hello, teacher.", "Thank you, friend!"],
    },
  };

  const first = engine.buildSentenceBuilderPreview(unit);
  const second = engine.buildSentenceBuilderPreview(unit);
  assert(JSON.stringify(first) === JSON.stringify(second), "text/spelling preview must be deterministic");
  assert(first.engineId === "text-spelling", "preview must identify the text/spelling parent engine");
  assert(first.audioRequired === true, "text/spelling preview must require audio");
  assert(first.rounds.length === 2, "Sentence Builder must consume exactly two target sentences");
  assert(typeof first.scoringProfileId === "string" && first.scoringProfileId.length > 0, "preview must carry a scoring profile");
  assert(first.standardEvents.includes("game_started"), "text/spelling contract must include game start evidence");
  assert(first.standardEvents.includes("mastery_updated"), "text/spelling contract must include mastery evidence");
  assert(first.standardEvents.includes("game_completed"), "text/spelling contract must include completion evidence");

  for (const [roundIndex, round] of first.rounds.entries()) {
    assert(round.modeId === "sentence-builder", `${round.roundId} must use Sentence Builder mode`);
    assert(round.promptText === "Build the sentence.", `${round.roundId} must use the shared instruction`);
    assert(round.promptAudioText === round.targetSentence, `${round.roundId} prompt audio must be the target sentence`);
    assert(round.tiles.length >= 2, `${round.roundId} must contain at least two word tiles`);
    assert(JSON.stringify(round.expectedAnswer) === JSON.stringify(round.tiles.map((tile) => tile.label)), `${round.roundId} expected answer must follow tile labels`);
    assert(new Set(round.tiles.map((tile) => tile.tileId)).size === round.tiles.length, `${round.roundId} tile ids must be unique`);
    assert(round.tiles.every((tile, tileIndex) => tile.expectedOrder === tileIndex + 1), `${round.roundId} tile order must be sequential`);
    assert(round.tiles.every((tile) => tile.label.trim().length > 0 && tile.audioText.trim().length > 0), `${round.roundId} tiles must carry text and audio`);
    assert(round.expectedEvents.includes("round_shown"), `${round.roundId} must expect round evidence`);
    assert(round.expectedEvents.includes("answer_submitted"), `${round.roundId} must expect submission evidence`);
    assert(round.expectedEvents.includes("answer_result"), `${round.roundId} must expect result evidence`);
    assert(round.roundId === `sentence-builder-${roundIndex + 1}`, `${roundIndex + 1} round id must be stable`);
  }

  assert(first.rounds[0].expectedAnswer.join(" ") === "Hello, teacher", "terminal punctuation must not become a tile");
  assert(first.rounds[1].expectedAnswer.join(" ") === "Thank you, friend", "terminal exclamation punctuation must not become a tile");

  const collisionUnit = {
    ...unit,
    pedagogicalPayload: {
      ...unit.pedagogicalPayload,
      targetSentences: ["Ice cream, ice-cream.", "Hello/hello hello-hello."],
    },
  };
  const collisionPreview = engine.buildSentenceBuilderPreview(collisionUnit);
  for (const round of collisionPreview.rounds) {
    assert(new Set(round.tiles.map((tile) => tile.tileId)).size === round.tiles.length, `${round.roundId} must keep position-based tile ids unique for punctuation variants`);
    assert(round.tiles.every((tile, tileIndex) => tile.tileId === `sentence-${round.roundId.split("-").at(-1)}-tile-${tileIndex + 1}`), `${round.roundId} tile ids must be position-based`);
  }
  assert(fillInBlankSource.includes("choiceId: string"), "Fill in the Blank choices must declare explicit identity");
  assert(fillInBlankSource.includes("key={choice.choiceId}"), "Fill in the Blank must render choices by explicit identity");
  assert(!fillInBlankSource.includes("key={choice}"), "Fill in the Blank must not use answer labels as React identity");

  console.log("PASS text/spelling engine runtime covers two-sentence input, deterministic position-based tile identity, punctuation handling, explicit choice identity, tile audio, scoring identity, and shared event expectations.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
