import { readFileSync } from "node:fs";

const contract = readSource("../packages/content-model/src/assistLanguageAudioCatalogApproval.ts");
const sample = readSource("../apps/web/src/data/sampleAssistLanguageAudioCatalogApproval.ts");
const panel = readSource("../apps/web/src/features/multimedia/TeacherAssistLanguageAudioCatalogApprovalPanel.tsx");
const route = readSource("../apps/web/src/app/teacher/media/[tenantId]/page.tsx");
const failures = [];

for (const marker of [
  "AssistLanguageAudioCatalogApprovalPacket",
  "assist_language_audio_catalog_admission",
  "teacher-or-publisher-audio-owner",
  "decision: \"not-recorded\"",
  "decisionCaptured: false",
  "approvalAllowed: false",
  "catalogAdmissionAllowed: false",
  "studentFacingAllowed: false",
  "No approval capture",
  "No catalog admission",
  "No hosted media promotion",
  "No local bundle activation",
  "No student-facing assist audio",
  "No speech API billing",
  "validateAssistLanguageAudioCatalogApprovalPacket",
]) {
  if (!contract.includes(marker)) failures.push(`Approval contract missing marker: ${marker}`);
}

for (const marker of [
  "buildAssistLanguageAudioCatalogApprovalPackets",
  "unresolvedEvidence",
  "teacher_approval_ledger",
  "media_rights_evidence_attachment",
  "local_or_hosted_delivery_binding",
]) {
  if (!sample.includes(marker)) failures.push(`Approval sample missing marker: ${marker}`);
}

for (const marker of [
  "Human review boundary",
  "Catalog admission approval is not recorded",
  "No approval captured",
  "Required evidence",
  "Approval allowed: no",
]) {
  if (!panel.includes(marker)) failures.push(`Approval panel missing marker: ${marker}`);
}

if (!route.includes("TeacherAssistLanguageAudioCatalogApprovalPanel") || !route.includes("buildAssistLanguageAudioCatalogApprovalPackets")) {
  failures.push("Teacher media route must expose the support-audio approval boundary.");
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS assist-language audio catalog approval remains tenant-scoped, evidence-bound, not-recorded, and activation-blocked.");

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}
