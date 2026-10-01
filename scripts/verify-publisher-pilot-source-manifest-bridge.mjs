import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const script = readFileSync("scripts/create-publisher-source-manifest-from-pilot-kit.mjs", "utf8");
const docs = readFileSync("docs/PUBLISHER_PILOT_INPUT_KIT.md", "utf8");
const failures = [];
for (const marker of ["publisher-pilot-intake.json", "publisher-source-manifest.json", 'flag: \"wx\"', "reviewOnly: true", "packageAssemblyAllowed: false", "contentFilesCreated: false", "uploadPerformed: false", "Refusing to overwrite"]) if (!script.includes(marker)) failures.push(`bridge script missing safety marker: ${marker}`);
for (const marker of ["create-publisher-source-manifest-from-pilot-kit.mjs", "preflight:publisher-source", "refuses to overwrite", "does not copy", "bearer credentials"]) if (!docs.includes(marker)) failures.push(`pilot kit documentation missing marker: ${marker}`);
if (failures.length > 0) { for (const failure of failures) console.error(`FAIL ${failure}`); process.exit(1); }
const selfTest = spawnSync(process.execPath, ["scripts/create-publisher-source-manifest-from-pilot-kit.mjs", "--self-test"], { encoding: "utf8" });
if (selfTest.status !== 0) { console.error(selfTest.stdout); console.error(selfTest.stderr); process.exit(1); }
console.log("PASS publisher pilot intake bridge preserves canonical source-manifest, create-once, review-only, and no-upload boundaries.");
