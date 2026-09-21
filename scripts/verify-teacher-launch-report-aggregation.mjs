import { readFileSync } from "node:fs";

const model = readSource("../packages/content-model/src/teacherLaunchReportAggregation.ts");
const route = readSource("../apps/web/src/app/api/persistence/events/route.ts");
const client = readSource("../apps/web/src/features/persistence/hostedProgressionPersistenceClient.ts");
const panel = readSource("../apps/web/src/features/persistence/HostedProgressEventReviewPanel.tsx");
const reportPage = readSource("../apps/web/src/app/teacher/sessions/[launchCode]/report-package/page.tsx");
const failures = [];

for (const marker of [
  "TeacherLaunchReportAggregation",
  "TeacherLaunchReportAggregationScope",
  "createTeacherLaunchReportAggregation",
  "createPseudonymousLearnerSlot",
  "raw learner audio",
  "learner transcripts",
  "real learner identifiers",
  "event_effect === \"progress-affecting\"",
  "event_effect === \"report-only\"",
  "event_effect === \"support-only\"",
  "game_completed",
  "mastery_updated",
  "starDustAwarded",
  "earnedStarDust",
  "localeCompare",
]) {
  if (!model.includes(marker)) failures.push(`Aggregation model missing marker: ${marker}`);
}

for (const [label, source, markers] of [
  ["route", route, ["createTeacherLaunchReportAggregation", "report:"]],
  ["client", client, ["TeacherLaunchReportAggregation", "report?:", "body.report"]],
  ["panel", panel, ["LaunchReportSummary", "Learning evidence", "Support-only", "does not authorize export"]],
  ["report package route", reportPage, ["HostedProgressEventReviewPanel", "context.contentPackage.meta.packageId", "context.launchSession.launchCode"]],
]) {
  for (const marker of markers) {
    if (!source.includes(marker)) failures.push(`${label} missing marker: ${marker}`);
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS teacher launch report aggregation is deterministic, pseudonymous, read-only, and wired to the bounded review path.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}
