export type BackendMigrationSpecStatus = "draft" | "ready-for-review" | "blocked-by-policy";

export type BackendMigrationSpecStoreKind = "admin-record" | "release-record" | "session-record" | "event-record";

export interface BackendMigrationSpecField {
  name: string;
  type: string;
  required: boolean;
  note: string;
}

export interface BackendMigrationSpec {
  specId: string;
  label: string;
  candidateId: string;
  storeKind: BackendMigrationSpecStoreKind;
  status: BackendMigrationSpecStatus;
  purpose: string;
  primaryKey: string;
  tenantScope: string;
  fields: BackendMigrationSpecField[];
  indexes: string[];
  retentionRule: string;
  exportRule: string;
  localFallback: string;
  policyBlockers: string[];
}

export interface BackendMigrationSpecPlan {
  planId: string;
  label: string;
  summary: string;
  implementationRule: string;
  specs: BackendMigrationSpec[];
}

export const sampleBackendMigrationSpecPlan: BackendMigrationSpecPlan = {
  planId: "first-pilot-backend-migration-specs",
  label: "First pilot backend migration specifications",
  summary:
    "Vendor-neutral collection templates for the first backend-ready records. These are not Supabase, Firebase, or local-database migrations yet; they define the product contract those implementations must preserve.",
  implementationRule:
    "Use these specs to design migrations only after privacy, reporting, retention, export, and release-control policy are accepted. Do not store raw learner audio, raw AI tutor transcripts, or unreviewed PDF material in these pilot records.",
  specs: [
    {
      specId: "spec-tenant-entitlement",
      label: "Tenant entitlement store",
      candidateId: "m001-tenant-and-entitlements",
      storeKind: "admin-record",
      status: "ready-for-review",
      purpose:
        "Stores tenant-level feature flags, package tiers, deployment permissions, and premium options such as AI Tutor and microphone-based speaking.",
      primaryKey: "tenant_id",
      tenantScope: "One record per tenant, versioned by entitlement_revision.",
      fields: [
        {
          name: "tenant_id",
          type: "string",
          required: true,
          note: "Stable white-label tenant id used across routes, packages, and reports.",
        },
        {
          name: "enabled_features",
          type: "string[]",
          required: true,
          note: "Feature keys such as multimedia, microphone, local-export, and ai-tutor.",
        },
        {
          name: "deployment_modes",
          type: "string[]",
          required: true,
          note: "Allowed deployment choices for the tenant: hosted, local-classroom, packaged-local, or hybrid.",
        },
        {
          name: "entitlement_revision",
          type: "string",
          required: true,
          note: "Human-readable revision used for audit and rollback.",
        },
      ],
      indexes: ["tenant_id unique", "enabled_features contains", "deployment_modes contains"],
      retentionRule: "Keep until tenant contract ends, then export and archive according to written policy.",
      exportRule: "Must export as plain JSON with feature keys and revision history.",
      localFallback: "Local deployments read the same JSON shape from a signed tenant package.",
      policyBlockers: ["Actual billing tiers and premium AI usage caps remain business-policy decisions."],
    },
    {
      specId: "spec-package-release",
      label: "Package release store",
      candidateId: "m002-package-release-and-content",
      storeKind: "release-record",
      status: "ready-for-review",
      purpose:
        "Tracks reviewed textbook/game/media package releases so QR routes and teacher assignments target stable published content.",
      primaryKey: "package_release_id",
      tenantScope: "Scoped by tenant_id, package_id, and release_version.",
      fields: [
        {
          name: "package_release_id",
          type: "string",
          required: true,
          note: "Stable id for a reviewed release bundle.",
        },
        {
          name: "tenant_id",
          type: "string",
          required: true,
          note: "Owner tenant; prevents cross-tenant content leakage.",
        },
        {
          name: "release_version",
          type: "string",
          required: true,
          note: "Version shown to teachers and support staff.",
        },
        {
          name: "content_manifest_uri",
          type: "string",
          required: true,
          note: "Pointer to the reviewed content manifest, not raw source files.",
        },
      ],
      indexes: ["tenant_id + release_version", "package_release_id unique"],
      retentionRule: "Retain active and previous published releases until no active QR or class assignment references them.",
      exportRule: "Must export manifest references, approval state, and release version without requiring a specific vendor.",
      localFallback: "Local app reads the same release manifest from an offline bundle path.",
      policyBlockers: ["Source file retention and publisher contract terms must be set before production."],
    },
    {
      specId: "spec-package-game-audio-coverage",
      label: "Package game/audio coverage snapshot",
      candidateId: "m002-package-release-and-content",
      storeKind: "release-record",
      status: "ready-for-review",
      purpose:
        "Preserves the reviewed assigned game modes, audio-covered modes, cue source decisions, and package version tied to a release.",
      primaryKey: "coverage_snapshot_id",
      tenantScope: "Scoped by tenant_id, package_release_id, package_id, and release_version.",
      fields: [
        {
          name: "coverage_snapshot_id",
          type: "string",
          required: true,
          note: "Stable id for the reviewed game/audio coverage snapshot.",
        },
        {
          name: "package_release_id",
          type: "string",
          required: true,
          note: "Links coverage to the reviewed package release.",
        },
        {
          name: "assigned_game_modes",
          type: "string[]",
          required: true,
          note: "Modes the package or assignment can expose after the target-language gate.",
        },
        {
          name: "audio_covered_game_modes",
          type: "string[]",
          required: true,
          note: "Student-facing modes with explicit package-level audio coverage.",
        },
        {
          name: "cue_source_summary",
          type: "json",
          required: true,
          note: "Reviewed cue source, fallback voice, and placeholder/production status. No raw audio binary.",
        },
      ],
      indexes: ["tenant_id + package_release_id", "assigned_game_modes contains", "audio_covered_game_modes contains"],
      retentionRule: "Retain with the package release while any QR alias, teacher assignment, or local bundle references it.",
      exportRule: "Must export as JSON with package release metadata for hosted and local deployments.",
      localFallback: "Local classroom bundle ships the same coverage snapshot in the signed package manifest.",
      policyBlockers: ["Production voice/source policy and publisher audio ownership must be confirmed before pilot-publishable release."],
    },
    {
      specId: "spec-qr-alias",
      label: "Permanent QR alias store",
      candidateId: "m003-route-alias-registry",
      storeKind: "release-record",
      status: "ready-for-review",
      purpose:
        "Maps printed textbook QR aliases to stable tenant, unit, media, and game targets without embedding fragile app paths in the printed code.",
      primaryKey: "alias_id",
      tenantScope: "Scoped by tenant_id and public_alias.",
      fields: [
        {
          name: "alias_id",
          type: "string",
          required: true,
          note: "Internal stable id for support and audit.",
        },
        {
          name: "public_alias",
          type: "string",
          required: true,
          note: "Short QR-facing alias that can survive app route changes.",
        },
        {
          name: "target_kind",
          type: "string",
          required: true,
          note: "Launch, speak, training, media, playlist, or front-door target.",
        },
        {
          name: "target_payload",
          type: "json",
          required: true,
          note: "Small reviewed routing payload; no learner private data.",
        },
      ],
      indexes: ["tenant_id + public_alias unique", "target_kind"],
      retentionRule: "Treat printed aliases as long-lived. Retire by redirecting to replacement content, not deleting immediately.",
      exportRule: "Must export alias maps for local deployments and disaster recovery.",
      localFallback: "Local classroom bundle ships a route alias JSON snapshot with optional hosted redirect fallback.",
      policyBlockers: ["Partner policy needed for retired textbook editions and replacement links."],
    },
    {
      specId: "spec-progress-event",
      label: "Progress event stream",
      candidateId: "m007-progress-event-stream",
      storeKind: "event-record",
      status: "blocked-by-policy",
      purpose:
        "Stores normalized game, training, media, speaking, and support-only guidance events for teacher reports without preserving unnecessary sensitive payloads.",
      primaryKey: "event_id",
      tenantScope: "Scoped by tenant_id, launch_session_id, and anonymous/student roster id depending on school policy.",
      fields: [
        {
          name: "event_id",
          type: "string",
          required: true,
          note: "Generated id for idempotent event writes.",
        },
        {
          name: "event_type",
          type: "string",
          required: true,
          note: "Standard event vocabulary such as game_started, answer_result, media_completed, or mastery_updated.",
        },
        {
          name: "event_effect",
          type: "string enum",
          required: true,
          note: "Reviewed taxonomy effect: progress-affecting, report-only, or support-only.",
        },
        {
          name: "taxonomy_version",
          type: "string",
          required: true,
          note: "Version of the accepted event taxonomy used for aggregation and export interpretation.",
        },
        {
          name: "event_payload",
          type: "json",
          required: true,
          note: "Small sanitized event body. No raw microphone audio or unreviewed tutor transcript.",
        },
        {
          name: "occurred_at",
          type: "datetime",
          required: true,
          note: "Client event time with server received time added by implementation.",
        },
      ],
      indexes: ["tenant_id + launch_session_id + occurred_at", "event_type", "event_effect", "anonymous_or_roster_student_id"],
      retentionRule: "Retention depends on school reporting policy and parent/school agreement.",
      exportRule: "Must export teacher-readable CSV/JSON summaries and raw normalized events when policy allows.",
      localFallback: "Local app queues events in an exportable local store and syncs only if the school enables hosted reporting.",
      policyBlockers: [
        "Student identity model, retention length, guardian consent, and speech-report policy must be accepted before production writes.",
        "Report aggregation must ignore support-only events for mastery, Star Dust, and unlock calculations.",
      ],
    },
  ],
};
