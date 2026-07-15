import { readFileSync } from "node:fs";

const plan = readSource("../apps/web/src/data/sampleUploadChannelReadiness.ts");
const filePolicy = readSource("../apps/web/src/data/sampleUploadFilePolicy.ts");
const targetMapping = readSource("../apps/web/src/data/sampleUploadTargetMapping.ts");
const reviewQueue = readSource("../apps/web/src/data/sampleUploadReviewQueue.ts");
const promotionReadiness = readSource("../apps/web/src/data/sampleUploadPromotionReadiness.ts");
const labelledDiagramAssetReadiness = readSource("../apps/web/src/data/sampleLabelledDiagramAssetReadiness.ts");
const labelledDiagramAssetWorkspace = readSource("../apps/web/src/data/sampleLabelledDiagramAssetWorkspace.ts");
const multimediaAssetReadiness = readSource("../apps/web/src/data/sampleMultimediaAssetReadiness.ts");
const mediaAssetWorkspace = readSource("../apps/web/src/data/sampleMediaAssetWorkspace.ts");
const evidencePacketFlows = readSource("../apps/web/src/data/sampleEvidencePacketFlows.ts");
const evidencePacketReviewIndex = readSource("../apps/web/src/data/sampleEvidencePacketReviewIndex.ts");
const evidencePacketHandoffPackage = readSource("../apps/web/src/data/sampleEvidencePacketHandoffPackage.ts");
const evidenceExportReadiness = readSource("../apps/web/src/data/sampleEvidenceExportReadiness.ts");
const evidenceAttachmentStorageReadiness = readSource("../apps/web/src/data/sampleEvidenceAttachmentStorageReadiness.ts");
const evidenceStorageAdapterSelectionGate = readSource("../apps/web/src/data/sampleEvidenceStorageAdapterSelectionGate.ts");
const contentEntryOptionScaffold = readSource("../apps/web/src/data/sampleContentEntryOptionScaffold.ts");
const templateRenderingFontProfiles = readSource("../apps/web/src/data/sampleTemplateRenderingFontProfiles.ts");
const evidencePacketFlowPanel = readSource("../apps/web/src/features/evidence/EvidencePacketFlowPanel.tsx");
const evidencePacketReviewIndexPanel = readSource("../apps/web/src/features/evidence/EvidencePacketReviewIndexPanel.tsx");
const evidencePacketHandoffPanel = readSource("../apps/web/src/features/evidence/EvidencePacketHandoffPanel.tsx");
const evidenceExportReadinessPanel = readSource("../apps/web/src/features/evidence/EvidenceExportReadinessPanel.tsx");
const evidenceAttachmentStorageReadinessPanel = readSource("../apps/web/src/features/evidence/EvidenceAttachmentStorageReadinessPanel.tsx");
const evidenceStorageAdapterSelectionGatePanel = readSource("../apps/web/src/features/evidence/EvidenceStorageAdapterSelectionGatePanel.tsx");
const panel = readSource("../apps/web/src/features/content-intake/UploadChannelReadinessPanel.tsx");
const filePolicyPanel = readSource("../apps/web/src/features/content-intake/UploadFilePolicyPanel.tsx");
const intakeControlPreviewPanel = readSource("../apps/web/src/features/content-intake/UploadIntakeControlPreviewPanel.tsx");
const targetMappingPanel = readSource("../apps/web/src/features/content-intake/UploadTargetMappingPanel.tsx");
const reviewQueuePanel = readSource("../apps/web/src/features/content-intake/UploadReviewQueuePanel.tsx");
const promotionReadinessPanel = readSource("../apps/web/src/features/content-intake/UploadPromotionReadinessPanel.tsx");
const labelledDiagramAssetPanel = readSource("../apps/web/src/features/content-intake/LabelledDiagramAssetReadinessPanel.tsx");
const labelledDiagramAssetWorkspacePanel = readSource("../apps/web/src/features/game-assets/LabelledDiagramAssetWorkspacePanel.tsx");
const multimediaAssetPanel = readSource("../apps/web/src/features/content-intake/MultimediaAssetReadinessPanel.tsx");
const mediaAssetWorkspacePanel = readSource("../apps/web/src/features/multimedia/MediaAssetWorkspacePanel.tsx");
const contentEntryOptionPanel = readSource("../apps/web/src/features/content-intake/ContentEntryOptionScaffoldPanel.tsx");
const templateRenderingFontProfilePanel = readSource("../apps/web/src/features/content-intake/TemplateRenderingFontProfilePanel.tsx");
const teacherUploadWorkspace = readSource("../apps/web/src/features/content-intake/TeacherUploadWorkspacePanel.tsx");
const teacherUploadRoute = readSource("../apps/web/src/app/teacher/uploads/[tenantId]/page.tsx");
const teacherEvidencePacketRoute = readSource("../apps/web/src/app/teacher/evidence/[tenantId]/page.tsx");
const teacherEvidencePacketHandoffRoute = readSource("../apps/web/src/app/teacher/evidence/[tenantId]/handoff/page.tsx");
const teacherLabelledDiagramAssetRoute = readSource("../apps/web/src/app/teacher/assets/labelled-diagram/[assetId]/page.tsx");
const teacherMediaAssetRoute = readSource("../apps/web/src/app/teacher/assets/media/[assetId]/page.tsx");
const teacherIntake = readSource("../apps/web/src/app/teacher/intake/page.tsx");
const partnerDemo = readSource("../apps/web/src/app/partner-demo/page.tsx");
const routeContracts = readSource("../apps/web/src/features/routes/routeContracts.ts");
const routeVerifier = readSource("./verify-active-routes.mjs");
const failures = [];

const requiredChannels = [
  "source-pdf-text-upload",
  "labelled-diagram-image-upload",
  "audio-music-upload",
  "video-upload",
];

const requiredTexts = [
  "Uploads are intake records first",
  "No uploaded file becomes student-facing",
  "PDF and text source intake",
  "Image upload for Labelled Diagram",
  "Audio and music upload",
  "Video upload",
  "Labelled Diagram game mode",
  "Source lineage required",
  "Human review required",
  "Image rights required",
  "Label anchors required",
  "Learning audio separation",
  "Background media toggle",
  "Captions or transcript required",
  "Optional playback required",
  "Automatic PDF-to-game publish",
  "Student-facing image upload",
  "Music as mastery trigger",
  "Required progress through video only",
];

for (const channelId of requiredChannels) {
  requireText(plan, `channelId: "${channelId}"`, `Upload channel missing: ${channelId}.`);
}

for (const text of requiredTexts) {
  requireText(plan, text, `Upload readiness plan missing required text: ${text}.`);
}

const requiredFilePolicyTexts = [
  "Upload file policy profiles",
  "File type and size policy",
  "PDF/text source policy",
  "Labelled Diagram image policy",
  "Audio/music policy",
  "Video and local-bundle policy",
  "scan_and_file_policy_packet",
  "MIME type validation",
  "checksum capture",
  "virus/malware scan status",
  "No file picker writes",
  "No upload promotion without file policy acceptance",
  "No automatic PDF-to-game publish",
  "No student-facing image game",
  "No music as mastery trigger",
  "No video-only progress",
];

for (const text of requiredFilePolicyTexts) {
  requireText(filePolicy, text, `Upload file policy plan missing required text: ${text}.`);
}

const requiredTargetMappingTexts = [
  "Upload target mapping preview",
  "Source-to-target mapping",
  "target_mapping_packet",
  "PDF/text to teacher draft package",
  "Image to Labelled Diagram game asset",
  "Audio/music to playlist or background policy",
  "Video to playlist or local bundle",
  "teacher_draft_package",
  "game_asset_manifest",
  "media_playlist_binding",
  "local_media_bundle_entry",
  "No route created directly from an uploaded file",
  "No uploaded file can become a student assignment target",
  "No upload-to-assignment shortcut",
  "No folder placement activation",
  "activity_compatibility_snapshot",
];

for (const text of requiredTargetMappingTexts) {
  requireText(targetMapping, text, `Upload target mapping plan missing required text: ${text}.`);
}

const requiredReviewQueueTexts = [
  "Upload review queue",
  "Review queue preview",
  "PDF/text source review",
  "Labelled Diagram image review",
  "Audio/music rights review",
  "Video/caption review",
  "Source lineage packet",
  "Rights proof packet",
  "Scan and file policy packet",
  "Target mapping packet",
  "Student-facing use blocked",
  "No direct game assignment",
  "No automatic PDF-to-game publish",
  "No uploaded media as mastery trigger",
  "Approve for draft",
  "Return for replacement",
  "Needs rights proof",
  "Ready for asset review",
];

for (const text of requiredReviewQueueTexts) {
  requireText(reviewQueue, text, `Upload review queue missing required text: ${text}.`);
}

const requiredPromotionTexts = [
  "Upload promotion readiness",
  "Target-specific promotion preview",
  "PDF/text to draft package",
  "Labelled Diagram asset promotion",
  "Audio/music playlist promotion",
  "Video/local bundle promotion",
  "Promotion is blocked",
  "Target-specific review required",
  "No student-facing promotion",
  "No direct assignment",
  "No folder placement promotion",
  "No reviewed upload bypass",
  "Draft package promotion blocked",
  "Image asset promotion blocked",
  "Media playlist promotion blocked",
  "Local bundle promotion blocked",
];

for (const text of requiredPromotionTexts) {
  requireText(promotionReadiness, text, `Upload promotion readiness missing required text: ${text}.`);
}

const requiredLabelledDiagramAssetTexts = [
  "Labelled Diagram asset readiness",
  "game_asset_manifest",
  "label_anchor_record",
  "Image rights proof",
  "Alt text required",
  "Anchor coordinate review",
  "Audio label coverage",
  "Target-language label text",
  "Support-language labels are support-only",
  "Game asset manifest required",
  "Asset release gate required",
  "No student-facing image game",
  "No auto-generated labels",
  "No live label editor",
  "No asset promotion without release gate",
  "No support-language progress trigger",
];

for (const text of requiredLabelledDiagramAssetTexts) {
  requireText(labelledDiagramAssetReadiness, text, `Labelled Diagram asset readiness missing required text: ${text}.`);
}

const requiredLabelledDiagramWorkspaceTexts = [
  "Labelled Diagram asset workspace",
  "Teacher-only asset review",
  "Manifest and anchors preview",
  "game_asset_manifest",
  "label_anchor_record",
  "target_mapping_packet",
  "student_facing_asset_allowed: false",
  "support_language_progress_allowed: false",
  "Image rights proof",
  "Alt text required",
  "Anchor coordinate review",
  "Audio label coverage",
  "Target-language label text only",
  "Support-language labels are support-only",
  "No live label editor",
  "No coordinate editor",
  "No student-facing image game",
  "No assignment route from uploaded image",
];

for (const text of requiredLabelledDiagramWorkspaceTexts) {
  requireText(labelledDiagramAssetWorkspace, text, `Labelled Diagram asset workspace missing required text: ${text}.`);
}

const requiredMultimediaAssetTexts = [
  "Multimedia asset readiness",
  "media_manifest",
  "media_playlist_binding",
  "background_media_policy_binding",
  "local_media_bundle_entry",
  "Learning audio separation",
  "Optional playback required",
  "Captions or transcript required",
  "Background media cannot override learning audio",
  "No media-only progress",
  "No background music overriding learning audio",
  "No required progress through video only",
  "No unlicensed media",
  "No raw learner audio storage",
  "No automatic transcode-to-publish",
  "No local folder activation",
];

for (const text of requiredMultimediaAssetTexts) {
  requireText(multimediaAssetReadiness, text, `Multimedia asset readiness missing required text: ${text}.`);
}

const requiredMediaWorkspaceTexts = [
  "Media asset workspace",
  "Teacher-only media review",
  "media_manifest",
  "media_playlist_binding",
  "background_media_policy_binding",
  "local_media_bundle_entry",
  "target_mapping_packet",
  "optional_playback_required: true",
  "Learning audio priority required",
  "No media-only progress",
  "No background music overriding learning audio",
  "No required progress through video only",
  "No live media upload",
  "No automatic transcode-to-publish",
  "No local folder activation",
  "No playlist route from uploaded media",
];

for (const text of requiredMediaWorkspaceTexts) {
  requireText(mediaAssetWorkspace, text, `Media asset workspace missing required text: ${text}.`);
}

const requiredEvidencePacketTexts = [
  "Evidence packet flow",
  "evidence_packet",
  "source_lineage_packet",
  "rights_proof_packet",
  "scan_and_file_policy_packet",
  "target_mapping_packet",
  "upload_review_decision_packet",
  "release_control_packet",
  "game_asset_manifest_packet",
  "label_anchor_record_packet",
  "audio_coverage_packet",
  "accessibility_packet",
  "media_manifest_packet",
  "caption_transcript_packet",
  "background_media_policy_packet",
  "local_bundle_checksum_packet",
  "No live upload button",
  "No upload progress bar",
  "No approve or publish action",
  "No assignment route from uploaded file",
  "No object storage write",
  "No local folder activation",
  "No live label editor",
  "No coordinate editor",
  "No student-facing image game",
  "No assignment route from uploaded image",
  "No live media upload",
  "No automatic transcode-to-publish",
  "No playlist creation from uploaded media",
  "optional_playback_required: true",
  "Learning audio priority required",
];

for (const text of requiredEvidencePacketTexts) {
  requireText(evidencePacketFlows, text, `Evidence packet flow data missing required text: ${text}.`);
}

const requiredEvidencePacketReviewTexts = [
  "Tenant evidence packet command center",
  "Evidence packet review index",
  "Upload evidence source",
  "Labelled Diagram evidence source",
  "Media evidence source",
  "evidence_packet",
  "No live evidence upload",
  "No signed approval capture",
  "No approve or publish action",
  "No playlist creation from uploaded media",
  "No student-facing use from evidence packets alone",
];

for (const text of requiredEvidencePacketReviewTexts) {
  requireText(evidencePacketReviewIndex, text, `Evidence packet review index data missing required text: ${text}.`);
}

const requiredEvidencePacketHandoffTexts = [
  "Evidence packet handoff preview",
  "Upload intake evidence",
  "Labelled Diagram evidence",
  "Media evidence",
  "source_lineage_packet",
  "rights_proof_packet",
  "scan_and_file_policy_packet",
  "target_mapping_packet",
  "game_asset_manifest_packet",
  "label_anchor_record_packet",
  "media_manifest_packet",
  "caption_transcript_packet",
  "No evidence packet export",
  "No signed approval capture",
  "No publish action",
  "No upload promotion",
  "No route creation",
  "No playlist creation",
  "No assignment route from evidence",
];

for (const text of requiredEvidencePacketHandoffTexts) {
  requireText(evidencePacketHandoffPackage, text, `Evidence packet handoff package missing required text: ${text}.`);
}

const requiredEvidenceExportReadinessTexts = [
  "Evidence export readiness",
  "Evidence export blocked",
  "Signed approval capture blocked",
  "Attachment storage and audit policy required",
  "Reviewer summary PDF",
  "Machine-readable JSON packet",
  "Local companion evidence manifest",
  "Publisher evidence recipient",
  "School evidence recipient",
  "Platform evidence recipient",
  "authenticated reviewer identity",
  "signature revocation policy",
  "evidence attachment storage policy",
  "retention period",
  "PII minimization check",
  "No evidence packet export",
  "No signed approval capture",
  "No PDF generation",
  "No JSON export",
  "No downloadable ZIP",
  "No email handoff",
  "No release-state mutation",
  "No student assignment from export",
];

for (const text of requiredEvidenceExportReadinessTexts) {
  requireText(evidenceExportReadiness, text, `Evidence export readiness plan missing required text: ${text}.`);
}

const requiredEvidenceAttachmentStorageReadinessTexts = [
  "Evidence attachment storage readiness",
  "Attachment storage blocked",
  "Hosted object storage candidate",
  "Closed local evidence folder candidate",
  "Hybrid export archive candidate",
  "quarantine path",
  "checksum required",
  "malware scan status",
  "retention period",
  "delete/export policy",
  "storage adapter selected",
  "access-control policy accepted",
  "encryption policy accepted",
  "local backup responsibility accepted",
  "audit log retention accepted",
  "No evidence file upload",
  "No object storage write",
  "No local folder write",
  "No attachment download",
  "No signed approval attachment",
  "No release-state mutation",
  "No student-facing attachment",
];

for (const text of requiredEvidenceAttachmentStorageReadinessTexts) {
  requireText(
    evidenceAttachmentStorageReadiness,
    text,
    `Evidence attachment storage readiness plan missing required text: ${text}.`,
  );
}

const requiredEvidenceStorageAdapterSelectionTexts = [
  "Evidence storage adapter selection gate",
  "Storage adapter selection blocked",
  "Hosted managed evidence storage candidate",
  "Closed local evidence store candidate",
  "Hybrid archive evidence store candidate",
  "tenant isolation",
  "metadata separate from binary files",
  "quarantine-first storage",
  "checksum required",
  "malware scan status",
  "access-control policy",
  "audit log retention",
  "delete/export policy",
  "local backup responsibility",
  "release-control mutation block",
  "Choose hosted managed evidence storage first",
  "local storage as a premium/closed-deployment path",
  "hybrid archive movement as a later migration lane",
  "No storage adapter selected",
  "No object bucket creation",
  "No local evidence folder activation",
  "No signed URL generation",
  "No direct file upload",
  "No attachment migration",
  "No production retention clock",
  "No release-state mutation",
];

for (const text of requiredEvidenceStorageAdapterSelectionTexts) {
  requireText(
    evidenceStorageAdapterSelectionGate,
    text,
    `Evidence storage adapter selection gate missing required text: ${text}.`,
  );
}

const requiredContentEntryTexts = [
  "Content entry option scaffold",
  "Flip Tiles source template",
  "Cross-game upload guide",
  "Pairing-family games",
  "Selection-family games",
  "Text and printable outputs",
  "Pick a template",
  "Enter content",
  "Play",
  "Activity title",
  "+ Instruction",
  "Generate With AI",
  "Flip tiles",
  "Done",
  "+ Add an item",
  "Single sided",
  "Double sided",
  "Row editor options",
  "min 2 max 50",
  "Front",
  "Back",
  "Target-language text",
  "Support-language text",
  "Bold",
  "Superscript",
  "Subscript",
  "Symbol picker",
  "Approved learner font",
  "Tenant font pack",
  "Hiragana-safe font",
  "Readable tile sizing",
  "Font rendering gate",
  "Audio cue",
  "Image upload",
  "Reorder item",
  "Duplicate item",
  "Delete item",
  "teacher_draft_package",
  "upload_intake_asset",
  "upload_review_decision",
  "upload_promotion_gate",
  "activity_compatibility_snapshot",
  "template_rendering_profile",
  "font_accessibility_profile",
  "No live media upload",
  "No Done-to-student route",
  "No direct AI publish",
  "No unreviewed image activation",
  "No support-language progress trigger",
  "No file picker writes",
  "No template switch without compatibility check",
  "Rights review gate",
  "Audio coverage gate",
  "Compatibility review gate",
  "Release control gate",
];

for (const text of requiredContentEntryTexts) {
  requireText(contentEntryOptionScaffold, text, `Content entry option scaffold missing required text: ${text}.`);
}

const requiredTemplateRenderingFontTexts = [
  "Template and font profile readiness",
  "Flip Tiles cross-game rendering profile",
  "Young learner and Japanese-safe font profile",
  "template-profile-flip-tiles-cross-game-v1",
  "font-profile-young-learner-ja-safe-v1",
  "No switch-to-anything panel",
  "No arbitrary teacher font upload",
  "Foundation, Bronze, and Plus Japanese support text uses hiragana-first rendering.",
  "Silver and above may introduce katakana, kanji, and furigana where approved.",
  "template_rendering_profile",
  "font_accessibility_profile",
  "Reviewed profile required",
  "Printable renderer review required",
];

for (const text of requiredTemplateRenderingFontTexts) {
  requireText(templateRenderingFontProfiles, text, `Template rendering/font profile plan missing required text: ${text}.`);
}

requireText(panel, "Upload channel readiness", "Upload readiness panel must expose its heading.");
requireText(panel, "Foundation rule", "Upload readiness panel must expose the foundation rule.");
requireText(panel, "Accepted file types", "Upload readiness panel must show accepted file types.");
requireText(panel, "Upload targets", "Upload readiness panel must show upload targets.");
requireText(panel, "Not allowed yet", "Upload readiness panel must show blocked shortcuts.");
requireText(filePolicyPanel, "File type and size policy", "Upload file policy panel must expose its heading.");
requireText(filePolicyPanel, "Required records", "Upload file policy panel must expose required records.");
requireText(filePolicyPanel, "Accepted extensions", "Upload file policy panel must show accepted extensions.");
requireText(filePolicyPanel, "Maximums required", "Upload file policy panel must show maximums.");
requireText(filePolicyPanel, "Required checks", "Upload file policy panel must show required checks.");
requireText(filePolicyPanel, "Blocked shortcuts", "Upload file policy panel must show blocked shortcuts.");
requireText(filePolicyPanel, "Next gate", "Upload file policy panel must show the next gate.");
requireText(intakeControlPreviewPanel, "Upload intake control preview", "Upload intake control preview panel must expose its heading.");
requireText(intakeControlPreviewPanel, "No file input element", "Upload intake control preview must confirm no file input exists.");
requireText(intakeControlPreviewPanel, "Select file blocked", "Upload intake control preview must block file selection.");
requireText(intakeControlPreviewPanel, "Create intake record blocked", "Upload intake control preview must block intake record creation.");
requireText(intakeControlPreviewPanel, "Source metadata", "Upload intake control preview must show source metadata gate.");
requireText(intakeControlPreviewPanel, "Scan policy", "Upload intake control preview must show scan policy gate.");
requireText(intakeControlPreviewPanel, "Target mapping", "Upload intake control preview must show target mapping gate.");
requireText(targetMappingPanel, "Source-to-target mapping", "Upload target mapping panel must expose its heading.");
requireText(targetMappingPanel, "Hard rules", "Upload target mapping panel must show hard rules.");
requireText(targetMappingPanel, "Target record", "Upload target mapping panel must show target records.");
requireText(targetMappingPanel, "Required evidence", "Upload target mapping panel must show required evidence.");
requireText(targetMappingPanel, "Allowed preview actions", "Upload target mapping panel must show allowed preview actions.");
requireText(targetMappingPanel, "Blocked shortcuts", "Upload target mapping panel must show blocked shortcuts.");
requireText(targetMappingPanel, "Next gate", "Upload target mapping panel must show next gate.");
requireText(reviewQueuePanel, "Review queue preview", "Upload review queue panel must expose review queue preview heading.");
requireText(reviewQueuePanel, "Reviewer decision preview", "Upload review queue panel must expose disabled decision previews.");
requireText(reviewQueuePanel, "Live actions blocked", "Upload review queue panel must show live actions are blocked.");
requireText(promotionReadinessPanel, "Target-specific promotion preview", "Upload promotion panel must expose target-specific promotion preview heading.");
requireText(promotionReadinessPanel, "Storage before live", "Upload promotion panel must show storage-before-live gates.");
requireText(labelledDiagramAssetPanel, "Game asset landing zone", "Labelled Diagram asset panel must expose the asset landing zone heading.");
requireText(labelledDiagramAssetPanel, "game_asset_manifest", "Labelled Diagram asset panel must expose game asset manifest.");
requireText(labelledDiagramAssetPanel, "label_anchor_record", "Labelled Diagram asset panel must expose label anchor record.");
requireText(labelledDiagramAssetWorkspacePanel, "Teacher-only asset review", "Labelled Diagram asset workspace panel must expose teacher-only review heading.");
requireText(labelledDiagramAssetWorkspacePanel, "Manifest and anchors preview", "Labelled Diagram asset workspace panel must expose manifest/anchor preview.");
requireText(labelledDiagramAssetWorkspacePanel, "game_asset_manifest", "Labelled Diagram asset workspace panel must expose game asset manifest.");
requireText(labelledDiagramAssetWorkspacePanel, "label_anchor_record", "Labelled Diagram asset workspace panel must expose label anchor record.");
requireText(labelledDiagramAssetWorkspacePanel, "Required packets", "Labelled Diagram asset workspace panel must show required packets.");
requireText(labelledDiagramAssetWorkspacePanel, "Blocked live actions", "Labelled Diagram asset workspace panel must show blocked live actions.");
requireText(multimediaAssetPanel, "Media asset landing zone", "Multimedia asset panel must expose the media landing zone heading.");
requireText(multimediaAssetPanel, "Manifest and binding records", "Multimedia asset panel must expose manifest and binding records.");
requireText(multimediaAssetPanel, "Media lanes", "Multimedia asset panel must expose media lanes.");
requireText(mediaAssetWorkspacePanel, "Teacher-only media review", "Media asset workspace panel must expose teacher-only review heading.");
requireText(mediaAssetWorkspacePanel, "media_manifest", "Media asset workspace panel must expose media manifest.");
requireText(mediaAssetWorkspacePanel, "Playlist, background, and local bundle targets", "Media asset workspace panel must expose binding targets.");
requireText(mediaAssetWorkspacePanel, "Required packets", "Media asset workspace panel must show required packets.");
requireText(mediaAssetWorkspacePanel, "Blocked live actions", "Media asset workspace panel must show blocked live actions.");
requireText(evidencePacketFlowPanel, "Evidence packet flow", "Evidence packet flow panel must expose its heading.");
requireText(evidencePacketFlowPanel, "Handoff rule", "Evidence packet flow panel must expose its handoff rule.");
requireText(evidencePacketFlowPanel, "Required evidence", "Evidence packet flow panel must show required evidence.");
requireText(evidencePacketFlowPanel, "Missing evidence", "Evidence packet flow panel must show missing evidence.");
requireText(evidencePacketFlowPanel, "Blocked until evidence packets pass", "Evidence packet flow panel must show blocked live actions.");
requireText(evidencePacketReviewIndexPanel, "Evidence packet review index", "Evidence packet review index panel must expose its heading.");
requireText(evidencePacketReviewIndexPanel, "Review queue rollup", "Evidence packet review index panel must expose the queue rollup.");
requireText(evidencePacketReviewIndexPanel, "Evidence sources before live upload controls", "Evidence packet review index panel must show source-before-live heading.");
requireText(evidencePacketReviewIndexPanel, "Storage handoff", "Evidence packet review index panel must expose storage handoff.");
requireText(evidencePacketReviewIndexPanel, "Records required before evidence becomes durable", "Evidence packet review index panel must show durable record requirement.");
requireText(evidencePacketReviewIndexPanel, "Storage contract records", "Evidence packet review index panel must show storage contract records.");
requireText(evidencePacketReviewIndexPanel, "Standing review-only rules", "Evidence packet review index panel must show standing review-only rules.");
requireText(evidencePacketHandoffPanel, "Evidence handoff preview", "Evidence packet handoff panel must expose its heading.");
requireText(evidencePacketHandoffPanel, "Handoff sections", "Evidence packet handoff panel must expose handoff sections.");
requireText(evidencePacketHandoffPanel, "Evidence that would enter an export packet", "Evidence packet handoff panel must show export-packet shape.");
requireText(evidencePacketHandoffPanel, "Recipient duties", "Evidence packet handoff panel must expose recipient duties.");
requireText(evidencePacketHandoffPanel, "Live actions blocked", "Evidence packet handoff panel must show blocked live actions.");
requireText(evidencePacketHandoffPanel, "No export or approval workflow yet", "Evidence packet handoff panel must block export and approval workflow.");
requireText(evidenceExportReadinessPanel, "Evidence export readiness", "Evidence export readiness panel must expose its heading.");
requireText(evidenceExportReadinessPanel, "Recipient lanes", "Evidence export readiness panel must expose recipient lanes.");
requireText(evidenceExportReadinessPanel, "Identity, signature, and policy gates", "Evidence export readiness panel must expose identity/signature/policy gates.");
requireText(evidenceExportReadinessPanel, "Required before export controls exist", "Evidence export readiness panel must block export controls until gates pass.");
requireText(evidenceExportReadinessPanel, "Blocked actions", "Evidence export readiness panel must show blocked export actions.");
requireText(evidenceAttachmentStorageReadinessPanel, "Evidence attachment storage readiness", "Evidence attachment storage readiness panel must expose its heading.");
requireText(evidenceAttachmentStorageReadinessPanel, "Storage candidates", "Evidence attachment storage readiness panel must show storage candidates.");
requireText(evidenceAttachmentStorageReadinessPanel, "Required attachment metadata", "Evidence attachment storage readiness panel must show required metadata.");
requireText(evidenceAttachmentStorageReadinessPanel, "Storage policy gates", "Evidence attachment storage readiness panel must show policy gates.");
requireText(evidenceAttachmentStorageReadinessPanel, "Blocked storage actions", "Evidence attachment storage readiness panel must show blocked actions.");
requireText(evidenceStorageAdapterSelectionGatePanel, "Evidence storage adapter selection gate", "Evidence storage adapter selection gate panel must expose its heading.");
requireText(evidenceStorageAdapterSelectionGatePanel, "First pilot recommendation", "Evidence storage adapter selection gate panel must show the recommendation.");
requireText(evidenceStorageAdapterSelectionGatePanel, "Adapter candidates", "Evidence storage adapter selection gate panel must show adapter candidates.");
requireText(evidenceStorageAdapterSelectionGatePanel, "Vendor-neutral requirements", "Evidence storage adapter selection gate panel must show vendor-neutral requirements.");
requireText(evidenceStorageAdapterSelectionGatePanel, "Selection rules", "Evidence storage adapter selection gate panel must show selection rules.");
requireText(evidenceStorageAdapterSelectionGatePanel, "Blocked actions", "Evidence storage adapter selection gate panel must show blocked actions.");
requireText(contentEntryOptionPanel, "Teacher content entry options", "Content entry option panel must expose its heading.");
requireText(contentEntryOptionPanel, "Source template", "Content entry option panel must expose the source template section.");
requireText(contentEntryOptionPanel, "Cross-game upload guide", "Content entry option panel must expose the cross-game upload guide.");
requireText(contentEntryOptionPanel, "Template workflow", "Content entry option panel must expose the workflow.");
requireText(contentEntryOptionPanel, "Activity controls", "Content entry option panel must expose activity controls.");
requireText(contentEntryOptionPanel, "Card sidedness", "Content entry option panel must expose sidedness controls.");
requireText(contentEntryOptionPanel, "Approved font and rendering controls", "Content entry option panel must expose font/rendering controls.");
requireText(contentEntryOptionPanel, "Formatting toolbar", "Content entry option panel must expose formatting toolbar.");
requireText(contentEntryOptionPanel, "Per-row upload and item actions", "Content entry option panel must expose row actions.");
requireText(contentEntryOptionPanel, "Required records before live tools", "Content entry option panel must expose required records.");
requireText(contentEntryOptionPanel, "Blocked shortcuts", "Content entry option panel must expose blocked shortcuts.");
requireText(templateRenderingFontProfilePanel, "TemplateRenderingFontProfilePlan", "Template rendering/font profile panel must accept the plan type.");
requireText(templateRenderingFontProfilePanel, "Rendering and font profile gate", "Template rendering/font profile panel must expose its heading.");
requireText(templateRenderingFontProfilePanel, "Student-facing rendering blocked", "Template rendering/font profile panel must block student-facing rendering.");
requireText(templateRenderingFontProfilePanel, "Student-facing font blocked", "Template rendering/font profile panel must block student-facing font use.");
requireText(templateRenderingFontProfilePanel, "Compatible families", "Template rendering/font profile panel must show compatible families.");
requireText(templateRenderingFontProfilePanel, "Row shape policy", "Template rendering/font profile panel must show row shape policy.");
requireText(templateRenderingFontProfilePanel, "Media slot policy", "Template rendering/font profile panel must show media slot policy.");
requireText(templateRenderingFontProfilePanel, "Layout constraints", "Template rendering/font profile panel must show layout constraints.");
requireText(templateRenderingFontProfilePanel, "Tenant font pack", "Template rendering/font profile panel must show tenant font pack.");
requireText(templateRenderingFontProfilePanel, "Language rendering rules", "Template rendering/font profile panel must show language rendering rules.");
requireText(templateRenderingFontProfilePanel, "Readability checks", "Template rendering/font profile panel must show readability checks.");
requireText(templateRenderingFontProfilePanel, "Required records before live rendering", "Template rendering/font profile panel must expose required records.");
requireText(teacherIntake, "UploadChannelReadinessPanel", "Teacher intake route must render upload readiness.");
requireText(teacherIntake, "ContentEntryOptionScaffoldPanel", "Teacher intake route must render content entry option scaffold.");
requireText(teacherIntake, "TemplateRenderingFontProfilePanel", "Teacher intake route must render template rendering/font profile readiness.");
requireText(teacherIntake, "UploadReviewQueuePanel", "Teacher intake route must render upload review queue.");
requireText(teacherIntake, "UploadPromotionReadinessPanel", "Teacher intake route must render upload promotion readiness.");
requireText(teacherIntake, "LabelledDiagramAssetReadinessPanel", "Teacher intake route must render Labelled Diagram asset readiness.");
requireText(teacherIntake, "MultimediaAssetReadinessPanel", "Teacher intake route must render multimedia asset readiness.");
requireText(teacherIntake, "EvidenceExportReadinessPanel", "Teacher intake route must render evidence export readiness.");
requireText(teacherIntake, "EvidenceAttachmentStorageReadinessPanel", "Teacher intake route must render evidence attachment storage readiness.");
requireText(teacherIntake, "EvidenceStorageAdapterSelectionGatePanel", "Teacher intake route must render evidence storage adapter selection gate.");
requireText(teacherUploadWorkspace, "Teacher upload workspace", "Teacher upload workspace must expose its heading.");
requireText(teacherUploadWorkspace, "UploadIntakeControlPreviewPanel", "Teacher upload workspace must render disabled intake controls.");
requireText(teacherUploadWorkspace, "UploadFilePolicyPanel", "Teacher upload workspace must render upload file policy.");
requireText(teacherUploadWorkspace, "UploadTargetMappingPanel", "Teacher upload workspace must render upload target mapping.");
requireText(teacherUploadWorkspace, "No live file picker", "Teacher upload workspace must block live file picker use.");
requireText(teacherUploadWorkspace, "EvidencePacketFlowPanel", "Teacher upload workspace must render evidence packet flow.");
requireText(teacherUploadRoute, "sampleUploadFilePolicyPlan", "Teacher upload route must pass the upload file policy plan.");
requireText(teacherUploadRoute, "sampleUploadTargetMappingPlan", "Teacher upload route must pass the upload target mapping plan.");
requireText(teacherUploadRoute, "sampleUploadEvidencePacketFlow", "Teacher upload route must pass the upload evidence packet flow.");
requireText(teacherEvidencePacketRoute, "EvidencePacketReviewIndexPanel", "Teacher evidence packet route must render the review index panel.");
requireText(teacherEvidencePacketRoute, "samplePublisherEvidencePacketReviewIndex", "Teacher evidence packet route must pass the sample publisher evidence review index.");
requireText(teacherEvidencePacketHandoffRoute, "EvidencePacketHandoffPanel", "Teacher evidence packet handoff route must render the handoff panel.");
requireText(teacherEvidencePacketHandoffRoute, "samplePublisherEvidencePacketHandoffPackage", "Teacher evidence packet handoff route must pass the sample publisher handoff package.");
requireText(teacherLabelledDiagramAssetRoute, "findLabelledDiagramAssetWorkspace", "Teacher Labelled Diagram asset route must resolve the workspace by id.");
requireText(teacherLabelledDiagramAssetRoute, "LabelledDiagramAssetWorkspacePanel", "Teacher Labelled Diagram asset route must render the workspace panel.");
requireText(teacherLabelledDiagramAssetRoute, "sampleLabelledDiagramEvidencePacketFlow", "Teacher Labelled Diagram asset route must pass the evidence packet flow.");
requireText(labelledDiagramAssetWorkspacePanel, "EvidencePacketFlowPanel", "Teacher Labelled Diagram asset workspace must render evidence packet flow.");
requireText(teacherMediaAssetRoute, "findMediaAssetWorkspace", "Teacher media asset route must resolve the workspace by id.");
requireText(teacherMediaAssetRoute, "MediaAssetWorkspacePanel", "Teacher media asset route must render the workspace panel.");
requireText(teacherMediaAssetRoute, "sampleMediaEvidencePacketFlow", "Teacher media asset route must pass the evidence packet flow.");
requireText(mediaAssetWorkspacePanel, "EvidencePacketFlowPanel", "Teacher media asset workspace must render evidence packet flow.");
requireText(routeContracts, "getTeacherEvidencePacketReviewPath", "Route contracts must expose an evidence packet review helper.");
requireText(routeContracts, "getTeacherEvidencePacketHandoffPath", "Route contracts must expose an evidence packet handoff helper.");
requireText(routeContracts, "getTeacherLabelledDiagramAssetWorkspacePath", "Route contracts must expose a Labelled Diagram asset workspace helper.");
requireText(routeContracts, "getTeacherMediaAssetWorkspacePath", "Route contracts must expose a media asset workspace helper.");
requireText(partnerDemo, "Evidence packet review index", "Partner demo must link to the evidence packet review index.");
requireText(partnerDemo, "Evidence handoff preview", "Partner demo must link to the evidence packet handoff preview.");
requireText(partnerDemo, "Labelled Diagram asset workspace", "Partner demo must link to the Labelled Diagram asset workspace.");
requireText(partnerDemo, "Media asset workspace", "Partner demo must link to the media asset workspace.");
requireText(routeVerifier, "Upload channel readiness", "Active route verifier must check upload channel readiness.");
requireText(routeVerifier, "Upload file policy profiles", "Active route verifier must check upload file policy profiles.");
requireText(routeVerifier, "Upload intake control preview", "Active route verifier must check disabled upload controls.");
requireText(routeVerifier, "No file input element", "Active route verifier must check that no file input exists.");
requireText(routeVerifier, "File type and size policy", "Active route verifier must check upload file policy heading.");
requireText(routeVerifier, "Upload target mapping preview", "Active route verifier must check upload target mapping.");
requireText(routeVerifier, "No upload-to-assignment shortcut", "Active route verifier must check upload-to-assignment shortcut is blocked.");
requireText(routeVerifier, "Image upload for Labelled Diagram", "Active route verifier must check labelled diagram image upload readiness.");
requireText(routeVerifier, "Upload review queue", "Active route verifier must check upload review queue.");
requireText(routeVerifier, "Upload promotion readiness", "Active route verifier must check upload promotion readiness.");
requireText(routeVerifier, "Labelled Diagram asset readiness", "Active route verifier must check Labelled Diagram asset readiness.");
requireText(routeVerifier, "Labelled Diagram asset workspace", "Active route verifier must check Labelled Diagram asset workspace.");
requireText(routeVerifier, "No assignment route from uploaded image", "Active route verifier must check uploaded images cannot create assignment routes.");
requireText(routeVerifier, "Multimedia asset readiness", "Active route verifier must check multimedia asset readiness.");
requireText(routeVerifier, "Media asset workspace", "Active route verifier must check media asset workspace.");
requireText(routeVerifier, "No playlist route from uploaded media", "Active route verifier must check uploaded media cannot create playlist routes.");
requireText(routeVerifier, "Evidence packet flow", "Active route verifier must check evidence packet flows.");
requireText(routeVerifier, "Upload evidence packet flow", "Active route verifier must check upload evidence packets.");
requireText(routeVerifier, "Labelled Diagram evidence packet flow", "Active route verifier must check Labelled Diagram evidence packets.");
requireText(routeVerifier, "Media evidence packet flow", "Active route verifier must check media evidence packets.");
requireText(routeVerifier, "Evidence packet review index", "Active route verifier must check the evidence packet review index.");
requireText(routeVerifier, "/teacher/evidence/sample-publisher", "Active route verifier must check the evidence packet review route.");
requireText(routeVerifier, "Evidence handoff preview", "Active route verifier must check the evidence packet handoff preview.");
requireText(routeVerifier, "/teacher/evidence/sample-publisher/handoff", "Active route verifier must check the evidence packet handoff route.");
requireText(routeVerifier, "No live evidence upload", "Active route verifier must check live evidence upload remains blocked.");
requireText(routeVerifier, "No live upload button", "Active route verifier must check live upload buttons remain blocked.");
requireText(routeVerifier, "No assignment route from uploaded file", "Active route verifier must check uploaded files cannot create assignments.");
requireText(routeVerifier, "No playlist creation from uploaded media", "Active route verifier must check uploaded media cannot create playlists.");
requireText(routeVerifier, "Evidence attachment storage readiness", "Active route verifier must check evidence attachment storage readiness.");
requireText(routeVerifier, "Attachment storage blocked", "Active route verifier must check evidence attachment storage remains blocked.");
requireText(routeVerifier, "Hosted object storage candidate", "Active route verifier must check hosted object storage candidate.");
requireText(routeVerifier, "Closed local evidence folder candidate", "Active route verifier must check closed local evidence folder candidate.");
requireText(routeVerifier, "Hybrid export archive candidate", "Active route verifier must check hybrid export archive candidate.");
requireText(routeVerifier, "Evidence storage adapter selection gate", "Active route verifier must check evidence storage adapter selection gate.");
requireText(routeVerifier, "Storage adapter selection blocked", "Active route verifier must check storage adapter selection remains blocked.");
requireText(routeVerifier, "Hosted managed evidence storage candidate", "Active route verifier must check hosted managed evidence storage candidate.");
requireText(routeVerifier, "Closed local evidence store candidate", "Active route verifier must check closed local evidence store candidate.");
requireText(routeVerifier, "Hybrid archive evidence store candidate", "Active route verifier must check hybrid archive evidence store candidate.");
requireText(routeVerifier, "No signed URL generation", "Active route verifier must check signed URL generation is blocked.");
requireText(routeVerifier, "No attachment migration", "Active route verifier must check attachment migration is blocked.");
requireText(routeVerifier, "No object storage write", "Active route verifier must check object storage writes remain blocked.");
requireText(routeVerifier, "No local folder write", "Active route verifier must check local folder writes remain blocked.");
requireText(routeVerifier, "No attachment download", "Active route verifier must check attachment downloads remain blocked.");
requireText(routeVerifier, "Content entry option scaffold", "Active route verifier must check content entry option scaffold.");
requireText(routeVerifier, "Generate With AI", "Active route verifier must check AI generation control.");
requireText(routeVerifier, "Flip tiles", "Active route verifier must check flip tiles control.");
requireText(routeVerifier, "Approved learner font", "Active route verifier must check font controls.");
requireText(routeVerifier, "Cross-game upload guide", "Active route verifier must check cross-game upload guide.");
requireText(routeVerifier, "Template and font profile readiness", "Active route verifier must check template rendering/font profile readiness.");
requireText(routeVerifier, "Student-facing rendering blocked", "Active route verifier must check student-facing rendering is blocked.");
requireText(routeVerifier, "Student-facing font blocked", "Active route verifier must check student-facing font use is blocked.");
requireText(routeVerifier, "No Done-to-student route", "Active route verifier must check Done is blocked from student routes.");

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }

  process.exit(1);
}

console.log(`PASS upload channel readiness covers ${requiredChannels.length} upload channel(s).`);

function readSource(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) {
    failures.push(message);
  }
}
