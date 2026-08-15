import {
  getPublisherMaintenancePlanWarnings,
  validatePublisherMaintenancePlan,
  type PublisherMaintenanceChangeRequest,
  type PublisherMaintenanceChangeStatus,
  type PublisherMaintenanceDomain,
  type PublisherMaintenanceItem,
  type PublisherMaintenancePlan,
  type PublisherMaintenanceRouteImpact,
  type PublisherMaintenanceStatus,
  type PublisherReleaseWindow,
} from "@living-textbook/content-model/src/publisherMaintenance";

export type {
  PublisherMaintenanceChangeRequest,
  PublisherMaintenanceChangeStatus,
  PublisherMaintenanceDomain,
  PublisherMaintenanceItem,
  PublisherMaintenancePlan,
  PublisherMaintenanceRouteImpact,
  PublisherMaintenanceStatus,
  PublisherReleaseWindow,
};

export const samplePublisherMaintenancePlan: PublisherMaintenancePlan = {
  planId: "publisher-yearly-maintenance-plan",
  label: "Publisher yearly maintenance and release plan",
  summary:
    "White-label partners need to maintain their own textbook-linked music, video, and game offers year after year without breaking printed QR codes or classroom reporting.",
  partnerPromise:
    "A publisher can own the educational content and media library while the Living Textbook platform owns stable routes, reviewed packages, progress events, and report policy.",
  items: [
    {
      itemId: "source-unit-review",
      label: "PDF and source-unit intake",
      domain: "content",
      owner: "Publisher content lead plus platform reviewer",
      cadence: "Before every edition or term release",
      status: "ready",
      whiteLabelRule:
        "Source files remain partner-owned. The platform converts them into reviewed unit packages only after human approval.",
      evidence:
        "The intake scaffold already separates source material, AI draft suggestions, human review, and student-facing package release.",
      nextStep: "Add real partner sample fields for unit title, page range, media links, and review notes.",
      notAllowedYet: ["Auto-publishing AI conversions", "Treating uploaded PDFs as student-ready content"],
    },
    {
      itemId: "media-rights-library",
      label: "Audio and video rights library",
      domain: "media",
      owner: "Publisher media owner",
      cadence: "Annual rights check plus per-release upload review",
      status: "needs-owner",
      whiteLabelRule:
        "Audio and video can be hosted or bundled locally, but every asset needs ownership, usage, and version metadata.",
      evidence:
        "The multimedia package model already supports audio, video, playlists, background media, posters, and unavailable-source states.",
      nextStep: "Define the partner asset manifest fields for title, source file, license note, duration, transcript status, and local-bundle eligibility.",
      notAllowedYet: ["Unlicensed media in public demo folders", "Anonymous yearly media replacement", "Silent deletion of old edition assets"],
    },
    {
      itemId: "game-offer-map",
      label: "Game offer map by unit",
      domain: "games",
      owner: "Platform game lead plus publisher curriculum reviewer",
      cadence: "Per release cycle, then optional mid-year refresh",
      status: "ready",
      whiteLabelRule:
        "Partners choose which game modes are available per unit, but modes must still run through reusable parent engines and standard progress events.",
      evidence:
        "The current slice has flashcards, Match Up, Memory Match, Balloon Pop, Speak It, Training Academy, and standard event/progress concepts.",
      nextStep: "Add a unit-to-game availability record that can say required, optional, hidden, premium, or teacher-only.",
      notAllowedYet: ["One-off games without progress events", "Partner games that bypass audio support", "Game modes promoted without mobile checks"],
    },
    {
      itemId: "stable-qr-registry",
      label: "Stable QR and entry-code registry",
      domain: "routes",
      owner: "Platform operator",
      cadence: "Locked before print, reviewed before each new edition",
      status: "ready",
      whiteLabelRule:
        "Printed QR codes should resolve stable route identifiers, not unstable development URLs or direct local file paths.",
      evidence:
        "The route registry and front-door routes already separate tenant entry, launch codes, and student-facing flows.",
      nextStep: "Add edition-aware route aliases for a sample publisher unit and keep local fallback references alongside hosted URLs.",
      notAllowedYet: ["QR codes pointing to localhost", "QR codes pointing directly to media files", "Edition changes that break old printed books"],
    },
    {
      itemId: "teacher-report-policy",
      label: "Teacher reporting and export policy",
      domain: "reports",
      owner: "School or publisher admin with platform policy guardrails",
      cadence: "Before first pilot and whenever a school contract changes",
      status: "needs-owner",
      whiteLabelRule:
        "Progress reports are available only when the tenant has accepted privacy, retention, export, and role-access rules.",
      evidence:
        "Teacher session monitor, pilot policy, persistence boundary, and backend matrix panels now expose reporting decisions before storage is chosen.",
      nextStep: "Convert report policy into a tenant setting that blocks live storage until accepted.",
      notAllowedYet: ["Raw learner audio in reports", "Open-ended AI Tutor transcripts in core reports", "Cross-tenant exports"],
    },
  ],
  releaseWindows: [
    {
      releaseId: "pilot-package",
      label: "Pilot package",
      timing: "4 to 8 weeks before classroom trial",
      purpose: "Confirm one small textbook unit with reviewed games, audio, video, QR route, and teacher summary.",
      requiredProof: ["Human content approval", "Media rights note", "Route test", "Mobile game check", "Teacher report preview"],
    },
    {
      releaseId: "annual-edition",
      label: "Annual edition package",
      timing: "Before new textbook print or school year rollout",
      purpose: "Freeze stable unit routes, update multimedia, refresh game availability, and keep old edition fallbacks available.",
      requiredProof: ["Edition version", "Asset manifest", "Game offer map", "Local bundle manifest", "Rollback record"],
    },
    {
      releaseId: "midyear-refresh",
      label: "Mid-year refresh",
      timing: "Optional, only for non-breaking improvements",
      purpose: "Add reviewed bonus media, fix content errors, or unlock extra game modes without changing printed QR meaning.",
      requiredProof: ["Change log", "No route break", "No report-schema change", "Teacher-visible notice"],
    },
  ],
  changeRequests: [
    {
      requestId: "change-annual-audio-refresh",
      label: "Replace Unit 1 routine chant with 2027 recording",
      domain: "media",
      requestedBy: "Publisher media owner",
      targetEdition: "2027 annual edition",
      changeType: "Media replacement",
      status: "review-required",
      routeImpact: "alias-preserved",
      mediaImpact: "Requires new media manifest version and proof of audio ownership.",
      gameImpact: "Can become optional background media only after learning-audio ducking is verified.",
      reportImpact: "Media engagement remains support-only and does not change mastery scoring.",
      requiredApprovals: ["Media rights", "Audio QA", "Package release gate"],
      blockedBy: ["Updated rights proof not attached", "Local bundle path not reviewed"],
      nextAction: "Attach the 2027 media manifest and confirm hosted/local delivery paths.",
    },
    {
      requestId: "change-add-sentence-builder",
      label: "Add Sentence Builder to Unit 1 after flashcards and Memory Match",
      domain: "games",
      requestedBy: "Publisher curriculum reviewer",
      targetEdition: "2026 pilot refresh",
      changeType: "Game availability",
      status: "ready-for-release",
      routeImpact: "none",
      mediaImpact: "Uses existing term and sentence audio cues.",
      gameImpact: "Adds a text-spelling engine mode using existing target sentences and standard scoring events.",
      reportImpact: "Adds answer_result and mastery_updated rows to teacher report packages.",
      requiredApprovals: ["Game QA", "Audio coverage", "Teacher assignment review"],
      blockedBy: [],
      nextAction: "Include in the next release candidate only if mobile route checks pass.",
    },
    {
      requestId: "change-qr-edition-redirect",
      label: "Redirect old printed QR to current 2027 Unit 1 package",
      domain: "routes",
      requestedBy: "Platform operator",
      targetEdition: "2027 annual edition",
      changeType: "QR alias update",
      status: "blocked",
      routeImpact: "requires-redirect",
      mediaImpact: "No direct media QR target allowed.",
      gameImpact: "Must preserve teacher front-door entry before game launch.",
      reportImpact: "Report package policy must match the destination package.",
      requiredApprovals: ["QR print readiness", "Release rollback", "School/publisher notice"],
      blockedBy: ["Old edition fallback message not written", "Rollback route not reviewed"],
      nextAction: "Define fallback wording and rollback target before updating the alias.",
    },
  ],
  standingRules: [
    "Publisher maintenance is a first-class white-label feature, not a custom support favor.",
    "Every yearly package needs content, media, route, game, and report review before release.",
    "Old printed QR codes must continue resolving to a safe route or clear edition message.",
    "Music and video can support games as optional background media, but core learning audio remains separate and always accessible.",
    "Local bundles and hosted packages must share the same manifest vocabulary so the platform can support both paths.",
  ],
};

export const samplePublisherMaintenancePlanErrors = validatePublisherMaintenancePlan(samplePublisherMaintenancePlan);

export const samplePublisherMaintenancePlanWarnings = getPublisherMaintenancePlanWarnings(samplePublisherMaintenancePlan);
