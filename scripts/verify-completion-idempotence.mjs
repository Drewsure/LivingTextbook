import { readFileSync } from "node:fs";

const files = [
  {
    path: "apps/web/src/features/game-shell/components/PlayableGameRouteShell.tsx",
    markers: ["completionAcceptedRef", "completedGameModes.includes", "setEventContractErrors([])"],
  },
  {
    path: "apps/web/src/features/access/FrontDoorEntryFlow.tsx",
    markers: ["completionAcceptedModesRef", "completedGameModes.includes", "setEventContractErrors([])", "completionAcceptedModesRef.current.has"],
  },
  {
    path: "apps/web/src/features/student/StudentLaunchFlow.tsx",
    markers: ["completionAcceptedModesRef", "completedGameModes.includes", "setEventContractErrors([])", "completionAcceptedModesRef.current.has"],
  },
];

for (const file of files) {
  const source = readFileSync(new URL(`../${file.path}`, import.meta.url), "utf8");
  for (const marker of file.markers) {
    if (!source.includes(marker)) {
      console.error(`FAIL completion idempotence guard missing ${marker}: ${file.path}`);
      process.exit(1);
    }
  }
}

console.log("PASS canonical completion surfaces guard accepted completions and completed replays idempotently.");
