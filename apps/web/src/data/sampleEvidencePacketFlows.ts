export type EvidencePacketStatus = "preview-ready" | "missing-evidence" | "blocked";

export interface EvidencePacket {
  packetId: string;
  packetKey: string;
  label: string;
  status: EvidencePacketStatus;
  ownerRole: string;
  protects: string;
  requiredEvidence: string[];
  missingEvidence: string[];
}

export interface EvidencePacketFlow {
  flowId: string;
  label: string;
  scope: string;
  summary: string;
  handoffRule: string;
  packets: EvidencePacket[];
  blockedLiveActions: string[];
}

export const sampleUploadEvidencePacketFlow: EvidencePacketFlow = {
  flowId: "upload-evidence-packet-flow",
  label: "Upload evidence packet flow",
  scope: "Teacher upload workspace",
  summary:
    "Evidence packet flow for file intake, source review, target mapping, upload review, and promotion gates before any real upload button or object/local storage write exists.",
  handoffRule:
    "No file can move from intake to review, promotion, route creation, assignment, or local bundle activation until every required evidence_packet is preserved and review-only blockers are closed.",
  packets: [
    {
      packetId: "source-lineage-evidence",
      packetKey: "source_lineage_packet",
      label: "Source lineage packet",
      status: "preview-ready",
      ownerRole: "Teacher or publisher owner",
      protects: "Confirms who owns the PDF, text, image, audio, music, video, or local bundle source.",
      requiredEvidence: ["tenant id", "source owner", "unit mapping", "revision", "checksum or source reference"],
      missingEvidence: ["production uploader identity"],
    },
    {
      packetId: "rights-proof-evidence",
      packetKey: "rights_proof_packet",
      label: "Rights proof packet",
      status: "missing-evidence",
      ownerRole: "Publisher or school admin",
      protects: "Prevents unlicensed media, images, or copied textbook content from becoming student-facing.",
      requiredEvidence: ["classroom use scope", "hosted playback scope", "print scope", "local bundle scope"],
      missingEvidence: ["signed or stored rights proof"],
    },
    {
      packetId: "scan-file-policy-evidence",
      packetKey: "scan_and_file_policy_packet",
      label: "Scan and file policy packet",
      status: "blocked",
      ownerRole: "Platform admin",
      protects: "Blocks unsafe or oversized files before upload storage and processing exist.",
      requiredEvidence: ["MIME type validation", "size limit", "checksum capture", "virus/malware scan status"],
      missingEvidence: ["real scan service", "object storage quarantine path"],
    },
    {
      packetId: "target-mapping-evidence",
      packetKey: "target_mapping_packet",
      label: "Target mapping packet",
      status: "preview-ready",
      ownerRole: "Teacher reviewer",
      protects: "Prevents files from creating drafts, assets, playlists, local bundle entries, routes, or assignments directly.",
      requiredEvidence: ["source channel", "target record", "allowed preview actions", "blocked shortcuts"],
      missingEvidence: ["durable target mapping write"],
    },
    {
      packetId: "upload-review-evidence",
      packetKey: "upload_review_decision_packet",
      label: "Upload review decision packet",
      status: "blocked",
      ownerRole: "Reviewer",
      protects: "Keeps approve, return, rights request, and ready-for-asset-review actions review-only.",
      requiredEvidence: ["reviewer identity", "decision label", "blocked_by", "audit trail"],
      missingEvidence: ["reviewer identity provider", "audit storage"],
    },
    {
      packetId: "release-control-evidence",
      packetKey: "release_control_packet",
      label: "Release control packet",
      status: "blocked",
      ownerRole: "Tenant approver",
      protects: "Prevents upload promotion from bypassing package release and approval gates.",
      requiredEvidence: ["package publish gate", "approval ledger", "classroom launch gate"],
      missingEvidence: ["live approver signoff", "release-state persistence"],
    },
  ],
  blockedLiveActions: [
    "No live upload button",
    "No upload progress bar",
    "No approve or publish action",
    "No assignment route from uploaded file",
    "No object storage write",
    "No local folder activation",
  ],
};

export const samplePrototypeIntakeEvidencePacketFlow: EvidencePacketFlow = {
  flowId: "prototype-intake-evidence-packet-flow",
  label: "Prototype intake evidence packet flow",
  scope: "Z.ai and outside prototype review",
  summary:
    "Evidence packet flow for outside game inventory before returned prototypes, Phaser wrappers, DOM references, route plans, scoring review, reward review, playlist review, package promotion, or assignment work can exist.",
  handoffRule:
    "A queued prototype cannot move beyond inventory until source snapshot, reviewed fixture replay, event/scoring replay, target-language audio coverage, mobile/accessibility evidence, and wrapper/integration boundary evidence are preserved.",
  packets: [
    {
      packetId: "prototype-source-snapshot-evidence",
      packetKey: "prototype_source_snapshot_packet",
      label: "Source snapshot packet",
      status: "preview-ready",
      ownerRole: "Codex or platform reviewer",
      protects: "Confirms the exact external repository, branch, commit, archive, or snapshot before any review begins.",
      requiredEvidence: ["source_repository", "source_branch_or_snapshot", "tenant_id", "game_mode", "parent_engine_id"],
      missingEvidence: ["authenticated source archive storage"],
    },
    {
      packetId: "prototype-fixture-replay-evidence",
      packetKey: "prototype_fixture_replay_packet",
      label: "Fixture replay packet",
      status: "missing-evidence",
      ownerRole: "Prototype reviewer",
      protects: "Prevents hard-coded game text from entering LivingTextbook routes.",
      requiredEvidence: ["reviewed JSON fixture", "payload load proof", "tenant theme injection proof", "support_language_progress_allowed: false"],
      missingEvidence: ["fixture replay report", "fixture assertion log"],
    },
    {
      packetId: "prototype-event-scoring-evidence",
      packetKey: "prototype_event_scoring_packet",
      label: "Event and scoring packet",
      status: "missing-evidence",
      ownerRole: "Scoring reviewer",
      protects: "Keeps the parent engine in charge of progress, Star Dust, mastery, and collection unlocks.",
      requiredEvidence: ["standard event replay", "answer_result events", "mastery_updated candidate", "deterministic scoring replay"],
      missingEvidence: ["event replay report", "scoring replay report"],
    },
    {
      packetId: "prototype-audio-coverage-evidence",
      packetKey: "prototype_audio_coverage_packet",
      label: "Target-language audio packet",
      status: "missing-evidence",
      ownerRole: "Audio reviewer",
      protects: "Ensures every visible learning text has tap-to-speak target-language support before young learners use it.",
      requiredEvidence: ["target-language tap-to-speak coverage", "instruction replay control", "background media ducking rule", "support audio cannot unlock progress"],
      missingEvidence: ["audio coverage report", "missing cue list"],
    },
    {
      packetId: "prototype-mobile-accessibility-evidence",
      packetKey: "prototype_mobile_accessibility_packet",
      label: "Mobile accessibility packet",
      status: "missing-evidence",
      ownerRole: "Accessibility reviewer",
      protects: "Prevents unusable phone, QR, canvas-only, or hidden-control game surfaces.",
      requiredEvidence: ["mobile screenshot", "touch target check", "readable text check", "keyboard/focus fallback"],
      missingEvidence: ["mobile accessibility evidence", "Phaser DOM-control fallback proof when Phaser is used"],
    },
    {
      packetId: "prototype-wrapper-boundary-evidence",
      packetKey: "prototype_wrapper_boundary_packet",
      label: "Wrapper boundary packet",
      status: "blocked",
      ownerRole: "Codex integration owner",
      protects: "Blocks direct imports and requires wrapper-first review before any patch plan can be discussed.",
      requiredEvidence: ["parent-engine wrapper plan", "state ownership rules", "blocked route writes", "blocked app file writes"],
      missingEvidence: ["Codex wrapper decision", "patch authorization release lock"],
    },
  ],
  blockedLiveActions: [
    "No prototype upload or import",
    "No app file write",
    "No active route replacement",
    "No scoring profile mutation",
    "No reward inventory write",
    "No playlist write",
    "No package promotion",
    "No student assignment",
    "No support-language progress trigger",
  ],
};

export const sampleLabelledDiagramEvidencePacketFlow: EvidencePacketFlow = {
  flowId: "labelled-diagram-evidence-packet-flow",
  label: "Labelled Diagram evidence packet flow",
  scope: "Teacher-only image asset review",
  summary:
    "Evidence packet flow for a reviewed image candidate before live label editing, coordinate editing, asset promotion, or student-facing Labelled Diagram gameplay exists.",
  handoffRule:
    "A Labelled Diagram image cannot become a game asset until the game asset manifest, anchor records, audio coverage, accessibility evidence, and release control packet are preserved.",
  packets: [
    {
      packetId: "image-target-mapping-evidence",
      packetKey: "target_mapping_packet",
      label: "Image target mapping packet",
      status: "preview-ready",
      ownerRole: "Teacher reviewer",
      protects: "Maps the image upload to a Labelled Diagram asset without creating a student game.",
      requiredEvidence: ["source upload id", "game_asset_manifest target", "label_anchor_record target"],
      missingEvidence: ["durable target mapping write"],
    },
    {
      packetId: "game-asset-manifest-evidence",
      packetKey: "game_asset_manifest_packet",
      label: "Game asset manifest packet",
      status: "blocked",
      ownerRole: "Asset reviewer",
      protects: "Preserves image metadata, alt text, rights proof, safety review, and release state.",
      requiredEvidence: ["Image rights proof", "Alt text required", "image safety review", "student_facing_asset_allowed: false"],
      missingEvidence: ["stored image metadata", "reviewer identity"],
    },
    {
      packetId: "label-anchor-evidence",
      packetKey: "label_anchor_record_packet",
      label: "Label anchor record packet",
      status: "blocked",
      ownerRole: "Teacher reviewer",
      protects: "Keeps labels, coordinates, target-language text, and support-language rules reviewable.",
      requiredEvidence: ["Anchor coordinate review", "Target-language label text", "support_language_progress_allowed: false"],
      missingEvidence: ["coordinate editor storage", "anchor review audit"],
    },
    {
      packetId: "label-audio-evidence",
      packetKey: "audio_coverage_packet",
      label: "Label audio coverage packet",
      status: "missing-evidence",
      ownerRole: "Audio reviewer",
      protects: "Ensures every visible target-language label is tap-to-speak before young learners use it.",
      requiredEvidence: ["Audio label coverage", "target-language audio cue id", "learning audio priority"],
      missingEvidence: ["label audio files", "audio cue manifest"],
    },
    {
      packetId: "image-accessibility-evidence",
      packetKey: "accessibility_packet",
      label: "Accessibility packet",
      status: "missing-evidence",
      ownerRole: "Reviewer",
      protects: "Prevents inaccessible image games from reaching students.",
      requiredEvidence: ["touch target review", "contrast review", "keyboard/touch fallback"],
      missingEvidence: ["accessibility review signoff"],
    },
    {
      packetId: "image-release-evidence",
      packetKey: "release_control_packet",
      label: "Release control packet",
      status: "blocked",
      ownerRole: "Tenant approver",
      protects: "Blocks live Labelled Diagram game launch until package release gates accept the asset.",
      requiredEvidence: ["asset release gate", "package publish gate", "classroom launch gate"],
      missingEvidence: ["live approver signoff"],
    },
  ],
  blockedLiveActions: [
    "No live label editor",
    "No coordinate editor",
    "No auto-generated active labels",
    "No student-facing image game",
    "No asset promotion without release gate",
    "No assignment route from uploaded image",
  ],
};

export const sampleMediaEvidencePacketFlow: EvidencePacketFlow = {
  flowId: "media-evidence-packet-flow",
  label: "Media evidence packet flow",
  scope: "Teacher-only media asset review",
  summary:
    "Evidence packet flow for audio, music, video, playlist, background-media, and local-bundle candidates before live media upload, transcoding, playlist creation, or media-only progress exists.",
  handoffRule:
    "Media can enrich a unit only after rights, manifest, optional playback, caption/fallback, learning-audio priority, checksums, and release-control evidence are preserved.",
  packets: [
    {
      packetId: "media-target-mapping-evidence",
      packetKey: "target_mapping_packet",
      label: "Media target mapping packet",
      status: "preview-ready",
      ownerRole: "Teacher reviewer",
      protects: "Maps media to playlist, background policy, or local bundle records without creating routes from uploaded media.",
      requiredEvidence: ["media_playlist_binding", "background_media_policy_binding", "local_media_bundle_entry"],
      missingEvidence: ["durable target mapping write"],
    },
    {
      packetId: "media-rights-evidence",
      packetKey: "rights_proof_packet",
      label: "Media rights proof packet",
      status: "missing-evidence",
      ownerRole: "Publisher or school admin",
      protects: "Prevents unlicensed audio, music, video, captions, posters, or backgrounds from entering the package.",
      requiredEvidence: ["hosted playback scope", "classroom use scope", "local bundle scope"],
      missingEvidence: ["stored rights proof"],
    },
    {
      packetId: "media-manifest-evidence",
      packetKey: "media_manifest_packet",
      label: "Media manifest packet",
      status: "blocked",
      ownerRole: "Media reviewer",
      protects: "Preserves checksum, duration, language, poster, caption, and playback role metadata.",
      requiredEvidence: ["media_manifest", "checksum capture", "duration and language metadata", "poster or fallback required"],
      missingEvidence: ["object storage reference", "media review audit"],
    },
    {
      packetId: "caption-fallback-evidence",
      packetKey: "caption_transcript_packet",
      label: "Caption and fallback packet",
      status: "missing-evidence",
      ownerRole: "Media reviewer",
      protects: "Prevents progress depending on passive video watching.",
      requiredEvidence: ["captions or transcript policy", "non-video fallback", "optional_playback_required: true"],
      missingEvidence: ["caption file", "fallback activity mapping"],
    },
    {
      packetId: "background-media-evidence",
      packetKey: "background_media_policy_packet",
      label: "Background media policy packet",
      status: "blocked",
      ownerRole: "Teacher or school admin",
      protects: "Keeps music or video from overriding learning audio.",
      requiredEvidence: ["Learning audio priority required", "mute/duck/pause rule", "teacher control"],
      missingEvidence: ["session setting persistence"],
    },
    {
      packetId: "local-bundle-media-evidence",
      packetKey: "local_bundle_checksum_packet",
      label: "Local bundle checksum packet",
      status: "blocked",
      ownerRole: "Publisher technical owner",
      protects: "Prevents local folder placement from activating media without release gates.",
      requiredEvidence: ["local_media_bundle_entry", "checksum capture", "relative path", "update rule"],
      missingEvidence: ["local bundle export job"],
    },
    {
      packetId: "media-release-evidence",
      packetKey: "release_control_packet",
      label: "Release control packet",
      status: "blocked",
      ownerRole: "Tenant approver",
      protects: "Blocks media-only progress, playlist route promotion, and local activation until release gates pass.",
      requiredEvidence: ["package publish gate", "approval ledger", "classroom launch gate"],
      missingEvidence: ["live approver signoff"],
    },
  ],
  blockedLiveActions: [
    "No live media upload",
    "No automatic transcode-to-publish",
    "No playlist creation from uploaded media",
    "No media-only progress",
    "No background music overriding learning audio",
    "No local folder activation",
  ],
};
