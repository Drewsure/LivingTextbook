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
      specId: "spec-package-release-candidate",
      label: "Package release candidate status",
      candidateId: "m005-publish-gate-and-approval-ledger",
      storeKind: "release-record",
      status: "ready-for-review",
      purpose:
        "Stores the computed release-candidate status that joins package publish gate blockers and approval ledger blockers before a package can be called pilot-ready.",
      primaryKey: "release_candidate_id",
      tenantScope: "Scoped by tenant_id, package_release_id, package_id, and release_version.",
      fields: [
        {
          name: "release_candidate_id",
          type: "string",
          required: true,
          note: "Stable id for one package/version under pilot release review.",
        },
        {
          name: "package_release_id",
          type: "string",
          required: true,
          note: "Links candidate status to the reviewed package release.",
        },
        {
          name: "target_pilot_route",
          type: "string",
          required: true,
          note: "Controlled route shown in demos or pilot launch review.",
        },
        {
          name: "open_gate_count",
          type: "integer",
          required: true,
          note: "Derived from release-blocking publish gate items.",
        },
        {
          name: "open_approval_count",
          type: "integer",
          required: true,
          note: "Derived from required approval ledger sign-offs.",
        },
        {
          name: "pilot_ready",
          type: "boolean",
          required: true,
          note: "Must be false unless open gate and approval counts are zero.",
        },
      ],
      indexes: ["tenant_id + package_release_id", "package_release_id unique", "tenant_id + pilot_ready"],
      retentionRule: "Retain with the package release while any demo route, pilot launch, QR alias, or local bundle references it.",
      exportRule: "Must export with release-control records for hosted and local deployment audit.",
      localFallback: "Local classroom bundle stores the same candidate status beside publish gate and approval ledger records.",
      policyBlockers: [
        "Pilot-ready status cannot be manually overridden.",
        "Real approval identity and evidence policy are required before a candidate can move beyond demo-ready.",
      ],
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
    {
      specId: "spec-teacher-report-package",
      label: "Teacher report package boundary",
      candidateId: "m009-teacher-report-package-boundary",
      storeKind: "session-record",
      status: "blocked-by-policy",
      purpose:
        "Stores a policy-bound report package snapshot for one teacher launch session without turning raw events into an ungated data export.",
      primaryKey: "report_package_id",
      tenantScope: "Scoped by tenant_id, launch_session_id, package_release_id, and report_policy_revision.",
      fields: [
        {
          name: "report_package_id",
          type: "string",
          required: true,
          note: "Stable id for one report package snapshot.",
        },
        {
          name: "launch_session_id",
          type: "string",
          required: true,
          note: "Links report package to the teacher session.",
        },
        {
          name: "included_evidence",
          type: "json",
          required: true,
          note: "Learning evidence allowed in the teacher report, such as target-language attempts, completion, mastery, recovery, and score summaries.",
        },
        {
          name: "support_only_signals",
          type: "json",
          required: true,
          note: "Support-language, media, background audio, and route guidance events that may be reported but never scored.",
        },
        {
          name: "excluded_sensitive_fields",
          type: "json",
          required: true,
          note: "Raw audio, transcripts, open-ended AI Tutor chat, unreviewed notes, and private identifiers excluded from core export.",
        },
        {
          name: "export_blockers",
          type: "json",
          required: true,
          note: "Open policy, persistence, retention, access, or format blockers.",
        },
        {
          name: "report_policy_revision",
          type: "string",
          required: true,
          note: "Policy version used when the package was generated or previewed.",
        },
      ],
      indexes: ["tenant_id + launch_session_id", "launch_session_id unique", "report_policy_revision", "export_blockers contains"],
      retentionRule: "Retain only according to school reporting policy; demo previews are not production records.",
      exportRule: "Export only after policy permits teacher report export. CSV/PDF summaries must preserve support-only and excluded-field labels.",
      localFallback: "Local classroom deployments store the same report package JSON beside local progress export packages.",
      policyBlockers: [
        "Teacher access roles, retention length, export audit, and parent/school visibility must be accepted before production writes.",
        "Support-only events must remain excluded from mastery, Star Dust, and unlock calculations in every exported format.",
      ],
    },
    {
      specId: "spec-publisher-maintenance-change",
      label: "Publisher maintenance change request",
      candidateId: "m010-publisher-maintenance-change-requests",
      storeKind: "release-record",
      status: "ready-for-review",
      purpose:
        "Stores publisher-owned yearly maintenance change requests before they can affect active content, media, routes, games, or reports.",
      primaryKey: "change_request_id",
      tenantScope: "Scoped by tenant_id, package_release_id, package_id, target_edition, and change_request_id.",
      fields: [
        {
          name: "change_request_id",
          type: "string",
          required: true,
          note: "Stable id for one maintenance change request.",
        },
        {
          name: "target_edition",
          type: "string",
          required: true,
          note: "Edition, pilot refresh, or annual package this change targets.",
        },
        {
          name: "domain",
          type: "string enum",
          required: true,
          note: "Content, media, games, routes, or reports.",
        },
        {
          name: "status",
          type: "string enum",
          required: true,
          note: "Draft, review-required, blocked, or ready-for-release.",
        },
        {
          name: "route_impact",
          type: "string enum",
          required: true,
          note: "None, alias-preserved, or requires-redirect.",
        },
        {
          name: "impact_summary",
          type: "json",
          required: true,
          note: "Media, game, and report impact summary. No raw media binary.",
        },
        {
          name: "required_approvals",
          type: "string[]",
          required: true,
          note: "Approval domains required before release.",
        },
        {
          name: "blocked_by",
          type: "string[]",
          required: true,
          note: "Open blockers that prevent release.",
        },
      ],
      indexes: ["tenant_id + package_release_id", "tenant_id + target_edition", "tenant_id + status", "domain + status"],
      retentionRule: "Retain with the package release history while any QR alias, local bundle, report package, or active edition references the release.",
      exportRule: "Must export with release-control records for partner audit and local bundle handoff.",
      localFallback: "Local classroom bundles store the same change request JSON beside release candidate and package manifest records.",
      policyBlockers: [
        "Media rights, QR fallback, rollback, and report policy must be accepted before release-affecting changes are applied.",
        "Change requests cannot directly mutate active routes, media manifests, game offers, or teacher reports.",
      ],
    },
    {
      specId: "spec-local-companion-handoff",
      label: "Local companion handoff checklist",
      candidateId: "m011-local-companion-handoff-records",
      storeKind: "release-record",
      status: "ready-for-review",
      purpose:
        "Stores closed/local companion package handoff checklist state before package export, installer packaging, or local classroom server release.",
      primaryKey: "handoff_id",
      tenantScope: "Scoped by tenant_id, package_release_id, bundle_id, and handoff_revision.",
      fields: [
        {
          name: "handoff_id",
          type: "string",
          required: true,
          note: "Stable id for one handoff checklist snapshot.",
        },
        {
          name: "bundle_id",
          type: "string",
          required: true,
          note: "Local bundle manifest this checklist belongs to.",
        },
        {
          name: "handoff_items",
          type: "json",
          required: true,
          note: "Owner, artifact, status, blocker, and next action for each handoff requirement.",
        },
        {
          name: "blocked_count",
          type: "integer",
          required: true,
          note: "Open blockers preventing offline-ready release.",
        },
        {
          name: "offline_ready_allowed",
          type: "boolean",
          required: true,
          note: "Derived from blocked count, rights proof, checksums, route fallback, and report policy.",
        },
        {
          name: "handoff_revision",
          type: "string",
          required: true,
          note: "Version of the handoff checklist used for export and audit.",
        },
      ],
      indexes: ["tenant_id + bundle_id", "bundle_id unique", "tenant_id + offline_ready_allowed", "handoff_revision"],
      retentionRule: "Retain with the package release and local bundle history while any closed deployment or printed QR alias references it.",
      exportRule: "Must export as JSON with local bundle manifests for partner handoff, backup, and restore.",
      localFallback: "Local classroom bundles store the same checklist in the package manifest folder.",
      policyBlockers: [
        "Offline-ready status cannot be true while source, media rights, checksums, route fallback, or report policy items are blocked.",
        "Installer and local server builds must read this checklist before packaging.",
      ],
    },
  ],
};
