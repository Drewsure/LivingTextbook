# Upload Channel Readiness Checks

Document type: focused verification supplement
Status: active scaffold
Last updated: 2026-07-15

## Purpose

Verify that upload paths are treated as governed intake channels before live upload controls, object storage, local bundle folders, OCR, media processing, or image label editors are implemented.

## Route

Verify at:

- `http://127.0.0.1:3000/teacher/intake`
- `http://127.0.0.1:3000/teacher/uploads/sample-publisher`
- `http://127.0.0.1:3000/teacher/evidence/sample-publisher`
- `http://127.0.0.1:3000/teacher/evidence/sample-publisher/handoff`

## Required Checks

1. Confirm the page shows `Upload channel readiness`.
2. Confirm the page states `Uploads are intake records first`.
3. Confirm the page states `No uploaded file becomes student-facing`.
4. Confirm PDF/text source intake is present.
5. Confirm Image upload for Labelled Diagram is present.
6. Confirm Audio and music upload is present.
7. Confirm Video upload is present.
8. Confirm accepted file types are shown per channel.
9. Confirm upload targets are shown per channel.
10. Confirm not-allowed shortcuts are shown per channel.
11. Confirm PDF/text cannot auto-publish games or assignments.
12. Confirm Labelled Diagram images require rights, safety, alt text, and label-anchor review.
13. Confirm music cannot become a mastery trigger.
14. Confirm video cannot be required for progress without fallback.
15. Confirm the page shows `Upload review queue`.
16. Confirm the page shows `Review queue preview`.
17. Confirm PDF/text, Labelled Diagram image, audio/music, and video review items are visible.
18. Confirm each queue item shows source lineage, rights proof, scan/file policy, and target mapping packet requirements.
19. Confirm reviewer decision options are disabled previews only.
20. Confirm queue rules block student-facing use, direct game assignment, automatic PDF-to-game publish, and uploaded media as mastery trigger.
21. Confirm the page shows `Upload promotion readiness`.
22. Confirm PDF/text, Labelled Diagram image, audio/music, and video/local bundle promotion lanes are visible.
23. Confirm promotion rules block student-facing promotion, direct assignment, folder placement promotion, and reviewed upload bypass.
24. Confirm each promotion lane shows storage required before live promotion.
25. Confirm the page shows `Labelled Diagram asset readiness`.
26. Confirm the page shows `game_asset_manifest` and `label_anchor_record`.
27. Confirm Labelled Diagram assets require image rights proof, alt text, anchor coordinate review, target-language label text, and audio label coverage.
28. Confirm support-language labels are support-only and cannot trigger progress.
29. Confirm the scaffold blocks student-facing image games, auto-generated labels, live label editors, asset promotion without release gate, and unreviewed image coordinates.
30. Confirm the page shows `Multimedia asset readiness`.
31. Confirm the page shows `media_manifest`, `media_playlist_binding`, `background_media_policy_binding`, and `local_media_bundle_entry`.
32. Confirm multimedia assets require learning audio separation, optional playback, captions or transcript policy, background-media priority, and local bundle checksums.
33. Confirm the scaffold blocks media-only progress, background music overriding learning audio, video-only progress, unlicensed media, raw learner audio storage, automatic transcode-to-publish, and local folder activation.
34. Confirm the page shows `Content entry option scaffold`.
35. Confirm the page shows `Flip Tiles source template`.
36. Confirm the page shows `Cross-game upload guide`, `Pairing-family games`, `Selection-family games`, and `Text and printable outputs`.
37. Confirm the content entry workflow shows `Pick a template`, `Enter content`, and `Play`.
38. Confirm the scaffold shows `Activity title`, `+ Instruction`, `Generate With AI`, `Flip tiles`, `Done`, and `+ Add an item`.
39. Confirm the scaffold shows `Single sided`, `Double sided`, and row limit text `min 2 max 50`.
40. Confirm row columns include `Front`, `Back`, target-language text, and support-language text.
41. Confirm formatting tools include `Bold`, `Superscript`, `Subscript`, and `Symbol picker`.
42. Confirm font/rendering controls include `Approved learner font`, `Tenant font pack`, `Hiragana-safe font`, `Readable tile sizing`, and `Font rendering gate`.
43. Confirm per-row actions include `Audio cue`, `Image upload`, `Reorder item`, `Duplicate item`, and `Delete item`.
44. Confirm required records include teacher draft package, upload intake/review/promotion, media/game manifests, activity compatibility snapshots, template rendering profiles, and font accessibility profiles.
45. Confirm the scaffold blocks live media upload, Done-to-student routing, direct AI publish, unreviewed image activation, support-language progress triggers, file picker writes, and unchecked template switching.
46. Confirm the page shows `Template and font profile readiness`.
47. Confirm the page shows `Rendering and font profile gate`.
48. Confirm the page shows `Flip Tiles cross-game rendering profile` and `Young learner and Japanese-safe font profile`.
49. Confirm the page shows compatible families, row shape policy, media slot policy, layout constraints, tenant font pack, language rendering rules, and readability checks.
50. Confirm the page shows `Student-facing rendering blocked` and `Student-facing font blocked`.
51. Confirm the profile panel blocks switch-to-anything panels, arbitrary teacher font uploads, unlicensed fonts, broken hiragana/furigana rendering, and unchecked printable output.
52. Confirm the dedicated upload workspace shows `Teacher upload workspace`.
53. Confirm the dedicated upload workspace shows `Read-only upload command center`.
54. Confirm the dedicated upload workspace keeps `No live file picker`, `No uploaded file becomes student-facing`, and `No automatic PDF-to-game publish` visible before live storage work.
55. Confirm the dedicated upload workspace shows `Upload file policy profiles`.
56. Confirm file policy profiles show `File type and size policy`, accepted extensions, required maximums, required checks, blocked shortcuts, and next storage gates.
57. Confirm file policies preserve `scan_and_file_policy_packet`, MIME type validation, checksum capture, virus/malware scan status, and `No upload promotion without file policy acceptance`.
58. Confirm file policy profiles show accepted MIME types and require the `upload_file_policy_profile` storage record before live file controls.
59. Confirm the dedicated upload workspace shows `Upload intake control preview`.
60. Confirm the upload intake control preview shows `No file input element`, `Select file blocked`, and `Create intake record blocked`.
61. Confirm the upload intake control preview shows source metadata, scan policy, and target mapping gates for each channel.
62. Confirm the dedicated upload workspace shows `Upload target mapping preview`.
63. Confirm target mapping shows `target_mapping_packet`, source-to-target lanes, target records, required evidence, allowed preview actions, blocked shortcuts, and next gates.
64. Confirm target mapping blocks route creation directly from upload, uploaded files as student assignment targets, upload-to-assignment shortcuts, and folder placement activation.
65. Confirm the dedicated Labelled Diagram asset workspace route shows `Teacher-only asset review`.
66. Confirm the asset workspace shows `game_asset_manifest`, `label_anchor_record`, `target_mapping_packet`, image rights proof, alt text, anchor coordinate review, and audio label coverage.
67. Confirm the asset workspace keeps target-language label text as the progress trigger and `support_language_progress_allowed: false` visible.
68. Confirm the asset workspace blocks live label editing, coordinate editing, student-facing image games, auto-generated labels, asset promotion without release gate, and assignment routes from uploaded images.
69. Confirm the dedicated media asset workspace route shows `Teacher-only media review`.
70. Confirm the media workspace shows `media_manifest`, `media_playlist_binding`, `background_media_policy_binding`, `local_media_bundle_entry`, and `target_mapping_packet`.
71. Confirm the media workspace keeps optional playback, learning-audio priority, captions/transcript policy, checksum capture, and relative path requirements visible.
72. Confirm the media workspace blocks media-only progress, background music overriding learning audio, video-only progress, live media upload, automatic transcode-to-publish, local folder activation, and playlist routes from uploaded media.
73. Confirm the dedicated upload, Labelled Diagram, and media workspaces show `Evidence packet flow`.
74. Confirm the upload evidence packet flow shows `source_lineage_packet`, `rights_proof_packet`, `scan_and_file_policy_packet`, `target_mapping_packet`, `upload_review_decision_packet`, and `release_control_packet`.
75. Confirm the upload evidence packet flow blocks live upload buttons, upload progress, approve/publish actions, assignment routes from uploaded files, object storage writes, and local folder activation.
76. Confirm the Labelled Diagram evidence packet flow shows `game_asset_manifest_packet`, `label_anchor_record_packet`, `audio_coverage_packet`, `accessibility_packet`, and `release_control_packet`.
77. Confirm the Labelled Diagram evidence packet flow blocks live label editing, coordinate editing, auto-generated active labels, student-facing image games, asset promotion without release gates, and assignment routes from uploaded images.
78. Confirm the media evidence packet flow shows `media_manifest_packet`, `caption_transcript_packet`, `background_media_policy_packet`, `local_bundle_checksum_packet`, and `release_control_packet`.
79. Confirm the media evidence packet flow blocks live media upload, automatic transcode-to-publish, playlist creation from uploaded media, media-only progress, background music overriding learning audio, and local folder activation.
80. Confirm the evidence packet review index route shows `Evidence packet review index`.
81. Confirm the review index rolls up upload, Labelled Diagram, and media evidence sources before live upload controls exist.
82. Confirm the review index shows `Storage handoff`, `Storage contract records`, and `Standing review-only rules`.
83. Confirm the review index keeps `No live evidence upload`, `No signed approval capture`, `No approve or publish action`, `No playlist creation from uploaded media`, and `No student-facing use from evidence packets alone` visible.
84. Confirm the evidence packet handoff route shows `Evidence handoff preview`.
85. Confirm the handoff route shows upload intake, Labelled Diagram, and media evidence sections.
86. Confirm the handoff route shows recipient duties for publisher reviewer, school approver, and platform operator.
87. Confirm the handoff route keeps `No evidence packet export`, `No signed approval capture`, `No publish action`, `No upload promotion`, `No route creation`, `No playlist creation`, and `No assignment route from evidence` visible.
88. Confirm `/teacher/intake` shows `Evidence export readiness`.
89. Confirm the export readiness panel shows `Reviewer summary PDF`, `Machine-readable JSON packet`, and `Local companion evidence manifest`.
90. Confirm the export readiness panel shows publisher, school, and platform recipient lanes.
91. Confirm the export readiness panel shows identity/signature gates and retention/policy gates.
92. Confirm the export readiness panel keeps `No evidence packet export`, `No signed approval capture`, `No PDF generation`, `No JSON export`, `No downloadable ZIP`, `No email handoff`, `No release-state mutation`, and `No student assignment from export` visible.
93. Confirm `/teacher/intake` shows `Evidence attachment storage readiness`.
94. Confirm the attachment storage panel shows `Hosted object storage candidate`, `Closed local evidence folder candidate`, and `Hybrid export archive candidate`.
95. Confirm required attachment metadata includes `quarantine path`, `checksum required`, `malware scan status`, `retention period`, and `delete/export policy`.
96. Confirm storage policy gates include storage adapter selection, access control, encryption, local backup responsibility, audit retention, student-facing attachment policy, and release-control mutation policy.
97. Confirm blocked storage actions include `No evidence file upload`, `No object storage write`, `No local folder write`, `No attachment download`, `No signed approval attachment`, `No release-state mutation`, and `No student-facing attachment`.
98. Confirm `/teacher/intake` shows `Evidence storage adapter selection gate`.
99. Confirm the selection gate recommends `Hosted managed evidence storage candidate` for the first controlled pilot.
100. Confirm the selection gate still shows `Closed local evidence store candidate` and `Hybrid archive evidence store candidate`.
101. Confirm vendor-neutral requirements include tenant isolation, metadata separated from binary files, quarantine-first storage, checksums, malware scan status, access control, audit logs, delete/export policy, local backup responsibility, and release-control mutation blocks.
102. Confirm blocked actions include `No storage adapter selected`, `No object bucket creation`, `No local evidence folder activation`, `No signed URL generation`, `No direct file upload`, `No attachment migration`, `No production retention clock`, and `No release-state mutation`.
103. Confirm `/teacher/evidence/sample-publisher` shows `Evidence packet assembly gate`.
104. Confirm the assembly gate shows `Assembly blocked`, `Packet version not frozen`, `Evidence export blocked`, and `Storage adapter selection blocked`.
105. Confirm release readiness lanes include `Upload intake assembly lane`, `Labelled Diagram assembly lane`, `Media assembly lane`, and `Release-control assembly lane`.
106. Confirm the assembly gate shows required preconditions including authenticated reviewer identity, evidence storage adapter selection, attachment metadata, rights proof, scan provider result, audio coverage, accessibility signoff, release control, teacher dry-run evidence, and classroom launch gate acceptance.
107. Confirm blocked actions include `No packet version freeze`, `No approval capture`, `No release state mutation`, `No student assignment`, `No export generation`, `No QR promotion`, `No route promotion`, `No local bundle activation`, `No storage write`, and `No evidence download`.
108. Confirm `/teacher/evidence/sample-publisher` shows `Reviewer identity and signature gate`.
109. Confirm the identity/signature gate shows `Reviewer identity blocked`, `Signed approval capture blocked`, and `Approval intent preview only`.
110. Confirm identity and approval lanes include `Authenticated reviewer identity lane`, `Approval intent lane`, `Signature policy lane`, and `Audit and retention lane`.
111. Confirm minimum approval record fields include `reviewer_identity_id`, `role_at_approval`, `approval_intent_text`, `revocation_policy_id`, `release_control_state_before`, and `release_control_state_after`.
112. Confirm signature policy rules keep approval optional per tenant, block evidence bypass, keep support language non-progress, require the evidence attachment storage contract for future signature attachments, and require local backup/restore ownership for local deployments.
113. Confirm blocked approval actions include `No signed approval capture`, `No approve button`, `No release-state mutation`, `No packet version freeze`, `No audit record write`, `No signature attachment upload`, `No signed PDF packet`, `No evidence download`, and `No student assignment from approval`.

## Automated Command

```powershell
npm run verify:upload-channels
```

This command is also included in:

```powershell
npm run verify:foundation
```

Upload review and promotion storage are also covered by:

```powershell
npm run verify:backend-storage
```

Labelled Diagram asset storage is also covered by `npm run verify:backend-storage`; that verifier must keep `game_asset_manifest`, `label_anchor_record`, image `alt_text`, `label_audio_cue_id`, and `support_language_progress_allowed` in the backend-neutral schema, migration specs, durable records, and hosted/local adapter plans.

Template rendering and font accessibility storage are also covered by `npm run verify:backend-storage`; that verifier must keep `template_rendering_profile`, `font_accessibility_profile`, student-facing rendering/font blocks, hosted/local adapter write intents, and durable record contracts.

## Non-Goals

- This scaffold does not implement file pickers.
- This scaffold does not store uploaded files.
- This scaffold does not upload, store, approve, publish, sign, route, assign, transcode, playlist, or activate files from evidence packet flows.
- This scaffold does not run OCR, image labeling, media transcoding, virus scanning, or content moderation.
- This scaffold does not make uploaded files student-facing.
- This scaffold does not approve, publish, import, assign, promote, or process upload queue items.
- This scaffold defines upload review storage contracts only; it does not implement target-specific promotion workflows.
- This scaffold defines upload file policy profiles only; it does not validate, scan, checksum, transcode, or store real files yet.
- This scaffold previews disabled intake controls only; it does not render live file inputs or create upload records.
- This scaffold defines upload target mapping only; it does not create draft packages, game assets, playlist bindings, local bundle entries, routes, or assignments.
- This scaffold defines a Labelled Diagram asset workspace only; it does not implement a live image editor, coordinate editor, label editor, upload picker, route promotion, or student-facing image game.
- This scaffold defines a media asset workspace only; it does not implement live media upload, transcoding, playlist creation, background-media assignment, local folder activation, route promotion, or student-facing media progress.
- This scaffold shows target-specific upload promotion readiness only; it does not promote uploads into drafts, game assets, playlists, or local bundles.
- This scaffold defines upload promotion gate storage contracts only; it does not create target records or release uploaded assets.
- This scaffold defines Labelled Diagram asset readiness only; it does not implement a live label editor, coordinate editor, or student-facing image game.
- This scaffold defines Labelled Diagram asset storage contracts only; it does not store live image assets or label anchors yet.
- This scaffold defines multimedia asset readiness only; it does not implement live media uploads, media processing, transcoding, playlist promotion, background-media assignment, or local bundle media activation.
- This scaffold defines content entry options only; it does not implement live file pickers, row persistence, AI generation, template switching, draft saving, or Done-to-student routing.
- This scaffold defines template/font profile readiness only; it does not implement live rendering profiles, font uploads, tenant theme editing, printable rendering, or student-facing template switching.
- This scaffold defines an evidence packet review index only; it does not upload evidence, capture signatures, approve, publish, create routes, assign students, or make evidence packets student-facing.
- This scaffold defines an evidence packet handoff preview only; it does not export packets, collect signatures, publish, promote uploads, create routes, create playlists, or assign students from evidence.
- This scaffold defines evidence export readiness only; it does not generate PDFs, export JSON, create downloadable ZIP files, send email handoffs, capture signatures, mutate release state, or assign students from exported evidence.
- This scaffold defines evidence attachment storage readiness only; it does not upload files, write to object storage, write to local folders, download attachments, attach signed approvals, mutate release state, or make attachments student-facing.
- This scaffold defines evidence storage adapter selection only; it does not select a backend vendor, create buckets, activate local folders, generate signed URLs, migrate attachments, start retention clocks, or enable upload/download behavior.
- This scaffold defines an evidence packet assembly gate only; it does not freeze packet versions, capture approvals, mutate release state, create assignments, generate exports, promote QR routes, promote routes, activate local bundles, write storage, or download evidence.
- This scaffold defines reviewer identity and signature readiness only; it does not authenticate reviewers, capture signatures, create approve buttons, mutate release state, write audit records, upload signature attachments, generate signed PDF packets, download evidence, or create student assignments from approval.
