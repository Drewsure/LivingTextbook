import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join, relative, resolve } from "node:path";

const candidateValue = process.env.LIVING_TEXTBOOOK_ZAI_CANDIDATE_ROOT;
if (!candidateValue || /<[^>]+>|path[\\/]to|returned-package-folder/i.test(candidateValue)) {
  fail("Set LIVING_TEXTBOOOK_ZAI_CANDIDATE_ROOT to the absolute isolated returned-package folder.");
}

const repositoryRoot = realpathSync(resolve(fileURLToPath(new URL("..", import.meta.url))));
const candidateRoot = realpathOrFail(resolve(candidateValue));
if (isWithin(repositoryRoot, candidateRoot)) fail("The candidate must remain outside the LivingTextbook repository.");

const packageCheck = spawnSync(process.execPath, [fileURLToPath(new URL("./verify-phaser-candidate-package.mjs", import.meta.url))], {
  env: { ...process.env, LIVING_TEXTBOOOK_ZAI_CANDIDATE_ROOT: candidateRoot },
  encoding: "utf8",
});
if (packageCheck.status !== 0) {
  process.stdout.write(packageCheck.stdout ?? "");
  process.stderr.write(packageCheck.stderr ?? "");
  fail("The candidate package must pass the hash and frozen-source package verifier before wrapper evidence can be checked.");
}

const manifest = readJson(join(candidateRoot, "evidence", "return-package.json"));
const fixture = readJson(resolveArtifact(candidateRoot, manifest, "fixture"));
const eventReplay = readJson(resolveArtifact(candidateRoot, manifest, "event-replay"));
const scoringReplay = readJson(resolveArtifact(candidateRoot, manifest, "scoring-replay"));
const audioCoverage = readJson(resolveArtifact(candidateRoot, manifest, "audio-coverage"));
const wrapperNotes = readText(resolveArtifact(candidateRoot, manifest, "wrapper-notes"));
const accessibility = readText(resolveArtifact(candidateRoot, manifest, "mobile-evidence"));
const failures = [];

if (manifest.targetMode !== "memory-match") failures.push("targetMode must remain memory-match.");
if (manifest.parentEngine !== "pairing") failures.push("parentEngine must remain pairing.");
if (manifest.status !== "review-only") failures.push("candidate status must remain review-only.");

const terms = fixture?.pedagogical_payload?.vocabulary_terms;
const sentences = fixture?.pedagogical_payload?.target_sentences;
if (!Array.isArray(terms) || terms.length < 8 || terms.length > 12) failures.push("fixture must provide 8-12 vocabulary terms.");
if (!Array.isArray(sentences) || sentences.length !== 2) failures.push("fixture must provide exactly two target sentences.");
if (fixture?.unit_meta?.game_mode !== "memory-match" || fixture?.unit_meta?.engine_id !== "pairing") {
  failures.push("fixture must bind memory-match to the pairing engine.");
}

const events = Array.isArray(eventReplay) ? eventReplay : eventReplay?.events;
const requiredOrder = ["game_started", "round_shown", "answer_submitted", "answer_result", "mastery_updated", "game_completed"];
if (!Array.isArray(events) || events.length === 0) {
  failures.push("event replay must contain events.");
} else {
  const indexes = new Map(requiredOrder.map((type) => [type, events.findIndex((event) => event?.type === type)]));
  for (const type of requiredOrder) if (indexes.get(type) < 0) failures.push(`event replay is missing ${type}.`);
  for (let index = 1; index < requiredOrder.length; index += 1) {
    if ((indexes.get(requiredOrder[index]) ?? -1) <= (indexes.get(requiredOrder[index - 1]) ?? -1)) {
      failures.push(`event replay must place ${requiredOrder[index]} after ${requiredOrder[index - 1]}.`);
    }
  }
  const first = events[0];
  for (const event of events) {
    if (event?.gameMode !== "memory-match") failures.push(`event ${event?.type ?? "(unknown)"} must use memory-match.`);
    if (event?.metadata?.tenantId !== manifest.tenantId) failures.push(`event ${event?.type ?? "(unknown)"} must preserve package tenant identity.`);
    if (event?.unitKey !== first?.unitKey || event?.launchCode !== first?.launchCode || event?.studentSessionId !== first?.studentSessionId) {
      failures.push(`event ${event?.type ?? "(unknown)"} must preserve replay identity.`);
    }
  }
  const audioIndexes = events.map((event, index) => event?.type === "audio_requested" ? index : -1).filter((index) => index >= 0);
  if (audioIndexes.length === 0) failures.push("event replay must include audio_requested evidence.");
  if (audioIndexes.length > 0 && audioIndexes.some((index) => index <= (indexes.get("game_started") ?? -1) || index >= (indexes.get("game_completed") ?? events.length))) {
    failures.push("audio_requested evidence must remain after start/round and before completion.");
  }
  const mastery = events.find((event) => event?.type === "mastery_updated");
  const completion = events.find((event) => event?.type === "game_completed");
  checkCanonicalCompletionMetadata(mastery, "mastery_updated");
  checkCanonicalCompletionMetadata(completion, "game_completed");
  if (mastery?.metadata?.completed !== true) failures.push("mastery_updated must mark completion true.");
  if (mastery?.metadata?.earnedStarDust !== completion?.metadata?.earnedStarDust) failures.push("mastery and completion Star Dust must agree.");
  if (mastery?.metadata?.earnedStarDust > 200 || completion?.metadata?.earnedStarDust > 200) failures.push("Memory Match completion Star Dust must stay within the platform cap of 200.");
}

if (scoringReplay?.deterministic !== true) failures.push("scoring replay must mark deterministic true.");
if (scoringReplay?.randomRewards !== false) failures.push("scoring replay must mark randomRewards false.");
if (scoringReplay?.scoringProfileId !== "pairing-reinforcement-v1") failures.push("scoring replay must use pairing-reinforcement-v1.");
if (!String(scoringReplay?.ownershipNote ?? "").toLowerCase().includes("platform-owned")) failures.push("scoring replay must preserve platform-owned scoring language.");

const cueList = Array.isArray(audioCoverage?.cues) ? audioCoverage.cues : [];
if (cueList.length === 0) failures.push("audio coverage must contain reviewed cues.");
if (cueList.some((cue) => cue?.reviewed !== true && cue?.status !== "reviewed")) failures.push("every audio cue must be reviewed.");
for (const marker of ["no direct source import", "platform-owned", "persistence", "reporting"]) {
  if (!wrapperNotes.toLowerCase().includes(marker)) failures.push(`wrapper notes must address ${marker}.`);
}
if (/(?:owns|writes|calls)\s+(?:to\s+)?(?:localStorage|sessionStorage|indexeddb)/i.test(wrapperNotes)) failures.push("wrapper notes must not grant browser storage ownership.");
for (const marker of ["keyboard", "focus", "reduced motion"]) {
  if (!accessibility.toLowerCase().includes(marker)) failures.push(`accessibility evidence must address ${marker}.`);
}
if (/not implemented|known gap/i.test(accessibility)) failures.push("accessibility evidence still contains unresolved implementation gaps.");

if (failures.length > 0) {
  console.error(`BLOCKED Memory Match wrapper evidence: ${failures.length} canonical correction(s) required.`);
  for (const failure of [...new Set(failures)]) console.error(`FAIL ${failure}`);
  console.error("No source was imported, no route was changed, and no student-facing promotion is authorized.");
  process.exit(1);
}

console.log("PASS Memory Match wrapper evidence matches the canonical pairing contract. Codex decision is still required before any integration proposal.");

function checkCanonicalCompletionMetadata(event, type) {
  if (event?.metadata?.scoringProfileId !== "pairing-reinforcement-v1") failures.push(`${type} must use pairing-reinforcement-v1.`);
  if (event?.metadata?.parentEngine !== "pairing") failures.push(`${type} must identify parentEngine pairing.`);
}

function resolveArtifact(root, packageManifest, kind) {
  const artifact = packageManifest?.artifacts?.find((candidate) => candidate?.kind === kind);
  if (!artifact?.relativePath) fail(`Candidate manifest is missing the ${kind} artifact.`);
  const path = resolve(root, artifact.relativePath);
  if (!isWithin(root, path) || !isRegularFile(path)) fail(`Candidate ${kind} artifact is missing or outside the isolated root.`);
  return path;
}

function readJson(path) {
  try { return JSON.parse(readFileSync(path, "utf8")); } catch (error) { fail(`Invalid JSON at ${path}: ${error.message}`); }
}

function readText(path) { return readFileSync(path, "utf8"); }

function realpathOrFail(path) {
  if (!existsSync(path)) fail(`Candidate root does not exist: ${path}`);
  return realpathSync(path);
}

function isRegularFile(path) {
  try { return statSync(path).isFile(); } catch { return false; }
}

function isWithin(root, target) {
  const value = relative(root, target);
  return value === "" || (value !== ".." && !value.startsWith("..\\") && !value.startsWith("../") && !value.includes(":"));
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exit(1);
}
