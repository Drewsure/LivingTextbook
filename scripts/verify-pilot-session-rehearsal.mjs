import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`missing pilot rehearsal source: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(absolutePath, "utf8");
}

function requireFragments(label, source, fragments) {
  for (const fragment of fragments) {
    if (!source.includes(fragment)) failures.push(`${label}: missing ${fragment}`);
  }
}

const rehearsal = read("apps/web/src/data/sampleTeacherDryRunRehearsal.ts");
const rehearsalPanel = read("apps/web/src/features/pilot/TeacherDryRunRehearsalPanel.tsx");
const frontDoor = read("apps/web/src/features/access/FrontDoorEntryFlow.tsx");
const flashcards = read("apps/web/src/features/game-shell/entry/FlashcardDemoFlow.tsx");
const playableShell = read("apps/web/src/features/game-shell/components/PlayableGameRouteShell.tsx");
const teacherSession = read("apps/web/src/app/teacher/sessions/[launchCode]/page.tsx");
const persistenceRoute = read("apps/web/src/app/api/persistence/progression/route.ts");
const persistenceOperations = read("apps/web/src/server/persistence/sqliteProgressionOperations.ts");

requireFragments("rehearsal sequence", rehearsal, [
  'stageId: "front-door-route"',
  'stageId: "unit-progression"',
  'stageId: "memory-match-handoff"',
  'stageId: "sentence-builder-handoff"',
  'stageId: "game-audio"',
  'stageId: "report-policy"',
  '"/enter/sample-publisher"',
  '"/launch/partner-demo-unit-1"',
  '"/memory/partner-demo-unit-1"',
  '"/sentence/partner-demo-unit-1"',
  '"/teacher/sessions/partner-demo-unit-1"',
  "Do not collect real learner data",
]);
requireFragments("rehearsal panel", rehearsalPanel, [
  "Teacher-only rehearsal",
  "Dry-run evidence only",
  "No live workflow",
]);
requireFragments("front door runtime", frontDoor, [
  "establishStudentSession",
  "completeFlashcardEntryPractice",
  "writeHostedProgressionContinuity",
  "durableHydrationStatus",
]);
requireFragments("flashcard handoff runtime", flashcards, [
  "saveProgressionRouteHandoff",
  "appendLocalSessionEvidence",
  "onRouteOpen={handleRouteOpen}",
]);
requireFragments("canonical game handoff runtime", playableShell, [
  "readProgressionHandoffRecord",
  "saveProgressionRouteHandoff",
  "appendLocalSessionEvidence",
  "onOpenNextRoute={handleOpenNextRoute}",
]);
requireFragments("teacher report boundary", teacherSession, [
  "TeacherSessionMonitorPanel",
  "TeacherSessionLocalEvidencePanel",
  "expectedPackageId={context.contentPackage.meta.packageId}",
]);
requireFragments("hosted persistence safety", persistenceRoute, [
  "Hosted progression rehearsal writes are disabled by default.",
  "LIVING_TEXTBOOK_PERSISTENCE_ALLOW_DURABLE_WRITES",
  "LIVING_TEXTBOOK_PERSISTENCE_SCHOOL_POLICY_ACCEPTED",
  "LIVING_TEXTBOOK_PERSISTENCE_RETENTION_POLICY_ACCEPTED",
  "LIVING_TEXTBOOK_PERSISTENCE_RELEASE_APPROVED",
]);
requireFragments("persistence privacy boundary", persistenceOperations, [
  "rawLearnerAudioExcluded: true",
  "learnerTranscriptsExcluded: true",
  "Durable operations require the deployment school-policy gate.",
]);

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS pilot-ready rehearsal binds Front Door, Flashcards, Memory Match, Sentence Builder, teacher evidence, and gated hosted persistence.");
}
