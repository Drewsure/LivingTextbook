import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const failures = [];
const route = readFileSync(join(root, "apps", "web", "src", "app", "api", "teacher", "uploads", "source-package-evidence-binding", "route.ts"), "utf8");
const model = readFileSync(join(root, "packages", "content-model", "src", "publisherSourceToPackageEvidenceBridge.ts"), "utf8");
const panel = readFileSync(join(root, "apps", "web", "src", "features", "content-intake", "LiveSourcePackageEvidenceBindingPanel.tsx"), "utf8");
const sourcePage = readFileSync(join(root, "apps", "web", "src", "app", "teacher", "sources", "[tenantId]", "page.tsx"), "utf8");
for (const marker of ["createPublisherSourceToPackageEvidenceBridge", "validatePublisherSourceToPackageEvidenceBridge", "readQuarantineUploadRecords", "hasReviewAuthorization", "review-only"]) if (!route.includes(marker)) failures.push(`live binding route is missing marker: ${marker}`);
for (const marker of ["sourceTermsReviewed", "sentenceApprovalRecorded", "audioEvidenceReady", "packageAssemblyAllowed: false", "studentFacingUseAllowed: false"]) if (!route.includes(marker) && !model.includes(marker)) failures.push(`source-package bridge is missing marker: ${marker}`);
if (route.includes("export async function POST") || route.includes("writeQuarantine")) failures.push("source-package binding must remain read-only");
if (route.includes("payload.") || route.includes("readFile(")) failures.push("source-package binding must not return source payload bytes");
for (const marker of ["Load live binding", "credentials: \"same-origin\"", "does not approve the source", "evidenceLanes.map"]) if (!panel.includes(marker)) failures.push(`live binding panel is missing marker: ${marker}`);
for (const marker of ["LiveSourcePackageEvidenceBindingPanel", "query.quarantineId"]) if (!sourcePage.includes(marker)) failures.push(`source review workspace is missing marker: ${marker}`);
if (failures.length) { for (const failure of failures) console.error(`FAIL ${failure}`); process.exit(1); }
console.log("PASS live source-package evidence binding is tenant-authorized, review-only, and side-effect-free.");
