import { readFileSync } from "node:fs";

const inventory = readFileSync(
  new URL("../docs/ZAI_MINISTAR_LAB_SUITE_INVENTORY_2026-09-12.md", import.meta.url),
  "utf8",
);

const sceneEvidence = [
  ["AirplaneScene.ts", "1c1b60801beac23254750df5640c3c16110d98b77a4921b42e0b5a761599acbb"],
  ["AnagramScene.ts", "478cb0fe0db15f17f7b5866e62b78defeb272c3548c9bb50231f136dfa3d20c1"],
  ["BalloonPopScene.ts", "72904e8ad3a7760dda7779b93216975cd192a5c959b0b71d68c74efb926440e0"],
  ["BridgeBuilderScene.ts", "44ea38d7c4a021d8cf2021beafa52c08e2e306fa9c196bcc8632dd329156d904"],
  ["CrosswordScene.ts", "ebd375a0b15113bd26bf036cd93310ee34b8aa952ee4b4c108bb599679c1a357"],
  ["EndlessRunnerScene.ts", "407a28d70ccdaccd02466c8b4ddee6b7e408fa26ff56d5409624cc805cdbe7bc"],
  ["FarmLifeScene.ts", "ebf7a0877016685ca99fcad31595989304fde2cdd92003926151bdee0f7584b3"],
  ["FlashCardsScene.ts", "482eb887105056dadc8e641d8ee7434e3ff972a36ec616cd7174597f60ffdf74"],
  ["GameshowScene.ts", "9ec34fb216e418f9363b7ef72abe4916cb5c7ed08617d9a2987cebabe96d6a28"],
  ["GroupSortScene.ts", "e5df321f11d4515425d1771db28269582819eebb2449c8f372b28100ac6901b6"],
  ["LabelItScene.ts", "b08a85a2618b3261571048ee6ebf7957c9f66bf564059d9e0a586cf9bd57a2b1"],
  ["MatchUpScene.ts", "4739f74d946d5a27b334d125890924d81995b42d3a87e44481ca9093b899e20c"],
  ["MazeChaseScene.ts", "79175e5b02ef0445e8d3d6949576684bc8aca5b57fefcc6e0d7197ec89fda677"],
  ["MemoryMatchScene.ts", "d1c60fa17bf4bee63627e485ae0b096894832705fdcf173576bf3b28b8656888"],
  ["MonsterFighterScene.ts", "1e68426f97047701524b1067f314a726191b67d079fd4c8598e35fd107bedb85"],
  ["PhysicsPuzzlerScene.ts", "f20a939ad1c89997e22922fea7825c795e5f8698003f005b139076cdb72ca482"],
  ["QuizScene.ts", "177166098d0f7f098c1487d2bd5a58333d098fc9d499bc78a3e86b8cd7703ea0"],
  ["RescueQuestScene.ts", "2d1e0e7dc4bdd7b6c2f01be8fd7247b3dc12de27f9c53773a340f639ddec005a"],
  ["RhythmTapScene.ts", "d1a2d4f938aad755efde59472d523dc549bec90aa9dec3c0ad3cc5510d436041"],
  ["SnakingScene.ts", "e2a5b01f596a536ebc3858211bfca84e9a8ad525898577c35f5772636828d9f9"],
  ["SpaceExplorerScene.ts", "2b864b03eef08499fb90c55cfe5374ada366e60f4f2babcafd64b76d7938edcd"],
  ["SpeakItScene.ts", "02e09b5d7b6349f513a99877cd186c0e12ace51f92d81e9224ddd34f3513a5cc"],
  ["SpinWheelScene.ts", "6ea9e282f1053260c562d8e33bfc4844bf4f526b9d3cc97379ecf86c92bc349e"],
  ["SpotItScene.ts", "02a7b4f2f72d1f6ef6b3266b85bd3d6c9fef14cc1f8b3fb9e640733e0693d8fe"],
  ["StarFarmScene.ts", "49547d6fd590b2e4b95a058214642cfe05d6e2e677a2e90ca562c1e402c9e5a9"],
  ["StoryAdventureScene.ts", "e76a094f5d56b833f408bc2b92ccdea5440bba775435380be55f2c5bd9f9dc05"],
  ["TowerDefenseScene.ts", "ff4b46e6e3ca5a24449b4b0f96f363878047afbe9bcb18f6834c140089829dcf"],
  ["TrainingAcademyScene.ts", "bc6c7a85acc6ff4360842314ddbb726f5647a6a295e8caff1172a2516937cc28"],
  ["TreasureHuntScene.ts", "d8f910035d7fb358916683ef58b6c711cc99baf6888bbf02f6427aa6518cc28a"],
  ["TypeAnswerScene.ts", "f7bb24de0c6262a6e5b33ff1e24995d555effab584f5cd281916a596f1e60e28"],
  ["WhackAMoleScene.ts", "35268de6d926d183e14d5a07086be5f7613ba27cdef5bf7cc3941d4d66a694c2"],
  ["WordsearchScene.ts", "8d85784a13b8f00162d0615ee0f4396b4350daa7dd2c70e83a6e75742a8ab6cb"],
];

const requiredText = [
  "Drewsure/ministar-lab",
  "frozen-2026-09-12-aaa-stable",
  "eb79ddf5940ab47cc3c45c119c67ee1b6b958e55",
  "32 active scene files",
  "claims 25 games",
  "Candidate parent engine",
  "Pairing",
  "Selection",
  "Text/Spelling",
  "Narrative",
  "No direct source import",
  "No route replacement",
  "No scene-owned scoring",
  "No browser persistence ownership",
  "No package promotion",
  "No student assignment",
];

const failures = requiredText
  .filter((marker) => !inventory.includes(marker))
  .map((marker) => `FAIL Phaser scene inventory is missing marker: ${marker}`);

if (sceneEvidence.length !== 32) {
  failures.push(`FAIL Phaser scene inventory expected 32 evidence entries, found ${sceneEvidence.length}.`);
}

for (const [scene, hash] of sceneEvidence) {
  if (!inventory.includes(`| \`${scene}\` |`)) {
    failures.push(`FAIL Phaser scene inventory is missing scene: ${scene}`);
  }
  if (!inventory.includes(`\`${hash}\``)) {
    failures.push(`FAIL Phaser scene inventory is missing SHA-256 evidence for: ${scene}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("PASS Phaser scene inventory contains the 32-file frozen evidence manifest and blocked mapping guardrails.");
