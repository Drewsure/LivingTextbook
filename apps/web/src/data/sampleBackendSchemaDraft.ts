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
      purpose: "Stores teacher-created classroom sessions, entry codes, settings, microphone approval, support-language visibility, and report controls.",
      fields: [
        { name: "session_id", type: "stable id", required: true, note: "Session boundary for events and reports." },
        { name: "tenant_id", type: "foreign key/string", required: true, note: "Tenant boundary." },
        { name: "package_id", type: "foreign key/string", required: true, note: "Assigned package release." },
        { name: "teacher_code", type: "string", required: true, note: "Teacher/front-door entry control." },
        { name: "settings", type: "json/object", required: true, note: "Audio, assist language, microphone, AI Tutor, background media, retention, report export." },
      ],
      relationships: ["Belongs to tenant", "Belongs to package release", "Has many event records", "Has report export policy"],
      indexes: ["session_id unique", "tenant_id + teacher_code", "tenant_id + package_id"],
      forbiddenFields: ["Raw learner audio", "Learner transcript", "Ungated AI Tutor setting"],
      migrationNote: "Policy and role access are required before live classroom storage.",
    },
    {
      entityId: "progress_event",
      label: "Progress and media event",
      status: "policy-required",
      deploymentFit: "hybrid",
      purpose: "Stores coded learning events, game completion, media engagement, recovery recommendations, Star Dust changes, and mastery updates.",
      fields: [
        { name: "event_id", type: "stable id", required: true, note: "Unique event id." },
        { name: "session_id", type: "foreign key/string", required: true, note: "Links event to teacher session." },
        { name: "learner_code", type: "coded string", required: true, note: "Avoids open personal data in foundation reports." },
        { name: "event_type", type: "enum", required: true, note: "Game, media, training, reward, summary." },
        { name: "metadata", type: "json/object", required: true, note: "Mode-specific details without raw audio/transcripts." },
      ],
      relationships: ["Belongs to launch session", "Aggregates into teacher reports", "May reference package/unit/game ids"],
      indexes: ["session_id + created_at", "session_id + learner_code", "session_id + event_type"],
      forbiddenFields: ["Raw learner audio", "Speech transcript", "Unbounded personal notes"],
      migrationNote: "Event retention and export policy must be accepted before real student use.",
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
      relationships: ["Belongs to package release", "References media manifest", "References approval ledger"],
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
    "Raw learner audio and transcripts stay out of core schema.",
    "Media files live in object storage or local bundles; schema stores manifests and rights metadata.",
    "Package game/audio coverage stores release metadata only, not raw audio files or learner recordings.",
    "Support language never unlocks target-language progression.",
    "AI Tutor and speech scoring stay premium-gated and disabled unless tenant policy accepts them.",
    "Local and hosted implementations must preserve the same record vocabulary.",
  ],
};
