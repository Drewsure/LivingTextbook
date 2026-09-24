import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-pairing-engine-"));

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
    "apps/web/src/features/game-shell/pairing/pairingEngineState.ts",
  ], { cwd: root, encoding: "utf8" });

  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    process.exit(1);
  }

  const engine = require(join(output, "features", "game-shell", "pairing", "pairingEngineState.js"));
  const items = [
    { id: "pair-1", sourceText: "hello", targetText: "hello", termIndex: 0 },
    { id: "pair-2", sourceText: "friend", targetText: "friend", termIndex: 1 },
  ];
  const initial = engine.createPairingEngineState(items);
  assert(initial.cards.length === 4, "two vocabulary pairs must create four cards");
  assert(initial.completed === false, "non-empty pairing state cannot start completed");
  assert(engine.getPairingProgressSummary(initial).remainingPairs === 2, "initial progress must expose two remaining pairs");

  const duplicateSelection = engine.selectPairingCard(initial, "pair-1:source");
  assert(duplicateSelection.result === "selected", "first card selection must be recorded");
  const ignoredDuplicate = engine.selectPairingCard(duplicateSelection.state, "pair-1:source");
  assert(ignoredDuplicate.result === "ignored", "selecting the same card twice must be ignored");

  const mismatchFirst = engine.selectPairingCard(initial, "pair-1:source");
  const mismatch = engine.selectPairingCard(mismatchFirst.state, "pair-2:target");
  assert(mismatch.result === "mismatched", "cross-pair selection must be reported as a mismatch");
  assert(mismatch.state.attempts === 1, "a mismatch must count exactly one attempt");
  assert(mismatch.state.matchedPairIds.length === 0, "a mismatch must not mark a pair matched");
  assert(mismatch.state.selectedCardIds.length === 0, "a mismatch must clear the selection");

  const matchOneFirst = engine.selectPairingCard(mismatch.state, "pair-1:source");
  const matchOne = engine.selectPairingCard(matchOneFirst.state, "pair-1:target");
  assert(matchOne.result === "matched", "correct source/target selection must match");
  assert(matchOne.state.attempts === 2, "the first correct pair must preserve attempt count");
  assert(matchOne.state.matchedPairIds.length === 1, "the first correct pair must be recorded");
  assert(matchOne.state.cards.filter((card) => card.status === "matched").length === 2, "both cards must be marked matched");

  const matchTwoFirst = engine.selectPairingCard(matchOne.state, "pair-2:source");
  const complete = engine.selectPairingCard(matchTwoFirst.state, "pair-2:target");
  assert(complete.result === "matched", "the final correct pair must match");
  assert(complete.state.completed === true, "all pairs must complete the engine");
  assert(engine.getPairingProgressSummary(complete.state).remainingPairs === 0, "completed progress must have no remaining pairs");
  assert(engine.getPairingProgressSummary(complete.state).attempts === 3, "progress must retain deterministic attempts");
  assert(engine.selectPairingCard(complete.state, "pair-1:source").result === "ignored", "completed engine must ignore later taps");

  const memoryMatchSource = readSource(join(root, "apps", "web", "src", "features", "game-shell", "pairing", "PairingMemoryMatchGame.tsx"));
  assert(memoryMatchSource.includes("firstKey - secondKey || first.id.localeCompare(second.id)"), "Memory Match seeded ordering must use an explicit card-id tie-breaker");

  const empty = engine.createPairingEngineState([]);
  assert(empty.completed === true, "empty pairing state must be terminal");
  assert(engine.getPairingProgressSummary(empty).totalPairs === 0, "empty progress must report zero pairs");

  console.log("PASS pairing engine runtime covers selection, duplicate taps, mismatch recovery, deterministic matching, completion, terminal retry safety, and progress summaries.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readSource(path) {
  return require("node:fs").readFileSync(path, "utf8");
}
