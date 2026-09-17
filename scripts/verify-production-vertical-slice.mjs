import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function readText(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`missing required vertical-slice source: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(absolutePath, "utf8");
}

function requireFragments(label, source, fragments) {
  for (const fragment of fragments) {
    if (!source.includes(fragment)) failures.push(`${label}: missing ${fragment}`);
  }
}

const launchPage = readText("apps/web/src/app/launch/[code]/page.tsx");
const studentFlow = readText("apps/web/src/features/student/StudentLaunchFlow.tsx");
const progressionIdentity = readText("packages/content-model/src/progressionIdentity.ts");
const localEvidenceStore = readText("apps/web/src/features/persistence/localSessionEvidenceStore.ts");
const localEvidencePanel = readText("apps/web/src/features/teacher/TeacherSessionLocalEvidencePanel.tsx");
const launchResolver = readText("apps/web/src/data/sampleLaunchResolver.ts");
const launchSession = readText("apps/web/src/data/sampleLaunchSession.ts");
const packageFixture = readText("apps/web/src/data/sampleMultimediaPackage.ts");
const partnerPackage = readText("apps/web/src/data/samplePartnerPackage.ts");
const partnerTenant = readText("apps/web/src/features/tenant/samplePublisherTenant.ts");
const teacherPage = readText("apps/web/src/app/teacher/sessions/[launchCode]/page.tsx");
const teacherMonitor = readText("apps/web/src/data/sampleTeacherSessionMonitor.ts");
const teacherPanel = readText("apps/web/src/features/teacher/TeacherSessionMonitorPanel.tsx");
const localBundle = readText("apps/web/src/features/deployment/LocalBundleManifestPanel.tsx");
const localBundlePlan = readText("apps/web/src/data/sampleLocalBundlePlan.ts");
const mediaResolver = readText("apps/web/src/features/multimedia/mediaSourceResolver.ts");
const phaserGuard = readText("apps/web/src/features/game-shell/GameSequence.tsx");
const handoffStore = readText("apps/web/src/features/persistence/progressionHandoffStore.ts");
const flashcardRoute = readText("apps/web/src/features/game-shell/entry/FlashcardDemoFlow.tsx");
const recommendedRoutes = readText("apps/web/src/features/student/components/RecommendedGameRoutesCard.tsx");
const playableGameShell = readText("apps/web/src/features/game-shell/components/PlayableGameRouteShell.tsx");
const completionCard = readText("apps/web/src/features/game-shell/components/GameCompletionNextCard.tsx");
const sentencePage = readText("apps/web/src/app/sentence/[code]/page.tsx");

requireFragments("launch route", launchPage, ["resolveSampleLaunchContext", "<StudentLaunchFlow"]);
requireFragments("student flow", studentFlow, [
  "completeFlashcardEntryPractice", "<FlashcardPracticeCard", "<PairingMemoryMatchGame", "<QuizPracticeGame",
  "validateCanonicalGameCompletion", "createProgressionContinuityEnvelope", "getGameAudioCues",
  "resolveTargetLanguage", "<NextGameUnlockCard", "<UnitSessionProgressSummary",
  "appendLocalSessionEvidence", "contentPackage.meta.packageId",
]);
requireFragments("local rehearsal evidence store", localEvidenceStore, [
  "browser-rehearsal-only", "getLocalSessionEvidenceStorageKey", "GameProgressEvent[]", "localStorage",
  "packageId", "appendLocalSessionEvidence", "mergeEventHistory", "different package or student session",
]);
requireFragments("student event append boundary", studentFlow, [
  "const updatedEvents = [...sessionEventsRef.current, ...nextEvents]",
  "sessionEventsRef.current = nextSessionEvents",
  "setSessionEvents(nextSessionEvents)",
]);
requireFragments("optional launch identity boundary", progressionIdentity, [
  "studentSessionId?: string", "readOptionalField", "return {};",
]);
requireFragments("sample launch session", launchSession, ['entryMode: "flashcards"', '"match-up"', '"memory-match"', '"quiz"']);
requireFragments("sample content package", packageFixture, ["sampleAudioCues", "sampleFeedbackAudioCues", "audioSupportPlans", "mediaAssets", "playlists"]);
requireFragments("white-label package", partnerPackage, ["samplePartnerContentPackage", "samplePartnerFeedbackAudioCues"]);
requireFragments("white-label tenant", partnerTenant, ["samplePublisherTenant", "sample-publisher"]);
requireFragments("sample resolver", launchResolver, ["sampleMultimediaContentPackage", "samplePartnerContentPackage", "samplePublisherTenant", "ministarTenant"]);
requireFragments("teacher report route", teacherPage, ["resolveSampleTeacherSessionMonitorContext", "TeacherSessionMonitorPanel", "TeacherSessionPreflightPanel"]);
requireFragments("teacher monitor evidence", teacherMonitor, [
  "createSampleMonitorEvents", 'type: "entry_practice_completed"', 'type: "game_unlocked"', 'gameMode: "memory-match"',
  'type: "game_started"', 'type: "game_completed"', 'type: "mastery_updated"', "validateCanonicalGameReportEvidence", "createProgressEventEnvelope",
]);
requireFragments("teacher report panel", teacherPanel, ["FrontDoorTeacherReportPreview", "TeacherCanonicalGameEvidenceCard", "context.events", "context.progression"]);
requireFragments("teacher local evidence panel", localEvidencePanel, [
  "readLocalSessionEvidence", "subscribeToLocalSessionEvidence", "not hosted persistence", "Rehearsal captured", "evidence.packageId",
]);
requireFragments("local delivery boundary", localBundle, ["audio", "video", "QR fallback routes"]);
requireFragments("local delivery plan", localBundlePlan, ["reportsProgress", "reporting", "localFallbackPath"]);
requireFragments("media delivery boundary", mediaResolver, ['mode === "local-first"', '"hosted-first"', 'sourceKind: "missing"']);
requireFragments("Phaser promotion boundary", phaserGuard, ["External Phaser candidates remain review-only."]);
requireFragments("shared route handoff helper", handoffStore, [
  "export function saveProgressionRouteHandoff",
  "expectedPackageId: args.packageId",
  "expectedStudentSessionId: args.progression.studentSessionId",
]);
requireFragments("flashcard route handoff", flashcardRoute, [
  "saveProgressionRouteHandoff",
  "sourceRoute: window.location.pathname",
  "onRouteOpen={handleRouteOpen}",
]);
requireFragments("recommended route handoff", recommendedRoutes, [
  "onRouteOpen?: (mode: GameModeId, routeHref: string) => void",
  "onClick={() => onRouteOpen(route.mode, route.href)}",
]);
requireFragments("completed game route handoff", playableGameShell, [
  "saveProgressionRouteHandoff",
  "onOpenNextRoute={handleOpenNextRoute}",
  "appendLocalSessionEvidence",
]);
requireFragments("standalone route evidence continuity", flashcardRoute, [
  "appendLocalSessionEvidence",
  "Browser rehearsal evidence was not updated",
]);
requireFragments("completion handoff callback", completionCard, [
  "onOpenNextRoute?: (destinationRoute: string, nextMode: GameModeId) => void",
  "onOpenNextRoute && nextMode",
]);
requireFragments("sentence builder package binding", sentencePage, ["packageId={contentPackage.meta.packageId}"]);

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS production-shaped vertical slice covers teacher package, white-label resolver, QR launch flow, reviewed audio, Flashcards, Memory Match, canonical game progression, teacher report evidence, and hosted/local boundaries.");
}
