import { readFileSync } from "node:fs";

const files = {
  rehearsal: read("apps/web/src/data/sampleTeacherDryRunRehearsal.ts"),
  panel: read("apps/web/src/features/pilot/TeacherDryRunObservationPanel.tsx"),
  route: read("apps/web/src/app/teacher/dry-run/[rehearsalId]/page.tsx"),
  store: read("apps/web/src/features/persistence/browserRehearsalObservationStore.ts"),
};
const failures = [];

requireFragments("rehearsal identity", files.rehearsal, [
  "launchCode: handoffPackage.reportSnapshotEvidence.launchCode",
  "unitKey: getUnitKey(samplePartnerUnitOne.unitMeta)",
  'syntheticStudentSessionId: `teacher-dry-run:${handoffPackage.routeKey}`',
]);
requireFragments("dry-run observation panel", files.panel, [
  '"use client"',
  "TeacherDryRunObservationPanel",
  "createHumanObservedBrowserRehearsalObservation",
  "saveBrowserRehearsalObservation",
  "createBrowserRehearsalObservationHandoff",
  "data-dry-run-observation-handoff=\"review-only\"",
  "Adult evidence handoff",
  "Receipt prepared for adjudication",
  "Blocked actions",
  "Next gate",
  "syntheticStudentSessionId",
  '"no-learner-data"',
  '"no-hosted-persistence"',
  '"no-report-export"',
  "Browser-local only",
  "Release promotion and student production launch remain disabled.",
]);
requireFragments("dry-run route", files.route, [
  "TeacherDryRunObservationPanel",
  "<TeacherDryRunObservationPanel rehearsal={sampleTeacherDryRunRehearsal} />",
]);
requireFragments("observation store", files.store, [
  "getBrowserRehearsalObservationStorageKey",
  "validateBrowserRehearsalObservation",
  "window.localStorage.setItem",
  'status: "review-only"',
]);

if (files.panel.includes("fetch(") || files.panel.includes("/api/")) {
  failures.push("dry-run observation panel must remain local and must not add hosted or export actions.");
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exit(1);
}

console.log("PASS teacher dry-run observation uses a synthetic local-only session and preserves hosted, learner, export, and approval boundaries.");

function read(relativePath) {
  try {
    return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
  } catch {
    failures.push(`missing source: ${relativePath}`);
    return "";
  }
}

function requireFragments(label, source, fragments) {
  for (const fragment of fragments) {
    if (!source.includes(fragment)) failures.push(`${label}: missing ${fragment}`);
  }
}
