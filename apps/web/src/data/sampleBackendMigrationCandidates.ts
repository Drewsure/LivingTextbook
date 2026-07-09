export type BackendMigrationCandidateStatus = "ready-to-design" | "needs-policy" | "defer";
export type BackendMigrationCandidateTrack = "hosted-pilot" | "local-classroom" | "shared";
export type BackendMigrationCandidateRisk = "low" | "medium" | "high";

export interface BackendMigrationCandidate {
  migrationId: string;
  label: string;
  track: BackendMigrationCandidateTrack;
  status: BackendMigrationCandidateStatus;
  risk: BackendMigrationCandidateRisk;
  targetEntities: string[];
  purpose: string;
  prerequisites: string[];
  implementationNotes: string[];
  rollbackOrExportNeeds: string[];
  notAllowedYet: string[];
}

export interface BackendMigrationPlan {
  planId: string;
  label: string;
  summary: string;
  sequencingRule: string;
  candidates: BackendMigrationCandidate[];
  standingRules: string[];
}

export const sampleBackendMigrationPlan: BackendMigrationPlan = {
  planId: "first-pilot-backend-migration-candidates",
  label: "First pilot backend migration candidates",
  summary:
    "These are vendor-neutral implementation slices for moving from static demo data to a real first pilot. They intentionally name sequence, prerequisites, rollback/export needs, and forbidden shortcuts before a backend vendor is selected.",
  sequencingRule:
    "Migrate identity-light administrative records first, then route/package release control, then teacher sessions, then event streams and reports. Do not store real student progress until policy, retention, export, and access rules are accepted.",
  candidates: [
    {
      migrationId: "m001-tenant-and-entitlements",
      label: "Tenant and feature entitlement records",
      track: "shared",
      status: "ready-to-design",
      risk: "low",
      targetEntities: ["tenant"],
      purpose: "Move tenant branding, assist-language settings, deployment preferences, and premium entitlements out of static code before partner onboarding.",
      prerequisites: ["Confirm tenant config fields", "Confirm AI Tutor and microphone scoring remain optional premium entitlements"],
      implementationNotes: [
        "Keep tenant records small and admin-editable.",
        "Preserve CSS token and feature entitlement boundary.",
        "Do not hard-code MiniStar values into shared records.",
      ],
      rollbackOrExportNeeds: ["Export tenant config as JSON", "Keep source-controlled fallback for demos"],
      notAllowedYet: ["Tenant-specific schema forks", "Global hard-coded support language"],
    },
    {
      migrationId: "m002-package-release-and-content",
      label: "Package release and reviewed content records",
      track: "hosted-pilot",
      status: "ready-to-design",
      risk: "medium",
      targetEntities: ["package_release", "package_game_audio_coverage"],
      purpose: "Persist reviewed package releases, edition/version metadata, active release state, assigned game modes, and audio-covered mode snapshots without making raw source files student-facing.",
      prerequisites: ["Human review workflow remains required", "Package versioning contract accepted"],
      implementationNotes: [
        "Keep release metadata queryable.",
        "Store large payload blobs separately if they become too large for ordinary rows/documents.",
        "Preserve assigned game modes and audio-covered modes as release metadata.",
        "Support rollback to prior package versions.",
      ],
      rollbackOrExportNeeds: ["Export package release metadata", "Export game/audio coverage snapshot", "Retain archived release target for old QR routes"],
      notAllowedYet: ["Auto-publish AI/PDF extraction", "Raw PDF as active student payload"],
    },
    {
      migrationId: "m003-route-alias-registry",
      label: "Stable QR and route alias registry",
      track: "hosted-pilot",
      status: "ready-to-design",
      risk: "medium",
      targetEntities: ["route_alias"],
      purpose: "Persist permanent QR aliases and front-door entry mappings before printed partner materials or live classroom codes are used.",
      prerequisites: ["Stable route schema accepted", "Fallback target rules accepted"],
      implementationNotes: [
        "Make alias lookup fast and tenant-scoped.",
        "Support inactive/archived aliases without deletion.",
        "Keep local fallback target separate from hosted target.",
      ],
      rollbackOrExportNeeds: ["Export alias registry", "Restore previous package target if a release is rolled back"],
      notAllowedYet: ["QR to localhost", "QR directly to media files", "Deleting printed QR aliases"],
    },
    {
      migrationId: "m004-media-manifest-rights",
      label: "Media manifest and rights records",
      track: "shared",
      status: "ready-to-design",
      risk: "medium",
      targetEntities: ["media_manifest"],
      purpose: "Persist audio/video/playlists/background-media metadata, rights status, hosted object paths, and local bundle paths.",
      prerequisites: ["Rights fields accepted", "Object/local bundle storage strategy selected"],
      implementationNotes: [
        "Store file metadata, not large binary files, in the database.",
        "Keep hosted and local paths versioned.",
        "Block pilot-publishable release if required media rights are unknown.",
      ],
      rollbackOrExportNeeds: ["Export media manifest", "Retain prior media version references", "Support local bundle manifest export"],
      notAllowedYet: ["Anonymous media ownership", "Unversioned file replacement", "Unlicensed public demo media"],
    },
    {
      migrationId: "m005-publish-gate-and-approval-ledger",
      label: "Publish gate and approval ledger records",
      track: "hosted-pilot",
      status: "needs-policy",
      risk: "medium",
      targetEntities: ["package_publish_gate", "package_approval_ledger"],
      purpose: "Persist release-control state so packages cannot become pilot-publishable without evidence-backed gate closure and required sign-offs.",
      prerequisites: ["Approver identity rules accepted", "Evidence storage path selected", "Release rollback rule accepted"],
      implementationNotes: [
        "Keep approval records append-friendly where possible.",
        "Store evidence links, not chat-only approval claims.",
        "Publish status changes must validate gate and ledger state.",
      ],
      rollbackOrExportNeeds: ["Export release gate and approval ledger", "Retain superseded approval records", "Link approval to release candidate version"],
      notAllowedYet: ["Fake signed approvals", "Pilot-publishable status with open blockers", "Policy override without evidence"],
    },
    {
      migrationId: "m006-launch-session-settings",
      label: "Teacher launch session and settings records",
      track: "hosted-pilot",
      status: "needs-policy",
      risk: "high",
      targetEntities: ["launch_session"],
      purpose: "Persist teacher-created classroom sessions, entry codes, audio/support-language controls, microphone approval, AI Tutor state, and report controls.",
      prerequisites: ["Teacher/session role model accepted", "Retention and report settings accepted", "Microphone and AI Tutor policies accepted"],
      implementationNotes: [
        "Keep learner identity coded for pilot.",
        "Store settings snapshot with each session.",
        "Do not allow support language to satisfy mastery or unlocks.",
      ],
      rollbackOrExportNeeds: ["Export session settings", "Archive expired sessions", "Keep policy snapshot for report interpretation"],
      notAllowedYet: ["Ungated AI Tutor", "Speech scoring without premium policy", "Support-language mastery credit"],
    },
    {
      migrationId: "m007-progress-event-stream",
      label: "Progress and media event stream records",
      track: "hosted-pilot",
      status: "needs-policy",
      risk: "high",
      targetEntities: ["progress_event"],
      purpose: "Persist coded learner game, media, recovery, mastery, and Star Dust events for teacher reports and Training Academy recovery.",
      prerequisites: ["Privacy policy accepted", "Retention period accepted", "Report export fields accepted", "Access roles accepted"],
      implementationNotes: [
        "Use append-only event patterns where possible.",
        "Index by session, learner code, event type, and time.",
        "Keep raw audio and transcripts out of metadata.",
      ],
      rollbackOrExportNeeds: ["Export teacher report data", "Delete/archive by retention policy", "Support school-owned export package"],
      notAllowedYet: ["Raw learner audio", "Speech transcript", "Open-ended personal notes", "Ungated report exports"],
    },
    {
      migrationId: "m008-local-classroom-export-store",
      label: "Local classroom export and restore records",
      track: "local-classroom",
      status: "defer",
      risk: "high",
      targetEntities: ["media_manifest", "route_alias", "package_publish_gate", "package_approval_ledger", "progress_event"],
      purpose: "Prepare closed/local deployments to backup, restore, and export package, media, release-control, and progress records without hosted dependency.",
      prerequisites: ["Hosted pilot schema validated", "Local backup/restore strategy accepted", "Installer/update path accepted"],
      implementationNotes: [
        "Use the same record vocabulary as hosted pilot.",
        "Keep local bundle integrity checks explicit.",
        "Treat manual file copying as a recovery-only fallback, not product workflow.",
      ],
      rollbackOrExportNeeds: ["Whole package export", "Teacher progress export", "Local media bundle manifest", "Release approval ledger export"],
      notAllowedYet: ["Unbacked local-only progress", "Unversioned media folder replacement", "Manual-only production update path"],
    },
  ],
  standingRules: [
    "Do not create production migrations before backend choice and policy gates are accepted.",
    "Migrations must preserve tenant boundaries and release-control records.",
    "Raw learner audio and transcripts stay out of core storage.",
    "Hosted and local implementations must use the same record vocabulary.",
    "Every migration candidate needs rollback or export expectations before implementation.",
  ],
};
