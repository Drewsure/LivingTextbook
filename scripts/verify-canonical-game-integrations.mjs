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
      "startUnlockedGameMode",
      "createAudioRequestedEvent",
      "createMicrophonePracticeEvent",
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

const entryIntegrations = [
  {
    id: "flashcards-entry",
    component: "apps/web/src/features/game-shell/entry/FlashcardDemoFlow.tsx",
    supportComponent: "apps/web/src/features/student/components/FlashcardPracticeCard.tsx",
    route: "apps/web/src/app/flashcards/[code]/page.tsx",
    required: [
      "completeFlashcardEntryPractice",
      "getNextUncompletedRecommendedMode",
      "resolveCanonicalGameReplaySeed({",
      "getGameAudioCoverage",
      "GameLearningAudioContractCard",
      "targetPracticeRequiredCount",
      "targetPracticeReady",
      "audioCoverage",
    ],
    supportRequired: [
      "Japanese assist does not unlock the next game",
      "English listened:",
      "targetPracticeReady",
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
const frontDoorFlow = readText("apps/web/src/features/access/FrontDoorEntryFlow.tsx");
const completionGate = readText("apps/web/src/features/game-shell/canonicalGameCompletionGate.ts");
const nextModePolicy = readText("apps/web/src/features/progression/nextRecommendedGameMode.ts");
const gameSequence = readText("apps/web/src/features/game-shell/GameSequence.tsx");
const activityHub = readText("apps/web/src/features/activities/StudentActivityHubFlow.tsx");
const speechRequirement = readText("docs/future-requirements/FR-009-core-speech-matching-practice.md");
const offerMap = readText("apps/web/src/data/sampleUnitGameOfferMap.ts");
const launchResolver = readText("apps/web/src/data/sampleLaunchResolver.ts");
const sessionMonitorData = readText("apps/web/src/data/sampleTeacherSessionMonitor.ts");
const progressionCore = readText("packages/content-model/src/index.ts");
const localProgressionAdapter = readText("apps/web/src/features/progression/localProgressionAdapter.ts");
const playableRouteShell = readText("apps/web/src/features/game-shell/components/PlayableGameRouteShell.tsx");
const recommendedRoutesCard = readText("apps/web/src/features/student/components/RecommendedGameRoutesCard.tsx");
const completionNextCard = readText("apps/web/src/features/game-shell/components/GameCompletionNextCard.tsx");
const nextGameUnlockCard = readText("apps/web/src/features/student/components/NextGameUnlockCard.tsx");
const learningAudioCard = readText("apps/web/src/features/game-shell/components/GameLearningAudioContractCard.tsx");
const contentModelIndex = readText("packages/content-model/src/index.ts");
const flashcardEntryFlow = readText("apps/web/src/features/game-shell/entry/FlashcardDemoFlow.tsx");
const flashcardPracticeCard = readText("apps/web/src/features/student/components/FlashcardPracticeCard.tsx");
const audioCueButton = readText("apps/web/src/features/audio/AudioCueButton.tsx");
const accessGateCard = readText("apps/web/src/features/game-shell/components/GameAccessGateCard.tsx");
const gameModeCatalog = readText("apps/web/src/features/game-shell/gameModeCatalog.ts");
const scoringProfiles = readText("apps/web/src/features/game-shell/scoringProfiles.ts");
const textSpellingAdapter = readText("apps/web/src/features/game-shell/text-spelling/textSpellingEngineAdapter.ts");

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

  if (!component.includes("earnedStarDust: result.earnedStarDust")) {
    failures.push(`${integration.id}: mastery evidence must use the normalized completion award`);
  }

  if (component.includes('scoringProfileId: "') || component.includes('scoringProfile?.id ??')) {
    failures.push(`${integration.id}: scoring profile evidence must not hard-code or nullable-fallback a profile`);
  }
  if (component.includes("Math.min(200, scoringProfile.completionDustCap)")) {
    failures.push(`${integration.id}: completion dust must not use a smaller hard-coded cap than the canonical scoring profile`);
  }

  const hardCodedEnglishAudioFallbacks = [
    ...component.matchAll(/language=\{[^}\n]*\?\?\s*"en"/g),
    ...component.matchAll(/language:\s*[^,}\n]*\?\?\s*"en"/g),
  ];
  if (hardCodedEnglishAudioFallbacks.length > 0) {
    failures.push(`${integration.id}: learner-facing audio language must fall back to the resolved target language, not English`);
  }
  if (component.includes("<AudioSupportedAction") && !component.includes("audioLanguage={targetLanguage}")) {
    failures.push(`${integration.id}: every audio-supported learner action must use the resolved target language`);
  }
}

for (const integration of entryIntegrations) {
  const component = readText(integration.component);
  const route = readText(integration.route);

  for (const fragment of integration.required) {
    if (!component.includes(fragment)) {
      failures.push(`${integration.id}: missing entry-slice contract fragment: ${fragment}`);
    }
  }

  if (!route.includes("FlashcardDemoFlow")) {
    failures.push(`${integration.id}: route does not mount the canonical FlashcardDemoFlow`);
  }
  if (component.includes("Math.random") || component.includes("sessionStorage")) {
    failures.push(`${integration.id}: entry slice owns forbidden random or session state`);
  }
  if (!component.includes("resolveTargetLanguage({")) {
    failures.push(`${integration.id}: entry slice must resolve the tenant/unit target language`);
  }
  const supportComponent = readText(integration.supportComponent);
  for (const fragment of integration.supportRequired) {
    if (!supportComponent.includes(fragment)) {
      failures.push(`${integration.id}: support-language boundary is missing: ${fragment}`);
    }
  }
}

for (const [id, flow] of [
  ["front-door-entry", frontDoorFlow],
  ["student-launch", studentLaunchFlow],
]) {
  for (const fragment of [
    "getGameAudioCoverage",
    "audioCoverage",
    "audioCoverage.ready &&",
    "audioCoverage={audioCoverage}",
  ]) {
    if (!flow.includes(fragment)) {
      failures.push(`${id}: entry flow must enforce the shared audio readiness contract: ${fragment}`);
    }
  }
}

for (const integration of integrations) {
  const component = readText(integration.component);
  if (!component.includes("getRequiredGameScoringProfileForMode") && !component.includes("preview.scoringProfileId")) {
    failures.push(`${integration.id}: scoring profile must come from the required resolver or a canonical engine preview`);
  }
  if (!component.includes("targetLanguage: string;")) {
    failures.push(`${integration.id}: canonical game wrapper must require the resolved target language`);
  }
  if (!component.includes("configuredTargetLanguage")) {
    failures.push(`${integration.id}: target language must be accepted from the route handoff`);
  }
}

if (!textSpellingAdapter.includes("CANONICAL_GAME_SCORING_PROFILE_BY_MODE[\"sentence-builder\"]")) {
  failures.push("text-spelling engine preview: Sentence Builder scoring profile must come from the canonical map");
}

if (!routeShell.includes("platformReplaySeed?: string")) {
  failures.push("route shell: canonical replay seed must expose an optional platform-issued seed input");
}

if (!routeShell.includes("resolveCanonicalGameReplaySeed({")) {
  failures.push("route shell: canonical replay seed must be resolved at the shared handoff boundary");
}

if (!routeShell.includes("platformReplaySeed,")) {
  failures.push("route shell: platform-issued replay seed must be passed to the canonical resolver");
}

for (const fragment of [
  "supportedLevels.includes(unit.unitMeta.level)",
  "buildSequenceItems(unit, offerMap)",
]) {
  if (!gameSequence.includes(fragment)) {
    failures.push(`game sequence fallback must respect curriculum level: ${fragment}`);
  }
}

for (const [id, flow] of [
  ["front-door-entry", frontDoorFlow],
  ["student-launch", studentLaunchFlow],
]) {
  if (!flow.includes("nextModeAudioReady") || !flow.includes("audioReady={nextModeAudioReady}")) {
    failures.push(`${id}: next-game unlock card must receive next-mode audio readiness`);
  }
}
for (const fragment of ["audioReady: boolean", "const canStart = unlocked && audioReady", "Audio review"]) {
  if (!nextGameUnlockCard.includes(fragment)) {
    failures.push(`next-game unlock card must align its learner promise with audio readiness: ${fragment}`);
  }
}

for (const fragment of [
  "isGameModeSupportedAtLevel(offer.gameMode, unit.unitMeta.level)",
  "isGameModeSupportedAtLevel(item.mode, unit.unitMeta.level)",
]) {
  if (!activityHub.includes(fragment)) {
    failures.push(`activity hub must respect curriculum level at every presentation boundary: ${fragment}`);
  }
}

if (!routeShell.includes("replaySeed,")) {
  failures.push("route shell: canonical replay seed must be passed to the mounted game");
}

if (!routeShell.includes("languageMatches") || !routeShell.includes("targetLanguageAudioCues")) {
  failures.push("route shell: playable wrappers must receive target-language-only audio cues");
}
if (!routeShell.includes("targetLanguage,")) {
  failures.push("route shell: playable wrappers must receive the resolved target language");
}

if (!reportContract.includes("expectedTargetLanguage?: string") || !reportContract.includes("expectedTargetLanguage,")) {
  failures.push("report contract: canonical evidence must accept and forward the expected target language");
}
if (!sessionMonitorData.includes("languageSettings?.targetLanguage")) {
  failures.push("teacher session monitor: canonical report evidence must use the tenant target language");
}
if (
  !flashcardPracticeCard.includes("languageSettings?.targetLanguage")
  || flashcardPracticeCard.includes('language="en"')
  || flashcardPracticeCard.includes('audioCue?.language ?? "en"')
) {
  failures.push("flashcard entry practice: fallback learner audio must use the tenant/unit target language");
}

const matchUpGame = readText("apps/web/src/features/game-shell/pairing/PairingMatchUpGame.tsx");
if (
  !matchUpGame.includes("configuredTargetLanguage")
  || matchUpGame.includes('language={(lastResult === "mismatched" ? feedbackCue?.language : instructionCue?.language) ?? "en"}')
  || !matchUpGame.includes("?? targetLanguage")
) {
  failures.push("Match Up feedback audio: fallback learner audio must use the resolved target language");
}

if (
  !accessGateCard.includes("targetLanguage: string")
  || !accessGateCard.includes("language={targetLanguage}")
  || !completionNextCard.includes("targetLanguage: string")
  || !completionNextCard.includes("language={targetLanguage}")
  || !playableRouteShell.includes("targetLanguage={targetLanguage}")
) {
  failures.push("shared game route cards: access and next-activity audio must use the resolved target language");
}

if (
  !audioCueButton.includes("language: string;")
  || audioCueButton.includes("language?: string")
  || audioCueButton.includes("language = \"en\"")
) {
  failures.push("shared audio primitives: learner speech language must be explicit with no English default");
}

for (const [surface, source] of [
  ["front-door orchestration", frontDoorFlow],
  ["student orchestration", studentLaunchFlow],
]) {
  if (!source.includes("languageMatches") || !source.includes("targetLanguageAudioCues")) {
    failures.push(`${surface}: direct playable handoff must filter target-language audio cues`);
  }
}

if (!gameModeCatalog.includes("CANONICAL_GAME_SCORING_PROFILE_BY_MODE")) {
  failures.push("game mode catalog: scoring profile assignments must come from the content-model map");
}
if (!scoringProfiles.includes("CANONICAL_GAME_SCORING_PROFILE_BY_MODE")) {
  failures.push("scoring profiles: mode profile lookup must use the content-model map");
}
if (scoringProfiles.includes("Partial<Record<GameModeId")) {
  failures.push("scoring profiles: mode profile lookup must not be optional");
}

for (const integration of integrations) {
  const component = readText(integration.component);
  if (!component.includes("replaySeed: string")) {
    failures.push(`${integration.id}: component must require the route-shell replay seed`);
  }
  if (component.includes("const replaySeed = createCanonicalGameReplaySeed")) {
    failures.push(`${integration.id}: component must not derive a second replay seed`);
  }
}

for (const [surface, source] of [
  ["front-door orchestration", frontDoorFlow],
  ["student orchestration", studentLaunchFlow],
]) {
  if (!source.includes("createCanonicalGameReplaySeed({")) {
    failures.push(`${surface}: must create the canonical seed at its game handoff boundary`);
  }
  if (!source.includes("replaySeed={replaySeed}")) {
    failures.push(`${surface}: must pass the canonical seed into mounted games`);
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

for (const [surface, source, required] of [
  ["game sequence status", gameSequence, "External Phaser candidates remain review-only."],
  ["speech requirement status", speechRequirement, "student/front-door launch integration"],
  ["speech requirement event boundary", speechRequirement, "support-only `microphone_practice` evidence"],
]) {
  if (!source.includes(required)) {
    failures.push(`${surface}: missing current canonical status marker: ${required}`);
  }
}

if (!learningAudioCard.includes("getGameAudioCoverage") || !learningAudioCard.includes("resolvedCoverage")) {
  failures.push("learning audio contract: coverage counts must use the shared game audio coverage contract");
}

const flashcardsOffer = getOfferBody(offerMap, "partner-l1-u1-flashcards");
const matchUpOffer = getOfferBody(offerMap, "partner-l1-u1-match-up");
const sentenceBuilderOffer = getOfferBody(offerMap, "partner-l1-u1-sentence-builder");
if (!flashcardsOffer.includes('gameMode: "flashcards"') || !flashcardsOffer.includes('engineId: "selection"')) {
  failures.push("sample offer map: Flashcards must use the canonical selection engine.");
}
if (!matchUpOffer.includes('gameMode: "match-up"') || !matchUpOffer.includes('engineId: "pairing"')) {
  failures.push("sample offer map: Match Up must use the canonical pairing engine.");
}
if (!offerMap.includes("level: 1")) {
  failures.push("sample offer map: sample unit level must be declared for level-aware offer validation.");
}
if (!sentenceBuilderOffer.includes('availability: "blocked"') || !sentenceBuilderOffer.includes('readiness: "blocked"')) {
  failures.push("sample offer map: Level 1 Sentence Builder must remain blocked until its supported level.");
}
if (!launchResolver.includes("findSampleUnitGameOfferMap(context.contentPackage.meta.packageId)")) {
  failures.push("launch provider offer-map alignment: missing findSampleUnitGameOfferMap");
}
for (const fragment of ["reviewedReadyModes", '.filter((offer) => offer.readiness === "ready")', "...reviewedReadyModes"]) {
  if (!sessionMonitorData.includes(fragment)) {
    failures.push(`teacher monitor offer-map alignment: missing ${fragment}`);
  }
}
for (const [surface, source] of [
  ["content-model progression", progressionCore],
  ["local progression adapter", localProgressionAdapter],
  ["next-mode policy", nextModePolicy],
]) {
  if (!source.includes("getLevelAwareRecommendedGameModes")) {
    failures.push(`${surface}: must use the shared level-aware recommendation filter`);
  }
}
for (const [surface, source, fragment] of [
  ["local progression adapter", localProgressionAdapter, "isLaunchGameModeSupported"],
  ["local progression adapter", localProgressionAdapter, "isGameModeSupportedAtLevel"],
  ["local progression adapter", localProgressionAdapter, "function resolveReplaySeed"],
  ["local progression adapter", localProgressionAdapter, "metadata?.replaySeed"],
  ["playable route shell", playableRouteShell, "gameSupportedAtLevel"],
  ["recommended routes card", recommendedRoutesCard, "isGameModeSupportedAtLevel"],
  ["recommended routes card", recommendedRoutesCard, "unit.unitMeta.level"],
  ["completion next card", completionNextCard, "isGameModeSupportedAtLevel"],
  ["completion next card", completionNextCard, "offerMap.level"],
  ["game access gate", accessGate, "unsupported-level"],
]) {
  if (!source.includes(fragment)) {
    failures.push(`${surface}: missing curriculum-level game access guard ${fragment}`);
  }
}

for (const fragment of [
  "getGameAudioCoverage",
  "audioReady",
  "audioReady: getGameAudioCoverage",
  "audioCues: ContentPackage[\"audioCues\"]",
]) {
  if (!recommendedRoutesCard.includes(fragment)) {
    failures.push(`recommended routes card must align learner continuation with audio readiness: ${fragment}`);
  }
}

for (const fragment of ["!cue.gameMode || cue.gameMode === gameMode", "targetCues = scopedCues.filter"]) {
  if (!contentModelIndex.includes(fragment)) {
    failures.push(`game audio coverage must enforce explicit cue game scope: ${fragment}`);
  }
}

for (const [label, source, fragments] of [
  ["playable route shell", playableRouteShell, ["audioSupportPlan", "getGameAudioCoverage({ unit, audioCues, audioSupportPlan"]],
  ["recommended routes", recommendedRoutesCard, ["audioSupportPlan", "gameMode: mode, targetLanguage", "gameMode: offer.gameMode, targetLanguage"]],
  ["completion navigation", completionNextCard, ["audioSupportPlan", "gameMode: nextMode, targetLanguage"]],
  ["activity hub", activityHub, ["audioSupportPlan", "getGameAudioCoverage({ unit, audioCues, audioSupportPlan"]],
  ["front door", frontDoorFlow, ["audioSupportPlan", "gameMode: launchSession.entryMode", "gameMode: nextMode"]],
]) {
  for (const fragment of fragments) {
    if (!source.includes(fragment)) {
      failures.push(`${label} must preserve reviewed audio support-plan authority: ${fragment}`);
    }
  }
}

for (const fragment of ["audioCues={audioCues}", "unit={unit}"]) {
  if (!playableRouteShell.includes(fragment)) {
    failures.push(`playable route shell must pass completion audio context: ${fragment}`);
  }
}
for (const fragment of ["nextAudioReady", "getGameAudioCoverage", "audioCues"]) {
  if (!completionNextCard.includes(fragment)) {
    failures.push(`completion navigation must respect next-game audio readiness: ${fragment}`);
  }
}

for (const [surface, source, fragment] of [
  ["flashcard entry audio seed resolver", flashcardEntryFlow, "resolveCanonicalGameReplaySeed({"],
  ["flashcard entry audio handoff", flashcardEntryFlow, "replaySeed={replaySeed}"],
]) {
  if (!source.includes(fragment)) {
    failures.push(`${surface}: entry practice audio must preserve the canonical replay seed (${fragment})`);
  }
}

for (const fragment of [
  "getNextUncompletedRecommendedMode",
  "recommendedModes.slice(searchStart)",
  "!progression.completedGameModes.includes(mode)",
]) {
  if (!nextModePolicy.includes(fragment)) {
    failures.push(`next recommended mode policy: missing ${fragment}`);
  }
}

for (const [surface, source] of [
  ["student launch flow", studentLaunchFlow],
  ["front-door flow", frontDoorFlow],
  ["progress summary", readText("apps/web/src/features/progression/UnitSessionProgressSummary.tsx")],
  ["flashcard entry flow", readText("apps/web/src/features/game-shell/entry/FlashcardDemoFlow.tsx")],
]) {
  if (!source.includes("getNextUncompletedRecommendedMode")) {
    failures.push(`${surface}: must use the shared next recommended mode policy`);
  }
}

for (const [surface, source, fragment] of [
  ["playable route shell audio handoff", playableRouteShell, "replaySeed={replaySeed}"],
  ["learning audio contract props", learningAudioCard, "replaySeed: string"],
  ["learning audio contract event", learningAudioCard, "replaySeed,"],
]) {
  if (!source.includes(fragment)) {
    failures.push(`${surface}: shared learning audio must preserve the route replay seed (${fragment})`);
  }
}

for (const fragment of [
  "validateCanonicalGameEventSequence",
  "events.filter((event) => event.gameMode === gameMode)",
  "result.earnedStarDust",
  "targetLanguage: string",
  "Canonical game completion requires a non-blank target language.",
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

if (frontDoorFlow.includes("startUnlockedGameMode")) {
  failures.push("front-door canonical handoff: front door must let the mounted game emit its single game_started event");
}

for (const fragment of [
  "validateCanonicalGameCompletion",
  "sessionEventsRef",
  "PairingMatchUpGame",
  "PairingMemoryMatchGame",
  "LabelItPracticeGame",
  "BalloonPopPracticeGame",
  "QuizPracticeGame",
  "TrueFalsePracticeGame",
  "TypeAnswerPracticeGame",
  "SpellingPracticeGame",
  "FillInBlankPracticeGame",
  "SentenceBuilderPracticeGame",
  "SpeakItPracticeGame",
  "Completion is paused until the event evidence is valid.",
]) {
  if (!frontDoorFlow.includes(fragment)) {
    failures.push(`front-door canonical completion: missing ${fragment}`);
  }
}

const promotedLaunchComponents = [
  "PairingMemoryMatchGame",
  "PairingMatchUpGame",
  "LabelItPracticeGame",
  "BalloonPopPracticeGame",
  "QuizPracticeGame",
  "TrueFalsePracticeGame",
  "TypeAnswerPracticeGame",
  "SpellingPracticeGame",
  "FillInBlankPracticeGame",
  "SentenceBuilderPracticeGame",
  "SpeakItPracticeGame",
];

for (const [surface, source] of [
  ["student launch flow", studentLaunchFlow],
  ["front-door flow", frontDoorFlow],
]) {
  for (const component of promotedLaunchComponents) {
    if (!source.includes(component)) {
      failures.push(`${surface}: missing promoted canonical component ${component}`);
    }
  }
}

const contractSources = [
  progressionAdapter,
  ...integrations.map((integration) => readText(integration.component)),
  ...entryIntegrations.map((integration) => readText(integration.component)),
];
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
  "Canonical game event sequence must include audio_requested evidence after game_started.",
  "Canonical game audio_requested events must include non-blank cueText.",
  "Canonical game audio_requested events must include a language.",
  "Canonical game audio_requested events must include a supported cueKind.",
  "Canonical game contract needs review",
  "Completion is paused until the event evidence is valid.",
  "if (!replay.valid)",
  "tenantId: args.launchSession.tenantId",
  "expectedTenantId",
  "expectedEarnedStarDust",
  "expectedIdentity",
  "Canonical game event ${event.type} must include tenantId metadata.",
  "Canonical game event ${event.type} must include unit identity.",
  "Canonical game event ${event.type} must include launch identity.",
  "Canonical game event ${event.type} must include student session identity.",
  "must preserve unit",
  "must preserve launch",
  "must preserve student session",
  "must preserve replay seed",
  "Canonical game mastery and completion awards must agree",
  "Canonical game game_completed event must identify its deterministic scoring profile.",
  "Canonical game mastery and completion scoring profiles must agree",
  "CANONICAL_GAME_SCORING_PROFILE_BY_MODE",
  "must use scoring profile",
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
  "validateProgressionLaunchIdentity",
]) {
  if (!progressionAdapter.includes(fragment)) {
    failures.push(`canonical game progression boundary: completion adapter must block locked modes: ${fragment}`);
  }
}

for (const fragment of [
  "const gameAudioReady = audioCoverage.ready",
  "const curatedOfferReady = !offerMap || isStudentOfferReady(currentOffer)",
  "const gameUnlocked = gameSupportedAtLevel && curatedOfferReady && currentProgression.unlockedGameModes.includes(gameMode) && gameAudioReady",
  "const gameSupportedAtLevel = isGameModeSupportedAtLevel(gameMode, unit.unitMeta.level)",
  "{gameUnlocked ? (",
  "!curatedOfferReady",
  "curated-offer",
  "audio-required",
  "This activity is not offered yet",
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
  "isCanonicalGameReplaySeed",
  "replay-v1:",
  "replaySeed",
]) {
  if (![replayContract, progressionAdapter, eventLog, ...integrations.map((integration) => readText(integration.component))].some((source) => source.includes(fragment))) {
    failures.push(`canonical game replay boundary: missing deterministic seed fragment: ${fragment}`);
  }
}

const replayMetadataFragments = [
  "replaySeed: resolveCanonicalGameReplaySeed({",
  "replaySeed: args.replaySeed ?? createCanonicalGameReplaySeed",
  "replaySeed: createCanonicalGameReplaySeed({ unitKey: args.launchSession.unitKey, gameMode: args.gameMode })",
];
if (!replayMetadataFragments.some((fragment) => progressionAdapter.includes(fragment))) {
  failures.push("progression adapter replay boundary: shared game, audio, and completion events must carry replay evidence by default.");
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

console.log(`PASS ${integrations.length} canonical game integration component(s) plus ${entryIntegrations.length} canonical entry slice preserve shared event, audio, completion, route, and state-ownership contracts.`);

function readText(relativePath) {
  return readFileSync(new URL(relativePath, root), "utf8");
}

function getOfferBody(source, offerId) {
  const start = source.indexOf(`offerId: "${offerId}"`);
  if (start < 0) return "";
  const end = source.indexOf("    },", start);
  return source.slice(start, end < 0 ? source.length : end);
}
