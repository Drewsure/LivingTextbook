# Living Textbook Planned Build Sessions

Latest hardening: DR-602 replaces audio count-based completeness with per-text coverage checks. Regression coverage includes distinct IDs repeating one word or sentence, complete coverage, alternate recordings, normalization, and reordered references. This improves package validation; it does not establish production backend readiness.

This document gives the project an explicit build-session structure. It should be reviewed when choosing the next work block and updated as the platform matures.

The structure follows the standing rule: foundation first, interaction second, premium polish third.

The playlist role/context slice now rejects a playlist marked for game-background playback unless its usage role is background. This keeps media review, game adapters, and local package manifests aligned.

The media/audio enum integrity slice now rejects unsupported media types, kinds, rights statuses, audio cue kinds/sources, and playlist roles/contexts before runtime adapters can interpret imported package data.

The unit metadata catalog slice now rejects unsupported game modes, game families, and parent engine identifiers before routes, pathways, reports, or future adapters can interpret imported units.

The unit mode compatibility slice now rejects valid-but-incompatible mode metadata when family, parent engine, or curriculum level does not match the curated pathway contract.

The cross-catalog game contract slice now checks that the content-model mode contract and web game catalog agree on family, parent engine, and supported levels before game-mode verification can pass.

The game catalog pedagogical contract slice now checks mode identity, exactly two target sentences, bounded term ranges, and unique ascending supported levels before game-mode verification can pass.

The background media capability slice now rejects multimedia plans that name a supported game mode without explicit catalog permission for optional ambient media, while preserving learning-audio priority.

The game catalog learner-metadata slice now checks role, skill focus, summary, and explicit media capability fields before game-mode verification can pass.

## Build session 0964: Full foundation verification baseline and controlled Z.ai handoff

- Re-ran the complete `npm run verify:foundation` suite on `legacy-source-import`.
- Confirmed the shared content-model boundary, canonical game engines, deterministic
  replays, target-language/audio rules, local/offline bundle gates, source/upload
  review boundaries, persistence/runtime contracts, release-control evidence,
  white-label tenant isolation, AI-service boundaries, and reward/entitlement
  safeguards all pass together.
- Confirmed the production webpack build and typechecks pass, and the active route
  verifier passes all 89 routes, including the teacher prototype workbench and both
  tenant pathways.
- Confirmed the frozen Phaser source identity remains read-only and hash-verified;
  no returned Z.ai candidate package exists yet.
- The next external action is human-triggered: send the isolated Memory Match
  evidence request to `Drewsure/ministar-lab`. A returned packet must remain outside
  `LivingTextbook` until the candidate package verifier and Codex adjudication pass.

Evidence: `npm run verify:foundation`, `node scripts/verify-phaser-source-evidence.mjs`,
and `docs/agent-briefs/ZAI_MEMORY_MATCH_EVIDENCE_REQUEST.md`.

## Build session 0965: Structured source extraction preview boundary

- Added a shared `SourceExtractionPreview` contract for already-extracted PDF,
  DOCX, spreadsheet, manual, and AI-assisted text segments.
- Preserved tenant, source, target-package, checksum, page, sequence, unit, and
  segment-kind lineage while deriving deterministic normalized text and unit
  page summaries.
- Rejected unsupported source methods, missing or malformed checksums, duplicate
  segment identities or page/order pairs, undeclared unit mappings, blank text,
  and unsafe promotion requests.
- Kept parser/OCR promotion, draft creation, package assembly, route creation,
  storage writes, and student-facing payload use blocked.
- Added focused runtime verification and included it in the foundation suite.

Evidence: `packages/content-model/src/sourceExtractionPreview.ts` and
`scripts/verify-source-extraction-preview.mjs`.

## Build session 0966: Source extraction preview workbench bridge

- Added tenant-filtered structured extraction preview fixtures for MiniStar and
  the sample publisher pathway.
- Exposed page, sequence, segment kind, unit identity, normalized text, and
  original-text evidence in the teacher source review workspace.
- Kept the UI read-only and visibly marked every preview as not promoted;
  storage writes, draft creation, package assembly, and student payload use
  remain blocked.
- Extended source-review verification so the route and panel cannot regress to
  packet-only evidence without showing structured lineage.

Evidence: `apps/web/src/data/sampleSourceExtractionPreviews.ts`,
`apps/web/src/features/content-intake/SourceExtractionReviewPacketPanel.tsx`,
and `scripts/verify-source-review-queue.mjs`.

## Build session 0967: Source-to-package extraction preview binding

- Added a required extraction preview identity to source package assembly
  packets.
- Added provider-neutral binding validation for tenant, source, target package,
  source checksum, preview identity, review-only mode, storage blocking, and
  student-payload blocking.
- Updated MiniStar and sample-publisher package fixtures and runtime behavior
  coverage so a package cannot silently consume a different extraction result.

Evidence: `packages/content-model/src/sourcePackageAssembly.ts`,
`packages/content-model/src/sourceExtractionPreview.ts`, and
`scripts/verify-runtime-behavior.mjs`.

## Build session 0968: Package-readiness extraction lineage

- Added the structured extraction preview identity to package-readiness
  reconciliations and provider-neutral persistence metadata references.
- Package-readiness source binding now compares tenant, package assembly,
  extraction preview identity, and source checksum before evidence can be
  reconciled.
- Added preview-ID drift coverage to runtime behavior verification while all
  promotion, storage, assignment, and student activation flags remain blocked.

Evidence: `packages/content-model/src/packageReadinessReconciliation.ts`,
`packages/content-model/src/packageReadinessPersistence.ts`, and
`scripts/verify-runtime-behavior.mjs`.

## Build session 0969: Package-readiness lineage visibility

- Displayed the source assembly packet, structured extraction preview identity,
  and source checksum beside each tenant package readiness reconciliation.
- Displayed the same three lineage references in hosted/local metadata-preview
  intents so future persistence review can audit one consistent evidence chain.
- Kept the panels review-only; no upload, storage write, package promotion,
  route creation, assignment, or student activation was enabled.

Evidence: `apps/web/src/features/content-intake/PackageReadinessReconciliationPanel.tsx`,
`apps/web/src/features/persistence/PackageReadinessPersistencePanel.tsx`, and
the package-readiness verifiers.

## Build session 0970: End-to-end extraction-to-readiness binding

- Added a direct package-readiness validator for tenant, target package,
  extraction preview identity, and source checksum alignment.
- Corrected both sample package chains so source assembly and extraction preview
  checksums agree before readiness evidence is reconciled.
- Added runtime mismatch coverage and kept preview storage, promotion,
  assignment, and student activation blocked.

Evidence: `packages/content-model/src/packageReadinessReconciliation.ts`,
`apps/web/src/data/samplePackageReadinessReconciliation.ts`, and
`scripts/verify-runtime-behavior.mjs`.

## Build session 0976: Frozen snapshot versus returned candidate guidance

- Made the Phaser candidate verifier distinguish a frozen source snapshot from
  an external returned evidence package when the return manifest is absent.
- Added behavior coverage for the missing-manifest handoff so the human-facing
  failure explains the correct next action.
- Preserved the isolation boundary and did not create or import a candidate.

Evidence: `scripts/verify-phaser-candidate-package.mjs`,
`scripts/verify-phaser-candidate-package-behavior.mjs`, and
`docs/agent-briefs/ZAI_MEMORY_MATCH_EVIDENCE_REQUEST.md`.

## Build session 0973: Extraction-preview output invariant validation

- Added a shared validator for the preview object consumed after extraction,
  not only for the original extraction request.
- Reconciled normalized text, segment identity, candidate-unit summaries,
  page ranges, and review-only blocked actions.
- Wired those output checks into composite package-readiness lineage so later
  evidence cannot consume an invalid preview object.
- Added negative checks for normalized-text and summary drift while preserving
  the no-storage and no-student-payload boundary.

Evidence: `packages/content-model/src/sourceExtractionPreview.ts`,
`scripts/verify-source-extraction-preview.mjs`, and
`scripts/verify-source-review-queue.mjs`.

## Build session 0974: Source assembly media-package binding

- Required every candidate media asset named by a source assembly to exist in
  the matching tenant- and package-scoped content package.
- Rejected media assets from another tenant or outside the assembly's declared
  candidate-unit scope.
- Added runtime coverage while keeping upload, rights approval, promotion,
  storage, playlist activation, and student access blocked.

Evidence: `packages/content-model/src/sourcePackageAssembly.ts`,
`apps/web/src/data/sampleSourcePackageAssembly.ts`, and
`scripts/verify-runtime-behavior.mjs`.

## Build session 0975: Composite media-package readiness binding

- Passed the tenant-scoped content package into composite package-readiness
  lineage validation.
- Rejected missing, cross-tenant, missing-package, and out-of-candidate-unit
  media references before readiness evidence can pass.
- Added a runtime regression while keeping upload, rights approval, storage,
  playlist activation, promotion, assignment, and student access blocked.

Evidence: `packages/content-model/src/packageReadinessReconciliation.ts`,
`apps/web/src/data/samplePackageReadinessReconciliation.ts`, and
`scripts/verify-runtime-behavior.mjs`.

## Build session 0971: Extraction preview candidate-unit binding

- Required every source assembly candidate unit to be declared by its bound
  structured extraction preview.
- Reconciled both sample source assemblies against their preview fixtures and
  surfaced binding findings in the source-to-package review panel.
- Added a negative runtime case for an undeclared candidate unit while keeping
  draft creation, promotion, storage, assignment, and student access blocked.

Evidence: `packages/content-model/src/sourcePackageAssembly.ts`,
`apps/web/src/data/sampleSourcePackageAssembly.ts`, and
`scripts/verify-runtime-behavior.mjs`.

## Build session 0972: Direct package-readiness lineage binding

- Added one composite review-only validator for readiness, source assembly,
  and extraction preview identity.
- Reused the candidate-unit subset rule inside that composite chain so a
  readiness packet cannot pass with a valid-looking but differently scoped
  assembly or preview.
- Added a negative runtime case for readiness lineage unit drift while keeping
  promotion, storage, assignment, and student activation blocked.

Evidence: `packages/content-model/src/packageReadinessReconciliation.ts`,
`apps/web/src/data/samplePackageReadinessReconciliation.ts`, and
`scripts/verify-runtime-behavior.mjs`.

## Build session 0878: Persistence review-probe provider parity

- Corrected the durable progression read path so a tenant-scoped teacher review
  probe does not require a learner session cookie after teacher authorization.
- Kept student continuity reads bound to the matching signed learner session or
  server authorization.
- Hardened the browser client to distinguish blocked policy, unauthorized
  access, missing records, provider unavailability, conflicts, and malformed
  transport responses.
- Added static verification and recorded ADR 0878 and DR-950.

## Build session 0879: Persistence operator-state clarity

- Made the teacher hosted-adapter panel distinguish available, no-record,
  protected, blocked, unavailable, and malformed-response states.
- Preserved the rule that “no record” is never a proxy for a deployment or
  provider failure.
- Added static verification and recorded ADR 0879 and DR-951.

## Build session 0880: Persistence effective readiness

- Unified the durable persistence status and health calculations around one
  effective readiness error set.
- Ensured open school, retention, release, or durable-write policy gates cannot
  coexist with a healthy durable deployment signal.
- Preserved explicit non-durable rehearsal semantics.
- Added static verification and recorded ADR 0880 and DR-952.

## Build session 0881: Pilot preflight persistence binding

- Bound controlled pilot-session preflight to the authoritative tenant-scoped
  persistence status result.
- Kept missing status open and every non-healthy state blocked; only an
  explicitly healthy result can satisfy the persistence readiness check.
- Preserved review-only boundaries: classroom launch and durable writes remain
  disabled even when all evidence is ready for human review.
- Added focused runtime/static verification and recorded ADR 0881 and DR-953.

## Build session 0882: Pilot preflight tenant-bound readiness

- Added tenant identity, durability, and check timestamp evidence to the
  persistence status boundary.
- Required pilot readiness to match the evidence envelope tenant and use the
  durable-managed provider boundary; non-durable rehearsal remains blocked.
- Cleared prior tenant readiness before a new teacher status request resolves,
  preventing stale cross-tenant review state.
- Added focused runtime/static verification and recorded ADR 0882 and DR-954.

## Build session 0883: Pilot preflight readiness freshness

- Added a five-minute freshness window for the authoritative persistence status
  used by controlled pilot preflight.
- Rejected stale and future-dated snapshots while preserving deterministic,
  clock-injected runtime verification.
- Kept refresh/readiness read-only and all classroom launch and durable-write
  boundaries blocked.
- Added focused runtime/static verification and recorded ADR 0883 and DR-955.

## Build session 0884: Pilot status refresh

- Added a one-minute read-only persistence status refresh to long-lived teacher
  evidence panels.
- Preserved tenant-change reset, unmount protection, interval cleanup, and all
  review-only boundaries.
- Added static verification and recorded ADR 0884 and DR-956.

## Build session 0885: Phaser snapshot identity normalization

- Standardized frozen Z.ai/Phaser candidate review records on the immutable
  `frozen-2026-09-12-aaa-stable` tag.
- Preserved the exact freeze commit SHA as the cryptographic source identity
  and removed the competing hash-derived snapshot label from active checks.
- Kept all candidate promotion, source import, route replacement, and student
  assignment actions blocked.
- Added static/runtime verification and recorded ADR 0885 and DR-957.

## Build session 0886: Phaser source identity content-model gate

- Centralized the approved frozen Phaser repository, snapshot tag, and exact
  commit in the shared content model.
- Required candidate contract reviews and the Memory Match evidence handoff to
  reject provenance drift before wrapper review or integration planning.
- Preserved read-only hash verification and all source import, route
  replacement, promotion, and assignment blockers.
- Added a negative runtime case and recorded ADR 0886 and DR-958.

## Build session 0887: Phaser returned-package identity gate

- Required returned Phaser and hybrid package manifests to carry the same
  canonical frozen tag and exact source commit as candidate reviews.
- Preserved a provider-neutral not-returned path for DOM-reference previews.
- Added negative returned-package provenance coverage and recorded ADR 0887
  and DR-959.

## Build session 0888: Returned package status surface

- Replaced the hard-coded `Not returned` label with manifest-derived status
  labels for not-returned, review-only, and blocked packages.
- Exposed the exact source commit on returned Phaser/hybrid evidence when it is
  present, without changing any approval or import behavior.
- Added focused readiness verification and recorded ADR 0888 and DR-960.

## Build session 0889: Returned package request lineage

- Added one authoritative generation request ID to the prototype intake queue,
  return checklist, and returned-package manifest chain.
- Rejected returned-package request mismatches against both the checklist and
  original intake queue item, with negative runtime coverage.
- Exposed request identity on teacher review surfaces while keeping imports,
  routes, promotion, and assignments blocked.
- Recorded ADR 0889 and DR-961.

## Build session 0890: Evidence bundle returned manifest binding

- Bound the returned-package manifest into every prototype evidence alignment
  bundle and reused its shared validator.
- Rejected cross-request manifests and duplicate manifest identities in the
  evidence collection.
- Preserved the review-only boundary and recorded ADR 0890 and DR-962.

## Build session 0810: Cross-route progression handoff

- Added a session-scoped progression handoff record keyed by tenant, package, launch, student session, and exact destination route.
- Added a launch action that stores the validated handoff before navigating to the curated next activity route.
- Added destination-shell hydration that accepts only a matching handoff and keeps direct routes locked otherwise.
- Preserved existing inline game start behavior for comparison during rehearsal.

## Build session 0811: First hosted progression rehearsal adapter

- Added a shared hosted progression record and write/read validators.
- Added a route-backed process-local rehearsal adapter with explicit policy, school-acceptance, non-durable, and idempotency gates.
- Default behavior remains blocked; this does not claim durable production persistence.
- Added ADRs DR-882/DR-883 and the focused static verification script.

## Build session 0813: First durable progression provider

- Added a server-only SQLite progression provider with restart-persistent records.
- Enforced tenant/package/launch/student composite identity and idempotency-key conflict checks.
- Added explicit durable provider, write, school-policy, retention, release-approval, and bearer-token gates.
- Kept process-memory rehearsal mode isolated and labelled non-durable.
- Added a standing durable-storage verifier, environment contract, ADR 0813, and DR-885.

This is a production-shaped closed/local pilot provider. Cloud deployment still
requires authentication, backups, encryption-at-rest, monitoring, and a hosted
provider operations review.

## Session 0: Standards And Decisions Gate

Purpose: Ensure the project still follows the white-label saleable platform direction before work begins.

Required reads:

- `docs/PRINCIPLES_AND_STANDARDS.md`
- `docs/DECISION_REGISTER.md`
- `docs/FUTURE_REQUIREMENTS.md`
- `docs/COMPETITIVE_FEATURE_COVERAGE_MATRIX.md` when teacher authoring, activity switching, printables, sharing, library, or competitor coverage is being discussed
- `docs/OPERATING_NOTES.md`
- `docs/RESEARCH_NOTES_PUBLIC_REPOS.md` when major custom systems or external assets are being considered

Outputs:

- Any new principle or decision is documented.
- Any recurring workaround is documented.
- Any major architecture choice is entered in the decision register.
- Any public-repository or public-asset candidate has license/provenance review before adoption.
- `/teacher/intake` exposes the current foundation verification gate so partner/admin review can see the canonical command and what it protects.
- `/teacher/intake` exposes a build stage map so foundation structure, active game route shell readiness, backend review-only status, live pilot blockers, game design timing, and Z.ai intake gating are visible before deeper implementation decisions.
- `/teacher/intake` exposes competitive feature coverage so teacher time-saving, curated activity pathways, private libraries, printables, and target-language expansion are visible during admin review.
- `/teacher/intake` exposes activity pathway compatibility so offered, planned, premium, teacher-review, and blocked outputs are visible before authoring or printables are built.
- `/teacher/intake` exposes printable output readiness so worksheet/PDF expectations are planned without pretending export is ready.
- `/teacher/intake` exposes private tenant library planning so community-resource expectations have a safe v1 workaround before public sharing.
- `/teacher/intake` exposes share/embed readiness so private assignment links can advance while public sharing and iframe embeds remain gated.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `private_assignment_link` before real assignment access, public sharing, iframe embed, teacher/admin exposure, real learner data collection, or report export workflows can be designed.
- Private assignment routes must remain focused assignment previews, not public activity pages, public community sharing, or iframe embeds.
- `/teacher/intake` exposes teacher authoring readiness so fast creation/editing remains draft-first and review-gated.
- `/teacher/intake` exposes assignment rollout gates so reviewed assignments, demo previews, blocked partner pilots, local companion drafts, media-rights blockers, report-policy blockers, persistence blockers, and game-audio coverage remain visible before scheduling.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `teacher_assignment_rollout_gate`, generated-package handoff source evidence ids, and generated package policy notes before assignment scheduling, generated handoff, student launch, live classroom launch, real learner data collection, or report export workflows can be designed.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `source_extraction_review_packet` before OCR/parser/AI extraction output can feed teacher drafts, package releases, route creation, games, media playlists, local bundles, or assignments.
- `/teacher/intake` exposes target-language expansion readiness so Japanese-as-target-language and other non-English target-language opportunities are not confused with assist-language support.
- `/teacher/uploads/sample-publisher` exposes the dedicated upload workspace so file intake, review, promotion, Labelled Diagram image assets, and multimedia asset gates have a visible route boundary before live file pickers or storage are built.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `upload_file_policy_profile` before live file pickers, drag-and-drop upload, MIME validation, checksum capture, malware scan, transcode, object storage write, local upload folder, or upload promotion workflows can be designed.
- `/teacher/uploads/sample-publisher`, `/teacher/assets/labelled-diagram/sample-publisher-l1-u1-labelled-diagram`, and `/teacher/assets/media/sample-publisher-l1-u1-routines-media` expose evidence packet flows before live file inputs, object/local storage, approval actions, publish actions, route creation, label editing, media transcoding, playlist creation, or assignment shortcuts are built.
- `/teacher/evidence/sample-publisher` exposes the tenant evidence packet review index so upload, Labelled Diagram, and media evidence blockers stay visible in one admin route before live evidence upload, signed approval capture, promotion, publishing, route creation, playlist creation, or assignment shortcuts are built.
- `/teacher/evidence/sample-publisher/handoff` exposes the evidence packet handoff preview so export packet shape, recipient duties, and next gates are visible before evidence export, signed approval capture, promotion, publishing, route creation, playlist creation, or assignment shortcuts are built.
- `/teacher/intake` exposes evidence export readiness so PDF, JSON, local manifest, email handoff, signature capture, release-state mutation, and student assignment remain blocked until identity, attachment storage, retention/export policy, and release-control gates are accepted.
- `/teacher/intake` exposes evidence attachment storage readiness so hosted object storage, closed local evidence folders, and hybrid export archives stay blocked until quarantine paths, checksums, malware scan status, retention, delete/export policy, access controls, backup responsibility, and release-control rules are accepted.
- `/teacher/intake` exposes evidence storage adapter selection so hosted managed storage can be treated as the controlled first-pilot recommendation while closed local evidence storage and hybrid archive movement remain explicit, policy-gated, higher-complexity options.
- `/teacher/intake` exposes shared progress event taxonomy validation so support-only, report-only, and progress-affecting event boundaries stay reviewable before any game, media, speech, AI Tutor, reward, assignment, report, upload, or storage workflow can affect mastery, Star Dust, or unlocks.
- `/teacher/intake` exposes teacher session settings review packets so learner audio, target-language progression, assist-language limits, microphone opt-in, background media priority, optional paid AI Tutor, report policy, and hosted/local settings persistence are visible before any setting save, live classroom launch, student event storage, report export, raw microphone upload, or support-language progress can exist.
- `/teacher/session-settings` gives teacher launch-session settings their own focused workbench so support-language boundaries, microphone approval, background media, optional paid AI Tutor, Training Academy recovery, report export, and settings persistence warnings stay reviewable before live setting saves.
- `/teacher/reporting` gives coded learner identity, teacher-visible summaries, report package boundaries, event acceptance, export blockers, support-only signals, and sensitive-data exclusions their own focused route before live report export, production learner accounts, or persistent student events exist.
- `/teacher/entitlements` gives optional paid packages their own focused workbench and white-label package catalog so AI generation, Voice Tutor, microphone scoring, speech APIs, hosted storage, report export, and local companion mode remain tenant/school decisions before billing, microphone prompts, or package activation exist.
- `/teacher/entitlements` exposes package adoption readiness so premium package proposals show required approvals, durable records, cost review, policy review, blocked actions, owners, and next steps before purchase flows, activation toggles, billing, microphone prompts, report export, hosted storage, or local companion activation can exist.
- `/teacher/entitlements` exposes future package adoption record previews so accepted-record fields, required evidence, acceptance scopes, blocked writes, and rollback hooks are visible before any premium package activation workflow is designed.
- `npm run verify:package-entitlements` is part of the foundation gate and must pass before package tiers, premium feature copy, AI generation entitlements, Voice Tutor, microphone scoring, report export, hosted storage, or local companion activation rules are changed.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve the teacher session settings review packet with launch sessions before any setting save, live classroom launch, student event storage, report export, raw microphone upload, or support-language progress can exist.
- `/teacher/maintenance/sample-publisher` gives publisher maintenance its own focused route workspace with blocked live actions before media replacement, route mutation, game availability publishing, report policy changes, local bundle release, or partner self-maintenance actions are enabled.
- `/teacher/release-control/sample-publisher` gives release candidate, package publish gate, and approval ledger review its own focused route workspace before publish buttons, release-state mutation, assignment activation, local bundle release, student-ready markers, or support-language-only releases are enabled.
- `/teacher/sessions/demo-unit-1` and `/teacher/sessions/partner-demo-unit-1` expose progress event envelope gates so sample event streams prove taxonomy version, event effect, event acceptance gate binding, settings context, unit, mode, timestamp, safe metadata, and duplicate-id checks before live event storage is designed.
- Progress event envelopes must preserve settings context as report-only evidence: the active game mode settings profile and teacher session settings snapshot may be shown in reports, but support-language progress, media-only progress, and scoring profile overrides remain blocked.
- `/teacher/sessions/demo-unit-1/report-package` and `/teacher/sessions/partner-demo-unit-1/report-package` expose report settings context so export-shaped teacher reports can preview reviewed settings profile references without enabling report export or settings-based scoring authority.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve report package settings context summaries before report export, local report handoff, or teacher-facing report package storage can exist.
- `/teacher/generator/sample-publisher` exposes shared schema guard blocks and warnings for AI-generated draft payloads before review, persistence, verifier submission, package assembly, route creation, playlist creation, or assignment can be considered.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose a generator route map so request setup, prototype review, integration gates, package review, and draft repair stay navigable as the review surface grows.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose a shared lineage guard so request-to-review chains must keep required records visible and block live generation, verifier submission, package assembly, route creation, playlist creation, local bundle writes, student assignment, and student-ready markers.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose an AI generator review summary so section readiness, primary blockers, next required records, source records, and blocked actions are visible before detailed review panels.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose a shared review summary guard so the top rollup must keep required sections, review-only boundaries, blockers, next records, source records, and blocked live-generator actions before it can inform future workflow decisions.
- AI generator review summaries must surface package writer harness implementation decision blockers before teachers reach the long package-review section.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose an AI generator reviewer runbook so human reviewers have a safe order of review, standing rules, evidence links, required records, and blocked shortcuts before detailed panels.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose a shared reviewer runbook guard so review order remains guidance-only, ordered, evidence-backed, and blocked from live model calls, app patching, package assembly, route or playlist creation, and student assignment.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose an AI generator responsibility matrix so teachers, Codex, outside AI builders/Z.ai, verifier checks, and platform admins have separate duties before live generation, app writes, scoring authority, route creation, playlist creation, package assembly, or assignment exists.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose a shared responsibility matrix guard so role ownership remains review-only, Codex-owned for integration, outside-builder-isolated, verifier-owned for support-language blocking, and platform-admin-owned for cost and premium boundaries.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generator_responsibility_matrix` before generator role ownership can inform outside-builder handoff, live generation, app patching, scoring authority, package assembly, route creation, playlist creation, assignment creation, local bundle writes, or student-ready marker work.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generator_review_summary` before generator summaries can inform live generation, app patching, package assembly, route creation, playlist creation, assignment creation, local bundle writes, or student-ready marker work.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generator_reviewer_runbook` before generator review order can inform live generation, app patching, package assembly, route creation, playlist creation, assignment creation, local bundle writes, or student-ready marker work.
- `/teacher/generator/sample-publisher` exposes an AI draft correction queue so validation output becomes schema/audio/progress repair work with owners and next records before any auto-fix, live regeneration, verifier submission, package assembly, route creation, playlist creation, or assignment exists.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose a shared correction queue guard so generated draft repair queues must keep status/counts aligned, owned repair items visible, next requirements present, and auto-fix, live AI regeneration, verifier submission, package assembly, route or playlist creation, and student assignment blocked.
- `/teacher/generator/sample-publisher` exposes an AI reward readiness gate so generated rewards preserve deterministic Star Dust, accepted event sources, correction-queue clearance, and collection unlock records before reward publishing, inventory writes, Spin Wheel tickets, avatar evolution, or assignment exists.
- `/teacher/generator/sample-publisher` exposes an AI generated publish readiness gate so correction queue, verifier, manifest, reward, release-control, and teacher approval blockers are visible before any generated route, playlist, assignment, local bundle, or student-ready marker exists.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI generator tenant coverage so each tenant request shows covered, partial, and missing preview records before live generation, verifier submission, package assembly, route creation, playlist creation, or student assignment exists.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose a shared tenant coverage guard so every tenant request must show all required generator lanes, consistent lane counts, next requirements, and blocked live-generator actions before any generated workflow can advance.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI generated game build brief packets so Z.ai or outside prototype work receives strict parent-engine, JSON fixture, audio, event, scoring, integration, deliverable, and blocked-action instructions before any standalone game promotion, Phaser bypass, route write, scoring override, or student assignment exists.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose a shared generated game build brief guard so outside prototype instructions preserve source records, standard events, target-language audio, support-only assist audio, deterministic scoring, isolated deliverables, and Phaser-only-through-wrapper boundaries before any external handoff is treated as valid.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_game_build_brief` before outside prototype briefs can become integration review inputs, Phaser wrapper reviews, route writes, scoring profile changes, assignments, or generated-game promotion.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI external prototype task packets so generated build briefs can become copy-ready, review-only Z.ai/outside-builder instructions with `Drewsure/ministar-lab only` scope, DOM/Phaser wrapper guidance, fixture/event/audio/scoring requirements, return evidence, and blocked live handoff, app writes, scoring authority, package assembly, routes, playlists, rewards, and assignments.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose a shared external task packet guard so copy-ready Z.ai/outside-builder instructions cannot become prompt copy, issue creation, archive export, live handoff, returned prototype review, app patch planning, route integration, scoring changes, reward work, playlist creation, package assembly, student-facing preview, or assignment without required source records, Codex confirmation, scoped repository output, and return-evidence coverage.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_external_prototype_task_packet` before copy-ready outside-builder instructions can become durable handoff/export, return-review intake, app patch planning, route integration, scoring changes, rewards, playlists, package assembly, student-facing previews, or assignments.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI external task export readiness gates so prompt copy, repository issue creation, archive download, live handoff, app writes, routes, scoring authority, student-facing pathways, and support-language progress stay blocked until reviewer identity, evidence storage, task packet storage, repository policy, return-review intake, and Codex owner confirmation exist.
- Codex will explicitly alert the user when the LivingTextbook foundation is ready for controlled Z.ai game intake; before that point, Z.ai work remains useful external prototype inventory, not a source for direct app integration or route promotion.
- `/teacher/game-readiness` must show the Z.ai prototype intake alert so the user can see the not-ready status, ready-when conditions, evidence requirements, blocked actions, and Codex ownership rule before any external prototype intake begins.
- `/teacher/game-readiness` and tenant prototype review workbenches must show the prototype intake queue so Z.ai/outside prototype inventory has a visible review order, repository scope, missing evidence, and blocked-action list before any import, Phaser wrapper, route, scoring, reward, playlist, package, or assignment work begins.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `prototype_intake_queue_item` before outside game inventory can become return-review, wrapper-review, route, scoring, reward, playlist, package, or assignment work.
- `/teacher/game-readiness` and tenant prototype review workbenches must show the prototype intake storage guard so the queue's storage contract ids, visible fields, required evidence, and blocked intake actions are visible before any outside-game intake workflow exists.
- `/teacher/game-readiness` and tenant prototype review workbenches must show the prototype intake evidence packet flow so source snapshot, fixture replay, event/scoring replay, target-language audio, mobile/accessibility, and wrapper-boundary evidence are visible before controlled review can advance.
- `/teacher/game-readiness` and tenant prototype review workbenches must show the prototype intake readiness summary so Codex can clearly say when controlled Z.ai/outside prototype intake is not ready, which lanes are ready, and which lanes remain missing or blocked.
- `/teacher/game-readiness` must show the activity pathway compatibility matrix so game design, Phaser wrappers, printables, and outside prototype conversations stay tied to curated offered/planned/premium/teacher-review/blocked pathways instead of unrestricted switch-template behavior.
- Activity pathway compatibility panels must expose learner-audio requirements and teacher-reporting requirements so payload fit alone cannot green-light games, printables, AI generation, Phaser wrappers, or outside prototype intake.
- `/teacher/game-readiness` and `/teacher/intake` must show both the MiniStar flagship unit game offer map and a non-MiniStar partner offer map through the same component so game availability stays white-label instead of MiniStar-only.
- Unit game offer maps must show per-game reporting requirements so teacher reports, support-only events, speech privacy, and future Z.ai prototype evidence stay reviewable before live game integration.
- Student activity hubs should draw reviewed game cards from the same unit game offer maps while keeping launch, Training Academy, print, and media as explicit support routes.
- Shared game completion cards should prefer reviewed unit game offer maps for next-activity suggestions and fall back to launch-session recommendations only when no reviewed map exists.
- Recommended game path cards on launch, front-door, and flashcard routes should prefer reviewed unit game offer maps and fall back to launch-session recommendations only when no reviewed map exists.
- AI external task export readiness gates must use the shared `validateAiExternalPrototypeTaskExportReadinessGate` guard and show `Export readiness guard active`, `Export readiness guard blocks`, and `Export readiness guard warnings` before any future export UI can be considered.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_external_task_export_readiness_gate` before prompt copy, repository issue creation, archive download, live handoff, app writes, route creation, scoring authority, student-facing pathways, or support-language progress can become workflow actions.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI prototype return review gates so returned Z.ai/outside work must prove parent-engine wrapping, JSON fixture conformance, standard event replay, audio cue coverage, deterministic scoring, mobile accessibility, and white-label fit before any production merge, route write, scoring mutation, audio manifest mutation, assignment, or student-facing preview exists.
- AI prototype return reviews must use the shared `validateAiPrototypeReturnReviewPacket` guard and show `Return review guard active`, `Return review guard blocks`, and `Return review guard warnings` before returned prototype evidence can be treated as integration-ready.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_prototype_return_review` before returned prototype artifacts can become wrapper integration, route writes, scoring profile mutations, audio manifest mutations, assignments, or student-facing previews.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI prototype integration plans so returned prototype work has a wrapper-first path through quarantine, adapter proposal, fixture replay, event replay, audio coverage, scoring replay, mobile/accessibility review, white-label checks, and Codex decision before any direct import, route write, game sequence mutation, scoring mutation, audio manifest mutation, package promotion, or assignment exists.
- AI prototype integration plans must use the shared `validateAiPrototypeIntegrationPlan` guard, include `prototype_scoring_replay_report`, and show `Integration plan guard active`, `Integration plan guard blocks`, and `Integration plan guard warnings` before any wrapper integration work is treated as ready.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_prototype_integration_plan` before wrapper adapter work can become direct app imports, route writes, game sequence changes, scoring mutations, audio manifest mutations, package promotion, or assignments.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI prototype wrapper adapter reviews so returned prototypes must prove fixture input, standard event output, state ownership, wrapper evidence, and rejection triggers before direct app import, route writes, scoring or audio mutation, tenant hard-coding, package promotion, or assignment exists.
- AI prototype wrapper adapter reviews must use the shared `validateAiPrototypeWrapperAdapterReview` guard and show `Wrapper guard active`, `Wrapper guard blocks`, and `Wrapper guard warnings` before returned prototype wrappers can be treated as replay-ready.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_prototype_wrapper_adapter_review` before returned prototypes can become parent-engine wrappers, direct app imports, route writes, scoring/audio authority, reward writes, package promotion, or assignments.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI prototype fixture replay reports so returned prototypes must prove reviewed JSON fixture loading, fixture coverage, target-language progress, audio cue references, tenant theme injection, replay evidence, and failure triggers before direct app import, route writes, scoring/audio mutation, reward writes, package promotion, or assignment exists.
- AI prototype fixture replay reports must use the shared `validateAiPrototypeFixtureReplayReport` guard and show `Fixture replay guard active`, `Fixture replay guard blocks`, and `Fixture replay guard warnings` before event replay, audio coverage, scoring replay, mobile accessibility inspection, Codex integration decisions, app patch planning, route planning, package promotion, or assignment can be considered.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_prototype_fixture_replay_report` before returned prototypes can claim fixture-driven content, target-language progress, tenant theme injection, audio safety, scoring safety, package promotion, or assignment readiness.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI prototype event replay reports so returned prototypes must prove standard event order, allowed payload fields, accepted progress effects, and blocked hidden progress/score/reward/route/report/assignment side effects before integration review continues.
- AI prototype event replay reports must use the shared `validateAiPrototypeEventReplayReport` guard and show `Event replay guard active`, `Event replay guard blocks`, and `Event replay guard warnings` before audio coverage, scoring replay, mobile accessibility inspection, Codex integration decisions, app patch planning, route planning, package promotion, assignment, or report export can be considered.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_prototype_event_replay_report` before returned prototypes can claim standard event, progress, reporting, scoring, reward, route, playlist, local bundle, package promotion, or assignment readiness.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI prototype audio coverage reports so returned prototypes must prove tap-to-speak coverage, target-language checks, control audio checks, support-language rules, replay evidence, and blocked generated voice, voice API cost, audio manifest mutation, playlist write, media-only mastery, support-language progress, or assignment before integration review continues.
- AI prototype audio coverage reports must use the shared `validateAiPrototypeAudioCoverageReport` guard and show `Audio coverage guard active`, `Audio coverage guard blocks`, and `Audio coverage guard warnings` before scoring replay, mobile accessibility inspection, Codex integration decisions, app patch planning, route planning, package promotion, assignment, playlist writes, or audio-complete markers can be considered.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_prototype_audio_coverage_report` before returned prototypes can claim target-language tap-to-speak, control replay, support-language, background-media, audio-complete, playlist, package promotion, or assignment readiness.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI prototype mobile accessibility reports so returned prototypes must prove mobile viewport smoke evidence, touch targets, keyboard/focus order, readable text, no hidden black-button text, no viewport overflow, and accessible Phaser/canvas controls before integration review continues.
- AI prototype mobile accessibility reports must use the shared `validateAiPrototypeMobileAccessibilityReport` guard and show `Mobile accessibility guard active`, `Mobile accessibility guard blocks`, and `Mobile accessibility guard warnings` before Codex integration decisions, app patch planning, route planning, package promotion, assignment, accessibility waivers, or student-facing previews can be considered.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_prototype_mobile_accessibility_report` before returned prototypes can claim mobile layout, accessible controls, apps/web integration, route writes, student previews, package promotion, or assignment readiness.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI prototype scoring replay reports so returned prototypes must prove deterministic scoring, parent scoring profile ownership, accepted progress effects, collection boundary checks, Star Dust caps, and blocked direct score/reward/media/support-language mastery side effects before integration review continues.
- AI prototype scoring replay reports must use the shared `validateAiPrototypeScoringReplayReport` guard and show `Scoring replay guard active`, `Scoring replay guard blocks`, and `Scoring replay guard warnings` before Codex integration decisions, app patch planning, route planning, package promotion, assignment, Star Dust writes, mastery updates, reward writes, random rewards, or collection unlocks can be considered.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_prototype_scoring_replay_report` before returned prototypes can claim scoring safety, Star Dust readiness, mastery readiness, reward readiness, package promotion, or assignment readiness.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI prototype Codex integration decision previews so manual Codex review, no-decision-recorded state, evidence requirements, and blocked app patch/direct import/route/scoring/reward/audio/package/assignment actions are visible before integration approval exists.
- AI prototype Codex integration decisions must use the shared `validateAiPrototypeCodexIntegrationDecision` guard and show `Codex decision guard active`, `Codex decision guard blocks`, and `Codex decision guard warnings` before integration readiness gates, app patch planning, route planning, package promotion, assignment, scoring profile mutation, Star Dust or reward writes, or audio manifest mutation can be considered.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `codex_integration_review_decision` before returned prototypes can claim integration approval, app-patch generation, route readiness, scoring mutation readiness, reward readiness, package promotion, or assignment readiness.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI prototype integration readiness gates so wrapper, fixture, event, audio, mobile, scoring, and Codex decision evidence must be reviewed before any `apps/web` patch, route write, student-facing route, Star Dust or reward write, package promotion, or assignment can be considered.
- AI prototype integration readiness gates must use the shared `validateAiPrototypeIntegrationReadinessGate` guard and show `Integration readiness guard active`, `Integration readiness guard blocks`, and `Integration readiness guard warnings` before app patch proposals, route planning, package promotion, assignment, scoring profile mutation, Star Dust or reward writes, audio manifest mutation, or student-facing previews can be considered.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_prototype_integration_readiness_gate` before returned prototypes can claim all-evidence-reviewed, Codex-reviewed, app patch, route, scoring, reward, package promotion, or assignment readiness.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI prototype app patch proposal previews so future file scope, required pre-patch gates, required test gates, and blocked app file write/generated route/scoring/reward/audio/package/assignment actions are visible before any actual app patch can be generated.
- AI prototype app patch proposals must use the shared `validateAiPrototypeAppPatchProposal` guard and show `Patch proposal guard active`, `Patch proposal guard blocks`, and `Patch proposal guard warnings` before patch test readiness, patch harness planning, route planning, package promotion, assignment, scoring profile mutation, Star Dust or reward writes, audio manifest mutation, or app file work can be considered.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_prototype_app_patch_proposal` before returned prototypes can claim app file write, generated patch, direct import, route, scoring, reward, audio manifest, package promotion, assignment, or support-language progress readiness.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI prototype patch test readiness gates so fixture, event, audio, mobile, scoring, route, storage, rollback, and support-language boundary checks are visible before future patch test harness or app file work.
- AI prototype patch test readiness gates must use the shared `validateAiPrototypePatchTestReadinessGate` guard and show `Patch test readiness guard active`, `Patch test readiness guard blocks`, and `Patch test readiness guard warnings` before patch harness plans, harness implementation proposals, route planning, package promotion, assignment, scoring profile mutation, Star Dust or reward writes, audio manifest mutation, app file work, or test execution can be considered.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_prototype_patch_test_readiness_gate` before returned prototypes can claim patch test execution, app file write, generated patch, route, scoring, reward, audio manifest, package promotion, assignment, or support-language progress readiness.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI prototype patch test harness plans so fixture replay, standard events, target-language audio, mobile accessibility, deterministic scoring, route safety, storage contract, rollback dry-run, and support-language boundary checks are planned without runnable test execution or app file writes.
- AI prototype patch test harness plans must use the shared `validateAiPrototypePatchTestHarnessPlan` guard and show `Test harness plan guard active`, `Test harness plan guard blocks`, and `Test harness plan guard warnings` before harness implementation proposals, route planning, package promotion, assignment, scoring profile mutation, Star Dust or reward writes, audio manifest mutation, app file work, test execution, or Playwright runs can be considered.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_prototype_patch_test_harness_plan` before returned prototypes can claim runnable harness, Playwright execution, app file write, generated patch, route, scoring, reward, audio manifest, package promotion, assignment, or support-language progress readiness.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI prototype patch harness implementation proposals so future file scope, dry-run-only checks, route safety, rollback, storage, and Codex approval requirements are visible before any harness implementation, test execution, Playwright run, app file write, route mutation, scoring or reward mutation, package promotion, assignment, or support-language progress trigger can exist.
- AI prototype patch harness implementation proposals must use the shared `validateAiPrototypePatchHarnessImplementationProposal` guard and show `Harness implementation proposal guard active`, `Harness implementation proposal guard blocks`, and `Harness implementation proposal guard warnings` before Codex patch approval decisions, route planning, package promotion, assignment, scoring profile mutation, Star Dust or reward writes, audio manifest mutation, app file work, harness implementation, test execution, or Playwright runs can be considered.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_prototype_patch_harness_implementation_proposal` before returned prototypes can claim harness implementation, runnable tests, Playwright execution, app file write, generated patch, route, scoring, reward, audio manifest, package promotion, assignment, or support-language progress readiness.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI prototype Codex patch approval decision previews so patch scope, route safety, rollback, storage, reviewer identity, and MiniStar hiragana support boundaries are visible before any Codex patch approval, app file write, patch generation, test execution, Playwright run, route mutation, scoring or reward mutation, audio manifest mutation, package promotion, assignment, or support-language progress trigger can exist.
- AI prototype Codex patch approval decisions must use the shared `validateAiPrototypeCodexPatchApprovalDecision` guard and show `Codex patch approval decision guard active`, `Codex patch approval decision guard blocks`, and `Codex patch approval decision guard warnings` before signed approval preflights, release locks, patch work orders, change set previews, route planning, package promotion, assignment, scoring profile mutation, Star Dust or reward writes, audio manifest mutation, app file work, harness implementation, test execution, or Playwright runs can be considered.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `codex_patch_approval_decision` before returned prototypes can claim patch approval, app file write, generated patch, test execution, Playwright run, route, scoring, reward, audio manifest, package promotion, assignment, or support-language progress readiness.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI prototype signed approval preflights so authenticated reviewer identity, patch scope locks, evidence checklists, and no-approval blockers are visible before any signed approval capture, approve button, patch authorization, app file write, route mutation, scoring or reward mutation, package promotion, assignment, or support-language progress trigger can exist.
- AI prototype signed approval preflights must use the shared `validateAiPrototypeSignedApprovalPreflight` guard and show `Signed approval preflight guard active`, `Signed approval preflight guard blocks`, and `Signed approval preflight guard warnings` before release locks, patch work orders, change set previews, route planning, package promotion, assignment, scoring profile mutation, Star Dust or reward writes, audio manifest mutation, app file work, patch generation, harness implementation, test execution, or Playwright runs can be considered.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_prototype_signed_approval_preflight` before returned prototypes can claim signed approval capture, approve button, patch authorization, app file write, generated patch, test execution, Playwright run, route, scoring, reward, audio manifest, package promotion, assignment, or support-language progress readiness.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI prototype patch authorization release locks so release-control binding, signed approval acceptance, patch scope, test evidence, route safety, rollback, storage, reviewer identity, narrow authorization scope, and no-patch-authorization blockers are visible before any app file work can exist.
- AI prototype patch authorization release locks must use the shared `validateAiPrototypePatchAuthorizationReleaseLock` guard and show `Patch authorization release lock guard active`, `Patch authorization release lock guard blocks`, and `Patch authorization release lock guard warnings` before patch work orders, change set previews, route planning, package promotion, assignment, scoring profile mutation, Star Dust or reward writes, audio manifest mutation, app file work, patch generation, harness implementation, test execution, or Playwright runs can be considered.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_prototype_patch_authorization_release_lock` before returned prototypes can claim patch authorization, app file write, generated patch, test execution, Playwright run, route, scoring, reward, audio manifest, package promotion, assignment, or support-language progress readiness.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI prototype patch implementation work orders so required-before-work records, allowed future file groups, dry-run verification order, rollback plan, and no-work-order-execution blockers are visible before any app file work can exist.
- AI prototype patch implementation work orders must use the shared `validateAiPrototypePatchImplementationWorkOrder` guard and show `Patch implementation work order guard active`, `Patch implementation work order guard blocks`, and `Patch implementation work order guard warnings` before change set previews, route planning, package promotion, assignment, scoring profile mutation, Star Dust or reward writes, audio manifest mutation, app file work, patch generation, harness implementation, test execution, or Playwright runs can be considered.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_prototype_patch_implementation_work_order` before returned prototypes can claim work order execution, app file write, generated patch, test execution, Playwright run, route, scoring, reward, audio manifest, package promotion, assignment, or support-language progress readiness.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI prototype patch change set previews so planned file changes, invariant checks, review blockers, and no-apply-patch boundaries are visible before any generated patch or app file write can exist.
- AI prototype patch change set previews must use the shared `validateAiPrototypePatchChangeSetPreview` guard and show `Patch change set preview guard active`, `Patch change set preview guard blocks`, and `Patch change set preview guard warnings` before route planning, package promotion, assignment, scoring profile mutation, Star Dust or reward writes, audio manifest mutation, app file work, patch generation, harness implementation, test execution, or Playwright runs can be considered.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_prototype_patch_change_set_preview` before returned prototypes can claim apply-patch, app file write, generated file write, test execution, Playwright run, route, scoring, reward, audio manifest, package promotion, assignment, or support-language progress readiness.
- `/teacher/generator/ministar` includes first tenant-specific review-only generator seed records for prompt package, cost gate, request builder, audio coverage, gamification mapping, reward readiness, and engine binding while Draft JSON, verifier submission, generated manifest, publish readiness, and correction queue lanes remain blocked.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose an AI generated package promotion checklist so the draft-to-playable pathway, promotion blockers, audio/verifier/reward/release/approval requirements, and student-route blocks are visible before any promote button, route registry write, playlist write, assignment write, local bundle write, or student-ready marker exists.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose an AI generated package release candidate preview so private tenant library handoff, release candidate records, tenant library item records, and student-facing release remain blocked before any generated package library publish, release candidate write, tenant library item write, assignment, local bundle, or student-ready marker exists.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI generated package assembly readiness so manifest, promotion, publish-readiness, release-candidate, teacher-approval, media-rights, and target-language audio lanes are visible before any package assembly, route write, playlist write, local bundle write, assignment, student-ready marker, or support-language-only release exists.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI generated package assembly dry runs so package JSON, route registry, media playlist, local companion, and assignment-shell artifact previews are visible before any package JSON write, route write, playlist write, local bundle write, assignment, student-ready marker, or support-language-only assembly exists.
- AI generated package assembly dry runs must use the shared dry-run guard before future writer work can treat artifact maps as valid; the guard keeps package JSON writes, route registry writes, media playlist writes, local bundle writes, assignments, student-ready markers, and support-language-only dry runs blocked.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI generated package writer preflights so package JSON writer, route registry writer, media playlist writer, local companion writer, assignment shell writer, and rollback map writer targets are visible before any writer execution, route mutation, playlist creation, local packaging, assignment activation, student-ready marker, or support-language-only writer exists.
- AI generated package writer preflights must use the shared writer preflight guard before future implementation work can treat writer targets as valid; the guard keeps writer execution, package JSON commits, route registry mutation, media playlist creation, local bundle packaging, assignments, student-ready markers, and support-language-only package writers blocked.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI generated package writer rollback drills so pre-write snapshots, post-write verification, package JSON rollback, route rollback, playlist rollback, local companion rollback, assignment rollback, and support-language rollback boundaries are visible before any writer execution, rollback execution, production QR redirect mutation, release-state mutation, or assignment mutation exists.
- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` expose AI generated package writer implementation readiness so future writer modules, test gates, release controls, next records, and implementation blocks are visible before any package writer implementation, app file write, route mutation, playlist creation, local packaging, assignment activation, rollback execution, production QR redirect mutation, or support-language-only implementation evidence exists.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_reward_readiness_gate` before generated rewards can publish, write inventory, issue Spin Wheel tickets, evolve avatars, or assign students.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_package_promotion_checklist` before generated packages can be promoted, write routes, create playlists, assign students, write local bundles, mark content student-ready, or treat support-language-only review as sufficient.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_package_release_candidate` before generated packages can publish to a private tenant library, write release candidate records, write tenant library items, become student-facing, create assignments, release local bundles, mark content student-ready, or treat support-language-only release as sufficient.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_package_assembly_readiness` before generated packages can assemble packages, write routes, create playlists, write local bundles, assign students, mark content student-ready, or treat support-language-only review as assembly evidence.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_package_assembly_dry_run` before generated packages can write package JSON, write routes, create playlists, write local bundles, assign students, mark content student-ready, or treat support-language-only dry runs as assembly evidence.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_package_writer_preflight` before generated packages can execute writers, write package JSON, write routes, create playlists, write local bundles, assign students, mark content student-ready, or treat support-language-only writer preflights as writer evidence.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_package_writer_rollback_drill` before generated packages can execute writers, execute rollbacks, roll back package JSON, mutate routes, roll back playlists, roll back local bundles, mutate assignments, alter production QR redirects, mark content student-ready, or treat support-language-only rollback evidence as sufficient.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_publish_readiness_gate` before generated packages can create routes, write route registry entries, create playlists, assign students, write local bundles, or mark content student-ready.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generator_tenant_coverage_gate` before generated package requests can submit, call models, submit verifier packets, assemble packages, create routes, create playlists, assign students, write local bundles, or mark content student-ready.
- `/teacher/intake` and `/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate` expose the school policy handoff packet so privacy, QR use, progression rules, media ownership, dry-run evidence, storage, release, and rollback can be discussed before any school policy acceptance, signed approval, evidence export, launch-ready status, local activation, production QR promise, or live classroom workflow exists.
- `/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet` exposes the focused school meeting packet route so partner or school review can open the handoff packet directly without enabling policy acceptance, signed approval capture, evidence export, release mutation, production QR promises, local activation, report export, learner data, or live classroom launch.
- `/teacher/intake`, `/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate`, and `/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet` expose the school policy acceptance preflight before any accept button exists; it must keep approval identity, policy text, evidence attachment storage, release-control binding, support-language limits, microphone/AI Tutor opt-ins, storage activation, rollback, production QR promises, learner data, report export, and live classroom workflow blocked until explicit future implementation gates are accepted.
- `/teacher/intake`, `/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate`, and `/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet` expose the school policy text version pack so privacy, retention, QR/progression, media/local package, microphone, AI Tutor, storage, rollback, evidence, signature, and revocation clauses are visible before any school acceptance text can be accepted or signed.
- `/teacher/intake`, `/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate`, and `/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet` expose the future school acceptance record preview so minimum accepted-record fields are visible without storing accepted terms, capturing signatures, exporting evidence, activating storage, creating launch-ready status, or starting a live classroom workflow.
- `/teacher/intake`, `/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate`, and `/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet` expose the school policy revocation and rollback preview so revocation authority, release rollback scope, printed QR effect, learner-data/report effect, media/local package effect, and premium feature effect are visible before any rollback action exists.
- School policy revocation and rollback preview panels expose a storage-contract handoff so schema entity, durable record, primary key, hosted write intent, and local write intent are visible before any rollback workflow is designed.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `school_policy_text_pack` before exact school policy text can be reviewed, versioned, accepted, signed, exported, stored, launch-marked, QR-promised, AI Tutor-activated, learner-recorded, report-exported, or used in a live classroom workflow.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `school_policy_acceptance_record_preview` before future accepted-record fields can become accepted terms, signed approvals, evidence exports, storage activation, launch-ready status, production QR promises, AI Tutor activation, learner data, report export, or live classroom workflow.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `school_policy_revocation_rollback_preview` before revocation actions, rollback buttons, release-state mutation, production QR redirect mutation, learner-data deletion, report export, media replacement, local bundle deactivation, AI Tutor entitlement changes, or live classroom shutdown workflows can be designed.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `school_rollback_safe_fallback_preflight` before fallback activation, release-state mutation, production QR redirect mutation, live notification, classroom shutdown, report export, media replacement, local bundle deactivation, or student reassignment workflows can be designed.
- `/teacher/intake`, `/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate`, and `/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet` expose the future safe fallback activation record preview before any activate button, fallback activated marker, release mutation, QR redirect, notification, media replacement, local deactivation, report export, or student reassignment workflow exists.
- `/teacher/intake`, `/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate`, and `/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet` expose the future safe fallback restoration record preview before any restore normal route button, restored marker, QR restoration, notification, local package restoration, media replacement, report export, or student reassignment workflow exists.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `school_rollback_safe_fallback_activation_preview` before fallback activation, release-state mutation, production QR redirect mutation, live notification, classroom shutdown, report export, media replacement, local bundle deactivation, or student reassignment workflows can be designed.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `school_rollback_safe_fallback_restoration_preview` before restoration activation, release-state mutation, production QR redirect mutation, live notification, classroom restart, report export, media restoration, local bundle restoration, or student reassignment workflows can be designed.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `evidence_packet` and `evidence_attachment` before live evidence upload, signed approval capture, storage writes, attachment downloads, upload promotion, asset editing, media transcoding, playlist creation, local activation, release-state mutation, student-facing attachments, or assignment shortcuts are built.
- Package publish gates, approval ledgers, and assignment rollout gates must remain visible before any school pilot is scheduled.

## Session 1: First Vertical Slice

Purpose: Prove teacher QR launch, student entry practice, progression events, deterministic rewards, audio-supported learner text, and the first playable game path.

Current status: Implemented on `legacy-source-import`. Local typecheck/build/browser verification passed after fresh clone, dependency install, and local route checks for `/`, `/teacher`, `/launch/demo-unit-1`, and `/enter/ministar`. Missing demo media files are expected placeholder 404s and are handled by the UI.

Implemented path:

Teacher launch -> QR route -> flashcards -> tap-to-speak learner text -> completion event -> reward preview -> Match Up/Memory Match/Balloon Pop/Quiz/True or False/Type Answer/Spelling Practice/Sentence Builder/Speak It unlock -> game_started -> playable pairing, selection, text-spelling, syntax, and speech games -> linked follow-on games -> game_completed -> Star Dust update -> reusable unit-session summary.

Implemented front-door expansion:

Permanent/front-door QR contract -> entry-code/user-code option -> sample multimedia package -> native audio/video playback shell plus manual media progress controls -> optional background media events -> student unit-session summary -> teacher-visible progress summary.

Remaining gate:

- Repeat local typecheck/build after each connector-side change is pulled.
- Run mobile verification against `docs/VERIFICATION_CHECKLIST.md`.
- Replace placeholder media files or keep clear unavailable-source messaging for demo assets.

## Session 2: Game Engine Foundation

Purpose: Turn Memory Match into the first reusable `pairing` parent engine implementation and use it as the pattern for future game modes.

Current status: Initial playable pairing implementation exists and has been locally browser-verified in the first slice. Memory Match uses pairing adapter/state helpers, emits start/completion events, emits item-level `round_shown`, `answer_submitted`, `answer_result`, and `mastery_updated` events, supports card tap-to-hear audio, uses a shared scoring profile, and updates local progression. Match Up is the visible pairing bridge. Label It adds the first image-label pairing route at `/label-it/[code]`, using reviewed placeholder anchors, target-language label audio, deterministic scoring, and explicit upload/release blockers before any real uploaded image can become student-facing. Quiz adds the first playable selection route at `/quiz/[code]` and now appears in teacher monitor sample events. True or False adds a second low-cost selection route at `/true-false/[code]` with deterministic reviewed term match/mismatch rounds, explicit audio cues, and standard event reporting. Balloon Pop adds the first structural arcade-selection route at `/balloon/[code]` with audio-supported vocabulary prompts, deterministic `arcade-reinforcement-v1` scoring, standard progress events, and no Phaser/premium polish yet. Selection and text-spelling previews now show parent-engine contracts. Sentence Builder adds the first playable syntax route at `/sentence/[code]`; Type Answer adds the first typed vocabulary route at `/type-answer/[code]`; Spelling Practice adds a guided letter-tile spelling route at `/spelling/[code]` with target-language prompt audio, deterministic scoring, and no support-language shortcut. Fill in the Blank now adds a simpler syntax route at `/fill/[code]`, using reviewed target sentences, tap-to-speak prompts, deterministic choices, and `syntax-construction-v1` scoring. These routes are visible in route contracts, the game sequence, activity hub, package audio coverage, and the unit game offer map. Speak It now adds the first core speech-practice shell with optional local microphone record/replay, no upload, no transcript, and no AI Tutor dependency. Active non-entry game routes now share a completion/next-activity card so learners can continue through reviewed pathways without one-off end screens or switch-template drift.

Required gate:

- Check `docs/GAME_ENGINE_CONTRACTS.md`.
- Check public repository research requirement before major reinvention.
- Check license/provenance before adopting any outside game code or assets.

Next outputs:

- Stronger event metadata if teacher reports need item-level detail.
- Additional scoring profiles for the next selected parent engine or mode.
- Browser-verify Quiz at `/quiz/demo-unit-1` and `/quiz/partner-demo-unit-1`.
- Browser-verify True or False at `/true-false/demo-unit-1` and `/true-false/partner-demo-unit-1`.
- Browser-verify Balloon Pop at `/balloon/demo-unit-1` and `/balloon/partner-demo-unit-1`.
- Browser-verify Spelling Practice at `/spelling/demo-unit-1` and `/spelling/partner-demo-unit-1`, plus Sentence Builder at `/sentence/demo-unit-1` and `/sentence/partner-demo-unit-1`.
- Confirm Training Academy uses the shared white-label launch resolver before changing recovery routes.
- Confirm active route verification content-checks Training Academy, Label It, Quiz, True or False, Type Answer, Spelling Practice, Sentence Builder, and Speak It routes for both sample tenants.
- Browser-verify the package-linked media playlist at `/media/playlist-ministar-l1-u1-greetings`.
- Browser-verify teacher demo route shortcuts at `/teacher`.
- Mobile verification.
- Compatibility with optional background/support media without requiring it.
- Explicit package-level audio support coverage for every active student-facing game mode.
- Teacher/admin package readiness must show which active game modes have explicit audio coverage.
- Persistence adapter write intents must preserve reviewed package game/audio coverage snapshots before pilot release.
- Backend migration specs must include package game/audio coverage snapshots before vendor-specific migrations.

## Session 2.5: Training Academy Recovery Lane

Purpose: Add the smallest deterministic recovery path before database persistence, AI Tutor, or premium polish.

Current status: Active local-state prototype exists on `legacy-source-import` at `/training/[code]`. It uses the shared launch/session/progression shape, reuses tap-to-speak audio support, awards small recovery Star Dust, records teacher-visible recovery metadata, returns the student to the normal unit route, includes a reusable teacher recovery summary adapter, includes deterministic recovery trigger logic in the student launch flow, and now supports focus-specific recovery configs. The front-door teacher report sample and teacher session monitor count recovery events from the same unified stream. Local typecheck/build is required after each connector-side change.

Implemented path:

Training recommendation -> configurable recovery focus -> tap-to-speak target items -> sentence pattern listening -> start review event -> answer submission/result metadata -> training completed -> small recovery Star Dust -> teacher recovery summary -> return-to-unit event -> link back to `/launch/[code]`.

Implemented trigger path:

Memory Match answer results -> repeated-miss detection -> one `training_recommended` event with trigger metadata -> learner-facing recovery card -> optional link to `/training/[code]`.

Implemented focus path:

Focus config contract -> Vocabulary, Sentences, Listening, Spelling, and Game practice lanes -> focus selection event -> generic target-item practice -> focus-specific reward cap.

Implemented report path:

Training metadata bridge -> recovery summary counts -> focus-change counts -> front-door teacher report metrics -> teacher session monitor metrics -> event list display using `trainingEventType` metadata.

Remaining gate:

- Pull latest `legacy-source-import` locally and run typecheck/build.
- Verify repeated-miss trigger on `/launch/demo-unit-1`.
- Verify focus selector on `/training/demo-unit-1`.
- Verify `training_focus_selected` metadata and teacher summary counts.
- Verify front-door recovery counts on `/enter/ministar`.
- Verify teacher session monitor counts recovery records on `/teacher/sessions/demo-unit-1`.
- Run mobile verification for `/launch/demo-unit-1`, `/training/demo-unit-1`, and `/teacher/sessions/demo-unit-1`.
- Promote dedicated Training Academy event types into `packages/content-model` only after the metadata bridge proves stable.

Next outputs:

- Persistence-backed report aggregation after storage policy is selected.

## Session 2.75: Reviewed Assist Language Foundation

Purpose: Make multilingual assist support part of the content-package foundation without hard-coding Japanese or depending on live AI translation.

Current status: Implemented on `legacy-source-import`. Shared content-model contracts, MiniStar tenant language settings, a reviewed MiniStar Japanese sample plan, and a local teacher visibility toggle are present. Browser verification remains useful after each follow-up reporting change.

Implemented path:

Tenant language settings -> optional content-package assist language plan -> reviewed vocabulary and sentence glosses -> package summary visibility -> optional student-facing flashcard assist text -> tap-to-speak assist text.

Required gate:

- Pull latest `legacy-source-import` locally.
- Run typecheck/build.
- Verify `/` shows assist-language package status.
- Verify `/launch/demo-unit-1` and `/enter/ministar` show Japanese assist text under flashcard terms and target sentences.
- Confirm Japanese is package data, not hard-coded globally.
- Confirm live AI assist remains disabled for the core sample.

Next outputs:

- Assist-language review workflow for PDF/imported units.
- Optional recorded assist-language audio cues.
- Broader UI localization later, separate from learning-content assist.
- Target-language expansion remains visible on `/teacher/intake`; Japanese target-language pilots stay blocked until script policy, segmentation, audio, input, and teacher review gates pass.
- Durable launch-session storage for the teacher assist-language visibility setting.

## Session 3: Content Package And PDF Unit Onboarding

Purpose: Support white-label tenant curriculum intake from PDF units, teacher docs, or structured spreadsheets.

Current status: Active scaffold. `/teacher/intake` now shows source review queue, AI authoring/verifier handoff, reviewed source intake gates, package readiness, source-to-route decisions, route registry data, deployment profiles, pilot release candidate summary, package publish gates, package approval ledger, backend schema draft, backend migration candidates, backend migration specs, and persistence boundaries. Package release candidates, publish gates, approval ledgers, upload intake/review/promotion records, and Labelled Diagram `game_asset_manifest` / `label_anchor_record` contracts are named in the durable record map, and the backend schema, candidates, and specs now name the vendor-neutral path needed before backend-specific migration work. `npm run verify:package-readiness` now guards sample package readiness for active game/audio coverage, media package expectations, front-door QR/access policy, support-language policy, and optional premium AI Tutor policy. It remains a review concept, not an automatic PDF-to-student assignment pipeline.

Teacher assignment readiness now shows the assigned game path for each sample plan so Quiz and Sentence Builder are visible in teacher/admin review before persistence exists.

Outputs:

- Content package model.
- PDF-derived unit metadata workflow.
- Human review step for imported units.
- AI authoring/verifier integration plan.
- AI authoring/verifier handoff that blocks unreviewed AI drafts from student assignment.
- Curated activity pathway and compatibility rules for each reviewed unit package.
- Planned printable worksheet/PDF output from reviewed payloads.
- Printable output readiness gates for browser-print preview, QR/audio, version/rights snapshot, and teacher export policy.
- Private tenant library planning for drafts, tenant-approved packages, school sharing, and public community blocking.
- Teacher authoring readiness for quick drafts, copy/edit, activity pathway edits, printable authoring, and direct-AI-publish blocking.
- Source review queue for raw PDF, DOCX, audio, video, and teacher-note handoff.
- Mapping from textbook page/unit to digital launch payload.
- Mapping from textbook page/unit/activity to multimedia assets and playlists.
- Mapping from textbook content to reviewed assist-language package data when tenants require it.

## Session 4: QR Registry And Route Permanence

Purpose: Make QR codes stable enough for printed textbooks and classroom materials.

Current status: Active scaffold. The front-door route resolver now uses tenant route registry data for MiniStar and the sample publisher. The persistence boundary now identifies the route registry as a durable backend requirement. Permanent textbook QR schema remains a future route contract and is now included in the backend schema draft, backend migration candidates, backend migration specs, package publish gate, and approval ledger as a release-blocking review domain. QR print readiness now separates demo/draft aliases from production textbook printing.

Outputs:

- Permanent QR id schema.
- Tenant/book/unit/activity route contract.
- Front-door entry-code/user-code route contract.
- Strategy for stable registry, optional hosted redirect, local app deep link, and offline fallback.
- Rules forbidding QR codes that point directly to fragile local file paths.
- QR print-readiness gates for textbook, workbook, and classroom-card publishing.

## Session 5: Multimedia Platform Foundation

Purpose: Add a white-label audio/video companion platform as part of the core Living Textbook package without hard-coding any one publisher's assets.

Current status: Sample multimedia content package, route concept, media event stream, native playback shell, manual progress fallback controls, optional background-media event controls, and media rights readiness exist. The persistence boundary now names media manifests, rights records, local bundle paths, hosted/local storage choices, package publish gates, and approval ledgers as first-class requirements. The backend schema draft and migration candidates name media manifests and rights as their own entity, with object/local storage separated from database metadata.

Outputs:

- Audio and video asset catalog.
- Unit-linked playlists.
- Optional unit/game background media settings.
- Native audio/video playback shell.
- Local/offline multimedia playback plan.
- Teacher and student multimedia launch routes.
- Media engagement events.
- Rights/ownership metadata fields.
- Media rights readiness gate for demo, pilot, background-media, and offline/local use.
- Background media policy that keeps music/chant enrichment teacher-controlled, support-only, and lower priority than tap-to-speak learning audio.

## Session 6: Local/Closed Deployment Mode

Purpose: Package the same platform for closed local use when a publisher, school, or textbook partner needs a non-public installation.

Current status: Deployment profile, local deployment preflight, local bundle manifests, local companion preview, and persistence boundary scaffolds exist in `/teacher/intake` and `/local/sample-publisher`. Hosted PWA is the recommended first pilot path. Local classroom server and packaged local app remain first-class paths, but require offline media bundle, installer/update, sync/export, backup, local storage, approval audit handling, and QR/deep-link decisions before production. `npm run verify:local-bundle` now guards against accidentally presenting the planning package as offline-ready while those blockers remain open. The backend schema draft preserves hosted/local vocabulary compatibility, and local classroom export/restore is intentionally deferred until hosted pilot schema is validated.

Outputs:

- Local app packaging recommendation.
- Offline asset bundle structure.
- Local storage/sync strategy.
- QR/deep-link behavior for installed apps.
- Update path for future content packages and multimedia packages.
- Local deployment preflight covering installer/update, media bundle, reporting/export, backup/restore, QR/deep-link, and offline access control.

## Session 7: Tenant Pilot Package

Purpose: Prepare a real partner pilot without polluting the MiniStar reference implementation.

Current status: Active scaffold. A white-label pilot readiness panel and partner timeline document define the practical partner promise: a testable pilot in roughly 8-12 weeks, with a narrower first scope than the eventual commercial product. A second sample tenant and partner-style content package prove the white-label path in code at `/partner-demo`, `/enter/sample-publisher`, `/launch/partner-demo-unit-1`, `/quiz/partner-demo-unit-1`, `/sentence/partner-demo-unit-1`, `/speak/partner-demo-unit-1`, `/training/partner-demo-unit-1`, and `/teacher/sessions/partner-demo-unit-1`. Teacher unit review routes at `/teacher/units/ministar%3Aministar-english%3AL1%3AU1` and `/teacher/units/sample-publisher%3Apartner-textbook-companion%3AL1%3AU1` now give teachers a focused pre-assignment review surface. `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` now show the AI teaching game generator as a draft-only commercial-proof authoring route with no live model call, no direct publish, no student assignment, tenant coverage requirements, target-language audio rules, premium API cost gates, shared schema guard blocks/warnings, a correction queue, and deterministic reward readiness gate for generated draft payloads. `/teacher/intake` adds reviewed source intake gates, tenant route registry data, deployment profile choices, package publish gate, package approval ledger, assignment rollout gates, release-control durable records, backend schema draft, backend migration candidates, backend migration specs, and persistence boundaries. `/teacher/sessions/demo-unit-1` and `/teacher/sessions/partner-demo-unit-1` now show teacher session preflight and monitor scaffolds on the shared event stream. The teacher session settings contract now separates safety failures from persistence warnings for audio, assist language, microphone approval, background media, AI Tutor, and reporting/retention.

Outputs:

- Tenant config.
- Sample imported units.
- Sample game payloads.
- AI teaching game generator draft request preview.
- AI generator tenant coverage gate that shows covered, partial, and missing request-specific records by tenant.
- AI generator lineage map that traces request, prompt, Draft JSON, correction, verifier, manifest, publish readiness, and teacher review queue records while blocking live generation, verifier submission, package assembly, routes, playlists, and assignment.
- MiniStar Level 1 greetings generator seed records for prompt package, cost entitlement, disabled request builder, audio coverage, deterministic gamification, reward readiness, parent-engine binding, Draft JSON preview, derived correction queue, blocked verifier submission packet, generated package manifest, and derived publish readiness.
- MiniStar AI generated draft review queue item with source lineage, hiragana-only support-language review, and blocked verifier, approval, route, playlist, assignment, and student-ready actions.
- Shared AI-generated draft payload validator with visible schema guard blocks and warnings.
- AI draft correction queue with owner, next-record, and student-use effect fields.
- AI reward readiness gate with deterministic Star Dust, accepted-event, and collection inventory protections.
- AI generated publish readiness gate that gathers correction queue, verifier, manifest, reward, release-control, and teacher approval blockers before student route publishing.
- AI generator tenant coverage storage contract that preserves request-specific covered, partial, and missing record lanes.
- Sample audio/video platform payloads.
- Sample unit playlist and optional game-background media setting.
- Sample assist-language package if required by the tenant.
- Package publish gate that separates demo-ready from pilot-publishable.
- Package approval ledger that names required human sign-offs.
- Assignment rollout gate that separates demo preview from scheduled pilot use.
- Durable record map entries for release candidates, publish gates, and approval ledgers.
- Vendor-neutral backend schema draft.
- Backend migration candidates.
- Backend migration specs.
- Pilot verification checklist.

Next outputs:

- Pull latest `legacy-source-import` locally and run typecheck/build after connector-side changes.
- Use `docs/ACTIVE_ROUTE_VERIFICATION_LIST.md` for route checks after route, package, assignment, game, audio, QR, or teacher-report changes.
- Confirm `/teacher/intake` shows the active route matrix for non-technical route review.
- Confirm `/teacher/generator/sample-publisher` shows schema guard blocks and warnings before generated draft payloads can move toward review, persistence, verifier submission, package assembly, route creation, playlist creation, or assignment.
- Confirm `/teacher/generator/sample-publisher` shows the AI draft correction queue before live auto-fix, regeneration, verifier submission, package assembly, route creation, playlist creation, or assignment workflows are considered.
- Confirm AI draft correction queues use the shared correction queue guard before verifier submission, package assembly, route creation, playlist creation, or student assignment can be considered; the guard keeps auto-fix, live AI regeneration, verifier submission, package assembly, route or playlist creation, and student assignment blocked.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show `Correction queue guard active`, `Correction queue guard blocks`, and `Correction queue guard warnings` before any generated draft can advance toward review.
- Confirm `/teacher/generator/sample-publisher` shows the AI reward readiness gate before reward publishing, inventory writes, Spin Wheel ticket issuance, avatar evolution, or assignment workflows are considered.
- Confirm `/teacher/generator/sample-publisher` shows the AI generated publish readiness gate before generated route creation, route registry writes, playlist writes, assignment creation, local bundle writes, or student-ready markers are considered.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show the AI generator lineage map before live generation, verifier submission, package assembly, route creation, playlist creation, assignment, local bundle writes, or student-ready markers are considered.
- Confirm AI generator lineage maps use the shared lineage guard before request-to-review chains can inform package review, promotion, or writer decisions; the guard requires request, prompt, Draft JSON preview, correction, verifier, manifest, publish readiness, and teacher review handoff records while blocking live generation, verifier submission, package assembly, routes, playlists, local bundles, assignments, and student-ready markers.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show `Lineage guard active`, `Lineage guard blocks`, and `Lineage guard warnings`.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show AI generator tenant coverage before generator request submission, live model calls, verifier submission, package assembly, route creation, playlist creation, or student assignment are considered.
- Confirm AI generator tenant coverage uses the shared tenant coverage guard before one tenant's records can be treated as generator-ready; the guard keeps generator request submission, live model calls, verifier submission, package assembly, route or playlist creation, and student assignment blocked.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show `Tenant coverage guard active`, `Tenant coverage guard blocks`, and `Tenant coverage guard warnings` before any generated draft can advance.
- Confirm AI generator review summaries use the shared review summary guard before the top rollup can inform future workflow decisions; the guard keeps live model calls, app file writes, package assembly, route or playlist creation, local bundle writes, assignment, and student-ready markers blocked.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show `Review summary guard active`, `Review summary guard blocks`, and `Review summary guard warnings` before teachers reach detailed generator panels.
- Confirm AI generator reviewer runbooks use the shared reviewer runbook guard before human review order can inform future workflow decisions; the guard keeps runbooks review-only, ordered, evidence-backed, and blocked from live model calls, app patching, package assembly, route or playlist creation, and student assignment.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show `Reviewer runbook guard active`, `Reviewer runbook guard blocks`, and `Reviewer runbook guard warnings` before detailed generator review work is treated as actionable.
- Confirm AI generator responsibility matrices use the shared responsibility matrix guard before role ownership can inform outside-builder handoff, live generation, app patching, scoring authority, route or playlist creation, package assembly, local bundle writes, or student assignment.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show `Responsibility guard active`, `Responsibility guard blocks`, and `Responsibility guard warnings` before any external AI builder handoff or generator integration work is treated as actionable.
- Confirm `/teacher/generator/ministar` shows MiniStar generator seed records, Draft JSON preview, correction queue, verifier packet, manifest, and publish readiness while keeping live model calls, verifier submission, package assembly, route creation, playlist creation, and assignment blocked.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve `ai_reward_readiness_gate` before generated reward publishing, collection inventory writes, Spin Wheel ticket issuance, avatar evolution, or student assignment work begins.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve `ai_generated_publish_readiness_gate` before generated route creation, route registry writes, playlist writes, assignment creation, local bundle writes, or student-ready marker work begins.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve `ai_generator_tenant_coverage_gate` before generator request submission, live model calls, verifier submission, package assembly, route creation, playlist creation, assignment creation, local bundle writes, or student-ready marker work begins.
- Confirm the active route matrix stays aligned with the full automated active-route verification list.
- Confirm teacher unit review routes show package evidence, curated activity paths, route readiness, assignment controls, and pilot blockers before expanding teacher authoring or assignment persistence.
- Confirm private assignment link routes show student-facing assignment scope and private-first sharing rules before public links or embeds are considered.
- Confirm private assignment link storage preserves `private_assignment_link` while blocking public sharing, iframe embeds, teacher/admin controls, real learner data collection, and report export.
- Confirm class roster plan storage preserves `class_roster_plan` while blocking real learner names, family contact, raw audio, transcripts, production accounts, and live report export.
- Confirm collection room routes show deterministic earned collection mechanics before premium avatar, room, mascot, or animation polish begins.
- Browser-verify the package publish gate, approval ledger, backend schema draft, backend migration candidates, backend migration specs, and persistence boundary at `/teacher/intake`.
- Browser-verify the teacher preflight, assigned game path, and monitor settings contract at `/teacher/sessions/demo-unit-1` and `/teacher/sessions/partner-demo-unit-1`.
- Confirm teacher session pages show a session pilot readiness snapshot that separates demo-safe monitoring from live classroom blockers.
- Confirm teacher session pages show a report package boundary that separates learning evidence, support-only signals, excluded sensitive fields, and export blockers.
- Confirm teacher session pages link to a report package preview route while live export remains blocked.
- Confirm safety failures and persistence warnings are displayed separately.
- Confirm teacher session preflight shows assigned game audio coverage before pilot use.
- Confirm teacher session monitor shows assigned game audio coverage in the report surface.
- Confirm teacher session monitor shows media engagement by asset without treating media as mastery.
- Confirm teacher report summaries separate English audio engagement from support-language taps.
- Confirm game action buttons use the shared audio-supported action pattern when a child must understand the control.
- Confirm student progress summaries show English listened progress and support unlocks separately.
- Confirm recommended game route cards separate `Listen` from `Open` so audio support never causes navigation or unlocks by itself.
- Confirm recommended route listen taps are reportable as `route_guidance_listened`, with no Star Dust, mastery, or unlock effect.
- Confirm `/teacher/intake` shows the progress event taxonomy before backend event storage is finalized.
- Confirm `/teacher/intake` shows the progress event taxonomy revision and required event fields before backend event storage is finalized.
- Confirm `npm run verify:taxonomy` passes before adding, renaming, or removing shared progress event types.
- Confirm `npm run verify:game-modes` passes before adding, renaming, routing, or delegating shared game modes.
- Confirm backend schema and migration specs preserve event effect taxonomy before progress-event storage is implemented.
- Confirm backend schema and migration specs preserve earned collection inventory before avatar, room, companion, or long-term reward ownership persistence is implemented.
- Confirm progress-event persistence write intents preserve event effect taxonomy in hosted and local adapters.
- Confirm package game/audio coverage write intents show machine-readable snapshot preservation.
- Confirm teacher assignment readiness shows audio-covered game modes against assigned game modes.
- Confirm assignment rollout surfaces game audio coverage before scheduling.
- Confirm assignment rollout surfaces generated-package handoff evidence as review-only before scheduling.
- Confirm assignment rollout summarizes generated-package handoff evidence counts before detailed plan review.
- Confirm assignment rollout storage preserves `teacher_assignment_rollout_gate` while blocking scheduling, student launch, live classroom launch, real learner data collection, and report export.
- Confirm `npm run verify:assignment-rollout` passes before assignment rollout, private assignment, package readiness, or school pilot scheduling copy changes.
- Confirm `npm run verify:class-roster` passes after learner identity, roster slots, front-door codes, teacher reports, microphone practice, AI Tutor speech records, backend schema, local deployment, or report export changes.
- Confirm `npm run verify:backend-storage` passes after roster storage, private assignment link, teacher assignment rollout, upload, evidence, media, local companion, or school policy storage contracts change.
- Confirm the publish gate blocks release while media rights, report policy, deployment profile, persistence, and pilot package policy are unresolved.
- Confirm the publish gate blocks release until media routes, local/hosted bundle decisions, and support-only media reporting are reviewed.
- Confirm the publish gate blocks release while assigned game modes are missing reviewed audio coverage or approved fallback.
- Confirm `/teacher/intake` shows the competitive feature coverage panel before teacher authoring, printables, private library, sharing, or embed work begins.
- Confirm `/teacher/intake` shows the activity pathway compatibility panel before template conversion, printable, or text-puzzle work begins.
- Confirm `npm run verify:activity-pathways` checks audio requirement lanes, reporting requirement lanes, and `/teacher/game-readiness` compatibility visibility before game-design, printable, AI-generator, Phaser wrapper, or Z.ai prototype work changes pathway rules.
- Confirm `/teacher/intake` shows the printable output readiness panel before worksheet/PDF implementation begins.
- Confirm `/print/demo-unit-1` and `/print/partner-demo-unit-1` load before expanding printable output, QR placement, or PDF generation.
- Confirm `/teacher/intake` shows the private tenant library plan before teacher authoring, copy/edit, sharing, or public-community work begins.
- Confirm `/teacher/library/sample-publisher` shows private drafts, tenant-approved packages, school sharing plans, and public-community blocking before live library search or copy/edit work begins.
- Confirm `/teacher/intake` shows the share/embed readiness panel before public links, iframe embeds, colleague sharing, or public community discovery work begins.
- Confirm `/teacher/intake` shows the teacher authoring readiness panel before live teacher editor or copy/edit implementation begins.
- Confirm `/teacher/intake` shows upload channel readiness before adding live upload controls for PDFs, text, images, audio, music, video, Labelled Diagram assets, media playlists, or local bundles.
- Confirm `/teacher/uploads/sample-publisher` shows upload channel, review queue, promotion, Labelled Diagram asset, and multimedia asset readiness before adding live file pickers, object storage, local upload folders, OCR, media processing, image label editors, or student-facing uploaded asset use.
- Confirm `/teacher/uploads/sample-publisher` shows file policy profiles before live upload controls validate extensions, enforce size or duration limits, scan files, create checksums, transcode media, or promote uploaded files.
- Confirm upload file policy storage preserves `upload_file_policy_profile`, accepted extensions, accepted MIME types, maximums, required checks, and `scan_and_file_policy_packet` before live file controls are enabled.
- Confirm `/teacher/uploads/sample-publisher` shows disabled intake controls before adding a real file input, drag-and-drop zone, upload progress bar, intake-record write, object storage write, or local folder write.
- Confirm `/teacher/uploads/sample-publisher` shows upload target mapping before uploaded files can create draft packages, game assets, media playlist bindings, local bundle entries, routes, or assignments.
- Confirm `/partner-demo` links to `/teacher/uploads/sample-publisher` before using the partner demo as a white-label handoff route.
- Confirm `/teacher/evidence/sample-publisher` shows the cross-source evidence packet review index before enabling live evidence upload, signed approval capture, upload promotion, asset publishing, playlist creation, route creation, or assignment shortcuts.
- Confirm `/teacher/evidence/sample-publisher/handoff` shows evidence export packet shape, recipient duties, blocked actions, and next gates before enabling evidence export, signed approval capture, upload promotion, asset publishing, playlist creation, route creation, or assignment shortcuts.
- Confirm `/teacher/intake` shows evidence export readiness before enabling PDF export, JSON export, downloadable ZIPs, email handoff, signature capture, release-state mutation, or student assignment from evidence.
- Confirm `/teacher/intake` shows the upload review queue before adding live upload approval, OCR promotion, image-label promotion, media playlist promotion, local-bundle promotion, or student-facing uploaded asset use.
- Confirm `/teacher/intake` shows target-specific upload promotion readiness before adding live upload promotion into teacher drafts, Labelled Diagram assets, media playlists, game background media, or local bundle files.
- Confirm `/teacher/intake` shows Labelled Diagram asset readiness before adding live image label editors, label coordinate storage, game asset manifests, or student-facing Labelled Diagram routes.
- Confirm `/teacher/assets/labelled-diagram/sample-publisher-l1-u1-labelled-diagram` stays teacher-only and blocks live upload, label editing, coordinate editing, student-facing image gameplay, and assignment routes from uploaded images.
- Confirm `/teacher/intake` shows multimedia asset readiness before adding live media uploads, media processing, playlist promotion, background-media assignment, video-only lesson paths, or local media bundle activation.
- Confirm `/teacher/assets/media/sample-publisher-l1-u1-routines-media` stays teacher-only and blocks live upload, transcoding, playlist creation, background-media assignment, local folder activation, route promotion, and media-only progress.
- Confirm uploads remain intake records first and cannot become student-facing until source lineage, rights, file policy, review, audio coverage, route mapping, and package release gates pass.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve upload intake records before live file pickers, object storage, local upload folders, OCR, image label anchors, or media processing begin.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve source extraction review packets before OCR-to-draft, parser-to-draft, AI extraction promotion, spreadsheet import promotion, or PDF-derived package assignment begins.
- Confirm the source review queue shows required extraction-promotion records and blocked extraction shortcuts before live OCR/parser/AI import controls are enabled.
- Run `npm run verify:source-review` after source review queue, PDF/DOCX intake, OCR/parser, AI extraction, upload policy, or teacher draft handoff changes.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve upload review records before live approve-for-draft, ready-for-asset-review, rights-request, return-for-replacement, OCR promotion, image-label promotion, media playlist promotion, local-bundle promotion, or student-facing upload use.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve upload promotion gate records before reviewed uploads can create target records, publish assets, assign students, or enter local bundles.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve `game_asset_manifest` and `label_anchor_record` records before live image asset libraries, coordinate editors, label editors, auto-generated active labels, or student-facing Labelled Diagram routes begin.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve `media_playlist_binding`, `background_media_policy_binding`, and `local_media_bundle_entry` records before live playlist promotion, background-media assignment, local media bundle activation, or media-only progress paths begin.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` keeps local edit preview actions blocked before live save, review submission, or assignment work begins.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` keeps draft audio coverage visible before live authoring or audio generation work begins.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` keeps draft review handoff packets read-only and blocked before live submit-for-review, verifier workflow, or package approval work begins.
- Confirm `/teacher/review` keeps draft review queue items read-only and blocked before live verifier submission, package approval, direct AI publish, or student assignment work begins.
- Confirm `/teacher/review/sample-publisher` and `/teacher/review/ministar` keep generated draft review tenant-scoped and fail verification if one tenant route leaks the other tenant's draft content.
- Confirm `/teacher/review` keeps verifier submission preflights blocked before automatic verifier submission, live review workflows, or package-state promotion exists.
- Confirm `/teacher/review` keeps reviewer decision previews disabled before reviewer identity, evidence storage, verifier workflow, package approval, and release-control policy exist.
- Confirm `/teacher/review` carries package writer harness implementation decision blockers for AI-generated drafts before package writing, route creation, playlist creation, local bundles, assignment shells, or harness code can be considered.
- Confirm `/teacher/review` keeps review evidence packet previews blocked before evidence upload, signature capture, approval ledgers, or real file storage exist.
- Confirm `/teacher/review` keeps review audit trail previews blocked before live state transitions, approvals, evidence upload, publishing, or student assignment exist.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve teacher draft reviewer decisions before live return-for-edits, needs-audio, ready-for-approval, or package-state-change work begins.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve teacher draft review evidence packets before file upload, signature capture, approval evidence, or evidence export work begins.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve teacher draft review audit trails before live reviewer actions or package state transitions begin.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve teacher draft verifier submission preflights before automatic verifier submission or verifier workflow promotion begins.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve teacher draft review handoff packets before live submit-for-review, verifier workflow, or package approval work begins.
- Confirm `/teacher/intake` shows the target-language expansion readiness panel before Japanese target-language or other non-English target-language pilots are scoped.
- Confirm curated activity pathways remain the default teacher-facing answer to switch-template style expectations.
- Confirm the approval ledger does not imply real signed approvals before authentication and persistence exist.
- Confirm the durable record map includes publish gate and approval ledger records.
- Confirm the durable record map, adapter plans, schema draft, and migration specs include teacher report package boundary records before live report export.
- Confirm the backend schema draft includes tenant, package release, package game/audio coverage, QR alias, media manifest, launch session, progress event, teacher report package, publish gate, and approval ledger entities.
- Confirm migration candidates sequence admin/release records before student progress storage.
- Confirm migration specs name primary keys, tenant scope, indexes, retention, export, local fallback, and policy blockers before backend-specific migrations.
- Confirm package game/audio coverage is present in schema draft, write intents, migration candidates, and migration specs before vendor-specific backend work begins.
- Confirm `/teacher/intake` shows the first pilot source strategy: manually reviewed units first, draft PDF import later, automatic PDF-to-student publishing blocked.
- Confirm `/teacher/intake` shows a publisher maintenance change queue for year-on-year content, media, game, route, and report updates.
- Confirm publisher maintenance uses the shared `validatePublisherMaintenancePlan` guard and shows `Maintenance guard active`, `Maintenance guard blocks`, and `Maintenance guard warnings` before partner self-maintenance, media replacement, game availability changes, QR alias updates, report policy changes, or yearly package release work can be treated as valid.
- Confirm durable records, adapter plans, schema draft, and migration specs include publisher maintenance change requests before partner self-maintenance.
- Confirm `/local/sample-publisher` shows the closed/local companion package preview without implying offline-ready installer status.
- Confirm `/local/sample-publisher` shows a package artifact map before exporter or installer work begins.
- Confirm `/local/sample-publisher` shows a package handoff checklist separating publisher, platform, and school-owned requirements.
- Confirm durable records, adapter plans, schema draft, and migration specs include local companion handoff and release gate records before local package generation.
- Confirm `/local/sample-publisher` shows a generated manifest snapshot as preview-only package metadata.
- Confirm `/local/sample-publisher` shows bundled game routes with engine, audio coverage, and progress reporting status.
- Confirm `/local/sample-publisher` shows a local release gate that blocks closed handoff until media rights, installer/update, backup/export, QR fallback, school access/privacy, and game/audio/reporting checks are reviewed.
- Confirm local companion release gate storage contracts exist before installer packaging, local server release, desktop companion handoff, or offline-ready claims.
- Confirm shared navigation exposes the local companion preview during review.
- Confirm `/teacher/intake` shows a pilot release candidate summary that joins publish gates and approval ledgers before any live pilot claim.
- Confirm `npm run verify:release-control` passes after publish gate, approval ledger, release candidate, or pilot handoff changes.
- Confirm `/teacher/intake` shows the backend selection gate before choosing the actual first pilot backend.
- Confirm teacher session monitor routes show a machine-readable settings snapshot before launch-session persistence is implemented.
- Confirm launch-session adapter plans, schema draft, migration candidates, and migration specs preserve teacher session settings snapshots before live student events are stored.
- Confirm assist-language teacher enablement is represented in the teacher-session settings snapshot before support language is used in real classroom launches.
- Confirm `npm run verify:session-settings` passes after teacher settings, session settings review packets, assist language, microphone, background media, AI Tutor, or reporting changes.
- Confirm direct launch and front-door QR/class-code contexts both carry teacher session settings before support-language visibility changes.
- Confirm backend schema, migration specs, and adapter plans preserve assist-language teacher enablement before backend-specific migrations.
- Confirm `npm run verify:backend-storage` passes before backend selection, persistence adapters, or vendor-specific migrations.
- Confirm teacher session monitor routes show an event acceptance gate before live student event storage is enabled.
- Confirm launch-session storage contracts preserve event acceptance gates before live student event writes are enabled.
- Confirm teacher report package previews include an event acceptance summary before report export or live event storage is enabled.
- Confirm progress-event write intents require a passed event acceptance gate before live student event writes are enabled.
- Confirm teacher report package storage preserves event acceptance summaries before report export is enabled.
- Confirm durable record contracts preserve progress-event taxonomy, progress-event acceptance gates, and report event acceptance summaries before backend selection.
- Confirm teacher draft package routes preserve draft-only, source-lineage, audio-before-students, and review-before-assignment boundaries before live authoring.
- Confirm local draft edit previews cannot save, submit for review, assign to students, or regenerate audio before persistence and verifier workflows exist.
- Confirm teacher draft audio coverage previews preserve term, sentence, instruction, and fallback audio requirements before student use.
- Confirm private teacher library routes preserve source lineage, no-student-data-copy rules, and public-community blocking before teacher library persistence or sharing is implemented.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve teacher draft packages before live teacher authoring, copy/edit, private-library drafts, or assignment persistence.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve tenant library items before live library search, copy/edit, school sharing, or public-community decisions.
- Confirm `/teacher/media/sample-publisher` and `/teacher/media/ministar` show tenant-aware media rights, target records, maintenance stages, and blocked live actions before live media upload, replacement, playlist promotion, background-media assignment, or local media activation begins.
- Confirm `/teacher/intake` shows the content entry option scaffold with template flow, activity title, instructions, AI draft control, flip tiles, single/double sided rows, row audio/image controls, formatting tools, item reorder/duplicate/delete, `min 2 max 50` limits, and blocked Done-to-student routing before live upload or authoring controls are implemented.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` shows the disabled content-entry workbench preview before any real draft save, file picker, AI generation, template switch, upload, Done-to-student route, or assignment workflow is implemented.
- Confirm Flip Tiles remains a concrete source template while the upload/content-entry guide applies across compatible game families, with approved learner fonts, tenant font packs, hiragana-safe font handling, readable tile sizing, and font rendering gates before live styling controls.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `template_rendering_profile` and `font_accessibility_profile` before enabling live cross-game template rendering, tenant font packs, font uploads, or printable rendering controls.
- Confirm `/teacher/intake` shows template/font profile readiness with student-facing rendering and font blocks before live template switching, printable rendering, or tenant font configuration is enabled.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` shows draft profile bindings before live draft template switching, printable rendering, or tenant font configuration is enabled.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `activity_compatibility_snapshot` before enabling live teacher pathway changes, extra template conversions, or printable switching.
- Confirm package publish gates require reviewed `activity_compatibility_snapshot`, `template_rendering_profile`, and `font_accessibility_profile` records before pilot release.
- Confirm `/teacher/intake` shows a publisher pilot readiness summary sourced from the package publish gate before partner demos, pilot handoff, or commercial readiness conversations.
- Confirm `/teacher/intake` shows a pilot evidence packet preview before enabling live evidence upload, signed approval capture, or partner pilot release workflows.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `pilot_evidence_packet` before live evidence upload, signed approval capture, or partner pilot release workflows.
- Confirm `/teacher/evidence/sample-publisher` shows an evidence packet assembly gate with release readiness lanes, packet-version freeze blocks, and approval/export/QR/assignment/storage blocks before live evidence upload, packet export, signed approval capture, route promotion, QR promotion, local bundle activation, or student assignment is enabled.
- Confirm `/teacher/evidence/sample-publisher` shows reviewer identity and signature readiness with reviewer identity, approval intent, signature policy, audit retention, and approval-action blocks before signed approval capture, approve buttons, release-state mutation, signature attachment upload, signed PDF packets, evidence download, or approval-based student assignment are enabled.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `reviewer_identity_signature_gate` before signed approval capture, approve buttons, signature attachment upload, signed PDF packets, evidence download, release-state mutation, or approval-based student assignment are enabled.
- Confirm `/teacher/intake` shows a pilot launch checklist preview before enabling live classroom launch, evidence upload, signed approval capture, or pilot-ready status changes.
- Confirm `/teacher/intake` shows a teacher dry-run rehearsal preview before enabling live classroom launch, real learner data collection, report export, or pilot-ready status changes.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `teacher_dry_run_rehearsal` before live classroom launch, real learner data collection, report export, or pilot-ready status changes.
- Confirm `/teacher/dry-run/sample-publisher-first-handoff-teacher-dry-run` loads before enabling live classroom launch, report export, or pilot-ready status changes.
- Confirm `/teacher/intake` and `/teacher/dry-run/sample-publisher-first-handoff-teacher-dry-run` show a classroom launch gate preview with `Launch blocked`, `No live student session`, `No launch button`, `Real learner data blocked`, and `Report export still blocked` before any live classroom workflow is implemented.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `classroom_launch_gate` before live classroom launch, launch buttons, real learner data collection, report export, or launch-ready status changes.
- Confirm `/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate` loads as a review-only workspace before adding any live classroom launch route, launch button, report export, or launch-ready state transition.
- Confirm `/teacher/intake` and `/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate` show a school launch policy gate preview with school, publisher, platform, and shared dry-run ownership before a controlled demo is ever described as school-approved launch readiness.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `school_launch_policy_gate` before policy acceptance workflows, live launch, real learner data, report export, local activation, release mutation, or launch-ready status changes.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `school_policy_handoff_packet` before school meeting packets can become audited pilot-readiness artifacts, while still blocking policy acceptance, signed approval capture, evidence export, local activation, production QR promises, launch-ready status, learner data, report export, and live classroom workflow.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `school_policy_acceptance_preflight` before any school accept button, signature capture, evidence export, storage activation, launch-ready status, production QR promise, AI Tutor activation, learner data, report export, or live classroom workflow can be designed.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `school_policy_text_pack` before versioned policy clauses can become accepted terms, signed approvals, evidence exports, storage activation, launch-ready status, production QR promises, AI Tutor activation, learner data, report export, or live classroom workflow.
- Confirm future school acceptance record previews remain read-only before accepted terms, school approver signatures, evidence exports, storage activation, launch-ready status, production QR promises, AI Tutor activation, learner data, report export, or live classroom workflow are implemented.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `school_policy_acceptance_record_preview` before accepted terms storage, signature capture, evidence export, storage activation, launch-ready status, production QR promise, AI Tutor activation, learner data, report export, or live classroom workflow can be designed.
- Confirm school policy revocation and rollback previews remain read-only before revocation actions, rollback buttons, release-state mutation, production QR redirect mutation, learner-data deletion, report export, media replacement, local bundle deactivation, AI Tutor entitlement changes, or live classroom shutdown workflows are implemented.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `school_policy_revocation_rollback_preview` before revocation actions, rollback buttons, release-state mutation, production QR redirect mutation, learner-data deletion, report export, media replacement, local bundle deactivation, AI Tutor entitlement changes, or live classroom shutdown workflows can be designed.
- Confirm school policy rollback impact matrices expose release, QR route, learner-data/report, media/local package, premium feature, and support-operations effects before any rollback workflow is designed.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `school_policy_rollback_impact_matrix` before release-state mutation, production QR redirect mutation, learner-data deletion, report export, media replacement, local bundle deactivation, AI Tutor entitlement changes, or live classroom shutdown workflows can be designed.
- Confirm school rollback safe fallback plans expose child-safe student pause copy, teacher handoff copy, printed QR pause expectations, local companion fallback expectations, and media playlist fallback expectations before live notification, route mutation, media replacement, local bundle deactivation, or classroom shutdown workflows are designed.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `school_rollback_safe_fallback_plan` before production QR redirect mutation, live notification, classroom shutdown, report export, media replacement, local bundle deactivation, or student reassignment workflows can be designed.
- Confirm school rollback safe fallback preflights expose child-safe copy, school communication, printed QR fallback, local companion fallback, media playlist fallback, and assignment/report policy checks before fallback activation can be designed.
- Confirm student launch and front-door routes show controlled-practice launch context before real classroom launch, production student accounts, or live learner data collection is enabled.
- Confirm teacher session monitor and report-package routes show a session launch gate boundary before live classroom launch, real learner data collection, report export, or launch-ready state transition.
- Confirm private assignment routes show controlled-practice launch context before real classroom launch, production student accounts, report export, or live learner data collection is enabled.
- Confirm teacher unit review routes show launch-safety status before live assignment, real classroom launch, production student accounts, report export, or live learner data collection is enabled.
- Confirm upload review and promotion storage preserves `target_mapping_packet` before live upload controls can create draft packages, game assets, playlists, local bundle entries, routes, or assignments.
- Confirm `npm run verify:launch-safety` passes after launch, front-door, private assignment, teacher unit review, teacher session monitor, report package, or classroom launch gate changes.
- Confirm stable QR alias routes are content-checked for printed QR id, resolved target, and guardrails before real textbook QR commitments are made.
- Confirm `/teacher/generator/sample-publisher` shows generator draft requests, verifier packets, target-language audio requirements, curated activity pathways, premium AI cost gates, no live model call, no direct publish, and no student assignment before live AI generation, model billing, route creation, playlist creation, or assignment flows are implemented.
- Confirm `/teacher/generator/sample-publisher` shows generated activity proposals bound to existing game mode catalog entries, parent engines, scoring profiles, and standard events before any one-off generated game code, Z.ai prototype promotion, route creation, or student assignment is implemented.
- Confirm `/teacher/generator/sample-publisher` shows AI generated game build brief packets with Z.ai prototype instructions, parent-engine binding, JSON fixture shape, standard events, audio contract, deterministic scoring, deliverables, and blocked standalone promotion or Phaser bypass.
- Confirm AI generated game build briefs use the shared build brief guard before external handoff, returned prototype review, wrapper planning, package review, route integration, scoring changes, or student assignment can be considered.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show `Build brief guard active`, `Build brief guard blocks`, and `Build brief guard warnings`.
- Confirm AI external prototype task packets use the shared external task guard before prompt copy, issue creation, archive export, live handoff, returned prototype review, app patch planning, route integration, scoring changes, reward work, playlist creation, package assembly, student-facing preview, or assignment can be considered.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show `External task guard active`, `External task guard blocks`, and `External task guard warnings`.
- Confirm `/teacher/generator/sample-publisher` shows a versioned AI prompt package with input slots, output schema locks, tenant brand rules, model-use state, usage budget, blocked raw student data, blocked student prompt edits, and blocked voice/model billing before live generator workflows are implemented.
- Confirm `/teacher/generator/sample-publisher` shows an AI generator cost and entitlement gate with tenant entitlement, usage budget ceiling, model rate-card snapshot, voice-package separation, cost estimate preview, and school approval requirements before live model calls, billing, voice generation, speech scoring, AI Tutor activation, or teacher self-enablement are implemented.
- Confirm `/teacher/generator/sample-publisher` shows a Draft JSON preview with target-language-only progress, `support_language_progress_allowed: false`, unapproved audio blocking, and blocked copy/verifier/publish/playlist/assignment actions before live generator workflows are implemented.
- Confirm `/teacher/generator/sample-publisher` shows a disabled request-builder form with source evidence packet, target level, unit theme, target language, assist-language policy, curated mode pathway, audio coverage requirement, AI package state, and blocked generate/cost/submit/model-billing actions before live generator workflows are implemented.
- Confirm `/teacher/generator/sample-publisher` shows mode recommendations sourced from the activity compatibility matrix, with a recommended generated pathway and blocked conversion guardrails, before any live recommendation engine or broad switch panel is implemented.
- Confirm `/teacher/generator/sample-publisher` shows an AI audio coverage planner with required term, sentence, instruction, feedback, control, support-language, and background-media audio policies before live voice generation, voice API cost, verifier submission, route creation, or student assignment is implemented.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show a target-language audio approval packet with exact learner-facing cues, review questions, support-language boundaries, blocked voice/API actions, blocked package audio-complete markers, and blocked student-facing actions before package teacher review can be treated as complete.
- Confirm target-language audio approval packets use the shared `validateAiTargetLanguageAudioApprovalPacket` guard and show `Target-language audio approval guard active`, `Target-language audio approval guard blocks`, and `Target-language audio approval guard warnings` before package teacher review, package assembly, route creation, playlist creation, assignment, audio approval capture, generated voice calls, speech API billing, or student-ready markers can be considered.
- Confirm backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `target_language_audio_approval` before audio approval capture, voice generation, speech API billing, package audio-complete markers, route creation, playlist creation, assignments, media-only progress, or support-language progress can exist.
- Confirm `/teacher/generator/sample-publisher` shows an AI gamification mapping with accepted events, deterministic Star Dust allocation, mastery thresholds, collection unlock bindings, and blocked random/gacha/media-only/support-language mastery shortcuts before generated game drafts can move toward review.
- Confirm `/teacher/generator/sample-publisher` shows an AI verifier submission packet with required schema, pedagogy, target-language progression, audio, engine, gamification, compatibility, media-rights, and teacher-approval checks before verifier submission, package approval, route creation, playlist creation, assignment creation, or student-ready marking is implemented.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show an AI generated package teacher review packet with teacher approval prep, teacher decision lanes, ready signals, missing evidence, blocked actions, and next records before teacher approval capture, package assembly, route creation, playlist creation, assignment creation, local bundle writing, student-ready markers, or support-language progress can exist.
- Confirm AI generated package teacher review packets use the shared `validateAiGeneratedPackageTeacherReviewPacket` guard and show `Teacher review packet guard active`, `Teacher review packet guard blocks`, and `Teacher review packet guard warnings` before teacher approval capture, package assembly, route creation, playlist creation, assignment creation, local bundle writing, student-ready markers, or support-language progress can be considered.
- Confirm MiniStar generated package teacher review packets preserve English target-language audio as the approval trigger and keep Foundation Japanese support hiragana-only, support-only, and unable to unlock progress.
- Confirm backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_package_teacher_review_packet` before teacher approval capture, generated package assembly, route creation, playlist creation, assignment creation, local bundle writes, student-ready markers, or support-language progress can exist.
- Confirm `/teacher/generator/sample-publisher` shows an AI generated package manifest linking prompt, draft JSON, audio, engine, gamification, verifier, and review queue records before package assembly, route registry writes, media playlist writes, assignments, local bundle writes, or student-ready marking are implemented.
- Confirm AI generated package manifests use the shared `validateAiGeneratedPackageManifest` guard and show `Manifest guard active`, `Manifest guard blocks`, and `Manifest guard warnings` before package assembly, route registry writes, media playlist writes, assignments, local bundle writes, student-ready markers, or support-language-only package assembly can be considered.
- Confirm `/teacher/generator/sample-publisher` shows an AI generated package promotion checklist linking lineage, correction queue, target audio, verifier, manifest, reward, release-control, approval ledger, and assignment rollout before any promote button, route registry write, playlist write, assignment write, local bundle write, or student-ready marker is implemented.
- Confirm AI generated package promotion checklists use the shared `validateAiGeneratedPackagePromotionChecklist` guard and show `Promotion guard active`, `Promotion guard blocks`, and `Promotion guard warnings` before package promotion, route registry writes, playlists, assignments, local bundle writes, student-ready markers, or support-language-only promotion can be considered.
- Confirm `/teacher/generator/sample-publisher` shows an AI generated publish readiness gate linking correction queue, verifier, manifest, reward, release-control, and teacher approval blockers before generated route creation, route registry writes, playlist writes, assignment creation, local bundle writes, or student-ready markers are implemented.
- Confirm AI generated publish readiness gates use the shared `validateAiGeneratedPublishReadinessGate` guard and show `Publish guard active`, `Publish guard blocks`, and `Publish guard warnings` before route creation, route registry writes, playlists, assignments, local bundle writes, student-ready markers, or support-language-only generated package publishing can be considered.
- Confirm `/teacher/generator/sample-publisher` shows an AI generated package release candidate preview linking manifest, promotion checklist, publish readiness, private tenant library target, release candidate records, and tenant library item records while library publish, release candidate write, tenant library item write, student-facing release, assignment, and local bundle actions remain blocked.
- Confirm AI generated package release candidates use the shared `validateAiGeneratedPackageReleaseCandidate` guard and show `Release candidate guard active`, `Release candidate guard blocks`, and `Release candidate guard warnings` before private-library publishing, release candidate writes, tenant library item writes, student-facing release, assignment writes, local bundle release, student-ready markers, or support-language-only release can be considered.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show AI generated package assembly readiness linking manifest, promotion, publish readiness, release candidate, teacher approval, media rights, and target-language audio evidence while package assembly, route writes, playlist writes, local bundles, student-ready markers, assignments, and support-language-only assembly remain blocked.
- Confirm AI generated package assembly readiness uses the shared `validateAiGeneratedPackageAssemblyReadiness` guard and shows `Assembly readiness guard active`, `Assembly readiness guard blocks`, and `Assembly readiness guard warnings` before assembly dry runs, package assembly, route writes, playlists, local bundles, student-ready markers, assignments, or support-language-only assembly can be considered.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show AI generated package assembly dry runs linking package JSON, route registry, media playlist, local companion, and assignment-shell artifact previews while every write path remains blocked.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show `Dry-run guard active`, `Dry-run guard blocks`, and `Dry-run guard warnings` before package-writer implementation work is considered.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show AI generated package writer preflights linking writer targets, required evidence, blocked writes, rollback map planning, and support-language boundaries while every writer execution path remains blocked.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show `Writer preflight guard active`, `Writer preflight guard blocks`, and `Writer preflight guard warnings` before package-writer implementation work is considered.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show AI generated package writer rollback drills linking pre-write snapshots, post-write verification, rollback rehearsal steps, blocked rollback actions, and support-language boundaries while every rollback and writer execution path remains blocked.
- Confirm AI generated package writer rollback drills use the shared rollback drill guard before future writer implementation work can treat rollback rehearsal as valid; the guard keeps rollback execution, package writer execution, package JSON rollback, route rollback, media playlist rollback, local bundle rollback, assignment rollback, production QR mutation, and support-language-only rollback evidence blocked.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show `Rollback drill guard active`, `Rollback drill guard blocks`, and `Rollback drill guard warnings` before package-writer implementation work is considered.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show AI generated package writer implementation readiness linking future writer modules, required tests, release controls, next records, blocked implementation actions, and support-language boundaries while implementation, writer execution, route mutation, playlist creation, assignment activation, rollback execution, and app file writes remain blocked.
- Confirm AI generated package writer implementation readiness uses the shared implementation guard before future writer implementation work can be considered; the guard keeps package writer implementation, writer execution, app file writes, route mutation, playlist creation, local bundle packaging, assignment activation, rollback execution, production QR mutation, and support-language-only implementation evidence blocked.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show `Implementation readiness guard active`, `Implementation readiness guard blocks`, and `Implementation readiness guard warnings` before any package-writer implementation decision is made.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show AI generated package writer module test plans linking content package, route registry, media playlist, local companion, assignment shell, and release rollback guard test suites while automated writer tests, app file patches, route writes, playlist writes, local bundle packaging, assignment activation, and support-language-only test passes remain blocked.
- Confirm AI generated package writer module test plans use the shared module test-plan guard before future writer test harness work can be considered; the guard keeps automated writer tests, Playwright mutation runs, app file patches, generated package JSON writes, route registry writes, media playlist writes, local bundle packaging, assignment activation, production QR mutation, and support-language-only test passes blocked.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show `Module test plan guard active`, `Module test plan guard blocks`, and `Module test plan guard warnings` before any writer test harness implementation decision is made.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show AI generated package writer test evidence packets linking fixture, route/QR, audio/media, local/assignment, rollback, and support-language proof lanes while automated writer tests, evidence upload, signed approval capture, app file patches, route writes, playlist writes, local bundle packaging, assignment activation, and support-language-only evidence passes remain blocked.
- Confirm AI generated package writer test evidence packets use the shared test evidence guard before future writer test harness work can be considered; the guard keeps writer tests, mutation browser runs, evidence upload, signed approval capture, app file patches, generated package JSON writes, route registry writes, media playlist writes, local bundle packaging, assignment activation, production QR mutation, and support-language-only evidence passes blocked.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show `Test evidence guard active`, `Test evidence guard blocks`, and `Test evidence guard warnings` before any test harness implementation decision is made.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show AI generated package writer test harness plans linking fixture replay, route smoke, media policy, local/assignment, rollback guard phases, and static/browser/local adapters while harness implementation, automated writer tests, mutation browser runs, evidence upload, app file patches, route writes, playlist writes, local bundle packaging, assignment activation, and support-language-only harness passes remain blocked.
- Confirm AI generated package writer test harness plans use the shared test harness plan guard before future harness implementation work can be considered; the guard keeps harness implementation, automated writer tests, writer mutation browser runs, evidence upload, signed approval capture, app file patches, generated package JSON writes, route registry writes, media playlist writes, local bundle packaging, assignment activation, production QR mutation, and support-language-only harness passes blocked.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show `Test harness plan guard active`, `Test harness plan guard blocks`, and `Test harness plan guard warnings` before any test harness implementation work is considered.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show AI generated package writer test harness implementation proposals linking future module scope, implementation boundaries, review gates, dry-run-only checks, and support-language boundaries while harness implementation, writer tests, mutation browser runs, evidence upload, app file patches, route writes, playlist writes, local bundle packaging, assignment activation, and support-language-only harness passes remain blocked.
- Confirm AI generated package writer test harness implementation proposals use the shared harness implementation proposal guard before future harness implementation work can be reviewed; the guard keeps harness implementation, automated writer tests, writer mutation browser runs, evidence upload, signed approval capture, app file patches, generated package JSON writes, route registry writes, media playlist writes, local bundle packaging, assignment activation, production QR mutation, and support-language-only harness passes blocked.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show `Harness implementation proposal guard active`, `Harness implementation proposal guard blocks`, and `Harness implementation proposal guard warnings` before any harness implementation review is considered.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show AI generated package writer harness implementation decision previews with required evidence, file-scope rules, decision options, no recorded decision, and blocked harness/code/test/write actions before any harness implementation can be considered.
- Confirm AI generated package writer harness implementation decision previews use the shared harness decision guard before any future decision capture, harness approval, or harness implementation work can be reviewed; the guard keeps no decision recorded and blocks harness code, writer tests, mutation browser runs, evidence upload, signed approval capture, app patches, route writes, playlists, local bundles, assignments, production QR mutation, and support-language-only implementation decisions.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show `Harness decision guard active`, `Harness decision guard blocks`, and `Harness decision guard warnings` before any harness implementation decision is treated as actionable.
- Confirm backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_package_writer_harness_implementation_decision` before decision capture, harness approval, harness implementation, writer tests, evidence upload, signed approval capture, app patches, route writes, playlist writes, local bundles, assignments, production QR mutation, or support-language-only implementation decisions can exist.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show AI generated package writer route and playlist write guards before generated package writers can mutate route registries, media playlists, QR redirects, student-facing routes, teacher routes, or route smoke state.
- Confirm route and playlist write guards use the shared route/playlist guard before any route write, playlist write, production QR mutation, student-facing route activation, writer execution, or support-language-only route or playlist approval can be considered.
- Confirm MiniStar route and playlist write guards keep English route triggers protected and hiragana Japanese support support-only.
- Confirm backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_package_writer_test_evidence_packet` before generated packages can run writer tests, upload evidence, capture signed approvals, patch app files, write package JSON, mutate routes, create playlists, package local bundles, activate assignments, alter production QR redirects, or treat support-language-only evidence passes as sufficient.
- Confirm backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_package_writer_test_harness_plan` before generated packages can implement harnesses, run writer tests, run mutation browser checks, upload evidence, capture signed approvals, patch app files, write package JSON, mutate routes, create playlists, package local bundles, activate assignments, alter production QR redirects, or treat support-language-only harness passes as sufficient.
- Confirm backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_package_writer_test_harness_implementation_proposal` before generated packages can implement harnesses, run writer tests, run mutation browser checks, upload evidence, capture signed approvals, patch app files, write package JSON, mutate routes, create playlists, package local bundles, activate assignments, alter production QR redirects, or treat support-language-only harness implementation proposals as sufficient.
- Confirm backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_package_manifest` before live AI generation can assemble packages, write routes, create playlists, assign students, write local bundles, or mark content student-ready.
- Confirm backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_package_promotion_checklist` before generated packages can promote, write routes, create playlists, assign students, write local bundles, mark content student-ready, or treat support-language-only review as sufficient.
- Confirm backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_package_release_candidate` before generated packages can publish to a private tenant library, write release candidates, write tenant library items, become student-facing, create assignments, release local bundles, mark content student-ready, or treat support-language-only release as sufficient.
- Confirm backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_package_assembly_readiness` before generated packages can assemble packages, write routes, create playlists, write local bundles, assign students, mark content student-ready, or treat support-language-only review as assembly evidence.
- Confirm backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_package_assembly_dry_run` before generated packages can write package JSON, write routes, create playlists, write local bundles, assign students, mark content student-ready, or treat support-language-only dry runs as assembly evidence.
- Confirm backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_package_writer_preflight` before generated packages can execute writers, write package JSON, write routes, create playlists, write local bundles, assign students, mark content student-ready, or treat support-language-only writer preflights as writer evidence.
- Confirm backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_package_writer_rollback_drill` before generated packages can execute writers, execute rollbacks, roll back package JSON, mutate routes, roll back playlists, roll back local bundles, mutate assignments, alter production QR redirects, mark content student-ready, or treat support-language-only rollback evidence as sufficient.
- Confirm backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_package_writer_implementation_readiness` before generated packages can implement writers, execute writers, write app files, mutate routes, create playlists, package local bundles, activate assignments, mark content student-ready, or treat support-language-only implementation evidence as sufficient.
- Confirm backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_package_writer_module_test_plan` before generated packages can run writer tests, patch app files, write package JSON, mutate routes, create playlists, package local bundles, activate assignments, alter production QR redirects, or treat support-language-only test passes as sufficient.
- Confirm `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show AI prototype patch implementation work orders with required-before-work records, allowed future file groups, dry-run verification order, rollback plan, and blocked actions before any patch work order execution or app file work can exist.
- Confirm backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generated_publish_readiness_gate` before generated packages can publish routes, playlists, assignments, local bundles, or student-ready markers.
- Confirm backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `ai_generator_tenant_coverage_gate` before generated package requests can submit, call models, submit verifier packets, assemble packages, create routes, create playlists, assign students, write local bundles, or mark content student-ready.
- Confirm `/teacher/review` shows AI-generated draft packages as read-only queue items with source lineage, verifier packet requirements, target-language audio blockers, media-rights blockers, route/playlist/assignment blocks, and approval blocks before live AI review submission or generated package approval is implemented.
- Confirm tenant-scoped AI draft review routes exist for sample publisher and MiniStar so white-label review can happen without cross-tenant queue leakage.
- Confirm `/teacher/review` shows package writer harness implementation decision blockers on AI-generated draft queue items so review approval cannot bypass generated package writer gates.
- Confirm Memory Match has dedicated MiniStar and sample-publisher student routes at `/memory/demo-unit-1` and `/memory/partner-demo-unit-1`, reusing the pairing parent engine with tap-to-speak cards, deterministic scoring, route-matrix coverage, and no support-language progression unlock.
- Confirm Flashcards has dedicated MiniStar and sample-publisher student routes at `/flashcards/demo-unit-1` and `/flashcards/partner-demo-unit-1`, while `/launch/[code]` remains the teacher QR doorway.
- Confirm active game routes have route contract ids, patterns, and helpers for Flashcards, Match Up, Label It, Memory Match, Balloon Pop, Quiz, True or False, Type Answer, Spelling Practice, Sentence Builder, and Speak It before any new game surface is treated as foundation-ready.
- Confirm active non-entry game routes render the shared `GameCompletionNextCard` so game completion, deterministic rewards, next reviewed activity, activity hub, and Training Academy routing stay consistent without changing scoring or unlock logic.
- Confirm teacher-visible game mode settings profiles exist before timer, difficulty, motion, background media, skin, or attempts controls become live; no settings profile may save choices, override scoring, reduce learning-audio priority, or allow support-language-only progress before policy, persistence, accessibility, and release-control gates pass.
- Confirm game mode settings storage readiness names backend-neutral profile, snapshot, and change-request records with hosted/local write intents before any teacher setting save, arcade speed change, game skin control, or persisted timer/difficulty choice exists.
- Confirm game mode settings backend contracts include schema entities, migration candidates, migration specs, persistence categories, hosted/local write intents, learning-audio priority, target-language-only progress, support-language support-only rules, accessibility review, school policy, release control, deterministic scoring ownership, and safe-default mutation blocks before any real settings save exists.
- Confirm teacher/admin intake exposes a compact game settings backend map before live settings controls exist, so reviewers can see the schema, migration, adapter, and blocked-mutation path without scanning the full backend inventory.
- Confirm AI-generated game drafts name settings profile references and backend settings gates before package review, so generated content cannot bypass timer, difficulty, motion, background media, skin, arcade speed, scoring, support-language, media-only progress, or learning-audio rules.
- Keep active game-route wrappers on shared structural components such as `GameRouteHeaderCard` before adding premium visual skins or micro-interactions.
- Keep playable game routes on shared structural shells such as `PlayableGameRouteShell` before adding premium visual skins, Phaser wrappers, or outside prototype intake.
- Keep active non-entry demo flows on `PlayableGameDemoFlowProps` unless a documented entry, policy, or route-specific exception exists.
- Confirm `/teacher/intake` exposes parent engine readiness before adding more game modes, Phaser wrappers, Z.ai prototype intake, or narrative/AI Tutor routes; Pairing, Selection, and Text-spelling may continue through reviewed active routes, while Narrative remains blocked until state, privacy, persistence, and cost gates exist.
- Confirm `verify:game-modes` passes after parent-engine readiness, game mode catalog, route contract, or active playable route changes, because the verifier now checks parent engine coverage and mode-to-engine alignment.
- Confirm `/teacher/intake` exposes active game replay expectations before using any current route as a reference for Z.ai, Phaser, AI-generated packages, template conversion, or premium polish.
- Confirm `verify:game-modes` passes after active replay checklist changes, because the verifier now checks every `GameModeId` has one replay record under the catalog parent engine.
- Keep replay checklist route paths clickable on `/teacher/intake` so manual QA can jump from evidence expectations to the current active student routes.
- Use `/teacher/game-readiness` as the focused game architecture workbench before Phaser wrappers, premium polish, outside prototype intake, or Z.ai integration review. The route must remain review-only and cannot import prototypes, save settings, launch students, assign work, publish games, or write storage.
- Use `/teacher/persistence` as the focused backend/local storage workbench before selecting a vendor, enabling uploads, storing student progress, exporting reports, activating local bundles, or accepting prototype/package writer storage changes.
- Use `/teacher/prototypes/sample-publisher` and `/teacher/prototypes/ministar` as the focused prototype handoff review workbenches before any outside prototype, Phaser wrapper, Z.ai output, app patch proposal, scoring change, audio manifest change, route creation, package promotion, or student assignment is considered.
- Keep tenant generator routes linked to their focused prototype review workbenches so AI package request context and outside prototype evidence stay connected without authorizing live handoff or patch work.
- Confirm student activity hubs at `/activities/demo-unit-1` and `/activities/partner-demo-unit-1` expose curated reviewed pathways without becoming switch-to-anything template panels.
- Confirm student launch and private assignment routes link to the curated activity hub for the same launch code without unlocking progress or exposing teacher/admin controls.
- Confirm local companion bundle manifests include curated activity hub fallback routes so hosted PWA and closed textbook package navigation stay aligned.
- Confirm shared AI draft validation rejects early MiniStar Japanese support unless it is `ja-hiragana`, hiragana-only, and marked support-only before any live model call, package review, route creation, playlist creation, assignment, or student-ready marker can exist.
- Confirm shared AI gamification validation enforces Star Dust caps, mastery thresholds, deterministic collection unlocks, accepted trigger events, required records, and blocked random/gacha/media/support-language shortcuts before reward readiness, package review, route creation, playlist creation, assignment, Spin Wheel tickets, avatar evolution, or collection inventory writes can exist.
- Confirm AI reward readiness gates depend on shared gamification mapping guard clearance before reward publish, collection inventory, Spin Wheel tickets, avatar evolution, generated package approval, route creation, playlist creation, assignment, or student-ready markers can exist.
- Confirm `npm run verify:ai-generator` passes after changes to AI authoring, game generation, activity pathway generation, target-language audio requirements, premium AI Tutor generation requests, or generator routes.
- Confirm `npm run verify:prototype-review` passes after changing prototype review routes, generator prototype links, game readiness prototype links, or Z.ai/Phaser/outside prototype handoff gates.
- Confirm `npm run verify:review-keys` passes after changing upload, evidence, media, persistence, or other teacher/admin review panels that render repeated checklist text.
- The review-key verifier now includes policy, private-library, draft-edit, and teacher-session review surfaces so repeated warning/error output cannot regress to message-only keys outside the persistence panel.
- Keep active route verification streaming and concise as the route matrix grows; route failures must identify the path and reason without weakening expected-text coverage.

## Session 8: Premium Experience Layer

Purpose: Add polish only after the vertical slice, content package, QR strategy, multimedia foundation, game-engine foundation, Training Academy foundation, assist-language foundation, package publish gate, approval ledger, release-control durable records, backend schema draft, and backend migration candidates are stable.

Outputs:

- Visual asset direction.
- Micro-interactions.
- Avatar/reward presentation.
- Themed game skins.
- Sound feedback.
- Multimedia presentation polish.

## Session 9: Optional Premium AI Tutor Layer

Purpose: Preserve a saleable premium AI Tutor package for upper-level speaking, writing, correction, role play, and adaptive review without making the core platform depend on AI costs.

Current status: Strategy, ADRs, future requirement, standards, decision register entries, shared content-model contracts, tenant feature entitlement shape, disabled MiniStar sample entitlement, disabled Level 1 package plan, dashboard package status, and focused verification checklist exist on `legacy-source-import`. Active tutor UI, model calls, speech services, billing, and tutor routes remain explicitly deferred.

Required gate:

- Complete local build/browser verification of the foundation slice first.
- Confirm privacy, safety, transcript, usage-limit, and teacher-report rules before active tutor implementation.
- Select one upper-level unit before building the first tutor prototype.
- Keep AI Tutor premium-gated and disabled cleanly for tenants that do not adopt it.

Outputs:

- Tenant feature entitlement model.
- Unit-level tutor plan model.
- Upper-level tutor prototype route after foundation verification.
- Teacher-visible tutor summary events.
- Usage and cost controls.
- Safety and privacy verification.

## Build Session Rule

If a proposed task does not fit one of these sessions, document whether it is:

- a new required session,
- a future requirement,
- or a distraction from the current foundation path.

## Next Recommended Build Task

Do not add premium polish yet.

The hard gate is to keep typecheck/build passing after every route or package addition. The next safest task is local verification of `/teacher/intake`, `/teacher/generator/sample-publisher`, `/teacher/sessions/demo-unit-1`, and `/teacher/sessions/partner-demo-unit-1`; after that, continue with backend-agnostic migration candidates, teacher session settings, package release-control refinement, and persistence-adapter work before choosing a real storage vendor.

Package adoption record previews must stay preserved as backend-neutral storage contracts before accepted adoption records, billing entitlement writes, model calls, microphone scoring, report export enablement, hosted storage activation, or local companion activation can exist.

The entitlement workbench must keep package adoption storage guards visible so admins can review storage contracts, visible fields, required pre-activation decisions, and blocked premium activations before any package adoption workflow is designed.

Release-control workspaces must link back to the entitlement workbench and keep premium package adoption, billing entitlement writes, microphone scoring, and report export enablement blocked until policy, storage, and release gates close.

Prototype intake queue items must stay preserved as backend-neutral hosted/local storage contracts before any Z.ai or outside prototype inventory can become return-review, wrapper-review, route, scoring, reward, playlist, package, or assignment work.

Prototype intake storage guards must remain visible on game-readiness and tenant prototype review workbenches before any outside-game intake workflow is designed.

Prototype intake evidence packet flows must remain visible before Z.ai or outside game inventory can move from queue inventory toward controlled Codex review.

Prototype intake readiness summaries must remain visible and must say when Codex has not issued a green-light alert for controlled Z.ai/outside prototype intake.

Returned prototype package checklists must remain visible before any Z.ai, Phaser, DOM reference, or outside game prototype can be treated as returned evidence. They must require source archive manifest, reviewed fixture, event/scoring replay, target-language audio coverage, mobile accessibility capture, and wrapper boundary notes while blocking archive import, direct app file copies, route replacement, scoring mutation, rewards, playlists, promotion, and assignment.

Returned prototype package checklist storage contracts must remain backend-neutral across schema drafts, migration candidates, migration specs, durable records, hosted write intents, and local write intents before any returned prototype evidence can become durable return-review, wrapper-review, route, scoring, reward, playlist, package, or assignment workflow.

Prototype return package checklist storage guards must remain visible on game-readiness and tenant prototype review workbenches alongside intake guards before returned Z.ai, Phaser, DOM reference, or outside-game evidence can move toward Codex review.

Prototype return readiness summaries must remain visible on game-readiness and tenant prototype review workbenches. They must keep Codex return review closed until returned package checklist, return storage guard, source archive manifest, fixture replay, target-language audio, mobile accessibility, deterministic scoring, and wrapper-boundary evidence are complete.

AI generation request storage guards must remain visible on tenant generator routes beside disabled request builders. They must require durable request packet, cost gate, audio coverage, activity compatibility, media rights, draft package, and verifier submission records before live model dispatch, model billing, draft generation, verifier submission, routes, playlists, packages, assignments, or support-language progress can exist.

AI generation request packet storage contracts must remain backend-neutral across schema drafts, migration candidates, migration specs, durable records, hosted write intents, local write intents, validator checks, and active route verification before any live AI request submission, model dispatch, model billing, draft generation, verifier submission, generated package assembly, route write, playlist write, assignment, student-ready marker, or support-language progress workflow can exist.

AI generation request packet previews must remain visible on tenant generator routes between the disabled request builder and storage guard. They must show evidence links, target-language-only progress, support-language support-only rules, required-before-live items, reviewer notes, blocked actions, guard blocks, and guard warnings before any model call, model billing, draft generation, verifier submission, package assembly, route write, playlist write, assignment, student-ready marker, or support-language progress workflow can exist.

AI request-to-draft handoff previews must remain visible on tenant generator routes between request packet review and downstream draft/package review. They must link the request packet to the draft preview, preserve cost, prompt, target-language audio, compatibility, and media-rights lanes, and keep draft creation, draft JSON writes, model dispatch, billing, verifier submission, package assembly, route writes, playlist writes, assignment, student-ready markers, and support-language progress blocked.

AI draft repair evidence packets must remain visible after draft correction queues. They must link draft previews and correction queues to schema validation, target-language audio, media-rights, and verifier-submission evidence before verifier submission can be considered, while auto-fix, live AI regeneration, package assembly, route writes, playlist writes, assignment, student-ready markers, and support-language progress remain blocked.

AI verifier submission packets must pass a shared verifier packet guard before any verifier workflow can be considered. The guard requires draft repair evidence packets, schema validation, pedagogical lock, target-language progression, audio, engine, gamification, compatibility, rights, and teacher-approval records, and keeps verifier submission, package approval, routes, playlists, assignments, and student-ready markers blocked.

AI verifier submission storage guards must remain visible after verifier packets and before downstream package review. They must preserve backend-neutral `teacher_draft_verifier_submission` records, hosted/local companion adapter requirements, reviewer identity, evidence attachments, retention policy, audit trail, target-language audio approval, media-rights evidence, approval ledger, release-control binding, and blocked live verifier/package/route/playlist/assignment/student-ready/support-language progress actions.

AI verifier result evidence packets must remain visible after verifier storage guards and before teacher approval prep. They must remain offline review previews with `verifier-result-not-submitted`, preserve source-record checks and required repairs, and block live verifier calls, pass/fail finalization, teacher approval, package approval, route writes, playlist writes, assignments, student-ready markers, and support-language progress.

AI generated package teacher review packets must depend on `ai_verifier_result_evidence_packet`, not only verifier submission packet visibility. Teacher approval capture remains blocked when verifier result evidence is not submitted, unresolved, or missing.

AI generated package promotion checklists must depend on `ai_verifier_result_evidence_packet`, not only verifier submission packet visibility. Promotion remains blocked while verifier result evidence is `verifier-result-not-submitted`, unresolved, or missing.

AI generated package writer route and playlist write guards must remain visible after harness implementation decisions. Route registry writes, media playlist writes, production QR redirect mutation, student-facing route activation, writer execution, and support-language-only route or playlist approval remain blocked until this guard has storage, review, and release-control backing.

AI generated package writer local companion package guards must remain visible after route and playlist write guards. Local bundle packaging, local folder activation, offline route activation, media file copy, export archive creation, local companion release, assignment activation from local companion, writer execution, and support-language-only local package approval remain blocked until this guard has storage, school-policy, rollback, media-rights, and student-data exclusion backing.

AI generated package writer route/playlist and local companion guard storage contracts must remain visible in backend schema drafts, migration candidates, migration specs, durable record contracts, and active route verification. These records preserve guard evidence only; they do not enable route writes, playlist writes, local package export, media copy, assignment activation, student-ready markers, or support-language-only approval.

AI generated package writer assignment shell guards must remain visible after local companion package guards. Assignment shell writes, private assignment link activation, class roster binding, progress event stream activation, teacher report export, live classroom launch, assignment activation from generated packages, writer execution, and support-language-only assignment approval remain blocked until storage, school-policy, roster, reporting, event taxonomy, and launch-gate backing exist.

AI generated package writer assignment shell guard storage contracts must remain visible in backend schema drafts, migration candidates, migration specs, durable record contracts, and active route verification. These records preserve assignment-shell guard evidence only; they do not enable assignment writes, private assignment links, roster binding, progress streams, teacher report export, live classroom launch, raw audio/transcript storage, or support-language-only assignment approval.

AI generated package writer assignment handoff evidence packets must remain visible after assignment shell guards and before rollout gates, private assignment links, class roster binding, progress streams, report exports, or classroom launch workflows can be considered. They must require assignment shell guard storage, teacher QR/front-door review, target-language trigger proof, private-link policy proof, no-real-learner-data proof, teacher report privacy proof, progress event taxonomy proof, classroom launch gate review, rollback evidence, and support-language boundary proof while blocking assignment handoff, raw learner audio/transcript storage, and support-language-only handoff.

AI generated package writer assignment handoff evidence packet storage contracts must remain visible in backend schema drafts, migration candidates, migration specs, durable record contracts, and active route verification. These records preserve assignment handoff evidence only; they do not enable assignment handoff, private assignment links, roster binding, progress streams, teacher report export, classroom launch, raw learner audio/transcript storage, generated assignment activation, writer execution, or support-language-only handoff.

Teacher assignment rollout gates must preserve generated-package handoff source evidence packet ids, generated package policy notes, and blocked generated-package handoff fields before generated assignment rollout work can be considered. These rollout records still cannot schedule classes, activate private links, bind rosters, start progress streams, export reports, launch classrooms, store raw learner audio/transcripts, or bypass school policy.

Active student game routes must show the shared learning-audio contract before the playable game surface. The contract must count target-language term, sentence, and instruction cue coverage, emit `audio_requested` as support-only evidence, and state that support language, tap-to-speak, and background media cannot unlock progress, mastery, scoring, or rewards.

Teacher session monitor and report package previews must show `audio_requested` as a separate support-only learning-audio evidence lane. It may explain engagement and accessibility, but cannot unlock games, award mastery, change score values, or replace target-language answer/result events.

The focused game-readiness workbench must show activity pathway compatibility next to parent-engine readiness, active replay checks, game offers, and prototype intake gates. This keeps game design and Z.ai/prototype planning governed by curated pathway rules rather than broad template-switch promises.

Activity compatibility review must display audio and reporting lanes for every pathway. A payload may fit a mode, but it is not integration-ready until learner-facing target-language audio and teacher-visible standard reporting are explicit.

The dedicated activity-pathway verifier must protect the audio/reporting lanes and focused game-readiness visibility so the rule survives future UI, generator, printable, and prototype-review changes.

Playable game-mode routes must use the shared exhaustive game-mode route helper before appearing in launch, activity hub, recommendation, completion, teacher shortcut, or partner demo surfaces. This keeps future game additions and outside prototype reviews from creating route drift and should make missing route mappings fail during typecheck.

The game-readiness workbench must keep an active game route catalog visible, sourced from the shared route helper, before broader Phaser/Z.ai prototype review begins. It is a review-only map of active route surfaces, not a route publisher or prototype import tool.

Local companion manifests must name every active playable game mode as included, planned, or blocked using shared `GameModeId`, shared parent-engine ids, target-language audio coverage, progress-reporting status, and local paths before any closed textbook package export, installer, offline-ready status, or retained report storage can be designed.

Local companion previews must stay visible for both the flagship MiniStar tenant and at least one white-label sample publisher tenant. The shared preview panel is review-only and cannot export packages, install local apps, claim offline-ready status, store student data, or mutate QR redirects.

The focused persistence workbench must show the evidence storage adapter selection gate beside backend schema, migration, boundary, and adapter-readiness panels. Hosted managed storage remains the recommended first pilot path for cost control, while closed local and hybrid storage remain visible but policy-gated. This gate cannot select a vendor, create buckets, activate local folders, generate signed URLs, upload files, export attachments, migrate evidence, activate local companion packages, or mutate release state.

Assignment rollout must have a focused teacher/admin workbench before live scheduling exists. The route must keep private assignment links, QR/front-door entry, roster scope, generated-package assignment handoff evidence, progress persistence, report export, school policy, and local companion rollout blockers visible while blocking live class scheduling, private assignment activation, roster binding, progress stream activation, report export, real learner data collection, and support-language-only progress.

Teacher media library previews must be tenant-aware before live upload or media replacement work begins. MiniStar and white-label partner tenants need separate media readiness views, correct tenant branding, tenant-owned asset labels, rights records, playlist/background/local bundle review, target-language learning-audio priority, support-language-only boundaries, and blocked live upload/transcode/storage/activation actions.

Shared app-shell navigation must be tenant-aware before more teacher workbenches are added. MiniStar pages should link to MiniStar source, generator, prototype, review, media, session, and local preview routes while partner-only upload, evidence, asset, release-control, launch-gate, and partner session links stay on sample-publisher branded pages until equivalent tenant routes exist.

Tenant navigation boundaries must remain visible on `/teacher/intake` before more tenant workbenches are added. The boundary panel must distinguish shared platform routes, tenant-scoped review routes, sample-publisher-only operational routes, and MiniStar routes that are intentionally not created yet, while keeping uploads, evidence export, release-state mutation, local package export, assignments, storage writes, and live workflow activation blocked.

Route graduation gates must remain visible on `/teacher/intake` before scaffold routes can be discussed as student-ready, pilot-ready, production QR-backed, or local companion-ready. A local `200` route is useful evidence, but it does not graduate without tenant boundary, target-language audio, standard progress events, teacher report, private assignment, school policy, backend storage, QR alias, rollback, media-rights, and local fallback evidence.

Foundation workstream visibility must remain at the top of `/teacher/intake` as the control room grows. The index must show routes/QR, content intake/uploads, game engines, audio/media/language, teacher operations/reporting, pilot/policy/evidence, backend/persistence/local companion, and future Z.ai intake status while blocking live feature activation, student data collection, public community libraries, unmanaged asset adoption, direct AI publish, and premature Z.ai imports.

The main `/teacher` page must show a compact foundation status snapshot while the platform is still in foundation and pilot-readiness stages. It should say structure first, show the active route count, confirm tenant-boundary visibility, and keep the Z.ai intake timing visible without activating live workflow.

The Z.ai human handoff signal must remain explicit on the game-readiness workbench. Until Codex changes the alert from not-ready to ready-for-review, no Z.ai source handoff, Phaser import, archive upload, pull request, app patch, route replacement, scoring mutation, audio manifest mutation, reward write, playlist write, package promotion, or student assignment is requested.

PWA and offline readiness must remain visible on `/teacher/intake` before any closed local companion, offline media package, or installable-app promise is made. The manifest can support an installable hosted shell, but service worker registration, cache mutation, media precache, background sync, local installer export, student data offline storage, production QR mutation, and local package activation stay blocked until rights, checksums, versioned manifests, QR fallback, rollback, persistence, reporting, and school policy gates are complete.

Local companion preview routes must show the same PWA/offline readiness gate as `/teacher/intake`. `/local/ministar` and `/local/sample-publisher` are partner-facing planning surfaces, so they must state that the package is previewable only and cannot become an offline-ready installer, media bundle, QR fallback, or local learner-data product from a visible route.

Media bundle integrity must remain visible on `/teacher/intake`, `/local/ministar`, and `/local/sample-publisher`. The gate must keep bundle size budgets, checksum manifests, duplicate media detection, streaming/local fallback, yearly edition replacement, and learning-audio priority visible before any local package, media bundle, installer, upload promotion, or offline delivery workflow is treated as available.

The focused deployment decision workbench must remain visible at `/teacher/deployment`. It should recommend hosted PWA as the first pilot path for cost control while keeping local classroom server and packaged textbook companion options visible but gated by media, storage, QR, report, school policy, rollback, and package entitlement evidence.

The focused pilot readiness dashboard must remain visible at `/teacher/pilot`. It is the first partner conversation command view: demo-ready routes may be shown, but classroom launch, real learner data, report export, policy acceptance, local package activation, offline-ready claims, premium AI Tutor activation, and Z.ai prototype intake remain blocked until the underlying evidence routes close. The dashboard must also surface the partner follow-up packet status and link to its review-only preview.

The partner pilot requirements intake must remain visible at `/teacher/pilot/requirements/sample-publisher`. It is a requirements conversation guide for publisher supplies and school decisions, not a live upload form, storage selector, policy acceptance flow, premium AI adoption flow, Z.ai handoff request, or classroom launch action.

The partner pilot evidence traceability map must remain visible inside `/teacher/pilot/requirements/sample-publisher`. It links source extraction, media rights, curated activity pathway, QR/front-door, learner data policy, report/export, deployment, premium AI Tutor, and Z.ai/outside prototype requirements to their evidence routes, current signals, blocked-until conditions, and pilot dependencies without enabling live capture or classroom launch.

The first partner pilot meeting agenda must remain visible inside `/teacher/pilot/requirements/sample-publisher`. It gives adults the sequence of source package, multimedia rights, activity pathway, QR/front-door, learner data policy, reporting, deployment, premium AI, and outside prototype questions while keeping file collection, policy acceptance, storage selection, report export, local app promises, premium AI adoption, Z.ai handoff, and classroom launch blocked.

The first partner pilot follow-up packet preview must remain visible inside `/teacher/pilot/requirements/sample-publisher`. It organizes requested evidence, school decisions, demo links, blockers, and the next evidence gate while keeping email, download, attachment storage, policy acceptance, report export, release mutation, premium AI activation, Z.ai handoff, and classroom launch blocked.

The shared content-model validator must enforce package isolation before tenant content can be treated as reviewed. It rejects duplicate units, cross-tenant package references, orphan media/audio records, cross-unit playlist media, and multimedia bindings from another unit; this protects white-label tenant boundaries without selecting a storage vendor or enabling live publishing.

The same validator now enforces the durable Japanese assist script contract. Student-visible Japanese plans must declare a script policy; Foundation, Bronze, and Plus level bands require hiragana-only content; and Silver-or-later mixed-script content requires a reviewed mixed-script or tenant-defined policy. This is package validation, not a UI-only convention, and it remains separate from Japanese-as-target-language readiness.

AI generator request previews must carry the same assist-language script policy and level-band fields into draft generation evidence. The generator may propose content, but it cannot drop the package policy between request, draft, verifier, or teacher review stages.

Package readiness now exposes assist-language policy records and a separate coverage section. A reviewed assist translation does not appear fully ready when its student-visible Japanese script policy is invalid or undeclared; support remains optional and non-blocking at pilot level, while package validation still blocks invalid student-facing content.

The evidence handoff preview now carries a dedicated unit-package readiness section. It identifies payload validation, target-language audio coverage, assist-language script policy, and curated activity pathway records as handoff evidence while keeping package snapshots, signed release decisions, retention policy, export, storage, publishing, and assignment activation blocked.

The AI service foundation is now explicit in `apps/ai-service`. Its provider-neutral review-only contract validates tenant/source state, the 8-12 vocabulary rule, exactly two sentence structures, target-language audio, media rights, teacher approval, and premium cost policy while keeping model calls, billing, uploads, package writes, verifier submission, route/playlist writes, assignments, and support-language progression blocked.

The persistence runtime boundary now sits between typed record plans and future storage adapters. A review-only adapter evaluates tenant scope, policy, privacy, release, and payload evidence and produces no side effects; hosted, local, and hybrid writes remain unavailable until their own release gates close.

The teacher report runtime boundary now sits between report plans/event evidence and future report providers. It validates the shared event taxonomy, pseudonymous learner slots, raw-audio/transcript exclusion, teacher/policy/persistence/export/release gates, and review-only no-side-effect behavior before reporting can become live.

The asset/media runtime boundary now sits between upload/media readiness evidence and future file providers. It validates tenant scope, MIME/type, size, checksum, scan, rights, source review, unit/game mapping, learner-media exclusion, storage policy, and release gates while returning no-side-effect review results.

The content-package runtime boundary now sits between package validation/readiness evidence and future student-facing publishers. It validates tenant/package scope, target-language audio, assist-language policy, curated pathways, storage/persistence, content review, and release gates while keeping package writes, student-ready markers, QR activation, assignments, routes, playlists, and local companion mutation blocked.

The classroom launch runtime boundary now sits between QR/front-door/assignment evidence and future session providers. It validates tenant/package/session scope, teacher role, package and assignment approval, access review, school/roster/reporting policy, persistence, target-language audio, and student-launch state while keeping classroom activation, learner-data collection, QR mutation, roster binding, report streams, progression, and rewards blocked.

The assignment runtime boundary now sits between assignment plans/access evidence and future private-link providers. It validates package and launch approval, private-link and roster policy, persistence, reporting, target-language audio, assignment readiness, and access-code rules while keeping assignment writes, private links, roster binding, progress streams, reports, and classroom launch blocked.

The source-intake runtime boundary now sits between source/upload evidence and future OCR, parser, AI extraction, and draft providers. It validates tenant/package scope, file policy, scan, lineage, rights, extraction method, OCR confidence, segmentation, schema, target mapping, package, and release gates while keeping raw source payloads, unreviewed extraction, direct AI assignment, and student activation blocked.

The release runtime boundary now sits between release-control evidence and future package/QR/assignment providers. It validates source extraction, asset rights, target-language audio, curated pathways, package runtime, verifier evidence, approval, school policy, persistence, and rollback while keeping release-state mutation, QR mutation, student-ready markers, assignments, and classroom launch blocked.

The foundation verification composition now includes the AI service and persistence runtime checks alongside the remaining provider-neutral runtime gates, AI service typecheck, web typecheck, production build, and active route verification. A dedicated composition verifier fails if a future edit removes one of these checks from the canonical command.

The recovery and continuity runtime boundary now sits between deployment/persistence evidence and future hosted, local, or hybrid backup providers. It validates manifest, checksum, encryption, access, retention, school policy, report integrity, rollback, release, and learner-data exclusion evidence while keeping backup creation, restore, export, package/media copy, QR/route mutation, learner-data recovery, and rollback execution blocked.

The progression event runtime boundary now sits around the shared progress-event envelope and taxonomy. It requires target-language evidence for progress-affecting events, rejects support-only and report-only events as progression authority, preserves deterministic reward policy, and keeps mastery, scores, rewards, unlocks, and persistence mutation blocked in review-only mode.

The reward and collection runtime boundary now sits between accepted progression evidence and future inventory providers. It validates pseudonymous learner scope, source events, mastery, deterministic rules, ownership provenance, policy, persistence, and release approval while keeping random rewards, gacha, purchase-required unlocks, direct inventory writes, Spin Wheel ticket issuance, and progression bypasses blocked.

The feature entitlement runtime boundary now sits between tenant/package options and future premium or privacy-sensitive providers. It validates teacher approval, school/privacy/cost policy, persistence, release, allowed levels, usage limits, and target-language audio while keeping AI Tutor dispatch, microphone recording, provider billing, student unlocks, and entitlement mutation blocked.

The runtime behavior harness now compiles and exercises the AI authoring, assist-language script, package, launch, assignment, persistence, report, progression, recovery, reward, entitlement, asset, source, and release contracts. It rejects invalid AI pedagogical counts, missing target-language audio/media rights, early-level Japanese mixed script, invalid hiragana-only glosses, review-only microphone activation, tenant mismatch, support-only progression, random rewards, unsafe recovery, missing local fallback evidence, core-tier AI Tutor activation, learner-recorded asset media, raw source student payloads, raw learner audio persistence/reporting, and real-identifier reports while checking premium entitlement completeness, hosted recovery readiness, deterministic entry unlocks, bounded Star Dust, and review-only no-side-effect results before the full foundation build proceeds. A fully satisfied release evidence case remains a contract test only; it does not activate any provider.

The audio-first package behavior slice now makes `UnitAudioSupportPlan.targetLanguage` explicit. The shared package validator rejects missing plans, missing referenced cues, incomplete vocabulary/sentence coverage, and learner-facing cues in the wrong language. The runtime validator also rejects a plan/runtime target-language mismatch. The compiled behavior harness covers missing plans, wrong cue language, and runtime mismatch while preserving review-only no-side-effect behavior.

The audio cue semantic coverage slice now rejects sentence cues placed in vocabulary coverage arrays and non-sentence cues placed in sentence coverage arrays. This keeps term and syntax evidence meaningful for every parent engine before release or student assignment.

The pedagogical text integrity slice now rejects blank vocabulary terms, case-insensitive duplicate terms, and blank target sentence structures in both shared unit validation and AI authoring request validation. Count rules remain 8-12 terms and exactly 2 sentence structures.

The unit metadata and teacher launch integrity slice now rejects invalid level/module/unit identity, blank theme or engine identifiers, incomplete visual rules, and incomplete teacher hook/activity/review copy before imported or generated units can enter review.

The content-package metadata integrity slice now rejects malformed creation timestamps and update timestamps that are invalid or precede creation. Package lineage remains review-only and provider-neutral.

The AI request boundary hardening slice now treats external JSON as untrusted input. The validator returns deterministic errors for malformed request objects, scalar fields, arrays, and support-language policy records instead of throwing or allowing malformed data to reach a provider adapter. The focused AI-service verifier, AI-service typecheck, runtime behavior harness, and full foundation gate remain required before any live provider work.

The AI readiness-flag integrity slice now requires strict booleans for target-language audio, media rights, teacher approval, and premium-cost policy. String values such as `"true"` and `"false"` cannot pass a review gate through JavaScript truthiness. No provider, billing, upload, package, route, playlist, assignment, or Z.ai action was enabled.

The content-package runtime flag integrity slice now applies the same strict-boolean rule to curated pathway review, storage policy, persistence, teacher release, student-facing use, and QR activation. Stringified flags cannot influence package-use or QR decision branches, and no publisher, storage, route, playlist, assignment, or Z.ai action was enabled.

The persistence runtime flag integrity slice now applies strict booleans to student-data, raw-audio, transcript, school-policy, policy-acceptance, and release fields. Stringified privacy or approval values cannot influence hosted, local, hybrid, export, or mutation decisions. No storage adapter or learner-data write was enabled.

The teacher-report runtime flag integrity slice now applies strict booleans to teacher role, policy, persistence, export, release, raw-audio, and transcript fields. Stringified report approvals or privacy exclusions cannot influence evidence interpretation or export branches. No report adapter or learner-data export was enabled.

The assignment runtime flag integrity slice now applies strict booleans to teacher, package, launch, link-policy, roster, persistence, reporting, audio, support-language, student-use, private-link, and write fields. Stringified assignment approvals or activation flags cannot influence classroom access, progress, roster, or assignment-write branches. No assignment adapter or live link was enabled.

The launch runtime flag integrity slice now applies strict booleans to teacher, package, assignment, QR review/readiness, fallback, school, roster, persistence, reporting, audio, support-language, learner-data, and student-launch fields. Stringified launch approvals or QR flags cannot influence classroom access or learner-data branches. No launch adapter, QR mutation, roster binding, or student activation was enabled.

The asset runtime flag integrity slice now applies strict booleans to tenant storage, size-budget, target mapping, release, learner-media, learner-upload, and student-facing-use fields. Stringified asset approvals or safety flags cannot influence future upload, promotion, binding, or export branches. No asset adapter, storage write, media transform, or student-facing asset activation was enabled.

The source runtime flag integrity slice now applies strict booleans to upload policy, scan, lineage, rights, OCR, extraction, segmentation, schema, mapping, package, release, raw-source, draft, AI-extraction, and student-facing-use fields. Stringified source approvals cannot influence PDF/DOCX/OCR intake, teacher-draft creation, or student-facing source branches. No parser, OCR service, source write, package write, or Z.ai action was enabled.

The release runtime flag integrity slice now applies strict booleans to source extraction, asset rights, target-language audio, curated pathway, package, teacher, school, persistence, rollback, QR mutation, and student activation fields. Stringified release approvals cannot influence approved/active transitions, rollback, QR mutation, or student-facing activation. No release adapter, QR mutation, package activation, or Z.ai action was enabled.

The recovery runtime flag integrity slice now applies strict booleans to persistence, backup manifests, checksums, encryption, access control, retention, school policy, report integrity, rollback, release approval, raw learner-media exclusion, and local fallback review. Stringified recovery approvals cannot influence backup, restore, export, rollback, or learner-data branches. No recovery adapter, archive write, restore, or release rollback was enabled.

The progression runtime flag integrity slice now applies strict booleans to progression policy, persistence, reporting, deterministic rewards, and target-language evidence. Stringified progression flags cannot influence mastery, score, Star Dust, game unlocks, or support-only/report-only event handling. No progression adapter, learner-data write, or reward mutation was enabled.

The reward runtime flag integrity slice now applies strict booleans to mastery evidence, ownership provenance, reward policy, persistence, release approval, random rewards, gacha pressure, purchase requirements, and Spin Wheel requests. Stringified reward flags cannot influence collection ownership, Star Dust, ticket issuance, or anti-gacha safeguards. No inventory adapter, reward write, ticket issuance, or Z.ai action was enabled.

The entitlement runtime flag integrity slice now applies strict booleans to teacher approval, school policy, privacy, cost, persistence, release, allowed levels, usage limits, and target-language audio. Stringified entitlement flags cannot influence AI Tutor, microphone practice, package-tier, premium-cost, or student-facing feature decisions. No provider billing, microphone capture, AI Tutor dispatch, or feature activation was enabled.

The AI-service review formatter now also normalizes assist-language and approval flags with strict checks after validation, preventing direct malformed callers from receiving misleading readiness warnings. Provider dispatch, billing, package writes, route writes, verifier submission, and Z.ai integration remain blocked.

The audio cue identity integrity slice now rejects duplicate cue IDs inside a package before plan resolution. This prevents ambiguous target-language audio selection across games, controls, and teacher previews.

The media asset metadata integrity slice now rejects empty asset IDs/titles and invalid negative or non-finite durations while preserving separate tenant, rights, scan, checksum, storage, and release gates for future uploads.

The approved-package rights and placeholder safety slice now rejects unknown media rights and placeholder learner audio when a package claims approved status. Draft/reviewed repair states remain visible but non-student-ready.

The playlist and multimedia relation integrity slice now rejects empty or unnamed playlists, repeated media assets within a playlist, duplicate multimedia plans for one unit, and default-enabled background media without a background asset. The runtime harness covers each rejection before package release or game integration.
This decision is recorded in `docs/adr/0521-playlist-multimedia-relation-integrity.md` and `docs/decision-register/DR-592-playlist-multimedia-relation-integrity.md`.

The approved media provenance slice now requires owner identity and at least one hosted or local locator for every approved media asset. This preserves hosted-only, local-only, and hybrid white-label deployment options while preventing approval records that cannot be traced or delivered.
This decision is recorded in `docs/adr/0522-approved-media-provenance-and-locators.md` and `docs/decision-register/DR-593-approved-media-provenance-and-locators.md`.

The approved video accessibility slice now requires a poster reference and transcript/caption reference for every approved video. Draft and reviewed videos remain repairable, while optional video stays separate from learner-critical target-language audio.
This decision is recorded in `docs/adr/0523-approved-video-accessibility-evidence.md` and `docs/decision-register/DR-594-approved-video-accessibility-evidence.md`.

The audio cue media binding slice now validates optional cue-to-media references for package existence, audio kind, tenant, and unit boundaries. Text-to-speech and fallback voice cues remain valid without a media asset reference.
This decision is recorded in `docs/adr/0524-audio-cue-media-binding-integrity.md` and `docs/decision-register/DR-595-audio-cue-media-binding-integrity.md`.

The recorded audio delivery locator slice now requires recorded, teacher-recorded, and partner-provided cues to name a media asset or hosted/local locator. Text-to-speech and fallback voice cues remain provider-neutral.
This decision is recorded in `docs/adr/0525-recorded-audio-delivery-locators.md` and `docs/decision-register/DR-596-recorded-audio-delivery-locators.md`.

The audio coverage uniqueness slice now rejects repeated cue IDs inside vocabulary, sentence, instruction, feedback, or individual game-mode arrays while allowing deliberate reuse across separate coverage groups.
This decision is recorded in `docs/adr/0526-audio-coverage-uniqueness.md` and `docs/decision-register/DR-597-audio-coverage-uniqueness.md`.

The audio cue semantic coverage slice now requires term, sentence, instruction, and feedback arrays to reference matching cue kinds, while preserving flexible mixed-kind game-mode arrays.
This decision is recorded in `docs/adr/0527-audio-cue-semantic-coverage.md` and `docs/decision-register/DR-598-audio-cue-semantic-coverage.md`.

The audio cue canonical text and unit binding slice now requires vocabulary and sentence cues to match canonical unit text and requires every cue referenced by a unit plan to be bound to that same unit. Instruction and feedback cues remain kind-checked and unit-bound without inventing canonical copy requirements.
This decision is recorded in `docs/adr/0528-audio-cue-canonical-text-and-unit-binding.md` and `docs/decision-register/DR-599-audio-cue-canonical-text-and-unit-binding.md`.

The game-mode audio coverage slice now rejects unsupported coverage keys, UI-label/story-line cues in gameplay arrays, and cue-level mode declarations that conflict with the coverage lane. Cross-mode reuse remains allowed when no conflicting declaration is present.
This decision is recorded in `docs/adr/0529-game-mode-audio-coverage.md` and `docs/decision-register/DR-600-game-mode-audio-coverage.md`.

The background media mode policy slice now rejects duplicate and unsupported allowed game-mode IDs in multimedia plans while keeping autoplay, volume, persistence, and progression behavior blocked.
This decision is recorded in `docs/adr/0530-background-media-mode-policy.md` and `docs/decision-register/DR-601-background-media-mode-policy.md`.

The persistence contract alignment slice now checks the durable-record and
hosted/local adapter layers together. Tenant-bound progress, teacher-report,
and complete external-prototype evidence categories must appear in both
layers, and every adapter intent must reuse the durable record's named tenant
boundary key. Review-only records remain explicitly allowed to wait for a
later storage decision. The teacher persistence surfaces now display alignment
failures alongside adapter failures.

This decision is recorded in `docs/adr/0557-persistence-contract-alignment.md`
and `docs/decision-register/DR-629-persistence-contract-alignment.md`.

The backend contract alignment slice now checks the vendor-neutral schema,
migration candidates, and migration specifications together. Missing schema
targets, orphan migration specs, empty primary keys, empty tenant scopes, and
duplicate fields are rejected before provider-specific migration design.

This decision is recorded in `docs/adr/0558-backend-contract-alignment.md`
and `docs/decision-register/DR-630-backend-contract-alignment.md`.

The scoring profile compatibility slice now requires every scoring profile to declare supported parent engines, learner roles, and skill focuses. The game-mode verification gate compares those declarations with each catalog mode so reward semantics cannot drift away from the engine or pedagogical purpose. This remains verification-only and does not award dust or mutate progression.
This decision is recorded in `docs/adr/0539-scoring-profile-compatibility.md` and `docs/decision-register/DR-611-scoring-profile-compatibility.md`.

The deterministic scoring math slice now validates profile metadata, non-negative integer award components, exact component-to-cap totals, and the canonical 1,000-dust ceiling. The shared accuracy helper also clamps caller-supplied minimum awards to the profile cap. This prevents reward inflation or ambiguous scoring before progression providers are enabled.
This decision is recorded in `docs/adr/0540-deterministic-scoring-math.md` and `docs/decision-register/DR-612-deterministic-scoring-math.md`.

The progression award normalization slice now sanitizes negative, fractional, and non-finite Star Dust inputs in the shared calculator and local completion adapter. Runtime assertions cover malformed mastery values, while completion-event metadata and local progression use one normalized award value. No persistence or inventory side effect is introduced.
This decision is recorded in `docs/adr/0541-progression-award-normalization.md` and `docs/decision-register/DR-613-progression-award-normalization.md`.

The reserved completion metadata slice now prevents optional game metadata from overwriting the normalized `earnedStarDust` value. Completion-event metadata and local progression state therefore remain aligned even when a mode supplies extra scoring context.
This decision is recorded in `docs/adr/0542-reserved-completion-metadata.md` and `docs/decision-register/DR-614-reserved-completion-metadata.md`.

The progress-event timestamp slice now requires parseable ISO/RFC3339 timestamps with an explicit timezone in every envelope. Runtime behavior covers rejection of date-only values while preserving review-only progression behavior.
This decision is recorded in `docs/adr/0543-progress-event-timestamps.md` and `docs/decision-register/DR-615-progress-event-timestamps.md`.

The progress-event mode identity slice now requires every envelope to use a curated shared `GameModeId`. The validator reuses the content-model catalog and rejects unknown mode labels before any future reporting, persistence, progression, or provider integration.
This decision is recorded in `docs/adr/0544-progress-event-mode-identity.md` and `docs/decision-register/DR-616-progress-event-mode-identity.md`.

The progress-event unit identity slice now requires every envelope to use the canonical tenant/curriculum/level/unit key shape. Runtime behavior rejects generic unit labels before any future reporting, persistence, progression, or provider integration.
This decision is recorded in `docs/adr/0545-progress-event-unit-identity.md` and `docs/decision-register/DR-617-progress-event-unit-identity.md`.

The progress-event mode-level compatibility slice now compares the mode with the level encoded in the canonical unit key. Runtime behavior rejects valid-but-unavailable combinations before any future reporting, persistence, progression, or provider integration.
This decision is recorded in `docs/adr/0546-progress-event-mode-level-compatibility.md` and `docs/decision-register/DR-618-progress-event-mode-level-compatibility.md`.

The progress-event type identity slice now rejects arbitrary runtime event names, even when a registry supplies an effect label. The existing support-only, report-only, and progress-affecting categories remain the event identity source.
This decision is recorded in `docs/adr/0547-progress-event-type-identity.md` and `docs/decision-register/DR-619-progress-event-type-identity.md`.

The progress-event stream context slice now rejects batches that mix unit or launch identities while allowing multiple curated modes and learner sessions within one classroom launch. This protects future report and persistence boundaries from cross-context evidence contamination without blocking class-level reports.
This decision is recorded in `docs/adr/0548-progress-event-stream-context.md` and `docs/decision-register/DR-620-progress-event-stream-context.md`.

The progress-event acceptance-gate consistency slice now rejects streams that mix event-acceptance gate IDs. Multiple modes and learner sessions remain allowed when they share the same unit, launch, and reviewed gate.

The progress-event contract revision slice now rejects streams that mix taxonomy versions or settings contract IDs. Per-mode settings profiles and teacher snapshots remain allowed to vary inside one shared contract.

The teacher-report launch binding slice now rejects report evidence with a missing or mismatched `launch_code`. Reusable pre-launch stream review remains less strict, but a report request must bind every event to its requested launch.

The teacher-report tenant binding slice now rejects canonical unit keys from another tenant, protecting white-label isolation at the report evidence boundary.

The persistence tenant-boundary slice now requires durable progress-event and teacher-report records, plus hosted/local write intents, to preserve tenant-boundary evidence beyond the UI/runtime review layer.
This decision is recorded in `docs/adr/0549-progress-event-acceptance-gate-consistency.md` and `docs/decision-register/DR-621-progress-event-acceptance-gate-consistency.md`.

The prototype integration gate tenant-boundary slice now requires AI prototype integration-readiness gate and Codex integration-review decision records, plus hosted/local write intents, to preserve publisher scope. External Z.ai/Phaser evidence cannot be reused across white-label tenants, even while it remains review-only and blocked from import.
This decision is recorded in `docs/adr/0554-prototype-integration-readiness-tenant-boundary.md` and `docs/decision-register/DR-626-prototype-integration-readiness-tenant-boundary.md`.

The explicit tenant-boundary-key slice now requires those records and adapter intents to name the concrete mapping used by storage. Prototype readiness and Codex decision records use `tenant_id`; progress and report records use `canonical_unit_key.tenant_id`. This keeps the white-label boundary implementable rather than merely descriptive.
This decision is recorded in `docs/adr/0555-explicit-tenant-boundary-key.md` and `docs/decision-register/DR-627-explicit-tenant-boundary-key.md`.

The complete external-prototype tenant-scope slice now applies the same boundary and key requirement to the full Z.ai/Phaser evidence chain, from intake and return records through replay reports, wrapper review, patch approval, release locks, work orders, and change-set previews. Hosted and local plans reuse one shared category list.
This decision is recorded in `docs/adr/0556-complete-external-prototype-tenant-scope.md` and `docs/decision-register/DR-628-complete-external-prototype-tenant-scope.md`.

The external prototype evidence alignment slice now checks the return review,
integration plan, wrapper review, fixture/event/audio/mobile/scoring reports,
Codex decision, and readiness gate as one shared packet. Tenant, request, plan,
mode, and parent-engine drift is rejected before any future Z.ai or Phaser
integration review. The check is read-only and does not authorize import,
route replacement, scoring mutation, package promotion, or student assignment.
This decision is recorded in `docs/adr/0559-external-prototype-evidence-alignment.md`
and `docs/decision-register/DR-631-external-prototype-evidence-alignment.md`.

The prototype intake readiness summary now derives its evidence-alignment lane
from the shared validator. Structural alignment remains visibly separate from
the missing returned package, replay evidence, and Codex wrapper decision, so a
green sample alignment cannot imply Z.ai intake approval.
This decision is recorded in `docs/adr/0560-derived-prototype-intake-readiness.md`
and `docs/decision-register/DR-632-derived-prototype-intake-readiness.md`.

The returned prototype manifest slice now gives the future Z.ai intake boundary
an exact source repository, immutable snapshot, safe prototype folder, target
mode, parent engine, and separate source/fixture/event/audio/scoring/mobile/
wrapper artifacts. Review-only previews remain blocked from import, route
replacement, scoring mutation, package promotion, and student assignment.
This decision is recorded in `docs/adr/0561-returned-prototype-manifest.md`
and `docs/decision-register/DR-633-returned-prototype-manifest.md`.

The returned package checklist alignment slice now compares each future
manifest with its tenant-scoped checklist for queue identity, repository, mode,
parent engine, and review status. Structural manifest validity and checklist
alignment remain separate no-side-effect gates.
This decision is recorded in `docs/adr/0562-returned-package-checklist-alignment.md`
and `docs/decision-register/DR-634-returned-package-checklist-alignment.md`.

The returned artifact-shape hardening slice now rejects malformed artifact
entries, missing target mode or parent engine identity, unsupported statuses,
and review-only packages whose required evidence is only marked present.
This decision is recorded in `docs/adr/0563-returned-artifact-shape.md` and
`docs/decision-register/DR-635-returned-artifact-shape.md`.

The returned package intake-provenance slice now cross-checks the manifest
against the original tenant-scoped intake queue item, completing the identity
chain before any future Z.ai or Phaser integration review.
This decision is recorded in `docs/adr/0564-returned-package-intake-provenance.md`
and `docs/decision-register/DR-636-returned-package-intake-provenance.md`.

The returned prototype surface slice now preserves the DOM, Phaser, or hybrid
boundary from intake through checklist and manifest, preventing future wrapper
review from using the wrong rendering assumptions.
This decision is recorded in `docs/adr/0565-returned-prototype-surface.md` and
`docs/decision-register/DR-637-returned-prototype-surface.md`.

The readiness-summary separation slice now derives returned-package contract
status from manifest, checklist, intake, and target-surface validators while
keeping actual returned-package availability independently missing until a real
package arrives.
This decision is recorded in `docs/adr/0566-returned-package-readiness-separation.md`
and `docs/decision-register/DR-638-returned-package-readiness-separation.md`.

The derived prototype alert slice now computes the Z.ai/Codex handoff state
from readiness lanes through a shared content-model function. The UI cannot
silently claim readiness from a stale hand-maintained flag.
This decision is recorded in `docs/adr/0567-derived-prototype-alert.md` and
`docs/decision-register/DR-639-derived-prototype-alert.md`.

The derived readiness-summary slice now computes the overall summary status
and Codex-alert label from the same readiness lanes. Missing package evidence
keeps the state not-ready, blocked evidence requires review, and only an
all-ready lane set can produce the ready-for-alert state.
This decision is recorded in `docs/adr/0568-derived-prototype-readiness-summary.md`
and `docs/decision-register/DR-640-derived-prototype-readiness-summary.md`.

The returned-package readiness slice now derives its status and Codex
return-review label from the evidence lanes. Missing source, fixture, audio,
mobile, or scoring proof keeps review unopened; structural blocking without
missing evidence requires evidence review; only an all-ready set can open
return review.
This decision is recorded in `docs/adr/0569-derived-prototype-return-review.md`
and `docs/decision-register/DR-641-derived-prototype-return-review.md`.

The integration-readiness gate now derives its status from the wrapper,
fixture, event, audio, mobile, scoring, and Codex-decision checks. Missing or
blocked evidence keeps it blocked; pending evidence is review-only; all
reviewed evidence is ready for Codex review without authorizing an app patch.
This decision is recorded in `docs/adr/0570-derived-prototype-integration-gate.md`
and `docs/decision-register/DR-642-derived-prototype-integration-gate.md`.

The integration evidence provenance slice now maps each gate check to its
existing wrapper, fixture, event, audio, mobile, scoring, and Codex-decision
record. Unknown or unfinished records remain blocked, and the readiness-gate
self-check cannot bootstrap its own review.
This decision is recorded in `docs/adr/0571-integration-evidence-provenance.md`
and `docs/decision-register/DR-643-integration-evidence-provenance.md`.

The Codex integration-decision slice now derives decision status from its
review checks. Blocked or missing checks keep it blocked, pending checks keep
it review-only, and all-reviewed checks make it ready for Codex review without
recording approval or enabling integration.
This decision is recorded in `docs/adr/0572-derived-codex-decision.md` and
`docs/decision-register/DR-644-derived-codex-decision.md`.

The Codex decision evidence slice now maps each review check to its upstream
wrapper, fixture, event, audio, mobile, or scoring record. Not-started,
not-run, missing, blocked, or unknown records remain blocked; readiness-gate
evidence cannot self-approve.
This decision is recorded in `docs/adr/0573-codex-decision-evidence-provenance.md`
and `docs/decision-register/DR-645-codex-decision-evidence-provenance.md`.

The Codex decision check identity slice now rejects duplicate evidence-check
labels and required records, plus missing check evidence and unsupported check
statuses. This keeps the final external-prototype review packet one-to-one and
auditable without opening integration or enabling provider-specific imports.
This decision is recorded in `docs/adr/0574-codex-decision-check-identity.md`
and `docs/decision-register/DR-646-codex-decision-check-identity.md`.

The Codex decision collection identity slice now rejects duplicate decision
IDs and duplicate tenant/request pairs across the multi-tenant review queue.
This prevents one prototype request from being silently replaced while keeping
the queue review-only and provider-neutral.
This decision is recorded in `docs/adr/0575-codex-decision-collection-identity.md`
and `docs/decision-register/DR-647-codex-decision-collection-identity.md`.

The evidence-alignment collection identity slice now rejects duplicate return
review IDs, integration plan IDs, and tenant/request pairs across the external
prototype review queue. Individual packet alignment remains separate from
collection identity, and both stay read-only before controlled Z.ai intake.
This decision is recorded in `docs/adr/0576-evidence-alignment-collection-identity.md`
and `docs/decision-register/DR-648-evidence-alignment-collection-identity.md`.

The evidence-alignment panel visibility slice now uses the shared collection
validator instead of recomputing only individual packets. Teacher review
surfaces therefore show duplicate packet identities alongside per-packet
alignment errors, while remaining read-only before controlled Z.ai intake.
This decision is recorded in `docs/adr/0577-evidence-alignment-panel-visibility.md`
and `docs/decision-register/DR-649-evidence-alignment-panel-visibility.md`.

The deterministic review-list key slice now protects teacher-facing warning
and error lists from duplicate React keys when validator messages repeat. The
underlying evidence remains visible and unsuppressed; only rendering identity
is hardened.
This decision is recorded in `docs/adr/0578-deterministic-review-list-keys.md`
and `docs/decision-register/DR-650-deterministic-review-list-keys.md`.

The prototype intake alert contract slice now validates the user-facing Z.ai
handoff signal, required evidence, isolated repository scope, Codex ownership,
and blocked live actions. A valid alert remains a review-only contract and does
not imply that a returned prototype package exists. This decision is recorded in
`docs/adr/0579-prototype-intake-alert-contract.md` and
`docs/decision-register/DR-651-prototype-intake-alert-contract.md`.

The follow-up intake alignment slice now verifies that the displayed Z.ai alert
status matches the authoritative readiness lanes. A valid alert payload cannot
override missing returned packages or blocked evidence. This decision is
recorded in `docs/adr/0580-prototype-intake-alert-readiness-alignment.md` and
`docs/decision-register/DR-652-prototype-intake-alert-readiness-alignment.md`.

The prototype alert panel now validates the alert instance and readiness signal
passed by each route instead of consulting a MiniStar-specific global error
array. This preserves white-label tenant isolation while keeping the panel
review-only. The decision is recorded in
`docs/adr/0581-prototype-alert-panel-instance-validation.md` and
`docs/decision-register/DR-653-prototype-alert-panel-instance-validation.md`.

The prototype intake alert tenant-scope slice now requires an explicit tenant
identity. The platform readiness route uses `platform`, while tenant prototype
routes construct tenant-scoped alert records and validate the route match. This
preserves white-label isolation without enabling import or integration. The
decision is recorded in
`docs/adr/0582-prototype-intake-alert-tenant-scope.md` and
`docs/decision-register/DR-654-prototype-intake-alert-tenant-scope.md`.

The follow-up readiness-summary scope slice now gives summaries explicit tenant
identity and passes the same tenant-scoped summary to the tenant alert and
summary panels. The platform route keeps the explicit `platform` summary. The
decision is recorded in
`docs/adr/0583-prototype-intake-readiness-summary-tenant-scope.md` and
`docs/decision-register/DR-655-prototype-intake-readiness-summary-tenant-scope.md`.

The derived tenant readiness slice now calculates queue, evidence-alignment,
returned-manifest, and package-availability lanes from tenant-filtered records.
Missing tenant records remain missing rather than inheriting platform status.
The decision is recorded in
`docs/adr/0584-derived-tenant-prototype-readiness.md` and
`docs/decision-register/DR-656-derived-tenant-prototype-readiness.md`.

The prototype alert/signal consistency slice now requires the alert tenant and
readiness-signal tenant to match during alignment validation. Route, alert, and
summary identity therefore form one chain before any future handoff decision.
The decision is recorded in
`docs/adr/0585-prototype-alert-signal-scope-consistency.md` and
`docs/decision-register/DR-657-prototype-alert-signal-scope-consistency.md`.

The prototype readiness-summary contract slice now validates tenant identity,
unique lane IDs, supported lane status values, derived overall status, Codex
alert-state consistency, and blocked next actions before review panels rely on
the summary. The decision is recorded in
`docs/adr/0586-prototype-readiness-summary-contract.md` and
`docs/decision-register/DR-658-prototype-readiness-summary-contract.md`.

The parallel prototype-return readiness slice now validates summary identity,
unique return lane IDs, supported lane status values, derived overall status,
Codex return-review consistency, and blocked next actions before the returned
package panel relies on the summary. The decision is recorded in
`docs/adr/0587-prototype-return-readiness-summary-contract.md` and
`docs/decision-register/DR-659-prototype-return-readiness-summary-contract.md`.

The tenant-scoped return-readiness slice now derives each tenant's return
summary from its own returned-package checklist records instead of reusing one
platform summary on every workbench. Missing tenant records remain missing and
cannot inherit another tenant's review state. The decision is recorded in
`docs/adr/0588-tenant-scoped-prototype-return-readiness.md` and
`docs/decision-register/DR-660-tenant-scoped-prototype-return-readiness.md`.

The tenant return-summary route-proof slice now asserts that both prototype
workbench routes render their own tenant-specific summary labels and derived
text. HTTP success alone is no longer accepted as evidence of white-label
isolation. The decision is recorded in
`docs/adr/0589-tenant-return-summary-route-proof.md` and
`docs/decision-register/DR-661-tenant-return-summary-route-proof.md`.

The return-evidence completeness slice now requires audio, mobile/accessibility,
and event/scoring evidence together before the combined proof lane can become
ready. Audio-only evidence cannot open Codex return review. The decision is
recorded in `docs/adr/0590-return-evidence-lane-completeness.md` and
`docs/decision-register/DR-662-return-evidence-lane-completeness.md`.

The explicit review-surface scope slice now labels evidence packet flows and
prototype storage guards as platform contracts or tenant records. The teacher
review UI shows that distinction so generic policy cannot be mistaken for
tenant-owned evidence. The decision is recorded in
`docs/adr/0591-explicit-review-surface-scope.md` and
`docs/decision-register/DR-663-explicit-review-surface-scope.md`.

The review-surface scope validation slice now enforces the allowed `platform`
or `tenant` values in the shared content model, data previews, panels, and
runtime harness. The decision is recorded in
`docs/adr/0592-review-surface-scope-validation.md` and
`docs/decision-register/DR-664-review-surface-scope-validation.md`.

The durable evidence scope slice now carries the same explicit `scope_kind`
boundary into evidence packet and evidence attachment schema drafts, migration
specifications, and persistence contracts. Missing or invalid scope keeps
those durable records blocked, while upload, storage, approval, promotion, and
student-facing use remain disabled. The decision is recorded in
`docs/adr/0593-durable-evidence-scope-boundary.md` and
`docs/decision-register/DR-665-durable-evidence-scope-boundary.md`.

The adapter evidence scope slice now carries `scope_kind` through hosted and
local evidence write intents and rejects missing or mismatched scope during
adapter validation and cross-layer alignment. No live write or promotion
behavior was enabled. The decision is recorded in
`docs/adr/0594-adapter-evidence-scope-boundary.md` and
`docs/decision-register/DR-666-adapter-evidence-scope-boundary.md`.

The evidence migration field-parity slice now requires evidence packet and
attachment migration specifications to declare identity, scope_kind, and
tenant_id fields matching the vendor-neutral schema. A regression test proves
that removing tenant_id is rejected before backend implementation. The
decision is recorded in
`docs/adr/0595-evidence-migration-field-parity.md` and
`docs/decision-register/DR-667-evidence-migration-field-parity.md`.

The migration-spec identity-field slice now requires each migration spec to
declare its primary key in fields and every field to declare a usable name and
type. A regression test proves that removing media_id is rejected before
backend implementation. The decision is recorded in
`docs/adr/0596-migration-spec-identity-field-contract.md` and
`docs/decision-register/DR-668-migration-spec-identity-field-contract.md`.

The required migration identity slice now requires every migration spec to
mark its declared primary key field as required. A regression test proves that
an optional media_id is rejected before backend implementation. The decision
is recorded in `docs/adr/0597-required-migration-identity-field.md` and
`docs/decision-register/DR-669-required-migration-identity-field.md`.

The migration candidate coverage slice now requires every non-deferred
candidate to have at least one migration specification, while deferred
candidates must not carry implementation specs. The decision is recorded in
`docs/adr/0598-migration-candidate-spec-coverage.md` and
`docs/decision-register/DR-670-migration-candidate-spec-coverage.md`.

The canonical Memory Match controlled integration is now verified at
`/memory/demo-unit-1`. It emits a guarded `game_started` event, support-only
`audio_requested` evidence for card speech, one `round_shown` event per pair
attempt, standard answer/result events, and shared completion/mastery events.
The full 8-pair interaction completed with `8/8` pairs, `200 Star Dust`, and
the expected event sequence. The web typecheck, production build, prototype
review, and all 88 active route checks passed. The frozen Phaser source remains
outside the canonical app; Balloon Pop is the next controlled candidate. The
decision is recorded in `docs/adr/0636-memory-match-controlled-integration.md`
and `docs/decision-register/DR-708-memory-match-controlled-integration.md`.

The canonical Balloon Pop controlled integration is now verified at
`/balloon/demo-unit-1`. An incorrect selection records answer evidence without
progress, a correct retry advances through the deterministic vocabulary rounds,
and completion records `mastery_updated` and `game_completed` with `300 Star
Dust`. The event log includes `game_started`, `round_shown`, support-only
`audio_requested`, `answer_submitted`, `answer_result`, `mastery_updated`, and
`game_completed`. The decision is recorded in
`docs/adr/0637-balloon-pop-controlled-integration.md` and
`docs/decision-register/DR-709-balloon-pop-controlled-integration.md`.

The Z.ai source-freeze handoff is now recorded. `Drewsure/ministar-lab` main
commit `eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`, tag
`frozen-2026-09-12-aaa-stable`, and AI reference
`16625090e641179625e1d8bb5f60634bb2036e00` are the reproducible candidate
source for Codex review. The reported `157/157` checks establish freeze
identity and candidate verification, but do not authorize direct integration.
The alert now shows that the snapshot has been received while wrapper,
schema, event, audio, scoring, mobile, rights, and white-label review remain
required.

The extracted frozen source inventory is now recorded as 32 Phaser scenes and
32 catalog entries. The source summary documents contain stale counts and the
candidate embeds local score, browser storage, direct API, synthesized audio,
speech-recognition, random-reward, and pirate-themed surfaces that require
review before integration. This historical entry listed Balloon Pop as the
first wrapper candidate; that wording is superseded by the active Memory Match,
Balloon Pop, Label It, then gated speech order. No source files were promoted.
The inventory and decision are recorded in
`docs/ZAI_MINISTAR_LAB_SUITE_INVENTORY_2026-09-12.md`.

The migration policy status slice now requires specs for needs-policy
candidates to remain blocked-by-policy. The release-candidate sample is no
longer presented as ready for review while its approval policy is unresolved.
The decision is recorded in
`docs/adr/0599-migration-policy-status-alignment.md` and
`docs/decision-register/DR-671-migration-policy-status-alignment.md`.

The schema field-shape slice now requires every schema entity to declare
fields with non-empty names, non-empty types, and boolean required flags. A
regression test proves that a tenant field with an empty type is rejected. The
decision is recorded in `docs/adr/0600-schema-field-shape-contract.md` and
`docs/decision-register/DR-672-schema-field-shape-contract.md`.

The tenant-scope field slice now requires every migration spec whose
tenantScope names tenant_id to declare a required tenant_id field. The sample
plan now carries that field across all 96 previously incomplete tenant-scoped
specs. The decision is recorded in
`docs/adr/0601-tenant-scope-field-contract.md` and
`docs/decision-register/DR-673-tenant-scope-field-contract.md`.

The tenant-index slice now requires schema entities with tenant_id and
migration specs whose tenantScope names tenant_id to declare a tenant-aware
index. Regression coverage rejects missing indexes at both layers. The
decision is recorded in `docs/adr/0602-tenant-index-contract.md` and
`docs/decision-register/DR-674-tenant-index-contract.md`.

The backend definition integrity slice now rejects blank or duplicate schema
and migration indexes, repeated migration entity targets, and migration fields
whose required flag is not boolean. The decision is recorded in
`docs/adr/0603-backend-definition-integrity-contract.md` and
`docs/decision-register/DR-675-backend-definition-integrity-contract.md`.

The backend lifecycle policy slice now requires retention, export, and local
fallback rules on every migration spec, plus purpose and rollback/export needs
on every migration candidate. The decision is recorded in
`docs/adr/0604-backend-lifecycle-policy-contract.md` and
`docs/decision-register/DR-676-backend-lifecycle-policy-contract.md`.

The policy blocker evidence slice now requires explicit prerequisites on
needs-policy migration candidates and explicit blockers on blocked-by-policy
migration specifications. The decision is recorded in
`docs/adr/0605-policy-blocker-evidence-contract.md` and
`docs/decision-register/DR-677-policy-blocker-evidence-contract.md`.

The backend definition auditability slice now requires non-empty identity,
purpose, relationship, migration, and field notes across the schema and
migration plans. The decision is recorded in
`docs/adr/0606-backend-definition-auditability-contract.md` and
`docs/decision-register/DR-678-backend-definition-auditability-contract.md`.

The prototype integration gate slice now connects the detailed review-only
integration gate records to the prototype intake readiness summary through an
explicit `integration-readiness-gates` lane. Tenant summaries filter their
own gate records, and blocked or review-only gates keep the Z.ai/Codex
handoff alert blocked. No import, route promotion, scoring mutation, reward
write, or student assignment was enabled. The decision is recorded in
`docs/adr/0607-prototype-integration-gate-readiness-lane.md` and
`docs/decision-register/DR-679-prototype-integration-gate-readiness-lane.md`.

The backend migration field extension slice reconciled 43 materialized fields
across release, media, launch, progress, reporting, local companion, and
school-policy records. Unknown migration fields now fail backend alignment,
and the persistence workbench exposes the explicit migration-only fields. No
live storage write or vendor selection was enabled. The decision is recorded
in `docs/adr/0608-backend-migration-field-extension-contract.md` and
`docs/decision-register/DR-680-backend-migration-field-extension-contract.md`.

The backend enum boundary slice now rejects unsupported schema, migration
candidate, and migration specification vocabulary before adapter or migration
implementation. Regression coverage and backend storage readiness both pass;
no live persistence or vendor selection was enabled. The decision is recorded
in `docs/adr/0609-backend-enum-boundary-contract.md` and
`docs/decision-register/DR-681-backend-enum-boundary-contract.md`.

The backend track compatibility slice now rejects migration candidates whose
hosted/local track conflicts with a targeted schema entity's deployment fit.
The regression and backend storage checks pass, with no adapter selection or
live storage behavior enabled. The decision is recorded in
`docs/adr/0610-backend-track-deployment-compatibility.md` and
`docs/decision-register/DR-682-backend-track-deployment-compatibility.md`.

The backend field-type vocabulary slice now rejects unsupported provider or
free-text types across schema, migration-only extension, and migration spec
fields. This keeps future hosted, local, and hybrid adapters interoperable
without selecting a vendor or enabling storage writes. The decision is
recorded in `docs/adr/0611-backend-field-type-vocabulary.md` and
`docs/decision-register/DR-683-backend-field-type-vocabulary.md`.

The backend migration field-type compatibility slice now permits only exact or
explicitly approved portable representations between schema and migration
spec fields. Existing identifier, enum, JSON, array, and timestamp forms pass;
an incompatible shape fails before adapter design. No storage provider or
write path was enabled. The decision is recorded in
`docs/adr/0612-backend-migration-field-type-compatibility.md` and
`docs/decision-register/DR-684-backend-migration-field-type-compatibility.md`.

The backend required-field parity slice now rejects weakened required fields
for single-entity migration specs while preserving the deliberate conditional
fields in combined multi-entity envelopes. Adapter-level entity validation
remains required; no storage write path was enabled. The decision is recorded
in `docs/adr/0613-backend-required-field-parity.md` and
`docs/decision-register/DR-685-backend-required-field-parity.md`.

The backend spec-target slice now gives multi-entity candidates explicit
materialization targets per migration specification. Package release, audio
coverage, release-candidate, and game-settings specs use that boundary for
field and primary-key validation. No adapter or storage write path was
enabled. The decision is recorded in
`docs/adr/0614-backend-spec-target-entities.md` and
`docs/decision-register/DR-686-backend-spec-target-entities.md`.

The backend explicit-target gate now requires actionable specs under
multi-entity candidates to declare their own materialization targets. Deferred
local export candidates remain deferred without specs. No adapter or storage
write path was enabled. The decision is recorded in
`docs/adr/0615-backend-explicit-multi-entity-spec-targets.md` and
`docs/decision-register/DR-687-backend-explicit-multi-entity-spec-targets.md`.

The backend candidate-coverage slice now requires every non-deferred candidate
target entity to be represented by migration-spec coverage. The release-control
candidate gained separate publish-gate and approval-ledger specs beside its
derived candidate summary. No adapter or storage write path was enabled. The
decision is recorded in `docs/adr/0616-backend-candidate-target-coverage.md`
and `docs/decision-register/DR-688-backend-candidate-target-coverage.md`.

The AI-service game-mode and engine boundary slice now reuses the shared
content-model catalog before provider review preparation. Unsupported modes,
unsupported engines, mismatched mode/engine pairs, and unavailable level
combinations are rejected. No provider call, billing, package write, route
write, or Z.ai integration was enabled. The decision is recorded in
`docs/adr/0617-ai-service-game-mode-engine-boundary.md` and
`docs/decision-register/DR-689-ai-service-game-mode-engine-boundary.md`.

The same AI boundary now rejects an assist language that duplicates the target
language and emits an explicit support-only warning. Runtime behavior checks
cover the mode/engine mismatch, level restriction, and assist-language guard.
The request now also carries source, compatibility, audio, media-rights, and
premium-cost evidence identifiers so readiness booleans cannot lose provenance.
Audio readiness now also carries its declared language and must match the
target learning language before provider review preparation can pass.

The foundation-to-Z.ai intake gate is now open: the full foundation
verification is green, so isolated prototypes may be requested from
`Drewsure/ministar-lab`. This opens controlled evidence intake only; direct
copies into `apps/web` or `apps/ai-service`, route replacement, scoring or
reward changes, package promotion, and student assignment remain blocked until
a real candidate return package passes the existing evidence and Codex
wrapper-review gates. The phase boundary is recorded in
`docs/FOUNDATION_TO_ZAI_INTAKE_GATE.md`.

The migration candidate coverage slice now requires every non-deferred
candidate to have at least one migration specification, while deferred
candidates must not carry implementation specs. The decision is recorded in
`docs/adr/0598-migration-candidate-spec-coverage.md` and
`docs/decision-register/DR-670-migration-candidate-spec-coverage.md`.
# 2026-09-13: Canonical Replay Evidence Boundary

The Match Up slice was completed and live-tested across all eight deterministic
pairs, including a deliberate mismatch, audio-request evidence, mastery, game
completion, and the curated next-activity unlock. The full foundation gate
passed with all 88 active routes.

Memory Match was then normalized so its card, interaction, audio, mastery, and
completion evidence carries the same deterministic replay-v1 identity. The
shared progression adapter now supplies replay evidence by default for game
interaction, audio-request, mastery, and completion events. This is recorded
in `docs/CANONICAL_GAME_INTEGRATION_STANDARD.md`, ADR 0656, and DR-728.

The frozen Z.ai/Phaser snapshot remains review-only. No external source was
promoted and no live persistence or provider selection was enabled.

True or False immediate correctness feedback now uses the unit target language
and emits shared `audio_requested` evidence rather than hard-coding English.
This white-label audio boundary is recorded in ADR 0657 and DR-729.

The canonical verifier now requires replay-seed evidence on Balloon Pop as it
does on the other canonical games.

The Phaser candidate review boundary now requires an exact source commit SHA
in addition to the repository and snapshot label. The frozen Memory Match and
Balloon Pop packets record commit
`eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`; this improves reproducibility but
does not approve external source promotion. The decision is recorded in ADR
0658 and DR-730.

The same candidate packets now include a repository-relative SHA-256 manifest
of the reviewed scene, engine, type, and audio files. This identifies review
evidence without importing the frozen source. The foundation-to-Z.ai intake
gate now requires that provenance evidence on every returned candidate package.
Finding citations must also resolve to a file in that manifest, recorded in
ADR 0659 and DR-731.

External candidate packets now carry a machine-checked wrapper approval
decision, blocked by default and scoped separately from direct source import,
recorded in ADR 0662 and DR-734.

The shared canonical event validator now rejects required learning events and
audio requests that lack `replay-v1:` evidence, recorded in ADR 0660 and
DR-732.

The runtime behavior harness now exercises that validator with both accepted
and rejected canonical sequences, recorded in ADR 0661 and DR-733.

The runtime behavior harness now also executes the Phaser candidate review
validator. A blocked candidate packet is accepted as review evidence, while
an approval carrying unresolved blockers or missing evidence is rejected.
This keeps the wrapper gate enforceable without importing external game code,
recorded in ADR 0663 and DR-735.

The playable game route shell now makes canonical event validation an
acceptance gate. Missing or invalid completion evidence pauses progression,
Star Dust, and next-activity state while exposing the contract errors for
review. This is recorded in ADR 0664 and DR-736.

The isolated frozen Phaser review packet now has a repeatable provenance
check. `node scripts/verify-phaser-source-evidence.mjs` compares its five
SHA-256 file hashes with the external snapshot and passed locally; the command
remains outside the foundation gate because external source is not part of the
repo. This is recorded in ADR 0665 and DR-737.

The canonical event validator now closes the answer window before mastery and
completion. A runtime regression fixture with late answer activity is
rejected, protecting scoring and reports from post-completion mutations. This
is recorded in ADR 0666 and DR-738.

Teacher reporting now has a canonical game evidence lane. Report previews group
game events by unit, launch, learner, and mode and re-run the shared canonical
validator before showing a group as ready. Partial sample game rows are
intentionally blocked; media, audio, and navigation remain support-only. This
is recorded in ADR 0667 and DR-739.

Canonical game evidence now also rejects invalid or out-of-order event
timestamps. Equal timestamps remain valid for rapid interactions, while
chronology failures block completion and report-ready status. This is recorded
in ADR 0668 and DR-740.

The provider-neutral report runtime now reuses the canonical game evidence gate
for report requests containing learning-game envelopes. Standalone audio remains
support-only. This prevents future report adapters from accepting partial game
completion evidence and is recorded in ADR 0669 and DR-741.

Canonical report evidence now separates repeated plays at each new
`game_started` event and validates retries independently. This keeps classroom
retries reportable while blocking incomplete attempts. This is recorded in ADR
0670 and DR-742.

The sample teacher report now carries a blocked partial memory attempt and a
complete canonical retry, allowing the report card to demonstrate both paths.
It remains review-only and cannot authorize export or persistence. This is
recorded in ADR 0671 and DR-743.

Canonical non-entry routes now derive access from the supplied progression
state. The playable shell no longer self-unlocks a mode when its URL is opened;
locked routes remain inspectable but do not mount the game component or emit
start, answer, mastery, or completion evidence. This restores the QR ->
flashcard -> curated activity boundary and applies to future Phaser wrappers.
See ADR 0672 and DR-744.

Curated unit game offer maps now validate their engine and family bindings
against the shared game-mode contract. The sample Flashcards offer was
corrected to the selection parent engine, and review surfaces show map-valid
or needs-review status. This catches package drift before route or student
assignment work. See ADR 0673 and DR-745.

The progression adapter now independently returns zero award and unchanged
progression when completion is requested for a locked mode. This keeps a
future wrapper from bypassing the route gate at the scoring boundary.

The progression continuity slice now defines a provider-neutral envelope for
carrying the reviewed progression snapshot from entry practice to a curated
game route. It validates tenant/package/launch/session/unit identity, event
cursor, route shape, unlock relationships, supported modes, timestamps, and
privacy exclusions. Its adapter remains review-only with no side effect, so it
does not create fake learner persistence or put progression into QR URLs. See
ADR 0675, DR-747, and `docs/PROGRESSION_CONTINUITY_CONTRACT.md`.

The continuity review surface is now visible in teacher intake, showing the
validated sample handoff, identity bindings, unlock snapshot, and explicit
review-only/no-side-effect status before backend selection.

The next persistence hardening slice maps that continuity envelope into the
provider-neutral durable record, backend schema, migration, and hosted/local
adapter plans. It stays policy-gated and review-only; no storage provider or
live handoff write is selected by the map.

The continuity runtime input slice now rejects malformed expected identity
fields without throwing. This keeps browser, route, and future provider
boundaries deterministic for untrusted callers; no side effect or storage
activation was added. The decision is recorded in ADR 0678 and DR-750.

The report runtime now keeps standalone `audio_requested` evidence in the
support-only lane. Audio engagement cannot become an incomplete game attempt,
mastery result, Star Dust award, or completion report. See ADR 0676 and DR-748.

The student launch pathway now mounts the canonical Match Up game for the
first reviewed next step, with Memory Match remaining available as the second
supported pairing path. The parent no longer emits a duplicate `game_started`;
the mounted game owns that event, and launch-path completion is revalidated by
the shared canonical game sequence gate before progression changes. The entry
completion adapter also rejects insufficient target-language evidence even if
called outside the button's disabled-state guard. See ADR 0679, DR-751, and
the target-language entry gate standard.

The launch handoff now creates and validates a transient provider-neutral
continuity envelope against tenant, package, launch, and learner-session
identity before the supported game mounts and before completion is accepted.
It carries no URL state and creates no storage side effect. See the
progression continuity contract.

The canonical completion acceptance logic is now shared by the standalone
playable route shell and the QR student launch flow. A missing completion
event, wrong-mode evidence, identity mismatch, chronology error, or Star Dust
disagreement pauses progression in either surface. See ADR 0680 and DR-752.

The scoring boundary now enforces the 1,000 Star Dust maximum per unit. Both
flashcard entry and canonical game completion record the capped accepted award,
so additional curated games cannot inflate continuity snapshots or distort
future overflow-ticket calculations. See ADR 0681 and DR-753.

The unit-cap source of truth now lives in the shared content-model economy
policy. Web progression adapters, canonical event validation, continuity
validation, and AI gamification mapping validation consume the same constant,
preventing platform layers from drifting on the published capacity.

The canonical game event gate now requires at least one meaningful
`audio_requested` event after `game_started` in every accepted game attempt.
The event must carry cue text, language, and cue kind. All current canonical
slices already emit audio through the shared adapter, while missing or
placeholder audio evidence now pauses completion and Star Dust for future DOM,
canvas, or Phaser wrappers. Audio remains support-only and cannot unlock
progress or replace answer activity.
This is recorded in ADR 0682 and DR-754.

The local progression adapter now applies the shared launch-identity check
before entry completion, game start, and game completion. Mismatched unit,
launch, or learner-session identity produces no start or completion evidence,
no unlock, no score, and no Star Dust. This is recorded in ADR 0683 and
DR-755.

Training Academy recovery completion now normalizes practice counts, applies
the shared unit Star Dust ceiling, and checks launch identity before producing
completion evidence. Mismatched recovery calls produce no completion event or
progression change, keeping recovery below the canonical game authority. This
is recorded in ADR 0685 and DR-757.

Canonical game mastery evidence now uses the normalized award returned by
`completeGameMode`. This prevents later activities in the same unit from
reporting a requested score that exceeds the remaining 1,000 Star Dust
capacity, keeping `mastery_updated`, `game_completed`, and progression state
aligned. This is recorded in ADR 0684 and DR-756.

The front-door demo now follows the same game-start ownership contract as the
QR launch flow. Its mode-selection handler only mounts an unlocked mode; the
canonical wrapper emits the single `game_started` event. This removes duplicate
attempt evidence and is recorded in ADR 0687 and DR-759.

The front-door completion callback now runs the shared canonical completion
gate against its synchronous event reference before accepting progression or
Star Dust. This keeps the front-door path aligned with QR and standalone game
routes. See ADR 0688, DR-760, and operating note OW-041.

The front door now mounts the canonical Match Up and Memory Match wrappers for
the selected unlocked mode, giving MiniStar and the partner tenant the same
reviewed pairing slice. Other modes remain explicit previews. See ADR 0689,
DR-761, and operating note OW-042.

The next activity policy now advances to the first uncompleted recommended
mode across the front door, student launch, flashcard entry, progress summary,
and completion handoff. This removes the recurring-first-mode defect while
preserving separate unlock and Training Academy recovery decisions. See ADR
0690, DR-762, and operating note OW-043.

Label It is now promoted from preview to canonical behavior in the student and
front-door flows. The existing reviewed-image wrapper supplies shared audio,
deterministic pairing scoring, standard event evidence, and completion gating;
live image upload remains blocked behind the asset policy. See ADR 0691, DR-763,
and operating note OW-044.

Balloon Pop is now promoted from preview to canonical behavior in the student
and front-door flows. Its reviewed selection wrapper supplies target-language
audio, deterministic scoring, replay evidence, standard events, and completion
gating. See ADR 0692, DR-764, and operating note OW-045.

Quiz is now promoted from preview to canonical behavior in the student and
front-door flows. Its reviewed selection wrapper supplies target-language
audio, deterministic scoring, replay evidence, standard events, and completion
gating. See ADR 0693, DR-765, and operating note OW-046.

True or False is now promoted from preview to canonical behavior in the
student and front-door flows. Its reviewed selection wrapper supplies
target-language audio, deterministic scoring, replay evidence, standard
events, and completion gating. See ADR 0694, DR-766, and operating note OW-047.

Type Answer is now promoted from preview to canonical behavior in the student
and front-door flows. Its reviewed text-spelling wrapper supplies prompt audio,
input guidance, deterministic scoring, replay evidence, standard events, and
completion gating. See ADR 0695, DR-767, and operating note OW-048.

Spelling Practice is now promoted from preview to canonical behavior in the
student and front-door flows. Its reviewed text-spelling wrapper supplies
target-language prompt audio, deterministic letter-tile scoring, replay
evidence, standard events, and completion gating. The current fixture supports
English letter normalization; Japanese script-aware spelling remains a future
target-language expansion. See ADR 0696, DR-768, and operating note OW-049.

Fill in the Blank is now promoted from preview to canonical behavior in the
student and front-door flows. Its reviewed text-spelling wrapper supplies
target-language sentence and choice audio, deterministic answer scoring,
replay evidence, standard events, and completion gating. The current fixture
supports English answer normalization; Japanese script-aware segmentation
remains a future target-language expansion. See ADR 0697, DR-769, and
operating note OW-050.

The teacher recovery summary now treats `training_completed` as the sole
authoritative recovery award record. Response-result metadata remains visible
evidence but is excluded from the reward total, preventing one recovery action
from being counted twice. See ADR 0686, DR-758, and operating note OW-039.

Sentence Builder is now promoted from preview to canonical behavior in the
student and front-door flows. Its reviewed text-spelling wrapper supplies
target-language sentence and tile audio, deterministic ordered-token scoring,
replay evidence, standard events, and completion gating. The event boundary
now records `round_shown` when a round appears rather than for each tile tap.
The current fixture supports English token normalization; Japanese
script-aware segmentation remains a future target-language expansion. See ADR
0698, DR-770, and operating note OW-051.

Speak It is now mounted in the student launch and coded front-door flows. The
shared tenant-aware microphone approval hook keeps local record/replay policy
consistent across direct and QR entry surfaces. Recorder controls emit the
support-only `microphone_practice` event rather than additional `round_shown`
events, preserving clean gameplay evidence. No upload, transcript, AI speech
scoring, or Phaser promotion was enabled. See ADR 0648, DR-720, and the
2026-09-13 Speak It build session note.

The canonical status-copy audit also removed stale wording that described
Speak It as standalone or implied that no legacy game was promoted. The
teacher sequence now identifies the active DOM canonical baseline while
external Phaser candidates remain review-only. The canonical-game verifier
checks these status markers so future integration work cannot silently leave
contradictory route documentation.

The extracted Z.ai MiniStar snapshot was also verified against the frozen
Phaser evidence manifest: all 5 recorded source-file hashes match commit
`eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`. This strengthens provenance only;
wrapper compatibility, accessibility, audio, scoring, and tenant review remain
blocked before any source import or route replacement.

The sample tenant offer map was hardened after a contract audit found that the
Flashcards and Match Up records had their parent-engine labels reversed.
Flashcards now resolves to the canonical selection engine and Match Up to the
canonical pairing engine. A verifier guard and operating note preserve this
alignment across teacher review and student pathway surfaces.

The same offer contract now declares curriculum level and rejects an active
offer whose mode is not supported at that level. The Level 1 sample keeps
Sentence Builder blocked and removes it from the Level 1 recommended sequence;
the reusable route remains available for Level 2+ packages.

The teacher activity compatibility matrix now matches that decision by marking
Sentence Builder planned for Level 2+ and reporting it under planned-later
outputs rather than current Level 1 offers.

The teacher session monitor now derives its sample unlocked and completed game
scope from the tenant's reviewed offer map instead of a manually maintained
mode list. This keeps Level 1 reporting aligned with the same offer-level
support and readiness rules used by the student activity hub, and removes
stale Sentence Builder evidence from the Level 1 sample. See ADR 0699, DR-772,
and operating note OW-052.

Teacher assignment plans now declare curriculum level and validate every target
mode against the canonical supported-level matrix. The Level 1 sample
assignments no longer schedule Sentence Builder before its Level 2+ offer is
reviewed. See ADR 0700, DR-773, and operating note OW-053.

The canonical playable route now applies the same curriculum-level guard at
render time as the progression adapter applies at start and completion time.
An unsupported route presents a clear Level pathway gate and returns to the
reviewed activity hub; it cannot earn dust, emit completion, or self-unlock.
Supported later-level routes remain reusable. See ADR 0701, DR-774, and
operating note OW-054.

The student activity hub now applies the same level check to reviewed offer
maps before surfacing a recommended route. This protects navigation from stale
or malformed ready records while preserving the curated pathway and later
level reuse. The canonical verifier covers this additional defense-in-depth
surface.

The post-completion next-activity card now applies the same offer-map level
filter, closing the final student navigation path that could have surfaced a
future-level ready offer.

## 2026-09-13: Frozen Phaser Scene Inventory Evidence

Added the exact SHA-256-backed manifest for all 32 active scenes in the frozen
Z.ai MiniStar Lab snapshot. Added an evidence-only mapping to the four
LivingTextBook parent engines and preserved the source's 32-scene versus
25-game summary mismatch as an explicit review finding.

Added `verify:phaser-scene-inventory` to the foundation gate. This maintains
the no-import, no-route-replacement, no-scene-scoring, no-browser-persistence,
no-package-promotion, and no-student-assignment boundary. The controlled
human handoff point is now clear: request Memory Match evidence first, one
candidate at a time, without asking for a broad source merge.

Added the copy-ready `ZAI_MEMORY_MATCH_EVIDENCE_REQUEST.md` brief. Z.ai can be
engaged for isolated Memory Match evidence now; returned work remains outside
the canonical app until Codex verifies source identity, fixture replay, event
sequence, target-language audio, deterministic scoring, accessibility, and
wrapper boundaries.

Added the manual `verify:phaser-candidate-package` check for the next human
handoff. It validates a returned Memory Match evidence folder without adding
the external package to the canonical repository or weakening the foundation
gate. Missing external evidence remains `NOT READY` by design.

Canonical completion handling now has an explicit idempotence guard across the
playable route shell, front-door flow, and student launch flow. The first
completion must still pass event-sequence validation; duplicate callbacks and
already-completed replays are quiet no-ops. This protects Star Dust and report
event integrity on touch devices while leaving durable hosted/local idempotency
for the backend implementation phase. See ADR 0704, DR-777, and
`COMPLETION_IDEMPOTENCE_CHECKS.md`.

The next backend boundary is now explicit: hosted and local progress-event
records require the canonical completion idempotency fields, and runtime write
requests reject missing keys. The shared key generator keeps retry behavior
portable across the future hosted/local adapters. Atomic create-or-return-
existing storage and policy approval remain required before live writes. See
ADR 0705 and DR-778.

The persistence alignment validator now compares the durable progress-event
record with every hosted/local adapter intent. It rejects drift in completion
key fields, duplicate-rejection behavior, or atomic-write requirements before
provider selection. The runtime harness covers aligned and mismatched cases.
See ADR 0706.

The content model now exposes a pure completion-write resolution contract for
future adapters: create, return-existing, conflict on a same-key payload hash
mismatch, or invalid for missing required fields. It performs no storage write
and does not replace policy or release gates. See ADR 0707.

Canonical game completion validation now requires the deterministic scoring
profile on both `mastery_updated` and `game_completed`, and rejects a mismatch.
This keeps progression, teacher reports, durable completion writes, and future
Phaser wrappers tied to one auditable scoring identity. See ADR 0708.

Progress-event runtime writes now require structured canonical completion
identity in addition to a non-blank idempotency key. The validator derives and
compares the expected key, rejecting cross-unit or cross-session key reuse
before any future provider operation. See ADR 0709.

Canonical game event sequences now require tenant metadata and non-blank unit,
launch, and student-session identity on every event. Optional expected-identity
comparison remains a second check, not the presence requirement. See ADR 0710.

Canonical replay evidence now also requires one consistent `replay-v1:` seed
across the game sequence, including learning audio. This keeps deterministic
layout evidence tied to one replay and blocks mixed-session or mixed-layout
evidence before completion review. See ADR 0713.

The controlled Phaser candidate package gate now verifies the evidence inside the
return package, not only its envelope: fixture shape, canonical event replay,
target-language audio coverage, deterministic scoring scenarios, accessibility
evidence, source-manifest paths, and wrapper boundaries. This remains a
review-only handoff and does not import or promote a candidate. See ADR 0711.

The candidate gate now has a source-free behavior test in the foundation suite:
one complete synthetic return package must pass, while the same package with
random rewards or cross-session audio identity must fail. This protects the
review gate itself before Z.ai evidence arrives. See ADR 0712.

Canonical replay evidence now requires one identical `replay-v1:` seed across
all required learning and audio events. A syntactically valid seed from another
layout is rejected as mixed replay evidence before completion review. See ADR
0713.

## 0714 - Platform-supplied replay seed threading

The local progression adapter now accepts an optional platform replay seed on
interaction, audio, and completion event factories, preserving the supplied
value across the complete event sequence. The deterministic unit-and-mode seed
remains the fallback for existing callers. A runtime regression compiles the
adapter and proves the custom seed survives all four lifecycle boundaries.
This keeps future Phaser wrappers compatible with the canonical replay gate.
See `docs/adr/0714-platform-supplied-replay-seed-threading.md`.

The adapter also preserves the existing metadata-carried replay seed path for
current game components. Explicit arguments take priority, so both current
wrappers and future platform-issued seeds remain compatible with the one-seed
canonical event rule.

## 0715 - Fail-closed replay seed and identity validation

The canonical replay contract now validates the complete seed shape rather than
only its prefix, rejecting empty or unsafe values. The shared event validator
also uses non-blank identity reads for unit keys so malformed runtime evidence
returns a validation error instead of throwing. Runtime regression coverage
proves both rejection paths. See `docs/adr/0715-fail-closed-replay-validation.md`.

## 0716 - Route-shell replay seed ownership

`PlayableGameRouteShell` now creates the canonical replay seed once and passes
it into each mounted canonical game. The game components require that value
and pass it explicitly to interaction, learning-audio, and completion event
factories. They no longer derive an independent seed. This keeps deterministic
layout evidence and event evidence on one platform-owned handoff boundary,
ready for a future issued seed or approved Phaser wrapper. See
`docs/adr/0716-route-shell-replay-seed-ownership.md`.

## 0717 - Active Phaser candidate order resolution

The current Z.ai/Phaser handoff order is Memory Match, Balloon Pop, Label It,
then a gated voice candidate. An older inventory entry that listed Balloon Pop
first is historical and has been marked superseded. Candidate order is not
approval: every scene remains outside the canonical app until its own fixture,
event, audio, replay, accessibility, identity, tenant-policy, and wrapper
evidence passes review. See `docs/adr/0717-active-phaser-candidate-order.md`.

## 0718 - Platform replay seed injection boundary

The canonical route shell now accepts an optional `platformReplaySeed` and
passes it through the shared resolver. Only a valid transport-safe seed is
used; absent or malformed input falls back to the deterministic unit-and-mode
seed. This creates a future Phaser/provider handoff point without enabling
source import, route replacement, live persistence, or student assignment
behavior. The canonical integration verifier and runtime harness check the
input, validation, and fallback. See `docs/adr/0718-platform-replay-seed-injection-boundary.md`.

## 0719 - Memory Match source mapping review

The frozen Memory Match scene was reviewed in its isolated Z.ai snapshot and
mapped to the canonical pairing boundary. The review preserves useful card,
responsive-layout, and tap-to-speak ideas while explicitly replacing scene
randomness, scene-owned scoring, browser persistence, direct audio authority,
and unverified canvas lifecycle behavior. No source was copied and the
candidate remains blocked until its complete evidence packet passes the package
gate. See `docs/PHASER_MEMORY_MATCH_MAPPING_REVIEW.md`.

## 0720 - Documentation integrity gate

The standards document was corrected so the cross-cutting Agent Standards
section is uniquely identified as `11.1`, and a repeated audio standard title
was clarified without changing its evidence meaning. Added
`scripts/verify-standards-integrity.mjs`, which checks unique standards and
decision identities and is invoked by foundation composition. Historical
decision ordering is preserved. See `docs/adr/0719-documentation-integrity-gate.md`.

## 0721 - Blueprint foundation phase alignment

Updated `docs/BLUEPLAN.md` so its earlier open-decision list now reflects the
implemented foundation: tenant configuration, MiniStar flagship status, the
curated Flashcards -> Match Up -> Label It -> Memory Match student pathway,
static authoring validation, and provider-neutral backend contracts. The
separate external Phaser review order begins with Memory Match. The next
controlled gate is the isolated Phaser candidate return package; no source
promotion is implied. See
`docs/adr/0720-blueprint-foundation-phase-alignment.md`.

## 0722 - Balloon Pop source mapping review

Inspected the frozen `BalloonPopScene.ts` without copying source. Recorded its
reusable timing-and-targeting interaction and the required replacements for
randomization, scoring, audio, identity, persistence, lifecycle, responsive
input, accessibility, and tenant policy. Balloon Pop remains the second
external candidate after Memory Match and is blocked pending its complete
evidence package. See `docs/adr/0721-balloon-pop-source-mapping-review.md`.

## 0723 - Phaser candidate profile gate

Generalized the isolated candidate package verifier from a Memory Match-only
assumption to explicit approved profiles. Memory Match uses the pairing parent
engine and its baseline scoring scenarios; Balloon Pop uses selection and adds
the required missed-target scenario. Updated the checks, intake gate, and
standing standards while preserving the review-only boundary. See ADR 0722.

## 0724 - Phaser candidate manifest integrity

Moved candidate profiles into the shared content-model manifest and made the
package verifier validate that manifest before reading a candidate. Invalid or
incomplete profiles now fail closed instead of removing replay requirements.
Web typecheck, candidate behavior, production build, and the full 88-route
verification remain required. See ADR 0723.

## 0725 - Phaser source evidence command

Exposed the documented frozen-source reproducibility check as
`npm run verify:phaser-source-evidence`. The command passes against the local
isolated snapshot with 5/5 hashes matching the frozen commit. This is an
evidence identity check only; candidate return-package review remains the next
external gate and source promotion remains blocked. See ADR 0724.

## 0726 - Frozen source checker quarantine guard

Hardened the frozen Phaser source evidence checker so manifest paths cannot
escape the isolated snapshot. Added a contract verifier that requires the
read-only hash and path-containment behavior and rejects write, import,
process, or application-path markers. The foundation composition now includes
20 critical checks. Candidate return-package review and source promotion
remain blocked. See ADR 0725.

## 0727 - Phaser review profile binding

The shared Phaser contract-review validator now resolves each review through
the approved candidate profile and rejects a mode/parent-engine mismatch.
Runtime evidence covers the mismatch, while sample reviews, candidate review,
AI-service typecheck, web typecheck, and the review-only boundary remain green.
No import, route activation, scoring ownership, persistence, or assignment was
enabled. See ADR 0726.

## 0728 - Phaser review source-path boundary

Hardened the contract-review validator so candidate source files must use
unique, repository-relative POSIX paths. Absolute paths, Windows drive paths,
backslash paths, and parent-directory traversal now fail closed. Added runtime
coverage for a Windows absolute path while preserving the review-only boundary.
No source was copied and no candidate was promoted. See ADR 0727.

## 0729 - Phaser evidence artifact-path uniqueness

Hardened the candidate package verifier so every required artifact has a
distinct relative path as well as a distinct kind, identifier, reviewed state,
and checksum. Added a synthetic regression case proving that reusing one file
for two artifact records is rejected, while the complete Memory Match and
Balloon Pop profiles still pass. No source was copied and no candidate was
promoted. See ADR 0728.

## 0730 - Phaser review payload-shape hardening

Hardened the Phaser contract-review validator against malformed JSON handoffs.
Missing or non-array evidence collections, null source/findings entries, and
missing nested blocker data now return actionable validation errors instead of
throwing. Added runtime coverage for malformed records and non-array review
collections. No source was copied and no candidate was promoted. See ADR 0729.

## 0731 - Frozen source manifest path integrity

Hardened the frozen Phaser source evidence verifier so every manifest path is a
unique, normalized repository-relative POSIX path before hashing. Duplicate,
absolute, drive-letter, backslash, empty-segment, dot-segment, and
parent-directory paths now fail closed. The read-only isolated snapshot check
remains green. No source was copied and no candidate was promoted. See ADR
0730.

## 0732 - Canonical game event payload hardening

Hardened the shared canonical game event-sequence validator to treat incoming
event evidence as untrusted JSON. Non-array collections and null or malformed
entries now produce actionable fail-closed errors instead of runtime throws,
while valid event ordering, identity, audio, replay, scoring, and completion
checks remain unchanged. See ADR 0731.

## 0733 - Canonical completion terminal boundary

Strengthened canonical game replay validation so gameplay events cannot occur
after `game_completed`. A post-completion start, round, answer, result, or
mastery event now fails closed while post-completion learning-audio replay
remains available as a non-gameplay support action. Added runtime coverage and
kept all canonical wrappers under the shared route-shell boundary. See ADR
0732.

## 0734 - Canonical game event type boundary

Centralized the complete `GameEventType` vocabulary in the content model and
made canonical sequence validation reject unsupported runtime event strings.
Added a regression case for an unknown event type. This prevents browser,
Phaser, import, or report evidence from entering ordering and completion logic
under a future typo or unapproved extension. No live persistence, route
activation, or Phaser source promotion was enabled. See ADR 0733.

## 0735 - Controlled Z.ai intake status alignment

Aligned the teacher foundation status snapshot with the now-open controlled
intake gate. The teacher surface may signal that one isolated Z.ai or Phaser
candidate can be returned for evidence review, while returned-package review,
source identity, replay, audio, scoring, mobile, accessibility, and wrapper
checks remain mandatory before any integration decision. No source import,
route activation, production promotion, persistence, or student assignment was
enabled. See ADR 0734.

## 0736 - Progress envelope factory fail-closed boundary

Removed the silent `report-only` fallback from progress-event envelope
creation. The factory now rejects unsupported event types and known event types
missing from the supplied taxonomy before an envelope is produced. Added
runtime coverage for the untrusted factory input. This keeps event acceptance
consistent from creation through validation without enabling live persistence,
report export, progression, or assignment. See ADR 0735.

## 0737 - Progress envelope stream container boundary

Hardened progress-event stream validation for untrusted runtime input. A null,
object, or other non-array stream now returns a deterministic validation error,
and the warning helper returns a clear report-preview warning instead of
throwing. Added runtime coverage for both boundaries. This protects report,
persistence, and future game adapters without enabling live storage,
progression, reward, or assignment effects. See ADR 0736.

## 0738 - Shared adapter replay-seed normalization

Hardened the shared web progression adapter so provider-supplied replay seeds
are validated through the canonical `replay-v1` resolver before game-start,
interaction, audio, and completion events are created. Malformed seeds now
fall back to the deterministic unit/mode seed at the event boundary. Added
runtime coverage across all four factories. No scoring, persistence,
progression, reward, assignment, or Phaser source promotion was enabled. See
ADR 0737.

## 0739 - Progress envelope stream chronology boundary

Hardened progress-event stream validation so valid individual timestamps cannot
be reordered silently inside a report or persistence batch. Valid timestamp
entries must remain in non-decreasing `occurred_at` order; malformed timestamp
entries continue to be reported by individual envelope validation. Added a
runtime regression case. This remains verification-only and does not enable
storage, reporting export, progression, rewards, assignment, or Phaser source
promotion. See ADR 0738.

## 0740 - Shared learning-audio replay handoff

Fixed the shared playable-game shell and direct flashcard entry flow so their
learning-audio contracts receive and record the same canonical replay seed as
the mounted game. This prevents a teacher or student from tapping a
shell-level or entry-level audio rule and contaminating an otherwise valid
platform-issued replay with a second seed. The canonical integration verifier
now guards both prop and event handoffs. No persistence, scoring, progression,
reward, assignment, or Phaser source promotion was enabled. See ADR 0739.

## 0741 - Canonical game-mode scoring profile binding

Strengthened the canonical game validator so mastery and completion events
must use the deterministic scoring profile assigned to their game mode, not
merely agree with each other. Centralized the twelve-mode profile map in the
content model, added runtime mismatch coverage, and kept the web game wrappers
under the shared route boundary. No persistence, scoring mutation, progression,
reward, assignment, or Phaser source promotion was enabled. See ADR 0740.
## 0742 - Shared scoring profile source boundary

Removed duplicated mode-to-scoring-profile assignments from the web catalog
and scoring helper. The content model now exports the canonical profile map
and derived profile identifier type; web consumers use that shared source.
Static verification guards the boundary. No persistence, scoring mutation,
progression, reward, assignment, or Phaser source promotion was enabled. See
ADR 0741.
## 0743 - Required scoring profile at playable game boundary

Removed nullable and hard-coded scoring profile fallbacks from canonical game
wrappers. Playable games now resolve a required profile from the shared mode
map, while the Sentence Builder engine preview reads the same canonical
assignment. Static verification rejects literal profile claims and `none`
fallbacks in game components. No persistence, scoring mutation, progression,
reward, assignment, or Phaser source promotion was enabled. See ADR 0742.

## 0744 - Target-language audio at completion boundary

Connected the unit/tenant target language to every canonical game completion
gate. Completion evidence now rejects learner-facing audio events in a support
language, while accepting compatible regional language tags such as `en-US`
for an `en` unit. Existing report-only validator callers remain compatible
when no unit language is available. Support-language audio remains available
for assistance but cannot satisfy the target-language learning evidence. No
persistence, scoring mutation, progression, reward, assignment, or Phaser
source promotion was enabled. See ADR 0743.

The same target-language filter is now applied before a playable wrapper
selects a cue in the shared route shell and the teacher/student launch flows.
The complete cue set remains available to the learning-audio contract so
support-language coverage stays visible without becoming game evidence.

Canonical wrappers now also receive the resolved target language explicitly.
Their generated instructions, feedback, fallback speech, and emitted audio
events therefore follow the tenant language instead of silently defaulting to
English. See ADR 0743.

## 0745 - Canonical game completion dust caps

Moved deterministic per-mode completion caps into the content model. The web
scoring profiles reference that shared map, the progression adapter clamps each
game award to its mode cap, and canonical event validation rejects mastery or
completion evidence above the same cap. The game-mode verifier now checks the
binding instead of requiring duplicated numeric literals. No persistence,
scoring mutation, progression policy change, reward, assignment, or Phaser
source promotion was enabled. See ADR 0744.

Runtime coverage now proves both limits independently: an oversized request is
clamped to the mode cap, and a valid mode award is further reduced when the
remaining unit capacity is smaller.

## 0746 - Canonical report target-language evidence

Carried the resolved tenant/unit target language into canonical teacher report
evidence validation. Tenant-aware teacher session monitors now pass the target
language to report replay, and report evidence rejects assist-language audio
even when the game event sequence, replay seed, and scoring profile are valid.
Legacy review-only callers remain compatible when no unit language is available.
Added runtime coverage for both compatible and wrong-language report evidence.
The report-runtime static verifier and fixture also keep the target-language
handoff visible for future refactors.
An explicitly supplied report target language must also be non-blank, so
malformed tenant context cannot silently disable the language boundary.
No persistence, report export, progression, reward, assignment, or Phaser
source promotion was enabled. See ADR 0745 and DR-819.

## 0747 - Speak It canonical scoring-cap alignment

Removed a legacy hard-coded 200 Star Dust ceiling from the Speak It wrapper.
Completed speech practice now uses the required shared speaking/listening
profile cap, while the shared progression adapter and canonical event validator
continue to enforce the mode and unit ceilings. Added a static integration guard
against reintroducing the smaller literal cap. No persistence, report export,
progression policy, reward, assignment, or Phaser source promotion was enabled.
See ADR 0746 and DR-820.

## 0748 - Flashcard fallback target-language alignment

Removed hard-coded English fallback speech from the flashcard entry practice
card. Missing instruction, entry-message, gate-message, term, and sentence cue
language now resolves tenant target language first, then the unit textbook
language, before using the English platform baseline. Assist-language controls
remain separately labelled and support-only. Added a static integration guard.
No persistence, report export, progression policy, reward, assignment, or
Phaser source promotion was enabled. See ADR 0747 and DR-821.

## 0749 - Match Up feedback fallback target-language alignment

Removed the remaining hard-coded English fallback from the Match Up feedback
and replay controls. When a reviewed cue is absent or does not provide a
language, both controls now use the resolved tenant/unit target language.
Added a static integration guard so future wrapper changes cannot reintroduce
an English-only fallback at this learner-facing boundary. No persistence,
report export, progression policy, reward, assignment, or Phaser source
promotion was enabled. See ADR 0748 and DR-822.

## 0750 - Canonical audio fallback regression guard

Generalized canonical game verification to reject learner-facing audio
language expressions that fall back directly to English. Every canonical
wrapper must use the resolved target language for missing cue language; the
English baseline remains valid only at the explicit target-language resolver
boundary. No persistence, report export, progression policy, reward,
assignment, or Phaser source promotion was enabled. See ADR 0749 and DR-823.

## 0751 - Shared route-card target-language handoff

Fixed the shared playable route shell so locked-activity and next-activity
cards receive the resolved tenant/unit target language for their tap-to-speak
summary. Added canonical verification for both shared surfaces. This closes a
route-level fallback gap without changing unlock, scoring, persistence,
reporting, or source-promotion authority. No persistence, report export,
progression policy, reward, assignment, or Phaser source promotion was
enabled. See ADR 0750 and DR-824.

## 0752 - Explicit target-language audio actions

Required the shared `AudioSupportedAction` component to receive an explicit
target language. Repaired canonical game submit actions, front-door entry,
flashcards, unlock controls, training recovery, media playback, media
playlist preview, and progress summaries to pass the resolved tenant/unit
language. The media playlist route now carries tenant language context into
its preview surface as well.

Added a canonical integration guard against audio-supported game actions that
omit `audioLanguage={targetLanguage}`. This hardens the learner audio boundary
without changing unlock, scoring, persistence, reporting, assignment, or
Phaser source-promotion authority. See ADR 0751 and DR-825.

## 0753 - Learner route-guidance audio handoff

Extended the explicit target-language audio boundary to recommended game
routes, activity-hub summaries, recovery recommendations, and the media
playlist route. The media playlist now receives tenant language context, while
student and front-door flows pass the resolved unit language through route
guidance and recovery cards.

This keeps instructional guidance consistent with the game and progress
surfaces without changing progression, unlock, scoring, persistence,
reporting, assignment, or Phaser source-promotion authority. See ADR 0752 and
DR-826.

## 0754 - Explicit shared speech primitive language

Removed the final implicit English defaults from `AudioCueText`,
`AudioCueButton`, and `playAudioCueText`. All current callers already pass an
explicit tenant/unit, cue, or assist language, so the change converts a
silent fallback into a typecheck-visible contract failure.

Canonical verification now guards the primitive API itself. No progression,
unlock, scoring, persistence, reporting, assignment, reward, or Phaser
source-promotion behavior changed. See ADR 0753 and DR-827.

## 0755 - Shared target-language resolver

Centralized tenant-first, unit-second, explicit-English-baseline language
resolution in the content model and wired the resolver through canonical game
wrappers, route shells, student launch, training, media, printable previews,
and teacher-session evidence. Added a target-language readiness guard for the
resolver contract.

This removes duplicated white-label language precedence without changing
progression, unlock, scoring, persistence, reporting, assignment, reward, or
Phaser source-promotion behavior. See ADR 0754 and DR-828.

## 0756 - Printable target-language boundary

Passed tenant target-language context from the printable route into the
worksheet preview and reused the shared resolver before unit language. Added a
printable readiness guard so paper output cannot silently diverge from the
interactive tenant language contract.

Print remains a preview and teacher-controlled bridge; this does not award
mastery, Star Dust, completion, or progression, and does not change upload,
storage, export, or Phaser source-promotion authority. See ADR 0755 and
DR-829.

## 0757 - Runtime target-language precedence coverage

Extended the runtime behavior harness with deterministic assertions for tenant
override, unit fallback, whitespace normalization, custom fallback, and the
English baseline of `resolveTargetLanguage`. This proves the shared resolver's
precedence behavior in addition to the static callsite guards.

No learner behavior, progression, scoring, persistence, reporting, assignment,
reward, print, or Phaser source-promotion behavior changed. See ADR 0754 and
DR-830.

## 0758 - Teacher evidence language display boundary

Replaced the teacher monitor's hard-coded English display fallback with the
shared tenant-first target-language resolver. Added readiness coverage so
missing event language cannot make a white-label teacher report appear to use
the wrong language.

This changes display accuracy only; it does not change event acceptance,
progression, scoring, persistence, reporting export, assignment, reward, or
Phaser source-promotion behavior. See ADR 0754 and DR-831.

## 0759 - Explicit AI draft target language

Hardened AI-generated draft validation so `unit_meta.target_language` is
required and missing language is rejected instead of silently becoming English.
Added runtime and generator-verifier coverage for the white-label authoring
boundary.

This preserves MiniStar English as an explicit tenant value while allowing
future Japanese-learning or other tenants to declare their own target
language. No provider dispatch, billing, persistence, package assembly, route
creation, assignment, progression, or Phaser source-promotion behavior was
enabled. See ADR 0754 and DR-832.

## 0760 - Required canonical completion target language

Made `targetLanguage` required in the canonical game completion gate because
all current student, teacher, and playable-route callers already resolve and
pass it. Added verifier coverage so a future canonical integration cannot
silently omit the language needed to validate learner audio evidence.

This is a compile-time and static-verification hardening slice only. It does
not change progression, scoring, persistence, reporting, assignment, rewards,
or Phaser source-promotion authority. See ADR 0756 and DR-833.

## 0761 - Required canonical game wrapper language

Made the resolved target language required in all eleven canonical game
wrapper prop contracts and added a verifier guard for every active wrapper.
This keeps route handoff, learner audio, and completion evidence on one
explicit white-label language boundary.

This is a type and verification hardening slice only. It does not change
unlock, scoring, progression, persistence, reporting, assignment, rewards, or
Phaser source-promotion authority. See ADR 0757 and DR-834.

## 0762 - Required teacher report target language

Made teacher report runtime requests and their canonical game evidence helper
require a non-empty target language. Updated runtime and static report checks
so teacher evidence cannot silently lose white-label language context.

This is a report-validation hardening slice only. It does not enable report
export, persistence, progression, scoring, assignment, rewards, or Phaser
source-promotion authority. See ADR 0758 and DR-835.

## 0763 - Non-blank completion language runtime guard

Added a fail-closed runtime check to the canonical completion gate so blank
or missing target language cannot reach event replay validation. Added static
verification for the guard and recorded the boundary in the standing
principles and decision register.

This does not change scoring, progression, persistence, reporting, assignment,
rewards, or Phaser source-promotion authority. See ADR 0759 and DR-836.

## 0764 - AI evidence target language fail-closed assembly

Removed silent English defaults from the AI-generated game build brief and
prototype audio-coverage evidence builders. Both now reject missing target
language before review evidence can be assembled, with static verifier checks
covering the boundary.

This does not enable model calls, provider billing, student assignment,
progression, persistence, reporting, or Phaser source promotion. See ADR 0760
and DR-837.

## 0765 - Phaser candidate root isolation

Hardened the external Z.ai evidence-package verifier so candidate roots must
resolve outside the product repository and manifest/artifact reads must remain
inside that isolated root. Regular-file and symlink-escape checks now fail
closed, with a regression test proving an in-repository candidate is rejected.

This preserves the review-only handoff and does not import source, create
routes, mutate scoring or audio policy, assign students, or promote Phaser
code. See ADR 0761 and DR-838.

## 0766 - Canonical game replay coverage

Added a deterministic runtime harness that validates ordered canonical event
evidence for all twelve active game modes under both English and Japanese
target-language contexts. Each mode is checked against its shared scoring
profile, dust cap, target-language audio, replay identity, and completion
award without creating routes or learner state.

This is foundation verification only and does not replace browser interaction
testing or authorize Phaser source promotion. See ADR 0762 and DR-839.

## 0767 - Canonical Flashcard entry slice

Registered the FlashcardDemoFlow as the twelfth canonical learning slice,
separate from the eleven ordinary game wrappers because it is the teacher-QR
entry gate. Static verification now requires target-language engagement,
audio replay, deterministic entry completion, next-mode policy use, and the
support-language progression boundary.

This does not add a new engine or authorize source promotion. See ADR 0763
and DR-840.

## 0768 - Flashcard entry runtime gate

Added runtime behavior coverage for partial and complete Flashcard entry
practice. Partial target-language engagement now has explicit no-completion and
no-unlock evidence; a complete pass proves canonical entry dust, completion,
and support-language-safe unlock events.

This does not add persistence, assignment, or Phaser promotion authority. See
ADR 0764 and DR-841.

## 0769 - Flashcard entry idempotence

Added runtime behavior coverage for repeated completed Flashcard entry
submissions. A retry now proves zero additional Star Dust, no duplicate
completion or unlock events, and an unchanged progression total.

This does not add persistence, assignment, or Phaser promotion authority. See
ADR 0765 and DR-842.

## 0770 - Pairing engine runtime contract

Added a deterministic runtime harness for the reusable Pairing engine. It now
proves selection, duplicate-tap handling, mismatch recovery, correct matching,
completion, terminal retry safety, and progress summaries before pairing game
skins are treated as canonical integrations.

This does not add persistence, assignment, or Phaser promotion authority. See
ADR 0766 and DR-843.

## 0771 - Selection engine runtime contract

Added a deterministic runtime harness for the reusable Selection engine. It
proves vocabulary and syntax rounds, unique options, single-answer
correctness, prompt and option audio, and shared event expectations before
selection game skins are treated as canonical integrations.

This does not add persistence, assignment, or Phaser promotion authority. See
ADR 0767 and DR-844.

## 0772 - Text/Spelling engine runtime contract

Added a deterministic runtime harness for the reusable Text/Spelling engine.
It proves the two-sentence boundary, stable tile ordering, terminal
punctuation handling, tile audio, scoring identity, and shared event
expectations before Sentence Builder and related skins are treated as
canonical integrations.

This does not add persistence, assignment, or Phaser promotion authority. See
ADR 0768 and DR-845.

## 0773 - Speaking engine runtime contract

Extracted speaking prompt assembly into a reusable adapter and added runtime
evidence for deterministic term and sentence prompts, stable identities,
reviewed text preservation, and safe audio-cue matching. The microphone lane
remains optional, teacher-controlled local replay.

This does not add AI speech scoring, persistence, assignment, or Phaser
promotion authority. See ADR 0769 and DR-846.

## 0774 - Balloon Pop evidence handoff

Added the second controlled Z.ai candidate brief for Balloon Pop. The request
binds the Selection-engine payload, deterministic motion and replay, misses,
audio-first controls, accessibility, source identity, and wrapper boundaries
without authorizing source import or student-route activation.

This is an external evidence-preparation slice only. See ADR 0770 and DR-847.

## 0775 - Canonical parent-engine binding

Added a content-model map for the declared parent engine of each canonical
mode and required that identity on mastery and completion evidence. Runtime
replays and the production build now verify that a mode cannot complete under
the wrong parent engine.

This hardens the future Z.ai/Phaser wrapper boundary without importing frozen
source, adding persistence, or activating narrative routes. See ADR 0771 and
DR-848.

The game-mode coverage verifier also now checks the parent-engine map against
the web catalog, so a future mode cannot be added with a silent engine drift.
The runtime behavior harness also proves missing and cross-engine completion
evidence is rejected.

## 0776 - Curated unit pathway resolution

Moved the visible Game Sequence from a hard-coded mode list to tenant-scoped
curated unit offer maps, with an exhaustive shared-catalog fallback for units
that have no published map. Training Academy remains the final review lane.

This keeps white-label pathways data-driven while preserving the reviewed
activity order and parent-engine binding. See ADR 0772 and DR-849.

## 0778 - Neutral teacher reporting contract boundary

Moved teacher reporting metrics, session gates, report-package boundaries,
progress-summary concepts, and tenant configuration into the neutral
`packages/content-model` package. Web feature files now consume those types,
and the existing tenant type path remains only as a compatibility re-export.

Updated provider-boundary verification so reusable reporting surfaces cannot
reach sample fixtures or web-owned contract modules. This is contract
ownership hardening only; it does not enable live persistence, report export,
classroom launch, or Phaser source promotion. See ADR 0775 and DR-852.

## 0779 - Neutral curated activity offer contract

Moved `UnitGameOffer` and `UnitGameOfferMap` into the public content-model
package and changed launch, student, teacher, dashboard, and game-shell
surfaces to consume the package contract. The former web type path is now only
a compatibility re-export, and the pathway boundary verifier prevents the
contract from drifting back into the UI layer.

Provider-side tenant fixtures and launch/assignment resolvers also now import
`TenantConfig` from the content-model package root rather than the web
compatibility path.

Roster and teacher-assignment contracts are also exported through the package
root, keeping launch, assignment, and classroom identity boundaries on the
same public content-model API.

This keeps curated, pre-reviewed activity pathways tenant-configurable without
creating a giant switch-anything panel. It does not add new games, enable live
uploads, activate persistence, or authorize Phaser source promotion. See ADR
0776 and DR-853.

## 0780 - Review contract public boundary

Promoted review-surface, prototype-intake readiness, prototype-return
readiness, AI generation request preview, and verifier evidence contracts
through the public `packages/content-model` package root. Updated the web
panels and sample fixtures to consume those contracts from the root rather
than internal package paths.

This is a composition and ownership hardening slice. It keeps evidence
surfaces review-only and does not enable live AI calls, uploads, persistence,
student assignment, or Phaser source promotion. See ADR 0777 and DR-854.

## 0781 - Persistence and pilot-policy public boundary

Promoted persistence record and pilot-policy contracts through the public
`packages/content-model` package root. Updated the affected web panels and
sample providers to consume the neutral contracts without internal module
paths.

This remains composition hardening. It does not create live database writes,
enable student assignment, bypass policy review, or authorize Phaser source
promotion. See ADR 0778 and DR-855.

## 0782 - Public contract import guard

Migrated the remaining app-level content-model subpath imports to the public
package root across the web review/AI scaffolding and added
`verify:content-model-boundary` to the foundation composition gate.

This makes the package boundary enforceable for future work while preserving
all review-only and no-side-effect restrictions. It does not enable live AI,
uploads, persistence, assignment, or Phaser source promotion. See ADR 0779
and DR-856.

## 0783 - Content-model package export map

Added a root-only `exports` map to `@living-textbook/content-model` targeting
the canonical package index. Extended the public-boundary verifier to reject
internal subpath exports and to validate the canonical target.

This is package API hardening only. No live AI, uploads, persistence,
assignment, or Phaser source promotion is enabled. See ADR 0780 and DR-857.

## 0784 - UI package export map

Added a root-only `exports` map to `@living-textbook/ui` and extended the
shared package-boundary verifier to validate both platform packages. This
keeps future tenant themes and feature consumers on the stable UI API.

No live AI, upload, persistence, assignment, or Phaser source promotion is
enabled. See ADR 0781 and DR-858.

## 0785 - Game audio readiness route gate

Added the shared `getGameAudioCoverage` content-model contract and connected
it to the reusable playable game route shell. Canonical games now remain
outside gameplay and scoring when a package is missing target-language audio
for a vocabulary term, target sentence, or the current game's instruction.
The learning-audio card reports the exact coverage, while the access gate
explains that the package needs review rather than treating the learner as
unsuccessful.

Added runtime assertions for complete and incomplete coverage. This does not
enable uploads, live AI, persistence, or Phaser promotion. See ADR 0782 and
DR-859.

## 0786 - Audio-consistent activity hub

Aligned the student activity hub with the shared game audio readiness contract.
Reviewed offers and fallback game items now distinguish progression readiness
from target-language audio readiness. When audio is incomplete, the hub shows
an audio-review status and withholds the open-game action before the learner
reaches the direct route gate.

Added a pathway verifier guard for the shared coverage call, the
`audio-blocked` status, and learner-facing explanation. This does not enable
uploads, live AI, persistence, or Phaser promotion. See ADR 0783 and DR-860.

## 0787 - Audio-gated entry paths

Aligned the front-door and normal student launch flows with the dedicated
flashcard entry route. Each now uses the shared target-language audio coverage
contract and blocks flashcard progression until reviewed term, sentence, and
instruction audio is ready. Added a verifier guard covering all three entry
paths so support-language audio cannot unlock progression by itself.

Typecheck, runtime behavior, and canonical game integration verification pass.
This remains a readiness and policy boundary; it does not enable uploads, live
AI, persistence, assignment, or Phaser source promotion. See ADR 0784 and
DR-861.

## 0788 - Level-safe game sequence fallback

Hardened the no-offer-map fallback in `GameSequence` so it only displays
canonical modes supported by the unit's curriculum level. Curated offers stay
authoritative, while fallback presentation cannot expose higher-level modes
just because a map is missing.

Canonical integration verification and the full foundation gate cover this
boundary. No upload, live AI, persistence, assignment, or Phaser promotion was
enabled. See ADR 0785 and DR-862.

## 0789 - Activity hub level boundary

Aligned the student activity hub with the level-safe `GameSequence` fallback.
Reviewed offers and no-map fallback items are now filtered through each mode's
catalog `supportedLevels` before they are displayed to a learner.

Canonical integration verification includes both presentation boundaries, and
the production build and 88-route sweep remain required. No upload, live AI,
persistence, assignment, or Phaser promotion was enabled. See ADR 0786 and
DR-863.

## 0790 - Learner continuation audio boundary

Aligned the Next Game card and recommended route list with the shared audio
readiness contract. Progression-unlocked activities now remain review-only in
these learner-facing surfaces until target-language term, sentence, and
instruction audio is ready. The route builder carries the tenant-resolved
language rather than assuming English.

Typecheck and canonical game integration verification pass. No upload, live AI,
persistence, assignment, or Phaser promotion was enabled. See ADR 0787 and
DR-864.

## 0791 - Completion navigation audio boundary

Aligned the shared playable-game completion card with next-activity audio
readiness. The route shell now passes the unit and audio context, and the card
withholds the next open action when reviewed target-language coverage is
incomplete, even after the current game has completed.

Typecheck and canonical game integration verification pass. No upload, live AI,
persistence, assignment, or Phaser promotion was enabled. See ADR 0788 and
DR-865.

## 0792 - Explicit audio scope

Hardened `getGameAudioCoverage` so explicit game-mode restrictions apply to all
learner-facing cue kinds. A cue scoped to another game can no longer satisfy
term, sentence, or instruction readiness for the current route.

Added a runtime regression case and a canonical source guard. Typecheck,
runtime behavior, and canonical game verification pass. No upload, live AI,
persistence, assignment, or Phaser promotion was enabled. See ADR 0789 and
DR-866.

## 0793 - Audio support plan propagation

Propagated the unit audio support plan into the activity hub and front-door
readiness calculations. Direct routes, entry practice, continuation cards,
front-door access, and the activity hub now share the same reviewed
`gameModeAudioCueIds` authority.

Typecheck, canonical integration verification, targeted activity-hub review,
and the full 88-route sweep remain required. This does not enable uploads,
live AI, persistence, assignment, or Phaser promotion. See ADR 0790 and
DR-867.

## 0794 - Fallback continuation audio gate

Closed the remaining no-offer-map continuation bypass in the recommended game
route card. Fallback routes now require both progression unlock and reviewed
target-language audio before rendering an active open action, matching curated
offers, direct routes, the activity hub, and completion navigation.

Canonical integration verification, typecheck, runtime behavior, production
build, and the 88-route sweep remain required. This does not enable uploads,
live AI, persistence, assignment, or Phaser promotion. See ADR 0787 and
DR-864.

## 0795 - Mode-scoped instruction audio

Closed the remaining instruction-cue scope gap in the shared audio coverage
helper. When a unit has a mode-specific audio support plan, instruction
readiness now accepts only shared instruction cues or cues explicitly listed
for that game mode. Same-unit audio that belongs to another activity can no
longer unlock the route by accident.

Added runtime regression coverage and a canonical integration guard. Typecheck,
runtime behavior, canonical game verification, production build, and the 88-
route sweep remain required. This does not enable uploads, live AI,
persistence, assignment, or Phaser promotion. See ADR 0791 and DR-868.

## 0796 - Tenant-owned audio evidence

Added a runtime tenant-ownership check to shared game audio coverage. A cue
must match both the active unit key and the active unit tenant before it can
count toward terms, sentences, instructions, or route readiness. Added a
cross-tenant regression case and canonical source guard.

Typecheck, runtime behavior, canonical game verification, production build,
and the 88-route sweep remain required. This does not enable uploads, live AI,
persistence, assignment, or Phaser promotion. See ADR 0792 and DR-869.

## 0797 - Front-door continuation context

Wired the active unit audio support plan into the front-door recommended-route
card. Added a targeted canonical integration guard so this teacher-directed
entry surface cannot silently fall back to raw-cue readiness while direct
routes and the activity hub use reviewed mode-scope authority.

Typecheck, runtime behavior, canonical game verification, production build,
and the 88-route sweep remain required. This does not enable uploads, live AI,
persistence, assignment, or Phaser promotion. See ADR 0793 and DR-870.

## 0798 - Authorized game playback cues

Centralized learner game audio cue selection in the content-model package and
reused it for both readiness calculation and gameplay playback. Direct game
routes and dynamic front-door/student-launch modes now receive cues scoped by
unit, tenant, target language, and reviewed game-mode authority.

Added runtime and canonical integration regression coverage. Typecheck, runtime
behavior, canonical game verification, production build, and the 88-route
sweep remain required. This does not enable uploads, live AI, persistence,
assignment, or Phaser promotion. See ADR 0794 and DR-871.

## 0799 - Reviewed asset audio playback

Upgraded the shared learner audio primitive so a reviewed cue `sourceUri` is
played before browser speech synthesis. Cue-backed canonical game prompts now
pass their approved audio asset into the shared control where available;
speech remains the resilient low-cost fallback. Playback source selection does
not affect scoring, progression, mastery, rewards, or reporting, and local
bundle paths remain blocked until a deployment-specific resolver exists.

Typecheck, runtime behavior, canonical game verification, production build,
and the 88-route sweep remain required. This does not enable uploads, live AI,
persistence, assignment, or Phaser promotion. See ADR 0795 and DR-872.

## 0800 - Browser audio locator boundary

Added a browser-safe source check to the shared audio primitive. Same-origin
and HTTP(S) reviewed cue locators may play as assets; filesystem, script,
data, malformed, or unavailable locators use the existing speech fallback.
Local companion paths remain deployment-adapter work and cannot leak into the
hosted browser route.

Typecheck, runtime behavior, canonical game verification, production build,
and the 88-route sweep remain required. This does not enable uploads, live AI,
persistence, assignment, or Phaser promotion. See ADR 0796 and DR-873.

## 0801 - Explicit media delivery mode

Hardened the shared multimedia source resolver so hosted-first browser routes
do not fall back to local bundle paths. Local-first resolution remains an
explicit deployment choice and may use hosted media as a documented fallback;
missing sources stay unavailable rather than pretending to be offline-ready.

Typecheck, runtime behavior, canonical game verification, production build,
and the 88-route sweep remain required. This does not enable uploads, live AI,
persistence, assignment, or Phaser promotion. See ADR 0797 and DR-874.

## 0802 - Explicit media mode propagation

Passed the media delivery choice through playlist, unit engagement, event
preview, and playback components. Hosted routes now declare `hosted-first`
explicitly, while a future local or hybrid companion has a deliberate
`local-first` injection point. Added canonical guards so this boundary cannot
be dropped silently during future game or media work.

Typecheck, runtime behavior, canonical game verification, production build,
and the 88-route sweep remain required. This does not enable uploads, live AI,
persistence, assignment, or Phaser promotion. See ADR 0798 and DR-875.

## 0803 - Entry practice cue fidelity

Wired the canonical Flashcard Practice instruction, vocabulary, sentence, and
completion cues into the shared audio control. Reviewed recordings now remain
the preferred source when available, with speech synthesis preserved as the
fallback. Added a canonical regression guard for the entry slice.

Typecheck, runtime behavior, canonical game verification, production build,
and the 88-route sweep remain required. This does not enable uploads, live AI,
persistence, assignment, or Phaser promotion. See ADR 0799 and DR-876.

## 0804 - Canonical game cue fidelity

Completed the reviewed-audio handoff across the canonical game family. Label
It, Balloon Pop, Speak It, Quiz, True or False, Fill in the Blank, Sentence
Builder, Spelling Practice, and Type Answer now pass their authorized cues to
shared learner audio controls where those cues exist. Added a regression guard
covering the full set.

Typecheck, runtime behavior, canonical game verification, production build,
and the 88-route sweep remain required. This does not enable uploads, live AI,
persistence, assignment, or Phaser promotion. See ADR 0800 and DR-877.

## 0805 - Audio transcript match guard

Hardened the shared learner audio controls so a reviewed source is only used
when its cue text exactly matches the visible text after normalization. This
prevents a generic retry or success recording from being played against a
different message while retaining target-language speech fallback for uncued
states. Added canonical verifier coverage and standing ADR/decision records.

This is a playback-integrity change only. It does not enable uploads, live AI,
persistence, assignment, microphone use, scoring changes, or Phaser promotion.
See ADR 0801 and DR-878.

## 0806 - Direct playback guard

Extended the shared reviewed-audio guard into immediate term and feedback
announcements. Label It, Spelling Practice, Fill in the Blank, Type Answer,
and True or False now pass available cues through the same transcript-safe
primitive rather than creating a separate speech path.

This is a playback-integrity change only. It does not enable uploads, live AI,
persistence, assignment, microphone use, scoring changes, or Phaser promotion.
See ADR 0802 and DR-879.

## 0807 - Production-shaped vertical slice gate

Added the first cross-boundary production-shaped slice verifier. It checks that
MiniStar and the sample publisher resolve through the same white-label package
contracts, that QR/front-door launch reaches Flashcard entry practice, that
reviewed audio and speech fallback are present, that Memory Match and a
canonical game are connected to deterministic progression evidence, and that
the teacher report plus hosted/local delivery boundaries are represented.

The gate is evidence-only for persistence: the teacher report remains
preview-safe until backend retention, export, and school-policy decisions are
approved. Frozen Z.ai/Phaser source remains isolated. The new verifier runs
first in `verify:foundation`; focused checks are `verify:vertical-slice` and
`verify:canonical-games`. See ADR 0803 and DR-880.

## 0808 - Browser rehearsal evidence bridge

Connected the actual student event stream to a teacher-visible browser
rehearsal panel. The student flow writes coded progression and
`GameProgressEvent[]` evidence to a bounded same-origin adapter after events
are recorded; the teacher session route reads it and updates across tabs.

The adapter is explicitly non-live: it stores no names, raw audio, transcripts,
hosted sync state, or export records, and storage failure cannot block gameplay.
This closes the student-to-teacher proof gap without bypassing the existing
school-policy, privacy, retention, persistence, and release gates. See ADR 0804.

## 0809 - Synchronous canonical event append boundary

The live student replay exposed a timing defect in the canonical game gate:
the React state updater deferred the session-event ref update until after the
game completion callback had already validated the replay. The mastery event
was visible in the rendered event log but absent from the gate's immediate
snapshot.

The student flow now derives the next event list from `sessionEventsRef`, writes
the ref synchronously, and then schedules the matching React state update. The
production-shaped vertical-slice verifier requires this ordering so every
completion gate sees the same deterministic event sequence that the teacher
evidence adapter later records. See ADR 0805 and DR-881.

## Build session 0812: Hosted adapter read-path probe

- Added a teacher-only read-path probe to the persistence workbench.
- The probe uses a coded sample identity and never performs a write.
- It distinguishes endpoint availability, record availability, and non-durable rehearsal status.
- Added ADR 0812 and DR-884.

## Build session 0814: Authenticated durable student session

- Added a server-validated coded front-door session endpoint with signed,
  expiring HttpOnly cookies.
- Connected authenticated browser sessions to the durable progression write
  route without exposing the server persistence token.
- Kept process-memory rehearsal as an explicitly labeled fallback when the
  durable deployment gates are disabled.
- Verified live authentication, durable write, authorized read, and durable
  record mode preservation against a temporary SQLite database.
- Added ADR 0814, DR-886, and the authenticated-session verification contract.

## Build session 0815: Closed-pilot operations boundary

- Added server-only SQLite health diagnostics, backup, restore, and
  identity-scoped retention deletion operations.
- Added SHA-256 backup manifests and restore checksum verification so recovery
  evidence identifies the exact database artifact that was reviewed.
- Added explicit operations, retention-period, school-policy, retention-policy,
  and release gates without exposing mutation controls to the browser.
- Added a teacher-safe persistence status panel that returns no learner records,
  database paths, credentials, raw audio, or transcripts.
- Added backup/restore/deletion and cross-tenant isolation evidence in
  `npm run verify:durable-operations`.
- Added ADR 0815, DR-887, and the durable operations verification contract.

## Build session 0816: Persistence operations evidence ledger

- Added metadata-only SQLite receipts for completed backup, restore, and
  retention-deletion operations.
- Added one-way scope digests so deletion evidence does not retain raw student
  session identifiers.
- Added a read-only teacher operation-history panel and route with no browser
  mutation controls.
- Added ADR 0816, DR-888, and the persistence operations evidence checks.

## Build session 0817: Persistence evidence chain

- Added chained previous/evidence hashes to metadata-only persistence
  operation receipts.
- Added safe schema migration/backfill and health-time chain verification.
- Added teacher-safe integrity state and verified-receipt count without adding
  browser mutation controls.
- Added ADR 0817, DR-889, and the persistence evidence chain checks.

## Build session 0818: Tenant-scoped teacher operations authorization

- Added a separate signed, expiring teacher review session with the
  `persistence:read` scope and explicit tenant allowlist.
- Protected the read-only operations history route from unauthenticated and
  cross-tenant access without reusing the student session cookie.
- Added one-way tenant attribution to retention receipts and hid platform-wide
  backup/restore receipts from tenant teacher responses.
- Added teacher review sign-in/sign-out controls, configuration status, ADR
  0818, DR-890, and focused authorization verification.
- Added read-only session discovery so an existing teacher session survives a
  page refresh without placing credentials or authorization state in browser
  storage.

## Build session 0819: Canonical Memory Match integration gate

- Added a focused review-only gate joining the active canonical Memory Match
  wrapper and route to the frozen MiniStar Phaser candidate evidence.
- Added nine explicit evidence lanes for profile, provenance, wrapper, fixture,
  events, target-language audio, deterministic scoring, mobile/accessibility,
  and Codex decision review.
- Kept direct source import, route replacement, scene-owned state, package
  promotion, and student assignment blocked.
- Added `npm run verify:memory-match-gate` and included it in the canonical game
  verification command.
- Added ADR 0819, DR-891, and the focused verification contract.

## Build session 0820: Memory Match evidence handoff packet

- Added a typed, review-only evidence packet that composes the canonical
  Memory Match gate with the frozen MiniStar Phaser candidate review.
- Defined the first human-triggered Z.ai return package with nine required
  artifacts and eight acceptance checks.
- Added a teacher-visible handoff preview without dispatch, source import,
  route replacement, live scoring, persistence mutation, reward mutation, or
  assignment controls.
- Added `npm run verify:memory-match-handoff` and included it in canonical game
  verification.
- Added ADR 0820, DR-892, and the evidence handoff verification contract.

## Build session 0821: Production-shaped vertical slice handoff

- Added one shared progression route-handoff save helper with package, tenant,
  launch, student-session, source-route, and destination-route validation.
- Updated flashcard recommendations so opening an unlocked activity saves a
  validated handoff before navigation.
- Updated completed canonical game routes to hand off to their next reviewed
  activity instead of navigating optimistically.
- Bound Sentence Builder to the content package identity required by the
  destination handoff gate.
- Extended `npm run verify:vertical-slice` and the standing handoff contract
  documentation.

## Build session 0822: Cross-route local evidence continuity

- Bound browser rehearsal evidence to content-package identity in addition to
  tenant, launch, unit, and student-session identity.
- Added a deterministic append/merge helper that preserves route order and
  removes exact duplicate events without merging different sessions.
- Wired the standalone Flashcards route and shared canonical game shell to
  update the teacher-visible local rehearsal record.
- Kept hosted persistence, export, raw audio, transcripts, and live learner
  reporting blocked; local evidence failures are visible but do not grant
  progression.
- Added the continuity checks to `npm run verify:vertical-slice` and recorded
  ADR 0822 and DR-894.

## Build session 0823: Teacher rehearsal reconciliation

- Bound the teacher local evidence panel to the expected tenant, content
  package, and student-session identity from the teacher session context.
- Added a read-only cross-route journey summary for observed canonical game
  modes with coded starts, answers, completion, mastery, and audio-support
  counts.
- Hide mismatched local evidence instead of presenting it under the wrong
  tenant or learner.
- Kept local rehearsal, no-export, no-hosted-persistence, raw-audio, and
  transcript boundaries visible in the teacher surface.
- Extended the production-shaped vertical-slice verifier and recorded ADR 0823
  and DR-895.

## Build session 0824: Pilot end-to-end session rehearsal

- Defined the first complete white-label rehearsal as Front Door -> Flashcards
  -> Memory Match -> Sentence Builder -> Teacher Report.
- Extended the rehearsal fixture with explicit Memory Match and Sentence
  Builder handoff stages, audio expectations, idempotency checks, and blocked
  direct-route or scene-owned mutation behavior.
- Added a focused verifier and included it in the canonical-games foundation
  gate.
- Recorded the pilot rehearsal standard, ADR 0824, DR-896, and the focused
  verification contract.

## Build session 0825: Pilot evidence envelope

- Added a typed provider-neutral evidence envelope derived from the validated
  browser rehearsal record.
- Bound the envelope to tenant, package, launch, unit, student-session, and
  target-language identity, with ordered stage summaries and deterministic
  journey status.
- Excluded raw learner audio, transcripts, support-language progress, durable
  writes, and live classroom status as explicit invariants.
- Exposed the envelope readiness in the teacher session evidence panel.
- Extended the pilot rehearsal verifier and recorded ADR 0825, DR-897, and the
  focused verification contract.

## Build session 0826: Pilot session preflight

- Added a deterministic evaluator for identity, canonical workflow,
  target-language, privacy, and launch-boundary readiness.
- Exposed review-only preflight status and check details in the teacher session
  evidence panel.
- Kept classroom launch and durable writes explicitly blocked regardless of
  evidence completeness.
- Extended the pilot rehearsal verifier and recorded ADR 0826, DR-898, and the
  focused verification contract.

## Build session 0827: Pilot preflight behavior gate

- Added executable assertions for ready, incomplete, and invalid pilot
  evidence envelopes.
- Verified that launch and durable-write authorization remain false in every
  preflight state.
- Included the behavior gate in the canonical-games verification path.
- Recorded ADR 0827, DR-899, and the focused verification contract.

## Build session 0828: Server-owned persistence policy

- Replaced browser-supplied persistence approval flags with a client intent
  contract containing only identity, envelope, and requested mode.
- Added server-owned policy derivation for rehearsal and durable modes.
- Rejected client-supplied policy objects and preserved signed-session or
  server-token authorization at the API boundary.
- Added runtime assertions, persistence verification coverage, ADR 0828, DR-900,
  and the focused verification contract.

## Build session 0829: Hosted persistence read authorization

- Added an explicit read-purpose contract for learner continuity and teacher
  review probes.
- Required matching signed learner-session authorization for student reads and
  tenant-scoped teacher-session authorization for the teacher workbench probe.
- Kept missing-purpose, unknown-purpose, mismatched-tenant, and unauthorized
  reads fail-closed across both rehearsal and durable providers.
- Added source verification and recorded ADR 0829, DR-901, and the focused
  verification contract.
- Kept the teacher client's `protected`, `no record`, and `unavailable` result
  states distinct so a `401` cannot be misread as absent progression.

## Build session 0830: Persistence operations diagnostics authorization

- Required tenant-scoped teacher review authorization before persistence status
  diagnostics disclose provider, deployment, schema, retention, or evidence
  state.
- Added an explicit tenant query to the status client and kept unauthorized
  status distinct from healthy, blocked, rehearsal, and unavailable states.
- Preserved the no-live-action boundary for backup, restore, deletion, export,
  durable writes, and classroom launch.
- Extended the persistence authorization verifier and recorded ADR 0830 and
  DR-902.

## Build session 0831: Teacher operations session synchronization

- Added a tenant-scoped browser session-change event for the teacher
  operations review surface.
- Sign-in and sign-out now refresh the status, hosted-adapter, and
  operation-history panels for the matching tenant without carrying secrets or
  changing server authorization.
- Kept all panels read-only and preserved protected, healthy, rehearsal,
  unavailable, and no-record distinctions.
- Extended persistence authorization source verification and recorded ADR
  0831 and DR-903.

## Build session 0832: Active teacher tenant revocation

- Revalidated the current teacher tenant allowlist for every teacher session
  status read and tenant-scoped operations read.
- Existing signed cookies now stop authorizing a tenant immediately after it
  is removed from the active deployment allowlist.
- Kept the failure response privacy-safe and provider-neutral.
- Extended teacher operations authorization verification and recorded ADR 0832
  and DR-904.

## Build session 0833: Unauthorized operations privacy parity

- Removed provider disclosure from unauthorized persistence operation-history
  responses.
- Aligned operation-history privacy with the already protected status endpoint.
- Added a verifier assertion that the unauthorized branch cannot include
  provider diagnostics.
- Recorded ADR 0833 and DR-905.

## Build session 0834: Teacher operations runtime verification

- Added an opt-in runtime verifier for teacher sign-in, tenant-bound status
  and operation-history reads, cross-tenant rejection, and privacy-safe
  unauthorized responses.
- Kept the verifier outside the default foundation command because it requires
  an intentionally configured test deployment and review code.
- Added an optional second deployment URL for proving immediate cookie
  revocation after tenant allowlist removal.
- Recorded ADR 0834 and DR-906.

## Build session 0835: Teacher report persistence rehearsal

- Added a provider-neutral, review-only adapter rehearsal joining the teacher
  report request, tenant-bound persistence write intent, and durable report
  record contract.
- Required event-acceptance summaries, settings context summaries, matching
  tenant boundary keys, school-policy gates, pseudonymous reporting, and raw
  audio/transcript exclusion across all three layers.
- Kept report package writes and exports blocked with `sideEffect: "none"`;
  this is a contract rehearsal, not a live reporting backend.
- Added runtime behavior checks for valid alignment, settings-context drift,
  and tenant-boundary mismatch. Recorded ADR 0835 and DR-907.

## Build session 0836: Teacher report rehearsal surface

- Connected the provider-neutral report persistence rehearsal to the teacher
  reporting workbench and both tenant report-package preview routes.
- Reused the hosted pilot intent and durable report record fixtures rather than
  duplicating safety labels in the UI.
- Kept the surface read-only with visible review-only, no-side-effect, and live
  export-blocked states for MiniStar and partner tenants.
- Extended the active-route checks and recorded ADR 0836 and DR-908.

## Build session 0837: Provider-neutral persistence handoff

- Added a derived implementation handoff packet to the persistence workbench.
- Made hosted/local category coverage, provider neutrality, policy blockers, and
  side-effect blocking visible in one reusable review surface.
- Kept the packet derived from shared contracts and recorded ADR 0837 and
  DR-909.

## Build session 0838: Persistence handoff shared validator

- Moved the handoff packet schema and review-only invariants into the shared
  content model.
- Exposed concrete validator findings on the teacher persistence workbench.
- Extended persistence runtime verification and recorded ADR 0838 and DR-910.

## Build session 0839: Persistence handoff behavior verification

- Added runtime behavior checks for valid handoffs, provider injection, and
  missing tenant-bound category coverage.
- Verified the AI service type boundary and public content-model boundary.
- Recorded ADR 0839 and DR-911.

## Build session 0840: Pilot link key stability

- Fixed the duplicate React key collision on the pilot command view where two
  adult-review links intentionally share a destination.
- Added a regression check and recorded ADR 0840 and DR-912.

## Build session 0841: Pilot handoff shared validator

- Moved pilot handoff package types and safety invariants into the shared
  content model.
- Required internal entry, launch, and teacher-session routes, unique review
  identifiers, and a blocked student-data policy decision.
- Wired concrete validator findings into the pilot command view.
- Added runtime behavior coverage without enabling storage, export, publishing,
  policy acceptance, classroom launch, or live learner data.
- Recorded ADR 0841 and DR-913.

## Build session 0842: Source-to-package assembly contract

- Added a shared review-only assembly packet between extraction evidence and
  canonical package drafts.
- Preserved tenant/source/checksum identity, candidate units/media, required
  handoff records, and explicit false promotion flags.
- Added MiniStar and partner sample packets, intake visibility, and runtime
  behavior checks.
- Recorded ADR 0842 and DR-914.

## Build session 0843: Evidence-only package approval linkage

- Promoted the package approval ledger shape into the shared content model.
- Linked source-to-package assembly packets to tenant-scoped approval ledger
  identifiers and kept approval capture and promotion false.
- Added required-role validation, runtime assertions, intake visibility, and
  source-review checks.
- Recorded ADR 0843 and DR-915.

## Build session 0844: Package readiness reconciliation

- Added a shared tenant-scoped reconciliation contract with seven mandatory
  evidence lanes: source assembly, approval, verifier, target-language audio,
  media rights, publish gate, and assignment rollout.
- Added MiniStar and partner reconciliation previews to teacher intake while
  keeping promotion and student activation blocked.
- Added dedicated source-review, runtime, route, and foundation coverage.
- Recorded ADR 0844 and DR-916.

## Build session 0845: Package readiness persistence intent

- Added a shared provider-neutral metadata intent for the seven-lane package
  readiness reconciliation.
- Added tenant-scoped durable-record and hosted/local adapter coverage while
  keeping provider selection, writes, promotion, route/playlist/assignment
  changes, local bundle writes, and student activation blocked.
- Added a persistence workbench preview, runtime checks, route markers, and a
  standing verification checklist.
- Recorded ADR 0845 and DR-917.

## Build session 0846: Package readiness backend mapping

- Mapped the seven-lane readiness persistence intent into a provider-neutral
  backend schema entity, migration candidate, and migration specification.
- Preserved tenant/package/release-candidate scope, hosted/local metadata
  parity, and explicit blocked write, promotion, route, playlist, assignment,
  local-bundle, and student activation guards.
- Added backend storage readiness and active-route coverage for the mapping.
- Recorded ADR 0846 and DR-918.

## Build session 0847: Foundation durable persistence gate

- Promoted durable progression, recovery operations, teacher operations
  authorization, and cross-route persistence checks into the canonical
  `verify:foundation` composition.
- Preserved the separation between opt-in durable SQLite storage and the
  non-durable process-memory rehearsal path.
- Added a standing verification checklist and recorded ADR 0847 and DR-919.

## Build session 0848: Provider-neutral persistence adapter seam

- Moved process-memory rehearsal and SQLite progression selection behind one
  server-only adapter boundary.
- Kept provider selection, durable writes, identity authorization, and policy
  gates outside browser-controlled request data.
- Added adapter seam verification and recorded ADR 0848 and DR-920.

## Build session 0849: Persistence provider configuration fail-closed

- Added explicit provider configuration validation for `process-memory` and
  `sqlite`.
- Invalid provider values now return a blocked deployment state rather than
  silently degrading to rehearsal storage.
- Kept the safe unset default, tenant-safe error surface, and no-credential
  disclosure boundary.
- Recorded ADR 0849 and DR-921.

## Build session 0850: Persistence provider runtime configuration

- Added an executable runtime check for the provider-neutral configuration
  helper.
- Proved the unset rehearsal default, supported values, whitespace trimming,
  and fail-closed handling for unsupported values.
- Kept the check isolated from SQLite creation, hosted vendor selection, learner
  data, credentials, and live persistence.
- Recorded ADR 0850 and DR-922.

## Build session 0851: Local bundle manifest runtime contract

- Added a shared validator for safe paths, unique assets, QR fallbacks,
  checksum evidence, and rights evidence.
- Kept planning manifests reviewable with warnings while rejecting false
  offline-ready claims.
- Kept bundle writes, service workers, media caching, learner-data storage, and
  local handoff blocked.
- Recorded ADR 0851 and DR-923.

## Build session 0852: Read-only local bundle resolver

- Added a validated, tenant-scoped, read-only resolver for manifest-declared QR
  fallbacks and local assets.
- Rejected unknown identifiers, invalid manifests, and cross-tenant lookups.
- Kept directory reads, file reads, file writes, bundle creation, service
  workers, media caching, learner-data storage, and offline activation blocked.
- Recorded ADR 0852 and DR-924.

## Build session 0853: Local bundle preview resolution evidence

- Wired the local MiniStar and sample-publisher companion previews to the
  shared read-only bundle resolver.
- Added visible tenant-scoped route and asset resolution evidence, including
  planning warnings and resolved counts.
- Preserved no-file-access, no-bundle-write, no-offline-activation, and
  no-learner-data-persistence boundaries.
- Added static coverage to the local-bundle readiness verifier.
- Recorded ADR 0853 and DR-925.

## Build session 0854: Local bundle visual asset coverage

- Extended tenant planning manifests to carry reviewed image assets alongside
  audio and video.
- Added MiniStar and sample-publisher Labelled Diagram-style image entries
  with rights and checksum blockers still visible.
- Fixed empty resolution-list rendering so an empty manifest reports its
  evidence state clearly.
- Preserved no-file-access, no-upload, no-image-editor, no-student-route, and
  no-offline-activation boundaries.
- Recorded ADR 0854 and DR-926.

## Build session 0855: Local bundle media accessibility metadata

- Added planning metadata for audio transcripts, video captions, and poster
  images in both tenant bundle summaries.
- Carried those paths into the shared validated manifest used by the resolver
  rehearsal.
- Added focused verification for representative supporting paths.
- Preserved no-file-access, no-transcription, no-transcoding, no-upload,
  no-cache, and no-media-only-progression boundaries.
- Recorded ADR 0855 and DR-927.

## Build session 0856: Local bundle asset evidence handoff

- Added a per-asset evidence handoff panel covering rights, checksum, scan,
  target mapping, and accessibility.
- Extended the shared local manifest contract so offline-ready assets require
  passed scans and reviewed mappings, with alt-text evidence for images.
- Added runtime rejection coverage for incomplete offline image evidence.
- Preserved no-upload, no-file-read, no-copy, no-publish, no-cache,
  no-offline-activation, and no-student-promotion boundaries.
- Recorded ADR 0856 and DR-928.

## Build session 0857: Shared local bundle asset evidence evaluator

- Moved asset handoff readiness rules into the shared content-model package.
- Kept rights, checksum, scan, target mapping, accessibility, and overall
  handoff status separately observable.
- Added runtime coverage for complete audio and incomplete video/image cases.
- Made the browser handoff panel consume the shared evaluator.
- Recorded ADR 0857 and DR-929.

## Build session 0858: Local bundle accessibility readiness parity

- Made offline-ready manifest validation enforce transcript evidence for audio
  and poster plus transcript/caption evidence for video.
- Added package-level asset blocker aggregation so review surfaces cannot hide
  a per-asset accessibility blocker behind an aggregate count.
- Added runtime rejection coverage for incomplete audio and video evidence.
- Preserved planning warnings and all no-upload, no-copy, no-activation, and
  no-student-promotion boundaries.
- Recorded ADR 0858 and DR-930.

## Build session 0859: Local bundle snapshot asset gate

- Included shared asset-evidence blockers in the machine-readable companion
  package snapshot.
- Prevented `offline_ready_allowed` from becoming true while any declared
  asset remains blocked.
- Added static coverage for the snapshot gate and recorded ADR 0859 and
  DR-931.

## Build session 0860: Review-only local bundle handoff packet

- Added a shared provider-neutral handoff packet for tenant, bundle, manifest,
  asset, route, release, and side-effect evidence.
- Preserved explicit package-write, offline-activation, student-promotion, and
  hosted-redirect-mutation blockers.
- Added runtime validation for review-only identity and fail-closed offline
  readiness, and surfaced the packet in both local companion previews.
- Recorded ADR 0860 and DR-932.

## Build session 0861: Local bundle handoff storage alignment

- Aligned the provider-neutral local companion handoff schema, migration
  candidate, and migration spec with the shared review-only packet.
- Preserved packet checks and explicit package-write, offline-activation,
  student-promotion, and hosted-redirect-mutation blockers.
- Added a drift verifier across all three backend planning layers.
- Recorded ADR 0861 and DR-933.

## Build session 0862: Local bundle persistence admission preview

- Joined local handoff evidence to the provider-neutral persistence handoff
  through a typed review-only admission preview.
- Added local companion handoff and release-gate records to the canonical
  tenant-bound persistence category list.
- Added runtime coverage for valid coverage and blocked durable-write paths.
- Recorded ADR 0862 and DR-934.

## Build session 0863: Local bundle handoff review access

- Added tenant-, bundle-, and packet-scoped teacher-review access for future
  local handoff records.
- Reused the existing signed teacher persistence authorization seam.
- Kept the endpoint read-only and fail-closed with no provider records.
- Recorded ADR 0863 and DR-935.

## Build session 0864: Local bundle provider mapping

- Added a shared local handoff record shape and pure packet-to-record mapper.
- Added an explicit unconfigured provider adapter so the protected review route
  has one replaceable ownership boundary and never reads storage directly.
- Derived blocked counts from packet checks and handoff items while preserving
  tenant, bundle, package, and packet identity.
- Added focused runtime and static verification and recorded ADR 0864 and
  DR-936.

## Build session 0865: Local provider approval evidence

- Added a review-only provider approval packet for retention, export, backup,
  restore, safe fallback, tenant isolation, and data exclusion.
- Added a teacher persistence-workbench panel so provider readiness is visible
  without selecting a vendor or enabling live storage.
- Preserved explicit provider-activation, package-write, student-promotion,
  and learner-data-export blockers.
- Added runtime/static verification and recorded ADR 0865 and DR-937.

## Build session 0866: Local bundle recovery packet

- Added a provider-neutral recovery packet for backup, restore, export, and
  retention evidence beneath the provider approval boundary.
- Required SHA-256 manifest evidence, restore rehearsal and rollback
  references, cross-tenant restore blocking, and explicit data exclusions.
- Surfaced the packet in the teacher persistence workbench without enabling
  backup, restore, export, package writes, student promotion, or route mutation.
- Added runtime/static verification and recorded ADR 0866 and DR-938.

## Build session 0867: Local recovery evidence reconciliation

- Reconciled provider-approval and recovery packets through a shared
  provider-neutral content-model contract.
- Added explicit aligned, needs-evidence, and mismatch states for identity,
  open evidence, and validation drift.
- Surfaced unresolved checks and lanes in the teacher persistence workbench
  while preserving `sideEffect: "none"` and all execution blockers.
- Added runtime/static verification and recorded ADR 0867 and DR-939.

## Build session 0868: Local export and retention dry-run

- Added a provider-neutral classification contract for future local package
  export and retention behavior.
- Classified reviewed package metadata, policy-required learner progress, and
  excluded raw learner audio, transcripts, and credentials.
- Surfaced the classification in the teacher persistence workbench while
  keeping file copy, export, deletion, package writes, and route mutation
  blocked.
- Added runtime/static verification and recorded ADR 0868 and DR-940.

## Build session 0869: Local package manifest and rollback dry-run

- Added a tenant-scoped package manifest preview for content, media, routes,
  games, and reporting artifacts.
- Added versioned fallback and rollback impact coverage for QR, content,
  media, games, reports, and learner progress.
- Enforced safe relative paths, checksum-state visibility, stable QR fallback,
  and blocked activation/mutation/deletion behavior.
- Added runtime/static verification and recorded ADR 0869 and DR-941.

## Build session 0870: Local media evidence binding

- Bound package media entries to tenant, bundle, package version, and manifest
  identity.
- Added rights, checksum, scan, target-mapping, transcript/caption, poster,
  and alt-text evidence fields for audio, video, and image assets.
- Preserved explicit review-stage blockers for upload, copy, activation,
  promotion, package writes, and QR mutation.
- Added runtime/static verification and recorded ADR 0870 and DR-942.

## Build session 0871: Local media manifest reconciliation

- Added provider-neutral reconciliation between the versioned local package
  manifest and individual media evidence entries.
- Distinguished aligned identity, open evidence, and manifest/path drift while
  preserving tenant and package-version boundaries.
- Kept media copy, package writes, local activation, student promotion, and QR
  mutation blocked in every reconciliation state.
- Added runtime/static verification and recorded ADR 0871 and DR-943.

## Build session 0872: Media release-control binding

- Connected media manifest reconciliation to the existing teacher release-control
  route through a provider-neutral review binding.
- Distinguished package/tenant mismatch, open media evidence, and evidence
  ready for human release review.
- Kept publish, package write, local activation, student-facing use, media
  release, and QR mutation blocked with required approvals visible.
- Added runtime/static verification and recorded ADR 0872 and DR-944.

## Build session 0873: Release-control to pilot launch handoff

- Propagated media release-control evidence into the publisher pilot readiness
  summary and classroom launch gate.
- Preserved mismatch, review, approval, persistence, policy, roster, and
  dry-run blockers without adding any live launch behavior.
- Added static verification and recorded ADR 0873 and DR-945.

## Build session 0874: Shared release-control policy and pilot evidence

- Added one provider-neutral release-control evidence contract derived from
  the existing media binding.
- Required the pilot handoff package and school-policy acceptance preflight to
  consume the same binding identity, decision, blockers, approvals, and
  review-only flags.
- Preserved no acceptance, upload, storage, launch, assignment, export, or
  release-state mutation behavior.
- Added runtime/static verification and recorded ADR 0874 and DR-946.

## Build session 0875: Release-control acceptance-record chain

- Carried the exact shared release-control evidence from school policy
  preflight through the policy text pack into the future acceptance-record
  preview.
- Surfaced the binding identity, decision, and blockers without creating an
  acceptance, signature, storage, export, launch, or release mutation path.
- Added static verification and recorded ADR 0875 and DR-947.

## Build session 0876: Release-control revocation and rollback chain

- Carried the exact release-control evidence from the acceptance-record
  preview through the revocation/rollback plan into the impact matrix.
- Preserved review-only boundaries for revocation, rollback, QR changes,
  learner-data deletion, media replacement, local deactivation, entitlement
  changes, and classroom shutdown.
- Added static verification and recorded ADR 0876 and DR-948.

## Build session 0877: Release-control safe-fallback chain

- Carried exact release-control evidence from rollback impact review through
  safe-fallback planning, fallback preflight, activation preview, and
  restoration preview.
- Preserved no QR mutation, notification, media replacement, local
  deactivation, learner-data, assignment, classroom shutdown, activation,
  restoration, or release-state behavior.
- Added static verification and recorded ADR 0877 and DR-949.

## Build session 0891: Persistence provider conformance

- Added payload-aware idempotency shared by rehearsal memory and SQLite.
- Fixed SQLite replay reads to preserve the stored idempotency key.
- Added temporary-data checks for replay, conflict, tenant isolation, and
  restart durability without enabling live writes.
- Recorded ADR 0891 and DR-963.

## Build session 0892: Frozen Phaser provenance verifier identity

- Moved the frozen snapshot and commit identity used by the read-only Phaser
  evidence verifier into the shared content-model identity module.
- Preserved isolated path hashing and the fail-closed boundary against source
  import, wrapper approval, promotion, and student assignment.
- Recorded ADR 0892 and DR-964.

## Build session 0893: Canonical Memory Match accessibility state

- Exposed Memory Match card state through semantic button state and moved
  learner feedback into a polite live region.
- Kept the pairing engine as the only owner of selection, scoring, persistence,
  completion, and progression.
- Recorded ADR 0893 and DR-965.

## Build session 0894: Shared AppShell skip navigation

- Added a tenant-themed keyboard skip link and a programmatically focusable
  main-content target to the shared shell.
- Preserved route, scoring, persistence, reward, and progression behavior.
- Recorded ADR 0894 and DR-966.

## Build session 0895: Shared audio playback status

- Added stable status relationships for ready, playing, and unavailable states
  to the reviewed-audio and speech-fallback controls.
- Preserved tap-to-speak behavior and kept audio status informational only.
- Recorded ADR 0895 and DR-967.

## Build session 0896: AppShell current route navigation

- Centralized current-route semantics in a reusable tenant navigation component.
- Marked only the most-specific matching route with `aria-current="page"` and
  retained tenant-configured active styling.
- Recorded ADR 0896 and DR-968.

## Build session 0897: Audio label interaction boundary

- Separated the Type Answer speakable instruction from the native input label.
- Added an explicit `aria-labelledby` relationship while preserving audio and
  keeping submit, scoring, persistence, reward, and progression ownership in
  the game flow.
- Recorded ADR 0897 and DR-969.

## Build session 0898: App shell hydration boundary

- Suppressed route-dependent active navigation state during the server and
  first client render.
- Restored the most-specific `aria-current="page"` state after hydration.
- Kept the boundary presentation-only and preserved routing, scoring,
  persistence, reward, and progression ownership elsewhere.
- Recorded ADR 0898 and DR-970.

## Build session 0899: Locale-independent content matching

- Replaced locale-sensitive content normalization with deterministic matching
  for vocabulary and reviewed learning audio.
- Replaced locale-sensitive metadata collation in browser evidence fingerprints
  with ordinal key ordering.
- Preserved display localization while keeping identity, coverage, and evidence
  stable across white-label tenant locales.
- Recorded ADR 0899 and DR-971.

## Build session 0900: Tenant-scoped browser evidence key

- Scoped browser rehearsal evidence by tenant, package, launch, and
  student-session identity.
- Added embedded-record validation and teacher-panel lookup parity.
- Versioned the local evidence contract so old launch-only keys are stale
  rather than silently reused.
- Recorded ADR 0900 and DR-972.

## Build session 0901: Canonical-identity browser evidence contents

- Expanded browser rehearsal evidence to a v4 key containing tenant, package,
  launch, unit, and student-session identity.
- Rejected progression snapshots and event batches whose unit, launch,
  student-session, or tenant metadata does not match the active session.
- Treated pre-v4 local records as stale without migration or hosted writes.
- Recorded the hardening in DR-973 while retaining the review-only persistence
  boundary.

## Build session 0902: Non-blank browser evidence identity

- Replaced primitive string checks with non-blank identity validation for
  browser evidence, progression, and event records.
- Preserved the v4 tenant/package/unit/launch/student-session boundary and
  review-only persistence semantics.
- Recorded ADR 0902 and DR-974.

## Build session 0903: Browser evidence runtime harness

- Added an executable temporary-storage harness for valid reads, tenant
  isolation, mixed-event rejection without mutation, and malformed identity
  rejection.
- Added the harness to foundation composition so the evidence boundary is
  tested behaviorally on every full gate.
- Recorded ADR 0903 and DR-975.

## Build session 0904: Browser evidence write boundary

- Applied the complete v4 evidence validator inside the shared localStorage
  write helper, protecting direct save callers as well as append callers.
- Added runtime coverage proving malformed direct saves do not write evidence.
- Recorded ADR 0904 and DR-976.

## Build session 0905: Memory Match audio event order

- Recorded `round_shown` before the first term-level `audio_requested` event in
  the canonical Memory Match interaction.
- Kept learning audio support-only and preserved platform-owned scoring,
  progression, persistence, and reporting.
- Added a canonical integration regression check and recorded ADR 0905 and
  DR-977.

## Build session 0906: Pairing audio event order

- Applied the round-before-audio replay rule to both canonical pairing modes:
  Memory Match and Match Up.
- Extended the integration verifier to guard both pairing handlers.
- Recorded ADR 0906 and DR-978 without changing Phaser source or route
  ownership.

## Build session 0907: Audio round replay boundary

- Lifted the round-before-audio rule into the shared canonical event validator.
- Applied the same rule to the isolated Phaser candidate-package verifier and
  added negative replay coverage for audio appearing before a round.
- Recorded ADR 0907 and DR-979; external source remains isolated.

## Build session 0908: Closed audio replay boundary

- Closed canonical and Phaser candidate game replays at `game_completed`.
- Rejected late `audio_requested` evidence so teacher reports cannot attach
  completion-review audio to a finished game attempt.
- Added native and candidate negative replay coverage and recorded ADR 0908
  and DR-980.

## Build session 0909: Audio mastery boundary

- Closed active learning-audio evidence at `mastery_updated`, before final
  `game_completed` recording.
- Applied the same rule to the shared validator and isolated Phaser candidate
  package verifier.
- Added native and candidate negative replay coverage and recorded ADR 0909
  and DR-981.

## Build session 0910: Hosted progress event evidence

- Added a shared persistence contract for completed canonical event streams,
  separate from progression continuity snapshots.
- Added tenant/launch/student-session scoped SQLite storage and a provider
  seam for non-durable rehearsal versus durable-managed operation.
- Added an authorization- and policy-gated API boundary with no-store reads;
  raw learner audio and transcripts remain excluded.
- Added static contract verification and recorded ADR 0910 and DR-982.

## Build session 0911: Tenant-bound taxonomy resolution

- Moved hosted event persistence taxonomy authority behind an explicit
  tenant/package resolver.
- Blocked unknown tenant/package bindings instead of applying a global or
  MiniStar fallback.
- Recorded ADR 0911 and DR-983; the sample registry remains a review-stage
  binding until real publisher package registration is approved.

## Build session 0912: Event record shape boundary

- Added shared record-shape validation for persisted canonical event streams,
  including canonical completion identity and privacy flags.
- Added a lower SQLite storage guard so malformed event records cannot be
  inserted by a future non-route caller.
- Recorded ADR 0912 and DR-984.

## Build session 0913: Teacher launch-scoped event review

- Added a provider-neutral `listEventStreams` contract for one tenant,
  reviewed package, and classroom launch.
- Added the teacher-only API path that lists only records which pass the
  tenant-bound taxonomy validator; exact student continuity reads remain
  unchanged.
- Added process-memory and SQLite parity checks for list scope, tenant
  isolation, ordering, and restart durability.
- Recorded ADR 0913 and DR-985.

## Build session 0914: Teacher event review panel

- Connected the teacher session route to the launch-scoped event review API.
- Added a client panel with explicit protected, blocked, unavailable, empty,
  and available states.
- Kept the rendered view pseudonymous and summary-only; raw event objects,
  learner audio, and transcripts remain outside the UI boundary.
- Rechecks after an authorized teacher operations session changes.
- Recorded ADR 0914 and DR-986.

## Build session 0915: Teacher review authorization handoff

- Placed the existing tenant-scoped teacher operations session control on the
  teacher launch monitor before event review is attempted.
- Clarified that the review session covers metadata and bounded launch review
  only; it cannot control gameplay, expose raw learner media, or write
  persistence.
- Reused the existing session-change event so the review panel refreshes after
  sign-in or sign-out without creating a second authorization path.

## Build session 0916: Teacher launch report aggregation

- Added a shared deterministic aggregation contract over validated,
  launch-scoped event streams.
- Replaced raw session identifiers in the teacher review surface with stable
  pseudonymous learner slots and summary metrics.
- Preserved separate progress-affecting, report-only, and support-only counts;
  raw audio and transcripts remain excluded.
- Kept export, mutation, live launch, and broad student discovery blocked.
- Added the dedicated aggregation verification gate and recorded ADR 0916 and
  DR-988.

## Build session 0917: Report package aggregation integration

- Added the bounded hosted review panel to both tenant-aware report-package
  preview routes through the resolved monitor context.
- Kept the static report-package rehearsal visible as a separate preview layer.
- Reused the existing teacher operations authorization and preserved all
  protected, blocked, unavailable, empty, and export-blocked states.
- Added route-level verification coverage and recorded ADR 0917 and DR-989.

## Build session 0918: Provider-neutral report package snapshot

- Added the shared report-package snapshot contract for hosted-managed and
  local-classroom deployment modes.
- Required the snapshot in the review-only report persistence request.
- Preserved tenant/package/launch identity, event acceptance, envelope-gate,
  privacy, and no-side-effect invariants.
- Kept provider activation, writes, and exports blocked.
- Recorded ADR 0918 and DR-990.

## Build session 0919: Provider-neutral report snapshot recovery

- Added a shared recovery packet for sanitized teacher report snapshots across
  hosted-managed and local-classroom deployment modes.
- Added deterministic fingerprint validation and fail-closed scope checks.
- Added a review-only adapter that rehearses validation without backup,
  restore, export, or provider writes.
- Kept raw events, learner audio, transcripts, and real learner identifiers
  outside the packet.
- Recorded ADR 0919 and DR-991.

## Build session 0920: Report snapshot recovery review surface

- Reused the tenant-aware report snapshot builder for the teacher persistence
  workbench and report-package preview.
- Added side-by-side hosted-managed and closed-local recovery rehearsal cards.
- Kept provider activation, backup, restore, export, writes, and raw learner
  data blocked and visibly separate from evidence validity.
- Added route-level report runtime verification and recorded ADR 0920 and
  DR-992.

## Build session 0921: Local companion report snapshot parity

- Added the shared report snapshot recovery rehearsal to MiniStar and sample
  publisher local companion previews.
- Resolved each local preview from its tenant-aware monitor context.
- Kept local file writes, recovery execution, export, and package activation
  blocked.
- Added route assertions and recorded ADR 0921 and DR-993.

## Build session 0922: Reporting workbench recovery coverage

- Added the shared recovery rehearsal to the teacher reporting workbench for
  MiniStar and the sample publisher contexts.
- Kept package and launch identity independently resolved per tenant.
- Added route-level assertions and recorded ADR 0922 and DR-994.

## Build session 0923: Pilot handoff report snapshot evidence

- Added sanitized report snapshot evidence to the partner pilot handoff
  contract for hosted-managed and local-classroom rehearsal modes.
- Preserved tenant, package, launch, deployment, fingerprint, and recovery
  validity evidence without importing raw learner event data.
- Kept export, writes, provider activation, and classroom launch blocked.
- Removed the pilot fixture dependency cycle introduced by the first evidence
  integration and verified the full active route surface.
- Recorded ADR 0923 and DR-995.

## Build session 0924: Pilot handoff snapshot scope integrity

- Added fail-closed validation for report snapshot id scope and fingerprint
  namespace inside the shared pilot handoff contract.
- Added negative runtime coverage for launch-scope drift and unverified
  fingerprints.
- Preserved hosted/local evidence-only behavior and all persistence, export,
  recovery, privacy, and classroom-launch blocks.
- Recorded ADR 0924 and DR-996.

## Build session 0925: Hosted persistence opt-in deployment gate

- Added one read-only deployment-gate result for hosted persistence.
- Kept process-memory rehearsal distinct from SQLite durable-managed mode.
- Required explicit write approval, session boundaries, school policy,
  retention, release approval, and operations readiness before durable status
  can be ready.
- Added persistence readiness tests and teacher workbench visibility without
  exposing secrets, learner records, raw audio, or transcripts.
- Recorded ADR 0925 and DR-997.

## Build session 0926: Multilingual media language role

- Added explicit target, assist, and neutral language roles for policy-bound
  audio and video assets.
- Target media must match the package target language and assist media must
  match a configured assist language.
- Preserved language-neutral image review through labelled-diagram,
  accessibility, and target-language audio contracts.
- Recorded ADR 0936 and DR-1008.

## Build session 0927: Media language role review surface

- Added media language and language-role evidence to teacher media-rights and
  media-library previews.
- Added the same requirement to upload-channel readiness so intake and review
  use one language-role rule.
- Kept upload, storage, release, playlist, assignment, and progression
  behavior blocked from the review surface.
- Corrected FR-009 so the verified Memory Match evidence-only Z.ai handoff is
  visible as open while direct integration remains blocked.
- Recorded ADR 0937 and DR-1009.
## Build session 0928: Japanese target-tenant preview boundary

- Added a teacher-only Japanese target-language tenant preview to make the
  white-label opportunity concrete without registering an unfinished student
  route.
- Kept Japanese package creation, target audio, script policy, segmentation,
  speech activities, and assignment blocked until review evidence exists.
- Added a dedicated verifier and recorded ADR-0938 / DR-1010.

## Build session 0929: reusable edition QR resolver

- Extracted QR parsing and alias matching from the preview page into a
  reusable, tenant-scoped resolver.
- Added fail-closed handling for duplicate keys and malformed encoded values.
- Kept direct file, development-host, and production redirect mutation blocked.
- Recorded ADR-0939 / DR-1011 and added a focused resolver verifier.
- Wired the resolver verifier into the foundation composition gate so future
  full verification checks malformed-input and tenant-isolation behavior.

## Build session 0930: Pilot review decision persistence boundary

- Added the provider-neutral `pilot-review-decision` durable record category.
- Added equivalent hosted and closed-local adapter intents with activation
  blocked in both modes.
- Added the persistence workbench record map and contract verifier.
- Recorded ADR 0947 and DR-1019.

## Build session 0931: Pilot review decision snapshot

- Added a versioned, fingerprinted snapshot contract for hosted/local review
  continuity.
- Preserved tenant, package, decision, privacy, and no-side-effect checks.
- Added workbench visibility and a focused snapshot verifier.
- Recorded ADR 0948 and DR-1020.

## Build session 0932: Pilot review decision adapter rehearsal

- Added one review-only adapter for validate, write, restore, and export
  requests.
- Preserved tenant/package/mode identity checks and explicit no-side-effect
  results.
- Added hosted/local adapter rehearsal results to the persistence workbench.
- Recorded ADR 0949 and DR-1021.

## Build session 0933: Pilot review decision runtime verification

- Added executable TypeScript-compiled rehearsal for the snapshot adapter.
- Covered valid review-only behavior, wrong-tenant access, fingerprint
  tampering, activation blocking, and no-side-effect results.
- Recorded ADR 0950 and DR-1022.

## Build session 0934: Pilot review decision retention policy

- Added tenant/package-bound retention, deletion, audit, and school-policy
  requirements for future snapshot persistence.
- Kept the sample policy review-only with snapshot writes, restore, export, and
  activation blocked.
- Added policy visibility to the persistence workbench and a foundation
  verifier.
- Recorded ADR 0951 and DR-1023.

## Build session 0935: Provider-neutral implementation readiness

- Added a tenant/package-bound handoff reconciling snapshot, adapter,
  retention, audit, and school-policy evidence.
- Kept provider selection, implementation, writes, restore, export, and
  activation blocked in the foundation sample.
- Added persistence workbench visibility and a foundation verifier.
- Recorded ADR 0952 and DR-1024.

## Build session 0936: Persistence provider selection preflight

- Joined the backend decision matrix, evidence-storage adapter gate, and
  provider-neutral implementation handoff into one comparison preflight.
- Kept provider selection, provider-specific implementation, migration, writes,
  and activation blocked.
- Added hosted, closed-local, and hybrid candidate evidence with cost posture,
  white-label fit, and unresolved risks.
- Recorded ADR 0953 and DR-1025.

## Build session 0937: Frozen Phaser integration eligibility

- Added one eligibility handoff for the frozen Memory Match and Balloon Pop
  candidates.
- Bound provenance to canonical route, parent engine, scoring profile, and
  payload/event/audio/scoring/persistence/replay/accessibility evidence.
- Kept import, wrapper approval, route replacement, scene scoring, persistence,
  promotion, and assignment blocked.
- Recorded ADR 0954 and DR-1026.

## Build session 0938: Human external evidence handoff

- Verified the five recorded frozen Phaser source hashes against the tagged
  snapshot.
- Bound the Memory Match evidence-only request to its complete candidate
  eligibility record and all 11 evidence lanes.
- Kept integration, wrapper approval, route replacement, scoring, persistence,
  promotion, and assignment blocked.
- Recorded ADR 0955 and DR-1027.

## Build session 0939: Phaser candidate evidence return preflight

- Added a provider-neutral return packet between the human Z.ai request and
  any future Codex integration proposal.
- Required all eleven evidence lanes and the nine named return artifacts.
- Added checksummed artifact references, positive review-only coverage, and
  negative behavior coverage for unknown artifacts, missing checksums,
  incomplete lanes, and mutable source identity.
- Kept source import, route replacement, scoring, persistence, promotion, QR
  activation, and student assignment blocked.
- Recorded ADR 0956 and DR-1028.

## Build session 0940: Phaser candidate evidence adjudication

- Added an owner-bound state machine after evidence return: awaiting external
  return, returned awaiting Codex review, and blocked.
- Mounted the state on the teacher game-readiness workbench.
- Kept wrapper execution, integration approval, route writes, source import,
  scoring, persistence, promotion, QR activation, and assignment blocked.
- Recorded ADR 0957 and DR-1029.

## Build session 0941: White-label release readiness

- Added a tenant- and package-bound readiness contract with eight required
  phases and seven quality signals.
- Added a blocked Sample Publisher readiness sample and teacher dashboard.
- Kept production approval, student launch, provider activation, QR mutation,
  package promotion, and public publishing disabled.
- Added route verification and a focused composition verifier.
- Recorded ADR 0958 and DR-1030.

## Build session 0942: White-label package evidence reconciliation

- Bound Sample Publisher release readiness to the existing package-readiness
  reconciliation.
- Added checksum, lane coverage, unresolved lane, promotion, and student
  activation fields to the shared contract.
- Added dashboard visibility for reconciliation identity and unresolved lanes.
- Preserved the no-promotion and no-student-activation boundary.
- Added executable rejection coverage for package mismatch, checksum
  tampering, lane-count drift, false-ready status, activation, and promotion.
- Closed the false-ready loophole so unresolved package lanes prevent
  `pilot-ready` status at the shared model boundary.
- Recorded ADR 0959 and DR-1031.

## Build session 0943: White-label controlled pilot decision binding

- Added pilot decision identity, handoff routes, evidence bindings, blocker
  count, and launch/data/report permissions to the shared release contract.
- Bound the Sample Publisher dashboard to the existing pilot review decision.
- Added visible pilot blockers while keeping live launch and learner data
  disabled.
- Added tenant and blocker-count negative-path verification.
- Recorded ADR 0960 and DR-1032.

## Build session 0944: White-label quality evidence records

- Added seven typed quality evidence records to the shared release contract.
- Bound each record to its quality boolean, source record, timestamp, and
  review notes.
- Displayed evidence sources beside quality signals on the dashboard.
- Added negative-path tests for missing and contradictory evidence.
- Recorded ADR 0961 and DR-1033.

## Build session 0945: White-label release-control evidence binding

- Added typed release-control evidence joining the package publish gate and
  approval ledger to the release-readiness record.
- Derived blocking-gate and open-approval counts from authoritative sample
  records instead of duplicating them by hand.
- Displayed the control source records and kept promotion and student-facing
  activation blocked.
- Added negative-path verification for package mismatch and false-ready
  release-control evidence.
- Recorded ADR 0962 and DR-1034.

## Build session 0946: Persistence Provider Selection Evidence

- Added typed cross-source selection evidence to the provider-neutral
  persistence preflight.
- Bound the sample to the backend matrix, pilot selection gate, and
  implementation-readiness handoff.
- Displayed deployment fit, cost posture, open criteria, and source records on
  the teacher persistence route.
- Added negative-path verification for package drift, matrix drift, false-ready
  evidence, and insufficient source records.
- Promoted the behavior verifier into foundation composition.
- Recorded ADR 0963 and DR-1035.

## Build session 0947: Persistence Provider Selection Criterion Reconciliation

- Added unique criterion, status, and owner evidence to the shared provider
  selection preflight.
- Derived and validated the open-criteria count from the criterion snapshot.
- Required deployment fit and cost posture to match the recommended candidate.
- Displayed the criterion snapshot on the teacher persistence workbench.
- Added negative-path checks for criterion-count and candidate-cost drift.
- Recorded ADR 0964 and DR-1036.

## Build session 0948: Active Route Count Source of Truth

- Aligned current route verifiers, dashboards, checklists, and intake evidence
  from 88 to the authoritative 89 active routes.
- Preserved historical build notes as historical records.
- Added the deployment decision workbench verifier to foundation composition.
- Recorded ADR 0965 and DR-1037.

## Build session 0949: White-label route and deployment evidence

- Bound active route evidence to the white-label release-readiness contract.
- Reconciled active and expected route counts against the current 89-entry
  route matrix.
- Named the active-route verifier and deployment decision guide in the packet.
- Added a teacher-facing route/deployment evidence card while preserving the
  review-only boundary.
- Added negative-path checks for route-count drift and non-review deployment
  status.
- Recorded ADR 0966 and DR-1038.

## Build session 0950: Release evidence workbench map

- Added a review-only handoff map from release readiness to game, persistence,
  partner-requirements, and content-intake evidence routes.
- Kept storage activation, external game import, package publication, and
  student launch blocked.
- Recorded the next human handoff for the isolated Memory Match evidence
  package.

## Build session 0951: Tenant-supplied release review links

- Removed the sample publisher requirements route from the reusable release
  readiness panel.
- Added a page-supplied review-link contract so each tenant can own its scoped
  requirements route.
- Preserved review-only navigation and all storage, promotion, import, QR,
  and student-launch blockers.
- Recorded ADR 0967 and DR-1039.

## Build session 0952: White-label evidence tenant binding

- Added explicit tenant identities to package and release-control evidence
  records in the shared readiness contract.
- Rejected cross-tenant package and approval evidence even when package ids or
  control ids are otherwise shaped correctly.
- Added behavior coverage for both tenant-mismatch paths.
- Recorded ADR 0968 and DR-1040.

## Build session 0953: White-label route evidence binding

- Added explicit tenant and package identities to route/deployment evidence.
- Rejected route evidence from another tenant or package even when the active
  route counts reconcile.
- Added negative-path behavior coverage for route tenant and package drift.
- Recorded ADR 0969 and DR-1041.

## Build session 0954: White-label pilot-ready quality gate

- Required every quality signal to be true before a readiness record can claim
  `pilot-ready`.
- Required every quality evidence record to be verified for that status.
- Added a negative-path test for false pilot readiness with a failed browser
  signal.
- Recorded ADR 0970 and DR-1042.

## Build session 0955: White-label nested readiness consistency

- Required `pilot-ready` records to carry review-only package evidence and
  pilot-ready, blocker-free pilot evidence.
- Added a negative-path test for contradictory nested pilot status.
- Recorded ADR 0971 and DR-1043.

## Build session 0956: Route evidence scope display

- Displayed the route-evidence tenant and package bindings beside active and
  expected route counts in the release-readiness workbench.
- Kept the route/deployment card review-only and activation-disabled.

## Build session 0957: White-label quality evidence binding

- Added tenant and package identities to every quality evidence record.
- Rejected typecheck, build, route, runtime, browser, privacy, or tenant-isolation
  evidence from another tenant or package even when the boolean result is green.
- Added negative-path behavior coverage for both quality identity mismatches.
- Kept the readiness contract review-only and activation-disabled.
- Recorded ADR 0972 and DR-1044.

## Build session 0958: White-label quality evidence scope display

- Displayed the quality evidence tenant and package bindings in the release
  readiness workbench.
- Synchronized the dedicated white-label release-readiness standard with the
  same identity and visible-scope requirements.
- Kept source checks, production approval, persistence, promotion, and student
  launch review-only and activation-disabled.
- Recorded ADR 0973 and DR-1045.

## Build session 0959: White-label nested evidence scope display

- Displayed tenant and package bindings in the package, pilot, and
  release-control evidence cards.
- Kept nested evidence review-only and all promotion, persistence, and student
  launch actions activation-disabled.
- Recorded ADR 0974 and DR-1046.

## Build session 0960: White-label pilot evidence binding integrity

- Rejected duplicate pilot evidence bindings.
- Rejected blank or non-string pilot evidence bindings instead of silently
  filtering them into a green-looking packet.
- Added behavior coverage for both malformed binding paths.
- Recorded ADR 0975 and DR-1047.

## Build session 0961: Pilot decision snapshot binding integrity

- Aligned the canonical pilot review decision validator with the release
  readiness validator for duplicate and malformed evidence bindings.
- Added snapshot-runtime coverage before a review decision can be persisted as
  a provider-neutral rehearsal record.
- Recorded ADR 0976 and DR-1048.

## Build session 0962: Pilot decision list integrity

- Rejected blank or duplicate blocker entries in canonical pilot decisions and
  white-label readiness evidence.
- Rejected blank or duplicate required-next-step entries in canonical pilot
  decisions.
- Added snapshot and readiness behavior coverage for the malformed lists.
- Recorded ADR 0977 and DR-1049.

## Build session 0963: Pilot handoff blocker-list integrity

- Rejected blank or duplicate persistence-gate blockers.
- Rejected blank or duplicate activation-preflight blockers.
- Rejected duplicate handoff notes so the review packet cannot repeat one
  explanation as multiple evidence items.
- Added runtime behavior coverage and recorded ADR 0978 and DR-1050.

## Build session 0977: Fail-closed sample launch resolution

- Removed tenant fallback behavior from the sample launch resolver.
- Only exact reviewed MiniStar and sample-publisher launch codes are accepted.
- Unknown or guessed `partner-*` codes now fail closed rather than inheriting
  another tenant's content, audio, progression, or report context.
- Recorded the route-boundary decision in ADR 0991 and DR-1063.
- Added a dedicated `verify:sample-launch-boundary` check and made unknown
  paths return not-found rather than a server error.

## Build session 0978: Tenant-scoped front-door registry integrity

- Added a fail-closed registry validator for reviewed front-door routes.
- Rejected duplicate route IDs, paths, and active tenants.
- Bound each route's tenant to its content package, access policy, launch
  session, progression state, and permanent QR path.
- Kept the registry static and review-only; no route or QR mutation was added.
- Added `verify:front-door-route-boundary` and passed the web typecheck.
- Recorded ADR 0992 and DR-1064.

## Build session 0979: Durable QR alias and rollback runtime contract

- Added a shared provider-neutral QR alias runtime contract.
- Added tenant, package, release, fallback, previous-release, and rollback
  evidence fields with safe internal-path validation.
- Added a review-only QR alias adapter with explicit no-mutation behavior.
- Added sample rollback evidence and a dedicated foundation verification gate.
- Kept hosted redirects, route writes, local activation, learner-data changes,
  and rollback execution blocked.
- Recorded ADR 0993 and DR-1065.

## Build session 0980: QR alias backend contract alignment

- Extended the route-alias schema draft with printed identity, release
  lineage, safe target/fallback, rollback evidence, and mutation-block fields.
- Updated the route-alias migration candidate and migration spec to carry the
  same contract and prerequisites.
- Added a schema/candidate/spec alignment verifier to the foundation gate.
- Kept database migration, route writes, QR redirects, package swaps, local
  activation, and rollback execution disabled.
- Recorded DR-1066 and the next backend implementation remains gated by
  provider and release decisions.

## Build session 0981: QR preview runtime consumption

- Connected the reviewed QR preview route to the shared review-only alias
  runtime adapter.
- Displayed current/previous release evidence and the explicit no-mutation
  decision beside the preview target.
- Added a route integration guard that rejects redirect mutation behavior.
- Kept production QR redirects, route writes, package swaps, and rollback
  execution blocked.

## Build session 0982: Printed QR binding preview

- Connected the printable worksheet preview to the shared review-only QR alias
  runtime adapter.
- Added complete textbook identity detection with a safe front-door fallback
  when the identity is incomplete.
- Displayed QR identity, target, fallback, release decision, and no-side-effect
  evidence before long-lived textbook printing.
- Kept QR image generation, alias writes, redirect mutation, package swaps,
  local activation, and rollback execution blocked.
- Recorded ADR 0996 and DR-1068.

## Build session 0983: Explicit pilot deployment decision record

- Added a tenant- and package-bound pilot deployment decision contract.
- Kept the hosted PWA as a cost-efficient recommendation while leaving the
  actual deployment selection unset for human school or publisher review.
- Displayed hosted, local, and packaged options beside blockers and evidence
  bindings on the pilot route.
- Kept persistence activation, classroom launch, provider migration, package
  promotion, QR mutation, and report export blocked.
- Recorded ADR 0997 and DR-1069.

## Build session 0984: Pilot policy lineage binding

- Bound the pilot deployment decision to the existing tenant school-policy
  acceptance preflight and future acceptance-record preview identities.
- Displayed the policy lineage beside deployment options so a deployment
  recommendation cannot be mistaken for policy acceptance.
- Kept the policy status `not-accepted` and preserved the no-persistence,
  no-classroom-launch, no-report-export, no-QR-mutation, and no-promotion
  boundary.
- Added negative-path validation for altered policy status or missing lineage.
- Recorded ADR 0998 and DR-1070.

## Build session 0985: Persistence activation lineage binding

- Bound pilot handoff activation evidence to the explicit deployment decision,
  school-policy acceptance preflight, and future acceptance-record preview.
- Displayed those identities in the teacher handoff packet so durable-write
  review cannot rely on generic policy or provider booleans alone.
- Preserved `not-accepted`, unselected deployment posture, and `canActivate:
  false` in the sample handoff.
- Added contract verification for missing or altered policy lineage.
- Recorded ADR 0999 and DR-1071.

## Build session 0986: Pilot lineage reconciliation

- Added a shared content-model validator that resolves activation evidence
  against the exact deployment decision, policy preflight, and acceptance
  preview sources.
- Rejected mismatched tenant/package scope, altered ids, status drift, and
  accepted-looking source records while preserving review-only behavior.
- Mounted the sample result on the pilot and foundation intake routes and
  added runtime plus focused contract verification.
- Recorded ADR 1000 and DR-1072.

## Build session 0987: Source-to-draft import preview

- Added an identity-bound, review-only bridge from source package assembly and
  extraction evidence to a teacher draft preview.
- Kept draft creation, storage write, student payload, assignment, and package
  promotion explicitly blocked.
- Added runtime binding tests, static verification, intake-route visibility,
  and the standing source-draft verification note.

## Build session 0988: Teacher draft persistence admission preflight

- Added a provider-neutral admission contract for future tenant-owned teacher draft persistence.
- Bound the preflight to the exact teacher draft and source-to-draft import preview identities.
- Made owner identity, private tenant visibility, source lineage, rights/audio, policy, retention, export, and rollback evidence explicit.
- Kept all writes, uploads, assignment, promotion, raw source binary, learner audio, and transcript storage blocked.
- Added teacher-only evidence UI, runtime checks, and static verification.
- Recorded ADR 1074 and DR-1074.

## Build session 0989: Teacher owner and school-policy binding

- Reconciled the draft persistence preflight with existing teacher review authorization and school-policy acceptance previews.
- Kept teacher authorization and school acceptance separate; neither can satisfy the other.
- Preserved `not-accepted`, review-only, persistence-blocked, assignment-blocked, and signature-blocked states.
- Added runtime identity/flag checks, teacher-only UI, and verification documentation.
- Recorded ADR 1075 and DR-1075.

## Build session 0990: Teacher draft acceptance readiness

- Reconciled the future acceptance-record preview with draft ownership, retention, export, recovery, rollback, and activation evidence.
- Kept policy acceptance, retention acceptance, exports, deletion, recovery execution, rollback, signatures, persistence activation, and assignment blocked.
- Preserved raw learner audio and transcript exclusion in the acceptance-readiness boundary.
- Added runtime identity/flag checks, teacher-only evidence UI, and verification documentation.
- Recorded ADR 1076 and DR-1076.

## Build session 0991: Teacher draft persistence implementation readiness

- Added a provider-neutral work-order packet for the future teacher draft persistence adapter.
- Defined acceptance tests for tenant isolation, source lineage, owner/policy binding, idempotency, media exclusion, lifecycle controls, hosted/local parity, recovery, and assignment guards.
- Kept provider selection, implementation, migration, writes, uploads, live test execution, route mutation, assignment, and promotion blocked.
- Added a persistence workbench panel, runtime assertions, and standing verification documentation.
- Recorded ADR 1077 and DR-1077.

## Build session 0992: Teacher draft persistence implementation storage contract

- Added a dedicated tenant-bound persistence record for the provider-neutral implementation-readiness packet.
- Mirrored the same policy-required boundary in hosted and local adapter write plans.
- Added backend schema, migration candidate, and migration specification entries for the nine acceptance tests.
- Kept provider selection, implementation, migration, live writes, uploads, route mutation, live test execution, assignment promotion, provider credentials, raw learner audio, and learner transcripts blocked.
- Recorded ADR 1078 and DR-1078.

## Build session 0993: Teacher draft persistence runtime regression

- Added runtime coverage for a valid persistence-readiness record and hosted adapter intent.
- Added negative regressions for provider-selection and assignment-promotion guard weakening.
- Kept all persistence behavior review-only with no database, upload, route, migration, or assignment execution.
- Recorded ADR 1079 and DR-1079.

## Build session 0994: JSON request boundary hardening

- Added one shared request reader for persistence progression, event, student-session, and teacher-session JSON writes.
- Required `application/json`, measured UTF-8 bytes, and bounded progression/event bodies at 128 KiB and session bodies at 8 KiB.
- Added deterministic boundary verification and preserved all provider, tenant authorization, and durable-write gates.
- Recorded ADR 1080 and DR-1080.

## Build session 0995: Same-origin mutation boundary

- Added exact `Origin` matching for student-session, teacher-session, progression, and event POST routes.
- Kept the bearer-token exception explicit and limited to persistence server-to-server writes.
- Added verifier coverage and preserved provider, tenant, policy, and durable-write gates.
- Recorded ADR 1081 and DR-1081.

## Build session 0996: Web security header baseline

- Added global MIME, referrer, framing, and browser-capability headers to the Next web configuration.
- Preserved microphone support for the app origin while disabling camera and geolocation.
- Kept CSP and cross-origin embedding deferred until tenant media/CDN policy is modeled.
- Recorded ADR 1082 and DR-1082.

## Build session 0997: Session claim input and time hardening

- Bounded student launch identity fields before route resolution and signed-cookie creation.
- Rejected future-issued, expired, and inverted student/teacher signed-session claims.
- Added persistence authorization verifier coverage without changing tenant, policy, or deployment gates.
- Recorded ADR 1083 and DR-1083.

## Build session 0998: Session sign-out origin hardening

- Bound student and teacher session-cookie deletion to the same exact-origin mutation policy as session issuance.
- Added persistence authorization verifier coverage for both sign-out routes.
- Preserved fail-closed cookie clearing, tenant authorization, and deployment gates.
- Recorded ADR 1084 and DR-1084.
- The regression remains review-only and performs no database, upload, route, migration, or assignment operation.

## Build session 0999: Persistence read-scope query hardening

- Added shared bounded query helpers for tenant, package, launch, session, handoff, and operation-history inputs.
- Applied fail-closed query limits to progression, event, status, local-handoff, and operation-evidence reads.
- Kept teacher/student authorization and review-only persistence gates unchanged.
- Recorded ADR 1085 and DR-1085.

## Build session 1000: Signed session cookie shape hardening

- Bounded student and teacher signed-cookie values before payload parsing.
- Rejected extra signature segments and structurally invalid claim types or lengths.
- Preserved temporal, tenant, authorization, and deployment checks.
- Recorded ADR 1086 and DR-1086.

## Build session 1001: Signed session creation symmetry

- Applied the same bounded shape, time-window ordering, and cookie-size checks when creating student and teacher signed sessions.
- Prevented internal callers from minting malformed claims even when route validation is bypassed.
- Added verifier coverage without changing tenant, policy, or persistence activation behavior.
- Recorded ADR 1087 and DR-1087.

## Build session 1002: Session lifetime bounds

- Capped student signed sessions at 24 hours and teacher review sessions at 12 hours.
- Applied the cap to configured TTLs, creator validation, and reader validation.
- Preserved shorter tenant/operator-configured windows and all existing authorization gates.
- Recorded ADR 1088 and DR-1088.

## Build session 1003: Session cookie emission bounds

- Bounded emitted student and teacher `Max-Age` values to the corresponding session lifetime caps.
- Invalid expiration timestamps now fail closed by emitting `Max-Age=0` rather than `NaN` or an unbounded value.
- Preserved HttpOnly, SameSite, Path, Secure, tenant, and deployment gates.
- Recorded ADR 1089 and DR-1089.

## Build session 1004: Session cookie emission runtime regression

- Added executable coverage for actual student and teacher `Set-Cookie` output.
- Verified secure attributes, numeric bounded `Max-Age`, and invalid-expiry fail-closed behavior.
- Wired the regression into the persistence runtime gate and preserved the full foundation gate.
- Recorded ADR 1090 and DR-1090.

## Build session 1005: Session secret strength policy

- Added one shared server-session secret policy requiring at least 32 UTF-8 bytes.
- Applied the policy consistently to student creation/reading, teacher creation/reading, and persistence deployment readiness.
- Added runtime coverage proving weak secrets fail and strong secrets pass.
- Recorded ADR 1091 and DR-1091.

The web workspace enables `allowImportingTsExtensions` because the executable
Node verifier loads the same TypeScript server modules directly; the option is
compatible with the workspace's no-emit typecheck and production bundling.

## Build session 1006: Session secret rollover

- Added one bounded previous-secret slot for student and teacher session verification.
- New sessions always use the current strong secret; the previous strong secret is accepted only for validation during rotation.
- Weak previous values are ignored, duplicate keys are removed, and no third rollover slot is supported.
- Recorded ADR 1092 and DR-1092.

## Build session 1007: Local bundle resolution delivery status

- Added explicit `planning` and `offline-ready` status to read-only local QR
  and asset resolutions.
- Kept planning previews visibly rehearsal-only so a future consumer cannot
  mistake manifest lookup for playable offline delivery.
- Added runtime coverage for planning and evidence-complete status behavior.
- Preserved all no-file-access, no-cache, no-bundle-write, no-offline-activation,
  and no-learner-data boundaries.
- Recorded ADR 1093 and DR-1093.

## Build session 1008: Asset runtime input hardening

- Hardened the shared review-only asset validator against malformed runtime
  objects, unsupported state values, unsafe or oversized identity, MIME type,
  unit-key, and checksum input.
- Added executable regressions covering the new fail-closed behavior.
- Preserved the no-upload, no-copy, no-storage, no-promotion, and no-learner-
  media boundary.
- Recorded ADR 1094 and DR-1094.

## Build session 1009: Source runtime input hardening

- Hardened the shared review-only source validator against malformed runtime
  objects, unsupported document/extraction/review states, unsafe or oversized
  tenant/source/package identity, and oversized checksums.
- Added executable regressions covering the new fail-closed behavior.
- Preserved the no-source-write, no-OCR-promotion, no-draft, no-assignment,
  and no-student-payload boundary.
- Recorded ADR 1095 and DR-1095.

## Build session 1010: AI service runtime regression

- Added compiled runtime coverage for the review-only AI authoring service.
- Verified 8-12 vocabulary terms, exactly two target structures, duplicate
  rejection, target/support language boundaries, evidence, audio, rights, cost,
  teacher review, and no-provider-dispatch behavior.
- Wired the runtime regression into `npm run verify:ai-service` and preserved
  the no-model, no-billing, no-package-write, no-route, no-assignment boundary.
- Recorded ADR 1096 and DR-1096.

## Build session 1011: Persistence provider conformance gate

- Promoted process-memory/SQLite provider conformance into the mandatory
  persistence runtime gate.
- Added standalone script names for provider conformance and progress-event
  persistence so failures remain diagnosable without running the full suite.
- Verified idempotency, conflicts, tenant isolation, event-stream privacy, and
  SQLite restart durability with temporary synthetic data only.
- Preserved the no-anonymous-write, no-hosted-credential, and no-production-
  rollout boundaries.
- Recorded ADR 1097 and DR-1097.

## Build session 1012: Multimedia delivery locator safety

- Hardened hosted/local media source resolution before audio or video elements
  receive a locator.
- Added runtime coverage for preferred-mode selection, safe fallback, protocol
  rejection, credential rejection, traversal, backslash, control-character,
  and oversized path handling.
- Preserved separate rights, release, autoplay, and media-only progression
  gates; missing demo media remains unavailable rather than simulated.
- Recorded ADR 1098 and DR-1098.

## Build session 1013: Persistence payload shape bounds

- Added shared fail-closed limits for persistence event identifiers,
  metadata, event-stream length, continuity routes, and progression mode lists.
- Applied the rules to event envelopes, hosted continuity envelopes, client
  write requests, and persisted event-stream records so the boundary is not
  dependent on one HTTP route or one provider.
- Added runtime regressions for oversized metadata, oversized event streams,
  oversized continuity routes, and oversized progression mode lists.
- Preserved provider-neutral behavior, tenant binding, target-language
  progression authority, no-raw-audio persistence, and no-live-rollout gates.
- Recorded ADR 1099 and DR-1099.

## Build session 1014: External candidate manifest boundary

- Hardened returned Z.ai/Phaser package manifests against oversized or
  control-character metadata, excessive artifact paths, artifact counts, and
  blocked-action lists.
- Added runtime regressions proving malformed candidate metadata remains
  rejected before evidence alignment or integration review.
- Confirmed the two local frozen snapshots are source context only because
  neither contains `evidence/return-package.json`.
- Preserved quarantine: no archive import, source copy, app patch, route
  replacement, scoring mutation, persistence ownership, promotion, or student
  assignment.
- Recorded ADR 1100 and DR-1100.

## Build session 1015: External candidate operator input

- Added a fail-closed diagnostic for literal placeholder paths such as
  `<returned-package-folder>` and `path/to/...` before filesystem resolution.
- Added verifier contract and behavior coverage proving the diagnostic does
  not create folders, manifests, source copies, or review state.
- Preserved the requirement for a real isolated returned package containing
  `evidence/return-package.json`; frozen source remains quarantine-only.
- Recorded ADR 1101 and DR-1101.

## Build session 1016: External candidate read budget

- Added pre-read size limits for the returned manifest and reviewed evidence
  artifacts before JSON parsing, text validation, or checksum hashing.
- Added contract and behavior coverage for oversized return manifests while
  retaining the isolated-root and review-only boundaries.
- Preserved quarantine: external artifacts remain evidence only and cannot be
  copied, executed, promoted, assigned, or used to mutate the platform.
- Recorded ADR 1102 and DR-1102.

## Build session 1017: Source intake file boundary

- Bound source-runtime intake to an explicit MIME type and positive byte
  length before extraction or draft decisions.
- Added source-type MIME compatibility and a shared 50 MiB review ceiling,
  with runtime regressions for incompatible MIME and oversized sources.
- Preserved review-only behavior: no file storage, extraction execution, draft
  creation, package promotion, assignment, or raw-source student payload.
- Recorded ADR 1103 and DR-1103.

## Build session 1018: Asset intake file boundary

- Bound asset-runtime intake to MIME types compatible with image, audio, video,
  font, and source-document kinds.
- Required positive integer byte lengths and added a shared 256 MiB platform
  ceiling; tenant size-budget policy remains a separate, potentially stricter
  gate.
- Added runtime regressions for kind/MIME mismatch and oversized assets while
  preserving checksum, scan, rights, mapping, release, and learner-media
  exclusions.
- Preserved review-only behavior: no upload adapter, storage write, media
  transform, promotion, or student-facing asset activation was enabled.
- Recorded ADR 1104 and DR-1104.

## Build session 1019: Asset evidence binding

- Added a shared asset evidence packet contract that binds validated file
  metadata, tenant scope, source lineage, asset identity, checksum, and
  review status.
- Connected representative Labelled Diagram and media evidence flows to the
  packet so teachers can see the metadata boundary before future storage work.
- Preserved metadata-first review behavior: no raw file bytes, upload, storage,
  download, playlist, game-manifest, promotion, or assignment side effect was
  enabled.
- Added runtime coverage for valid packets, tenant mismatch rejection, and
  normalization of blocked side effects.
- Recorded ADR 1105 and DR-1105.

## Build session 1020: Asset manifest release preview

- Added a provider-neutral manifest preview for game-asset, media-manifest, and
  source-document targets.
- Derived target mapping, rights, accessibility, release-control, and
  persistence blockers from the validated evidence packet.
- Connected manifest previews to the teacher Labelled Diagram and media
  evidence surfaces.
- Defined evidence-ready as release-review readiness only; manifest writes,
  storage, promotion, downloads, playlist/game binding, and student-facing use
  remain blocked.
- Added runtime coverage for derivation, preview validation, and mutation
  rejection. Recorded ADR 1106 and DR-1106.

## Build session 1021: Asset manifest release-control binding

- Reconciled manifest previews with provider-neutral release-control evidence.
- Added hosted, local, and hybrid deployment intent plus deployment-policy,
  hosted-storage, local-bundle, approval, and release blockers.
- Connected the binding to teacher evidence surfaces so activation readiness is
  visible without implying storage, folder activation, promotion, QR mutation,
  or student-facing use.
- Added runtime coverage for blocked release decisions and mutation rejection.
- Recorded ADR 1107 and DR-1107.

## Build session 1022: Cross-deployment persistence recovery rehearsal

- Added a provider-neutral continuity contract joining provider-selection
  preflight, persistence implementation handoff, and local recovery evidence.
- Compared hosted-managed, closed-local, and hybrid paths using the same
  tenant/package scope and required backup, restore, export, retention,
  rollback, tenant-isolation, and raw learner-data exclusion checks.
- Connected the rehearsal to the teacher persistence workbench so open evidence
  and blocked actions are visible before provider selection or storage work.
- Kept provider selection, persistence writes, backup, restore, export,
  package promotion, QR/route mutation, and student-facing activation blocked.
- Added compiled runtime validation and route verification coverage. Recorded
  ADR 1108 and DR-1108.

## Build session 1023: Deployment continuity decision

- Bound the hosted PWA, local classroom server, and packaged companion product
  paths to the provider-neutral persistence recovery rehearsal.
- Added path-level recovery modes, evidence bindings, and continuity blockers
  to the deployment decision workbench.
- Kept recommendations separate from selection and blocked policy acceptance,
  provider selection, persistence activation, classroom launch, offline-ready
  status, installer export, and route mutation.
- Added compiled runtime validation and route verification coverage. Recorded
  ADR 1109 and DR-1109.

## Build session 1024: Commercial deployment handoff packet

- Added a tenant- and package-bound handoff contract for hosted PWA, local
  classroom server, and packaged companion review artifacts.
- Bound each artifact to continuity evidence and explicit deliverables so a
  school or publisher can compare saleable paths without a hidden activation
  shortcut.
- Kept provider selection, export, installation, persistence activation,
  classroom launch, and QR/route mutation blocked.
- Added compiled runtime validation and active-route coverage. Recorded ADR
  1110 and DR-1110.

## Build session 1025: Deployment handoff release-readiness binding

- Bound the commercial deployment handoff to the tenant/package-scoped
  white-label release-readiness identity and status.
- Propagated unresolved release-phase blockers, including browser, privacy,
  and tenant-isolation evidence, into each review artifact.
- Kept recommendations, export, installation, activation, and route mutation
  separate from release approval.
- Added runtime coverage for blocked release-readiness input. Recorded ADR
  1111 and DR-1111.

## Build session 1026: Deployment handoff identity reconciliation

- Added explicit release-readiness tenant and package identities to the
  commercial deployment handoff and its review surface.
- Added mismatch blockers so cross-tenant or cross-package evidence cannot be
  accepted because an ID or display label is merely non-empty.
- Kept identity reconciliation evidence-only; provider selection, persistence,
  installation, promotion, QR mutation, and student launch remain blocked.
- Added runtime coverage for a mismatched release-readiness tenant and package
  scope. Recorded ADR 1112 and DR-1112.

## Build session 1027: White-label quality evidence basis

- Added check-specific evidence kinds and non-empty unique scopes to all seven
  white-label release quality records.
- Distinguished command, route-sweep, browser-rehearsal, privacy-negative-test,
  and tenant-negative-test evidence so one green signal cannot impersonate
  another required gate.
- Added focused negative coverage for mislabeled browser evidence and missing
  tenant-isolation scope. Recorded ADR 1113 and DR-1113.
- Kept all release, persistence, export, installation, provider, and student
  launch permissions disabled.

## Build session 1028: White-label verification run lineage

- Added run-level verification lineage to the white-label release-readiness
  packet: a verification run identifier and the revision under review.
- Exposed both values on the adult review surface so a stale green evidence
  packet cannot silently appear current after code, content, or source changes.
- Added negative coverage for missing run and revision lineage.
- Kept the feature evidence-only; release, persistence, export, installation,
  provider activation, QR mutation, and student launch remain blocked. Recorded
  ADR 1114 and DR-1114.

## Build session 1029: White-label evidence freshness

- Added a deterministic seven-day freshness policy for release quality
  observations.
- Future-dated and stale observations are rejected against the packet's
  explicit `verificationReferenceAt`; browser or system time is not read by
  the contract.
- Exposed the review-only freshness policy on the adult release-readiness
  surface and added focused negative coverage.
- Kept release, persistence, export, installation, provider activation, QR
  mutation, and student launch blocked. Recorded ADR 1115 and DR-1115.

## Build session 1030: White-label browser evidence integrity

- Added an explicit browser evidence mode: coded rehearsal, browser
  automation, or human observation.
- Kept the current sample honestly blocked with coded rehearsal evidence and
  rejected coded-only browser evidence for a future pilot-ready packet.
- Added focused negative coverage and kept all release, persistence, export,
  installation, provider activation, QR mutation, and student launch paths
  blocked. Recorded ADR 1116 and DR-1116.

## Build session 1031: Browser rehearsal observation receipt

- Added a structured observation receipt for future human-observed or
  browser-automated evidence.
- Bound the receipt to tenant, package, launch, unit, student session, route
  paths, check ids, reviewer role, and observation time.
- Rejected role drift, tenant drift, duplicate routes, and any promotion or
  student-launch flag. Recorded ADR 1117 and DR-1117.

## Build session 1032: Teacher observation capture

- Added an explicit teacher action to record a human-observed browser receipt
  from the bound local rehearsal evidence panel.
- Stored the receipt in a separate browser-local key with tenant, package,
  launch, unit, and student-session isolation; malformed or promotion-enabled
  receipts are hidden on read.
- Kept the action review-only: it performs no hosted write, export, assignment,
  QR mutation, release promotion, or student production launch.
- Added runtime coverage for valid local storage, cross-tenant lookup
  isolation, and promotion drift. Recorded ADR 1118 and DR-1118.

## Build session 1033: Observation review handoff preview

- Added a shared provider-neutral handoff derived from a validated teacher
  observation receipt, preserving route paths, check ids, tenant identity, and
  the original student-session scope.
- Exposed the handoff preview on the teacher session surface with its adult
  review destination, blocked actions, and next adjudication gate.
- Kept handoff derivation review-only; it does not export, persist to a hosted
  provider, promote a release, mutate QR routes, assign work, or launch
  students. Recorded ADR 1119 and DR-1119.

## Build session 1034: Release-readiness observation bridge

- Added a read-only browser evidence adjudication panel to the white-label
  release-readiness route.
- The panel reads only the exact tenant, package, launch, unit, and student
  session key, then derives the existing review-only observation handoff.
- Missing receipts link the adult reviewer to the teacher observation surface;
  present receipts show scope and blocked actions without changing readiness,
  exporting data, writing hosted persistence, or enabling release. Recorded ADR
  1120 and DR-1120.

## Build session 1035: Adult observation adjudication record

- Added a tenant, package, launch, unit, student-session, and handoff-bound
  adjudication contract for explicit adult review decisions.
- Added a browser-local store and release-readiness controls for `accepted for
  next review gate` or `blocked`, requiring a reviewer reference and note.
- Kept adjudication review-only: it cannot become release approval, promotion,
  hosted persistence, evidence export, QR mutation, assignment, or student
  launch. Recorded ADR 1121 and DR-1121.

## Build session 1036: Observation-to-pilot decision binding

- Added a provider-neutral binding preview that carries the exact browser
  handoff and adult adjudication identity into the controlled pilot board.
- Distinguished awaiting adjudication, accepted-for-pilot-review, and
  blocked-by-adjudication without changing the canonical pilot decision.
- Kept pilot launch, learner data collection, reporting, package promotion,
  export, and hosted persistence blocked. Recorded ADR 1122 and DR-1122.

## Build session 1037: Browser, privacy, and tenant evidence packet

- Added one exact-scope review packet for browser continuity, privacy-negative,
  and tenant-isolation evidence.
- Required lane-specific evidence kinds and negative-check ids, and rejected
  tenant drift or pending evidence presented as passed.
- Added the pending packet to the teacher pilot board without enabling hosted
  writes, learner-data collection, export, promotion, QR mutation, or student
  launch. Recorded ADR 1123 and DR-1123.

## Build session 1038: Observation-to-composite evidence derivation

- Connected the validated teacher browser observation to the composite
  browser/privacy/tenant packet on the teacher session monitor.
- Advanced only the browser lane from explicit route-continuity and
  student-to-teacher-handoff checks; privacy and tenant-isolation remain
  pending until their own negative checks are recorded.
- Kept hosted writes, learner-data collection, export, promotion, QR mutation,
  and student launch blocked. Recorded ADR 1124 and DR-1124.

## Build session 1039: Explicit negative evidence capture boundary

- Added explicit teacher-triggered capture for privacy-negative and
  tenant-isolation evidence in the exact local rehearsal scope.
- Added local storage keyed by tenant, package, launch, unit, student session,
  and observation identity, with fail-closed handling for malformed records,
  cross-tenant reads, and promotion drift.
- Kept hosted writes, learner-data collection, export, promotion, QR mutation,
  assignment, and classroom launch blocked. Recorded ADR 1125 and DR-1125.

## Build session 1040: Composite evidence adjudication

- Added a local exact-scope adjudication record and teacher review surface for
  the composite browser/privacy/tenant packet.
- Allowed blocked decisions while evidence is incomplete, but rejected
  acceptance until all three lanes pass together.
- Kept hosted writes, student-data collection, export, promotion, QR mutation,
  and student production launch blocked. Recorded ADR 1126 and DR-1126.

## Build session 1041: Composite evidence pilot binding

- Added the composite evidence-to-pilot binding and connected it to the teacher
  pilot review surface.
- Preserved awaiting, blocked, and accepted-for-pilot-review states without
  changing canonical pilot approval.
- Kept pilot launch, student-data collection, report export, package
  promotion, QR mutation, and hosted persistence blocked. Recorded ADR 1127
  and DR-1127.

## Build session 1042: Composite evidence release binding

- Added the composite evidence-to-release binding and connected it to the
  white-label release-readiness route.
- Preserved awaiting, blocked, and accepted-for-release-review states without
  turning evidence into production approval.
- Kept production approval, student launch, package promotion, hosted
  persistence, and QR mutation blocked. Recorded ADR 1128 and DR-1128.

## Build session 1043: Release-control evidence reconciliation

- Connected the composite evidence release binding to the tenant-scoped pilot
  release-control route as well as the release-readiness dashboard.
- Required the release-control route to expose packet, adjudication, and
  production-approval state from the same tenant/package-scoped evidence
  chain; route verification now guards that connection.
- Kept release publication, assignment activation, local bundle release,
  student-ready status, hosted persistence, and QR mutation blocked. Recorded
  ADR 1129 and DR-1129.

## Build session 1044: Human approval gate on release control

- Connected the review-only reviewer identity and signature gate to the
  tenant-scoped release-control decision room.
- Made the prerequisites for any future human approval visible alongside the
  composite evidence and approval ledger without creating signature capture,
  audit writes, or a release action.
- Kept approval capture, packet freeze, release mutation, assignment
  activation, evidence download, and student launch blocked. Recorded ADR 1130
  and DR-1130.

## Build session 1045: Controlled-pilot approval readiness

- Added one tenant/package-scoped readiness contract joining composite release
  evidence, the controlled pilot decision, and reviewer identity/signature
  prerequisites.
- Distinguished evidence, release-control, reviewer-gate, and future human
  review states without treating readiness as approval.
- Kept approval capture, release mutation, assignment activation, student
  launch, and hosted writes blocked. Recorded ADR 1131 and DR-1131.

## Build session 1046: Controlled-pilot human review packet

- Added an exact-scope, review-only human review packet carrying readiness,
  release binding, pilot decision, and reviewer-gate references together.
- Added explicit not-captured, not-frozen, and not-released invariants so a
  future approval workflow cannot infer permission from packet presence.
- Kept approval intent, signed approval, packet freeze, release mutation,
  assignment activation, and student launch blocked. Recorded ADR 1132 and
  DR-1132.

## Build session 1047: Quarantine-first upload intake

- Added a content-model contract for tenant-scoped PDF/text, image,
  audio/music, and video quarantine intake.
- Added an explicitly disabled-by-default multipart endpoint with same-origin
  or service-token authorization, bounded MIME/size checks, SHA-256 metadata,
  and tenant-scoped quarantine storage.
- Kept scan, rights, source review, target mapping, promotion, student-facing
  use, learner media, download, playlist, assignment, QR, and local-bundle
  activation blocked. Recorded ADR 1133 and DR-1133.

## Build session 1048: Quarantine metadata review read path

- Added a tenant-authorized, read-only review contract for quarantine records.
- The review path returns validated metadata, payload presence, review state,
  and explicit blockers while withholding raw payloads, filesystem paths,
  download URLs, malformed records, and cross-tenant records.
- Kept scan, rights, source review, mapping, promotion, student-facing use,
  playlist, game, assignment, QR, and local-bundle mutations blocked. Recorded
  ADR 1134 and DR-1134.

## Build session 1049: Quarantine evidence admission preview

- Added a provider-neutral admission preview comparing quarantine records with
  scan, rights, source, target mapping, accessibility, and release evidence.
- Distinguished `needs-review` from `evidence-ready` without treating either
  state as authorization or publication.
- Kept promotion, student-facing use, storage activation, package, playlist,
  game, assignment, QR, and local-bundle writes blocked. Recorded ADR 1135 and
  DR-1135.

## Build session 1050: Upload workspace admission evidence preview

- Connected the provider-neutral quarantine admission preview to the tenant
  upload workspace with representative incomplete and
  evidence-complete-for-review states.
- Made the distinction visible to teachers: evidence completeness can prepare
  a human review handoff, but it cannot authorize promotion, storage
  activation, package release, assignment, QR mutation, or student use.
- Kept the preview side-effect-free and provider-neutral, with no file picker,
  approval action, file URL, or quarantine mutation. Recorded ADR 1136 and
  DR-1136.

## Build session 1051: Upload admission lineage into evidence handoff

- Added a canonical admission-binding contract carrying tenant, package,
  quarantine, admission, evidence-packet, decision, and blocker identity into
  the evidence handoff package.
- Connected the binding to the tenant evidence handoff preview so reviewers
  can trace upload evidence without treating handoff presence as approval,
  export permission, promotion, assignment, QR mutation, or student use.
- Reused the shared binding validator and verified the handoff scope, web and
  AI-service typechecks, full build, active routes, and foundation gates.
  Recorded ADR 1137 and DR-1137.

## Build session 1052: Evidence attachment storage handoff binding

- Added a provider-neutral storage readiness binding carrying tenant, package,
  readiness-plan, selection-gate, candidate, metadata, policy, and blocked
  action identity into the evidence handoff.
- Connected hosted, closed-local, and hybrid storage candidates to the
  handoff preview without creating a provider, bucket, folder, signed URL,
  retention clock, upload/download action, or release mutation.
- Reused shared validation, added route assertions, and kept the full
  foundation gate as the acceptance check. Recorded ADR 1138 and DR-1138.

## Build session 1053: Per-asset evidence packets in tenant handoff

- Added the existing metadata-only Labelled Diagram and media evidence
  packets to the tenant evidence handoff, with tenant and package identity
  validation at the content-model boundary.
- Exposed attachment-level kind, MIME, checksum, source packet, and blocked
  action evidence so reviewers can trace each image, audio, and video
  candidate without exposing bytes or URLs.
- Kept upload, storage, download, promotion, release mutation, assignment,
  and student-facing use blocked. Recorded ADR 1139 and DR-1139.

## Build session 1054: Attachment-to-storage reconciliation

- Added a provider-neutral reconciliation that joins every reviewed asset
  packet and attachment to the available hosted, closed-local, and hybrid
  storage candidates.
- Preserved unresolved policy gates for tenant selection, quarantine and
  scan retention, rights, deletion/export, backup, release control, and
  reviewer approval without choosing a destination.
- Kept per-asset storage selection, upload, download, promotion, release
  mutation, assignment, and student-facing use blocked. Recorded ADR 1140
  and DR-1140.

## Build session 1055: Policy-gated storage selection review

- Reused the provider-neutral persistence selection preflight inside the
  tenant evidence handoff as a storage selection review packet.
- Bound the review to the exact tenant, package, evidence storage gate, and
  implementation-readiness evidence, with hosted, closed-local, and hybrid
  comparison candidates visible together.
- Kept provider selection, migration, writes, activation, upload, download,
  signed URLs, retention clocks, and release mutation blocked pending human
  policy review. Added a runtime verifier and route/source assertions.
  Recorded ADR 1141 and DR-1141.

## Build session 1056: Deployment continuity storage review binding

- Bound the exact storage selection preflight and evidence-storage gate into
  deployment continuity decisions.
- Added visible deployment-workbench evidence for the storage review packet,
  while keeping provider selection, persistence activation, offline claims, QR
  mutation, and classroom launch blocked.
- Extended runtime, source, route, and deployment-workbench verification so a
  drifted or enabled storage selection cannot appear review-ready. Recorded ADR
  1142 and DR-1142.

## Build session 1057: Pilot handoff storage selection review binding

- Bound the exact storage-selection preflight and evidence-storage gate into
  the controlled pilot handoff.
- Added visible pilot evidence that no storage provider is selected and human
  policy review remains required.
- Extended runtime, source, route, persistence-preflight, and pilot-readiness
  checks so enabled or drifted storage state cannot pass pilot review.
- Kept hosted, closed-local, and hybrid comparison paths review-only and
  side-effect-free. Recorded ADR 1143 and DR-1143.

## Build session 1058: Controlled-pilot storage policy boundary

- Extended controlled-pilot approval readiness and the human-review packet with
  storage-selection preflight and evidence-storage gate identity.
- Added visible release-control evidence that storage policy remains required
  before human approval design.
- Preserved approval capture, packet freeze, persistence writes, activation,
  export, QR mutation, release mutation, assignment, and classroom launch
  blockers. Recorded ADR 1144 and DR-1144.

## Build session 1059: Pilot decision storage identity

- Extended the canonical pilot review decision and white-label release-readiness
  evidence with the exact storage-selection preflight and evidence-storage gate
  identities.
- Kept storage selection provider-neutral, blocked, and disallowed through the
  release dashboard and pilot decision surfaces.
- Added focused runtime and source verification for the identity chain.
- Recorded ADR 1145 and DR-1145.

## Build session 1060: Pilot review snapshot storage identity

- Made storage-selection preflight and evidence-storage gate identity explicit
  on provider-neutral pilot review snapshots.
- Added exact matching validation against the embedded pilot decision and a
  persistence-workbench view of the identities.
- Added storage drift verification and recorded ADR 1146 and DR-1146.

## Build session 1061: Provider implementation readiness storage identity

- Extended provider-implementation readiness with explicit storage preflight and
  evidence-storage gate identity.
- Added blocked/disallowed behavior verification and mounted the identity in the
  persistence handoff panel.
- Recorded ADR 1147 and DR-1147.

## Build session 1062: Teacher draft persistence storage identity

- Extended teacher-draft persistence implementation readiness with explicit
  storage preflight and evidence-storage gate identity.
- Added blocked/disallowed source reconciliation against provider comparison
  and pilot review readiness.
- Exposed the identity in the teacher-draft persistence handoff panel and
  recorded ADR 1148 and DR-1148.

## Build session 1063: Adapter write-intent storage identity

- Extended hosted and local teacher-draft persistence write intents with exact
  storage preflight and evidence-storage gate identity.
- Added blocked/disallowed behavior coverage for write-intent enablement and
  drift, and recorded ADR 1149 and DR-1149.

## Build session 1064: Durable record storage identity

- Extended the teacher-draft persistence implementation-readiness durable
  record with exact storage preflight and evidence-storage gate identity.
- Added blocked/disallowed validator and runtime coverage for missing and
  enabled durable-record storage state.
- Recorded ADR 1150 and DR-1150.

## Build session 1065: Recovery rehearsal storage identity

- Carried provider storage-selection identity into the cross-deployment
  recovery rehearsal.
- Added continuity drift blockers and runtime coverage while preserving all
  recovery and activation blockers.
- Recorded ADR 1151 and DR-1151.

## Build session 1066: Local recovery storage identity

- Bound local provider approval and recovery packets to shared storage
  selection identity.
- Added storage drift mismatch coverage while preserving local recovery
  blockers.
- Recorded ADR 1152 and DR-1152.

## Build session 1067: Local export and rollback storage identity

- Bound local export/retention and package rollback previews to shared storage
  selection identity.
- Added blocked/disallowed validation while preserving all no-execution
  boundaries.
- Recorded ADR 1153 and DR-1153.

## Build session 1068: Local media evidence storage identity

- Bound local media evidence bindings and manifest reconciliation to the exact
  storage-selection preflight and evidence-storage gate identity.
- Added storage-drift mismatch coverage and visible storage identity evidence
  while preserving media copy, package write, local activation, download, QR,
  and student-facing blockers.
- Recorded ADR 1154 and DR-1154.

## Build session 1069: Local media release-control storage identity

- Carried media storage-selection identity into the release-control binding.
- Made storage drift a blocking release decision and added negative coverage
  while preserving promotion, package-write, activation, and QR blockers.
- Recorded ADR 1155 and DR-1155.

## Build session 1070: Evidence attachment storage identity

- Bound evidence attachment storage reconciliation to the package storage
  preflight and evidence-storage gate identity.
- Added handoff mismatch checks, visible identity evidence, and focused
  negative coverage while preserving upload, download, promotion, activation,
  and release-mutation blockers.
- Recorded ADR 1156 and DR-1156.

## Build session 1071: Evidence storage handoff preflight identity

- Carried storage-selection preflight identity into the evidence storage
  handoff binding.
- Added package handoff drift validation while preserving all upload, download,
  promotion, activation, and release-mutation blockers.
- Recorded ADR 1157 and DR-1157.

## Build session 1072: Browser evidence pilot storage lineage

- Carried canonical storage-selection preflight and evidence-storage gate
  identity into composite browser/privacy/tenant pilot bindings and release
  review bindings.
- Added negative coverage for stale storage preflight and gate identity while
  preserving all pilot, persistence, student-data, promotion, and release
  blockers.
- Recorded ADR 1158 and DR-1158.

## Build session 1073: Controlled pilot storage reconciliation

- Reconciled provider-selection, canonical pilot-decision, and composite
  release-binding storage identity before controlled-pilot human-review
  eligibility.
- Added explicit release-control blockers and negative coverage for storage
  identity drift and enabled storage state.
- Recorded ADR 1159 and DR-1159.

## Build session 1074: Controlled pilot human-review evidence references

- Required human-review packets to include each authoritative readiness,
  release, pilot, reviewer, storage preflight, and storage gate identity.
- Added negative coverage for missing storage evidence references while
  preserving all approval, launch, freeze, and write blockers.
- Recorded ADR 1160 and DR-1160.

## Build session 1075: Deployment continuity handoff storage identity

- Exposed continuity storage preflight and evidence-storage gate identity on
  the hosted, local, and packaged deployment handoff artifact.
- Added focused negative coverage for missing storage evidence bindings while
  preserving export, installation, activation, route, persistence, and launch
  blockers.
- Recorded ADR 1161 and DR-1161.

## Build session 1076: Deployment continuity scope

- Reconciled recovery rehearsal tenant and package scope with the pilot
  deployment decision.
- Added hard-blocked negative coverage for tenant and package drift before
  hosted, local, or packaged continuity review.
- Recorded ADR 1162 and DR-1162.

## Build session 1077: Deployment handoff source reconciliation

- Added source-decision reconciliation for persisted deployment continuity
  handoffs, including tenant, package, storage preflight, and storage gate.
- Added focused negative coverage for stale source storage identity and made
  the identity visible on the teacher handoff panel.
- Recorded ADR 1163 and DR-1163.

## Build session 1078: Activation preflight scope

- Carried activation preflight tenant and package scope into deployment
  continuity handoffs.
- Added hard-blocked negative coverage for activation scope drift while
  preserving all activation, write, export, installation, route, and launch
  blockers.
- Recorded ADR 1164 and DR-1164.
