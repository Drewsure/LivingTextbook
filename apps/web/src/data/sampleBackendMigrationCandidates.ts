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
      label: "Release candidate, publish gate, and approval ledger records",
      track: "hosted-pilot",
      status: "needs-policy",
      risk: "medium",
      targetEntities: ["package_release_candidate", "package_publish_gate", "package_approval_ledger"],
      purpose: "Persist release-control state so packages cannot become pilot-publishable without a derived candidate summary, evidence-backed gate closure, and required sign-offs.",
      prerequisites: ["Approver identity rules accepted", "Evidence storage path selected", "Release rollback rule accepted"],
      implementationNotes: [
        "Release candidate status must be derived from gate and ledger state.",
        "Keep approval records append-friendly where possible.",
        "Store evidence links, not chat-only approval claims.",
        "Publish status changes must validate gate and ledger state.",
      ],
      rollbackOrExportNeeds: ["Export release candidate status, release gate, and approval ledger", "Retain superseded approval records", "Link approval to release candidate version"],
      notAllowedYet: ["Manual pilot-ready override", "Fake signed approvals", "Pilot-publishable status with open blockers", "Policy override without evidence"],
    },
    {
      migrationId: "m006-launch-session-settings",
      label: "Teacher launch session and settings records",
      track: "hosted-pilot",
      status: "needs-policy",
      risk: "high",
      targetEntities: ["launch_session"],
      purpose: "Persist teacher-created classroom sessions, entry codes, audio/support-language controls, microphone approval, event acceptance gates, AI Tutor state, and report controls.",
      prerequisites: ["Teacher/session role model accepted", "Retention and report settings accepted", "Microphone and AI Tutor policies accepted"],
      implementationNotes: [
        "Keep learner identity coded for pilot.",
        "Store settings snapshot with each session.",
        "Store event acceptance gate status before accepting live event writes.",
        "Do not allow support language to satisfy mastery or unlocks.",
        "Preserve background-media and route-guidance flags as support-only.",
        "Keep raw microphone audio, learner transcripts, and ungated AI Tutor state out of the core launch-session record.",
      ],
      rollbackOrExportNeeds: ["Export session settings and event acceptance snapshots", "Archive expired sessions", "Keep policy and settings revision snapshots for report interpretation"],
      notAllowedYet: ["Ungated AI Tutor", "Speech scoring without premium policy", "Support-language mastery credit", "Background media unlock credit", "Manual live-event-storage override", "Raw audio or transcripts in launch settings"],
    },
    {
      migrationId: "m007-progress-event-stream",
      label: "Progress and media event stream records",
      track: "hosted-pilot",
      status: "needs-policy",
      risk: "high",
      targetEntities: ["progress_event"],
      purpose: "Persist coded learner game, media, recovery, mastery, support-only guidance, and Star Dust events for teacher reports and Training Academy recovery.",
      prerequisites: ["Privacy policy accepted", "Retention period accepted", "Report export fields accepted", "Access roles accepted"],
      implementationNotes: [
        "Use append-only event patterns where possible.",
        "Require the launch-session event acceptance gate to pass before accepting student event writes.",
        "Index by session, learner code, event type, event effect, and time.",
        "Preserve the reviewed event taxonomy effect so support-only guidance never becomes scoring evidence.",
        "Keep raw audio and transcripts out of metadata.",
      ],
      rollbackOrExportNeeds: ["Export teacher report data", "Delete/archive by retention policy", "Support school-owned export package"],
      notAllowedYet: ["Raw learner audio", "Speech transcript", "Open-ended personal notes", "Ungated report exports", "Support-only events used for mastery or unlocks"],
    },
    {
      migrationId: "m008-local-classroom-export-store",
      label: "Local classroom export and restore records",
      track: "local-classroom",
      status: "defer",
      risk: "high",
      targetEntities: ["media_manifest", "route_alias", "package_release_candidate", "package_publish_gate", "package_approval_ledger", "progress_event", "teacher_report_package", "local_companion_handoff", "local_companion_release_gate"],
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
    {
      migrationId: "m009-teacher-report-package-boundary",
      label: "Teacher report package boundary records",
      track: "hosted-pilot",
      status: "needs-policy",
      risk: "high",
      targetEntities: ["teacher_report_package"],
      purpose: "Persist teacher report package boundaries so exports preserve learning evidence, support-only signals, excluded sensitive fields, and live-use blockers.",
      prerequisites: ["Report export policy accepted", "Progress event taxonomy accepted", "Teacher/session access roles accepted", "Retention and audit rules accepted"],
      implementationNotes: [
        "Build report package summaries from launch session and progress event records.",
        "Preserve the launch-session event acceptance summary in every report package snapshot.",
        "Preserve support-only event semantics in every export format.",
        "Store excluded sensitive-field rules with the report package snapshot.",
        "Keep raw learner audio, transcripts, and open-ended AI Tutor chat out of core report packages.",
      ],
      rollbackOrExportNeeds: ["Export report package boundary as JSON", "Regenerate from normalized events when policy allows", "Support local report package export"],
      notAllowedYet: ["Ungated teacher report export", "Raw audio in report package", "Learner transcript in core report", "Support-only events counted as mastery"],
    },
    {
      migrationId: "m010-publisher-maintenance-change-requests",
      label: "Publisher maintenance change request records",
      track: "shared",
      status: "ready-to-design",
      risk: "medium",
      targetEntities: ["publisher_maintenance_change"],
      purpose: "Persist year-on-year publisher content, media, game, route, and report update requests before package release mutation.",
      prerequisites: ["Package release versioning accepted", "Media rights workflow accepted", "QR alias rollback rule accepted"],
      implementationNotes: [
        "Keep change requests tenant-scoped and package-scoped.",
        "Represent route impact explicitly before QR alias changes.",
        "Represent media, game, and report impacts before release approval.",
        "Do not let change requests directly mutate active student routes.",
      ],
      rollbackOrExportNeeds: ["Export change requests with release candidate records", "Retain blocked and superseded requests for audit", "Support local bundle change history"],
      notAllowedYet: ["Silent QR retargeting", "Direct media file replacement", "Unreviewed game activation", "Report policy override by change request"],
    },
    {
      migrationId: "m011-local-companion-handoff-records",
      label: "Local companion handoff records",
      track: "local-classroom",
      status: "ready-to-design",
      risk: "medium",
      targetEntities: ["local_companion_handoff"],
      purpose: "Persist closed/local package handoff requirements before offline-ready claims, installer builds, or local server packages.",
      prerequisites: ["Local bundle manifest accepted", "Media rights workflow accepted", "Checksum procedure accepted", "Local report policy accepted"],
      implementationNotes: [
        "Treat handoff records as release-control artifacts, not student progress records.",
        "Derive offline-ready status from checklist completion.",
        "Export checklist records with local bundle manifests.",
        "Block manual offline-ready overrides when artifacts are missing.",
      ],
      rollbackOrExportNeeds: ["Export local companion handoff record", "Retain superseded handoff records with package release history", "Restore checklist state with local bundle backups"],
      notAllowedYet: ["Manual offline-ready override", "Installer build with missing rights proof", "Checksum-free media bundle", "Local report export without policy"],
    },
    {
      migrationId: "m012-local-companion-release-gate-records",
      label: "Local companion release gate records",
      track: "local-classroom",
      status: "ready-to-design",
      risk: "medium",
      targetEntities: ["local_companion_release_gate"],
      purpose: "Persist closed/local package release decisions before publisher handoff, installer packaging, or school-owned local deployment.",
      prerequisites: ["Local companion handoff record accepted", "Installer/update strategy accepted", "Backup/export policy accepted", "Media rights and checksum procedure accepted", "School access/privacy policy accepted"],
      implementationNotes: [
        "Treat the gate as release-control metadata, not student progress data.",
        "Derive closed-handoff status from release gate item status.",
        "Export release gate records with local bundle manifests.",
        "Block manual closed-handoff overrides when any required gate item is blocked.",
      ],
      rollbackOrExportNeeds: ["Export local companion release gate record", "Retain superseded gate snapshots with package release history", "Restore gate state with local bundle backups"],
      notAllowedYet: ["Manual closed-handoff override", "Installer handoff with open blockers", "Offline bundle without backup/export policy", "Local school deployment without privacy/access policy"],
    },
  ],
  standingRules: [
    "Do not create production migrations before backend choice and policy gates are accepted.",
    "Migrations must preserve tenant boundaries and release-control records.",
    "Raw learner audio and transcripts stay out of core storage.",
    "Hosted and local implementations must use the same record vocabulary.",
    "Launch-session migrations must preserve teacher settings snapshots and event acceptance gates before accepting student events.",
    "Hosted and local event stores must require a passed event acceptance gate and preserve event effect taxonomy.",
    "Teacher report packages must preserve event acceptance summaries, learning-evidence, support-only, and excluded-sensitive-field boundaries.",
    "Publisher maintenance changes must pass release review before active package mutation.",
    "Local companion handoff records must block offline-ready claims until required artifacts are complete.",
    "Local companion release gate records must block closed handoff until installer, update, backup, export, media rights, QR fallback, game/audio reporting, and school policy requirements are complete.",
    "Every migration candidate needs rollback or export expectations before implementation.",
  ],
};
