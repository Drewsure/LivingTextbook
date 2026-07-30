import { readFileSync } from "node:fs";

const routeListPath = new URL("../docs/ACTIVE_ROUTE_VERIFICATION_LIST.md", import.meta.url);
const routeList = readFileSync(routeListPath, "utf8");
const activeRouteSection = routeList.split("## Planned QR Route, Not Active Yet")[0] ?? routeList;
const urls = Array.from(activeRouteSection.matchAll(/`(http:\/\/127\.0\.0\.1:3000\/[^`]*)`/g), (match) => match[1]);
const expectedTextByPath = new Map([
  ["/", ["Local Preview"]],
  ["/teacher", ["Teacher Launch Protocol", "Demo route shortcuts", "Printable Worksheet", "/print/demo-unit-1", "Support language control", "Target language only"]],
  ["/partner-demo", ["Partner package paths", "Teacher source review workspace", "/teacher/sources/sample-publisher", "Teacher private library", "Teacher upload workspace", "/teacher/uploads/sample-publisher", "Evidence packet review index", "/teacher/evidence/sample-publisher", "Evidence handoff preview", "/teacher/evidence/sample-publisher/handoff", "School policy handoff packet", "/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet", "Labelled Diagram asset workspace", "/teacher/assets/labelled-diagram/sample-publisher-l1-u1-labelled-diagram", "Media asset workspace", "/teacher/assets/media/sample-publisher-l1-u1-routines-media", "Teacher media library", "/teacher/media/sample-publisher", "Printable Worksheet", "/print/partner-demo-unit-1"]],
  ["/teacher/intake", ["Foundation verification gate", "verify:package-readiness", "verify:local-bundle", "verify:private-assignments", "verify:launch-safety", "verify:collection", "verify:class-roster", "verify:session-settings", "verify:upload-channels", "verify:backend-storage", "verify:release-control", "Launch safety boundaries", "Earned collection readiness", "Class roster readiness", "Teacher session settings safety", "Upload channel readiness", "Uploads are intake records first", "Image upload for Labelled Diagram", "PDF and text source intake", "Audio and music upload", "Video upload", "No uploaded file becomes student-facing", "Content entry option scaffold", "Flip Tiles source template", "Cross-game upload guide", "Approved font and rendering controls", "Approved learner font", "Tenant font pack", "Hiragana-safe font", "Font rendering gate", "Pick a template", "Enter content", "Generate With AI", "Flip tiles", "Single sided", "Double sided", "min 2 max 50", "Audio cue", "Image upload", "No Done-to-student route", "No file picker writes", "No template switch without compatibility check", "Template and font profile readiness", "Rendering and font profile gate", "Student-facing rendering blocked", "Student-facing font blocked", "No switch-to-anything panel", "No arbitrary teacher font upload", "Upload review queue", "Review queue preview", "Labelled Diagram image review", "Student-facing use blocked", "No automatic PDF-to-game publish", "Upload promotion readiness", "Target-specific promotion preview", "No student-facing promotion", "No folder placement promotion", "Labelled Diagram asset readiness", "game_asset_manifest", "label_anchor_record", "activity_compatibility_snapshot", "template_rendering_profile", "font_accessibility_profile", "Activity compatibility snapshot", "Template rendering profile", "Font accessibility profile", "student_facing_pathway_allowed", "student_facing_rendering_allowed", "student_facing_font_allowed", "No student-facing image game", "No live label editor", "Multimedia asset readiness", "media_playlist_binding", "background_media_policy_binding", "No media-only progress", "No background music overriding learning audio", "Backend storage readiness", "evidence_packet", "Evidence packet record", "evidence_attachment", "Evidence attachment record", "pilot_evidence_packet", "signed_approval_capture_allowed", "Pilot evidence packet record", "teacher_dry_run_rehearsal", "Teacher dry-run rehearsal record", "classroom_launch_gate", "Classroom launch gate record", "Release control readiness", "Competitive feature coverage", "Curated activity pathways", "Private tenant library first", "Japanese as target language", "Private tenant library", "Public community library blocked for v1", "Teacher private drafts", "Tenant-approved package library", "Share and embed readiness", "Private assignment links", "Public sharing blocked", "IFrame embed blocked for v1", "Embed origin policy", "Target language expansion", "Assist language is not target language", "Furigana rendering", "Segmentation policy", "Japanese pilot blocked", "Activity pathway compatibility", "Printable vocabulary sheet", "Crossword", "Target-language trigger", "Printable output readiness", "Vocabulary listening sheet", "Sentence practice worksheet", "PDF export blocked", "Teacher authoring readiness", "Fast authoring creates draft packages only", "Direct AI publish", "Review before assignment", "Class roster identity boundary", "Teacher reports without premature accounts", "Package publish gate", "Publisher pilot readiness summary", "Demo-ready now", "Pilot blockers", "Missing evidence", "Still not allowed", "Source of truth: package publish gate", "No publish action", "Pilot evidence packet", "Pilot evidence packet preview", "Evidence export readiness", "Evidence export blocked", "Signed approval capture blocked", "Reviewer summary PDF", "Machine-readable JSON packet", "Local companion evidence manifest", "No evidence packet export", "No JSON export", "No downloadable ZIP", "No email handoff", "No release-state mutation", "Evidence attachment storage readiness", "Attachment storage blocked", "Hosted object storage candidate", "Closed local evidence folder candidate", "Hybrid export archive candidate", "No evidence file upload", "No object storage write", "No local folder write", "No attachment download", "No signed approval attachment", "No release-state mutation", "No student-facing attachment", "No evidence upload", "No signed approval capture", "Gate evidence needed", "Approval evidence needed", "Package evidence stays metadata first", "Pilot launch checklist preview", "No classroom launch action", "Go/no-go blocked", "Required before classroom pilot", "Teacher classroom dry run", "Controlled partner demo", "Teacher dry-run rehearsal preview", "Open dry-run workspace", "Teacher-only rehearsal", "Entry and route rehearsal", "Game and audio rehearsal", "Media and support-language rehearsal", "Report and policy rehearsal", "Dry-run evidence only", "Do not collect real learner data", "Classroom launch gate preview", "Open launch gate workspace", "Launch blocked", "No live student session", "No launch button", "Dry-run evidence required", "Policy and persistence required", "Real learner data blocked", "Report export still blocked", "Required before launch", "School launch policy gate preview", "School launch decision blocked", "School privacy and retention acceptance", "Classroom operating mode acceptance", "Publisher media and local package acceptance", "Teacher dry-run evidence acceptance", "Platform release and storage acceptance", "Required before live launch", "No school policy acceptance", "No approval workflow", "No real learner data collection", "No teacher report export", "No support-language-only progression", "No live classroom workflow can start from this preview.", "School policy handoff packet preview", "Handoff draft only", "Privacy, retention, and learner data", "Teacher-led QR and student progression rules", "Publisher media, music, video, and local package", "Teacher dry-run and evidence packet", "Platform storage, release, and rollback controls", "Evidence needed", "Deferred decisions", "No AI Tutor activation", "No launch-ready status", "School policy acceptance preflight", "Acceptance blocked", "Authenticated school approver", "Policy text and scope", "Evidence packet and attachment readiness", "Release-control binding", "Child safety and progression boundaries", "Minimum acceptance record", "No accept button", "School policy text version pack", "Policy text blocked", "Versioned policy text only", "Microphone and AI Tutor optional features", "No policy acceptance from text pack", "Future school acceptance record preview", "Acceptance record blocked", "Minimum accepted-record fields", "No accepted terms stored", "No accepted policy record", "School policy revocation and rollback preview", "Rollback policy blocked", "No rollback action", "Minimum rollback record fields", "No production QR redirect mutation", "Activity compatibility and rendering profiles", "Pilot source strategy", "Pilot release candidate", "Backend selection gate", "Background media policy", "Maintenance change queue", "Event acceptance", "Event safety", "Report event acceptance", "taxonomy-v2026.07.foundation", "Required event fields", "49 checked routes"]],
  ["/teacher/sources/sample-publisher", ["Teacher source review workspace", "Review-only source intake", "No live extraction", "Source gate boundaries", "Extraction stays evidence-first", "No live extraction action", "No raw PDF as student payload", "No unreviewed OCR assignment", "No AI extraction direct assignment", "No parser output as a route target", "No automatic PDF-to-game publish", "Source review queue", "Sample Publisher Lab source review workspace", "Partner textbook sample unit PDF", "Unit audio and chant folder", "Unit video folder", "Required records before extraction promotion", "Blocked extraction shortcuts", "source_extraction_review_packet", "upload_file_policy_profile", "upload_intake_asset", "teacher_draft_package", "teacher_draft_review_handoff", "Real source PDF must be supplied for production pilot.", "Rights proof and real files are not present in the scaffold.", "Rights proof and bundle strategy are unresolved.", "Source extraction review packets", "Extraction evidence preview", "Sample publisher PDF OCR review packet", "Sample publisher media AI indexing packet", "OCR confidence unavailable", "AI media indexing can suggest track purpose only after real files and rights proof exist.", "No playlist creation from uploaded media."]],
  ["/teacher/sources/ministar", ["Teacher source review workspace", "Review-only source intake", "No live extraction", "Source gate boundaries", "Extraction stays evidence-first", "Source review queue", "MiniStar English Lab source review workspace", "MiniStar master curriculum DOCX", "MINISTAR ENGLISH 8 LEVELS x 40 UNITS.docx", "Confirm Japanese support text uses hiragana for Foundation/Bronze/Plus levels.", "Required records before extraction promotion", "Blocked extraction shortcuts", "source_extraction_review_packet", "teacher_draft_package", "teacher_draft_review_handoff", "No raw PDF as student payload", "No unreviewed OCR assignment", "No AI extraction direct assignment", "Source extraction review packets", "Extraction evidence preview", "MiniStar master DOCX extraction review packet", "OCR not used. DOCX structure must still be reviewed", "hiragana-safe Japanese support notes", "No teacher draft creation from this packet."]],
  ["/teacher/dry-run/sample-publisher-first-handoff-teacher-dry-run", ["Teacher dry-run route workspace", "Pre-classroom rehearsal", "No classroom launch action", "Rehearsal route shortcuts", "Teacher dry-run rehearsal preview", "Open dry-run workspace", "No student launch action", "Teacher-only rehearsal", "Entry and route rehearsal", "Game and audio rehearsal", "Media and support-language rehearsal", "Report and policy rehearsal", "Dry-run evidence only", "Do not collect real learner data", "Classroom launch gate preview", "Launch blocked", "No live student session", "No launch button", "Dry-run evidence required", "Policy and persistence required", "Real learner data blocked", "Report export still blocked", "/teacher/sessions/partner-demo-unit-1"]],
  ["/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate", ["Classroom launch gate route workspace", "Final pre-launch review", "No live classroom launch", "Launch gate source routes", "Review the evidence sources without starting a class", "Teacher intake source", "Teacher dry-run source", "Partner session report preview", "Partner launch demo route", "School policy handoff source", "Classroom launch gate preview", "Open launch gate workspace", "Launch blocked", "No live student session", "No launch button", "Dry-run evidence required", "Policy and persistence required", "Real learner data blocked", "Report export still blocked", "School launch policy gate preview", "School launch decision blocked", "School privacy and retention acceptance", "Classroom operating mode acceptance", "Publisher media and local package acceptance", "Teacher dry-run evidence acceptance", "Platform release and storage acceptance", "No school policy acceptance", "No approval workflow", "No live classroom workflow can start from this preview.", "School policy handoff packet preview", "Handoff draft only", "Privacy, retention, and learner data", "Teacher-led QR and student progression rules", "Publisher media, music, video, and local package", "Teacher dry-run and evidence packet", "Platform storage, release, and rollback controls", "No AI Tutor activation", "No launch-ready status", "School policy acceptance preflight", "Acceptance blocked", "Authenticated school approver", "Policy text and scope", "Minimum acceptance record", "No accept button", "School policy text version pack", "Policy text blocked", "Versioned policy text only", "No policy acceptance from text pack", "Future school acceptance record preview", "Acceptance record blocked", "No accepted terms stored", "No accepted policy record", "School policy revocation and rollback preview", "Rollback policy blocked", "No rollback action", "No production QR redirect mutation", "School rollback impact matrix", "Impact matrix blocked", "No release-state mutation", "No learner-data deletion workflow", "No media replacement", "No AI Tutor entitlement change", "School rollback safe fallback plan", "Fallback messaging blocked", "Student pause notice", "Teacher contact handoff", "Local companion safe fallback", "No live notification", "No classroom shutdown workflow", "School rollback safe fallback preflight", "Fallback activation blocked", "Child-safe copy review", "Printed QR fallback policy", "No fallback activation", "No student reassignment"]],
  ["/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet", ["School policy handoff route workspace", "School meeting packet preview", "Discussion only", "No policy acceptance", "Handoff source routes", "Review the source evidence without approving launch", "Teacher intake source", "Classroom launch gate source", "Teacher dry-run source", "Evidence handoff source", "School policy handoff packet preview", "Handoff draft only", "Privacy, retention, and learner data", "Teacher-led QR and student progression rules", "Publisher media, music, video, and local package", "Teacher dry-run and evidence packet", "Platform storage, release, and rollback controls", "No AI Tutor activation", "No launch-ready status", "School launch policy gate preview", "School launch decision blocked", "No live classroom workflow can start from this preview.", "School policy acceptance preflight", "Acceptance blocked", "Authenticated school approver", "Policy text and scope", "Evidence packet and attachment readiness", "Release-control binding", "Child safety and progression boundaries", "Minimum acceptance record", "No accept button", "School policy text version pack", "Policy text blocked", "Versioned policy text only", "Microphone and AI Tutor optional features", "No policy acceptance from text pack", "Future school acceptance record preview", "Acceptance record blocked", "No accepted terms stored", "No accepted policy record", "School policy revocation and rollback preview", "Rollback policy blocked", "No rollback action", "No production QR redirect mutation", "School rollback impact matrix", "Impact matrix blocked", "No release-state mutation", "No learner-data deletion workflow", "No media replacement", "No AI Tutor entitlement change", "School rollback safe fallback plan", "Fallback messaging blocked", "Student pause notice", "Teacher contact handoff", "Local companion safe fallback", "No live notification", "No classroom shutdown workflow", "School rollback safe fallback preflight", "Fallback activation blocked", "Child-safe copy review", "Printed QR fallback policy", "No fallback activation", "No student reassignment"]],
  ["/teacher/authoring/draft-sample-publisher-l1-u1", ["Teacher draft package", "Draft only", "Local edit preview", "Draft content-entry workbench preview", "Activity title", "+ Instruction", "Generate With AI blocked", "Flip tiles preview", "Cross-game upload guide", "Approved learner font", "Tenant font pack", "Hiragana-safe font", "Font rendering gate", "Profile binding preview", "template_rendering_profile: template-profile-flip-tiles-cross-game-v1", "font_accessibility_profile: font-profile-young-learner-ja-safe-v1", "Student-facing rendering blocked", "Student-facing font blocked", "Single sided", "Double sided", "min 2 max 50", "Audio cue required", "Image upload blocked", "No live file picker", "No Done-to-student route", "No template switch without compatibility check", "Draft audio coverage preview", "Draft review handoff preview", "Review packet blocked", "Schema validation packet", "Source lineage packet", "Audio coverage packet", "Rights and version packet", "Route and activity packet", "Approval packet", "Draft persistence required", "No student assignment", "Term audio", "Sentence audio", "Instruction audio", "Save draft blocked", "Submit for review blocked", "Student assignment blocked", "Audio regeneration required", "Review before assignment", "Audio before students", "Private tenant library candidate", "No direct publish"]],
  ["/teacher/review", ["Teacher draft review queue", "Review workbench preview", "Review handoff packet", "Verifier submission blocked", "Package approval blocked", "Student assignment blocked", "Schema validation packet", "Audio coverage packet", "Rights and version packet", "Route and activity packet", "Approval packet", "No direct AI publish", "No live approval", "Durable handoff storage required", "Verifier submission preflight", "Verifier submission still blocked", "Schema packet ready", "Audio regeneration pending", "Support language support-only", "Route compatibility ready", "Review evidence pending", "No automatic verifier submit", "Reviewer decision preview", "Decision actions disabled", "Return for edits", "Needs audio", "Ready for approval", "Approval still blocked", "Approver identity required", "Review evidence packet preview", "Evidence upload blocked", "Reviewer identity evidence", "Evidence storage required", "No file upload in foundation preview", "Review audit trail preview", "Audit trail storage required", "Handoff packet created", "Reviewer decision drafted", "Evidence packet blocked", "Approval ledger blocked", "No live state transition"]],
  ["/teacher/library/sample-publisher", ["Teacher private library", "Private-first", "Teacher private drafts", "Tenant-approved package library", "School shared library", "Public community library blocked for v1", "No student data copied", "Source lineage preserved"]],
  ["/teacher/uploads/sample-publisher", ["Teacher upload workspace", "Read-only upload command center", "No live file picker", "No uploaded file becomes student-facing", "No automatic PDF-to-game publish", "Upload intake control preview", "No file input element", "Select file blocked", "Create intake record blocked", "Upload channel readiness", "Upload file policy profiles", "upload_file_policy_profile", "File type and size policy", "Accepted MIME types", "scan_and_file_policy_packet", "No upload promotion without file policy acceptance", "Upload target mapping preview", "Source-to-target mapping", "target_mapping_packet", "No upload-to-assignment shortcut", "Upload review queue", "Upload promotion readiness", "Labelled Diagram asset readiness", "Multimedia asset readiness", "Evidence packet flow", "Upload evidence packet flow", "source_lineage_packet", "rights_proof_packet", "No live upload button", "No assignment route from uploaded file"]],
  ["/teacher/evidence/sample-publisher", ["Evidence packet review index", "Tenant evidence packet command center", "Review queue rollup", "Evidence sources before live upload controls", "Upload evidence source", "Labelled Diagram evidence source", "Media evidence source", "Storage handoff", "Records required before evidence becomes durable", "evidence_packet", "No live evidence upload", "No signed approval capture", "No approve or publish action", "No playlist creation from uploaded media", "No student-facing use from evidence packets alone", "Evidence packet assembly gate", "Assembly blocked", "Packet version not frozen", "Release readiness lanes", "Upload intake assembly lane", "Labelled Diagram assembly lane", "Media assembly lane", "Release-control assembly lane", "Required before packet version freeze", "No packet version freeze", "No approval capture", "No release state mutation", "No student assignment", "No export generation", "No QR promotion", "No route promotion", "No local bundle activation", "Reviewer identity and signature gate", "Reviewer identity blocked", "Signed approval capture blocked", "Approval intent preview only", "Authenticated reviewer identity lane", "Approval intent lane", "Signature policy lane", "Audit and retention lane", "Minimum approval record", "Signature policy rules", "No approve button", "No signature attachment upload", "No signed PDF packet", "No student assignment from approval"]],
  ["/teacher/evidence/sample-publisher/handoff", ["Evidence handoff preview", "Evidence packet handoff preview", "Evidence that would enter an export packet", "Upload intake evidence", "Labelled Diagram evidence", "Media evidence", "Recipient duties", "Who must confirm what", "Live actions blocked", "No export or approval workflow yet", "No evidence packet export", "No signed approval capture", "No publish action", "No upload promotion", "No route creation", "No playlist creation", "No assignment route from evidence"]],
  ["/teacher/assets/labelled-diagram/sample-publisher-l1-u1-labelled-diagram", ["Labelled Diagram asset workspace", "Teacher-only asset review", "Manifest and anchors preview", "game_asset_manifest", "label_anchor_record", "target_mapping_packet", "Image rights proof", "Alt text required", "Audio label coverage", "Support-language labels are support-only", "support_language_progress_allowed: false", "No live label editor", "No student-facing image game", "No assignment route from uploaded image", "Evidence packet flow", "Labelled Diagram evidence packet flow", "game_asset_manifest_packet", "label_anchor_record_packet", "audio_coverage_packet"]],
  ["/teacher/assets/media/sample-publisher-l1-u1-routines-media", ["Media asset workspace", "Teacher-only media review", "media_manifest", "media_playlist_binding", "background_media_policy_binding", "local_media_bundle_entry", "target_mapping_packet", "optional_playback_required: true", "Learning audio priority required", "No media-only progress", "No background music overriding learning audio", "No live media upload", "No playlist route from uploaded media", "Evidence packet flow", "Media evidence packet flow", "media_manifest_packet", "caption_transcript_packet", "background_media_policy_packet", "No playlist creation from uploaded media"]],
  ["/teacher/media/sample-publisher", ["Teacher media library", "Media maintenance preview", "Storage before live media tools", "media_manifest", "media_playlist_binding", "background_media_policy_binding", "local_media_bundle_entry", "Partner-owned assets", "Rights proof review", "Playlist binding review", "Background media policy review", "Local bundle media review", "Upload still blocked", "No live media upload", "No media-only progress", "Local folder activation blocked"]],
  ["/local/sample-publisher", ["Local companion package preview", "Closed local companion", "Local release gate", "Package artifact map", "Package handoff checklist", "Generated manifest snapshot", "Bundled game routes", "Local deployment preflight"]],
  ["/enter/ministar", ["Launch context", "Controlled front-door practice", "No live classroom launch", "Target language unlocks progress", "No production student accounts"]],
  ["/launch/demo-unit-1", ["Unit media", "Launch context", "Controlled student practice", "No live classroom launch", "Target language unlocks progress", "No production student accounts"]],
  ["/enter/sample-publisher", ["Launch context", "Controlled front-door practice", "No live classroom launch", "Target language unlocks progress", "No production student accounts"]],
  ["/launch/partner-demo-unit-1", ["Unit media", "Launch context", "Controlled student practice", "No live classroom launch", "Target language unlocks progress", "No production student accounts"]],
  ["/teacher/units/ministar%3Aministar-english%3AL1%3AU1", ["Teacher unit review", "Review before assignment", "Launch safety", "Assignment stays review-only", "No live classroom launch", "No production student accounts", "Real learner data blocked", "Report export still blocked", "Curated activity path", "Audio and media coverage", "Pilot blockers"]],
  ["/teacher/units/sample-publisher%3Apartner-textbook-companion%3AL1%3AU1", ["Teacher unit review", "Review before assignment", "Launch safety", "Assignment stays review-only", "No live classroom launch", "No production student accounts", "Real learner data blocked", "Report export still blocked", "Curated activity path", "Audio and media coverage", "Pilot blockers"]],
  ["/assign/assignment-ministar-demo-whole-class", ["Launch context", "Controlled assignment practice", "No live classroom launch", "Target language unlocks progress", "No production student accounts", "Private assignment link", "Student-facing assignment preview", "Curated activity pathway", "Private-first sharing rules"]],
  ["/assign/assignment-sample-publisher-front-door", ["Launch context", "Controlled assignment practice", "No live classroom launch", "Target language unlocks progress", "No production student accounts", "Private assignment link", "Student-facing assignment preview", "Curated activity pathway", "Private-first sharing rules"]],
  ["/collection/demo-unit-1", ["Earned collection", "Collection room preview", "Mastery unlocks only", "No random rewards", "Ownership provenance", "Unlock source event", "Policy-gated storage preview"]],
  ["/collection/partner-demo-unit-1", ["Earned collection", "Collection room preview", "Mastery unlocks only", "No random rewards", "Ownership provenance", "Unlock source event", "Policy-gated storage preview"]],
  ["/training/demo-unit-1", ["Training Academy", "Recovery practice for", "Greetings", "Teacher Recovery Summary", "Return path", "/launch/demo-unit-1"]],
  ["/training/partner-demo-unit-1", ["Training Academy", "Recovery practice for", "Daily Routines", "Teacher Recovery Summary", "Return path", "/launch/partner-demo-unit-1"]],
  ["/quiz/demo-unit-1", ["Core selection slice", "Quiz:", "Greetings", "Selection", "Quiz Progress", "Teacher Review Quiz"]],
  ["/quiz/partner-demo-unit-1", ["Core selection slice", "Quiz:", "Daily Routines", "Selection", "Quiz Progress", "Teacher Review Quiz"]],
  ["/sentence/demo-unit-1", ["Core syntax slice", "Sentence Builder:", "Greetings", "Text-spelling", "Sentence Builder Progress", "Sentence Builder"]],
  ["/sentence/partner-demo-unit-1", ["Core syntax slice", "Sentence Builder:", "Daily Routines", "Text-spelling", "Sentence Builder Progress", "Sentence Builder"]],
  ["/speak/demo-unit-1", ["Core speaking slice", "Speak It:", "Greetings", "Audio-led speaking practice", "Speaking Progress", "AI speech scoring remains premium and off"]],
  ["/speak/partner-demo-unit-1", ["Core speaking slice", "Speak It:", "Daily Routines", "Audio-led speaking practice", "Speaking Progress", "AI speech scoring remains premium and off"]],
  ["/teacher/sessions/demo-unit-1", ["Roster identity", "Session launch gate", "Session launch gate boundary", "Open classroom launch gate", "No live classroom launch", "Real learner data blocked", "Report export still blocked", "Session pilot readiness", "Report package boundary", "Event acceptance gate", "Media engagement", "Settings snapshot", "teacher_enablement_persisted", "tap-to-speak learning audio"]],
  ["/teacher/sessions/partner-demo-unit-1", ["Roster identity", "Session launch gate", "Session launch gate boundary", "Open classroom launch gate", "No live classroom launch", "Real learner data blocked", "Report export still blocked", "Session pilot readiness", "Report package boundary", "Event acceptance gate", "Media engagement", "Settings snapshot", "teacher_enablement_persisted", "tap-to-speak learning audio"]],
  ["/teacher/sessions/demo-unit-1/report-package", ["Session launch gate boundary", "No live classroom launch", "Real learner data blocked", "Report export still blocked", "Report package preview", "Export blocked", "Event acceptance summary", "Support-only signals"]],
  ["/teacher/sessions/partner-demo-unit-1/report-package", ["Session launch gate boundary", "No live classroom launch", "Real learner data blocked", "Report export still blocked", "Report package preview", "Export blocked", "Event acceptance summary", "Support-only signals"]],
  ["/media/playlist-ministar-l1-u1-greetings", ["Media playlist route", "Demo media controls", "support-only events"]],
  ["/print/demo-unit-1", ["Printable worksheet preview", "Browser-print preview", "Vocabulary listening sheet", "Sentence practice worksheet", "PDF export blocked", "Audio bridge", "Version snapshot"]],
  ["/media/playlist-sample-publisher-l1-u1-routines", ["Media playlist route", "Demo media controls", "support-only events"]],
  ["/print/partner-demo-unit-1", ["Printable worksheet preview", "Browser-print preview", "Vocabulary listening sheet", "Sentence practice worksheet", "PDF export blocked", "Audio bridge", "Version snapshot"]],
  ["/q/tenant/sample-publisher/series/starter-english/book/level-1/unit/unit-1/activity/hello-friends/language/en/edition/2026/version/1.0.0", ["Edition QR resolver preview", "Printed QR id", "qr-sample-publisher-starter-l1-u1-hello", "The printed QR id stays constant", "Resolved target", "/enter/sample-publisher", "Guardrails", "Direct localhost target", "Direct media file target", "Unreviewed package swap", "Open resolved preview"]],
]);

expectedTextByPath.get("/teacher/review")?.push(
  "AI-generated daily routines draft preview",
  "Source lineage",
  "Created from AI generator draft preview",
  "Requires AI verifier submission packet before teacher approval.",
  "Generated content cannot create routes, playlists, assignments, or local bundles.",
  "AI verifier submission packet",
  "AI verifier submission packet required",
  "Submit AI draft to verifier",
  "Approve generated package",
  "Create route from AI draft",
  "Create playlist from AI draft",
  "Assign generated draft to students",
  "Mark generated package student-ready",
  "AI draft queued for review",
  "AI verifier packet reviewed",
  "AI draft returned or rejected",
  "AI schema packet ready",
  "AI audio coverage pending",
  "AI engine binding ready",
  "AI gamification mapping ready",
  "AI media rights pending",
  "AI teacher approval missing",
  "No live AI verifier workflow",
);

expectedTextByPath.get("/teacher/intake")?.push(
  "Evidence storage adapter selection gate",
  "Storage adapter selection blocked",
  "Hosted managed evidence storage candidate",
  "Closed local evidence store candidate",
  "Hybrid archive evidence store candidate",
  "First pilot recommendation",
  "No storage adapter selected",
  "No object bucket creation",
  "No local evidence folder activation",
  "No signed URL generation",
  "No direct file upload",
  "No attachment migration",
  "No production retention clock",
  "No release-state mutation",
  "reviewer_identity_signature_gate",
  "Reviewer identity and signature gate record",
  "reviewer-identity-signature-gate-record",
  "school_launch_policy_gate",
  "School launch policy gate record",
  "school-launch-policy-gate-record",
  "school_policy_handoff_packet",
  "School policy handoff packet record",
  "school-policy-handoff-packet-record",
  "school_policy_acceptance_preflight",
  "School policy acceptance preflight record",
  "school-policy-acceptance-preflight-record",
  "school_policy_text_pack",
  "School policy text pack record",
  "school-policy-text-pack-record",
  "school_policy_acceptance_record_preview",
  "School policy acceptance record preview",
  "school-policy-acceptance-record-preview-record",
  "school_policy_revocation_rollback_preview",
  "School policy revocation and rollback preview record",
  "school-policy-revocation-rollback-preview-record",
  "school_policy_rollback_impact_matrix",
  "School rollback impact matrix record",
  "school-policy-rollback-impact-matrix-record",
  "school_rollback_safe_fallback_plan",
  "School rollback safe fallback plan record",
  "school-rollback-safe-fallback-plan-record",
  "school_rollback_safe_fallback_preflight",
  "School rollback safe fallback preflight record",
  "school-rollback-safe-fallback-preflight-record",
  "school_rollback_safe_fallback_activation_preview",
  "School rollback safe fallback activation preview record",
  "school-rollback-safe-fallback-activation-preview-record",
  "school_rollback_safe_fallback_restoration_preview",
  "School rollback safe fallback restoration preview record",
  "school-rollback-safe-fallback-restoration-preview-record",
  "teacher_assignment_rollout_gate",
  "Teacher assignment rollout gate record",
  "teacher-assignment-rollout-gate-record",
  "private_assignment_link",
  "Private assignment link record",
  "private-assignment-link-record",
  "class_roster_plan",
  "Class roster plan record",
  "class-roster-plan-record",
  "source_extraction_review_packet",
  "Source extraction review packet record",
  "source-extraction-review-packet-record",
  "upload_file_policy_profile",
  "Upload file policy profile record",
  "upload-file-policy-profile-record",
  "School rollback impact matrix",
  "Impact matrix blocked",
  "School rollback safe fallback plan",
  "Fallback messaging blocked",
  "School rollback safe fallback preflight",
  "Fallback activation blocked",
  "Child-safe copy review",
  "Printed QR fallback policy",
  "No fallback activation",
  "No student reassignment",
  "Student pause notice",
  "Teacher contact handoff",
  "Local companion safe fallback",
  "No live notification",
  "No classroom shutdown workflow",
  "No learner-data deletion workflow",
  "No media replacement",
  "No AI Tutor entitlement change",
);

const assignmentRolloutExpected = [
  "Assignment rollout",
  "From reviewed assignment to scheduled pilot",
  "demo-preview",
  "Sample publisher front-door pilot rollout",
  "Closed local companion rollout",
  "Game audio coverage",
  "Media rights",
  "Progress persistence",
  "Report policy",
  "Local storage",
  "teacher_assignment_rollout_gate",
  "Teacher assignment rollout gate record",
  "private_assignment_link",
  "Private assignment link record",
  "class_roster_plan",
  "Class roster plan record",
];

expectedTextByPath.get("/teacher/intake")?.push(...assignmentRolloutExpected);

const sourceExtractionExpected = [
  "Required records before extraction promotion",
  "Blocked extraction shortcuts",
  "source_extraction_review_packet",
  "upload_file_policy_profile",
  "upload_intake_asset",
  "teacher_draft_package",
  "teacher_draft_review_handoff",
  "No raw PDF as student payload",
  "No unreviewed OCR assignment",
  "No automatic PDF-to-game publish",
  "No AI extraction direct assignment",
  "No parser output as a route target",
];

expectedTextByPath.get("/teacher/intake")?.push(...sourceExtractionExpected);

const safeFallbackActivationPreviewExpected = [
  "Future safe fallback activation record preview",
  "Activation record blocked",
  "Authenticated school operator",
  "Accepted safe fallback preflight",
  "Printed QR route scope",
  "Local companion fallback binding",
  "Media playlist fallback binding",
  "No fallback activated",
  "No activate fallback button",
];

expectedTextByPath.get("/teacher/intake")?.push(...safeFallbackActivationPreviewExpected);
expectedTextByPath
  .get("/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate")
  ?.push(...safeFallbackActivationPreviewExpected);
expectedTextByPath
  .get("/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet")
  ?.push(...safeFallbackActivationPreviewExpected);

const aiGameGeneratorExpected = [
  "AI teaching game generator",
  "Generator request preview",
  "Sample publisher daily routines game draft",
  "Draft only",
  "No live model call",
  "No direct AI publish",
  "No student assignment",
  "No unreviewed activity conversion",
  "No support-language-only progression",
  "No API cost without tenant approval",
  "No premium upsell shown to children",
  "API cost package gate",
  "Curated activity pathway",
  "8 default vocabulary terms",
  "8-12 allowed terms",
  "Exactly 2 target sentence structures",
  "Every target-language text needs audio",
  "Support language cannot unlock progress",
  "JSON-first draft package payload",
  "Teacher Launch Protocol required",
  "Verifier packet required before package review",
  "teacher_draft_package",
  "teacher_draft_verifier_submission",
  "activity_compatibility_snapshot",
  "package_game_audio_coverage",
  "media_playlist_binding",
  "Flashcards",
  "Memory Match",
  "Sentence Builder",
  "Target-language audio rule",
  "Assist language policy",
  "AI engine binding preview",
  "Use existing parent engines",
  "Game mode catalog binding",
  "Parent engine binding",
  "No generated game code",
  "Parent engine",
  "Scoring profile",
  "ai_engine_binding_plan",
  "game_mode_catalog_snapshot",
  "engine_mode_config_binding",
  "standard_event_contract",
  "Generated game code blocked",
  "Bypass parent engine blocked",
  "AI prompt package preview",
  "Versioned generation prompt",
  "Prompt template version",
  "Model use disabled",
  "Usage budget required",
  "JSON schema lock",
  "Tenant brand rules",
  "Voice generation separate package",
  "No raw student data in prompt",
  "No prompt edits by students",
  "AI generator cost and entitlement gate",
  "Premium package required",
  "No live model billing",
  "Tenant AI generation entitlement",
  "usage_budget_ceiling",
  "model_rate_card_snapshot",
  "voice_generation_separate_package",
  "cost_estimate_preview",
  "school_approval_required",
  "Cost estimate preview only",
  "School approval required",
  "Teacher self-enable blocked",
  "Enable AI generation blocked",
  "Enable AI Tutor blocked",
  "AI generation request builder",
  "Disabled generator setup form",
  "Teacher request packet",
  "Source evidence packet",
  "Target level",
  "Unit theme",
  "Target language",
  "Curated mode pathway",
  "Audio coverage requirement",
  "AI package state",
  "ai_generation_request_packet",
  "request_builder_review_packet",
  "premium_ai_cost_gate",
  "Generate draft blocked",
  "Estimate API cost blocked",
  "Submit request blocked",
  "No live prompt dispatch",
  "No model billing",
  "AI audio coverage planner",
  "Target-language audio map",
  "Audio-first generation gate",
  "Learning audio priority",
  "Required audio records",
  "Blocked audio actions",
  "Term audio",
  "Sentence audio",
  "Instruction audio",
  "Control audio",
  "Support-language audio cannot unlock progress",
  "Media-only listening cannot count toward mastery",
  "Generate target audio blocked",
  "API voice cost blocked",
  "AI gamification mapping preview",
  "Deterministic reward plan",
  "Mastery unlocks only",
  "No random rewards",
  "Star Dust allocation",
  "Vocabulary acquisition",
  "Syntax construction",
  "Accuracy and reflex bonus",
  "Accepted events",
  "collection_unlock_binding",
  "progress_event_acceptance_map",
  "Random reward generation blocked",
  "Generated gacha blocked",
  "Media-only Star Dust blocked",
  "Support-language-only mastery blocked",
  "AI verifier submission packet",
  "Vision/reasoning preflight",
  "Submit verifier packet blocked",
  "Required verifier packets",
  "Verifier checks",
  "Schema validation packet",
  "Pedagogical lock",
  "Target-language progression",
  "Audio coverage packet",
  "Engine binding packet",
  "Gamification mapping packet",
  "Media rights manifest",
  "Teacher approval packet",
  "ai_verifier_submission_packet",
  "schema_validation_packet",
  "pedagogical_lock_packet",
  "teacher_approval_packet",
  "Create student assignment from verifier packet blocked",
  "AI generated package manifest",
  "One bundle, many gates",
  "Package assembly blocked",
  "Manifest links",
  "Package records",
  "Release locks",
  "Blocked package actions",
  "ai_generated_package_manifest",
  "teacher_draft_verifier_submission",
  "engine_mode_config_binding",
  "No package assembly write",
  "No route registry write",
  "No media playlist write",
  "No assignment write",
  "Assign generated package from manifest blocked",
  "AI mode recommendation preview",
  "Recommended generated pathway",
  "Do not generate broad switch panel",
  "Blocked conversion guardrails",
  "Entry Flashcards",
  "Teacher Review Quiz",
  "Word Search",
  "Crossword",
  "Payload fit:",
  "Compatibility rule:",
  "AI draft payload preview",
  "Draft JSON preview",
  "target_language_progress_trigger",
  "target-language-only",
  "progress_unlock_allowed",
  "support_language_progress_allowed",
  "media_only_progress_allowed",
  "audio_coverage_status: required-not-approved",
  "Teacher approval missing",
  "Media rights missing",
  "Copy JSON blocked",
  "Submit to verifier blocked",
  "Publish generated package blocked",
  "Create student assignment blocked",
  "Create playlist from draft blocked",
];

const aiGameGeneratorIntakeExpected = [
  "AI teaching game generator",
  "Generator request preview",
  "Sample publisher daily routines game draft",
  "Draft only",
  "No live model call",
  "No direct AI publish",
  "No student assignment",
  "API cost package gate",
  "Curated activity pathway",
  "8 default vocabulary terms",
  "8-12 allowed terms",
  "Exactly 2 target sentence structures",
  "Every target-language text needs audio",
  "Support language cannot unlock progress",
  "teacher_draft_package",
  "teacher_draft_verifier_submission",
  "ai_generated_package_manifest",
  "AI generated package manifest record",
  "activity_compatibility_snapshot",
  "package_game_audio_coverage",
];

expectedTextByPath.set("/teacher/generator/sample-publisher", aiGameGeneratorExpected);
expectedTextByPath.get("/teacher/intake")?.push(...aiGameGeneratorIntakeExpected);
expectedTextByPath
  .get("/partner-demo")
  ?.push("AI teaching game generator", "/teacher/generator/sample-publisher");

const teacherIntakeExpected = expectedTextByPath.get("/teacher/intake");
if (teacherIntakeExpected) {
  const routeCountIndex = teacherIntakeExpected.indexOf("49 checked routes");

  if (routeCountIndex >= 0) {
    teacherIntakeExpected[routeCountIndex] = "50 checked routes";
  }
}

const safeFallbackRestorationPreviewExpected = [
  "Future safe fallback restoration record preview",
  "Restoration record blocked",
  "Authenticated restoration operator",
  "Source activation binding",
  "Route restoration map",
  "Local package restoration",
  "Media restoration scope",
  "No restoration activated",
  "No restore normal route button",
];

expectedTextByPath.get("/teacher/intake")?.push(...safeFallbackRestorationPreviewExpected);
expectedTextByPath
  .get("/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate")
  ?.push(...safeFallbackRestorationPreviewExpected);
expectedTextByPath
  .get("/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet")
  ?.push(...safeFallbackRestorationPreviewExpected);

if (urls.length === 0) {
  console.error("No active local routes found in docs/ACTIVE_ROUTE_VERIFICATION_LIST.md.");
  process.exit(1);
}

const results = [];

for (const url of urls) {
  try {
    const response = await fetch(url, { redirect: "manual" });
    const expectedText = expectedTextByPath.get(new URL(url).pathname) ?? [];
    const body = expectedText.length > 0 && response.ok ? await response.text() : "";
    const missingExpectedText = expectedText.filter((text) => !body.includes(text));

    results.push({
      url,
      status: response.status,
      ok: response.status >= 200 && response.status < 400 && missingExpectedText.length === 0,
      expectedText,
      missingExpectedText,
    });
  } catch (error) {
    results.push({ url, status: "error", ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}

for (const result of results) {
  const marker = result.ok ? "PASS" : "FAIL";
  const textCheck =
    result.expectedText?.length > 0 && result.missingExpectedText?.length > 0
      ? ` missing expected text: ${result.missingExpectedText.join(", ")}`
      : result.expectedText?.length > 0
        ? ` contains: ${result.expectedText.join(", ")}`
        : "";
  const detail = result.error ? ` ${result.error}` : textCheck;
  console.log(`${marker} ${result.status} ${result.url}${detail}`);
}

const failed = results.filter((result) => !result.ok);

if (failed.length > 0) {
  console.error(`${failed.length} active route check(s) failed.`);
  process.exit(1);
}

console.log(`${results.length} active route check(s) passed.`);
