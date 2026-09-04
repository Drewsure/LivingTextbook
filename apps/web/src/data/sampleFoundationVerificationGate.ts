export type FoundationVerificationStatus = "pass" | "manual-review" | "blocked";

export interface FoundationVerificationCheck {
  checkId: string;
  label: string;
  command: string;
  status: FoundationVerificationStatus;
  protects: string;
  evidence: string;
  nextStep: string;
}

export interface FoundationVerificationGate {
  gateId: string;
  label: string;
  summary: string;
  canonicalCommand: string;
  lastKnownStatus: FoundationVerificationStatus;
  checks: FoundationVerificationCheck[];
}

export const sampleFoundationVerificationGate: FoundationVerificationGate = {
  gateId: "foundation-verification-2026-07",
  label: "Foundation verification gate",
  summary:
    "This gate is the current no-shortcuts check before connector-side changes are treated as locally verified. It protects schema discipline, reusable game modes, package readiness, launch safety, upload governance, local companion honesty, prototype review boundaries, teacher-session safety, production build health, and active route availability.",
  canonicalCommand: "npm run verify:foundation",
  lastKnownStatus: "pass",
  checks: [
    {
      checkId: "taxonomy-coverage",
      label: "Progress event taxonomy",
      command: "npm run verify:taxonomy",
      status: "pass",
      protects: "Teacher reports and future storage records use the same reviewed event vocabulary.",
      evidence: "The verifier checks shared GameEventType values against the taxonomy registry.",
      nextStep: "Extend only through a reviewed taxonomy revision record.",
    },
    {
      checkId: "game-mode-coverage",
      label: "Game mode catalog",
      command: "npm run verify:game-modes",
      status: "pass",
      protects: "New modes cannot bypass parent-engine mapping, scoring profiles, or learner audio requirements.",
      evidence: "The verifier checks the shared GameModeId union against the active game catalog and scoring map.",
      nextStep: "Keep Z.ai and external prototypes outside platform mode status until this check passes.",
    },
    {
      checkId: "game-mode-settings",
      label: "Game mode settings safety",
      command: "npm run verify:game-settings",
      status: "pass",
      protects:
        "Timer, difficulty, motion, background media, attempts, audio settings, and future storage write intents stay review-only and cannot change scoring or support-language progression.",
      evidence:
        "The verifier checks active mode setting profiles, storage readiness records, no-save boundaries, target-language-only progress, assist-language support-only rules, and learning-audio priority.",
      nextStep:
        "Run this before adding teacher-adjustable timers, difficulty, motion settings, game skins, background music, or persisted game settings.",
    },
    {
      checkId: "package-readiness",
      label: "Package readiness",
      command: "npm run verify:package-readiness",
      status: "pass",
      protects: "MiniStar and sample publisher packages keep active game/audio, media, front-door, support-language, and AI Tutor policy aligned.",
      evidence: "The verifier checks two sample packages, eleven active modes, and seven readiness gates.",
      nextStep: "Move from sample source files to durable package manifests after persistence is selected.",
    },
    {
      checkId: "local-bundle-readiness",
      label: "Local bundle readiness",
      command: "npm run verify:local-bundle",
      status: "pass",
      protects:
        "Closed local companion packages and installable PWA shells stay preview-only until rights, checksums, installer/update, reporting, QR, cache, offline media, and school policy gates are closed.",
      evidence:
        "The verifier checks two bundle manifests, twelve local game modes, six release gate items, five PWA/offline readiness lanes, and five media bundle integrity lanes.",
      nextStep: "Use generated signed manifests when a real local exporter exists.",
    },
    {
      checkId: "readiness-matrix",
      label: "Readiness matrix verifiers",
      command: "npm run verify:activity-pathways && npm run verify:printables && npm run verify:tenant-library && npm run verify:teacher-authoring",
      status: "pass",
      protects: "Wordwall-style expectations stay curated: activity pathways, printables, private libraries, and teacher authoring remain reviewed before release.",
      evidence: "The focused verifiers check conversion boundaries, printable blockers, private-tenant-library-first rules, and teacher authoring gates.",
      nextStep: "Keep public community sharing and direct AI publish blocked until governance exists.",
    },
    {
      checkId: "prototype-review-readiness",
      label: "Prototype review readiness",
      command: "npm run verify:prototype-review",
      status: "pass",
      protects:
        "Z.ai, Phaser, and outside prototype work stays in tenant-scoped review workbenches until Codex approves integration evidence.",
      evidence:
        "The verifier checks prototype review routes, generator cross-links, game-readiness links, blocked app-write markers, no scoring mutation, and no route creation boundaries.",
      nextStep:
        "Run this before creating outside prototype tasks, reviewing returned Phaser work, or considering any prototype patch proposal.",
    },
    {
      checkId: "language-share-readiness",
      label: "Language and share gates",
      command: "npm run verify:target-language && npm run verify:share-embed && npm run verify:private-assignments",
      status: "pass",
      protects: "Target-language expansion stays separate from assist language, and sharing/embed features stay private-first for v1.",
      evidence: "The focused verifiers check Japanese-as-target-language blockers, assist-language boundaries, private assignment routes, and public/embed blocks.",
      nextStep: "Do not enable Japanese target-language pilots, public links, iframe embeds, or public assignment discovery before the named gates pass.",
    },
    {
      checkId: "launch-safety-boundaries",
      label: "Launch safety boundaries",
      command: "npm run verify:launch-safety",
      status: "pass",
      protects: "Student doorways, assignment links, teacher session monitors, and report package routes keep live classroom launch, production accounts, real learner data, and report export blocked until release gates close.",
      evidence: "The verifier checks student launch, front-door, assignment, teacher session, and report package routes for controlled-practice and launch-gate markers.",
      nextStep: "Run this before changing launch, assignment, session monitor, report package, classroom launch gate, or route-sharing behavior.",
    },
    {
      checkId: "earned-collection-readiness",
      label: "Earned collection readiness",
      command: "npm run verify:collection",
      status: "pass",
      protects: "Collection mechanics stay deterministic, mastery-earned, and child-safe before premium avatar, room, mascot, or animation polish begins.",
      evidence: "The verifier checks reward categories, collection routes, no-random copy, and principles around earned collection.",
      nextStep: "Run this before changing reward categories, avatar/room/companion collection rules, or surprise reward mechanics.",
    },
    {
      checkId: "class-roster-readiness",
      label: "Class roster readiness",
      command: "npm run verify:class-roster",
      status: "pass",
      protects: "Teacher-issued learner codes can power classroom reports without premature accounts, real names, family contact, raw audio, or speech transcripts.",
      evidence: "The verifier checks three roster plans, five roster data boundaries, validation guards, front-door code copy, teacher session roster cards, and storage previews.",
      nextStep: "Run this before changing learner identity, roster slots, front-door codes, teacher reports, microphone features, AI Tutor speech records, or local/classroom export claims.",
    },
    {
      checkId: "teacher-session-settings",
      label: "Teacher session settings safety",
      command: "npm run verify:session-settings",
      status: "pass",
      protects: "Teacher launch settings keep learner audio required, assist language support-only, raw audio excluded, background media subordinate, and AI Tutor premium-gated.",
      evidence: "The verifier checks eleven safety guards, six persistence warnings, and the assist-language teacher enablement snapshot field.",
      nextStep: "Expand this check when settings move from sample data into hosted or local persistence.",
    },
    {
      checkId: "upload-channel-readiness",
      label: "Upload channel readiness",
      command: "npm run verify:upload-channels",
      status: "pass",
      protects: "PDF/text, image, audio/music, and video uploads remain governed intake records before live file pickers, game assets, media playlists, or local bundles exist.",
      evidence: "The verifier checks four upload channels, source-lineage rules, Labelled Diagram image rules, media upload policies, and blocked student-facing shortcuts.",
      nextStep: "Run this before adding live upload controls, OCR, image label anchors, object storage, media processing, or local bundle upload folders.",
    },
    {
      checkId: "backend-storage-readiness",
      label: "Backend storage readiness",
      command: "npm run verify:backend-storage",
      status: "pass",
      protects: "Backend schema, migration candidates, migration specs, durable records, and adapter plans preserve the same vendor-neutral storage contract.",
      evidence: "The verifier checks schema entities, migration candidates, migration specs, raw-audio/transcript exclusions, event acceptance gates, earned collection storage, and hosted/local launch-session writes.",
      nextStep: "Run this before backend selection or any vendor-specific migration work.",
    },
    {
      checkId: "release-control-readiness",
      label: "Release control readiness",
      command: "npm run verify:release-control",
      status: "pass",
      protects: "Demo-visible packages cannot be mistaken for pilot-publishable packages while release gates or required approvals remain open.",
      evidence: "The verifier checks publish gates, approval signoffs, derived pilot-readiness logic, and release-control storage previews.",
      nextStep: "Run this before changing publish gates, approval ledgers, release candidate status, or pilot handoff claims.",
    },
    {
      checkId: "package-entitlement-readiness",
      label: "Package entitlement readiness",
      command: "npm run verify:package-entitlements",
      status: "pass",
      protects:
        "Optional paid AI generation, Voice Tutor, microphone scoring, speech APIs, hosted storage, report export, and local companion mode stay teacher/admin-controlled before billing or activation.",
      evidence:
        "The verifier checks the white-label package catalog, entitlement route, AI cost gates, Voice Tutor panel, tenant configs, route contracts, route verifier, ADR, decision record, and route checklist.",
      nextStep:
        "Run this before changing package tiers, premium feature copy, AI generation entitlements, Voice Tutor, microphone scoring, report export, hosted storage, or local companion activation.",
    },
    {
      checkId: "deployment-decision-readiness",
      label: "Deployment decision workbench",
      command: "npm run verify:deployment",
      status: "pass",
      protects:
        "Hosted PWA, local classroom server, packaged companion, PWA/offline, media bundle, local preflight, and package tier choices stay review-only before export, installer, or offline delivery workflows.",
      evidence:
        "The verifier checks the deployment decision guide, route, navigation, active route matrix, active route verifier, standards, ADR, decision record, and route checklist.",
      nextStep:
        "Run this before changing hosted/local/package deployment language, offline claims, media bundle handoff, installer strategy, or white-label package delivery copy.",
    },
    {
      checkId: "pilot-readiness-dashboard",
      label: "Pilot readiness dashboard",
      command: "npm run verify:pilot",
      status: "pass",
      protects:
        "First partner and school pilot conversations keep demo-ready evidence separate from classroom-ready launch, policy, persistence, report, media, deployment, and package approval requirements.",
      evidence:
        "The verifier checks the /teacher/pilot command view, route contract, route matrix, navigation, hard blockers, and Demo-ready, not classroom-ready language.",
      nextStep:
        "Run this before changing pilot-readiness wording, evidence routes, school-policy links, persistence/report blockers, deployment stance, or partner-facing pilot claims.",
    },
    {
      checkId: "web-typecheck-build",
      label: "Web typecheck and build",
      command: "npm run typecheck --workspace @living-textbook/web && npm run build --workspace @living-textbook/web",
      status: "pass",
      protects: "The Next.js app compiles before route or browser verification claims are trusted.",
      evidence: "The build uses the webpack path documented for this Windows environment.",
      nextStep: "Keep the documented webpack workaround until Next/Turbopack is stable in this workspace.",
    },
    {
      checkId: "active-routes",
      label: "Active route checks",
      command: "npm run verify:routes",
      status: "pass",
      protects: "Teacher, student, game, media, report, local companion, and QR routes stay reachable.",
      evidence: "The verifier checks 87 active routes and required page text.",
      nextStep: "Add new active routes to the route matrix before treating them as part of a pilot.",
    },
  ],
};
