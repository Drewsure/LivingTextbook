import { createHash } from "node:crypto";
import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative, resolve } from "node:path";

const candidateRootValue = process.env.LIVING_TEXTBOOOK_ZAI_CANDIDATE_ROOT;
if (!candidateRootValue) {
  console.error("NOT READY No candidate package supplied. Set LIVING_TEXTBOOOK_ZAI_CANDIDATE_ROOT to the isolated return folder.");
  process.exit(2);
}

const candidateRootInput = resolve(candidateRootValue);
if (!existsSync(candidateRootInput)) {
  fail(`Candidate package root does not exist: ${candidateRootInput}.`);
}

const repositoryRoot = realpathSync(resolve(fileURLToPath(new URL("..", import.meta.url))));
const candidateRoot = realpathSync(candidateRootInput);
if (isWithin(repositoryRoot, candidateRoot)) {
  fail(`Candidate package must be stored outside the LivingTextbook repository: ${candidateRoot}.`);
}

const returnPackagePath = join(candidateRoot, "evidence", "return-package.json");
if (!isRegularFile(returnPackagePath)) {
  fail(`Candidate package must contain evidence/return-package.json under ${candidateRoot}.`);
}
const returnPackageRealPath = realpathSync(returnPackagePath);
if (!isWithin(candidateRoot, returnPackageRealPath)) {
  fail("Candidate evidence/return-package.json must resolve inside the isolated candidate root.");
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(returnPackageRealPath, "utf8"));
} catch (error) {
  fail(`Candidate return-package.json is not valid JSON: ${error.message}`);
}

if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
  fail("Candidate return-package.json must contain a JSON object.");
}

const failures = [];
let candidateProfileData = [];
try {
  candidateProfileData = JSON.parse(
    readFileSync(new URL("../packages/content-model/src/phaserCandidateProfiles.json", import.meta.url), "utf8"),
  );
} catch (error) {
  failures.push(`Shared Phaser candidate profile manifest is not valid JSON: ${error.message}`);
}
const candidateProfiles = Array.isArray(candidateProfileData)
  ? Object.fromEntries(candidateProfileData.map((profile) => [profile.targetMode, profile]))
  : {};
validateCandidateProfiles(candidateProfileData);
const requiredArtifactKinds = [
  "source-archive",
  "fixture",
  "readme",
  "event-replay",
  "audio-coverage",
  "scoring-replay",
  "mobile-evidence",
  "wrapper-notes",
];
const requiredBlockedActions = [
  "No archive import",
  "No direct file copy into apps/web",
  "No direct file copy into apps/ai-service",
  "No active route replacement",
  "No scoring mutation",
  "No audio manifest mutation",
  "No package promotion",
  "No student assignment",
];

requireValue(manifest.sourceRepository === "Drewsure/ministar-lab", "sourceRepository must be Drewsure/ministar-lab.");
requireValue(manifest.sourceSnapshotId === "frozen-2026-09-12-aaa-stable", "sourceSnapshotId must be the immutable frozen snapshot tag.");
requireValue(manifest.sourceCommitSha === "eb79ddf5940ab47cc3c45c119c67ee1b6b958e55", "sourceCommitSha must match the frozen source commit.");
const candidateProfile = candidateProfiles[manifest.targetMode];
requireValue(Boolean(candidateProfile), `targetMode must be one of the approved candidate profiles: ${Object.keys(candidateProfiles).join(", ")}.`);
if (candidateProfile) {
  requireValue(manifest.parentEngine === candidateProfile.parentEngine, `parentEngine must be ${candidateProfile.parentEngine} for ${manifest.targetMode}.`);
}
requireValue(manifest.targetSurface === "phaser" || manifest.targetSurface === "hybrid", "targetSurface must be phaser or hybrid.");
requireValue(["review-only", "blocked"].includes(manifest.status), "status must remain review-only or blocked.");
requireValue(isNonBlankString(manifest.tenantId), "tenantId is required.");
requireValue(isNonBlankString(manifest.requestId), "requestId is required.");
requireValue(isNonBlankString(manifest.queueItemId), "queueItemId is required.");
requireValue(isNonBlankString(manifest.prototypeFolder), "prototypeFolder is required.");
requireValue(isSafeRelativePath(manifest.prototypeFolder), "prototypeFolder must be a safe relative path.");

const artifacts = Array.isArray(manifest.artifacts) ? manifest.artifacts : [];
requireValue(artifacts.length === requiredArtifactKinds.length, `artifacts must contain exactly ${requiredArtifactKinds.length} entries.`);

const seenKinds = new Set();
const seenIds = new Set();
const seenArtifactPaths = new Set();
for (const artifact of artifacts) {
  if (!artifact || typeof artifact !== "object") {
    failures.push("Every artifact must be a JSON object.");
    continue;
  }

  if (!requiredArtifactKinds.includes(artifact.kind)) failures.push(`Unsupported artifact kind: ${artifact.kind || "(missing)"}.`);
  if (seenKinds.has(artifact.kind)) failures.push(`Artifact kind is repeated: ${artifact.kind}.`);
  seenKinds.add(artifact.kind);
  if (!isNonBlankString(artifact.artifactId)) failures.push("Every artifact requires artifactId.");
  if (seenIds.has(artifact.artifactId)) failures.push(`Artifact id is repeated: ${artifact.artifactId}.`);
  seenIds.add(artifact.artifactId);
  if (seenArtifactPaths.has(artifact.relativePath)) failures.push(`Artifact path is repeated: ${artifact.relativePath}.`);
  seenArtifactPaths.add(artifact.relativePath);
  if (artifact.status !== "reviewed") failures.push(`Artifact ${artifact.artifactId || artifact.kind} must be marked reviewed.`);
  if (!/^[0-9a-f]{64}$/i.test(artifact.checksum || "")) {
    failures.push(`Artifact ${artifact.artifactId || artifact.kind} requires a SHA-256 checksum.`);
    continue;
  }
  if (!isSafeRelativePath(artifact.relativePath)) {
    failures.push(`Artifact ${artifact.artifactId || artifact.kind} requires a safe relative path.`);
    continue;
  }

  const artifactPath = resolve(candidateRoot, artifact.relativePath);
  if (!isWithin(candidateRoot, artifactPath)) {
    failures.push(`Artifact ${artifact.artifactId || artifact.kind} resolves outside the candidate root.`);
    continue;
  }
  if (!isRegularFile(artifactPath)) {
    failures.push(`Artifact ${artifact.artifactId || artifact.kind} is missing at ${artifact.relativePath}.`);
    continue;
  }
  const artifactRealPath = realpathSync(artifactPath);
  if (!isWithin(candidateRoot, artifactRealPath)) {
    failures.push(`Artifact ${artifact.artifactId || artifact.kind} resolves outside the isolated candidate root.`);
    continue;
  }
  const actualChecksum = createHash("sha256").update(readFileSync(artifactRealPath)).digest("hex");
  if (actualChecksum !== artifact.checksum.toLowerCase()) {
    failures.push(`Artifact ${artifact.artifactId || artifact.kind} checksum mismatch: expected ${artifact.checksum}, found ${actualChecksum}.`);
  }
}

for (const kind of requiredArtifactKinds) {
  if (!seenKinds.has(kind)) failures.push(`Required artifact kind is missing: ${kind}.`);
}

const artifactPaths = new Map(artifacts.map((artifact) => [artifact.kind, artifact.relativePath]));
validateFixture(readJsonArtifact("fixture"));
validateEventReplay(readJsonArtifact("event-replay"));
validateAudioCoverage(readJsonArtifact("audio-coverage"), readJsonArtifact("fixture"));
validateScoringReplay(readJsonArtifact("scoring-replay"));
validateSourceManifest(readTextArtifact("source-archive"));
validateAccessibility(readTextArtifact("mobile-evidence"));
validateWrapperNotes(readTextArtifact("wrapper-notes"));
validateReadme(readTextArtifact("readme"));

const blockedActions = Array.isArray(manifest.blockedActions) ? manifest.blockedActions : [];
for (const action of requiredBlockedActions) {
  if (!blockedActions.includes(action)) failures.push(`Missing blocked action: ${action}.`);
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`PASS ${candidateProfile?.label ?? "Phaser candidate"} package is hash-verified, frozen-source-bound, and remains review-only (${relative(candidateRoot, returnPackagePath)}).`);

function readJsonArtifact(kind) {
  const absolutePath = resolveArtifactReadPath(kind);
  if (!absolutePath) return undefined;

  try {
    return JSON.parse(readFileSync(absolutePath, "utf8"));
  } catch (error) {
    failures.push(`${kind} artifact must contain valid JSON: ${error.message}`);
    return undefined;
  }
}

function readTextArtifact(kind) {
  const absolutePath = resolveArtifactReadPath(kind);
  if (!absolutePath) return "";
  return readFileSync(absolutePath, "utf8");
}

function resolveArtifactReadPath(kind) {
  const artifactPath = artifactPaths.get(kind);
  if (!isSafeRelativePath(artifactPath)) return undefined;
  const absolutePath = resolve(candidateRoot, artifactPath);
  if (!isRegularFile(absolutePath)) return undefined;
  const realPath = realpathSync(absolutePath);
  return isWithin(candidateRoot, realPath) ? realPath : undefined;
}

function validateFixture(fixture) {
  const meta = fixture?.unit_meta;
  const payload = fixture?.pedagogical_payload;
  requireValue(isNonBlankString(meta?.tenant_id), "fixture unit_meta.tenant_id is required.");
  requireValue(meta?.tenant_id === manifest.tenantId, "fixture tenant_id must match the return package tenantId.");
  requireValue(meta?.game_mode === manifest.targetMode, `fixture unit_meta.game_mode must be ${manifest.targetMode}.`);
  requireValue(meta?.engine_id === manifest.parentEngine, `fixture unit_meta.engine_id must be ${manifest.parentEngine}.`);

  const terms = Array.isArray(payload?.vocabulary_terms) ? payload.vocabulary_terms : [];
  const sentences = Array.isArray(payload?.target_sentences) ? payload.target_sentences : [];
  requireValue(terms.length >= 8 && terms.length <= 12, "fixture must contain 8-12 vocabulary_terms.");
  requireValue(new Set(terms.map((term) => String(term).trim().toLowerCase())).size === terms.length, "fixture vocabulary_terms must be unique.");
  requireValue(terms.every(isNonBlankString), "fixture vocabulary_terms must be non-blank strings.");
  requireValue(sentences.length === 2, "fixture must contain exactly two target_sentences.");
  requireValue(sentences.every(isNonBlankString), "fixture target_sentences must be non-blank strings.");
}

function validateCandidateProfiles(profiles) {
  requireValue(Array.isArray(profiles) && profiles.length > 0, "Shared Phaser candidate profile manifest must be a non-empty array.");
  const seenModes = new Set();
  const validParentEngines = new Set(["pairing", "selection", "text-spelling", "narrative"]);
  for (const profile of Array.isArray(profiles) ? profiles : []) {
    requireValue(isNonBlankString(profile?.targetMode), "Every Phaser candidate profile requires targetMode.");
    requireValue(!seenModes.has(profile?.targetMode), `Phaser candidate profile targetMode is repeated: ${profile?.targetMode || "(missing)"}.`);
    seenModes.add(profile?.targetMode);
    requireValue(isNonBlankString(profile?.label), `Phaser candidate profile ${profile?.targetMode || "(unnamed)"} requires label.`);
    requireValue(validParentEngines.has(profile?.parentEngine), `Phaser candidate profile ${profile?.targetMode || "(unnamed)"} requires a supported parent engine.`);
    const scenarios = Array.isArray(profile?.requiredScenarios) ? profile.requiredScenarios : [];
    requireValue(scenarios.length >= 4, `Phaser candidate profile ${profile?.targetMode || "(unnamed)"} requires at least four scoring scenarios.`);
    requireValue(scenarios.every(isNonBlankString), `Phaser candidate profile ${profile?.targetMode || "(unnamed)"} requires non-blank scoring scenarios.`);
    requireValue(new Set(scenarios).size === scenarios.length, `Phaser candidate profile ${profile?.targetMode || "(unnamed)"} requires unique scoring scenarios.`);
  }
}

function validateEventReplay(replay) {
  const events = Array.isArray(replay) ? replay : replay?.events;
  requireValue(Array.isArray(events) && events.length > 0, "event-replay artifact must contain a non-empty events array.");
  if (!Array.isArray(events) || events.length === 0) return;

  let identity;
  for (const event of events) {
    requireValue(isNonBlankString(event?.unitKey), `event ${event?.type || "(unnamed)"} must include unitKey.`);
    requireValue(isNonBlankString(event?.launchCode), `event ${event?.type || "(unnamed)"} must include launchCode.`);
    requireValue(isNonBlankString(event?.studentSessionId), `event ${event?.type || "(unnamed)"} must include studentSessionId.`);
    requireValue(event?.gameMode === manifest.targetMode, `event ${event?.type || "(unnamed)"} must use gameMode ${manifest.targetMode}.`);
    requireValue(event?.metadata?.tenantId === manifest.tenantId, `event ${event?.type || "(unnamed)"} must include the package tenantId.`);
    requireValue(isNonBlankString(event?.metadata?.replaySeed) && event.metadata.replaySeed.startsWith("replay-v1:"), `event ${event?.type || "(unnamed)"} must include replay-v1 evidence.`);

    const eventIdentity = {
      unitKey: event?.unitKey,
      launchCode: event?.launchCode,
      studentSessionId: event?.studentSessionId,
      tenantId: event?.metadata?.tenantId,
      replaySeed: event?.metadata?.replaySeed,
    };
    if (!identity) {
      identity = eventIdentity;
    } else {
      for (const key of Object.keys(identity)) {
        requireValue(eventIdentity[key] === identity[key], `event ${event?.type || "(unnamed)"} must preserve the replay identity field ${key}.`);
      }
    }
  }

  const requiredTypes = ["game_started", "round_shown", "answer_submitted", "answer_result", "mastery_updated", "game_completed"];
  const indexes = new Map();
  for (const type of requiredTypes) {
    const matchingEvents = events.filter((event) => event?.type === type);
    const index = events.findIndex((event) => event?.type === type);
    requireValue(index >= 0, `event replay must include ${type}.`);
    requireValue(matchingEvents.length === 1, `event replay must contain exactly one ${type}.`);
    indexes.set(type, index);
  }
  requireValue(events.some((event) => event?.type === "audio_requested"), "event replay must include audio_requested.");
  const gameStartedIndex = events.findIndex((event) => event?.type === "game_started");
  requireValue(
    events.some((event, index) => event?.type === "audio_requested" && index > gameStartedIndex),
    "event replay must include audio_requested after game_started.",
  );
  const roundShownIndex = events.findIndex((event) => event?.type === "round_shown");
  requireValue(
    events.some((event, index) => event?.type === "audio_requested" && index > roundShownIndex),
    "event replay must include audio_requested after round_shown.",
  );

  for (let index = 1; index < events.length; index += 1) {
    const previous = eventTime(events[index - 1]);
    const current = eventTime(events[index]);
    requireValue(previous !== undefined && current !== undefined, "event replay timestamps must be valid ISO timestamps or finite numbers.");
    if (previous !== undefined && current !== undefined) {
      requireValue(current >= previous, "event replay timestamps must be nondecreasing.");
    }
  }

  for (const [type, index] of indexes) {
    if (index < 0) continue;
    const event = events[index];
    requireValue(isNonBlankString(event?.metadata?.scoringProfileId) || !["mastery_updated", "game_completed"].includes(type), `event ${type} must identify its deterministic scoring profile.`);
  }

  for (let index = 1; index < requiredTypes.length; index += 1) {
    const previousIndex = indexes.get(requiredTypes[index - 1]);
    const currentIndex = indexes.get(requiredTypes[index]);
    if (previousIndex >= 0 && currentIndex >= 0) {
      requireValue(currentIndex > previousIndex, `event replay must place ${requiredTypes[index]} after ${requiredTypes[index - 1]}.`);
    }
  }

  for (const event of events.filter((candidate) => candidate?.type === "audio_requested")) {
    requireValue(isNonBlankString(event?.metadata?.cueText), "audio_requested events must include cueText.");
    requireValue(isNonBlankString(event?.metadata?.language), "audio_requested events must include language.");
    requireValue(["term", "sentence", "instruction", "feedback"].includes(event?.metadata?.cueKind), "audio_requested events must include a supported cueKind.");
  }

  const masteryEvent = events.find((event) => event?.type === "mastery_updated");
  const completionEvent = events.find((event) => event?.type === "game_completed");
  if (masteryEvent && completionEvent) {
    requireValue(
      masteryEvent.metadata?.scoringProfileId === completionEvent.metadata?.scoringProfileId,
      "mastery_updated and game_completed must use the same deterministic scoring profile.",
    );
  }
  requireValue(masteryEvent?.metadata?.completed === true, "mastery_updated must mark the game completed.");
  for (const event of [masteryEvent, completionEvent]) {
    if (event) {
      const earnedStarDust = event.metadata?.earnedStarDust;
      requireValue(Number.isInteger(earnedStarDust) && earnedStarDust >= 0 && earnedStarDust <= 1000, `${event.type} must include earnedStarDust from 0 to 1000.`);
    }
  }
  requireValue(
    events.filter((event) => event?.type === "answer_submitted").length === events.filter((event) => event?.type === "answer_result").length,
    "event replay must pair answer_submitted and answer_result events.",
  );
}

function validateAudioCoverage(audioMap, fixture) {
  const cues = Array.isArray(audioMap?.cues) ? audioMap.cues : [];
  const terms = Array.isArray(fixture?.pedagogical_payload?.vocabulary_terms) ? fixture.pedagogical_payload.vocabulary_terms : [];
  requireValue(cues.length > 0, "audio-coverage artifact must contain a non-empty cues array.");
  const cueTexts = new Set(cues.map((cue) => String(cue?.text ?? "").trim().toLowerCase()));
  for (const term of terms) {
    requireValue(cueTexts.has(String(term).trim().toLowerCase()), `audio coverage must include the vocabulary term: ${term}.`);
  }
  for (const kind of ["instruction", "feedback"]) {
    requireValue(cues.some((cue) => cue?.kind === kind), `audio coverage must include a ${kind} cue.`);
  }
  requireValue(cues.some((cue) => cue?.kind === "critical-control" || cue?.kind === "control"), "audio coverage must include a critical-control cue.");
  requireValue(cues.every((cue) => isNonBlankString(cue?.language) && isNonBlankString(cue?.text)), "audio coverage cues require language and text.");
  requireValue(cues.every((cue) => cue?.reviewed === true || cue?.status === "reviewed"), "audio coverage cues must be marked reviewed.");
}

function validateScoringReplay(replay) {
  const scenarios = Array.isArray(replay?.scenarios) ? replay.scenarios : [];
  const requiredScenarioIds = candidateProfile?.requiredScenarios ?? [];
  requireValue(replay?.deterministic === true, "scoring-replay artifact must mark deterministic true.");
  requireValue(replay?.randomRewards === false, "scoring-replay artifact must mark randomRewards false.");
  for (const scenarioId of requiredScenarioIds) {
    requireValue(scenarios.some((scenario) => scenario?.scenarioId === scenarioId), `scoring replay must include the ${scenarioId} scenario.`);
  }
  requireValue(scenarios.every((scenario) => isNonBlankString(scenario?.expectedOutcome)), "scoring replay scenarios require expectedOutcome.");
}

function validateSourceManifest(sourceManifest) {
  const lines = sourceManifest.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  requireValue(lines.length > 0, "source-manifest.sha256 must list at least one source file.");
  for (const line of lines) {
    const match = line.match(/^([0-9a-f]{64})\s+(.+)$/i);
    requireValue(Boolean(match), "source-manifest.sha256 lines must use '<sha256>  <safe-relative-path>'.");
    if (match) {
      requireValue(isSafeRelativePath(match[2]), `source manifest path must be safe: ${match[2]}.`);
    }
  }
}

function validateAccessibility(accessibility) {
  const normalized = accessibility.toLowerCase();
  for (const marker of ["keyboard", "focus", "touch", "reduced motion", "readable", "small-screen"]) {
    requireValue(normalized.includes(marker), `mobile/accessibility evidence must cover ${marker}.`);
  }
}

function validateWrapperNotes(notes) {
  const normalized = notes.toLowerCase();
  for (const marker of ["phaser", "lifecycle", "canonical", "score", "persistence", "reporting", "no direct source import"]) {
    requireValue(normalized.includes(marker), `wrapper notes must address ${marker}.`);
  }
}

function validateReadme(readme) {
  const normalized = readme.toLowerCase();
  for (const marker of ["setup", "controls", "dependencies", "known limits", "wrapper"]) {
    requireValue(normalized.includes(marker), `README must include ${marker}.`);
  }
}

function eventTime(event) {
  if (typeof event?.occurredAt === "string") {
    const time = Date.parse(event.occurredAt);
    return Number.isFinite(time) ? time : undefined;
  }
  return typeof event?.timestamp === "number" && Number.isFinite(event.timestamp) ? event.timestamp : undefined;
}

function requireValue(condition, message) {
  if (!condition) failures.push(message);
}

function isNonBlankString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isSafeRelativePath(value) {
  return (
    isNonBlankString(value) &&
    !value.startsWith("/") &&
    !value.includes("..") &&
    !value.includes("\\") &&
    !value.includes(":")
  );
}

function isWithin(root, target) {
  const relativePath = relative(root, target);
  return relativePath === "" || (relativePath !== ".." && !relativePath.startsWith("..\\") && !relativePath.startsWith("../") && !relativePath.includes(":"));
}

function isRegularFile(path) {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exit(1);
}
