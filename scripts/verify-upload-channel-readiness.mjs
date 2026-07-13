import { readFileSync } from "node:fs";

const plan = readSource("../apps/web/src/data/sampleUploadChannelReadiness.ts");
const reviewQueue = readSource("../apps/web/src/data/sampleUploadReviewQueue.ts");
const promotionReadiness = readSource("../apps/web/src/data/sampleUploadPromotionReadiness.ts");
const panel = readSource("../apps/web/src/features/content-intake/UploadChannelReadinessPanel.tsx");
const reviewQueuePanel = readSource("../apps/web/src/features/content-intake/UploadReviewQueuePanel.tsx");
const promotionReadinessPanel = readSource("../apps/web/src/features/content-intake/UploadPromotionReadinessPanel.tsx");
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
requireText(teacherIntake, "UploadChannelReadinessPanel", "Teacher intake route must render upload readiness.");
requireText(teacherIntake, "UploadReviewQueuePanel", "Teacher intake route must render upload review queue.");
requireText(teacherIntake, "UploadPromotionReadinessPanel", "Teacher intake route must render upload promotion readiness.");
requireText(routeVerifier, "Upload channel readiness", "Active route verifier must check upload channel readiness.");
requireText(routeVerifier, "Image upload for Labelled Diagram", "Active route verifier must check labelled diagram image upload readiness.");
requireText(routeVerifier, "Upload review queue", "Active route verifier must check upload review queue.");
requireText(routeVerifier, "Upload promotion readiness", "Active route verifier must check upload promotion readiness.");

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
