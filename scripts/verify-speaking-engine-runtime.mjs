import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-speaking-engine-"));

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
    "apps/web/src/features/game-shell/speaking/speakingEngineAdapter.ts",
  ], { cwd: root, encoding: "utf8" });

  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    process.exit(1);
  }

  const engine = require(join(output, "features", "game-shell", "speaking", "speakingEngineAdapter.js"));
  const unit = {
    pedagogicalPayload: {
      vocabularyTerms: ["hello", "goodbye", "teacher", "friend", "morning", "afternoon", "please", "thank you"],
      targetSentences: ["Hello, teacher.", "Thank you, friend."],
    },
  };
  const audioCues = [
    { kind: "term", text: " Hello ", language: "en" },
    { kind: "term", text: "hello", language: "en", gameMode: "speak-it", sourceUri: "reviewed-speak-it-hello.mp3" },
    { kind: "sentence", text: "hello, teacher.", language: "en" },
  ];

  const first = engine.buildSpeakItPrompts(unit, audioCues);
  const second = engine.buildSpeakItPrompts(unit, audioCues);
  assert(JSON.stringify(first) === JSON.stringify(second), "speaking prompts must be deterministic");
  assert(first.length === 10, "speaking engine must expose all eight terms and two target sentences");
  assert(first.slice(0, 8).every((prompt) => prompt.kind === "term"), "term prompts must come first");
  assert(first.slice(8).every((prompt) => prompt.kind === "sentence"), "sentence prompts must follow term prompts");
  assert(first.every((prompt) => prompt.id.length > 0 && prompt.label.trim().length > 0), "every speech prompt needs stable identity and text");
  assert(first[0].audioCue?.sourceUri === "reviewed-speak-it-hello.mp3", "game-specific term audio must outrank a generic cue");
  assert(first[8].audioCue?.text === "hello, teacher.", "sentence cue matching must be trim/case insensitive");
  assert(first[1].audioCue === undefined, "uncued terms must remain explicit without invented audio assets");
  assert(first[9].label === "Thank you, friend.", "sentence prompt text must remain the reviewed target sentence");
  assert(new Set(first.map((prompt) => prompt.id)).size === first.length, "speaking prompt ids must be unique");

  const collisionUnit = {
    ...unit,
    pedagogicalPayload: {
      vocabularyTerms: ["ice cream", "ice-cream", "ice/cream", "hello", "goodbye", "teacher", "friend", "morning"],
      targetSentences: ["Ice cream, ice-cream.", "Ice/cream hello-hello."],
    },
  };
  const collisionPrompts = engine.buildSpeakItPrompts(collisionUnit, []);
  assert(new Set(collisionPrompts.map((prompt) => prompt.id)).size === collisionPrompts.length, "speaking prompt ids must remain unique for label variants");
  assert(collisionPrompts[0].id === "speak-term:1" && collisionPrompts[1].id === "speak-term:2", "speaking prompt ids must be position-based");

  console.log("PASS speaking engine runtime covers deterministic position-based prompts, reviewed text preservation, game-specific cue priority, and case/whitespace-safe audio cue matching.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
