import { readFileSync } from "node:fs";

const routeListPath = new URL("../docs/ACTIVE_ROUTE_VERIFICATION_LIST.md", import.meta.url);
const routeList = readFileSync(routeListPath, "utf8");
const activeRouteSection = routeList.split("## Planned QR Route, Not Active Yet")[0] ?? routeList;
const urls = Array.from(activeRouteSection.matchAll(/`(http:\/\/127\.0\.0\.1:3000\/[^`]*)`/g), (match) => match[1]);
const expectedTextByPath = new Map([
  ["/", ["Local Preview"]],
  ["/teacher", ["Teacher Launch Protocol", "Demo route shortcuts", "Printable Worksheet", "/print/demo-unit-1", "Support language control", "Target language only"]],
  ["/partner-demo", ["Partner package paths", "Teacher private library", "Printable Worksheet", "/print/partner-demo-unit-1"]],
  ["/teacher/intake", ["Foundation verification gate", "verify:package-readiness", "verify:local-bundle", "verify:private-assignments", "verify:collection", "verify:class-roster", "verify:session-settings", "verify:upload-channels", "verify:backend-storage", "verify:release-control", "Earned collection readiness", "Class roster readiness", "Teacher session settings safety", "Upload channel readiness", "Uploads are intake records first", "Image upload for Labelled Diagram", "PDF and text source intake", "Audio and music upload", "Video upload", "No uploaded file becomes student-facing", "Upload review queue", "Review queue preview", "Labelled Diagram image review", "Student-facing use blocked", "No automatic PDF-to-game publish", "Upload promotion readiness", "Target-specific promotion preview", "No student-facing promotion", "No folder placement promotion", "Labelled Diagram asset readiness", "game_asset_manifest", "label_anchor_record", "No student-facing image game", "No live label editor", "Multimedia asset readiness", "media_playlist_binding", "background_media_policy_binding", "No media-only progress", "No background music overriding learning audio", "Backend storage readiness", "Release control readiness", "Competitive feature coverage", "Curated activity pathways", "Private tenant library first", "Japanese as target language", "Private tenant library", "Public community library blocked for v1", "Teacher private drafts", "Tenant-approved package library", "Share and embed readiness", "Private assignment links", "Public sharing blocked", "IFrame embed blocked for v1", "Embed origin policy", "Target language expansion", "Assist language is not target language", "Furigana rendering", "Segmentation policy", "Japanese pilot blocked", "Activity pathway compatibility", "Printable vocabulary sheet", "Crossword", "Target-language trigger", "Printable output readiness", "Vocabulary listening sheet", "Sentence practice worksheet", "PDF export blocked", "Teacher authoring readiness", "Fast authoring creates draft packages only", "Direct AI publish", "Review before assignment", "Class roster identity boundary", "Teacher reports without premature accounts", "Package publish gate", "Pilot source strategy", "Pilot release candidate", "Backend selection gate", "Background media policy", "Maintenance change queue", "Event acceptance", "Event safety", "Report event acceptance", "taxonomy-v2026.07.foundation", "Required event fields", "38 checked routes"]],
  ["/teacher/authoring/draft-sample-publisher-l1-u1", ["Teacher draft package", "Draft only", "Local edit preview", "Draft audio coverage preview", "Draft review handoff preview", "Review packet blocked", "Schema validation packet", "Source lineage packet", "Audio coverage packet", "Rights and version packet", "Route and activity packet", "Approval packet", "Draft persistence required", "No student assignment", "Term audio", "Sentence audio", "Instruction audio", "Save draft blocked", "Submit for review blocked", "Student assignment blocked", "Audio regeneration required", "Review before assignment", "Audio before students", "Private tenant library candidate", "No direct publish"]],
  ["/teacher/review", ["Teacher draft review queue", "Review workbench preview", "Review handoff packet", "Verifier submission blocked", "Package approval blocked", "Student assignment blocked", "Schema validation packet", "Audio coverage packet", "Rights and version packet", "Route and activity packet", "Approval packet", "No direct AI publish", "No live approval", "Durable handoff storage required", "Verifier submission preflight", "Verifier submission still blocked", "Schema packet ready", "Audio regeneration pending", "Support language support-only", "Route compatibility ready", "Review evidence pending", "No automatic verifier submit", "Reviewer decision preview", "Decision actions disabled", "Return for edits", "Needs audio", "Ready for approval", "Approval still blocked", "Approver identity required", "Review evidence packet preview", "Evidence upload blocked", "Reviewer identity evidence", "Evidence storage required", "No file upload in foundation preview", "Review audit trail preview", "Audit trail storage required", "Handoff packet created", "Reviewer decision drafted", "Evidence packet blocked", "Approval ledger blocked", "No live state transition"]],
  ["/teacher/library/sample-publisher", ["Teacher private library", "Private-first", "Teacher private drafts", "Tenant-approved package library", "School shared library", "Public community library blocked for v1", "No student data copied", "Source lineage preserved"]],
  ["/teacher/media/sample-publisher", ["Teacher media library", "Media maintenance preview", "Storage before live media tools", "media_manifest", "media_playlist_binding", "background_media_policy_binding", "local_media_bundle_entry", "Partner-owned assets", "Rights proof review", "Playlist binding review", "Background media policy review", "Local bundle media review", "Upload still blocked", "No live media upload", "No media-only progress", "Local folder activation blocked"]],
  ["/local/sample-publisher", ["Local companion package preview", "Closed local companion", "Local release gate", "Package artifact map", "Package handoff checklist", "Generated manifest snapshot", "Bundled game routes", "Local deployment preflight"]],
  ["/launch/demo-unit-1", ["Unit media"]],
  ["/launch/partner-demo-unit-1", ["Unit media"]],
  ["/teacher/units/ministar%3Aministar-english%3AL1%3AU1", ["Teacher unit review", "Review before assignment", "Curated activity path", "Audio and media coverage", "Pilot blockers"]],
  ["/teacher/units/sample-publisher%3Apartner-textbook-companion%3AL1%3AU1", ["Teacher unit review", "Review before assignment", "Curated activity path", "Audio and media coverage", "Pilot blockers"]],
  ["/assign/assignment-ministar-demo-whole-class", ["Private assignment link", "Student-facing assignment preview", "Curated activity pathway", "Private-first sharing rules"]],
  ["/assign/assignment-sample-publisher-front-door", ["Private assignment link", "Student-facing assignment preview", "Curated activity pathway", "Private-first sharing rules"]],
  ["/collection/demo-unit-1", ["Earned collection", "Collection room preview", "Mastery unlocks only", "No random rewards", "Ownership provenance", "Unlock source event", "Policy-gated storage preview"]],
  ["/collection/partner-demo-unit-1", ["Earned collection", "Collection room preview", "Mastery unlocks only", "No random rewards", "Ownership provenance", "Unlock source event", "Policy-gated storage preview"]],
  ["/teacher/sessions/demo-unit-1", ["Roster identity", "Session pilot readiness", "Report package boundary", "Event acceptance gate", "Media engagement", "Settings snapshot", "teacher_enablement_persisted", "tap-to-speak learning audio"]],
  ["/teacher/sessions/partner-demo-unit-1", ["Roster identity", "Session pilot readiness", "Report package boundary", "Event acceptance gate", "Media engagement", "Settings snapshot", "teacher_enablement_persisted", "tap-to-speak learning audio"]],
  ["/teacher/sessions/demo-unit-1/report-package", ["Report package preview", "Export blocked", "Event acceptance summary", "Support-only signals"]],
  ["/teacher/sessions/partner-demo-unit-1/report-package", ["Report package preview", "Export blocked", "Event acceptance summary", "Support-only signals"]],
  ["/media/playlist-ministar-l1-u1-greetings", ["Media playlist route", "Demo media controls", "support-only events"]],
  ["/print/demo-unit-1", ["Printable worksheet preview", "Browser-print preview", "Vocabulary listening sheet", "Sentence practice worksheet", "PDF export blocked", "Audio bridge", "Version snapshot"]],
  ["/media/playlist-sample-publisher-l1-u1-routines", ["Media playlist route", "Demo media controls", "support-only events"]],
  ["/print/partner-demo-unit-1", ["Printable worksheet preview", "Browser-print preview", "Vocabulary listening sheet", "Sentence practice worksheet", "PDF export blocked", "Audio bridge", "Version snapshot"]],
]);

if (urls.length === 0) {
  console.error("No active local routes found in docs/ACTIVE_ROUTE_VERIFICATION_LIST.md.");
  process.exit(1);
}

const results = [];

for (const url of urls) {
  try {
    const response = await fetch(url, { redirect: "manual" });
    const expectedText = expectedTextByPath.get(new URL(url).pathname) ?? [];
    const body = expectedText.length > 0 && response.ok ? await response.text() : "";
    const missingExpectedText = expectedText.filter((text) => !body.includes(text));

    results.push({
      url,
      status: response.status,
      ok: response.status >= 200 && response.status < 400 && missingExpectedText.length === 0,
      expectedText,
      missingExpectedText,
    });
  } catch (error) {
    results.push({ url, status: "error", ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}

for (const result of results) {
  const marker = result.ok ? "PASS" : "FAIL";
  const textCheck =
    result.expectedText?.length > 0 && result.missingExpectedText?.length > 0
      ? ` missing expected text: ${result.missingExpectedText.join(", ")}`
      : result.expectedText?.length > 0
        ? ` contains: ${result.expectedText.join(", ")}`
        : "";
  const detail = result.error ? ` ${result.error}` : textCheck;
  console.log(`${marker} ${result.status} ${result.url}${detail}`);
}

const failed = results.filter((result) => !result.ok);

if (failed.length > 0) {
  console.error(`${failed.length} active route check(s) failed.`);
  process.exit(1);
}

console.log(`${results.length} active route check(s) passed.`);
