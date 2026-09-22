import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const requiredMarkers = [
  ["packages/content-model/src/sourceDraftImport.ts", ["SourceDraftImportPreview", "validateSourceDraftImportPreviewBinding", "storageWriteAllowed"]],
  ["apps/web/src/data/sampleSourceDraftImport.ts", ["sampleSourceDraftImportPreviews", "sampleSourceDraftImportErrors"]],
  ["apps/web/src/features/content-intake/SourceDraftImportPreviewPanel.tsx", ["Teacher draft import preview", "Storage write", "Assignment"]],
  ["apps/web/src/app/teacher/intake/page.tsx", ["SourceDraftImportPreviewPanel"]],
];

for (const [relativePath, markers] of requiredMarkers) {
  const source = readFileSync(join(root, relativePath), "utf8");
  for (const marker of markers) {
    if (!source.includes(marker)) throw new Error(`${relativePath} is missing marker: ${marker}`);
  }
}

console.log("PASS source extraction to teacher draft import remains identity-bound, review-only, and promotion-blocked.");
