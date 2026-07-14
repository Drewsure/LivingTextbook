import { readFileSync } from "node:fs";

const plan = readSource("../apps/web/src/data/sampleUploadChannelReadiness.ts");
const reviewQueue = readSource("../apps/web/src/data/sampleUploadReviewQueue.ts");
const promotionReadiness = readSource("../apps/web/src/data/sampleUploadPromotionReadiness.ts");
const labelledDiagramAssetReadiness = readSource("../apps/web/src/data/sampleLabelledDiagramAssetReadiness.ts");
const multimediaAssetReadiness = readSource("../apps/web/src/data/sampleMultimediaAssetReadiness.ts");
const contentEntryOptionScaffold = readSource("../apps/web/src/data/sampleContentEntryOptionScaffold.ts");
const panel = readSource("../apps/web/src/features/content-intake/UploadChannelReadinessPanel.tsx");
const reviewQueuePanel = readSource("../apps/web/src/features/content-intake/UploadReviewQueuePanel.tsx");
const promotionReadinessPanel = readSource("../apps/web/src/features/content-intake/UploadPromotionReadinessPanel.tsx");
const labelledDiagramAssetPanel = readSource("../apps/web/src/features/content-intake/LabelledDiagramAssetReadinessPanel.tsx");
const multimediaAssetPanel = readSource("../apps/web/src/features/content-intake/MultimediaAssetReadinessPanel.tsx");
const contentEntryOptionPanel = readSource("../apps/web/src/features/content-intake/ContentEntryOptionScaffoldPanel.tsx");
const teacherIntake = readSource("../apps/web/src/app/teacher/intake/page.tsx");
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

requireText(panel, "Upload channel readiness", "Upload readiness panel must expose its heading.");
requireText(panel, "Foundation rule", "Upload readiness panel must expose the foundation rule.");
requireText(panel, "Accepted file types", "Upload readiness panel must show accepted file types.");
requireText(panel, "Upload targets", "Upload readiness panel must show upload targets.");
requireText(panel, "Not allowed yet", "Upload readiness panel must show blocked shortcuts.");
requireText(reviewQueuePanel, "Review queue preview", "Upload review queue panel must expose review queue preview heading.");
requireText(reviewQueuePanel, "Reviewer decision preview", "Upload review queue panel must expose disabled decision previews.");
requireText(reviewQueuePanel, "Live actions blocked", "Upload review queue panel must show live actions are blocked.");
requireText(promotionReadinessPanel, "Target-specific promotion preview", "Upload promotion panel must expose target-specific promotion preview heading.");
requireText(promotionReadinessPanel, "Storage before live", "Upload promotion panel must show storage-before-live gates.");
requireText(labelledDiagramAssetPanel, "Game asset landing zone", "Labelled Diagram asset panel must expose the asset landing zone heading.");
requireText(labelledDiagramAssetPanel, "game_asset_manifest", "Labelled Diagram asset panel must expose game asset manifest.");
requireText(labelledDiagramAssetPanel, "label_anchor_record", "Labelled Diagram asset panel must expose label anchor record.");
requireText(multimediaAssetPanel, "Media asset landing zone", "Multimedia asset panel must expose the media landing zone heading.");
requireText(multimediaAssetPanel, "Manifest and binding records", "Multimedia asset panel must expose manifest and binding records.");
requireText(multimediaAssetPanel, "Media lanes", "Multimedia asset panel must expose media lanes.");
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
requireText(teacherIntake, "UploadChannelReadinessPanel", "Teacher intake route must render upload readiness.");
requireText(teacherIntake, "ContentEntryOptionScaffoldPanel", "Teacher intake route must render content entry option scaffold.");
requireText(teacherIntake, "UploadReviewQueuePanel", "Teacher intake route must render upload review queue.");
requireText(teacherIntake, "UploadPromotionReadinessPanel", "Teacher intake route must render upload promotion readiness.");
requireText(teacherIntake, "LabelledDiagramAssetReadinessPanel", "Teacher intake route must render Labelled Diagram asset readiness.");
requireText(teacherIntake, "MultimediaAssetReadinessPanel", "Teacher intake route must render multimedia asset readiness.");
requireText(routeVerifier, "Upload channel readiness", "Active route verifier must check upload channel readiness.");
requireText(routeVerifier, "Image upload for Labelled Diagram", "Active route verifier must check labelled diagram image upload readiness.");
requireText(routeVerifier, "Upload review queue", "Active route verifier must check upload review queue.");
requireText(routeVerifier, "Upload promotion readiness", "Active route verifier must check upload promotion readiness.");
requireText(routeVerifier, "Labelled Diagram asset readiness", "Active route verifier must check Labelled Diagram asset readiness.");
requireText(routeVerifier, "Multimedia asset readiness", "Active route verifier must check multimedia asset readiness.");
requireText(routeVerifier, "Content entry option scaffold", "Active route verifier must check content entry option scaffold.");
requireText(routeVerifier, "Generate With AI", "Active route verifier must check AI generation control.");
requireText(routeVerifier, "Flip tiles", "Active route verifier must check flip tiles control.");
requireText(routeVerifier, "Approved learner font", "Active route verifier must check font controls.");
requireText(routeVerifier, "Cross-game upload guide", "Active route verifier must check cross-game upload guide.");
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
