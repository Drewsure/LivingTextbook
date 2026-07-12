export type BackendSchemaEntityStatus = "draft" | "required-before-pilot" | "policy-required";
export type BackendSchemaDeploymentFit = "hosted" | "local" | "hybrid";

export interface BackendSchemaField {
  name: string;
  type: string;
  required: boolean;
  note: string;
}

export interface BackendSchemaEntity {
  entityId: string;
  label: string;
  status: BackendSchemaEntityStatus;
  deploymentFit: BackendSchemaDeploymentFit;
  purpose: string;
  fields: BackendSchemaField[];
  relationships: string[];
  indexes: string[];
  forbiddenFields: string[];
  migrationNote: string;
}

export interface BackendSchemaDraft {
  draftId: string;
  label: string;
  summary: string;
  decisionRule: string;
  entities: BackendSchemaEntity[];
  crossCuttingRules: string[];
}

export const sampleBackendSchemaDraft: BackendSchemaDraft = {
  draftId: "first-pilot-vendor-neutral-schema",
  label: "First pilot vendor-neutral schema draft",
  summary:
    "This draft names the storage shapes the first real pilot must support without choosing Supabase, Firebase, SQLite, Postgres, or a custom local store. It is a comparison tool for backend decisions, not a migration file yet.",
  decisionRule:
    "A backend candidate is not pilot-suitable unless it can store these records, enforce tenant boundaries, preserve release control, support teacher reports, and keep raw learner audio and transcripts out of core storage.",
  entities: [
    {
      entityId: "tenant",
      label: "Tenant",
      status: "required-before-pilot",
      deploymentFit: "hybrid",
      purpose: "Owns brand, feature entitlements, assist-language rules, deployment profile, and package namespaces.",
      fields: [
        { name: "tenant_id", type: "stable id", required: true, note: "Primary tenant boundary for every record." },
        { name: "display_name", type: "string", required: true, note: "Shown in admin and student surfaces." },
        { name: "brand_tokens", type: "json/object", required: true, note: "Colors, names, and visual rules stay configurable." },
        { name: "feature_entitlements", type: "json/object", required: true, note: "AI Tutor, microphone scoring, exports, and premium features stay tenant-gated." },
      ],
      relationships: ["Has many package releases", "Has many route aliases", "Has many deployment profiles"],
      indexes: ["tenant_id unique"],
      forbiddenFields: ["MiniStar-only mascot assumptions", "Hard-coded language assumptions"],
      migrationNote: "Can begin in source control, but partner self-maintenance needs durable admin records.",
    },
    {
      entityId: "package_release",
      label: "Package release",
      status: "required-before-pilot",
      deploymentFit: "hybrid",
      purpose: "Stores reviewed textbook unit packages, edition/version metadata, launch payload references, and active QR release state.",
      fields: [
        { name: "package_id", type: "stable id", required: true, note: "Stable across release status changes." },
        { name: "tenant_id", type: "foreign key/string", required: true, note: "Belongs to one tenant." },
        { name: "edition", type: "string", required: true, note: "Supports yearly textbook maintenance." },
        { name: "version", type: "semver/string", required: true, note: "Supports rollback and old printed QR behavior." },
        { name: "review_status", type: "enum", required: true, note: "Draft, reviewed, demo-ready, pilot-publishable, archived." },
      ],
      relationships: ["Belongs to tenant", "Has many unit payloads", "Has one publish gate", "Has one approval ledger"],
      indexes: ["tenant_id + package_id", "tenant_id + edition + version", "tenant_id + review_status"],
      forbiddenFields: ["Raw PDF as student-facing content", "Unreviewed AI output as active payload"],
      migrationNote: "First migration should keep content payload blobs separate from release metadata if records grow large.",
    },
    {
      entityId: "teacher_draft_package",
      label: "Teacher draft package",
      status: "required-before-pilot",
      deploymentFit: "hybrid",
      purpose:
        "Stores teacher-owned draft packages, source lineage, visibility, draft payloads, requested activity paths, audio plans, and review gates before student assignment.",
      fields: [
        { name: "draft_id", type: "stable id", required: true, note: "One teacher-owned draft package." },
        { name: "tenant_id", type: "foreign key/string", required: true, note: "Tenant boundary for draft visibility and package lineage." },
        { name: "owner_teacher_id", type: "role/id", required: true, note: "Teacher or staff owner. Real auth required before production writes." },
        { name: "source_package_id", type: "foreign key/string", required: true, note: "Reviewed package or source intake record copied from." },
        { name: "visibility", type: "enum", required: true, note: "Private teacher draft, tenant review, returned, approved, or archived." },
        { name: "draft_payload", type: "json/object", required: true, note: "Reviewed shape only; not raw PDF, not direct AI output." },
        { name: "requested_activity_path", type: "json/string array", required: true, note: "Teacher-selected modes pending compatibility and audio checks." },
        { name: "review_gates", type: "json/object", required: true, note: "Schema, audio, route, rights, version, and approval gate state." },
        { name: "can_assign_to_students", type: "boolean", required: true, note: "False until review gates and approval ledger pass." },
      ],
      relationships: ["Belongs to tenant", "Belongs to teacher owner", "References source package", "May become package release after approval"],
      indexes: ["tenant_id + owner_teacher_id", "tenant_id + visibility", "source_package_id", "tenant_id + can_assign_to_students"],
      forbiddenFields: ["Direct draft assignment", "Direct AI publish", "Raw PDF as draft payload", "Raw learner audio", "Learner transcript"],
      migrationNote:
        "Draft package records are authoring records, not student payloads. They must preserve source lineage and block assignment until review gates pass.",
    },
    {
      entityId: "package_game_audio_coverage",
      label: "Package game/audio coverage",
      status: "required-before-pilot",
      deploymentFit: "hybrid",
      purpose:
        "Stores the reviewed snapshot of assigned game modes, audio-covered modes, cue source summaries, and unresolved audio gaps for each package release.",
      fields: [
        { name: "coverage_id", type: "stable id", required: true, note: "One reviewed coverage snapshot per package release." },
        { name: "tenant_id", type: "foreign key/string", required: true, note: "Tenant boundary for coverage records." },
        { name: "package_id", type: "foreign key/string", required: true, note: "Release candidate being checked." },
        { name: "assigned_game_modes", type: "string array/json", required: true, note: "Modes the package promises to route or unlock." },
        { name: "audio_covered_game_modes", type: "string array/json", required: true, note: "Modes with reviewed text/audio support." },
        { name: "audio_gap_count", type: "integer", required: true, note: "Blocks pilot publish when required game audio coverage is missing." },
      ],
      relationships: ["Belongs to tenant", "Belongs to package release", "Feeds package publish gate", "Feeds local bundle manifest"],
      indexes: ["package_id unique", "tenant_id + package_id", "tenant_id + audio_gap_count"],
      forbiddenFields: ["Raw audio blobs", "Learner recordings", "Transcript text", "Unreviewed generated cue output"],
      migrationNote:
        "This is release metadata only; actual audio files stay in media manifests, hosted object storage, or local bundles.",
    },
    {
      entityId: "route_alias",
      label: "Route alias and QR registry",
      status: "required-before-pilot",
      deploymentFit: "hybrid",
      purpose: "Keeps printed QR codes and front-door entry codes stable across package updates, hosted routes, and local fallbacks.",
      fields: [
        { name: "alias_id", type: "stable id", required: true, note: "Permanent lookup key for printed QR codes." },
        { name: "tenant_id", type: "foreign key/string", required: true, note: "Prevents cross-tenant route leakage." },
        { name: "target_package_id", type: "foreign key/string", required: true, note: "Current release target." },
        { name: "fallback_target", type: "string/json", required: false, note: "Local or archived fallback route." },
        { name: "active", type: "boolean", required: true, note: "Allows safe retirement without breaking audit." },
      ],
      relationships: ["Belongs to tenant", "Points to package release", "May point to local fallback manifest"],
      indexes: ["alias_id unique", "tenant_id + alias_id", "tenant_id + active"],
      forbiddenFields: ["localhost QR targets", "Direct media file QR targets"],
      migrationNote: "Should be available before printed partner materials are generated.",
    },
    {
      entityId: "media_manifest",
      label: "Media manifest and rights",
      status: "required-before-pilot",
      deploymentFit: "hybrid",
      purpose: "Tracks audio, video, posters, playlists, background media, rights, hosted paths, and local bundle paths.",
      fields: [
        { name: "media_id", type: "stable id", required: true, note: "Stable reference from unit packages and games." },
        { name: "tenant_id", type: "foreign key/string", required: true, note: "Media belongs to a tenant or publisher." },
        { name: "rights_status", type: "enum", required: true, note: "Unknown media cannot be pilot-publishable." },
        { name: "hosted_path", type: "string", required: false, note: "Object storage or CDN reference." },
        { name: "local_bundle_path", type: "string", required: false, note: "Closed deployment fallback." },
      ],
      relationships: ["Belongs to tenant", "Referenced by package releases", "Referenced by publish gates"],
      indexes: ["tenant_id + media_id", "tenant_id + rights_status"],
      forbiddenFields: ["Anonymous ownership", "Unversioned replacement files"],
      migrationNote: "Large binary files stay in object storage or local bundles; database stores manifest and rights metadata only.",
    },
    {
      entityId: "launch_session",
      label: "Teacher launch session",
      status: "policy-required",
      deploymentFit: "hybrid",
      purpose: "Stores teacher-created classroom sessions, entry codes, settings snapshot, event acceptance gate, microphone approval, support-language visibility, and report controls.",
      fields: [
        { name: "session_id", type: "stable id", required: true, note: "Session boundary for events and reports." },
        { name: "tenant_id", type: "foreign key/string", required: true, note: "Tenant boundary." },
        { name: "package_id", type: "foreign key/string", required: true, note: "Assigned package release." },
        { name: "teacher_code", type: "string", required: true, note: "Teacher/front-door entry control." },
        { name: "settings_snapshot", type: "json/object", required: true, note: "Audio, assist language, microphone, AI Tutor, background media, Training Academy, retention, and report export settings." },
        { name: "assist_language_teacher_enablement_persisted", type: "boolean", required: true, note: "Derived from settings snapshot; true only when the teacher's support-language on/off choice is durable for student devices." },
        { name: "settings_validation", type: "json/object", required: true, note: "Safety errors, persistence warnings, control warnings, and report export blockers at the time the settings were accepted." },
        { name: "event_acceptance_gate", type: "json/object", required: true, note: "Gate items, status, evidence, and next actions that decide whether live student event storage is allowed." },
        { name: "live_event_storage_allowed", type: "boolean", required: true, note: "Derived from event acceptance gate status, not manually toggled." },
        { name: "settings_revision", type: "string", required: true, note: "Version of the teacher settings contract used for audit and rollback." },
      ],
      relationships: ["Belongs to tenant", "Belongs to package release", "Has many event records", "Has report export policy"],
      indexes: ["session_id unique", "tenant_id + teacher_code", "tenant_id + package_id", "settings_revision", "tenant_id + live_event_storage_allowed"],
      forbiddenFields: ["Raw learner audio", "Learner transcript", "Ungated AI Tutor setting", "Support-language mastery override", "Manual live-event-storage override"],
      migrationNote: "Policy and role access are required before live classroom storage. The settings snapshot and event acceptance gate must preserve non-scoring support-language, assist-language teacher enablement, background-media, and route-guidance flags.",
    },
    {
      entityId: "progress_event",
      label: "Progress and media event",
      status: "policy-required",
      deploymentFit: "hybrid",
      purpose: "Stores coded learning events, game completion, media engagement, recovery recommendations, Star Dust changes, mastery updates, and support-only guidance events.",
      fields: [
        { name: "event_id", type: "stable id", required: true, note: "Unique event id." },
        { name: "session_id", type: "foreign key/string", required: true, note: "Links event to teacher session." },
        { name: "learner_code", type: "coded string", required: true, note: "Avoids open personal data in foundation reports." },
        { name: "event_type", type: "enum", required: true, note: "Game, media, training, reward, summary." },
        { name: "event_effect", type: "enum", required: true, note: "progress-affecting, report-only, or support-only; prevents guidance/support events from becoming mastery." },
        { name: "taxonomy_version", type: "string", required: true, note: "Version of the reviewed event taxonomy used when the event was accepted." },
        { name: "event_acceptance_gate_id", type: "foreign key/string", required: true, note: "Links the event write to the launch-session gate that allowed live event storage." },
        { name: "metadata", type: "json/object", required: true, note: "Mode-specific details without raw audio/transcripts." },
      ],
      relationships: ["Belongs to launch session", "Aggregates into teacher reports", "May reference package/unit/game ids"],
      indexes: ["session_id + created_at", "session_id + learner_code", "session_id + event_type", "session_id + event_effect", "session_id + event_acceptance_gate_id"],
      forbiddenFields: ["Raw learner audio", "Speech transcript", "Unbounded personal notes", "Manual event acceptance bypass"],
      migrationNote: "Event retention and export policy must be accepted before real student use; event writes must reference a passed launch-session event acceptance gate, and support-only events must remain non-scoring in report queries.",
    },
    {
      entityId: "collection_inventory",
      label: "Earned collection inventory",
      status: "policy-required",
      deploymentFit: "hybrid",
      purpose:
        "Stores learner-owned reward items, avatar/room/cosmetic/title ownership, companion evolution status, and unlock provenance from accepted mastery or completion events.",
      fields: [
        { name: "collection_item_id", type: "stable id", required: true, note: "One owned collection item or evolution state snapshot." },
        { name: "tenant_id", type: "foreign key/string", required: true, note: "Tenant boundary for reward catalogs and learner ownership." },
        { name: "session_id", type: "foreign key/string", required: true, note: "Launch session or classroom context where the item was earned." },
        { name: "learner_code", type: "coded string", required: true, note: "Uses the same identity-light classroom code strategy as progress events." },
        { name: "reward_id", type: "string", required: true, note: "References a reviewed reward catalog entry." },
        { name: "reward_kind", type: "enum", required: true, note: "Badge, title, cosmetic, room item, companion evolution, palette, or power-up." },
        { name: "unlock_source_event_id", type: "foreign key/string", required: true, note: "Accepted mastery/completion/progress event that created ownership." },
        { name: "mastery_rule_snapshot", type: "json/object", required: true, note: "Deterministic rule that made the item earnable. No random seed or purchase state." },
        { name: "earned_at", type: "datetime", required: true, note: "Time the item became owned." },
        { name: "ownership_status", type: "enum", required: true, note: "Owned, revoked-by-policy, archived, or migrated." },
      ],
      relationships: ["Belongs to tenant", "Belongs to launch session", "References progress event", "References reward catalog"],
      indexes: ["tenant_id + learner_code", "session_id + learner_code", "reward_id", "unlock_source_event_id unique"],
      forbiddenFields: ["Random reward seed", "Paid gacha state", "Purchase pressure flag", "Raw learner audio", "Learner transcript"],
      migrationNote:
        "Collection ownership must be derived from accepted learning events. Hosted and local implementations must block random-pressure or purchase-like reward mechanics from creating ownership.",
    },
    {
      entityId: "teacher_report_package",
      label: "Teacher report package boundary",
      status: "policy-required",
      deploymentFit: "hybrid",
      purpose:
        "Stores the policy-bound report package summary that separates learning evidence, support-only signals, excluded sensitive fields, and export blockers before teacher export.",
      fields: [
        { name: "report_package_id", type: "stable id", required: true, note: "One report package boundary per launch session or export snapshot." },
        { name: "tenant_id", type: "foreign key/string", required: true, note: "Tenant boundary for report access." },
        { name: "session_id", type: "foreign key/string", required: true, note: "Teacher launch session being summarized." },
        { name: "event_acceptance_summary", type: "json/object", required: true, note: "Gate status, blocked/warning counts, and decision used when the report package was generated." },
        { name: "included_evidence", type: "json/string array", required: true, note: "Reviewed learning evidence included in the report." },
        { name: "support_only_signals", type: "json/string array", required: true, note: "Support-language, media, background audio, and guidance signals with no mastery effect." },
        { name: "excluded_sensitive_fields", type: "json/string array", required: true, note: "Raw audio, transcripts, AI Tutor chat, private identifiers, and unreviewed notes stay outside core export." },
        { name: "export_blockers", type: "json/string array", required: true, note: "Policy, persistence, retention, access, and format gates still blocking export." },
      ],
      relationships: ["Belongs to launch session", "Summarizes progress events", "Uses report export policy"],
      indexes: ["session_id unique", "tenant_id + session_id", "tenant_id + event_acceptance_summary", "tenant_id + export_blockers"],
      forbiddenFields: ["Raw learner audio", "Learner transcripts", "Open-ended AI Tutor chat", "Support-only events used as mastery"],
      migrationNote:
        "Report packages are export boundaries, not raw data dumps. Hosted and local implementations must preserve event acceptance status, support-only event semantics, and exclusion rules.",
    },
    {
      entityId: "package_release_candidate",
      label: "Package release candidate",
      status: "required-before-pilot",
      deploymentFit: "hybrid",
      purpose:
        "Stores the backend-agnostic release summary that joins publish-gate blockers and approval-ledger blockers before a package can be called pilot-ready.",
      fields: [
        { name: "candidate_id", type: "stable id", required: true, note: "One release candidate status per package/version under review." },
        { name: "tenant_id", type: "foreign key/string", required: true, note: "Tenant boundary for release-control state." },
        { name: "package_id", type: "foreign key/string", required: true, note: "Reviewed package under release review." },
        { name: "target_pilot_route", type: "string", required: true, note: "Route used for controlled demo or pilot launch." },
        { name: "open_gate_count", type: "integer", required: true, note: "Must be zero before pilot-ready status." },
        { name: "open_approval_count", type: "integer", required: true, note: "Must be zero before pilot-ready status." },
        { name: "pilot_ready", type: "boolean", required: true, note: "Derived from gate and ledger status, not manually toggled." },
      ],
      relationships: ["Belongs to package release", "Summarizes package publish gate", "Summarizes package approval ledger"],
      indexes: ["package_id unique", "tenant_id + package_id", "tenant_id + pilot_ready"],
      forbiddenFields: ["Manual pilot-ready override", "Fake signed approval", "Chat-only evidence"],
      migrationNote:
        "This record should be computed or validated from publish gate and ledger records so demo-visible routes cannot be mistaken for live pilot release.",
    },
    {
      entityId: "publisher_maintenance_change",
      label: "Publisher maintenance change request",
      status: "required-before-pilot",
      deploymentFit: "hybrid",
      purpose:
        "Stores reviewed year-on-year content, media, game, QR, and report update requests before they can affect a package release.",
      fields: [
        { name: "change_request_id", type: "stable id", required: true, note: "One requested maintenance change." },
        { name: "tenant_id", type: "foreign key/string", required: true, note: "Tenant or publisher owner." },
        { name: "package_id", type: "foreign key/string", required: true, note: "Package or release candidate affected by the change." },
        { name: "target_edition", type: "string", required: true, note: "Edition or refresh window the change belongs to." },
        { name: "domain", type: "enum", required: true, note: "Content, media, games, routes, or reports." },
        { name: "status", type: "enum", required: true, note: "Draft, review-required, blocked, or ready-for-release." },
        { name: "route_impact", type: "enum", required: true, note: "None, alias-preserved, or requires-redirect." },
        { name: "required_approvals", type: "json/string array", required: true, note: "Approvals required before release." },
        { name: "blocked_by", type: "json/string array", required: true, note: "Open blockers preventing release." },
      ],
      relationships: ["Belongs to tenant", "Belongs to package release", "May reference media manifest, route alias, game offer map, or report package"],
      indexes: ["tenant_id + package_id", "tenant_id + target_edition", "tenant_id + status", "tenant_id + domain"],
      forbiddenFields: ["Direct binary media replacement", "Silent QR retargeting", "Unreviewed game activation", "Report export policy override"],
      migrationNote:
        "Maintenance changes are review records. They must not mutate active package routes or media manifests until release gates and approvals accept them.",
    },
    {
      entityId: "local_companion_handoff",
      label: "Local companion handoff checklist",
      status: "required-before-pilot",
      deploymentFit: "hybrid",
      purpose:
        "Stores the checklist of source, media rights, checksum, route fallback, and local report-policy artifacts required before a closed companion package is offline-ready.",
      fields: [
        { name: "handoff_id", type: "stable id", required: true, note: "One handoff checklist for a bundle/package candidate." },
        { name: "tenant_id", type: "foreign key/string", required: true, note: "Tenant or publisher owner." },
        { name: "bundle_id", type: "string", required: true, note: "Local bundle manifest this handoff belongs to." },
        { name: "package_id", type: "foreign key/string", required: true, note: "Package release or candidate under review." },
        { name: "items", type: "json/child records", required: true, note: "Owner, artifact, status, blocker, and next action for each handoff item." },
        { name: "blocked_count", type: "integer", required: true, note: "Must be zero before offline-ready status." },
        { name: "offline_ready_allowed", type: "boolean", required: true, note: "Derived from blocked count, media rights, checksums, route fallback, and report policy." },
      ],
      relationships: ["Belongs to tenant", "Belongs to package release", "References local bundle manifest", "Feeds local deployment preflight"],
      indexes: ["bundle_id unique", "tenant_id + package_id", "tenant_id + offline_ready_allowed"],
      forbiddenFields: ["Raw media binaries", "Raw learner audio", "Learner transcripts", "Manual offline-ready override"],
      migrationNote:
        "Handoff records should be exported with local bundles and must not mark packages offline-ready while required artifacts are missing.",
    },
    {
      entityId: "local_companion_release_gate",
      label: "Local companion release gate",
      status: "required-before-pilot",
      deploymentFit: "hybrid",
      purpose:
        "Stores the release decision that blocks closed local companion handoff until installer/update, media rights, backup/export, QR fallback, game audio/reporting, and school access/privacy gates are resolved.",
      fields: [
        { name: "release_gate_id", type: "stable id", required: true, note: "One release gate snapshot for a local bundle/package candidate." },
        { name: "tenant_id", type: "foreign key/string", required: true, note: "Tenant or publisher owner." },
        { name: "bundle_id", type: "string", required: true, note: "Local bundle manifest this gate belongs to." },
        { name: "package_id", type: "foreign key/string", required: true, note: "Package release or candidate under review." },
        { name: "decision", type: "enum/string", required: true, note: "Previewable only, blocked, ready for controlled handoff, or archived." },
        { name: "gate_items", type: "json/child records", required: true, note: "Owner, status, evidence, blocker, and next action for each local release gate item." },
        { name: "blocked_count", type: "integer", required: true, note: "Must be zero before controlled closed handoff." },
        { name: "closed_handoff_allowed", type: "boolean", required: true, note: "Derived from blocked count, installer/update, media rights, backup/export, QR fallback, and school policy." },
      ],
      relationships: ["Belongs to tenant", "Belongs to package release", "References local companion handoff", "Feeds package publish gate"],
      indexes: ["bundle_id unique", "tenant_id + package_id", "tenant_id + closed_handoff_allowed", "tenant_id + blocked_count"],
      forbiddenFields: ["Raw media binaries", "Raw learner audio", "Learner transcripts", "Manual closed-handoff override"],
      migrationNote:
        "Release gate records should be exported with local bundle manifests and must remain blocked while installer/update, backup/export, media rights, QR fallback, or school policy blockers are open.",
    },
    {
      entityId: "package_publish_gate",
      label: "Package publish gate",
      status: "required-before-pilot",
      deploymentFit: "hybrid",
      purpose: "Stores release-blocking gate status so a tenant package cannot be marked pilot-publishable while blockers remain open.",
      fields: [
        { name: "gate_id", type: "stable id", required: true, note: "One gate per release candidate." },
        { name: "package_id", type: "foreign key/string", required: true, note: "Release candidate under review." },
        { name: "gate_items", type: "json/child records", required: true, note: "Content, media, games, QR, reports, policy, deployment, persistence." },
        { name: "overall_status", type: "enum", required: true, note: "Demo-ready, review-open, blocked, pilot-publishable." },
      ],
      relationships: ["Belongs to package release", "Feeds package release candidate", "References media manifest", "References approval ledger"],
      indexes: ["package_id unique", "overall_status", "package_id + overall_status"],
      forbiddenFields: ["Pilot-publishable status while blockers are open", "Evidence only in chat history"],
      migrationNote: "Must be writable before any admin can change release status for a real tenant package.",
    },
    {
      entityId: "package_approval_ledger",
      label: "Package approval ledger",
      status: "policy-required",
      deploymentFit: "hybrid",
      purpose: "Stores required sign-offs for content, media, game QA, QR stability, privacy/report policy, deployment, and platform release review.",
      fields: [
        { name: "ledger_id", type: "stable id", required: true, note: "One ledger per release candidate." },
        { name: "package_id", type: "foreign key/string", required: true, note: "Release candidate under approval." },
        { name: "signoffs", type: "json/child records", required: true, note: "Role, owner, status, evidence, blockers." },
        { name: "approver_identity", type: "role/id", required: false, note: "Required only when real authentication exists." },
        { name: "signed_at", type: "timestamp", required: false, note: "Required only for real signed approval records." },
      ],
      relationships: ["Belongs to package release", "Feeds package publish gate", "References evidence files or policy records"],
      indexes: ["package_id unique", "package_id + signoff status", "approver_identity + signed_at"],
      forbiddenFields: ["Fake signed approvals", "Unowned media sign-off", "Policy override without evidence"],
      migrationNote: "Real signatures require authentication, timestamp, evidence, and export/rollback policy.",
    },
  ],
  crossCuttingRules: [
    "Every record belongs to a tenant or to a tenant-owned package release.",
    "Teacher drafts must preserve owner, source lineage, review gates, and direct-assignment blocks before they can become package releases.",
    "Raw learner audio and transcripts stay out of core schema.",
    "Media files live in object storage or local bundles; schema stores manifests and rights metadata.",
    "Package game/audio coverage stores release metadata only, not raw audio files or learner recordings.",
    "Progress events must preserve event_effect and reference a passed event acceptance gate so support-only activity never becomes mastery evidence and live writes cannot bypass teacher/session policy.",
    "Collection inventory must be earned from accepted mastery or completion events; random pressure loops and paid gacha-like ownership are not storage paths.",
    "Launch sessions must preserve teacher settings snapshots and event acceptance gates so support-language teacher enablement, microphone, background-media, AI Tutor, Training Academy, reporting, and live-event-write controls are auditable.",
    "Teacher report packages must preserve event acceptance summaries, learning-evidence, support-only, and excluded-sensitive-field boundaries before export.",
    "Publisher maintenance changes must be reviewed before they alter routes, media manifests, game offers, or report packages.",
    "Local companion handoff records must block offline-ready status until source, media rights, checksums, routes, and report policy are accepted.",
    "Local companion release gates must block closed handoff until installer, update, backup, export, QR fallback, media rights, game audio/reporting, and school access policies are accepted.",
    "Support language never unlocks target-language progression.",
    "AI Tutor and speech scoring stay premium-gated and disabled unless tenant policy accepts them.",
    "Local and hosted implementations must preserve the same record vocabulary.",
  ],
};
