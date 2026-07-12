import { readFileSync } from "node:fs";

const routeListPath = new URL("../docs/ACTIVE_ROUTE_VERIFICATION_LIST.md", import.meta.url);
const routeList = readFileSync(routeListPath, "utf8");
const activeRouteSection = routeList.split("## Planned QR Route, Not Active Yet")[0] ?? routeList;
const urls = Array.from(activeRouteSection.matchAll(/`(http:\/\/127\.0\.0\.1:3000\/[^`]*)`/g), (match) => match[1]);
const expectedTextByPath = new Map([
  ["/", ["Local Preview"]],
  ["/teacher", ["Teacher Launch Protocol", "Demo route shortcuts", "Printable Worksheet", "/print/demo-unit-1", "Support language control", "Target language only"]],
  ["/partner-demo", ["Partner package paths", "Printable Worksheet", "/print/partner-demo-unit-1"]],
  ["/teacher/intake", ["Foundation verification gate", "verify:package-readiness", "verify:local-bundle", "verify:session-settings", "verify:backend-storage", "Teacher session settings safety", "Backend storage readiness", "Competitive feature coverage", "Curated activity pathways", "Private tenant library first", "Japanese as target language", "Private tenant library", "Public community library blocked for v1", "Teacher private drafts", "Tenant-approved package library", "Share and embed readiness", "Private assignment links", "Public sharing blocked", "IFrame embed blocked for v1", "Embed origin policy", "Target language expansion", "Assist language is not target language", "Furigana rendering", "Segmentation policy", "Japanese pilot blocked", "Activity pathway compatibility", "Printable vocabulary sheet", "Crossword", "Target-language trigger", "Printable output readiness", "Vocabulary listening sheet", "Sentence practice worksheet", "PDF export blocked", "Teacher authoring readiness", "Fast authoring creates draft packages only", "Direct AI publish", "Review before assignment", "Package publish gate", "Pilot source strategy", "Pilot release candidate", "Backend selection gate", "Background media policy", "Maintenance change queue", "Event acceptance", "Event safety", "Report event acceptance", "taxonomy-v2026.07.foundation", "Required event fields", "29 checked routes"]],
  ["/local/sample-publisher", ["Local companion package preview", "Closed local companion", "Local release gate", "Package artifact map", "Package handoff checklist", "Generated manifest snapshot", "Bundled game routes", "Local deployment preflight"]],
  ["/launch/demo-unit-1", ["Unit media"]],
  ["/launch/partner-demo-unit-1", ["Unit media"]],
  ["/teacher/sessions/demo-unit-1", ["Session pilot readiness", "Report package boundary", "Event acceptance gate", "Media engagement", "Settings snapshot", "teacher_enablement_persisted", "tap-to-speak learning audio"]],
  ["/teacher/sessions/partner-demo-unit-1", ["Session pilot readiness", "Report package boundary", "Event acceptance gate", "Media engagement", "Settings snapshot", "teacher_enablement_persisted", "tap-to-speak learning audio"]],
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
