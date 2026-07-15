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
const contentEntryOptionScaffold = readSource("../apps/web/src/data/sampleContentEntryOptionScaffold.ts");
const templateRenderingFontProfiles = readSource("../apps/web/src/data/sampleTemplateRenderingFontProfiles.ts");
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
requireText(teacherUploadWorkspace, "Teacher upload workspace", "Teacher upload workspace must expose its heading.");
requireText(teacherUploadWorkspace, "UploadIntakeControlPreviewPanel", "Teacher upload workspace must render disabled intake controls.");
requireText(teacherUploadWorkspace, "UploadFilePolicyPanel", "Teacher upload workspace must render upload file policy.");
requireText(teacherUploadWorkspace, "UploadTargetMappingPanel", "Teacher upload workspace must render upload target mapping.");
requireText(teacherUploadWorkspace, "No live file picker", "Teacher upload workspace must block live file picker use.");
requireText(teacherUploadRoute, "sampleUploadFilePolicyPlan", "Teacher upload route must pass the upload file policy plan.");
requireText(teacherUploadRoute, "sampleUploadTargetMappingPlan", "Teacher upload route must pass the upload target mapping plan.");
requireText(teacherLabelledDiagramAssetRoute, "findLabelledDiagramAssetWorkspace", "Teacher Labelled Diagram asset route must resolve the workspace by id.");
requireText(teacherLabelledDiagramAssetRoute, "LabelledDiagramAssetWorkspacePanel", "Teacher Labelled Diagram asset route must render the workspace panel.");
requireText(teacherMediaAssetRoute, "findMediaAssetWorkspace", "Teacher media asset route must resolve the workspace by id.");
requireText(teacherMediaAssetRoute, "MediaAssetWorkspacePanel", "Teacher media asset route must render the workspace panel.");
requireText(routeContracts, "getTeacherLabelledDiagramAssetWorkspacePath", "Route contracts must expose a Labelled Diagram asset workspace helper.");
requireText(routeContracts, "getTeacherMediaAssetWorkspacePath", "Route contracts must expose a media asset workspace helper.");
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
