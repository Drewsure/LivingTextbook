import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const output = join(root, ".tmp-publisher-submission-package-review-journey.cjs");
const sourcePath = join(root, "packages", "content-model", "src", "publisherSubmissionPackageReviewJourney.ts");
writeFileSync(output, ts.transpileModule(readFileSync(sourcePath, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, "utf8");

try {
  const model = await import(`file://${output}`);
  const valid = {
    journeyId: "journey-a",
    tenantId: "tenant-a",
    packageId: "package-a",
    manifestId: "manifest-a",
    reconciliationId: "reconciliation-a",
    quarantineId: "q-00000000-0000-4000-8000-000000000001",
    evidencePacketId: "evidence-packet-a",
    packageReviewPacketId: "package-review-packet-a",
    packageEvidenceReviewId: "package-evidence-review-a",
    publisherEvidenceRequestIds: ["rights-evidence", "accessibility-evidence", "scan-evidence"],
    sourceChecksumSha256: "a".repeat(64),
    evidenceIndexRoute: "/teacher/evidence/tenant-a",
    evidenceHandoffRoute: "/teacher/evidence/tenant-a/handoff",
    status: "blocked",
    reviewOnly: true,
    sampleDataOnly: true,
    gates: [{ gateId: "manifest", label: "Manifest", status: "passed", evidence: "Synthetic manifest", nextAction: "Continue review" }],
    blockedActions: ["No package assembly", "No file promotion", "No QR print", "No persistence activation", "No student-facing use"],
    nextGates: ["Complete review"],
    packageAssemblyAllowed: false,
    promotionAllowed: false,
    qrPrintAllowed: false,
    persistenceActivationAllowed: false,
    studentFacingUseAllowed: false,
  };
  if (model.validatePublisherSubmissionPackageReviewJourney(valid).length !== 0) failures.push("valid review journey must pass");
  const unsafe = { ...valid, qrPrintAllowed: true };
  if (!model.validatePublisherSubmissionPackageReviewJourney(unsafe).some((error) => error.includes("qrPrintAllowed"))) failures.push("QR print must remain blocked");
  const wrongQuarantine = { ...valid, quarantineId: "https://example.test/q" };
  if (!model.validatePublisherSubmissionPackageReviewJourney(wrongQuarantine).some((error) => error.includes("opaque"))) failures.push("external quarantine identity must be rejected");
  if (!model.validatePublisherSubmissionPackageReviewJourney({ ...valid, publisherEvidenceRequestIds: [] }).some((error) => error.includes("publisher evidence request IDs"))) failures.push("publisher evidence request lineage must be required");
} finally {
  rmSync(output, { force: true });
}

const route = readFileSync(join(root, "apps", "web", "src", "app", "teacher", "uploads", "[tenantId]", "page.tsx"), "utf8");
const panel = readFileSync(join(root, "apps", "web", "src", "features", "content-intake", "PublisherSubmissionPackageReviewJourneyPanel.tsx"), "utf8");
for (const marker of ["PublisherSubmissionPackageReviewJourneyPanel", "createPublisherSubmissionPackageReviewJourney", "validatePublisherSubmissionPackageReviewJourneyPreview"]) if (!route.includes(marker)) failures.push(`upload route is missing journey marker: ${marker}`);
for (const marker of ["Controlled sample package journey", "Publisher source to reviewed package, with every gate visible", "Sample data only", "Release blocked", "Teacher-led student rehearsal"]) if (!panel.includes(marker)) failures.push(`review journey panel is missing marker: ${marker}`);
if (panel.includes("type=\"file\"") || panel.includes("fetch(") || panel.includes("navigator.mediaDevices")) failures.push("review journey panel must remain read-only");
if (failures.length > 0) { for (const failure of failures) console.error(`FAIL ${failure}`); process.exit(1); }
console.log("PASS publisher submission review journey binds manifest, quarantine, package, evidence, delivery, and rehearsal gates while keeping release blocked.");
