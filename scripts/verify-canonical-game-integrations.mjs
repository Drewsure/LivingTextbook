import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

const integrations = [
  {
    id: "memory-match",
    component: "apps/web/src/features/game-shell/pairing/PairingMemoryMatchGame.tsx",
    route: "apps/web/src/app/memory/[code]/page.tsx",
    routeFlow: "MemoryMatchDemoFlow",
    required: [
      "startUnlockedGameMode",
      "createAudioRequestedEvent",
      "replaySeed",
      'emitInteractionEvent("round_shown"',
      'emitInteractionEvent("answer_submitted"',
      'emitInteractionEvent("answer_result"',
      'emitInteractionEvent("mastery_updated"',
      "completeGameMode",
      "onComplete(result)",
    ],
  },
  {
    id: "sentence-builder",
    component: "apps/web/src/features/game-shell/text-spelling/SentenceBuilderPracticeGame.tsx",
    route: "apps/web/src/app/sentence/[code]/page.tsx",
    routeFlow: "SentenceBuilderDemoFlow",
    required: [
      "createCanonicalGameReplaySeed",
      "startUnlockedGameMode",
      "createAudioRequestedEvent",
      "replaySeed",
      'emitInteractionEvent("round_shown"',
      'emitInteractionEvent("answer_submitted"',
      'emitInteractionEvent("answer_result"',
      'emitInteractionEvent("mastery_updated"',
      "completeGameMode",
      "onComplete(result)",
      "replaySeed",
    ],
  },
  {
    id: "speak-it",
    component: "apps/web/src/features/game-shell/speaking/SpeakItPracticeGame.tsx",
    route: "apps/web/src/app/speak/[code]/page.tsx",
    routeFlow: "SpeakItDemoFlow",
    required: [
      "createCanonicalGameReplaySeed",
      "startUnlockedGameMode",
      "createAudioRequestedEvent",
      'emitInteractionEvent("round_shown"',
      'emitInteractionEvent("answer_submitted"',
      'emitInteractionEvent("answer_result"',
      'emitInteractionEvent("mastery_updated"',
      "completeGameMode",
      "onComplete(result)",
      "replaySeed",
      "microphoneTeacherApproved",
    ],
  },
  {
    id: "quiz",
    component: "apps/web/src/features/game-shell/selection/QuizPracticeGame.tsx",
    route: "apps/web/src/app/quiz/[code]/page.tsx",
    routeFlow: "QuizDemoFlow",
    required: [
      "createCanonicalGameReplaySeed",
      "startUnlockedGameMode",
      "createAudioRequestedEvent",
      'emitInteractionEvent("round_shown"',
      'emitInteractionEvent("answer_submitted"',
      'emitInteractionEvent("answer_result"',
      'emitInteractionEvent("mastery_updated"',
      "completeGameMode",
      "onComplete(result)",
      "replaySeed",
    ],
  },
  {
    id: "true-false",
    component: "apps/web/src/features/game-shell/selection/TrueFalsePracticeGame.tsx",
    route: "apps/web/src/app/true-false/[code]/page.tsx",
    routeFlow: "TrueFalseDemoFlow",
    required: [
      "createCanonicalGameReplaySeed",
      "startUnlockedGameMode",
      "createAudioRequestedEvent",
      'emitInteractionEvent("round_shown"',
      'emitInteractionEvent("answer_submitted"',
      'emitInteractionEvent("answer_result"',
      'emitInteractionEvent("mastery_updated"',
      "completeGameMode",
      "onComplete(result)",
      "replaySeed",
    ],
  },
  {
    id: "type-answer",
    component: "apps/web/src/features/game-shell/text-spelling/TypeAnswerPracticeGame.tsx",
    route: "apps/web/src/app/type-answer/[code]/page.tsx",
    routeFlow: "TypeAnswerDemoFlow",
    required: [
      "createCanonicalGameReplaySeed",
      "startUnlockedGameMode",
      "createAudioRequestedEvent",
      'emitInteractionEvent("round_shown"',
      'emitInteractionEvent("answer_submitted"',
      'emitInteractionEvent("answer_result"',
      'emitInteractionEvent("mastery_updated"',
      "completeGameMode",
      "onComplete(result)",
      "replaySeed",
    ],
  },
  {
    id: "spelling-practice",
    component: "apps/web/src/features/game-shell/text-spelling/SpellingPracticeGame.tsx",
    route: "apps/web/src/app/spelling/[code]/page.tsx",
    routeFlow: "SpellingPracticeDemoFlow",
    required: [
      "createCanonicalGameReplaySeed",
      "startUnlockedGameMode",
      "createAudioRequestedEvent",
      'emitInteractionEvent("round_shown"',
      'emitInteractionEvent("answer_submitted"',
      'emitInteractionEvent("answer_result"',
      'emitInteractionEvent("mastery_updated"',
      "completeGameMode",
      "onComplete(result)",
      "replaySeed",
    ],
  },
  {
    id: "fill-in-the-blank",
    component: "apps/web/src/features/game-shell/text-spelling/FillInBlankPracticeGame.tsx",
    route: "apps/web/src/app/fill/[code]/page.tsx",
    routeFlow: "FillInBlankDemoFlow",
    required: [
      "createCanonicalGameReplaySeed",
      "startUnlockedGameMode",
      "createAudioRequestedEvent",
      'emitInteractionEvent("round_shown"',
      'emitInteractionEvent("answer_submitted"',
      'emitInteractionEvent("answer_result"',
      'emitInteractionEvent("mastery_updated"',
      "completeGameMode",
      "onComplete(result)",
      "replaySeed",
    ],
  },
  {
    id: "label-it",
    component: "apps/web/src/features/game-shell/pairing/LabelItPracticeGame.tsx",
    route: "apps/web/src/app/label-it/[code]/page.tsx",
    routeFlow: "LabelItDemoFlow",
    required: [
      "createCanonicalGameReplaySeed",
      "startUnlockedGameMode",
      "createAudioRequestedEvent",
      'emitInteractionEvent("round_shown"',
      'emitInteractionEvent("answer_submitted"',
      'emitInteractionEvent("answer_result"',
      'emitInteractionEvent("mastery_updated"',
      "completeGameMode",
      "onComplete(result)",
      "replaySeed",
    ],
  },
  {
    id: "match-up",
    component: "apps/web/src/features/game-shell/pairing/PairingMatchUpGame.tsx",
    route: "apps/web/src/app/match/[code]/page.tsx",
    routeFlow: "MatchUpDemoFlow",
    required: [
      "createCanonicalGameReplaySeed",
      "startUnlockedGameMode",
      "createAudioRequestedEvent",
      'emitInteractionEvent("round_shown"',
      'emitInteractionEvent("answer_submitted"',
      'emitInteractionEvent("answer_result"',
      'emitInteractionEvent("mastery_updated"',
      "completeGameMode",
      "onComplete(result)",
      "replaySeed",
    ],
  },
  {
    id: "balloon-pop",
    component: "apps/web/src/features/game-shell/selection/BalloonPopPracticeGame.tsx",
    route: "apps/web/src/app/balloon/[code]/page.tsx",
    routeFlow: "BalloonPopDemoFlow",
    required: [
      'const gameMode = "balloon-pop"',
      "startUnlockedGameMode",
      "createAudioRequestedEvent",
      "replaySeed",
      'emitInteractionEvent("round_shown"',
      'emitInteractionEvent("answer_submitted"',
      'emitInteractionEvent("answer_result"',
      'emitInteractionEvent("mastery_updated"',
      "completeGameMode",
      "onComplete(result)",
    ],
  },
];

const progressionAdapter = readText("apps/web/src/features/progression/localProgressionAdapter.ts");
const contentModelContract = readText("packages/content-model/src/canonicalGameIntegration.ts");
const replayContract = readText("packages/content-model/src/canonicalGameReplay.ts");
const routeShell = readText("apps/web/src/features/game-shell/components/PlayableGameRouteShell.tsx");
const accessGate = readText("apps/web/src/features/game-shell/components/GameAccessGateCard.tsx");
const eventLog = readText("apps/web/src/features/student/components/SessionEventLog.tsx");
const reportContract = readText("packages/content-model/src/canonicalGameReport.ts");
const reportPreview = readText("apps/web/src/features/teacher/TeacherCanonicalGameEvidenceCard.tsx");
const reportPanel = readText("apps/web/src/features/teacher/TeacherReportPackagePreviewPanel.tsx");
const sessionMonitor = readText("apps/web/src/features/teacher/TeacherSessionMonitorPanel.tsx");
const studentLaunchFlow = readText("apps/web/src/features/student/StudentLaunchFlow.tsx");
const completionGate = readText("apps/web/src/features/game-shell/canonicalGameCompletionGate.ts");

const standardEventTypes = [
  "game_started",
  "round_shown",
  "answer_submitted",
  "answer_result",
  "mastery_updated",
  "game_completed",
];

const failures = [];

for (const integration of integrations) {
  const component = readText(integration.component);
  const route = readText(integration.route);

  for (const fragment of integration.required) {
    if (!component.includes(fragment)) {
      failures.push(`${integration.id}: missing component contract fragment: ${fragment}`);
    }
  }

  if (!route.includes(integration.routeFlow)) {
    failures.push(`${integration.id}: route does not reference its canonical demo flow`);
  }

  for (const forbiddenFragment of ["Math.random", "localStorage", "sessionStorage"]) {
    if (component.includes(forbiddenFragment)) {
      failures.push(`${integration.id}: component owns forbidden platform state: ${forbiddenFragment}`);
    }
  }
}

for (const fragment of [
  "PairingMatchUpGame",
  "sessionEventsRef",
  "eventContractErrors",
  "createProgressionContinuityEnvelope",
  "validateProgressionContinuityRuntimeRequest",
  "validateCanonicalGameCompletion",
  "Completion is paused until the event evidence is valid.",
]) {
  if (!studentLaunchFlow.includes(fragment)) {
    failures.push(`student launch canonical handoff: missing ${fragment}`);
  }
}

for (const fragment of [
  "validateCanonicalGameEventSequence",
  "events.filter((event) => event.gameMode === gameMode)",
  "result.earnedStarDust",
  "Canonical game completion did not include a completion event.",
]) {
  if (!completionGate.includes(fragment)) {
    failures.push(`shared canonical completion gate: missing ${fragment}`);
  }
}

for (const [surface, source] of [
  ["playable route shell", routeShell],
  ["student launch flow", studentLaunchFlow],
]) {
  if (!source.includes("validateCanonicalGameCompletion")) {
    failures.push(`${surface}: must use the shared canonical completion gate`);
  }
}

if (studentLaunchFlow.includes("startUnlockedGameMode")) {
  failures.push("student launch canonical handoff: launch flow must let the mounted game emit its single game_started event");
}

const contractSources = [progressionAdapter, ...integrations.map((integration) => readText(integration.component))];
for (const eventType of standardEventTypes) {
  if (!contractSources.some((source) => source.includes(eventType))) {
    failures.push(`canonical game contract: missing standard event reference: ${eventType}`);
  }
}

for (const fragment of [
  "validateCanonicalGameEventSequence",
  "CANONICAL_GAME_REQUIRED_EVENT_ORDER",
  "Canonical game event sequence must pair answer_submitted and answer_result events",
  "Canonical game event sequence must place all answer activity before mastery_updated.",
  "Canonical game event sequence must place all answer activity before game_completed.",
  "Canonical game event sequence must be chronological by occurredAt.",
  "Canonical game event sequence must include audio_requested evidence.",
  "Canonical game contract needs review",
  "Completion is paused until the event evidence is valid.",
  "if (!replay.valid)",
  "tenantId: args.launchSession.tenantId",
  "expectedTenantId",
  "expectedEarnedStarDust",
  "expectedIdentity",
  "must preserve unit",
  "must preserve launch",
  "must preserve student session",
  "Canonical game mastery and completion awards must agree",
  "scoringProfileId",
]) {
  if (![contentModelContract, progressionAdapter, routeShell].some((source) => source.includes(fragment))) {
    failures.push(`canonical game event boundary: missing shared contract fragment: ${fragment}`);
  }
}

for (const fragment of [
  "if (!args.progression.unlockedGameModes.includes(args.gameMode))",
  "earnedStarDust: 0",
  "UNIT_STAR_DUST_CAP",
  "capUnitStarDust",
]) {
  if (!progressionAdapter.includes(fragment)) {
    failures.push(`canonical game progression boundary: completion adapter must block locked modes: ${fragment}`);
  }
}

for (const fragment of [
  "const gameUnlocked = currentProgression.unlockedGameModes.includes(gameMode)",
  "{gameUnlocked ? (",
  "<GameAccessGateCard gameMode={gameMode} launchSession={launchSession} />",
  "Complete entry practice first",
]) {
  if (![routeShell, accessGate].some((source) => source.includes(fragment))) {
    failures.push(`canonical game access boundary: missing progression gate fragment: ${fragment}`);
  }
}

if (routeShell.includes("unlockedGameModes: Array.from(new Set([...progression.unlockedGameModes, gameMode]))")) {
  failures.push("canonical game access boundary: playable route shell must not self-unlock the current game mode.");
}

for (const fragment of [
  "validateCanonicalGameReportEvidence",
  "Only complete, tenant-bound game event sequences",
  "canonicalGameReportEvidence",
  "Sequence, replay evidence, identity, and completion boundary passed.",
]) {
  if (![reportContract, reportPreview, reportPanel, sessionMonitor].some((source) => source.includes(fragment))) {
    failures.push(`canonical teacher report evidence boundary: missing shared contract fragment: ${fragment}`);
  }
}

const tenantWrappedMetadataCount = (progressionAdapter.match(/metadata: withTenantMetadata\(args\.launchSession,/g) ?? []).length;
if (tenantWrappedMetadataCount < 7) {
  failures.push(
    `progression adapter tenant boundary: expected at least 7 launch-derived event metadata envelopes, found ${tenantWrappedMetadataCount}`,
  );
}

for (const fragment of ["function withTenantMetadata", "tenantId: launchSession.tenantId"]) {
  if (!progressionAdapter.includes(fragment)) {
    failures.push(`progression adapter tenant boundary: missing shared metadata helper fragment: ${fragment}`);
  }
}

for (const fragment of [
  "createCanonicalGameReplaySeed",
  "replay-v1:",
  "replaySeed",
]) {
  if (![replayContract, progressionAdapter, eventLog, ...integrations.map((integration) => readText(integration.component))].some((source) => source.includes(fragment))) {
    failures.push(`canonical game replay boundary: missing deterministic seed fragment: ${fragment}`);
  }
}

const replayMetadataFragment =
  "replaySeed: createCanonicalGameReplaySeed({ unitKey: args.launchSession.unitKey, gameMode: args.gameMode })";
if (!progressionAdapter.includes(replayMetadataFragment)) {
  failures.push("progression adapter replay boundary: shared game, audio, and completion events must carry replay evidence by default.");
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

console.log(`PASS ${integrations.length} canonical game integration component(s) preserve shared event, audio, completion, route, and state-ownership contracts.`);

function readText(relativePath) {
  return readFileSync(new URL(relativePath, root), "utf8");
}
