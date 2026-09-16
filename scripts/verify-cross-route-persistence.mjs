import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function readSource(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`missing cross-route persistence source: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(absolutePath, "utf8");
}

function requireFragments(label, source, fragments) {
  for (const fragment of fragments) {
    if (!source.includes(fragment)) failures.push(`${label}: missing ${fragment}`);
  }
}

const model = readSource("packages/content-model/src/hostedProgressionPersistence.ts");
const modelIndex = readSource("packages/content-model/src/index.ts");
const handoffStore = readSource("apps/web/src/features/persistence/progressionHandoffStore.ts");
const hostedRoute = readSource("apps/web/src/app/api/persistence/progression/route.ts");
const hostedClient = readSource("apps/web/src/features/persistence/hostedProgressionPersistenceClient.ts");
const hostedPanel = readSource("apps/web/src/features/persistence/HostedProgressionAdapterPanel.tsx");
const launchFlow = readSource("apps/web/src/features/student/StudentLaunchFlow.tsx");
const unlockCard = readSource("apps/web/src/features/student/components/NextGameUnlockCard.tsx");
const routeShell = readSource("apps/web/src/features/game-shell/components/PlayableGameRouteShell.tsx");
const matchPage = readSource("apps/web/src/app/match/[code]/page.tsx");
const routeContracts = readSource("apps/web/src/features/routes/routeContracts.ts");

requireFragments("hosted persistence model", model, [
  'category: "progression-continuity"',
  'adapterMode: "hosted-managed"',
  'durability: "non-durable-rehearsal"',
  "validateHostedProgressionPersistenceWrite",
  "schoolPolicyAccepted",
  "idempotencyKey",
]);
requireFragments("content-model export", modelIndex, ['export * from "./hostedProgressionPersistence";']);
requireFragments("route handoff store", handoffStore, [
  'storageMode: "session-route-handoff"',
  "window.sessionStorage",
  "validateProgressionContinuityRuntimeRequest",
  "destinationRoute",
  "studentSessionId",
]);
requireFragments("hosted progression API", hostedRoute, [
  "export async function POST",
  "export function GET",
  "LIVING_TEXTBOOK_HOSTED_PERSISTENCE_REHEARSAL",
  "status: \"blocked\"",
  "__livingTextbookHostedProgressionRehearsal",
]);
requireFragments("hosted read probe", hostedClient, ["method: \"GET\"", "cache: \"no-store\"", "status: \"not-found\""]);
requireFragments("hosted read probe panel", hostedPanel, ["Check read path", "without writing learner data", "Non-durable rehearsal"]);
requireFragments("launch handoff", launchFlow, [
  "createProgressionHandoffRecord",
  "saveProgressionHandoffRecord",
  "handleOpenNextModeRoute",
  "window.location.assign(handoff.envelope.destinationRoute)",
]);
requireFragments("unlock route action", unlockCard, ["onOpenRoute", "Open full route", "audioText={`Open the full ${modeLabel} activity route.`}"]);
requireFragments("destination hydration", routeShell, [
  "readProgressionHandoffRecord",
  "handoffStatus",
  "Validated handoff accepted",
  "setCurrentProgression(result.record.progression)",
  "window.location.pathname",
]);
requireFragments("match route package identity", matchPage, ['packageId={contentPackage.meta.packageId}']);
requireFragments("route contract", routeContracts, ["cross-route", "progression", "handoff"]);

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS cross-route progression handoff and gated hosted persistence boundaries are present.");
}
