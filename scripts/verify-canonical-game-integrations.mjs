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
      'emitInteractionEvent("round_shown"',
      'emitInteractionEvent("answer_submitted"',
      'emitInteractionEvent("answer_result"',
      'emitInteractionEvent("mastery_updated"',
      "completeGameMode",
      "onComplete(result)",
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

const contractSources = [progressionAdapter, ...integrations.map((integration) => readText(integration.component))];
for (const eventType of standardEventTypes) {
  if (!contractSources.some((source) => source.includes(eventType))) {
    failures.push(`canonical game contract: missing standard event reference: ${eventType}`);
  }
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
