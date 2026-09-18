import { readFileSync } from "node:fs";

const sources = {
  schema: readSource("../apps/web/src/data/sampleBackendSchemaDraft.ts"),
  candidate: readSource("../apps/web/src/data/sampleBackendMigrationCandidates.ts"),
  spec: readSource("../apps/web/src/data/sampleBackendMigrationSpecs.ts"),
};

const failures = [];
const requiredMarkers = [
  ["mode", "review-only"],
  ["checks", "side-effects"],
  ["blocked_actions", "package-write"],
  ["offline-activation", "student-promotion", "hosted-redirect-mutation"],
];

const blocks = {
  schema: extractBlock(sources.schema, 'entityId: "local_companion_handoff"', "    },"),
  candidate: extractBlock(sources.candidate, 'migrationId: "m011-local-companion-handoff-records"', "    },"),
  spec: extractBlock(sources.spec, 'specId: "spec-local-companion-handoff"', "    },"),
};

for (const [name, block] of Object.entries(blocks)) {
  if (!block) {
    failures.push(`${name} does not contain the local companion handoff record.`);
    continue;
  }

  for (const markerGroup of requiredMarkers) {
    if (!markerGroup.every((marker) => block.includes(marker))) {
      failures.push(`${name} is missing local handoff packet marker(s): ${markerGroup.join(", ")}.`);
    }
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

console.log("PASS local companion handoff storage preserves review-only packet fields and blocked actions.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function extractBlock(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  if (start < 0) {
    return "";
  }

  const end = source.indexOf(`\n${endMarker}`, start);
  return source.slice(start, end < 0 ? source.length : end);
}
