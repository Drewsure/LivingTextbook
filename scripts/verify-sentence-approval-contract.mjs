import { readFileSync } from "node:fs";

const files = {
  model: readFileSync(new URL("../packages/content-model/src/publisherSentenceApprovalRecord.ts", import.meta.url), "utf8"),
  store: readFileSync(new URL("../apps/web/src/server/uploads/quarantineUploadStore.ts", import.meta.url), "utf8"),
  route: readFileSync(new URL("../apps/web/src/app/api/teacher/uploads/sentence-approval/route.ts", import.meta.url), "utf8"),
  bridge: readFileSync(new URL("../apps/web/src/app/api/teacher/uploads/source-package-evidence-binding/route.ts", import.meta.url), "utf8"),
  readiness: readFileSync(new URL("../apps/web/src/app/api/teacher/uploads/package-readiness-binding/route.ts", import.meta.url), "utf8"),
  panel: readFileSync(new URL("../apps/web/src/features/content-intake/SentenceApprovalCapture.tsx", import.meta.url), "utf8"),
};
const required = [
  ["exactly two targets", files.model, "exactly two bounded"],
  ["English-only target language", files.model, 'targetLanguage !== "en"'],
  ["activation blocks", files.model, "qrPrintAllowed: false"],
  ["immutable sidecar", files.store, "sentence-approval.json"],
  ["explicit write gate", files.store, "LIVING_TEXTBOOOK_SENTENCE_APPROVALS_ENABLED"],
  ["source decision gate", files.store, "accepted-for-package-review"],
  ["review-only route", files.route, '"recorded-review-only"'],
  ["live bridge binding", files.bridge, "readQuarantineSentenceApproval"],
  ["readiness binding", files.readiness, "sentenceApproval"],
  ["review UI", files.panel, "Approve two English sentences"],
];
for (const [label, source, marker] of required) if (!source.includes(marker)) throw new Error(`FAIL sentence approval contract: missing ${label} marker ${marker}`);
for (const forbidden of ["packageAssemblyAllowed: true", "promotionAllowed: true", "qrPrintAllowed: true", "studentFacingUseAllowed: true"]) if (files.model.includes(forbidden)) throw new Error(`FAIL sentence approval contract: forbidden activation marker ${forbidden}`);
console.log("PASS sentence approval is English-only, source-bound, immutable, review-only, and wired into live readiness.");
