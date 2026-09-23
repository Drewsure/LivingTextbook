import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const verifierPath = fileURLToPath(new URL("./verify-phaser-candidate-package.mjs", import.meta.url));
const candidateRoot = mkdtempSync(join(tmpdir(), "living-textbook-phaser-candidate-"));
const evidenceRoot = join(candidateRoot, "evidence");
mkdirSync(evidenceRoot, { recursive: true });

try {
  const fixture = {
    unit_meta: {
      tenant_id: "sample",
      level: 1,
      theme: "Greetings",
      game_mode: "memory-match",
      engine_id: "pairing",
    },
    pedagogical_payload: {
      vocabulary_terms: ["hello", "goodbye", "teacher", "friend", "morning", "afternoon", "please", "thank you"],
      target_sentences: ["Hello, teacher.", "Thank you, friend."],
    },
    audio_cues: [
      { kind: "term", text: "hello", language: "en" },
      { kind: "instruction", text: "Find the matching card.", language: "en" },
      { kind: "feedback", text: "Try another pair.", language: "en" },
    ],
  };

  const events = [
    event("game_started", "2026-09-14T00:00:00.000Z"),
    event("round_shown", "2026-09-14T00:00:01.000Z"),
    event("audio_requested", "2026-09-14T00:00:02.000Z", { cueKind: "instruction", cueText: "Find the matching card.", language: "en" }),
    event("answer_submitted", "2026-09-14T00:00:03.000Z"),
    event("answer_result", "2026-09-14T00:00:04.000Z", { correct: true }),
    event("mastery_updated", "2026-09-14T00:00:05.000Z", { completed: true, earnedStarDust: 100, scoringProfileId: "memory-match-foundation" }),
    event("game_completed", "2026-09-14T00:00:06.000Z", { earnedStarDust: 100, scoringProfileId: "memory-match-foundation" }),
  ];

  const artifactContents = new Map([
    ["source-archive", "d1c60fa17bf4bee63627e485ae0b096894832705fdcf173576bf3b28b8656888  src/game/scenes/MemoryMatchScene.ts\n"],
    ["fixture", JSON.stringify(fixture)],
    ["readme", "Setup\nControls\nDependencies\nKnown limits\nWrapper boundary notes\n"],
    ["event-replay", JSON.stringify({ events })],
    ["audio-coverage", JSON.stringify({ cues: [
      ...fixture.pedagogical_payload.vocabulary_terms.map((text) => ({ kind: "term", text, language: "en", reviewed: true })),
      { kind: "instruction", text: "Find the matching card.", language: "en", reviewed: true },
      { kind: "feedback", text: "Try another pair.", language: "en", reviewed: true },
      { kind: "critical-control", text: "Replay instruction.", language: "en", reviewed: true },
    ] })],
    ["scoring-replay", JSON.stringify({
      deterministic: true,
      randomRewards: false,
      scenarios: [
        { scenarioId: "correct", expectedOutcome: "pair accepted" },
        { scenarioId: "incorrect", expectedOutcome: "pair rejected" },
        { scenarioId: "retry", expectedOutcome: "same pair can be retried" },
        { scenarioId: "completion", expectedOutcome: "completion is emitted once" },
      ],
    })],
    ["mobile-evidence", "Keyboard controls\nFocus management\nTouch targets\nReduced motion\nReadable fallback\nSmall-screen layout\n"],
    ["wrapper-notes", "Phaser lifecycle maps to the canonical event sink. The platform owns score, persistence, and reporting. No direct source import.\n"],
  ]);

  const artifactPaths = {
    "source-archive": "evidence/source-manifest.sha256",
    fixture: "fixtures/memory-match-unit.json",
    readme: "README.md",
    "event-replay": "evidence/event-replay.json",
    "audio-coverage": "evidence/audio-map.json",
    "scoring-replay": "evidence/scoring-replay.json",
    "mobile-evidence": "evidence/accessibility.md",
    "wrapper-notes": "evidence/wrapper-notes.md",
  };

  const artifacts = [];
  for (const [kind, content] of artifactContents) {
    const relativePath = artifactPaths[kind];
    const absolutePath = join(candidateRoot, relativePath);
    mkdirSync(dirname(absolutePath), { recursive: true });
    writeFileSync(absolutePath, content);
    artifacts.push({
      artifactId: `memory-match-${kind}`,
      kind,
      status: "reviewed",
      relativePath,
      checksum: hashFile(absolutePath),
    });
  }

  const manifest = {
    sourceRepository: "Drewsure/ministar-lab",
    sourceSnapshotId: "frozen-2026-09-12-aaa-stable",
    sourceCommitSha: "eb79ddf5940ab47cc3c45c119c67ee1b6b958e55",
    targetMode: "memory-match",
    parentEngine: "pairing",
    targetSurface: "hybrid",
    status: "review-only",
    tenantId: "sample",
    requestId: "zai-memory-match-evidence-request",
    queueItemId: "intake-sample-memory-match-phaser",
    prototypeFolder: "candidate/memory-match",
    artifacts,
    blockedActions: [
      "No archive import",
      "No direct file copy into apps/web",
      "No direct file copy into apps/ai-service",
      "No active route replacement",
      "No scoring mutation",
      "No audio manifest mutation",
      "No package promotion",
      "No student assignment",
    ],
  };
  writeFileSync(join(evidenceRoot, "return-package.json"), JSON.stringify(manifest, null, 2));

  assertVerifierPasses(candidateRoot, "complete package");

  const replayPath = join(candidateRoot, artifactPaths["event-replay"]);
  const replay = JSON.parse(readFileSync(replayPath, "utf8"));
  const roundShownIndex = replay.events.findIndex((candidate) => candidate.type === "round_shown");
  const audioRequestedIndex = replay.events.findIndex((candidate) => candidate.type === "audio_requested");
  [replay.events[roundShownIndex], replay.events[audioRequestedIndex]] = [
    replay.events[audioRequestedIndex],
    replay.events[roundShownIndex],
  ];
  writeFileSync(replayPath, JSON.stringify(replay));
  const replayArtifact = manifest.artifacts.find((artifact) => artifact.kind === "event-replay");
  replayArtifact.checksum = hashFile(replayPath);
  writeFileSync(join(evidenceRoot, "return-package.json"), JSON.stringify(manifest, null, 2));
  assertVerifierRejects(candidateRoot, "audio before round");

  // Restore the original event replay before the remaining negative cases.
  replay.events = [
    event("game_started", "2026-09-14T00:00:00.000Z"),
    event("round_shown", "2026-09-14T00:00:01.000Z"),
    event("audio_requested", "2026-09-14T00:00:02.000Z", { cueKind: "instruction", cueText: "Find the matching card.", language: "en" }),
    event("answer_submitted", "2026-09-14T00:00:03.000Z"),
    event("answer_result", "2026-09-14T00:00:04.000Z", { correct: true }),
    event("mastery_updated", "2026-09-14T00:00:05.000Z", { completed: true, earnedStarDust: 100, scoringProfileId: "memory-match-foundation" }),
    event("game_completed", "2026-09-14T00:00:06.000Z", { earnedStarDust: 100, scoringProfileId: "memory-match-foundation" }),
  ];
  writeFileSync(replayPath, JSON.stringify(replay));
  replayArtifact.checksum = hashFile(replayPath);
  writeFileSync(join(evidenceRoot, "return-package.json"), JSON.stringify(manifest, null, 2));

  replay.events = [
    ...replay.events,
    event("audio_requested", "2026-09-14T00:00:07.000Z", { cueKind: "feedback", cueText: "Review complete.", language: "en" }),
  ];
  writeFileSync(replayPath, JSON.stringify(replay));
  replayArtifact.checksum = hashFile(replayPath);
  writeFileSync(join(evidenceRoot, "return-package.json"), JSON.stringify(manifest, null, 2));
  assertVerifierRejects(candidateRoot, "audio after completion");

  replay.events = replay.events.slice(0, -1);
  writeFileSync(replayPath, JSON.stringify(replay));
  replayArtifact.checksum = hashFile(replayPath);
  writeFileSync(join(evidenceRoot, "return-package.json"), JSON.stringify(manifest, null, 2));

  const masteryIndex = replay.events.findIndex((candidate) => candidate.type === "mastery_updated");
  const completionEvent = replay.events.find((candidate) => candidate.type === "game_completed");
  replay.events = [
    ...replay.events.slice(0, masteryIndex + 1),
    event("audio_requested", "2026-09-14T00:00:05.500Z", { cueKind: "feedback", cueText: "Keep listening.", language: "en" }),
    completionEvent,
  ];
  writeFileSync(replayPath, JSON.stringify(replay));
  replayArtifact.checksum = hashFile(replayPath);
  writeFileSync(join(evidenceRoot, "return-package.json"), JSON.stringify(manifest, null, 2));
  assertVerifierRejects(candidateRoot, "audio after mastery");

  replay.events = replay.events.filter((candidate) => candidate.type !== "audio_requested" || candidate.metadata?.cueText !== "Keep listening.");
  writeFileSync(replayPath, JSON.stringify(replay));
  replayArtifact.checksum = hashFile(replayPath);
  writeFileSync(join(evidenceRoot, "return-package.json"), JSON.stringify(manifest, null, 2));

  const fixtureArtifact = manifest.artifacts.find((artifact) => artifact.kind === "fixture");
  const originalFixturePath = fixtureArtifact.relativePath;
  fixtureArtifact.relativePath = artifactPaths.readme;
  fixtureArtifact.checksum = hashFile(join(candidateRoot, artifactPaths.readme));
  writeFileSync(join(evidenceRoot, "return-package.json"), JSON.stringify(manifest, null, 2));
  assertVerifierRejects(candidateRoot, "duplicate artifact paths");
  fixtureArtifact.relativePath = originalFixturePath;
  fixtureArtifact.checksum = hashFile(join(candidateRoot, originalFixturePath));
  writeFileSync(join(evidenceRoot, "return-package.json"), JSON.stringify(manifest, null, 2));

  const scoringPath = join(candidateRoot, artifactPaths["scoring-replay"]);
  writeFileSync(scoringPath, JSON.stringify({ ...JSON.parse(readFileSync(scoringPath, "utf8")), randomRewards: true }));
  const scoringArtifact = manifest.artifacts.find((artifact) => artifact.kind === "scoring-replay");
  scoringArtifact.checksum = hashFile(scoringPath);
  writeFileSync(join(evidenceRoot, "return-package.json"), JSON.stringify(manifest, null, 2));
  assertVerifierRejects(candidateRoot, "random scoring");

  replay.events.find((candidate) => candidate.type === "audio_requested").studentSessionId = "another-session";
  writeFileSync(replayPath, JSON.stringify(replay));
  replayArtifact.checksum = hashFile(replayPath);
  writeFileSync(join(evidenceRoot, "return-package.json"), JSON.stringify(manifest, null, 2));
  assertVerifierRejects(candidateRoot, "cross-session audio");

  assertVerifierRejects(resolve(process.cwd()), "candidate root inside product repository");
  const placeholderRoot = join(tmpdir(), "<returned-package-folder>");
  assertVerifierRejects(placeholderRoot, "placeholder candidate root", "path still contains a placeholder");
  const oversizedRoot = mkdtempSync(join(tmpdir(), "living-textbook-oversized-candidate-"));
  try {
    const oversizedEvidenceRoot = join(oversizedRoot, "evidence");
    mkdirSync(oversizedEvidenceRoot, { recursive: true });
    writeFileSync(join(oversizedEvidenceRoot, "return-package.json"), JSON.stringify({ padding: "x".repeat(65536) }));
    assertVerifierRejects(oversizedRoot, "oversized return manifest", "return-package.json cannot exceed 65536 bytes");
  } finally {
    rmSync(oversizedRoot, { recursive: true, force: true });
  }
  const frozenSnapshotRoot = mkdtempSync(join(tmpdir(), "living-textbook-frozen-source-snapshot-"));
  try {
    assertVerifierRejects(frozenSnapshotRoot, "frozen source snapshot", "frozen source snapshot");
  } finally {
    rmSync(frozenSnapshotRoot, { recursive: true, force: true });
  }

  verifyBalloonProfile();

  console.log("PASS Phaser candidate package behavior proves both approved profiles pass and random-reward/cross-session evidence is rejected.");
} finally {
  rmSync(candidateRoot, { recursive: true, force: true });
}

function event(type, occurredAt, metadata = {}) {
  return {
    type,
    unitKey: "sample:starter-english:L1:U1",
    gameMode: "memory-match",
    launchCode: "demo-memory-match",
    studentSessionId: "student-session-1",
    occurredAt,
    metadata: {
      tenantId: "sample",
      replaySeed: "replay-v1:sample-memory-match",
      ...metadata,
    },
  };
}

function verifyBalloonProfile() {
  const balloonRoot = mkdtempSync(join(tmpdir(), "living-textbook-balloon-candidate-"));
  const balloonEvidenceRoot = join(balloonRoot, "evidence");
  mkdirSync(balloonEvidenceRoot, { recursive: true });

  try {
    const fixture = {
      unit_meta: {
        tenant_id: "sample",
        level: 1,
        theme: "Greetings",
        game_mode: "balloon-pop",
        engine_id: "selection",
      },
      pedagogical_payload: {
        vocabulary_terms: ["hello", "goodbye", "teacher", "friend", "morning", "afternoon", "please", "thank you"],
        target_sentences: ["Hello, teacher.", "Thank you, friend."],
      },
    };

    const events = [
      balloonEvent("game_started", "2026-09-14T01:00:00.000Z"),
      balloonEvent("round_shown", "2026-09-14T01:00:01.000Z"),
      balloonEvent("audio_requested", "2026-09-14T01:00:02.000Z", { cueKind: "instruction", cueText: "Pop the matching balloon.", language: "en" }),
      balloonEvent("answer_submitted", "2026-09-14T01:00:03.000Z"),
      balloonEvent("answer_result", "2026-09-14T01:00:04.000Z", { correct: true }),
      balloonEvent("mastery_updated", "2026-09-14T01:00:05.000Z", { completed: true, earnedStarDust: 100, scoringProfileId: "balloon-pop-foundation" }),
      balloonEvent("game_completed", "2026-09-14T01:00:06.000Z", { earnedStarDust: 100, scoringProfileId: "balloon-pop-foundation" }),
    ];

    const artifactContents = new Map([
      ["source-archive", "a".repeat(64) + "  src/game/scenes/BalloonPopScene.ts\n"],
      ["fixture", JSON.stringify(fixture)],
      ["readme", "Setup\nControls\nDependencies\nKnown limits\nWrapper boundary notes\n"],
      ["event-replay", JSON.stringify({ events })],
      ["audio-coverage", JSON.stringify({ cues: [
        ...fixture.pedagogical_payload.vocabulary_terms.map((text) => ({ kind: "term", text, language: "en", reviewed: true })),
        { kind: "instruction", text: "Pop the matching balloon.", language: "en", reviewed: true },
        { kind: "feedback", text: "Try again.", language: "en", reviewed: true },
        { kind: "critical-control", text: "Replay instruction.", language: "en", reviewed: true },
      ] })],
      ["scoring-replay", JSON.stringify({
        deterministic: true,
        randomRewards: false,
        scenarios: [
          { scenarioId: "correct", expectedOutcome: "matching balloon accepted" },
          { scenarioId: "incorrect", expectedOutcome: "wrong balloon rejected" },
          { scenarioId: "miss", expectedOutcome: "escaped balloon recorded without completion" },
          { scenarioId: "retry", expectedOutcome: "round can be retried" },
          { scenarioId: "completion", expectedOutcome: "completion is emitted once" },
        ],
      })],
      ["mobile-evidence", "Keyboard controls\nFocus management\nTouch targets\nReduced motion\nReadable fallback\nSmall-screen layout\n"],
      ["wrapper-notes", "Phaser lifecycle maps to the canonical event sink. The platform owns score, persistence, and reporting. No direct source import.\n"],
    ]);

    const artifactPaths = {
      "source-archive": "evidence/source-manifest.sha256",
      fixture: "fixtures/balloon-pop-unit.json",
      readme: "README.md",
      "event-replay": "evidence/event-replay.json",
      "audio-coverage": "evidence/audio-map.json",
      "scoring-replay": "evidence/scoring-replay.json",
      "mobile-evidence": "evidence/accessibility.md",
      "wrapper-notes": "evidence/wrapper-notes.md",
    };

    const artifacts = [];
    for (const [kind, content] of artifactContents) {
      const relativePath = artifactPaths[kind];
      const absolutePath = join(balloonRoot, relativePath);
      mkdirSync(dirname(absolutePath), { recursive: true });
      writeFileSync(absolutePath, content);
      artifacts.push({
        artifactId: `balloon-pop-${kind}`,
        kind,
        status: "reviewed",
        relativePath,
        checksum: hashFile(absolutePath),
      });
    }

    const manifest = {
      sourceRepository: "Drewsure/ministar-lab",
      sourceSnapshotId: "frozen-2026-09-12-aaa-stable",
      sourceCommitSha: "eb79ddf5940ab47cc3c45c119c67ee1b6b958e55",
      targetMode: "balloon-pop",
      parentEngine: "selection",
      targetSurface: "hybrid",
      status: "review-only",
      tenantId: "sample",
      requestId: "zai-balloon-pop-evidence-request",
      queueItemId: "intake-sample-balloon-pop-phaser",
      prototypeFolder: "candidate/balloon-pop",
      artifacts,
      blockedActions: [
        "No archive import",
        "No direct file copy into apps/web",
        "No direct file copy into apps/ai-service",
        "No active route replacement",
        "No scoring mutation",
        "No audio manifest mutation",
        "No package promotion",
        "No student assignment",
      ],
    };
    writeFileSync(join(balloonEvidenceRoot, "return-package.json"), JSON.stringify(manifest, null, 2));
    assertVerifierPasses(balloonRoot, "Balloon Pop profile package");
  } finally {
    rmSync(balloonRoot, { recursive: true, force: true });
  }
}

function balloonEvent(type, occurredAt, metadata = {}) {
  return {
    type,
    unitKey: "sample:starter-english:L1:U1",
    gameMode: "balloon-pop",
    launchCode: "demo-balloon-pop",
    studentSessionId: "student-session-balloon-1",
    occurredAt,
    metadata: {
      tenantId: "sample",
      replaySeed: "replay-v1:sample-balloon-pop",
      ...metadata,
    },
  };
}

function hashFile(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function runVerifier(candidateRoot) {
  return spawnSync(process.execPath, [verifierPath], {
    env: { ...process.env, LIVING_TEXTBOOOK_ZAI_CANDIDATE_ROOT: candidateRoot },
    encoding: "utf8",
  });
}

function assertVerifierPasses(candidateRoot, label) {
  const result = runVerifier(candidateRoot);
  if (result.status !== 0) {
    throw new Error(`Expected ${label} to pass, got ${result.status}: ${result.stdout}\n${result.stderr}`);
  }
}

function assertVerifierRejects(candidateRoot, label, expectedMessage) {
  const result = runVerifier(candidateRoot);
  if (result.status === 0) {
    throw new Error(`Expected ${label} to be rejected, but the verifier passed.`);
  }
  if (expectedMessage && !`${result.stdout}\n${result.stderr}`.toLowerCase().includes(expectedMessage.toLowerCase())) {
    throw new Error(`Expected ${label} rejection to mention ${expectedMessage}, got: ${result.stdout}\n${result.stderr}`);
  }
}
