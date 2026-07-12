import { readFileSync } from "node:fs";

const contract = readSource("../packages/content-model/src/classRoster.ts");
const rosterPlans = readSource("../apps/web/src/data/sampleClassRosterPlans.ts");
const intakePage = readSource("../apps/web/src/app/teacher/intake/page.tsx");
const frontDoorFlow = readSource("../apps/web/src/features/access/FrontDoorEntryFlow.tsx");
const rosterPanel = readSource("../apps/web/src/features/teacher/ClassRosterReadinessPanel.tsx");
const sessionRosterCard = readSource("../apps/web/src/features/teacher/TeacherSessionRosterIdentityCard.tsx");
const backendSchema = readSource("../apps/web/src/data/sampleBackendSchemaDraft.ts");
const migrationSpecs = readSource("../apps/web/src/data/sampleBackendMigrationSpecs.ts");
const routeVerifier = readSource("./verify-active-routes.mjs");
const rosterDoc = readSource("../docs/CLASS_ROSTER_CONTRACT.md");
const failures = [];

const requiredRosterIds = [
  "ministar-demo-classroom-roster",
  "sample-publisher-front-door-roster",
  "closed-local-classroom-roster",
];

const requiredDataBoundaries = [
  "teacher-issued-code",
  "progress-summary",
  "display-name",
  "raw-audio",
  "transcript",
];

const contractGuards = [
  "raw microphone audio must not be stored on learner roster slots.",
  "speech transcripts must not be stored on learner roster slots.",
  "real learner names require pilot-ready policy and persistence review.",
  "family contact data is outside the core roster contract.",
  "raw audio cannot be allowed in the core demo roster boundary.",
  "transcripts cannot be allowed in the core demo roster boundary.",
];

for (const rosterId of requiredRosterIds) {
  requireText(rosterPlans, `rosterId: "${rosterId}"`, `Sample roster plan missing roster: ${rosterId}.`);
}

for (const boundary of requiredDataBoundaries) {
  requireText(rosterPlans, `field: "${boundary}"`, `Sample roster boundaries must include ${boundary}.`);
}

for (const guard of contractGuards) {
  requireText(contract, guard, `Class roster validation guard missing: ${guard}`);
}

forbidText(rosterPlans, "storesRawAudio: true", "Sample roster plans must not store raw microphone audio.");
forbidText(rosterPlans, "storesTranscript: true", "Sample roster plans must not store speech transcripts.");
forbidText(rosterPlans, "storesFamilyContact: true", "Sample roster plans must not store family contact data.");
forbidText(rosterPlans, "storesRealName: true", "Sample roster plans must not store real learner names in the foundation layer.");

requireText(rosterPlans, "STAR-01", "MiniStar roster must expose a coded learner slot.");
requireText(rosterPlans, "BOOK-07", "Sample publisher roster must expose a coded learner slot.");
requireText(rosterPlans, "LOCAL-A", "Closed local roster must expose a coded learner slot.");
requireText(rosterPlans, "Choose the persistence adapter for durable class history.", "Roster plan must keep persistence as a pilot blocker.");
requireText(rosterPlans, "teacher-issued codes group progress without requiring accounts or personal data.", "Roster plan must explain lightweight code identity.");
requireText(intakePage, "ClassRosterReadinessPanel", "Teacher intake page must render the class roster readiness panel.");
requireText(rosterPanel, "Teacher reports without premature accounts", "Roster panel must state the account boundary.");
requireText(rosterPanel, "raw audio, and transcripts stay outside the core roster", "Roster panel must keep speech data out of core roster.");
requireText(frontDoorFlow, "These are roster slots for classroom reporting, not production student accounts.", "Front-door flow must explain learner codes are not accounts.");
requireText(sessionRosterCard, "does not imply production accounts", "Teacher session roster card must avoid implying production accounts.");
requireText(sessionRosterCard, "stored voice recordings, or stored speech transcripts", "Teacher session roster card must keep audio/transcripts out of roster.");
requireText(backendSchema, "learner_code", "Backend schema draft must use coded learner identity for event records.");
requireText(backendSchema, "Raw learner audio and transcripts stay out of core schema.", "Backend schema draft must exclude raw audio and transcripts.");
requireText(migrationSpecs, "anonymous_or_roster_student_id", "Migration specs must preserve anonymous/roster student id boundary.");
requireText(migrationSpecs, "No raw microphone audio or unreviewed tutor transcript.", "Migration specs must exclude raw audio and tutor transcript.");
requireText(routeVerifier, "Roster identity", "Active route verifier must keep teacher session roster cards visible.");
requireText(routeVerifier, "Class roster readiness", "Active route verifier must keep roster readiness visible on teacher intake.");
requireText(rosterDoc, "raw microphone audio, and speech transcripts", "Roster contract must name excluded speech data.");
requireText(rosterDoc, "A roster plan cannot be treated as pilot-ready", "Roster contract must define pilot-ready blockers.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(
  `PASS class roster readiness covers ${requiredRosterIds.length} roster plan(s), ${requiredDataBoundaries.length} data boundary/boundaries, and ${contractGuards.length} validation guard(s).`,
);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}

function forbidText(source, text, message) {
  if (source.includes(text)) {
    failures.push(message);
  }
}
