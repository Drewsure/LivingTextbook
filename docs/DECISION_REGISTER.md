# Living Textbook Decision Register

## DR-602: Complete Canonical Audio Coverage

Require matching audio for each canonical term and sentence. Distinct cue IDs repeating one text cannot satisfy coverage for other text. Alternate recordings and reordered cue lists remain valid. See `docs/decision-register/DR-602-complete-canonical-audio-coverage.md`.

This register is a standing gate for platform decisions. It exists to keep the Living Textbook build saleable, maintainable, and tenant-ready while still moving fast enough to remain cost efficient.

## DR-963: Persistence Provider Conformance

Require payload-aware idempotency and one conformance gate across process-memory
rehearsal and SQLite durability. Exact retries are idempotent; changed payloads
and cross-tenant key reuse are conflicts; tenant-scoped reads and SQLite restart
durability are verified with temporary data. Provider selection and live writes
remain separately gated.

Evidence: `scripts/verify-persistence-provider-conformance.mjs`, ADR 0891.

## DR-884: Hosted adapter read-path probe

The teacher persistence workbench may perform a read-only probe against the hosted progression rehearsal endpoint using a coded sample identity. The probe must never create a record, and all UI copy must distinguish endpoint availability from durable storage readiness.

## DR-882: Cross-route progression handoff

Student activity routes receive a tenant-scoped validated continuity envelope through session-scoped browser rehearsal storage. Exact destination and student identity are required; URL-encoded progression and support/media-only unlocks remain prohibited.

## DR-883: First hosted progression rehearsal adapter

The first hosted adapter is a process-local rehearsal endpoint with validation, idempotency, tenant checks, and explicit school-policy/non-durable write gates. It is not durable production storage.

The repo is the source of truth. Every major technical, product, AI-agent, game-engine, styling, infrastructure, or data decision should be checked here before implementation.

## DR-953: Pilot Preflight Persistence Binding

Controlled pilot preflight must consume the authoritative tenant-scoped
persistence status result before reporting `ready-for-review`. Missing status
is open; every non-healthy status is blocked; only explicit healthy status may
pass. Review readiness never authorizes classroom launch, durable writes,
storage activation, or release mutation. Evidence: ADR 0881,
`apps/web/src/features/persistence/pilotSessionPreflight.ts`, and
`scripts/verify-pilot-session-preflight-behavior.mjs`.

## DR-954: Pilot Preflight Tenant-Bound Readiness

Healthy pilot persistence evidence must match the evidence envelope tenant,
declare `durable-managed` durability, and include a valid ISO check timestamp.
Changing tenants clears the prior snapshot before the new read resolves.
Non-durable rehearsal and cross-tenant or malformed snapshots cannot pass;
review-only launch, write, activation, export, and release boundaries remain
blocked. Evidence: ADR 0882 and the pilot preflight verifier.

## DR-955: Pilot Preflight Readiness Freshness

Controlled pilot persistence readiness must use a tenant-bound status snapshot
that is no more than five minutes old and not future-dated. The rule is shared,
deterministic, and read-only; stale status cannot authorize launch, durable
writes, activation, export, or release mutation. Evidence: ADR 0883 and the
pilot preflight behavior verifier.

## DR-956: Pilot Status Refresh

Teacher pilot evidence panels refresh tenant-scoped persistence readiness every
minute while mounted, clear prior tenant state, ignore late unmounted results,
and clean up the timer. The check remains read-only and cannot authorize live
operation or mutation. Evidence: ADR 0884 and the pilot rehearsal verifier.

## DR-957: Phaser Snapshot Identity Normalization

Frozen Z.ai/Phaser review evidence uses the immutable
`frozen-2026-09-12-aaa-stable` tag everywhere and preserves the exact freeze
commit SHA separately. This removes provenance ambiguity without permitting
source import, wrapper approval, promotion, or assignment. Evidence: ADR 0885
and the candidate review/source-hash verifiers.

## DR-958: Phaser Source Identity Content-Model Gate

Candidate reviews and the Memory Match evidence handoff must use the shared
content-model identity gate for the approved frozen repository, snapshot tag,
and exact commit. Wrong-but-well-formed provenance fails closed before wrapper
review, import, route replacement, promotion, or assignment. Evidence: ADR
0886 and `packages/content-model/src/phaserCandidateSourceIdentity.ts`.

## DR-959: Phaser Returned-Package Identity Gate

Returned Phaser and hybrid package manifests must use the shared frozen-source
identity gate, while DOM-reference not-returned previews retain their separate
provider-neutral path. Identity drift fails closed before wrapper review,
import, route replacement, promotion, or assignment. Evidence: ADR 0887 and
`packages/content-model/src/aiPrototypeReturnedPackageManifest.ts`.

## DR-960: Returned Package Status Surface

Teacher review surfaces must derive returned-package status from the manifest
and show an exact Phaser/hybrid source commit when supplied. This changes only
operator visibility; it does not authorize import, wrapper approval,
promotion, launch, or assignment. Evidence: ADR 0888 and
`apps/web/src/features/content-intake/AiPrototypeReturnedPackageManifestPanel.tsx`.

## DR-961: Returned Package Request Lineage

Returned prototype packages must remain bound to one generation request from
intake queue through return checklist, manifest, and evidence alignment.
Queue/checklist request IDs are required, and manifest alignment rejects
mismatches against either reference. This remains a review-only boundary and
does not authorize source import, route creation, promotion, assignment, or
live AI dispatch. Evidence: ADR 0889 and
`packages/content-model/src/aiPrototypeReturnedPackageAlignment.ts`.

## DR-962: Evidence Bundle Returned Manifest Binding

Prototype evidence alignment must include and validate the returned-package
manifest that produced the evidence. Its tenant and generation request must
match the return review and downstream evidence, and duplicate manifest IDs
must be rejected. This remains evidence-only and cannot authorize import,
routes, promotion, assignment, or live AI dispatch. Evidence: ADR 0890 and
`packages/content-model/src/aiPrototypeEvidenceAlignment.ts`.

## Decision Rubric

Before accepting a new direction, answer these questions in the task, PR, or implementation note:

1. White-label impact: Does this make it easier or harder to sell the platform to schools, publishers, camps, or other brands?
2. Cost impact: Does this lower build and maintenance cost, or does it create a long-term bill in subscriptions, specialist skills, hosting, or refactoring?
3. Portability: Can we replace the vendor, model, theme, asset pack, or service later without rebuilding core learning flows?
4. Component boundary: Does this preserve reusable components, parent engines, and tenant configuration instead of one-off screens?
5. Student and classroom fit: Does this support teacher-led QR onboarding and student self-progression from day one?
6. Reward safety: Does this keep collection mechanics earned, mastery-driven, and parent-safe rather than pressure-based?
7. Phase fit: Is this structural foundation work, interaction polish, premium asset work, or a later optimization?
8. Verification path: Can we test, review, or demonstrate the decision cheaply before expanding it?

## Decision Statuses

- Proposed: Being considered, not yet used in product code.
- Accepted: Safe to build against.
- Trial: Allowed in a narrow vertical slice only.
- Rejected: Do not use unless the decision is reopened.
- Superseded: Replaced by a later decision.

## Active Decisions

| ID | Decision | Status | Summary |
| --- | --- | --- | --- |
| DR-001 | Tailwind and PostCSS foundation | Accepted | Use Tailwind through PostCSS for structural styling, but tenant branding must flow through configuration and CSS variables. |
| DR-002 | Tenant token styling boundary | Accepted | Shared UI primitives must read tenant tokens instead of hard-coding MiniStar or any future tenant palette. |
| DR-003 | No premium polish before structure | Accepted | Layout, routing, component names, data contracts, and scoring events come before micro-interactions, mascot evolution, and premium visual assets. |
| DR-004 | Earned collection mechanics | Accepted | Avatars, rooms, pets, cosmetics, titles, and Spin Wheel bonuses are rewards for mastery and effort, not purchase-like pressure loops. |
| DR-005 | Local progression before persistence | Accepted | Prove QR entry, flashcards, events, unlocks, and Star Dust locally before introducing database, auth, or live classroom complexity. |
| DR-006 | Deterministic starter reward catalog | Accepted | First rewards are transparent Star Dust thresholds, not chance-based mechanics, to prove earned collection safely and cheaply. |
| DR-007 | Permanent QR and local textbook companion mode | Accepted | Printed textbook QR codes must resolve stable identifiers/content packages for local or closed companion apps, with optional hosted redirect for long-lived external QR permanence. |
| DR-008 | Multimedia is core living-textbook content | Accepted | Audio, video, playlists, and optional background media belong in the initial content package model, not as later bolt-on pages. |
| DR-009 | Audio-first learner support | Accepted | Every learner-facing term, sentence, instruction, feedback item, and critical control must have audio support through cue-level metadata. |
| DR-010 | Research before reinvention | Accepted | Search public repositories, libraries, and asset sources before major custom systems, but require license, provenance, and integration review before adoption. |
| DR-011 | Bounded upper-level AI tutor | Accepted | Preserve AI Tutor as a curriculum-aware upper-level capability, but do not build it before the core platform slice is verified. |
| DR-012 | AI Tutor premium entitlement | Accepted | Treat AI Tutor as an optional premium package with tenant feature entitlements, usage limits, and clean disabled states. |
| DR-013 | Training Academy recovery metadata bridge | Trial | Count recovery events through `trainingEventType` metadata inside the existing progress stream before promoting dedicated event types. |
| DR-014 | Training Academy focus configs | Accepted | Recovery lanes are config-driven across vocabulary, sentence, listening, spelling, and mode-practice support instead of hard-coded screens. |
| DR-015 | Target-language entry gate | Accepted | Entry practice completion and next-game unlocks require target-language engagement; support language never satisfies mastery or unlock gates. |
| DR-016 | Premium voice tutor speech layer | Accepted | Preserve Vocal Image-style speech coaching as an optional, tenant-gated, replaceable premium capability without active model or microphone dependency in the foundation slice. |
| DR-488 | Package entitlement workbench route | Accepted | Keep optional paid AI generation, Voice Tutor, microphone scoring, storage/export, and local companion packages teacher/admin-controlled before billing or activation. |
| DR-489 | Package adoption readiness flow | Accepted | Premium package adoption must show adult approvals, records, cost review, policy review, blocked actions, and next steps before activation. |
| DR-490 | Package adoption record preview | Accepted | Premium package activation needs minimum accepted-record fields, evidence, scopes, blocked writes, and rollback hooks before implementation. |
| DR-491 | Package adoption record preview storage contract | Accepted | Premium package adoption previews must become backend-neutral hosted/local storage contracts before accepted adoption records, billing writes, model calls, microphone scoring, report exports, hosted storage, or local companion activation can exist. |
| DR-492 | Package adoption storage guard panel | Accepted | The entitlement workbench must show storage contracts, visible fields, required evidence, and blocked premium activations before any package adoption can be made real. |
| DR-493 | Release-control entitlement source gate | Accepted | Release-control workspaces must link to the entitlement workbench and keep premium package adoption, billing, microphone scoring, report export, and local companion activation blocked. |
| DR-494 | Z.ai prototype intake alert | Accepted | The game-readiness workbench must visibly say when Z.ai/outside prototype intake is not ready, what evidence will make it ready, and that Codex owns the alert and integration decision. |
| DR-495 | Prototype intake queue | Accepted | Game-readiness and prototype review workbenches must show ordered Z.ai/outside prototype inventory, missing evidence, tenant scope, and blocked actions before integration review. |
| DR-496 | Prototype intake queue storage contract | Accepted | Prototype intake queue items must have backend-neutral hosted/local storage contracts before outside game inventory can become return-review, wrapper-review, route, scoring, reward, playlist, package, or assignment work. |
| DR-497 | Prototype intake storage guard panel | Accepted | Game-readiness and prototype review workbenches must show the prototype intake storage contract, visible fields, evidence requirements, and blocked intake actions before any outside-game intake workflow exists. |
| DR-498 | Prototype intake evidence packet flow | Accepted | Outside game inventory must show source snapshot, fixture, event/scoring, audio, mobile/accessibility, and wrapper-boundary evidence packets before any controlled prototype review can advance. |
| DR-499 | Prototype intake readiness summary | Accepted | Game-readiness and prototype review workbenches must show that controlled Z.ai/outside prototype intake is not ready until queue, storage, evidence, returned package, replay reports, and Codex wrapper decision lanes are satisfied. |
| DR-500 | Prototype return package checklist | Accepted | Outside game work must return as a review evidence package with source archive manifest, reviewed fixture, events, scoring, audio, mobile, and wrapper notes before Codex considers wrapper review or integration. |
| DR-501 | Prototype return package checklist storage contract | Accepted | Returned prototype package checklists must have backend-neutral hosted/local storage contracts before returned evidence can become return-review, wrapper-review, route, scoring, reward, playlist, package, or assignment work. |
| DR-502 | Prototype return storage guard visibility | Accepted | Game-readiness and tenant prototype review workbenches must show prototype return package checklist storage guards alongside intake guards before outside work can move toward Codex review. |
| DR-503 | Prototype return readiness summary | Accepted | Game-readiness and tenant prototype review workbenches must summarize returned prototype readiness before Codex return review can open. |
| DR-504 | AI generation request storage guard | Accepted | Teacher generator routes must show request storage guards before live AI generation requests, model billing, draft generation, verifier submission, routes, playlists, packages, or assignments can exist. |
| DR-505 | AI generation request packet storage contract | Accepted | AI generation request packets must have backend-neutral hosted/local storage contracts before live AI generation, model billing, draft generation, verifier submission, route, playlist, package, assignment, or support-language progress workflows can exist. |
| DR-506 | AI generation request packet preview | Accepted | Teacher generator routes must show a review-only request packet preview with evidence links and blocked actions before model calls, billing, drafts, verifier submission, package assembly, routes, playlists, assignments, or support-language progress can exist. |
| DR-507 | AI request-to-draft handoff preview | Accepted | Teacher generator routes must show a review-only handoff from request packet to draft preview while blocking model dispatch, billing, draft generation, draft writes, verifier submission, package assembly, routes, playlists, assignments, student-ready markers, and support-language progress. |
| DR-508 | AI draft repair evidence packet | Accepted | Draft correction queues must produce evidence-only repair packets before verifier submission while blocking auto-fix, live AI regeneration, package assembly, routes, playlists, assignments, student-ready markers, and support-language progress. |
| DR-021 | Second sample tenant package | Accepted | Add a second sample tenant and partner-style content package to prove the white-label path in code. |
| DR-022 | Multi-tenant front-door resolver | Accepted | Resolve `/enter/[tenantId]` from tenant route registry data rather than hard-coded MiniStar-only routing. |
| DR-023 | Reviewed content intake scaffold | Accepted | Show PDF/DOCX/source intake as a reviewed gate before any package becomes student-facing. |
| DR-024 | Deployment profile scaffold | Accepted | Keep hosted PWA, local classroom server, and packaged local app paths visible from the start, with hosted PWA as the recommended first pilot. |
| DR-025 | Persistence boundary before backend choice | Accepted | Define durable record boundaries before selecting Supabase, Firebase, SQLite, or another backend. |
| DR-026 | Teacher session monitor scaffold | Accepted | Add a sample teacher monitor route on the shared event stream without implying production student-data storage. |

## DR-001: Tailwind And PostCSS Foundation

Status: Accepted

Decision: Use Tailwind with PostCSS in `apps/web` for the initial structural layout system.

White-label impact: Positive if tenant colors and brand rules remain outside components. Tailwind provides layout speed, but it must not become a place where MiniStar-specific styling is scattered across reusable screens.

Cost impact: Positive. Tailwind is common, low-cost, and familiar to many React/Next engineers. It avoids buying or locking into a commercial design system before the product shape is stable.

Portability: Acceptable. Tailwind classes are local to React components and can coexist with CSS variables, CSS modules, or future design-token tooling.

Constraints:

- Tenant palette values live in `TenantConfig.brand` and are exposed as CSS variables by the app shell.
- Reusable primitives use tenant variables for primary surfaces, borders, text, and focus states.
- Do not add a heavy component vendor unless a real repeated need appears.
- Do not encode MiniStar mascots, colors, reward names, or curriculum assumptions into platform primitives.

Risks:

- One-off class sprawl across screens.
- Hard-coded tenant-specific visuals leaking into platform components.
- Visual polish being mistaken for product progress.

Mitigations:

- Keep `packages/ui` small, named, and boring first.
- Add domain components in `apps/web/src/features/*` before inventing generic abstractions.
- Review new screens against `docs/PRINCIPLES_AND_STANDARDS.md` and this register.

## DR-002: Tenant Token Styling Boundary

Status: Accepted

Decision: Tenant branding enters the web app through a typed tenant configuration, then becomes CSS variables at the app-shell boundary.

White-label impact: Strongly positive. This lets MiniStar be the flagship tenant without making MiniStar the platform itself.

Cost impact: Positive. CSS variables are cheap, portable, and do not require a separate design-token service yet.

Constraints:

- `TenantConfig` owns display name, curriculum name, reward name, avatar families, and brand palette.
- `AppShell` applies tenant variables.
- Shared primitives consume variables and avoid tenant-specific names.
- Future tenant asset rules, blacklist rules, and avatar families should extend the same configuration idea.

## DR-003: No Premium Polish Before Structure

Status: Accepted

Decision: Build sequence remains structure first, polish second, premium assets third.

Reason: The platform needs reusable learning flows, game event contracts, tenant boundaries, and clean classroom routing before we invest in animation, pets, collection rooms, or high-production visuals.

Allowed now:

- Stable navigation and layouts.
- Reusable shell and primitives.
- Unit payload contracts.
- Teacher launch and student QR-entry surfaces.
- Progression surfaces that show the shape of earned collection.

Deferred until the vertical slice works:

- Detailed mascot animation.
- Rich avatar wardrobe.
- Complex room/base decoration systems.
- Full Spin Wheel presentation.
- Advanced motion, particles, premium sound, or deeply custom game art.

## DR-004: Earned Collection Mechanics

Status: Accepted

Decision: Collection and progression are central to engagement, but must be earned through learning and safe for children.

White-label impact: Positive. The collection layer can become a major product differentiator across tenants.

Cost impact: Mixed. It adds product depth, but the first version should use data-driven reward definitions and simple visual states before expensive custom asset pipelines.

Constraints:

- Rewards are unlocked by mastery, effort, module completion, teacher launch flows, and safe bonus loops.
- Surprise rewards can exist as cosmetic bonuses, but must not resemble paid gacha or pressure purchasing.
- The system should support avatars, pets, rooms, titles, palette swaps, and evolution tracks as configurable reward catalogs.

## DR-005: Local Progression Before Persistence

Status: Accepted

Decision: Prove the first interactive student progression slice with local component state and an app-level adapter before introducing database persistence, authentication, classroom rosters, or live monitoring.

White-label impact: Positive. This avoids locking tenant, school, classroom, or student-account assumptions into persistence too early.

Cost impact: Positive. Local state is cheap to build and easy to change. Backend services, migrations, security rules, account flows, and live monitoring should wait until the event contract proves itself.

Constraints:

- The first slice may use local state for QR entry, flashcard completion, event recording, Memory Match unlock state, and Star Dust display.
- No local-state implementation should pretend to be production persistence.
- The transition to persistence must preserve the route and event contracts already defined.
- See `docs/adr/0002-local-progression-before-persistence.md` for the full decision record.

## DR-006: Deterministic Starter Reward Catalog

Status: Accepted

Decision: Use a deterministic starter reward catalog with visible Star Dust thresholds for the first collection preview.

White-label impact: Positive. The reward catalog can become tenant-configurable later while the current slice proves the user-facing collection loop.

Cost impact: Positive. Simple catalog entries and thresholds are cheap to build, easy to explain, and avoid expensive asset pipelines before the vertical slice is verified.

Reward safety impact: Strongly positive. The first implementation demonstrates earned collection without random pressure, paid gacha patterns, or opaque reward odds.

Constraints:

- Starter rewards are unlocked by transparent Star Dust thresholds.
- Reward labels are sample data, not universal product assumptions.
- Future surprise rewards must remain bonus cosmetics and must not become the main progression path.
- Premium reward visuals, rooms, avatars, and pet evolution remain deferred until the foundation slice is verified.

## DR-007: Permanent QR And Local Textbook Companion Mode

Status: Accepted

Decision: Treat permanent QR identifiers, content packages, local/closed app deployment, and a multimedia companion layer as first-class white-label requirements.

White-label impact: Strongly positive. This expands Living Textbook from a MiniStar-first school product into a saleable companion platform for textbook publishers, curriculum owners, schools, and private education brands.

Cost impact: Mixed but acceptable. The route registry, content package, media catalog, and packaging strategy add foundation work, but they prevent much more expensive rework after QR codes are printed or partner content is imported.

Portability impact: Positive if implemented through tenant/book/unit/activity identifiers rather than partner-specific pages. The same model can serve MiniStar, a colleague's textbook series, or a future publisher tenant.

Constraints:

- Printed QR codes must not point directly to local files, temporary localhost ports, or version-specific asset paths.
- QR payloads should resolve stable identifiers such as tenant, series, book, unit, activity, language, edition, and version.
- The build standard is hybrid by default: stable QR registry, optional tiny hosted redirect, and local app/content-package fallback.
- A local/closed app can be supported through an installed app, installed PWA, local classroom server, or similar package, but the tradeoffs must be documented.
- PDF-derived content must enter as draft content packages and require human review plus verifier checks before student assignment.
- Multimedia is an asset, playlist, and playback layer, not hard-coded music or video pages.
- See `docs/adr/0004-permanent-qr-and-local-companion-mode.md` and `docs/partner-strategies/LOCAL_TEXTBOOK_COMPANION_STRATEGY.md`.

## DR-008: Multimedia Is Core Living-Textbook Content

Status: Accepted

Decision: Treat music, audio, video, playlists, optional unit/game background media, and media progress events as core living-textbook primitives from the first build.

White-label impact: Strongly positive. Publishers and curriculum owners can maintain year-on-year multimedia companions alongside games without needing a separate product or expensive one-off portal.

Cost impact: Positive if kept data-driven. A shared multimedia catalog and playback contract is cheaper than building separate music pages, video pages, and game-specific media hacks for each tenant.

Pedagogical impact: Positive with controls. Unit songs, chants, listening tracks, and videos can reinforce language before, during, or after gameplay. Background media during games is allowed as an option, but it must be teacher/tenant configurable and should not distract from comprehension or accessibility.

Constraints:

- Each content package may include audio assets, video assets, playlists, and unit multimedia plans.
- Media assets must track rights/owner, language, duration, local/offline availability, and textbook/unit/activity references where available.
- Background music or video during games must be optional, controllable, and reported through standard media events.
- Games must remain playable without background media for accessibility, bandwidth, classroom noise, and local-device constraints.
- Teacher reporting should be able to distinguish game progress from media engagement.
- This decision is recorded in `docs/adr/0005-core-multimedia-package.md`.

## DR-009: Audio-First Learner Support

Status: Accepted

Decision: Treat audio support for learner-facing text as a mandatory platform requirement across all student games and activities.

White-label impact: Strongly positive. A white-label learning platform can serve younger learners, emerging readers, English learners, textbook publishers, and schools more reliably when it does not assume independent reading. Tenant voice, accent, language, pronunciation rules, and audio source can remain configurable.

Cost impact: Positive if implemented through cue-level metadata. Text-to-speech can be used as a cost-efficient fallback during early development, while recorded, teacher-recorded, or partner-provided audio can replace it later without changing game architecture.

Pedagogical impact: Essential. Young children and non-fluent English readers need to hear vocabulary, target sentences, instructions, feedback, and key prompts. Audio is not decoration; it is a comprehension layer.

Constraints:

- Every student-facing vocabulary term must have an audio cue.
- Every target sentence must have an audio cue.
- Student-facing instructions, feedback, prompts, and critical controls must have listen/replay support.
- Every parent game engine must accept audio cue references as part of its mode payload.
- Optional background music is separate from comprehension audio. Background media can be disabled; comprehension audio cannot be silently omitted from student-ready learning flows.
- Audio cues may resolve to recorded files, partner-provided audio, teacher-recorded audio, generated text-to-speech, or reviewed placeholders during early development.
- A unit is not student-ready until it has an audio support plan for learner-facing text.
- This decision is recorded in `docs/adr/0006-audio-first-learner-support.md`.

## DR-010: Research Before Reinvention

Status: Accepted

Decision: Before building major custom systems or importing assets, deliberately research public repositories, proven libraries, and public best-practice examples, then record license, provenance, fit, and integration decisions.

White-label impact: Positive when governed. Public examples can reduce build cost and improve quality, but only if they do not hard-code another brand, create license restrictions, or weaken tenant configurability.

Cost impact: Positive with discipline. Reusing proven libraries or learning from public architecture can save time. Importing unclear code or assets can create legal, maintenance, security, and refactoring costs.

Portability impact: Positive when adoption favors small libraries, open standards, and clean adapters. Negative when adoption locks core learning flows into a repo-specific architecture or asset pipeline.

Constraints:

- Search for relevant public repositories, libraries, examples, and asset sources before major work on game engines, multimedia playback, offline PWA support, content packaging, AI verification, rewards, avatars, or collection rooms.
- Check license compatibility before adoption.
- Record source URL, owner, license, commercial/white-label rights, attribution needs, maintenance activity, risks, and integration plan.
- Prefer reusable libraries and architecture ideas over large code copy-paste.
- Do not import public assets unless provenance, rights, and tenant-fit are documented.
- Do not promote external code into `apps/web`, `apps/ai-service`, or shared packages without an explicit integration plan.
- Public-repo research should inform Z.ai task specs when outside agents are asked to prototype game modes.
- This decision is supported by `docs/RESEARCH_NOTES_PUBLIC_REPOS.md` and `docs/FUTURE_REQUIREMENTS.md` FR-003.

## DR-011: Bounded Upper-Level AI Tutor

Status: Accepted

Decision: Preserve AI Tutor as a future upper-level capability, but keep it bounded by tenant, curriculum, level, unit, approved vocabulary, approved sentence patterns, teacher rules, and safety rules.

White-label impact: Positive. A bounded tutor can become a premium differentiator for schools, academies, publishers, and textbook partners without making MiniStar-specific tutor behavior universal.

Cost impact: Mixed. It adds model, speech, moderation, privacy, storage, and support costs. These costs are acceptable only after the core platform works without AI and tutor usage is controlled.

Phase fit: Future capability. Do not build active AI Tutor UI, model calls, or service flows before the first QR/front-door, flashcard, Memory Match, multimedia, and teacher-report slice is locally verified.

Constraints:

- No open-ended general chatbot for children.
- No tutor response outside approved unit scope unless a reviewed mode explicitly allows it.
- No AI-generated grading or teacher instructions without verified rules.
- No raw transcript storage by default.
- No hard-coded MiniStar tutor identity inside platform code.
- Tutor interactions should produce teacher-visible learning summaries when implemented.
- This decision is recorded in `docs/adr/0007-bounded-ai-tutor-upper-levels.md` and `docs/AI_TUTOR_STRATEGY.md`.

## DR-012: AI Tutor Premium Entitlement

Status: Accepted

Decision: Treat AI Tutor as an optional premium entitlement, not a baseline dependency of the Living Textbook platform.

White-label impact: Strongly positive. Schools and textbook partners can adopt the core product without recurring AI costs, while premium tenants can choose AI Tutor for advanced speaking, writing, correction, role play, and adaptive review.

Cost impact: Positive if enforced. The platform avoids forcing model, speech, moderation, and infrastructure costs onto every tenant. Future pricing can use tenant feature flags, usage limits, enabled levels, and enabled tutor modes.

Component boundary: Positive. AI Tutor availability belongs in tenant/package configuration and content-package tutor plans, not scattered conditionals in student game screens.

Constraints:

- Core QR launch, audio flashcards, games, multimedia, rewards, and teacher reporting must work with AI Tutor disabled.
- AI Tutor must be enabled through tenant feature entitlement or package configuration.
- Enabled AI Tutor plans must require premium or enterprise entitlement.
- Usage limits, allowed levels, allowed modes, teacher enablement, and school enablement must be representable before active implementation.
- Disabled states must be clean and must not block normal student progression.
- Shared contracts now exist in `packages/content-model/src/index.ts`.
- This decision is recorded in `docs/adr/0008-ai-tutor-premium-entitlement.md` and `docs/future-requirements/FR-006-bounded-ai-tutor-upper-levels.md`.

## DR-013: Training Academy Recovery Metadata Bridge

Status: Trial

Decision: Keep early Training Academy recovery events in the existing `training_recommended` shared event type, with the precise recovery action stored in `metadata.trainingEventType`, until the recovery/reporting needs are proven across more than one focus type.

White-label impact: Positive for the current phase. Tenants get one progress stream for games, media, recovery, and rewards without a premature schema expansion that may not fit future publishers or classroom models.

Cost impact: Positive. It keeps the first implementation cheap and easy to change while still allowing teacher reports to count recovery recommendations, starts, item practice, completions, returns, and recovery Star Dust.

Portability: Acceptable as a trial. The summary adapter isolates the metadata bridge so future dedicated event types can replace it without rewriting all teacher surfaces.

Constraints:

- Training metadata must include `trainingEventType` for reportable recovery actions.
- Teacher reports should use a shared adapter, not one-off string checks in multiple screens.
- Recovery events must remain in the same progress stream as games and media unless persistence proves a separate stream is necessary.
- Dedicated Training Academy event types should be promoted into `packages/content-model` only after at least the vocabulary, sentence, listening, and mode-practice recovery paths are tested.
- This trial decision must be revisited before database persistence or analytics export is designed.

Exit criteria:

- Keep the bridge if teacher reporting stays simple and the event taxonomy remains stable.
- Promote dedicated event types if reporting, analytics, or persistence need stronger compile-time guarantees.

## DR-014: Training Academy Focus Configs

Status: Accepted

Decision: Represent Training Academy recovery lanes as focus configs instead of hard-coded screens.

White-label impact: Positive. Vocabulary, sentence, listening, spelling, and mode-practice support can be enabled, renamed, configured, or extended for future tenants without rebuilding the route.

Cost impact: Positive. One reusable Training Academy route can serve multiple recovery needs before persistence, teacher assignment, or premium polish is introduced.

Component boundary: Positive. The route renders config-driven target items, instructions, recommended mode, and reward cap rather than embedding MiniStar-only vocabulary behavior.

Constraints:

- Focus configs must remain audio-first.
- Focus selection must emit teacher-visible metadata.
- Focus configs are foundation defaults, not permanent tenant policy.
- Teacher-controlled focus assignment and tenant thresholds come later.
- This decision is recorded in `docs/adr/0012-training-academy-focus-configs.md`.

## DR-015: Target-Language Entry Gate

Status: Accepted

Decision: Entry practice completion must be gated by target-language engagement. Support-language text can help comprehension, but it must not complete practice, unlock games, award mastery credit, or satisfy target-language item checks.

White-label impact: Strongly positive. MiniStar can use Japanese support while future tenants can choose different assist languages without weakening the target-language learning contract.

Cost impact: Positive. The gate uses local interaction state and event metadata rather than AI services, persistence, or manual teacher review.

Component boundary: Positive. The rule lives in shared flashcard practice flow and progression event metadata, not in a MiniStar-only exception.

Constraints:

- Target-language vocabulary and sentence structures drive the entry-practice count.
- Assist-language taps do not increment the target-language count.
- Direct launch and front-door textbook routes must enforce the same gate.
- Completion and unlock events must record that support-language unlock is not allowed.
- This decision is recorded in `docs/adr/0015-target-language-entry-gate.md`.

## DR-016: Premium Voice Tutor Speech Layer

Status: Accepted

Decision: Preserve a Vocal Image-style speech coaching direction as an optional premium Voice Tutor layer, but keep it tenant-gated, level-gated, replaceable, and inactive in the foundation student slice.

White-label impact: Strongly positive. Voice coaching can become a premium differentiator for schools, academies, publishers, and local textbook companion packages without making MiniStar-specific behavior universal.

Cost impact: Mixed but controlled. Speech-to-text, pronunciation scoring, moderation, audio storage, and conversation services can become expensive. They are acceptable only when adopted as a premium or enterprise entitlement with usage limits and school/teacher controls.

Portability: Essential. Vocal Image is product inspiration, not a dependency. Public repositories such as `whisper.cpp`, `Montreal Forced Aligner`, and local text-to-speech engines are research candidates only until license, privacy, performance, and integration review is complete.

Component boundary: Positive. The current implementation introduces a voice-tutor capability catalog and dashboard readiness panel without adding active microphone prompts, model calls, or speech uploads to the student flow.

Constraints:

- No active Voice Tutor UI in the foundation student route.
- No microphone access, model call, transcript storage, or external speech service before explicit premium prototype acceptance.
- First active prototype should begin with browser record/replay, then transcript match, then deterministic expected-text checks, then pronunciation/fluency feedback.
- No open-ended child chatbot.
- Feedback must be age-appropriate, encouraging, bounded by approved unit content, and teacher-reviewable.
- Open-source candidates require license/provenance/security review before import.
- This decision is recorded in `docs/adr/0016-premium-voice-tutor-speech-layer.md` and `docs/future-requirements/FR-008-premium-voice-tutor-speech-layer.md`.

## DR-021: Second Sample Tenant Package

Status: Accepted

Decision: Add a second sample tenant and partner-style content package as a foundation proof that the Living Textbook app is not MiniStar-only.

White-label impact: Strongly positive. The same route family, app shell, launch flow, Speak It route, multimedia panel, progression summary, and teacher controls can render a different tenant, different reward name, different textbook metadata, and different package rules.

Cost impact: Positive. This is a cheap static sample that exposes hard-coded assumptions before partner onboarding, persistence, and import workflows become expensive.

Constraints:

- Partner demo content is reviewed sample data, not an import pipeline.
- Partner routes must reuse shared platform components.
- MiniStar assist language, Star Dust naming, avatar rules, or visual rules must not leak into partner sample routes.
- Target-language engagement remains the unlock trigger.
- Missing partner media files are acceptable placeholders only while the media catalog and rights-managed storage layer are still in foundation mode.
- This decision is recorded in `docs/adr/0020-second-sample-tenant-package.md`.

## DR-022: Multi-Tenant Front-Door Resolver

Status: Accepted

Decision: Resolve `/enter/[tenantId]` from tenant route registry data instead of one-off MiniStar-only conditionals.

White-label impact: Strongly positive. This keeps the front-door entry-code/user-code model portable across MiniStar, sample publisher tenants, and future textbook partners.

Cost impact: Positive. Static registry data is cheap for the scaffold and reveals the future backend boundary before real persistence is selected.

Constraints:

- Route registry entries must name tenant, launch code, access policy, teacher report label, and demo user code behavior.
- Unknown tenants should remain controlled rather than falling through to incorrect tenant data.
- This decision is recorded in `docs/adr/0021-multi-tenant-front-door-resolver.md` and `docs/decision-register/DR-022-multi-tenant-front-door-resolver.md`.

## DR-023: Reviewed Content Intake Scaffold

Status: Accepted

Decision: Add a teacher/admin content intake review scaffold before building automatic PDF/DOCX import.

White-label impact: Strongly positive. Textbook partners need confidence that source files, AI drafts, media assets, and route mappings are reviewed before students see them.

Cost impact: Positive. A visible review scaffold is cheaper and safer than prematurely building a full import pipeline.

Constraints:

- Raw PDFs, DOCX files, and AI drafts cannot become student-facing directly.
- Intake gates must include source check, content extraction, vocabulary/sentence review, audio coverage, media rights, assist language, and route readiness.
- This decision is recorded in `docs/adr/0022-reviewed-content-intake-scaffold.md` and `docs/decision-register/DR-023-reviewed-content-intake-scaffold.md`.

## DR-024: Deployment Profile Scaffold

Status: Accepted

Decision: Show hosted PWA, local classroom server, and packaged local app deployment paths from the beginning, with hosted PWA as the recommended first pilot.

White-label impact: Strongly positive. The colleague/publisher textbook scenario remains inside the core product strategy instead of becoming a later add-on.

Cost impact: Positive if phased. Hosted PWA is the fastest and least expensive pilot path. Local and packaged modes remain planned, but only after media bundles, sync/export, installer/update, and QR/deep-link behavior are decided.

Constraints:

- Do not present local/packaged deployment as production-ready until persistence and offline media packaging exist.
- Do not make hosted assumptions that prevent local/closed deployments later.
- This decision is recorded in `docs/adr/0023-deployment-profile-scaffold.md` and `docs/decision-register/DR-024-deployment-profile-scaffold.md`.

## DR-025: Persistence Boundary Before Backend Choice

Status: Accepted

Decision: Define persistence boundaries before choosing a production backend vendor or local storage implementation.

White-label impact: Strongly positive. The platform can support hosted pilots and future closed/local deployments without locking all tenants to one storage shape too early.

Cost impact: Strongly positive. Static data remains acceptable for the current scaffold, while durable records are clearly named before a paid backend or local sync stack is introduced.

Constraints:

- Route registry, launch sessions, reviewed content packages, media manifests, deployment profiles, and progress/media event streams must become durable before real pilots.
- Student progress storage requires privacy, retention, access-control, and export policy decisions.
- Teacher microphone approval and similar toggles must eventually move into persisted launch/session settings.
- This decision is recorded in `docs/adr/0024-persistence-boundary-before-backend-choice.md` and `docs/decision-register/DR-025-persistence-boundary-before-backend-choice.md`.

## DR-026: Teacher Session Monitor Scaffold

Status: Accepted

Decision: Add an active teacher session monitor route using sample data and the shared progress event stream.

White-label impact: Strongly positive. Teachers and textbook partners can see the reporting direction for MiniStar and partner tenants without waiting for a full backend.

Cost impact: Positive. The scaffold is low-cost and backend-agnostic while making persistence needs visible before pilot commitments.

Constraints:

- The route must not be presented as production analytics.
- No real student identity, transcript, raw audio, or cloud speech scoring is stored or implied.
- Support-language activity cannot satisfy unlock or mastery requirements.
- This decision is recorded in `docs/adr/0025-teacher-session-monitor-scaffold.md` and `docs/decision-register/DR-026-teacher-session-monitor-scaffold.md`.

## DR-509: AI Verifier Submission Packet Validator

Status: Accepted

Decision: AI verifier submission packets must pass a shared content-model validator and visibly require draft repair evidence before verifier submission can be considered.

White-label impact: Positive. Tenants can vary curriculum and media rules while the platform keeps one consistent verifier gate.

Cost impact: Positive. Live verifier calls, package assembly, route writes, playlists, and assignments stay blocked until evidence and storage readiness are explicit.

Constraints:

- Verifier packets must include `ai_draft_repair_evidence_packet`.
- The teacher generator route must show verifier guard blocks and warnings.
- MiniStar packets must preserve English as the progress trigger and hiragana-only Japanese support boundaries.
- This decision is recorded in `docs/adr/0438-ai-verifier-submission-packet-validator.md` and `docs/decision-register/DR-509-ai-verifier-submission-packet-validator.md`.

## DR-510: AI Verifier Submission Storage Guard

Status: Accepted

Decision: Add a visible, review-only storage guard after AI verifier submission packets and before downstream package review.

White-label impact: Positive. The verifier storage guard preserves hosted and local companion parity for each tenant before any backend vendor or local bundle behavior is chosen.

Cost impact: Positive. Live verifier submission, approval, route writes, playlist writes, assignments, and student-ready markers stay blocked until storage, evidence, retention, and audit obligations are explicit.

Constraints:

- The storage record type is `teacher_draft_verifier_submission`.
- Hosted and local companion adapter requirements must both be visible.
- Verifier submission, package approval, route writes, playlist writes, assignments, student-ready markers, and support-language progress remain blocked.
- This decision is recorded in `docs/adr/0439-ai-verifier-submission-storage-guard.md` and `docs/decision-register/DR-510-ai-verifier-submission-storage-guard.md`.

## DR-511: AI Verifier Result Evidence Packet

Status: Accepted

Decision: Add an offline, review-only verifier result evidence packet after verifier storage and before teacher approval prep.

White-label impact: Positive. Tenants get a consistent verifier outcome shape without forcing one AI provider, one backend, or one curriculum model.

Cost impact: Positive. Live verifier calls, retry loops, and downstream package work remain blocked until evidence, ownership, and release-control requirements are accepted.

Constraints:

- Verifier result evidence must use `offline-review-preview` and keep `verifier-result-not-submitted`.
- Teacher approval, package approval, route writes, playlist writes, assignments, student-ready markers, and support-language progress remain blocked.
- MiniStar evidence must preserve English as target-language trigger and hiragana-only Japanese support.
- This decision is recorded in `docs/adr/0440-ai-verifier-result-evidence-packet.md` and `docs/decision-register/DR-511-ai-verifier-result-evidence-packet.md`.

## DR-512: Teacher Review Verifier Result Dependency

Status: Accepted

Decision: AI generated package teacher review packets must depend on `ai_verifier_result_evidence_packet`, not only verifier submission packet visibility.

White-label impact: Positive. Every tenant gets the same approval discipline while using its own curriculum, media, and language rules.

Cost impact: Positive. Human review cannot trigger downstream package work from an unsubmitted or unresolved verifier result.

Constraints:

- Teacher review packets must keep verifier-result evidence visible as missing evidence and a next required record.
- Teacher approval from verifier result remains blocked.
- MiniStar teacher review must preserve English target-language progress and hiragana-only Japanese support.
- This decision is recorded in `docs/adr/0441-teacher-review-verifier-result-dependency.md` and `docs/decision-register/DR-512-teacher-review-verifier-result-dependency.md`.

## DR-513: Promotion Checklist Verifier Result Dependency

Status: Accepted

Decision: AI generated package promotion checklists must depend on `ai_verifier_result_evidence_packet`, not only verifier submission packet visibility.

White-label impact: Positive. Every tenant promotion pathway now waits for reviewed verifier-result evidence while still allowing tenant-specific media, language, and curriculum rules.

Cost impact: Positive. The platform avoids package promotion work, route writes, playlist writes, and assignment rollout until verifier outcomes are explicit.

Constraints:

- Promotion checklists must show verifier result evidence as a blocked step while result status is `verifier-result-not-submitted`.
- `ai_verifier_result_evidence_packet` must remain visible in next required records before promotion.
- Package promotion, route registry writes, playlists, assignments, local bundles, and student-ready markers remain blocked.
- MiniStar promotion must preserve English target-language progress and hiragana-only Japanese support.
- This decision is recorded in `docs/adr/0442-promotion-checklist-verifier-result-dependency.md` and `docs/decision-register/DR-513-promotion-checklist-verifier-result-dependency.md`.

## DR-514: Package Writer Route And Playlist Write Guard

Status: Accepted

Decision: Add a review-only route and playlist write guard after the package writer harness implementation decision.

White-label impact: Positive. Stable QR links, route registries, media playlists, teacher routes, and tenant-specific support-language rules are protected before any generated package writer can touch them.

Cost impact: Positive. The platform avoids expensive route, playlist, QR, and media rollout repair work by requiring guard evidence before writes exist.

Constraints:

- Route registry writes, media playlist writes, production QR redirect mutation, and student-facing route activation remain blocked.
- The guard must require stable QR deep-link smoke checks, target-language route checks, teacher route isolation, media-rights checks, target-language-audio-first playlist checks, and background media opt-in checks.
- Support-language-only route or playlist approval remains blocked.
- MiniStar route and playlist guards must preserve English target-language progress and hiragana-only Japanese support.
- This decision is recorded in `docs/adr/0443-package-writer-route-playlist-write-guard.md` and `docs/decision-register/DR-514-package-writer-route-playlist-write-guard.md`.

## DR-515: Package Writer Local Companion Package Guard

Status: Accepted

Decision: Add a review-only local companion package guard after the route and playlist write guard.

White-label impact: Positive. Closed local textbook packages, offline route maps, printed QR fallback sheets, media bundle inventories, export archives, and restore checkpoints become governed platform concepts without forcing every tenant into one hosted-only model.

Cost impact: Positive. The platform avoids costly support incidents from accidental local bundle exports, stale QR maps, unlicensed media copies, or learner-data leakage by requiring review evidence before any local companion package can exist.

Constraints:

- Local bundle packaging, local folder activation, offline route activation, media file copy, export archive creation, local companion release, assignment activation from local companion, support-language-only local package approval, and writer execution remain blocked.
- The guard must require closed local manifest review, media rights and file inventory review, offline route map smoke checks, printed QR fallback review, rollback restore checkpoint review, and student data exclusion checks.
- MiniStar local companion guards must preserve English target-language progress and hiragana-only Japanese support.
- This decision is recorded in `docs/adr/0444-package-writer-local-companion-package-guard.md` and `docs/decision-register/DR-515-package-writer-local-companion-package-guard.md`.

## DR-516: Package Writer Guard Storage Contracts

Status: Accepted

Decision: Add backend-neutral storage contracts for route/playlist write guards and local companion package guards.

White-label impact: Positive. Generated package writer guard evidence can be persisted consistently for hosted, installed PWA, desktop, and local-classroom deployments without selecting a storage vendor too early.

Cost impact: Positive. Persisting guard state as review records lowers future support cost by making route, playlist, QR, media, local package, student-data, school-policy, and rollback responsibilities auditable before live writes exist.

Constraints:

- `ai_generated_package_writer_route_playlist_write_guard` must preserve protected surfaces, route safety checks, playlist safety checks, QR mutation blocks, target-language audio checks, and support-language route approval blocks.
- `ai_generated_package_writer_local_companion_package_guard` must preserve protected local artifacts, local safety checks, offline fallback checks, student data exclusion, school policy requirements, rollback checkpoints, and support-language local approval blocks.
- Storage contracts must remain backend-neutral and must not enable route writes, playlist writes, media copy, local bundle export, assignment activation, student-ready markers, or support-language-only approval.
- This decision is recorded in `docs/adr/0445-package-writer-guard-storage-contracts.md` and `docs/decision-register/DR-516-package-writer-guard-storage-contracts.md`.

## DR-517: Package Writer Assignment Shell Guard

Status: Accepted

Decision: Add a review-only assignment shell guard after the local companion package guard.

White-label impact: Positive. Generated packages now have a governed bridge toward future teacher QR/front-door assignments, private assignment links, class roster scope, progress events, teacher report previews, and launch gate bindings without assuming one school workflow.

Cost impact: Positive. Blocking generated assignment activation until policy, reporting, roster, event, and launch-gate evidence exists prevents expensive privacy, reporting, and support failures.

Constraints:

- Assignment shell writes, private assignment link activation, class roster binding, progress event stream activation, teacher report export, live classroom launch, assignment activation from generated packages, support-language-only assignment approval, and writer execution remain blocked.
- The guard must require teacher QR/front-door assignment review, target-language trigger checks, no-real-learner-data checks, school policy acceptance, teacher report privacy, progress event taxonomy, and raw microphone audio/transcript exclusion.
- MiniStar assignment shell guards must preserve English target-language progress and hiragana-only Japanese support.
- This decision is recorded in `docs/adr/0446-package-writer-assignment-shell-guard.md` and `docs/decision-register/DR-517-package-writer-assignment-shell-guard.md`.

## DR-518: Package Writer Assignment Shell Guard Storage Contract

Status: Accepted

Decision: Add a backend-neutral storage contract for assignment shell guards.

White-label impact: Positive. Assignment, private link, class roster, progress event, reporting, and launch-gate evidence can be persisted consistently across hosted, installed PWA, desktop, and local-classroom deployments.

Cost impact: Positive. Persisting assignment guard state before live assignment behavior reduces privacy, reporting, roster, and support risk while preserving a low-cost backend selection path.

Constraints:

- `ai_generated_package_writer_assignment_shell_guard` must preserve protected assignment surfaces, assignment safety checks, reporting safety checks, class roster boundaries, progress event taxonomy, launch-gate requirements, school policy requirements, and support-language assignment approval blocks.
- Storage contracts must remain backend-neutral and must not enable assignment writes, private assignment links, roster binding, progress streams, teacher report export, live classroom launch, raw audio/transcript storage, or support-language-only approval.
- This decision is recorded in `docs/adr/0447-package-writer-assignment-shell-guard-storage-contract.md` and `docs/decision-register/DR-518-package-writer-assignment-shell-guard-storage-contract.md`.

## DR-519: Package Writer Assignment Handoff Evidence Packet

Status: Accepted

Decision: Add a review-only assignment handoff evidence packet after the assignment shell guard.

White-label impact: Positive. Teacher QR/front-door assignment review, private link policy, roster privacy, progress event taxonomy, report export policy, launch gate review, rollback evidence, and support-language boundaries become visible tenant-governed requirements before generated package assignment workflows exist.

Cost impact: Positive. The packet reduces future implementation and support cost by preventing premature assignment activation, learner-data collection, raw audio/transcript storage, report export, or school-policy mistakes.

Constraints:

- Assignment shell writes, private assignment link activation, class roster binding, progress event stream activation, teacher report export, live classroom launch, assignment activation from generated packages, raw learner audio/transcript storage, and support-language-only assignment handoff remain blocked.
- The packet must require assignment shell guard storage, teacher QR/front-door review, target-language trigger proof, private-link policy proof, no-real-learner-data proof, teacher report privacy proof, progress event taxonomy proof, classroom launch gate review, rollback evidence, and support-language boundary proof.
- MiniStar assignment handoff evidence packets must preserve English target-language progress and hiragana-only Japanese support.
- This decision is recorded in `docs/adr/0448-package-writer-assignment-handoff-evidence-packet.md` and `docs/decision-register/DR-519-package-writer-assignment-handoff-evidence-packet.md`.

## DR-520: Package Writer Assignment Handoff Evidence Packet Storage Contract

Status: Accepted

Decision: Add a backend-neutral storage contract for assignment handoff evidence packets.

White-label impact: Positive. Assignment handoff evidence can be persisted consistently across hosted, installed PWA, desktop, and local-classroom deployments while preserving tenant-specific assignment, roster, reporting, launch, rollback, and support-language policy.

Cost impact: Positive. Persisting assignment handoff evidence as a review record avoids expensive privacy, reporting, raw-audio, transcript, and school-policy mistakes before live assignment workflow work begins.

Constraints:

- `ai_generated_package_writer_assignment_handoff_evidence_packet` must preserve the linked assignment shell guard, package id preview, assignment preview id, evidence lanes, missing evidence, blocked handoff actions, rollout requirements, report policy requirements, rollback evidence, and support-language boundaries.
- Storage contracts must remain backend-neutral and must not enable assignment handoff, private assignment links, roster binding, progress streams, teacher report export, live classroom launch, raw learner audio/transcript storage, generated assignment activation, writer execution, or support-language-only handoff.
- MiniStar assignment handoff evidence packet storage must preserve English target-language progress and hiragana-only Japanese support.
- This decision is recorded in `docs/adr/0449-package-writer-assignment-handoff-evidence-packet-storage-contract.md` and `docs/decision-register/DR-520-package-writer-assignment-handoff-evidence-packet-storage-contract.md`.

## DR-521: Assignment Rollout Generated Handoff Evidence Link

Status: Accepted

Decision: Connect generated-package assignment handoff evidence packets into the existing teacher assignment rollout preview as review-only source evidence.

White-label impact: Positive. AI-generated package assignment evidence now enters the same tenant rollout lane as ordinary reviewed assignments instead of creating a parallel assignment system.

Cost impact: Positive. Reusing the existing rollout gate lowers future build and support cost while preserving a strict boundary between evidence packets and live assignment scheduling.

Constraints:

- Generated-package handoff evidence cannot schedule a class, activate private links, bind rosters, start progress streams, export reports, launch classrooms, store raw learner audio/transcripts, or approve support-language-only handoff.
- Assignment rollout plans must show source evidence packet ids and a generated-package policy note before any generated assignment rollout work is designed.
- MiniStar generated-package handoff evidence remains English-triggered, hiragana-support-only, and review-only.
- This decision is recorded in `docs/adr/0450-assignment-rollout-generated-handoff-evidence-link.md` and `docs/decision-register/DR-521-assignment-rollout-generated-handoff-evidence-link.md`.

## DR-522: Assignment Rollout Generated Evidence Summary

Status: Accepted

Decision: Add a generated-package evidence count to the assignment rollout summary metrics.

White-label impact: Positive. Teachers and tenant admins can quickly see whether generated-package evidence is present before reading each rollout plan.

Cost impact: Positive. A simple summary metric reduces review confusion without introducing workflow state, storage writes, or scheduling behavior.

Constraints:

- The metric is informational only and cannot schedule classes, activate assignments, or approve evidence.
- Detailed source evidence packet ids remain visible inside each rollout plan.
- This decision is recorded in `docs/adr/0451-assignment-rollout-generated-evidence-summary.md` and `docs/decision-register/DR-522-assignment-rollout-generated-evidence-summary.md`.

## DR-523: Assignment Rollout Generated Evidence Storage Revision

Status: Accepted

Decision: Revise teacher assignment rollout gate storage to preserve generated-package handoff source evidence packet ids, generated package policy notes, and a blocked generated-package handoff field.

White-label impact: Positive. Generated packages, publisher packages, and ordinary teacher-reviewed packages can share one assignment rollout gate without losing source evidence or creating a separate assignment path.

Cost impact: Positive. Preserving the generated evidence fields in the existing rollout gate avoids a parallel workflow, reduces review confusion, and keeps future backend implementations simple.

Constraints:

- `teacher_assignment_rollout_gate` records must preserve `source_evidence_packet_ids`, `generated_package_policy_note`, and `generated_package_handoff_allowed`.
- `generated_package_handoff_allowed` remains false until assignment rollout, classroom launch, school policy, roster, reporting, rollback, and privacy gates pass.
- Generated-package evidence source ids cannot schedule classes, activate private links, bind rosters, start progress streams, export reports, launch classrooms, store raw learner audio/transcripts, or bypass support-language boundaries.
- This decision is recorded in `docs/adr/0452-assignment-rollout-generated-evidence-storage-revision.md` and `docs/decision-register/DR-523-assignment-rollout-generated-evidence-storage-revision.md`.

## DR-524: Shared Game Learning Audio Contract Card

Status: Accepted

Decision: Add a shared learning-audio contract to active student game routes and classify `audio_requested` as support-only progress evidence.

White-label impact: Positive. Tenants can require learner-facing audio across game engines while preserving configurable target languages and preventing support-language shortcuts.

Cost impact: Positive. A single route-shell contract avoids every game prototype, Phaser wrapper, or outside build re-implementing audio policy and progress boundaries.

Constraints:

- Active game routes must show target-language term, sentence, and instruction audio coverage before the playable game surface.
- `audio_requested` events are teacher-visible and persistence-required, but support-only.
- Tap-to-speak, support language, and background media cannot unlock progress, award Star Dust, count as mastery, or mutate scoring.
- Flashcards keep the same contract even though they use the specialized entry route instead of `PlayableGameRouteShell`.
- This decision is recorded in `docs/adr/0453-shared-game-learning-audio-contract-card.md` and `docs/decision-register/DR-524-shared-game-learning-audio-contract-card.md`.

## DR-525: Teacher Audio Request Evidence Lane

Status: Accepted

Decision: Show `audio_requested` in teacher session monitor and report package previews as a support-only learning-audio evidence lane.

White-label impact: Positive. Schools and publishers can verify that learner-facing audio is being used without confusing audio support with mastery, score, or unlock authority.

Cost impact: Positive. A visible support-only lane reduces future reporting ambiguity and avoids expensive corrections if teachers expect audio taps to appear in reports.

Constraints:

- `audio_requested` may appear in teacher-visible monitor and report rows only as support-only evidence.
- Audio requests cannot unlock games, award mastery, change score values, or replace target-language answer/result events.
- Core report exports remain blocked until school policy, persistence, access control, and retention gates close.
- This decision is recorded in `docs/adr/0454-teacher-audio-request-evidence-lane.md` and `docs/decision-register/DR-525-teacher-audio-request-evidence-lane.md`.

## DR-526: Game Readiness Activity Compatibility Gate

Status: Accepted

Decision: Show the reviewed activity pathway compatibility matrix on `/teacher/game-readiness`.

White-label impact: Positive. Tenants and publishers can see which activities are offered, planned, premium, teacher-review, or blocked without assuming every textbook payload can be switched into every game.

Cost impact: Positive. Curated compatibility rules reduce expensive rework from unsupported conversions, unsafe public-library assumptions, unreviewed printables, or outside prototypes that do not fit the parent-engine model.

Constraints:

- `/teacher/game-readiness` remains review-only and cannot launch students, publish games, import prototypes, write routes, assign work, or save compatibility records.
- Compatibility decisions must preserve target-language progression, learner audio coverage, standard reporting, and support-language boundaries.
- Z.ai, Phaser, and outside prototype work must follow the compatibility matrix before Codex considers integration review.
- This decision is recorded in `docs/adr/0455-game-readiness-activity-compatibility-gate.md` and `docs/decision-register/DR-526-game-readiness-activity-compatibility-gate.md`.

## DR-527: Activity Compatibility Audio And Reporting Lanes

Status: Accepted

Decision: Display audio requirement and reporting requirement lanes inside the activity pathway compatibility panel.

White-label impact: Positive. Each tenant can review whether an activity fits its language, classroom, media, privacy, and reporting rules before it becomes a student option or outside prototype target.

Cost impact: Positive. Surfacing audio and reporting requirements early prevents expensive rebuilds where a game looks playable but cannot produce valid learning evidence or support young learners.

Constraints:

- Compatibility is not accepted from payload fit alone.
- Target-language audio coverage and standard reporting must be visible before a pathway can inform games, printables, AI generation, or prototype review.
- Support-language taps and media-only engagement remain support-only evidence, not progress authority.
- This decision is recorded in `docs/adr/0456-activity-compatibility-audio-reporting-lanes.md` and `docs/decision-register/DR-527-activity-compatibility-audio-reporting-lanes.md`.

## DR-528: Activity Pathway Verifier Audio Reporting Coverage

Status: Accepted

Decision: Update the activity pathway verifier to require audio/reporting lanes and focused game-readiness route coverage.

White-label impact: Positive. Tenants get consistent compatibility review expectations before a unit pathway can drive games, printables, AI generation, or external prototype tasks.

Cost impact: Positive. The verifier catches missing audio/reporting evidence early, when it is cheap to repair.

Constraints:

- The verifier must not enable live template switching or route publishing.
- Compatibility must remain curated, teacher-reviewed, target-language triggered, and support-language safe.
- `/teacher/game-readiness` remains a review-only route.
- This decision is recorded in `docs/adr/0457-activity-pathway-verifier-audio-reporting-coverage.md` and `docs/decision-register/DR-528-activity-pathway-verifier-audio-reporting-coverage.md`.

## DR-529: Multi-Tenant Unit Game Offer Maps

Status: Accepted

Decision: The unit game offer map surface must show both the MiniStar flagship map and at least one non-MiniStar partner map through the same component and shared export.

Rationale:

- White-label confidence depends on proving that MiniStar is the first tenant, not the platform's only shape.
- Teacher/admin review needs to compare package-specific game offers without route or panel special casing.
- Cost stays lower when additional tenants extend the same offer-map contract instead of creating custom game dashboards.

Guardrails:

- `sampleUnitGameOfferMaps` must include MiniStar and sample publisher maps.
- Each map must name its tenant id, package id, route expectations, audio requirements, teacher controls, and blocked actions.
- Game-readiness and teacher-intake workbenches remain review-only.
- This decision is recorded in `docs/adr/0458-multi-tenant-unit-game-offer-maps.md` and `docs/decision-register/DR-529-multi-tenant-unit-game-offer-maps.md`.

## DR-530: Unit Game Offer Reporting Requirements

Status: Accepted

Decision: Every unit game offer must declare a `reportingRequirement` and the teacher-facing offer-map panel must display it before game availability is treated as reviewed.

Rationale:

- Teacher reporting is part of the core product promise, not a later cosmetic add-on.
- White-label tenants need to know what every activity contributes to reports before they offer it year after year.
- Speech and media-heavy games need explicit privacy limits before they become student-facing.

Guardrails:

- Target-language game events may contribute to mastery and progress.
- Support-language text/audio/listens remain report-only.
- Media-only and background-media-only events never trigger mastery.
- Speak It and future Voice Tutor offers must block raw audio and transcript storage unless an adult-approved premium policy explicitly allows a reviewed alternative.
- This decision is recorded in `docs/adr/0459-unit-game-offer-reporting-requirements.md` and `docs/decision-register/DR-530-unit-game-offer-reporting-requirements.md`.

## DR-531: Student Activity Hub Offer-Map Source

Status: Accepted

Decision: Student activity hubs must build reviewed game route cards from the unit game offer map when one exists.

Rationale:

- The teacher-reviewed offer map already carries availability, readiness, route, audio, media, reporting, and guardrail data.
- Duplicating route lists inside the student hub creates drift as game modes expand.
- White-label tenants need one package-level place to maintain yearly game offerings.

Guardrails:

- Game route cards may be generated from reviewed offers.
- Training Academy, print, media, and launch routes remain explicit support paths.
- Student cards may show audio and reporting rules, but they do not create scoring authority.
- Missing offer maps may use a fallback list until review data exists.
- This decision is recorded in `docs/adr/0460-student-activity-hub-offer-map-source.md` and `docs/decision-register/DR-531-student-activity-hub-offer-map-source.md`.

## DR-532: Game Completion Offer-Map Next Path

Status: Accepted

Decision: The shared game completion card should prefer reviewed unit game offer maps for next-activity suggestions and fall back to launch-session recommendations only when no offer map exists.

Rationale:

- The offer map carries game readiness, availability, route, audio, reporting, and guardrail context.
- Completion cards are part of student progression, so they should not drift from teacher-reviewed pathways.
- Launch-session recommendations remain useful as a fallback for incomplete or legacy packages.

Guardrails:

- Hidden, blocked, premium, teacher-only, or not-ready offers are not suggested as the next student activity.
- Completion cards can show the source of the next suggestion.
- Completion cards cannot write routes, publish games, change scoring, or unlock teacher-only/premium offers.
- This decision is recorded in `docs/adr/0461-game-completion-offer-map-next-path.md` and `docs/decision-register/DR-532-game-completion-offer-map-next-path.md`.

## DR-533: Recommended Path Offer-Map Source

Status: Accepted

Decision: Recommended game path cards should prefer reviewed unit game offer maps when a content package id is available.

Rationale:

- Recommended paths are student-facing progression surfaces, so they should not drift from teacher-reviewed game availability.
- Unit game offer maps already hold the richer route, audio, reporting, readiness, and availability rules.
- Launch-session recommendations remain useful as a fallback while package review data matures.

Guardrails:

- Hidden, blocked, teacher-only, premium, and not-ready offers must not appear as normal recommended student games.
- Recommended path cards may show the reviewed map that sourced the route list.
- The card cannot publish routes, unlock premium features, save settings, write scores, or treat support-language actions as progress.
- This decision is recorded in `docs/adr/0462-recommended-path-offer-map-source.md` and `docs/decision-register/DR-533-recommended-path-offer-map-source.md`.

## DR-534: Shared Game-Mode Route Path Helper

Status: Accepted

Decision: Student, teacher, and partner demo surfaces should resolve playable game links through the shared exhaustive `getGameModeRoutePath` helper.

Rationale:

- Repeated mode-to-route branches create drift as the game catalog expands.
- White-label tenants need predictable game route behavior while still allowing reviewed offer maps to override tenant/package-specific launch routes.
- Centralizing game route resolution lowers the cost of adding future modes and reviewing outside prototypes.
- Exhaustive typing makes missing playable route mappings fail during typecheck instead of appearing later as a broken student link.

Guardrails:

- Use the shared helper for playable game-mode routes in launch, activity hub, recommendation, completion, teacher shortcut, and partner demo surfaces.
- Keep the helper exhaustive for every `GameModeId`.
- Keep printable, media, training, collection, teacher, assignment, and review routes explicit unless they become true game-mode routes.
- Offer-map launch routes may override the helper when reviewed package data requires a specific path.
- The helper cannot publish routes, unlock hidden/premium/teacher-only offers, write scores, or treat support-language actions as progress.
- This decision is recorded in `docs/adr/0463-shared-game-mode-route-path-helper.md` and `docs/decision-register/DR-534-shared-game-mode-route-path-helper.md`.

## DR-535: Active Game Route Catalog Workbench

Status: Accepted

Decision: The game-readiness workbench should show a review-only active game route catalog sourced from the shared game-mode route helper.

Rationale:

- Route wiring should be visible before the platform starts evaluating more Phaser, Z.ai, or outside game prototypes.
- A shared catalog helps compare MiniStar and partner launch routes without creating tenant-specific route branches.
- The panel makes the route helper, parent engine, scoring profile, audio requirement, and active mode metadata auditable in one place.

Guardrails:

- The route catalog must use `getGameModeRoutePath`.
- The catalog is review-only and cannot publish routes, mutate offer maps, import prototypes, write scores, or unlock games.
- Unit offer maps may still override student launch routes after package review.
- The game-mode coverage verifier must protect shared route helper mappings.
- This decision is recorded in `docs/adr/0464-active-game-route-catalog-workbench.md` and `docs/decision-register/DR-535-active-game-route-catalog-workbench.md`.

## DR-536: Local Companion Active Game Coverage

Status: Accepted

Decision: Local companion manifests must name every active playable game mode as included, planned, or blocked using shared mode and parent-engine ids.

Rationale:

- A closed textbook package must not quietly omit active game routes that exist in the hosted PWA.
- White-label partners need a clear manifest of which games are included, planned, or policy-gated for local handoff.
- Shared ids keep local packages compatible with route replay, reporting, audio coverage, settings, and future prototype review.

Guardrails:

- Every active `GameModeId` must appear in local companion game coverage.
- Local game entries must use shared `ParentEngine` ids, not local-only aliases or game-family ids.
- Every local game entry must name target-language audio coverage, progress-reporting status, and a local path.
- Planned local routes remain review-only and cannot export packages, copy media, store student data, or activate offline mode.
- This decision is recorded in `docs/adr/0465-local-companion-active-game-coverage.md` and `docs/decision-register/DR-536-local-companion-active-game-coverage.md`.

## DR-537: Two-Tenant Local Companion Preview Routes

Status: Accepted

Decision: Keep review-only local companion preview routes for both MiniStar and the sample publisher tenant.

Rationale:

- The flagship MiniStar school product and the white-label publisher product both need local companion visibility.
- Sharing the same preview panel keeps the local package model white-label rather than tenant-specific.
- Browser verification can now confirm both local manifest shapes stay route-visible.

Guardrails:

- `/local/ministar` and `/local/sample-publisher` are preview-only.
- Both routes must use reviewed sample manifests and the shared local companion package preview panel.
- Neither route can export packages, install a local app, claim offline-ready status, store student data, or mutate QR redirects.
- This decision is recorded in `docs/adr/0466-two-tenant-local-companion-preview-routes.md` and `docs/decision-register/DR-537-two-tenant-local-companion-preview-routes.md`.

## DR-538: Persistence Storage Selection Gate Visibility

Status: Accepted

Decision: The focused persistence workbench must show the shared evidence storage adapter selection gate.

Rationale:

- Backend decisions should be visible where storage, schema, migration, boundaries, and adapter readiness are reviewed.
- Hosted managed evidence storage remains the recommended first pilot path for cost control and faster validation.
- Closed local storage remains important for white-label textbook companions, but it carries installer, backup, restore, encryption, and update obligations.

Guardrails:

- The panel is review-only and cannot select a backend vendor.
- No uploads, object buckets, signed URLs, local folders, evidence downloads, report exports, local companion activations, or release-state mutations become live.
- Persistence route verification must check the storage adapter selection text.
- Repeated review-list text uses contextual keys.
- This decision is recorded in `docs/adr/0467-persistence-storage-selection-gate-visibility.md` and `docs/decision-register/DR-538-persistence-storage-selection-gate-visibility.md`.

## DR-539: Focused Assignment Rollout Workbench

Status: Accepted

Decision: Add `/teacher/assignments` as a focused assignment rollout workbench.

Rationale:

- Student assignments, private links, QR/front-door access, roster scope, and report blockers are core teacher workflow needs.
- A focused page makes assignment readiness easier to review than the broad intake route.
- White-label tenants need one governed assignment path that covers MiniStar, partner front-door pilots, and closed local companion drafts without creating separate shortcut workflows.

Guardrails:

- The route is review-only and cannot schedule a live class.
- Private assignment link activation, roster binding, progress streams, report export, live classroom launch, and real learner data collection remain blocked.
- Generated-package assignment handoff remains evidence-only until rollout, policy, persistence, reporting, rollback, and target-language gates pass.
- Active route and assignment-rollout verification must protect the route.
- This decision is recorded in `docs/adr/0468-focused-assignment-rollout-workbench.md` and `docs/decision-register/DR-539-focused-assignment-rollout-workbench.md`.

## DR-540: Tenant-Aware Media Library Preview

Status: Accepted

Decision: Add `/teacher/media/ministar` and make the shared teacher media route resolve tenant branding before rendering.

Rationale:

- Audio, music, video, playlists, background media, and local bundle media are core Living Textbook package materials, not afterthoughts.
- MiniStar needs the same media-maintenance review surface as the white-label sample publisher tenant.
- Tenant-aware asset ownership labels prevent partner-only or MiniStar-only assumptions from leaking into shared platform surfaces.

Guardrails:

- `/teacher/media/ministar` and `/teacher/media/sample-publisher` are review-only.
- No live upload, replacement, transcoding, storage write, playlist promotion, background-media assignment, local folder activation, report export, or student assignment is enabled.
- Target-language learner audio remains required and cannot be replaced by video, background music, or support-language audio.
- MiniStar Japanese support remains hiragana-only for Foundation/Bronze/Plus and cannot unlock progress.
- Active route and upload-channel verification must protect both media library previews.
- This decision is recorded in `docs/adr/0469-tenant-aware-media-library-preview.md` and `docs/decision-register/DR-540-tenant-aware-media-library-preview.md`.

## DR-541: Tenant-Aware App Shell Navigation

Status: Accepted

Decision: Build shared app-shell navigation from the current tenant and keep partner-only workbench links off MiniStar-branded pages.

Rationale:

- Navigation is part of the white-label boundary, not only a convenience layer.
- MiniStar pages should not lead teachers into sample-publisher uploads, evidence, release-control, asset, local package, or partner session surfaces.
- Route helpers reduce future hard-coded URL drift as more tenant routes are added.

Guardrails:

- MiniStar shell navigation uses MiniStar source, generator, prototype, review, media, session, and local preview links.
- Sample publisher shell navigation can keep the deeper partner pilot workbenches that currently only exist for that tenant.
- Navigation links remain review shortcuts only and cannot activate uploads, storage, release, local export, scoring, rewards, assignments, or classroom launch.
- Active route verification must protect representative positive and forbidden tenant navigation markers.
- This decision is recorded in `docs/adr/0470-tenant-aware-app-shell-navigation.md` and `docs/decision-register/DR-541-tenant-aware-app-shell-navigation.md`.

## DR-542: Tenant Navigation Boundary Panel

Status: Accepted

Decision: Add a review-only tenant navigation boundary panel to `/teacher/intake` before adding more tenant workbenches.

Rationale:

- White-label navigation needs to be visible as a product boundary, not only hidden inside the app shell.
- Teachers and future agents need to see which routes are shared platform routes, tenant-scoped review routes, sample-publisher-only operational routes, and MiniStar routes that are intentionally not created yet.
- This reduces cross-tenant leakage risk before upload, evidence, media, release-control, local companion, and assignment routes expand.

Guardrails:

- The panel is review-only and cannot activate uploads, evidence export, release state, local package export, storage writes, assignments, or live workflow.
- Tenant-scoped routes must use route helpers or tenant-aware route data before becoming shell links.
- Sample-publisher-only operational routes must not appear in MiniStar navigation until MiniStar-specific data and review records exist.
- MiniStar-only media state must not appear on sample-publisher branded pages.
- Active route verification must protect the boundary text on `/teacher/intake`.
- This decision is recorded in `docs/adr/0471-tenant-navigation-boundary-panel.md` and `docs/decision-register/DR-542-tenant-navigation-boundary-panel.md`.

## DR-543: Route Graduation Gate

Status: Accepted

Decision: Add a review-only route graduation gate to `/teacher/intake`.

Rationale:

- Active local routes prove page rendering and data shape, but they do not prove a route is ready for real students, pilots, printed QR codes, or local companion packaging.
- Future builders need a shared definition of scaffold route, student-ready route, pilot-ready route, and production QR route.
- Route graduation must require tenant boundaries, target-language audio, standard progress events, teacher reports, private assignment rules, school policy, backend storage, QR aliases, rollback, and local fallback evidence.

Guardrails:

- A visible route, generated package, local preview, or navigation link cannot graduate itself.
- No production QR mutation, classroom launch, live learner data collection, report export, direct media-file target, or support-language-only progress can be enabled from this gate.
- Active route verification must protect the graduation text on `/teacher/intake`.
- This decision is recorded in `docs/adr/0472-route-graduation-gate.md` and `docs/decision-register/DR-543-route-graduation-gate.md`.

## DR-544: Foundation Workstream Index

Status: Accepted

Decision: Add a visible foundation workstream index near the top of `/teacher/intake`.

Rationale:

- The foundation dashboard now contains many route, upload, game, media, policy, evidence, backend, and local companion gates.
- Teachers, partners, and future agents need a readable map of the current build lanes before they enter the deeper review panels.
- The index reinforces the current build focus and the future Z.ai intake alert without enabling any live product behavior.

Guardrails:

- The index is informational and cannot activate live features, student data collection, public community libraries, unmanaged asset adoption, direct AI publish, or Z.ai imports.
- The workstream map must remain aligned with `docs/BUILD_SESSIONS.md`, `docs/PRINCIPLES_AND_STANDARDS.md`, and the decision register.
- Active route verification must protect the index text on `/teacher/intake`.
- This decision is recorded in `docs/adr/0473-foundation-workstream-index.md` and `docs/decision-register/DR-544-foundation-workstream-index.md`.

## DR-545: Teacher Page Foundation Status Snapshot

Status: Accepted

Decision: Add a compact foundation status snapshot to the MiniStar teacher page.

Rationale:

- The main teacher page should communicate the current build stage before users enter launch routes or the larger intake control room.
- The snapshot gives a non-technical status view: structure first, 88 active routes checked, tenant boundary visible, and Z.ai intake not yet.
- This helps the human side of the project understand when to intervene and when to keep build focus on foundation integrity.

Guardrails:

- The snapshot is informational and cannot activate live features, classroom launch, real learner data collection, report export, or Z.ai imports.
- The status must link to the foundation control room without replacing the detailed gates on `/teacher/intake`.
- Active route verification must protect the snapshot text on `/teacher`.
- This decision is recorded in `docs/adr/0474-teacher-page-foundation-status-snapshot.md` and `docs/decision-register/DR-545-teacher-page-foundation-status-snapshot.md`.

## DR-546: Z.ai Human Handoff Signal

Status: Accepted

Decision: Extend the Z.ai prototype intake alert with explicit human handoff timing.

Rationale:

- The user is actively building with Z.ai and needs to know when that work should be handed to Codex for review.
- The platform should encourage continued isolated prototyping while blocking premature source handoff, Phaser imports, archive uploads, pull requests, and app patches.
- Codex should explicitly ask for specific Z.ai branches, archives, demo links, or fixture folders only when the intake alert becomes ready-for-review.

Guardrails:

- Until Codex issues the intake alert, Z.ai work remains external prototype inventory.
- No Z.ai source handoff, Phaser import, archive upload, pull request, app patch, route replacement, scoring mutation, audio manifest mutation, reward write, playlist write, package promotion, or student assignment is requested.
- Prototype-readiness verification and active route verification must protect the timing language.
- This decision is recorded in `docs/adr/0475-zai-human-handoff-signal.md` and `docs/decision-register/DR-546-zai-human-handoff-signal.md`.

## DR-547: PWA And Offline Readiness Gate

Status: Accepted

Decision: Add a review-only PWA and offline readiness gate to `/teacher/intake`.

Rationale:

- The white-label product needs to support both hosted PWA pilots and future closed local textbook companion deployments.
- An installable manifest helps teacher demos, but it can be mistaken for offline readiness if service worker, cache, media, QR, storage, and policy blockers are not visible.
- The platform needs a clear promise boundary before partner media, yearly textbook packages, or local classroom fallbacks are discussed as saleable delivery modes.

Guardrails:

- No offline-ready claim, service worker registration, cache mutation, media precache, local installer export, student data offline storage, background sync, production QR mutation, or local package activation is allowed from this gate.
- Offline media requires rights proof, checksums, versioned manifests, tenant approval, and learning-audio priority preservation.
- Closed local companion behavior must stay tied to QR alias compatibility, edition fallback, rollback, persistence, reporting, and school policy gates.
- Local bundle readiness verification and active route verification must protect the PWA/offline gate markers.
- This decision is recorded in `docs/adr/0476-pwa-offline-readiness-gate.md` and `docs/decision-register/DR-547-pwa-offline-readiness-gate.md`.

## DR-548: Local Preview Offline Readiness Parity

Status: Accepted

Decision: Render the PWA/offline readiness gate on both local companion preview routes.

Rationale:

- `/local/ministar` and `/local/sample-publisher` are the surfaces most likely to be used when discussing closed textbook companion delivery.
- They must carry the same promise boundary as `/teacher/intake`: installable shell is allowed, but offline readiness is blocked.
- This protects partner demos from implying that local packages, bundled media, QR fallback, reports, or offline learner storage are production-ready.

Guardrails:

- The local preview routes cannot register service workers, mutate caches, precache media, export installers, activate local packages, store learner data, run background sync, mutate production QR aliases, or export reports.
- Active route verification must protect the PWA/offline markers on `/local/ministar` and `/local/sample-publisher`.
- This decision is recorded in `docs/adr/0477-local-preview-offline-readiness-parity.md` and `docs/decision-register/DR-548-local-preview-offline-readiness-parity.md`.

## DR-549: Media Bundle Integrity Gate

Status: Accepted

Decision: Add a review-only media bundle integrity gate to `/teacher/intake`, `/local/ministar`, and `/local/sample-publisher`.

Rationale:

- White-label textbook partners may need to maintain music, videos, posters, images, and game assets year by year.
- Closed packages can become expensive and unreliable if media is duplicated, uncompressed, checksum-free, or not bound to edition/version rules.
- The platform needs a practical engineering gate before any upload, local bundle, installer, or offline package workflow is allowed.

Guardrails:

- No package-size approval, checksum-free bundle, direct folder activation, uncompressed video handoff, media-only progress, background music override, offline-ready claim, or local installer export can happen from this gate.
- Bundle size budgets, checksums, rights proof, streaming/local fallback, deduplication, yearly replacement, and learning-audio priority must be visible before closed-package handoff.
- Local bundle readiness verification and active route verification must protect the integrity markers.
- This decision is recorded in `docs/adr/0478-media-bundle-integrity-gate.md` and `docs/decision-register/DR-549-media-bundle-integrity-gate.md`.

## DR-550: Deployment Decision Workbench

Status: Accepted

Decision: Add a focused `/teacher/deployment` workbench for hosted PWA, local classroom server, and packaged textbook companion decisions.

Rationale:

- The foundation needs a readable product decision surface for school and publisher conversations without expanding the already-large `/teacher/intake` control room.
- Hosted PWA should remain the recommended first pilot path for cost efficiency, faster feedback, and lower support burden.
- Local classroom server and packaged companion delivery are important white-label opportunities, but they require media, storage, QR, report, school policy, and rollback evidence before they can be sold as ready.

Guardrails:

- No offline-ready claim, local package activation, installer export, report export, real learner data collection, production QR redirect mutation, student-facing paid prompt, media-only progress, support-language-only progression, or premium AI Tutor activation can happen from this workbench.
- The route must reuse deployment profile, PWA/offline, media bundle integrity, local preflight, local bundle manifest, and package tier panels rather than inventing a parallel decision system.
- `npm run verify:deployment`, foundation verification, and active route verification must protect the route, data, navigation, route contract, route matrix, standards, ADR, and checklist.
- This decision is recorded in `docs/adr/0479-deployment-decision-workbench.md` and `docs/decision-register/DR-550-deployment-decision-workbench.md`.

## DR-551: Pilot Readiness Dashboard

Status: Accepted

Decision: Add a focused `/teacher/pilot` dashboard that combines controlled demo evidence with the blockers required before a real partner or school classroom pilot.

Rationale:

- The white-label product needs a readable command view for the first colleague or school conversation.
- The build already has many review-only surfaces; a pilot dashboard helps explain them without turning the large `/teacher/intake` page into the only sales/readiness surface.
- “Demo-ready” and “classroom-ready” must stay visibly different until source evidence, policy, persistence, reports, deployment, launch gates, and package approval are complete.

Guardrails:

- No classroom launch, real learner data collection, report export, policy acceptance, local package activation, offline-ready claim, premium AI Tutor activation, or Z.ai prototype intake request can happen from this dashboard.
- The dashboard must link to evidence routes and reuse existing readiness panels rather than creating a separate approval system.
- `npm run verify:pilot`, foundation verification, and active route verification must protect the route, route contract, navigation, dashboard data, standards, ADR, and checklist.
- This decision is recorded in `docs/adr/0480-pilot-readiness-dashboard.md` and `docs/decision-register/DR-551-pilot-readiness-dashboard.md`.

## DR-552: Partner Pilot Requirements Intake

Status: Accepted

Decision: Add a tenant-scoped `/teacher/pilot/requirements/[tenantId]` requirements intake for partner pilot conversations before live uploads, policy acceptance, storage writes, report export, premium AI activation, or classroom launch.

Rationale:

- A textbook publisher or school needs to know exactly what they must supply or decide before a real Living Textbook pilot.
- The platform should collect meeting evidence and requirements first, then introduce live upload and persistence workflows only after policy and storage gates are ready.
- The route reinforces the saleable white-label strategy by separating publisher-owned content/media obligations from platform-owned architecture and school-owned policy decisions.

Guardrails:

- No upload button, file picker write, policy acceptance, live storage write, report export, classroom launch, local package activation, premium AI Tutor activation, microphone request, or Z.ai source handoff request can happen from this intake.
- The first pilot recommendation remains hosted PWA for cost control unless closed local operation is explicitly required.
- The route must reuse tenant, source review, media, policy, reporting, deployment, entitlement, and game-readiness evidence links.
- `npm run verify:pilot-requirements`, foundation verification, and active route verification must protect the route and standards.
- This decision is recorded in `docs/adr/0481-partner-pilot-requirements-intake.md` and `docs/decision-register/DR-552-partner-pilot-requirements-intake.md`.

## DR-553: Partner Pilot Evidence Traceability Map

Status: Accepted

Decision: Add an evidence traceability map inside the partner pilot requirements intake so each pilot requirement links to the current review route, proof signal, blocked-until condition, and pilot dependency.

Rationale:

- A partner conversation should show what evidence already exists, where it lives, and what remains blocked before a real classroom pilot.
- Traceability protects the white-label sales path because publisher supplies, school decisions, platform readiness, and optional premium features stay visibly separate.
- The map reduces future support cost by preventing repeated one-off meeting notes that drift away from source review, media rights, policy, reporting, deployment, entitlement, and game-readiness routes.

Guardrails:

- Evidence traceability is review-only; it cannot capture partner answers, write storage, approve policy, upload files, export reports, mutate routes, activate packages, or launch classes.
- The map must keep source PDF/text, media rights, curated activity pathway, QR/front-door, learner data policy, report/export, deployment, premium AI Tutor, and outside prototype evidence visible.
- Blocked-until statements must remain explicit so demo-ready evidence is not confused with classroom-ready approval.
- `npm run verify:pilot-requirements`, active route verification, and foundation verification must protect the trace map and no-live-capture boundaries.
- This decision is recorded in `docs/adr/0482-partner-pilot-evidence-traceability.md` and `docs/decision-register/DR-553-partner-pilot-evidence-traceability.md`.

## DR-554: Partner Pilot Meeting Agenda

Status: Accepted

Decision: Add a first partner pilot meeting agenda inside the partner pilot requirements intake so the first school or publisher conversation has a structured sequence of questions, evidence requests, decisions not made, and blocked live actions.

Rationale:

- The platform needs a repeatable commercial onboarding conversation for white-label partners before it has live uploads, policy acceptance, persistence, reports, local packaging, premium AI, or outside prototype intake.
- A structured agenda keeps confidence high while making clear that demo routes are not classroom launch approval.
- The agenda lowers implementation cost by capturing the first-pilot discovery pattern in reusable typed data instead of scattered notes.

Guardrails:

- The agenda is a meeting guide only; it cannot collect files, save answers, accept policy, select storage, export reports, promise local apps, activate premium AI Tutor, request microphone access, request Z.ai source handoff, or launch students.
- It must cover source package, multimedia rights, curated activity pathway, QR/front-door expectations, learner data policy, reporting, deployment, premium AI, and outside prototype timing.
- Decisions not made here must stay visible beside questions and evidence requests.
- `npm run verify:pilot-requirements`, active route verification, and foundation verification must protect the agenda and no-live-workflow boundaries.
- This decision is recorded in `docs/adr/0483-partner-pilot-meeting-agenda.md` and `docs/decision-register/DR-554-partner-pilot-meeting-agenda.md`.

## DR-555: Partner Pilot Follow-Up Packet Preview

Status: Accepted

Decision: Add a review-only follow-up packet preview to the partner pilot requirements intake. The preview organizes requested evidence, school decisions, demo links, blockers, and the next evidence gate after a first partner meeting.

Rationale:

- Partners need a concise, saleable next-step summary after the first requirements conversation.
- A typed packet preview keeps publisher obligations, school decisions, platform demos, and blockers separate without introducing premature email, export, storage, or approval workflows.
- Reusable packet data lowers support cost and gives future export/storage work a clear contract to implement later.

Guardrails:

- The packet is draft-only and review-only; it cannot send email, download, create attachments, save answers, accept policy, write storage, export reports, mutate release state, or launch students.
- Each packet item must retain an owner, review route, and reason so the follow-up remains tenant-aware and evidence-linked.
- Core packet contents cover source files, media rights, curated pathway approval, entry rules, school policy, deployment, and dry-run evidence.
- Premium AI Tutor, microphone approval, and Z.ai prototype intake remain adult decision points or blocked review items, not enabled packet actions.
- `npm run verify:pilot-requirements`, active route verification, and foundation verification must protect the packet preview and no-live-workflow boundaries.
- This decision is recorded in `docs/adr/0484-partner-pilot-follow-up-packet-preview.md` and `docs/decision-register/DR-555-partner-pilot-follow-up-packet-preview.md`.

## DR-556: Content Package Tenant and Reference Isolation

Status: Accepted

Decision: Strengthen `validateContentPackage` so every reviewed white-label package rejects duplicate units and identifiers, cross-tenant records, orphan media/audio references, cross-unit playlist media, and multimedia bindings from another unit.

Rationale:

- White-label packages must not accidentally display or route another tenant's content, media, or audio.
- A package can look structurally complete while still containing invalid references that only fail after publishing or classroom launch.
- Early deterministic validation is cheaper and safer than repairing cross-tenant contamination in storage or reports.

Guardrails:

- Validation remains pure and review-time only; it does not write storage, upload files, publish packages, mutate routes, or launch learners.
- Package metadata, units, media assets, audio cues, audio plans, playlists, multimedia plans, and assist-language plans must remain tenant- and unit-consistent.
- Both MiniStar and sample-publisher fixtures must remain valid under the stricter validator.
- `npm run verify:package-readiness`, typecheck, production build, and foundation verification protect this boundary.
- This decision is recorded in `docs/adr/0485-content-package-tenant-reference-isolation.md` and `docs/decision-register/DR-556-content-package-tenant-reference-isolation.md`.

## DR-557: Assist-Language Script Policy

Status: Accepted

Decision: Add `scriptPolicy` and optional `levelBand` fields to assist-language plans, and enforce Japanese student-facing script rules in the shared content-package validator.

Rationale:

- Foundation, Bronze, and Plus Japanese support must remain hiragana-only.
- Silver and later Japanese support may use kanji and katakana only under an explicit reviewed policy.
- Package validation is the reliable enforcement point for generated, imported, and future uploaded content.
- The rule remains white-label aware: non-Japanese tenants may use their own policy, and Japanese-as-target-language remains a separate product lane.

Guardrails:

- Student-visible Japanese plans without a script policy are invalid.
- Hiragana-only plans reject katakana and kanji in vocabulary, sentence, and instruction glosses.
- Mixed-script plans cannot be draft or rejected when offered to students.
- Support language remains comprehension support and never becomes a progression trigger.
- This is review-time validation only; no upload, translation, persistence, or package activation is introduced.

This decision is recorded in `docs/adr/0486-assist-language-script-policy.md` and `docs/decision-register/DR-557-assist-language-script-policy.md`.

## DR-558: AI Generator Assist-Policy Handoff

Status: Accepted

Decision: Carry structured assist-language script policy and level-band fields through AI game-generator request previews.

Rationale:

- Free-form assist-language notes are not sufficient to protect Foundation, Bronze, and Plus hiragana-only requirements.
- Generator requests must preserve policy before draft, verifier, teacher review, and package assembly stages.
- The same shape supports white-label tenant-defined policies and later Japanese target-language work without making Japanese universal.

Guardrails:

- MiniStar Level 1 requests declare `hiragana-only` and `foundation`.
- Missing policy remains visible as `Not declared` in the review panel.
- No live model call, model billing, publish, assignment, or support-language progression is introduced.
- The generator remains review-only until the Z.ai handoff signal is explicitly changed by Codex.

This decision is recorded in `docs/adr/0487-ai-generator-assist-policy-handoff.md` and `docs/decision-register/DR-558-ai-generator-assist-policy-handoff.md`.

## DR-559: Assist-Policy Readiness Coverage

Status: Accepted

Decision: Show assist-language policy records and script-policy coverage in the unit-package readiness summary and panel.

Rationale:

- A reviewed translation alone does not prove level-safe Japanese script.
- Teachers and tenant reviewers need visible evidence for policy, curriculum band, and review status.
- Optional assist language must remain optional, while invalid student-visible policy must remain blocked by package validation.

Guardrails:

- No assist policy record can unlock a game, award mastery, or replace target-language practice.
- No-assist packages remain reviewable without a false blocker.
- Invalid or undeclared student-visible Japanese policy is shown as blocked in the assist gate and remains a package validation error.
- The readiness surface stays review-only and does not enable uploads, publishing, assignment, or live storage.

This decision is recorded in `docs/adr/0488-assist-policy-readiness-coverage.md` and `docs/decision-register/DR-559-assist-policy-readiness-coverage.md`.

## DR-560: Evidence Handoff Package Lineage

Status: Accepted

Decision: Add a dedicated unit-package readiness section to the review-only evidence handoff packet so content validation, target-language audio coverage, assist-language script policy, and curated activity pathway evidence travel together with their source route.

Rationale:

- A handoff packet should preserve the evidence chain that made a unit reviewable without becoming a live export or publishing workflow.
- Teachers and publisher reviewers need to see the language and activity constraints alongside source, media, and rights evidence.
- Explicit lineage reduces the risk that a future export implementation drops audio, assist-language, or curated-pathway safeguards.

Guardrails:

- The packet remains preview-only and cannot export, sign, store attachments, publish, create routes, create playlists, or activate assignments.
- Target-language audio remains the learning requirement; assist-language evidence remains support-only.
- Package snapshots, reviewer identity, teacher release, retention, and storage remain missing-before-export evidence until their gates are implemented.
- `npm run verify:package-readiness`, typecheck, production build, and active route verification protect the handoff lineage.

This decision is recorded in `docs/adr/0489-evidence-handoff-package-lineage.md` and `docs/decision-register/DR-560-evidence-handoff-package-lineage.md`.

## DR-561: AI Service Boundary Foundation

Status: Accepted

Decision: Promote `apps/ai-service` from a placeholder into a provider-neutral, review-only contract boundary for structured AI generation requests.

Rationale:

- The white-label platform needs a real backend boundary before live model calls or generated package writes can be considered.
- Keeping the contract independent of providers, storage, routes, and game views protects cost control and future hosted/local deployment choices.
- Deterministic validation makes the canonical 8-12 vocabulary rule, exactly two sentence structures, target-language audio, media rights, and review state testable outside the web UI.

Guardrails:

- The service does not call a model, accept uploads, bill a provider, write packages, submit verifiers, write routes/playlists, activate assignments, or permit support-language progress.
- Teacher approval and premium cost policy remain explicit evidence lanes.
- All future providers and deployment adapters must consume the same request/result contract.

This decision is recorded in `docs/adr/0490-ai-service-boundary-foundation.md` and `docs/decision-register/DR-561-ai-service-boundary-foundation.md`.

## DR-562: Persistence Runtime Boundary

Status: Accepted

Decision: Add a provider-neutral persistence runtime contract and review-only adapter to sit between typed record plans and any future hosted, local, or hybrid storage implementation.

Rationale:

- Existing schemas and adapter plans describe storage, but a shared runtime decision point is needed to prevent bypasses when real adapters are introduced.
- White-label deployments need replaceable storage choices without changing tenant, privacy, policy, release, or reporting rules.
- A no-side-effect review adapter lets the platform test request shape and rejection behavior before live writes exist.

Guardrails:

- Every request is tenant-scoped and names its record category and operation.
- Student data requires policy; raw learner audio and transcripts remain excluded from core storage.
- Mutation and export require release approval.
- The review-only adapter blocks hosted, local, hybrid, export, and release side effects.

This decision is recorded in `docs/adr/0491-persistence-runtime-boundary.md` and `docs/decision-register/DR-562-persistence-runtime-boundary.md`.

## DR-563: Teacher Report Runtime Boundary

Status: Accepted

Decision: Add a provider-neutral teacher report runtime contract and review-only adapter between teacher report plans/event evidence and any future export or retained reporting provider.

Rationale:

- A report plan can be valid while an export is still unsafe or unauthorized.
- The platform needs one shared enforcement point for tenant scope, event taxonomy, pseudonymous learners, privacy exclusions, policy, persistence, approval, and release gates.
- A review-only result lets the foundation prove the decision path without creating a hidden export side effect.

Guardrails:

- Core reports use pseudonymous learner slots only and exclude raw learner audio and transcripts.
- Target-language progress and support-only event classifications remain validated through the shared event taxonomy.
- Teacher role, school or tenant policy, persistence, explicit export approval, and release approval are independent gates.
- Hosted, local, and hybrid reporting remain blocked until an approved adapter consumes the runtime contract.

This decision is recorded in `docs/adr/0492-teacher-report-runtime-boundary.md` and `docs/decision-register/DR-563-teacher-report-runtime-boundary.md`.

## DR-564: Asset And Media Runtime Boundary

Status: Accepted

Decision: Add a provider-neutral asset/media runtime contract and review-only adapter between upload/media readiness evidence and any future file storage, promotion, binding, or export provider.

Rationale:

- Upload panels, media manifests, and persistence records describe requirements but do not yet provide one runtime enforcement point.
- Images, audio, video, fonts, and source documents need the same tenant, scan, rights, checksum, mapping, and release discipline across white-label deployments.
- Learner-recorded media and learner uploads need a separate privacy and cost decision rather than accidental inclusion in the core asset path.

Guardrails:

- Unknown rights, unchecked scans, missing checksums, unreviewed sources, oversize or unbudgeted files, and missing mappings remain blocked.
- Student-facing use requires approved source review and release approval.
- The review-only adapter blocks upload, transcode, copy, promotion, binding, export, and manifest/QR/playlist mutation.

This decision is recorded in `docs/adr/0493-asset-media-runtime-boundary.md` and `docs/decision-register/DR-564-asset-media-runtime-boundary.md`.

## DR-565: Content Package Runtime Boundary

Status: Accepted

Decision: Add a provider-neutral content-package runtime contract and review-only adapter between package validation/readiness evidence and any future student-facing publisher, assignment, QR, or local companion provider.

Rationale:

- Package validators and readiness panels prove individual conditions but do not yet provide one runtime decision point for release and student use.
- The white-label platform needs one package boundary that keeps tenant scope, content quality, target-language audio, assist-language policy, curated pathways, persistence, storage, and release decisions together.
- A review-only result protects the platform from turning a locally valid package into a student-ready package through accidental route or UI behavior.

Guardrails:

- Target-language audio remains required for every learner-facing cue and active game mode.
- Assist language is optional support and never a progression, mastery, reward, or QR trigger.
- Student-facing use and QR activation require approved review, curated pathway review, storage/persistence evidence, and teacher or tenant release approval.
- The review-only adapter blocks package writes, student-ready markers, assignment/route/playlist/QR activation, and live mutation.

This decision is recorded in `docs/adr/0494-content-package-runtime-boundary.md` and `docs/decision-register/DR-565-content-package-runtime-boundary.md`.

## DR-566: Classroom Launch Runtime Boundary

Status: Accepted

Decision: Add a provider-neutral classroom launch runtime contract and review-only adapter between QR/front-door/assignment evidence and any future hosted, local, or hybrid classroom activation provider.

Rationale:

- Launch routes and assignment plans can be structurally valid while policy, persistence, roster, reporting, audio, or package gates remain open.
- A single launch boundary keeps teacher-led QR entry and student progression aligned across white-label tenants and deployment channels.
- Review-only evaluation provides a safe foundation for testing launch decisions without collecting learner data or mutating QR/session state.

Guardrails:

- Teacher role, package and assignment runtime approval, access review, school/roster/reporting policy, persistence, and target-language audio are independent gates.
- Support language and media cannot trigger progress; real learner data requires accepted persistence and roster policy.
- The review-only adapter blocks classroom activation, learner data collection, QR mutation, roster binding, report streams, progression, and rewards.

This decision is recorded in `docs/adr/0495-classroom-launch-runtime-boundary.md` and `docs/decision-register/DR-566-classroom-launch-runtime-boundary.md`.

## DR-567: Assignment Runtime Boundary

Status: Accepted

Decision: Add a provider-neutral assignment runtime contract and review-only adapter between assignment plans/access evidence and any future private-link, roster, progress-stream, report, or classroom provider.

Rationale:

- Assignment plans and private links can be structurally valid while package, launch, roster, persistence, reporting, and audio gates remain open.
- The white-label platform needs one activation boundary that works for teacher QR, front-door codes, home practice, and future local companions.
- Review-only evaluation keeps assignment planning useful without accidentally writing links, binding learners, or collecting progress.

Guardrails:

- Student-facing assignment use requires `ready-for-pilot` readiness and accepted package, launch, private-link, roster, persistence, reporting, and audio gates.
- Support-language and media-only progress remain blocked.
- The review-only adapter blocks assignment writes, private links, roster binding, progress streams, reports, and classroom launch.

This decision is recorded in `docs/adr/0496-assignment-runtime-boundary.md` and `docs/decision-register/DR-567-assignment-runtime-boundary.md`.

## DR-568: Source Intake Runtime Boundary

Status: Accepted

Decision: Add a provider-neutral source-intake runtime contract and review-only adapter between uploaded/source evidence and any OCR, parser, AI extraction, teacher draft, package, or student-facing provider.

Rationale:

- Source-review and persistence records describe required safeguards but need one runtime decision point before real extraction providers are introduced.
- PDF/DOCX/spreadsheet/media intake must preserve lineage, rights, checksum, scan state, OCR confidence, segmentation, and schema review across white-label tenants.
- A review-only adapter prevents raw sources or unreviewed extraction from silently becoming drafts, games, or assignments.

Guardrails:

- File policy, scan, lineage, rights, extraction, OCR, segmentation, schema, mapping, package, and release gates remain explicit.
- Raw source, unreviewed OCR/parser output, and direct AI extraction assignment remain blocked.
- The review-only adapter blocks source writes, extraction promotion, draft creation, AI direct assignment, and student activation.

This decision is recorded in `docs/adr/0497-source-intake-runtime-boundary.md` and `docs/decision-register/DR-568-source-intake-runtime-boundary.md`.

## DR-569: Release Runtime Boundary

Status: Accepted

Decision: Add a provider-neutral release runtime contract and review-only adapter between release-control evidence and any future package, QR, assignment, or classroom activation provider.

Rationale:

- Release-control records describe gates, but a shared runtime decision point is still needed to prevent state or QR mutation through future adapters.
- White-label tenants need the same promotion discipline for hosted, local, and hybrid releases.
- Explicit active and rollback requests make production activation and recovery testable without treating a preview route as a release.

Guardrails:

- Source extraction, rights, audio, curated pathways, package runtime, verifier, teacher approval, school policy, persistence, and rollback evidence remain separate gates.
- QR mutation and student-facing activation require an explicit active-release request.
- The review-only adapter blocks release-state mutation, QR mutation, student-ready markers, assignments, and classroom launch.

This decision is recorded in `docs/adr/0498-release-runtime-boundary.md` and `docs/decision-register/DR-569-release-runtime-boundary.md`.

## DR-570: Foundation Verification Composition

Status: Accepted

Decision: Make the canonical foundation command explicitly include the AI service and persistence runtime verifiers, all provider-neutral runtime verifiers, AI service typecheck, web typecheck, production build, and active route verification. Add a composition verifier that detects omissions.

Rationale:

- Backend contracts can exist and pass independently while remaining absent from the main release gate.
- White-label hosted, local, and hybrid options depend on the same shared contracts being checked together.
- A composition check is a low-cost guard against future script drift and incomplete build sessions.

Guardrails:

- The composition verifier inspects the canonical script only; it does not replace focused verification.
- No provider dispatch, persistence write, release mutation, route activation, or student-facing workflow is enabled by this change.

This decision is recorded in `docs/adr/0499-foundation-verification-composition.md` and `docs/decision-register/DR-570-foundation-verification-composition.md`.

## DR-571: Recovery And Continuity Runtime Boundary

Status: Accepted

Decision: Add a provider-neutral recovery runtime contract and review-only adapter for hosted, local, and hybrid backup, restore, export, and rollback planning.

Rationale:

- The white-label product must support closed textbook companions and yearly media/game packages without making backup or restore an informal deployment promise.
- Recovery is a separate risk from persistence and release; it needs its own privacy, checksum, retention, access, report-integrity, and rollback evidence.
- A shared no-side-effect contract keeps hosted-first cost control compatible with future local and hybrid products.

Guardrails:

- Backup, restore, export, package/media copy, learner-data recovery, QR/route mutation, and rollback execution remain blocked by the review-only adapter.
- Raw learner audio and transcripts are excluded from the core recovery contract.
- Non-hosted recovery requires reviewed local fallback evidence; restore and rollback require rollback readiness.

This decision is recorded in `docs/adr/0500-recovery-continuity-runtime-boundary.md` and `docs/decision-register/DR-571-recovery-continuity-runtime-boundary.md`.

## DR-572: Progression Event Runtime Boundary

Status: Accepted

Decision: Add a provider-neutral progression runtime contract and review-only adapter around the shared progress-event envelope and taxonomy.

Rationale:

- Taxonomy classification protects data shape, but a separate runtime decision point is needed before events can influence mastery, scoring, rewards, or unlocks.
- The target-language-only rule must survive hosted, local, hybrid, game, media, and future Phaser adapters.
- A shared boundary makes support-language, tap-to-speak, route-guidance, and background-media signals safe and reportable without making them progression authority.

Guardrails:

- Progress-affecting events require target-language evidence, persistence, reporting, policy, and deterministic reward readiness.
- Support-only and report-only events are rejected by the progression authority.
- Review-only execution returns no side effects and cannot mutate progress, rewards, unlocks, or persistence.

This decision is recorded in `docs/adr/0501-progression-event-runtime-boundary.md` and `docs/decision-register/DR-572-progression-event-runtime-boundary.md`.

## DR-573: Reward And Collection Runtime Boundary

Status: Accepted

Decision: Add a provider-neutral reward runtime contract and review-only adapter between accepted progression evidence and future collection inventory, avatar, cosmetic, pet-evolution, or Spin Wheel providers.

Rationale:

- Strong progression and collection are core engagement opportunities, but reward issuance must remain earned, deterministic, child-safe, and white-label configurable.
- Existing reward and collection policy records need one runtime decision point before hosted, local, hybrid, or game-engine adapters can write ownership.
- Spin Wheel tickets require separate policy review so overflow incentives do not become an unreviewed random-pressure loop.

Guardrails:

- Rewards require pseudonymous learner scope, source event, mastery evidence, deterministic rule, provenance, policy, persistence, and release approval.
- Random rewards, gacha, purchase-required unlocks, direct inventory writes, ticket issuance, and progression bypasses remain blocked in review-only mode.

This decision is recorded in `docs/adr/0502-reward-collection-runtime-boundary.md` and `docs/decision-register/DR-573-reward-collection-runtime-boundary.md`.

## DR-574: Feature Entitlement Runtime Boundary

Status: Accepted

Decision: Add a provider-neutral feature entitlement runtime contract and review-only adapter for optional, premium, privacy-sensitive, and cost-bearing tenant capabilities.

Rationale:

- White-label tenants need to adopt AI Tutor, microphone practice, local companion, reports, assignments, media, or assist-language packages independently.
- Package catalog visibility or a teacher UI toggle must not become an implicit billing, recording, AI dispatch, or student-unlock path.
- A shared runtime keeps hosted-first cost control compatible with local and hybrid deployments.

Guardrails:

- AI Tutor requires premium or enterprise entitlement and remains optional.
- Microphone practice requires teacher/school, privacy, and cost approval.
- Review-only execution blocks activation, billing, recording, AI dispatch, student unlocks, persistence, and release mutation.

This decision is recorded in `docs/adr/0503-feature-entitlement-runtime-boundary.md` and `docs/decision-register/DR-574-feature-entitlement-runtime-boundary.md`.

## DR-575: Runtime Behavior Verification

Status: Accepted

Decision: Add a deterministic compiled-contract behavior harness to the canonical foundation verification command.

Rationale:

- Focused source-marker verifiers can confirm that safeguards are documented without proving the decision functions return the intended blocks.
- Representative negative behavior is especially important for target-language authority, child-safe rewards, recovery privacy, and premium feature cost controls.
- A local Node-based harness keeps the foundation check low-cost and provider-neutral.

Guardrails:

- The harness exercises rejection cases and no-side-effect behavior only; it does not call providers, write storage, activate features, or collect learner data.
- The harness compiles the shared TypeScript contracts so the tested behavior is the actual shared contract.

This decision is recorded in `docs/adr/0504-runtime-behavior-verification.md` and `docs/decision-register/DR-575-runtime-behavior-verification.md`.

## DR-576: Ingestion, Asset, And Release Behavior Verification

Status: Accepted

Decision: Extend the compiled-contract behavior harness to cover multimedia asset safety, textbook source ingestion safety, and release-control behavior.

Rationale:

- The platform's promised white-label workflow depends on PDF/text intake and image, audio, video, and font assets, so these boundaries need executable proof before live upload or promotion work begins.
- Static readiness verifiers can confirm that policy language exists without proving that learner media, raw source payloads, or release mutations are rejected at runtime.
- A satisfied release evidence case is useful as a contract test only when the review-only adapter still proves that no provider side effect occurs.

Guardrails:

- Learner-recorded media remains excluded from the core asset runtime.
- Raw source files cannot become student payloads, even when extraction evidence is otherwise complete.
- Asset, source, and release review-only adapters remain provider-neutral and return `sideEffect: "none"`.
- The harness does not upload files, call providers, mutate storage, activate releases, or collect learner data.

This decision is recorded in `docs/adr/0505-ingestion-asset-release-behavior-verification.md` and `docs/decision-register/DR-576-ingestion-asset-release-behavior-verification.md`.

## DR-577: Classroom Doorway Behavior Verification

Status: Accepted

Decision: Extend the compiled-contract behavior harness to cover content package, QR launch, and teacher assignment runtime boundaries.

Rationale:

- Teacher QR/front-door onboarding is the bridge between reviewed textbook content and student self-progression.
- Tenant mismatch, support-language progression, and assignment shortcuts must be rejected at the shared contract layer rather than relying on route components.
- Hosted, local, and hybrid deployment paths need one provider-neutral classroom boundary.

Guardrails:

- Package tenant mismatch remains blocked.
- Support-language and media-only progress remain blocked in launch and assignment requests.
- Review-only package, launch, and assignment adapters return `sideEffect: "none"`.
- The harness performs no classroom activation, roster binding, QR mutation, report stream creation, assignment write, or learner-data collection.

This decision is recorded in `docs/adr/0506-classroom-doorway-behavior-verification.md` and `docs/decision-register/DR-577-classroom-doorway-behavior-verification.md`.

## DR-578: Persistence And Teacher Report Behavior Verification

Status: Accepted

Decision: Extend the compiled-contract behavior harness to cover persistence privacy and teacher-report export boundaries.

Rationale:

- Reports are useful to teachers, but their preview UI must not be mistaken for permission to store or export learner data.
- Raw microphone audio and learner transcripts are explicitly outside the core persistence/report product boundary.
- Pseudonymous learner slots preserve the white-label platform's privacy posture while leaving future school-specific identity policies configurable.

Guardrails:

- Raw learner audio and transcripts remain blocked from core persistence and reports.
- Core reports remain pseudonymous-slot-only.
- Mutation and export require separate policy, release, persistence, and approval evidence.
- Review-only persistence and report adapters return `sideEffect: "none"`.

This decision is recorded in `docs/adr/0507-persistence-report-behavior-verification.md` and `docs/decision-register/DR-578-persistence-report-behavior-verification.md`.

## DR-579: AI Authoring Behavior Verification

Status: Accepted

Decision: Extend the compiled-contract behavior harness to execute the AI authoring service's pedagogical and provider-dispatch safeguards.

Rationale:

- The AI service contract already defines the canonical 8–12 vocabulary rule, exactly two sentence structures, target-language audio, and media-rights gates.
- Static marker checks do not prove that an invalid request is rejected or that a prepared result remains review-only.
- Executable behavior evidence is required before any model provider or Z.ai prototype can enter integration review.

Guardrails:

- Invalid vocabulary and sentence counts remain blocked.
- Missing target-language audio and media-rights evidence remain blocked.
- `providerDispatchAllowed` remains false and the result remains `review-only`.
- The harness performs no provider call, billing, source write, package write, route write, assignment activation, or support-language progression.

This decision is recorded in `docs/adr/0508-ai-authoring-behavior-verification.md` and `docs/decision-register/DR-579-ai-authoring-behavior-verification.md`.

## DR-580: Assist-Language Script Behavior Verification

Status: Accepted

Decision: Execute the shared Japanese assist-language script validator in the compiled foundation behavior harness.

Rationale:

- Young Foundation, Bronze, and Plus learners need hiragana-only support when Japanese assist is enabled.
- Silver-or-later mixed script is useful, but only after an explicit reviewed policy.
- Generated or tenant-provided glosses must not bypass these constraints through the UI.

Guardrails:

- Early-level student-visible Japanese mixed script is rejected.
- Hiragana-only plans containing katakana or kanji are rejected.
- Later-level mixed script requires reviewed policy.
- Assist language remains support-only and cannot enter progression authority.

This decision is recorded in `docs/adr/0509-assist-language-script-behavior-verification.md` and `docs/decision-register/DR-580-assist-language-script-behavior-verification.md`.

## DR-581: Premium And Microphone Entitlement Behavior Verification

Status: Accepted

Decision: Execute microphone and premium AI Tutor entitlement behavior in the compiled foundation harness.

Rationale:

- Microphone access can create privacy and cost obligations even when recording is local.
- AI Tutor is an optional paid package and must not become a hidden dependency of core student progression.
- Contract validation must distinguish a complete premium request from actual provider activation.

Guardrails:

- Core-tier AI Tutor is rejected.
- Review-only microphone practice is rejected.
- Premium validation requires teacher, school, privacy, cost, persistence, release, usage, level, and target-audio gates.
- Review-only execution returns `sideEffect: "none"`.

This decision is recorded in `docs/adr/0510-premium-microphone-entitlement-behavior-verification.md` and `docs/decision-register/DR-581-premium-microphone-entitlement-behavior-verification.md`.

## DR-582: Continuity And Deployment Behavior Verification

Status: Accepted

Decision: Execute hosted-managed and non-hosted recovery behavior in the compiled foundation harness.

Rationale:

- The white-label product must support a hosted-first path while preserving future local-classroom and hybrid options.
- Local fallback evidence is a distinct requirement and must not be silently inferred from hosted readiness.
- Recovery and rollback are safety-critical operations that must remain blocked until their specific state and evidence gates close.

Guardrails:

- Local and hybrid requests require reviewed fallback evidence.
- Hosted requests still require all privacy, integrity, policy, and release gates.
- Restore and rollback state rules remain explicit.
- Review-only recovery execution returns `sideEffect: "none"`.

This decision is recorded in `docs/adr/0511-continuity-deployment-behavior-verification.md` and `docs/decision-register/DR-582-continuity-deployment-behavior-verification.md`.

## DR-583: Deterministic Progression And Star Dust Behavior Verification

Status: Accepted

Decision: Execute student entry progression and Star Dust calculation behavior in the compiled foundation harness.

Rationale:

- The product promise depends on a clear teacher-led entry practice followed by student self-progression.
- Unlocks and scoring must be reproducible for teacher reports, retries, and future game engines.
- Deterministic scoring provides engagement without gambling-like pressure or hidden randomness.

Guardrails:

- Entry practice is the only initial unlock path.
- Only reviewed recommended modes are unlocked after completion.
- Star Dust is bounded to 1,000 per unit.
- Support-only evidence cannot unlock or score.

This decision is recorded in `docs/adr/0512-deterministic-progression-stardust-behavior-verification.md` and `docs/decision-register/DR-583-deterministic-progression-stardust-behavior-verification.md`.

## DR-584: Audio-First Package Behavior Verification

Status: Accepted

Decision: Require every learner-facing unit audio support plan to declare its target language, cover the required vocabulary and sentence cues, resolve referenced cues, and match the runtime target language.

Rationale:

- Young and multilingual learners need reliable audio support across the whole unit and every game pathway.
- A package-level language declaration prevents an audio-complete-looking package from silently mixing target and support language cues.
- The same rule must protect MiniStar and future white-label tenants without selecting a vendor or recording provider.

Guardrails:

- Missing audio plans are rejected for learner-facing units.
- Required plans must cover all vocabulary terms and target sentence structures.
- Referenced learner-facing cues must exist and match the plan target language.
- Runtime target-language mismatch is rejected.
- Review-only validation has no package, storage, route, recording, provider, or progression side effects.

This decision is recorded in `docs/adr/0513-audio-first-package-behavior-verification.md` and `docs/decision-register/DR-584-audio-first-package-behavior-verification.md`.

## DR-585: Audio Cue Semantic Coverage

Status: Accepted

Decision: Validate the semantic kind of cues assigned to vocabulary and sentence coverage arrays.

Rationale:

- A count-complete audio package can still attach the wrong learner-facing cue to a required learning target.
- Parent engines and future AI/game adapters need stable term-versus-sentence evidence at the package boundary.

Guardrails:

- Vocabulary arrays accept only `term` cues.
- Sentence arrays accept only `sentence` cues.
- Wrong cue kinds are rejected before release or student-facing use.
- Review-only validation remains side-effect free.

This decision is recorded in `docs/adr/0514-audio-cue-semantic-coverage.md` and `docs/decision-register/DR-585-audio-cue-semantic-coverage.md`.

## DR-586: Pedagogical Text Integrity

Status: Accepted

Decision: Reject blank vocabulary terms, duplicate vocabulary terms, and blank target sentence structures at both shared package and AI authoring boundaries.

Rationale:

- Count-only validation can admit unusable content into audio, game, and teacher-review pathways.
- The same rules must protect imported textbook content, tenant-authored content, and AI-generated drafts.

Guardrails:

- Terms are trimmed and compared case-insensitively for uniqueness.
- Blank terms and blank target sentences are rejected.
- The canonical 8-12 term and exactly-two-sentence rules remain unchanged.
- No provider, route, package, or student state is mutated by validation.

This decision is recorded in `docs/adr/0515-pedagogical-text-integrity.md` and `docs/decision-register/DR-586-pedagogical-text-integrity.md`.

## DR-587: Unit Metadata And Teacher Launch Integrity

Status: Accepted

Decision: Reject units with invalid level/module/unit identity, missing theme or engine identifiers, incomplete visual rules, or incomplete teacher launch protocol copy.

Rationale:

- Unit metadata feeds routing, game selection, audio mapping, reports, QR paths, and tenant review.
- Teacher-led onboarding cannot be reliable if the launch protocol is blank or structurally incomplete.

Guardrails:

- Level 1-8 and positive module/unit numbering are enforced.
- Theme, mode, family, parent engine, avatar family, character focus, hook, activity, and review are required.
- Blacklist validation remains separate and mandatory.
- Validation has no route, package, provider, or student-state side effects.

This decision is recorded in `docs/adr/0516-unit-metadata-teacher-launch-integrity.md` and `docs/decision-register/DR-587-unit-metadata-teacher-launch-integrity.md`.

## DR-588: Content Package Metadata Integrity

Status: Accepted

Decision: Require valid package creation timestamps and chronologically valid optional update timestamps before a content package can enter review or runtime readiness.

Rationale:

- Package metadata is reused by audit, release, persistence, recovery, reporting, and tenant isolation workflows.
- Invalid or reversed timestamps undermine lineage and make future provider behavior difficult to audit.

Guardrails:

- Creation timestamp is required and parseable.
- Update timestamp is optional, parseable when present, and cannot precede creation.
- Validation remains provider-neutral and side-effect free.

This decision is recorded in `docs/adr/0517-content-package-metadata-integrity.md` and `docs/decision-register/DR-588-content-package-metadata-integrity.md`.

## DR-589: Audio Cue Identity Integrity

Status: Accepted

Decision: Reject duplicate audio cue IDs within a content package.

Rationale:

- Audio plans resolve by cue ID, so duplicate IDs create ambiguous learner-facing behavior.
- Silent set collapsing can hide a content-package authoring or import error.

Guardrails:

- Duplicate cue IDs are rejected before plan resolution and release.
- Existing tenant, unit, language, and text validation remains active.
- Validation remains side-effect free.

This decision is recorded in `docs/adr/0518-audio-cue-identity-integrity.md` and `docs/decision-register/DR-589-audio-cue-identity-integrity.md`.

## DR-590: Media Asset Metadata Integrity

Status: Accepted

Decision: Require reliable identity, title, type/kind compatibility, and safe optional duration metadata for package media assets.

Rationale:

- Future image, audio, video, labelled-diagram, playlist, and game-background workflows need stable asset records before provider integration.
- A malformed metadata record can pass a review surface while breaking rights, mapping, reporting, or local-bundle evidence.

Guardrails:

- Asset ID and title are required.
- Audio/video type compatibility remains enforced.
- Duration is finite and non-negative when present.
- Upload, storage, transcode, release, and student use remain blocked by their separate gates.

This decision is recorded in `docs/adr/0519-media-asset-metadata-integrity.md` and `docs/decision-register/DR-590-media-asset-metadata-integrity.md`.

## DR-591: Approved Package Rights And Placeholder Safety

Status: Accepted

Decision: Reject unknown media rights and placeholder learner audio when a content package claims approved review status.

Rationale:

- Approval is a release evidence claim, not merely a display label.
- Unknown rights and placeholder audio are acceptable repair states only when visibly blocked from student use.

Guardrails:

- Approved packages require known media rights.
- Approved packages cannot contain placeholder audio cues.
- Draft/reviewed repair evidence remains allowed but cannot activate release.
- Separate release, storage, upload, QR, assignment, and policy gates remain mandatory.

This decision is recorded in `docs/adr/0520-approved-package-rights-placeholder-safety.md` and `docs/decision-register/DR-591-approved-package-rights-placeholder-safety.md`.

## DR-592: Playlist And Multimedia Relation Integrity

Status: Accepted

Decision: Require every playlist and multimedia plan to describe one unambiguous, structurally usable media pathway.

Rationale:

- An empty or unnamed playlist cannot support teacher review, student playback, local fallback, or later release evidence.
- Repeated media IDs create duplicate playback and ambiguous analytics inside a playlist.
- Multiple multimedia plans for one unit create competing background and playlist policy.
- Default-enabled background media without an asset falsely signals a playable configuration.

Guardrails:

- Playlist identifiers, titles, and at least one media asset are required.
- A playlist cannot repeat a media asset ID.
- A content package has at most one multimedia plan per unit.
- Background media cannot be enabled by default without a declared background asset.
- Storage, upload, playback, release, QR, and student use remain behind their separate gates.

This decision is recorded in `docs/adr/0521-playlist-multimedia-relation-integrity.md` and `docs/decision-register/DR-592-playlist-multimedia-relation-integrity.md`.

## DR-593: Approved Media Provenance And Locators

Status: Accepted

Decision: Require approved media assets to identify an owner and provide at least one hosted or local delivery locator.

Rationale:

- Rights approval without ownership provenance is not durable enough for a white-label release record.
- A media asset with no hosted or local locator cannot support the permitted delivery modes represented by the package.
- Tenants may still choose hosted-only, local-only, or hybrid deployment later through separate runtime gates.

Guardrails:

- Approved media assets require a non-empty owner name.
- Approved media assets require a non-empty `sourceUri` or `localBundlePath`.
- Unknown rights and placeholder learner audio remain blocked for approved packages.
- Upload, storage, checksum, scan, release, QR, and student-use behavior remain gated separately.

This decision is recorded in `docs/adr/0522-approved-media-provenance-and-locators.md` and `docs/decision-register/DR-593-approved-media-provenance-and-locators.md`.

## DR-594: Approved Video Accessibility Evidence

Status: Accepted

Decision: Require approved video media assets to provide poster and transcript/caption references.

Rationale:

- Video should have a stable visual fallback before it is treated as release evidence.
- Transcript or caption references support access when audio cannot be heard and provide a reviewable accessibility record.
- Video remains optional enrichment and must not replace target-language learning audio.

Guardrails:

- Approved videos require a non-empty poster reference.
- Approved videos require a non-empty transcript or caption reference.
- Draft/reviewed repair states remain allowed but cannot activate release.
- Upload, storage, rights, release, QR, and student-use gates remain separate.

This decision is recorded in `docs/adr/0523-approved-video-accessibility-evidence.md` and `docs/decision-register/DR-594-approved-video-accessibility-evidence.md`.

## DR-595: Audio Cue Media Binding Integrity

Status: Accepted

Decision: Validate every optional audio cue media-asset reference against package existence, audio kind, tenant, and unit boundaries.

Rationale:

- A cue can pass text and language validation while still resolving to missing or incorrect media.
- Cross-tenant or cross-unit audio references can leak white-label content or play the wrong lesson.
- Some cues are generated by text-to-speech or fallback voice and should remain valid without a media asset ID.

Guardrails:

- Referenced media assets must exist in the package.
- Referenced media assets must be audio assets.
- Cue and asset tenant boundaries must match.
- Cue and asset unit boundaries must match when both are present.
- Provider selection, storage, upload, playback, release, and student use remain separate.

This decision is recorded in `docs/adr/0524-audio-cue-media-binding-integrity.md` and `docs/decision-register/DR-595-audio-cue-media-binding-integrity.md`.

## DR-596: Recorded Audio Delivery Locators

Status: Accepted

Decision: Require recorded, teacher-recorded, and partner-provided audio cues to identify a media asset or direct hosted/local delivery locator.

Rationale:

- Audio coverage must describe something that can actually be delivered to the learner.
- A recorded cue with only text metadata can create a false sense of readiness and fail silently in games.
- Text-to-speech and fallback voice cues need to remain provider-neutral and should not be forced into a file-based workflow.

Guardrails:

- Recorded, teacher-recorded, and partner-provided cues require a media asset ID, `sourceUri`, or `localBundlePath`.
- Media asset references still pass the package, kind, tenant, and unit binding checks.
- Placeholder cues remain repair evidence only and cannot enter approved packages.
- Upload, storage, provider billing, release, and student use remain separately gated.

This decision is recorded in `docs/adr/0525-recorded-audio-delivery-locators.md` and `docs/decision-register/DR-596-recorded-audio-delivery-locators.md`.

## DR-597: Audio Coverage Uniqueness

Status: Accepted

Decision: Reject repeated cue IDs within one audio coverage group while allowing deliberate reuse across separate coverage groups.

Rationale:

- Repeated IDs can inflate vocabulary, sentence, instruction, feedback, or game-mode coverage counts.
- General unit coverage and per-game coverage may legitimately reuse the same learner audio.
- A stable distinction between duplicate package cues and intentional coverage reuse keeps the schema useful for all parent engines.

Guardrails:

- Vocabulary, sentence, instruction, feedback, and each game-mode array must be internally unique.
- Cross-group reuse remains allowed.
- Duplicate package cue IDs remain rejected separately.
- No provider, storage, playback, release, or student-state side effect is introduced.

This decision is recorded in `docs/adr/0526-audio-coverage-uniqueness.md` and `docs/decision-register/DR-597-audio-coverage-uniqueness.md`.

## DR-598: Audio Cue Semantic Coverage

Status: Accepted

Decision: Enforce semantic cue kinds for vocabulary, sentence, instruction, and feedback coverage lanes.

Rationale:

- Correct language and file resolution do not guarantee that a cue is appropriate for the engine role that references it.
- A sentence or vocabulary cue cannot reliably replace an instruction or feedback cue in a young-learner game flow.
- Game-mode arrays can remain flexible because they intentionally combine terms, sentences, instructions, and feedback.

Guardrails:

- Vocabulary arrays require term cues.
- Sentence arrays require sentence cues.
- Instruction arrays require instruction cues.
- Feedback arrays require feedback cues.
- Missing, wrong-language, duplicate, and cross-tenant cue errors remain separate checks.

This decision is recorded in `docs/adr/0527-audio-cue-semantic-coverage.md` and `docs/decision-register/DR-598-audio-cue-semantic-coverage.md`.

## DR-599: Audio Cue Canonical Text And Unit Binding

Status: Accepted

Decision: Require vocabulary and sentence audio cues to match canonical unit text, and require every cue referenced by a unit audio plan to be explicitly bound to that unit.

Rationale:

- A cue can have the correct language and semantic kind while still teaching the wrong word or sentence.
- Unbound or cross-unit cues can make imported packages appear complete while delivering the wrong learner experience.
- Exact canonical matching keeps teacher review, game rendering, and future provider delivery aligned without forcing a storage implementation.

Guardrails:

- Vocabulary cue text matches a canonical vocabulary term after whitespace and case normalization.
- Sentence cue text matches a canonical target sentence after whitespace and case normalization.
- All referenced learner-facing cues must use the same unit key as the audio support plan.
- Instruction and feedback cues remain type-checked and unit-bound without requiring canonical sentence matching.
- No provider, storage, playback, release, assignment, or student-state side effect is introduced.

This decision is recorded in `docs/adr/0528-audio-cue-canonical-text-and-unit-binding.md` and `docs/decision-register/DR-599-audio-cue-canonical-text-and-unit-binding.md`.

## DR-600: Game-Mode Audio Coverage

Status: Accepted

Decision: Restrict game-mode audio coverage to supported curated modes and learner-facing cue kinds, while rejecting conflicting cue-level game-mode metadata.

Rationale:

- Imported JSON can carry a syntactically valid cue that is semantically a UI label or story line rather than gameplay support.
- A cue that declares one mode but is placed in another creates misleading review evidence and future engine behavior.
- Curated mode validation protects the white-label pathway catalog without removing intentional cross-mode reuse.

Guardrails:

- Coverage keys must be supported game modes.
- Term, sentence, instruction, and feedback cues are allowed in game-mode coverage.
- UI-label and story-line cues cannot satisfy game-mode coverage.
- Declared cue mode must match the coverage lane when present.
- A cue with no mode declaration may be reused across curated modes.
- No provider, storage, playback, release, assignment, or student-state side effect is introduced.

This decision is recorded in `docs/adr/0529-game-mode-audio-coverage.md` and `docs/decision-register/DR-600-game-mode-audio-coverage.md`.

## DR-601: Background Media Mode Policy

Status: Accepted

Decision: Require multimedia plans to use unique, supported curated game-mode IDs when declaring allowed background media modes.

Rationale:

- Background media needs an explicit mode policy before it can be attached to a parent engine.
- Duplicate or unknown mode IDs create ambiguous review evidence and make future teacher settings unsafe to interpret.
- The policy must remain subordinate to target-language audio and learning events.

Guardrails:

- Allowed background mode IDs must be supported curated game modes.
- Duplicate allowed mode IDs are rejected.
- Review validation does not enable autoplay, volume changes, storage writes, or student progression.
- Audio priority, teacher controls, rights, and release gates remain separate.

This decision is recorded in `docs/adr/0530-background-media-mode-policy.md` and `docs/decision-register/DR-601-background-media-mode-policy.md`.

## DR-603: Playlist Role And Playback Context

Status: Accepted

Require playlists declared for `game-background` playback to use the `background` usage role.

Rationale:

- Playlist metadata is consumed by teacher review, game adapters, and local package manifests.
- A contradictory role can make primary learning media appear to be optional ambient media.
- The check keeps learning audio priority understandable without implementing playback.

Guardrails:

- `game-background` context requires `background` role.
- Rights, tenant, unit, teacher enablement, and audio-priority checks remain separate.
- No playback, volume, progress, persistence, or release side effect is introduced.

This decision is recorded in `docs/adr/0531-playlist-role-playback-context.md` and `docs/decision-register/DR-603-playlist-role-playback-context.md`.

## DR-604: Media And Audio Enum Integrity

Status: Accepted

Decision: Validate runtime media, audio, and playlist enum values against the supported content-model catalog.

Rationale:

- PDF extraction, AI generation, and tenant imports arrive as runtime data and bypass TypeScript's compile-time protection.
- An unknown media type, cue source, or playlist context can pass structural checks and confuse future adapters.
- Explicit value validation gives teachers a deterministic repair message before release review.

Guardrails:

- Media asset type, kind, and rights status are checked.
- Audio cue kind and source are checked.
- Playlist usage role and playback context are checked.
- No provider, storage, playback, release, assignment, or student-state side effect is introduced.

This decision is recorded in `docs/adr/0532-media-audio-enum-integrity.md` and `docs/decision-register/DR-604-media-audio-enum-integrity.md`.

## DR-605: Unit Metadata Catalog Integrity

Status: Accepted

Decision: Validate unit game mode, game family, and parent engine identifiers against the shared curated catalogs before runtime consumers interpret a unit.

Rationale:

- Imported PDF extraction, AI drafts, and tenant JSON arrive at runtime and bypass TypeScript's compile-time unions.
- Unknown identifiers can appear structurally valid while routing content to an undefined or incompatible engine.
- Silent fallback would make review evidence and future white-label integrations difficult to audit.

Guardrails:

- Supported game modes, families, and parent engines are checked explicitly.
- Unknown values remain review blockers and are not automatically remapped.
- New catalog values require a deliberate catalog, compatibility, and regression update.
- No provider, storage, playback, release, assignment, or student-state side effect is introduced.

This decision is recorded in `docs/adr/0533-unit-metadata-enum-integrity.md` and `docs/decision-register/DR-605-unit-metadata-enum-integrity.md`.

## DR-606: Unit Mode Compatibility

Status: Accepted

Decision: Validate each unit's game mode against its declared game family, parent engine, and supported curriculum levels using a shared content-model compatibility contract.

Rationale:

- Valid enum values can still describe an impossible routing combination.
- A mode's engine, pedagogy, audio expectations, scoring profile, and level range are one compatibility boundary.
- Silent inference would allow imported or AI-authored packages to drift from the curated pathway catalog.

Guardrails:

- Every supported mode has one family, one parent engine, and an explicit supported-level list.
- Family, engine, and level mismatches remain review blockers.
- Changes require compatibility, route, audio, scoring, and regression review.
- No provider, storage, playback, release, assignment, or student-state side effect is introduced.

This decision is recorded in `docs/adr/0534-unit-mode-compatibility.md` and `docs/decision-register/DR-606-unit-mode-compatibility.md`.

## DR-607: Cross-Catalog Game Contract

Status: Accepted

Decision: Extend the existing game-mode verification gate to compare the shared content-model compatibility contract with the web game catalog for every mode.

Rationale:

- The runtime validator and web UI catalog carry related contract data in separate layers.
- A change in one layer can otherwise leave review, routing, or student-facing metadata inconsistent.
- One existing verification gate is cheaper and easier to maintain than parallel drift checks.

Guardrails:

- Every `GameModeId` must have one content-model compatibility entry and one web catalog entry.
- Family, parent engine, and supported-level ranges must match exactly.
- Missing, extra, and duplicate entries fail the game-mode verification gate.
- New modes still require route, scoring, audio, replay, and compatibility evidence.

This decision is recorded in `docs/adr/0535-cross-catalog-game-contract.md` and `docs/decision-register/DR-607-cross-catalog-game-contract.md`.

## DR-608: Game Catalog Pedagogical Contract

Status: Accepted

Decision: Extend the existing game-mode verification gate to validate each catalog item's identity, two-sentence requirement, term-range bounds, and supported-level list.

Rationale:

- Catalog fields are runtime-facing pathway metadata, not decorative labels.
- A malformed level list or term range can make a reviewed unit appear available when the activity cannot safely support it.
- The canonical unit contract requires two target sentence structures, while individual modes may use a narrower active-term range for presentation.

Guardrails:

- Catalog IDs must match their keys.
- `requiredSentenceCount` must be exactly 2.
- Recommended term ranges must be ordered and within 1–12.
- Supported levels must be non-empty, unique, ascending, and within 1–8.
- No provider, storage, playback, release, assignment, or student-state side effect is introduced.

This decision is recorded in `docs/adr/0536-game-catalog-pedagogical-contract.md` and `docs/decision-register/DR-608-game-catalog-pedagogical-contract.md`.

## DR-609: Background Media Mode Capability

Status: Accepted

Decision: Make background-media capability part of the shared mode contract and reject multimedia plans that name a mode without that capability.

Rationale:

- Background media is suitable for light recall or arcade contexts but can interfere with precision listening, speaking, spelling, or syntax work.
- A supported mode ID alone does not prove that ambient media is appropriate.
- The web catalog and package validator must agree before teacher settings can interpret the plan.

Guardrails:

- Capability is explicit per curated mode.
- Disallowed modes remain package review blockers.
- Learning audio remains higher priority and ambient media cannot create progress.
- No playback, autoplay, persistence, or student-state side effect is introduced.

This decision is recorded in `docs/adr/0537-background-media-mode-capability.md` and `docs/decision-register/DR-609-background-media-mode-capability.md`.

## DR-610: Game Catalog Learner-Facing Metadata

Status: Accepted

Decision: Extend the game-mode verification gate to validate each catalog item's learner role, skill focus, summary, and explicit background-media capability.

Rationale:

- Teacher pathway review depends on more than routing and scoring identifiers.
- Missing or invalid learner-facing metadata can make a technically available mode misleading or unusable.
- Explicit validation is cheaper than discovering catalog omissions during game integration.

Guardrails:

- Roles are limited to entry practice, reinforcement, assessment, or review.
- Skill focus is limited to the shared catalog vocabulary.
- Summaries must be non-empty.
- Background-media capability must be explicitly true or false.
- No provider, storage, playback, release, assignment, or student-state side effect is introduced.

This decision is recorded in `docs/adr/0538-game-catalog-learner-metadata.md` and `docs/decision-register/DR-610-game-catalog-learner-metadata.md`.

## DR-611: Scoring Profile Compatibility

Status: Accepted

Decision: Require each scoring profile to declare supported parent engines, learner roles, and skill focuses, and verify that every catalog mode's selected profile accepts those three dimensions.

Rationale:

- A profile ID can exist while still being semantically wrong for a mode.
- Engine, role, and skill metadata are already part of the curated catalog and provide the minimum compatibility boundary for deterministic scoring.
- A static verification gate is cheaper and safer than discovering scoring drift during game integration or learner testing.

Guardrails:

- Every profile must declare supported engines, roles, and skill focuses.
- Every mode must reference a profile whose declarations include the mode's catalog values.
- Drift fails the game-mode verification gate before build or release review.
- No dust award, progression unlock, inventory write, or provider activation occurs during verification.

This decision is recorded in `docs/adr/0539-scoring-profile-compatibility.md` and `docs/decision-register/DR-611-scoring-profile-compatibility.md`.

## DR-612: Deterministic Scoring Math

Status: Accepted

Decision: Validate scoring profile arithmetic and clamp accuracy-derived awards to each profile's declared completion cap.

Rationale:

- Semantic compatibility does not guarantee safe reward math.
- Exact component totals make teacher-visible scoring explainable and auditable.
- Clamping prevents a future caller's minimum award from exceeding the profile contract.

Guardrails:

- Award components and caps are non-negative integers.
- Component totals must equal the completion cap.
- Completion caps cannot exceed 1,000 Star Dust per unit.
- Accuracy helpers cannot return more than the selected profile cap.
- Verification and helpers remain side-effect free.

This decision is recorded in `docs/adr/0540-deterministic-scoring-math.md` and `docs/decision-register/DR-612-deterministic-scoring-math.md`.

## DR-613: Progression Award Normalization

Status: Accepted

Decision: Normalize malformed Star Dust inputs at the shared calculator and local completion-adapter boundaries before calculation or completion-event emission.

Rationale:

- A safe profile can still receive malformed counts or award values from a future adapter.
- Event metadata and learner state must not disagree about the award that was applied.
- Normalization keeps local proof-of-concept progression deterministic while hosted persistence remains blocked.

Guardrails:

- Negative, fractional, and non-finite calculation inputs are normalized safely.
- Local completion awards are non-negative integers capped at 1,000.
- Completion metadata and local state use the same normalized value.
- Normalization does not write persistence, inventory, reports, or unlock providers.

This decision is recorded in `docs/adr/0541-progression-award-normalization.md` and `docs/decision-register/DR-613-progression-award-normalization.md`.

## DR-614: Reserved Completion Metadata

Status: Accepted

Decision: Treat normalized `earnedStarDust` as platform-owned completion metadata and write it after optional game metadata.

Rationale:

- Game-specific metadata is useful for explanation but must not become score authority.
- Merge order can otherwise allow a caller to disagree with local progression state.
- A reserved-field rule is inexpensive and keeps future adapters deterministic.

Guardrails:

- Optional metadata is merged first.
- The normalized award is written last and must match progression state.
- No persistence, inventory, reporting, or unlock side effect is introduced.

This decision is recorded in `docs/adr/0542-reserved-completion-metadata.md` and `docs/decision-register/DR-614-reserved-completion-metadata.md`.

## DR-615: Progress Event Timestamps

Status: Accepted

Decision: Require progress-event envelopes to use parseable ISO/RFC3339 timestamps with an explicit timezone.

Rationale:

- Reports and replay need unambiguous cross-device and cross-region event times.
- Date-only and locale-formatted strings can parse differently across runtimes.
- A strict envelope check is inexpensive before persistence or hosted adapters exist.

Guardrails:

- UTC `Z` or a numeric timezone offset is required.
- Invalid and date-only values block envelope validation.
- Timestamp validation does not authorize progression, persistence, reporting, or storage writes.

This decision is recorded in `docs/adr/0543-progress-event-timestamps.md` and `docs/decision-register/DR-615-progress-event-timestamps.md`.

## DR-616: Progress Event Mode Identity

Status: Accepted

Decision: Require progress-event envelopes to use a supported shared `GameModeId` from the content-model catalog.

Rationale:

- Event telemetry must remain aligned with curated catalog, engine, scoring, audio, and reporting contracts.
- A non-empty but unknown mode string could create an unreviewed evidence lane.
- Reusing the shared catalog helper avoids a second, drifting telemetry allowlist.

Guardrails:

- Unknown and retired mode IDs block envelope validation.
- Catalog changes require dependent contract and runtime verification updates.
- Mode identity validation remains review-only and does not enable gameplay, scoring, persistence, or provider writes.

This decision is recorded in `docs/adr/0544-progress-event-mode-identity.md` and `docs/decision-register/DR-616-progress-event-mode-identity.md`.

## DR-617: Progress Event Unit Identity

Status: Accepted

Decision: Require progress-event envelopes to use the canonical tenant, curriculum, level, and unit key format.

Rationale:

- Reports, replay, migration, and hosted/local reconciliation need one stable content-unit identity.
- A non-empty generic unit label could disconnect evidence from the reviewed curriculum package.
- Reusing the shared canonical key contract preserves white-label tenant and curriculum boundaries.

Guardrails:

- Levels must remain 1 through 8 and unit numbers must be positive integers.
- Tenant and curriculum segments must be non-empty and free of structural separators and whitespace.
- Unit identity validation remains review-only and does not enable gameplay, scoring, persistence, or provider writes.

This decision is recorded in `docs/adr/0545-progress-event-unit-identity.md` and `docs/decision-register/DR-617-progress-event-unit-identity.md`.

## DR-618: Progress Event Mode-Level Compatibility

Status: Accepted

Decision: Require progress-event envelopes to use a mode supported at the level encoded in their canonical unit key.

Rationale:

- A valid mode and valid unit can still describe an impossible curriculum pathway when their level contracts disagree.
- Event evidence must align with the same curated mode contract used by unit validation and activity pathways.
- Reusing the shared catalog prevents a telemetry-only compatibility matrix from drifting.

Guardrails:

- The level is read from the canonical unit key.
- Valid-but-unavailable mode-level combinations block envelope validation.
- Compatibility validation remains review-only and does not enable gameplay, scoring, persistence, or provider writes.

This decision is recorded in `docs/adr/0546-progress-event-mode-level-compatibility.md` and `docs/decision-register/DR-618-progress-event-mode-level-compatibility.md`.

## DR-619: Progress Event Type Identity

Status: Accepted

Decision: Require progress-event envelopes and taxonomy registries to use the reviewed shared event taxonomy categories.

Rationale:

- Runtime JSON must not invent a new evidence event through an arbitrary event name.
- An effect label alone is insufficient without a known event contract and teacher-facing interpretation.
- Reusing the existing support-only, report-only, and progress-affecting sets avoids a second event vocabulary.

Guardrails:

- Unknown event types block registry and envelope validation.
- New events require coordinated type, taxonomy, visibility, persistence, and runtime verification updates.
- Event identity validation remains review-only and does not enable gameplay, scoring, persistence, or provider writes.

This decision is recorded in `docs/adr/0547-progress-event-type-identity.md` and `docs/decision-register/DR-619-progress-event-type-identity.md`.

## DR-620: Progress Event Stream Context

Status: Accepted

Decision: Require progress-event streams to remain within one unit and launch identity whenever those fields are present, while allowing multiple learner sessions in a class-scoped report.

Rationale:

- Individual valid events can still produce a contaminated report or persistence batch when contexts are mixed.
- A unit may legitimately contain multiple curated game modes, so mode diversity must remain allowed.
- Context checks are inexpensive before hosted, local, or hybrid report/persistence adapters exist.

Guardrails:

- Multiple modes remain allowed within one canonical unit.
- Multiple unit keys or launch codes block stream validation.
- Multiple student session IDs remain allowed within one launch-scoped teacher report.
- Stream-context validation remains review-only and does not enable gameplay, scoring, persistence, or provider writes.

This decision is recorded in `docs/adr/0548-progress-event-stream-context.md` and `docs/decision-register/DR-620-progress-event-stream-context.md`.

## DR-621: Progress Event Acceptance Gate Consistency

Status: Accepted

Decision: Require progress-event streams to use one `event_acceptance_gate_id` value.

Rationale:

- The acceptance gate binds event evidence to a reviewed session and policy boundary.
- Matching unit and launch identities are not enough if the evidence comes from different gate decisions.
- Multiple modes and learner sessions remain valid inside one classroom launch and gate.

Guardrails:

- Mixed acceptance-gate IDs block stream validation.
- Gate consistency validation remains review-only and does not enable gameplay, scoring, persistence, or provider writes.

This decision is recorded in `docs/adr/0549-progress-event-acceptance-gate-consistency.md` and `docs/decision-register/DR-621-progress-event-acceptance-gate-consistency.md`.

## DR-622: Progress Event Contract Revision Consistency

Status: Accepted

Decision: Require one `taxonomy_version` and one `settings_contract_id` across each progress-event stream.

Rationale:

- A stream must be interpreted under one reviewed taxonomy and settings contract revision.
- Unit, launch, and acceptance-gate identity do not prove that event semantics were produced under the same contract revision.
- Per-mode settings profiles and teacher snapshots may vary because curated modes can have distinct settings.

Guardrails:

- Mixed taxonomy versions or settings contract IDs block stream validation.
- The guard remains review-only and does not enable gameplay, scoring, persistence, or provider writes.

This decision is recorded in `docs/adr/0550-progress-event-contract-revision-consistency.md` and `docs/decision-register/DR-622-progress-event-contract-revision-consistency.md`.

## DR-623: Teacher Report Event Launch Binding

Status: Accepted

Decision: Require every event envelope in a teacher report request to include a `launch_code` matching the runtime `launchCode`.

Rationale:

- The report request is scoped to one classroom launch.
- A stream can be internally consistent and still be unrelated to the requested report if its launch binding is missing or different.
- Generic stream validation remains reusable for pre-launch review contexts, while the report boundary requires stronger identity.

Guardrails:

- Missing launch codes block teacher-report validation.
- Mismatched launch codes block teacher-report validation.
- The guard remains review-only and does not enable export, persistence, gameplay, scoring, or provider writes.

This decision is recorded in `docs/adr/0551-teacher-report-event-launch-binding.md` and `docs/decision-register/DR-623-teacher-report-event-launch-binding.md`.

## DR-624: Teacher Report Tenant Binding

Status: Accepted

Decision: Require every canonical unit key in a teacher report event stream to resolve to the runtime `tenantId`.

Rationale:

- White-label tenant isolation must remain intact in teacher reports and future persistence adapters.
- A valid launch code does not prove that an event belongs to the requesting tenant.
- The shared canonical unit-key parser provides one tenant identity source.

Guardrails:

- Cross-tenant canonical unit keys block teacher-report validation.
- Invalid unit keys remain blocked by the shared envelope validator.
- The guard remains review-only and does not enable export, persistence, gameplay, scoring, or provider writes.

This decision is recorded in `docs/adr/0552-teacher-report-tenant-binding.md` and `docs/decision-register/DR-624-teacher-report-tenant-binding.md`.

## DR-625: Persistence Tenant-Boundary Preservation

Status: Accepted

Decision: Require progress-event and teacher-report durable records and write intents to preserve tenant-boundary evidence.

Rationale:

- White-label isolation must survive storage, backup, local export, and hosted/local adapter selection.
- Runtime validation alone is insufficient if a future provider drops the tenant binding from its record shape.
- One explicit contract flag is cheaper and safer than provider-specific assumptions.

Guardrails:

- Progress-event and teacher-report record contracts fail without tenant-boundary preservation.
- Hosted and local write intents fail without the same guarantee.
- This is review-only contract verification and does not enable storage writes or provider selection.

This decision is recorded in `docs/adr/0553-persistence-tenant-boundary-preservation.md` and `docs/decision-register/DR-625-persistence-tenant-boundary-preservation.md`.

## DR-626: Prototype Integration Readiness Tenant Boundary

Status: Accepted

Decision: Require AI prototype integration-readiness gate and Codex integration-review decision durable records, plus hosted/local write intents, to preserve tenant-boundary evidence.

Rationale:

- External Z.ai, Phaser, and other builder evidence is publisher-scoped review material.
- A readiness gate can look complete while still belonging to a different white-label tenant.
- The storage contract must preserve the same tenant isolation already enforced by report and progress review.

Guardrails:

- Integration readiness gate and Codex decision records fail validation without tenant-boundary preservation.
- Hosted and local readiness-gate and Codex-decision write intents carry the same requirement.
- This remains a no-side-effect foundation check and does not authorize prototype import or app integration.

This decision is recorded in `docs/adr/0554-prototype-integration-readiness-tenant-boundary.md`.

## DR-627: Explicit Tenant Boundary Key

Status: Accepted

Decision: Require tenant-scoped durable records and persistence write intents to name the concrete `tenantBoundaryKey` mapping used by storage.

Rationale:

- A boolean preservation flag does not tell a future hosted or local adapter which field to bind.
- Progress/report evidence and prototype review evidence use different source shapes.
- Explicit mappings reduce provider-specific interpretation and preserve white-label isolation during migration.

Guardrails:

- Progress and teacher-report records use `canonical_unit_key.tenant_id`.
- Prototype readiness and Codex decision records use `tenant_id`.
- Missing mappings fail shared contract validation and do not enable any live writes.

This decision is recorded in `docs/adr/0555-explicit-tenant-boundary-key.md`.

## DR-628: Complete External Prototype Tenant Scope

Status: Accepted

Decision: Apply tenant-boundary preservation and explicit key mapping to the complete external-prototype evidence and patch-review chain, using one shared category list for hosted and local adapters.

Rationale:

- Protecting only the final readiness gate leaves earlier evidence records open to cross-tenant mixing.
- Z.ai and Phaser work can carry fixtures, audio, scoring, and patch artifacts that are as sensitive to tenant scope as the final decision.
- One shared list reduces drift and keeps the white-label boundary maintainable.

Guardrails:

- Missing boundary or key blocks every covered prototype-chain record.
- No direct import, app patch, route mutation, scoring mutation, package promotion, or assignment is enabled.

This decision is recorded in `docs/adr/0556-complete-external-prototype-tenant-scope.md`.

## DR-629: Persistence Contract Alignment

Status: Accepted

Decision: Validate the durable-record contract and hosted/local adapter plans
together for the tenant-bound persistence surface.

Rationale:

- Independent validators can both pass while the two layers drift apart.
- Progress, teacher reports, and the full external-prototype evidence chain
  must preserve white-label tenant isolation through storage and export.
- Review-only records should not be forced into a live adapter before their
  storage requirements are understood.

Guardrails:

- Every shared tenant-bound category must have a durable record and at least
  one adapter intent.
- Adapter intents must reuse the durable record's explicit
  `tenantBoundaryKey`.
- A raw-audio storage declaration cannot be paired with an adapter that
  rejects raw audio.
- This is verification-only and does not select a backend or authorize Z.ai
  prototype import.

This decision is recorded in `docs/adr/0557-persistence-contract-alignment.md`.

## DR-630: Backend Contract Alignment

Status: Accepted

Decision: Treat the vendor-neutral schema draft, migration candidate plan, and
migration specification plan as one cross-checked backend contract.

Rationale:

- A schema entity can exist without a migration target, or a migration spec can
  point to a candidate that no longer exists.
- Provider selection should be based on a complete, internally consistent
  storage surface rather than isolated planning documents.
- Early alignment is cheaper than discovering drift during hosted/local
  migration work.

Guardrails:

- Missing schema targets, orphan migration specs, empty primary keys, empty
  tenant scopes, and duplicate fields block the gate.
- The check is read-only and vendor-neutral.
- It does not enable live backend writes, migrations, provider selection, or
  Z.ai prototype import.

This decision is recorded in `docs/adr/0558-backend-contract-alignment.md`.

## DR-631: External Prototype Evidence Alignment

Status: Accepted

Decision: Treat the complete external prototype evidence packet as one aligned
review surface. Shared tenant and request identity, review-to-plan references,
plan references on all replay reports, and identical mode/parent-engine coverage
must pass before a returned Z.ai or Phaser prototype can advance to manual Codex
integration review.

Rationale:

- Independent evidence validators can all pass while describing different
  requests, tenants, plans, or game modes.
- Cross-tenant or cross-request evidence would weaken white-label isolation and
  make a future integration decision unreliable.
- A read-only alignment gate is cheaper and safer than discovering packet drift
  during an app patch or student-route rehearsal.

Guardrails:

- Missing or mismatched IDs, missing modes, duplicate modes, and changed parent
  engines block alignment.
- The gate does not import source, replace routes, mutate scoring, promote a
  package, or assign students.
- Z.ai intake remains blocked until the separate Codex integration decision and
  the remaining evidence gates are accepted.

This decision is recorded in `docs/adr/0559-external-prototype-evidence-alignment.md`.

## DR-632: Derived Prototype Intake Readiness

Status: Accepted

Decision: Derive the prototype-intake summary's evidence-alignment lane from
the shared cross-artifact validator while keeping real returned-package,
replay, wrapper, and Codex decision lanes independent.

Rationale:

- A manually maintained summary can drift from the evidence packet it claims
  to describe.
- Structural agreement is useful evidence, but it is not proof that a real
  external package has been returned or accepted.
- Separate lanes keep the eventual Z.ai alert honest and auditable.

Guardrails:

- Alignment errors become a blocked visible lane.
- A green alignment lane never authorizes import, route replacement, scoring,
  package promotion, or student assignment.
- The Codex alert remains not-ready until a specific returned prototype and
  all required evidence exist.

This decision is recorded in `docs/adr/0560-derived-prototype-intake-readiness.md`.

## DR-633: Returned Prototype Manifest

Status: Accepted

Decision: Require every external prototype return to arrive as a typed,
review-only manifest bound to the approved repository, immutable source
snapshot, queue item, target mode, parent engine, and separate evidence
artifacts.

Rationale:

- A checklist describes desired evidence but does not constrain an actual
  returned source snapshot or path.
- Exact provenance is necessary before reviewing Phaser or DOM code for a
  wrapper boundary.
- Separate artifacts keep fixtures, audio, scoring, accessibility, and event
  evidence auditable and prevent direct app copying.

Guardrails:

- The initial approved repository is `Drewsure/ministar-lab` only.
- `latest`, `main`, unsafe relative paths, and app-directory paths are rejected.
- Missing evidence blocks review-only package advancement.
- The manifest never authorizes import, route replacement, scoring mutation,
  package promotion, or student assignment.

This decision is recorded in `docs/adr/0561-returned-prototype-manifest.md`.

## DR-634: Returned Package Checklist Alignment

Status: Accepted

Decision: Treat the returned package manifest and its return checklist as one
identity boundary. Tenant, queue item, source repository, target mode, and
parent engine must match before a future returned package can advance to
Codex review. A review-only manifest also requires a checklist marked
`ready-for-return-review`.

Rationale:

- A manifest can be structurally valid while describing a different queue item
  or game mode than the checklist shown to the teacher.
- Cross-record drift would weaken white-label isolation and make Z.ai/Phaser
  review evidence unreliable.
- A small read-only alignment gate is cheaper than discovering drift during
  wrapper planning or an app patch.

Guardrails:

- Missing or mismatched tenant, queue item, repository, mode, or parent engine
  blocks alignment.
- Review-only status cannot bypass an unfinished checklist.
- The alignment gate does not import source, replace routes, mutate scoring,
  promote packages, or assign students.

This decision is recorded in `docs/adr/0562-returned-package-checklist-alignment.md`.

## DR-635: Returned Artifact Shape

Status: Accepted

Decision: Make returned package artifact structure explicit and fail closed.
Returned manifests must name target mode and parent engine, and every artifact
must use a supported kind, identity, safe path, checksum/status shape, and
review state appropriate to the manifest status.

Rationale:

- Silently dropping an unknown artifact kind makes incomplete evidence look
  like a valid empty preview.
- A package marked review-only needs reviewed evidence, not merely files that
  exist.
- Mode and parent-engine identity are required to preserve the parent-engine
  integration boundary.

Guardrails:

- Unsupported or malformed artifact entries produce validation errors.
- Review-only packages require every required artifact to be marked reviewed.
- This remains a no-side-effect gate and cannot authorize import, route
  replacement, scoring mutation, package promotion, or student assignment.

This decision is recorded in `docs/adr/0563-returned-artifact-shape.md`.

## DR-636: Returned Package Intake Provenance

Status: Accepted

Decision: Align every returned package manifest with the original prototype
intake queue item as well as the return checklist. The manifest must preserve
tenant, queue ID, approved repository, target mode, and parent engine across
the full provenance chain.

Rationale:

- Checklist alignment alone cannot prove that the checklist belongs to the
  original intake request.
- Queue identity is the earliest stable record of why a prototype was
  considered and which parent engine was selected.
- Explicit provenance protects white-label isolation and makes later Z.ai or
  Phaser review auditable.

Guardrails:

- Missing or mismatched intake identity blocks provenance alignment.
- The check remains separate from artifact completeness and Codex decision.
- No source import, route replacement, scoring mutation, package promotion, or
  student assignment is enabled.

This decision is recorded in `docs/adr/0564-returned-package-intake-provenance.md`.

## DR-637: Returned Prototype Surface

Status: Accepted

Decision: Require every returned package manifest to declare its target surface
as `dom-reference`, `phaser`, or `hybrid`, and align that declaration with the
intake queue and return checklist.

Rationale:

- DOM and Phaser prototypes require different wrapper, accessibility, event,
  and performance review evidence.
- Without an explicit surface, a canvas prototype could be treated as a DOM
  reference or vice versa.
- A small typed field keeps future integration planning honest and white-label
  safe.

Guardrails:

- Unsupported surface values block the manifest.
- Surface alignment remains review-only and does not create routes or import
  source.
- Scoring, reward, package, audio, and student assignment mutations remain
  blocked.

This decision is recorded in `docs/adr/0565-returned-prototype-surface.md`.

## DR-638: Returned Package Readiness Separation

Status: Accepted

Decision: Derive the prototype intake readiness summary from returned-package
manifest and provenance validators while keeping contract validity separate
from actual package availability.

Rationale:

- A review UI can show a valid preview even when no external package has been
  supplied.
- Treating preview records as returns would create a false Z.ai integration
  signal.
- Separate lanes make the eventual alert auditable and preserve the manual
  Codex gate.

Guardrails:

- Manifest, checklist, intake, and surface errors block the contract lane.
- A zero-error preview does not satisfy the real-return lane.
- No alert, import, route replacement, scoring mutation, package promotion, or
  student assignment is enabled by this summary.

This decision is recorded in `docs/adr/0566-returned-package-readiness-separation.md`.

## DR-639: Derived Prototype Alert

Status: Accepted

Decision: Derive the prototype intake alert status from the readiness summary
using one shared content-model decision function. The alert may become
`ready-for-review` only when the summary is ready and every readiness lane is
ready; structural evidence blockers produce `blocked`.

Rationale:

- A separately maintained alert status could drift from readiness evidence.
- Structural blockers need stronger treatment than ordinary future-work
  lanes.
- A shared function makes alert behavior testable without enabling any side
  effect.

Guardrails:

- Preview records alone cannot produce a ready alert.
- The alert remains a human handoff signal, not an automated integration action.
- Import, routes, scoring, rewards, media, package promotion, and assignment
  remain blocked.

This decision is recorded in `docs/adr/0567-derived-prototype-alert.md`.

## DR-640: Derived Prototype Readiness Summary

Status: Accepted

Decision: Derive the prototype intake summary status and visible Codex-alert
label from the summary's readiness lanes through the shared content model.
Blocked lanes produce `evidence-review-needed`, missing lanes produce
`not-ready`, and an all-ready lane set is the only path to
`ready-for-codex-alert`.

Rationale:

- A hand-maintained summary status can disagree with the lane evidence it is
  supposed to summarize.
- The review workbench and the Z.ai/Codex alert must share one state machine.
- Centralized status types prevent UI and verification code from silently
  drifting apart.

Guardrails:

- This is a derived review signal only; it does not enable imports, writes,
  routes, scoring, rewards, media, package promotion, or assignment.
- A missing returned package remains `not-ready` even when all preview
  contracts are structurally valid.
- Structural blockers remain visible and cannot be hidden by a summary label.

This decision is recorded in `docs/adr/0568-derived-prototype-readiness-summary.md`.

## DR-641: Derived Prototype Return Review

Status: Accepted

Decision: Derive the returned-package readiness status and Codex return-review
label from the evidence lanes through the shared content model. Missing
evidence keeps review unopened, a blocked lane without missing evidence
requires evidence review, and only an all-ready lane set can open return
review.

Rationale:

- The return summary previously stored its state and review label separately
  from the evidence it summarized.
- Missing evidence and structural review blockers have different operational
  meanings and must not be collapsed into one misleading label.
- The same derived contract keeps the teacher workbench, runtime harness, and
  future handoff review aligned.

Guardrails:

- The summary cannot import archives, write app files, replace routes, mutate
  scoring or rewards, write playlists, promote packages, or assign students.
- A preview or checklist alone cannot open Codex return review.
- Support-language progress remains outside the return-review signal.

This decision is recorded in `docs/adr/0569-derived-prototype-return-review.md`.

## DR-642: Derived Prototype Integration Gate

Status: Accepted

Decision: Derive the AI prototype integration-readiness gate status from its
evidence-check statuses. Missing or blocked evidence produces `blocked`,
pending evidence produces `review-only`, and an all-reviewed evidence set
produces `ready-for-codex-review`.

Rationale:

- The integration gate already stores the evidence checks that determine its
  readiness, so a separate hard-coded status could drift.
- Codex needs a reliable signal that a packet is ready to inspect without
  confusing review readiness with permission to patch the platform.
- Evidence-driven state is easier to test and safer for future Z.ai and Phaser
  intake.

Guardrails:

- No status can authorize app writes, route registry writes, scoring or reward
  mutation, playlist mutation, package promotion, or student assignment.
- The Codex integration decision remains an evidence check, not an automatic
  approval action.
- MiniStar support-language and Japanese release restrictions remain intact.

This decision is recorded in `docs/adr/0570-derived-prototype-integration-gate.md`.

## DR-643: Integration Evidence Provenance

Status: Accepted

Decision: Build integration-gate evidence checks from the statuses of their
corresponding upstream prototype records. Unknown or unfinished records map
to blocked evidence; only explicit reviewed records map to reviewed evidence.
The readiness-gate self-check can become reviewed only after every upstream
check is reviewed.

Rationale:

- A gate that labels every check blocked can hide whether the underlying
  record has moved forward or whether the gate itself is stale.
- Provenance is required before Codex can assess a future Z.ai or Phaser return
  package efficiently.
- Self-referential readiness must not bootstrap an integration approval.

Guardrails:

- The derived evidence map remains review-only and provider-neutral.
- Unknown, missing, or not-run records remain blocked.
- No evidence status authorizes app writes, route changes, scoring or reward
  mutation, playlist changes, package promotion, or assignment.

This decision is recorded in `docs/adr/0571-integration-evidence-provenance.md`.

## DR-644: Derived Codex Decision

Status: Accepted

Decision: Derive the Codex integration-decision status from its review checks.
Missing or blocked checks produce `blocked`, pending checks produce
`review-only`, and an all-reviewed check set produces `ready-for-review`.

Rationale:

- The decision record should reflect the evidence it asks Codex to inspect.
- A manually maintained status can incorrectly imply that review is complete
  or hide a check that has actually advanced.
- Ready-for-review must remain separate from a selected approval decision.

Guardrails:

- `selectedDecision` remains `No decision recorded` in preview data.
- No status records an integration approval or writes app files, routes,
  scoring, rewards, audio manifests, packages, or assignments.
- MiniStar Japanese support remains support-only and hiragana-safe for early
  levels.

This decision is recorded in `docs/adr/0572-derived-codex-decision.md`.

## DR-645: Codex Decision Evidence Provenance

Status: Accepted

Decision: Populate Codex-decision checks from the corresponding upstream
wrapper, fixture, event, audio, mobile, and scoring records. Unknown or
unfinished records remain blocked. The readiness-gate check can become reviewed
only after every upstream check is reviewed.

Rationale:

- The Codex decision is the final review boundary before integration, so its
  checks must preserve the evidence lineage rather than restate a generic
  pending status.
- A self-referential readiness check must not bootstrap its own completion.
- The distinction between blocked and pending tells reviewers whether work is
  absent or actively awaiting review.

Guardrails:

- No check status records a selected decision or integration approval.
- MiniStar support-language policy remains separately protected.
- App writes, route changes, scoring/reward changes, playlist changes,
  package promotion, and assignment remain blocked.

This decision is recorded in `docs/adr/0573-codex-decision-evidence-provenance.md`.

## DR-646: Codex Decision Check Identity

Status: Accepted

Decision: Require unique labels and required records for every Codex
integration-decision evidence check, with non-empty evidence and supported
review statuses.

Rationale:

- Duplicate evidence identities could make a review packet appear complete
  while leaving one upstream lane ambiguous.
- One-to-one check provenance keeps future Z.ai and Phaser review auditable.
- Explicit shape validation is cheaper and safer than diagnosing an ambiguous
  packet after integration work begins.

Guardrails:

- Duplicate labels and duplicate required records are rejected.
- Missing label, evidence, or required-record fields are rejected.
- Unsupported check statuses are rejected.
- No integration approval, app write, route change, scoring/reward change,
  playlist write, package promotion, or assignment is enabled.

This decision is recorded in `docs/adr/0574-codex-decision-check-identity.md`.

## DR-647: Codex Decision Collection Identity

Status: Accepted

Decision: Reject Codex integration-decision collections containing duplicate
decision IDs or duplicate tenant/request pairs.

Rationale:

- Multi-tenant review queues need collection-level identity, not only valid
  individual packet shape.
- Duplicate packet identity could silently replace the decision for a
  prototype request.

Guardrails:

- Decision IDs must be unique across the review collection.
- Each tenant and prototype request may have only one decision packet.
- No integration approval, import, route write, scoring/reward change,
  package promotion, playlist write, or assignment is enabled.

This decision is recorded in `docs/adr/0575-codex-decision-collection-identity.md`.

## DR-648: Evidence Alignment Collection Identity

Status: Accepted

Decision: Reject evidence-alignment collections containing duplicate return
review IDs, integration plan IDs, or tenant/request pairs.

Rationale:

- Individual packet alignment does not protect the review queue from duplicate
  packets.
- Collection identity must be deterministic before readiness summaries can
  rely on external prototype evidence.

Guardrails:

- Alignment remains a review-only evidence check.
- Duplicate packet identities are rejected before readiness summaries rely on
  the collection.
- No provider-specific import or app integration is enabled.

This decision is recorded in `docs/adr/0576-evidence-alignment-collection-identity.md`.

## DR-649: Evidence Alignment Panel Visibility

Status: Accepted

Decision: Teacher prototype review panels must use the shared collection-level
evidence-alignment validator and show duplicate packet identity as a blocked
review condition.

Rationale:

- A summary-only guard can drift from the evidence shown to a reviewer.
- Per-packet and collection-level identity must be visible in the same
  read-only workbench.

Guardrails:

- The panel remains read-only.
- No prototype import, route replacement, scoring mutation, package promotion,
  playlist write, or assignment is enabled.

This decision is recorded in `docs/adr/0577-evidence-alignment-panel-visibility.md`.

## DR-650: Deterministic Review List Keys

Status: Accepted

Decision: Warning and error lists in teacher review surfaces must use unique
deterministic keys even when messages repeat.

Rationale:

- Message text alone is not a sufficient React key for repeated validator
  output.
- Duplicate-key warnings can make evidence appear duplicated or disappear
  during updates.

Guardrails:

- Stable domain IDs remain preferred for record-backed lists.
- The change does not hide, merge, or suppress repeated evidence.

This decision is recorded in `docs/adr/0578-deterministic-review-list-keys.md`.

The deterministic review-list key implementation is now covered by the
standing verifier across persistence, policy, private-library, draft-edit, and
teacher-session review surfaces.

## DR-651: Prototype Intake Alert Contract

Status: Accepted

Decision: Validate the Z.ai prototype intake alert as a review-only contract
with explicit handoff timing, evidence requirements, isolated repository scope,
Codex ownership, and blocked actions.

Rationale:

- Status derivation alone cannot prevent the user-facing alert payload from
  losing a required safeguard.
- The handoff signal must remain separate from actual returned-package
  availability.

Guardrails:

- The alert must not request source handoff while it is not ready.
- Direct app writes, route creation, scoring/reward mutation, playlist writes,
  package promotion, and assignment remain blocked.

This decision is recorded in
`docs/adr/0579-prototype-intake-alert-contract.md`.

## DR-652: Prototype Intake Alert Readiness Alignment

Status: Accepted

Decision: Validate the Z.ai prototype intake alert status against the derived
readiness lanes before treating the alert contract as valid.

Rationale:

- A ready-looking payload must not override missing returned packages or blocked
  evidence in the readiness workbench.
- The human handoff signal must remain a consequence of verified readiness, not
  a manually editable status.

Guardrails:

- A valid alert remains review-only and does not imply a returned package.
- Import, route creation, scoring/reward mutation, package promotion, and
  assignment remain blocked.

This decision is recorded in
`docs/adr/0580-prototype-intake-alert-readiness-alignment.md`.

## DR-653: Prototype Alert Panel Instance Validation

Status: Accepted

Decision: Validate each prototype-intake alert panel instance against its own
alert payload and, when supplied, its own readiness signal.

Rationale:

- Shared UI cannot use MiniStar sample validation as tenant-wide truth.
- White-label tenant routes must display the state of the package they actually
  received.

Guardrails:

- Tenant-specific readiness must remain aligned with the readiness signal passed
  to that route.
- Validation remains review-only and does not authorize import or student-facing
  use.

This decision is recorded in
`docs/adr/0581-prototype-alert-panel-instance-validation.md`.

## DR-654: Prototype Intake Alert Tenant Scope

Status: Accepted

Decision: Require explicit tenant identity on prototype-intake alerts and
reject route displays whose expected tenant differs from the alert tenant.

Rationale:

- White-label review routes must not display MiniStar or platform evidence as if
  it belonged to another tenant.
- Alert identity must be as explicit as the evidence and integration records it
  summarizes.

Guardrails:

- The platform route uses `platform`; tenant routes construct tenant-scoped
  alert records.
- Tenant scope does not authorize import, integration approval, route creation,
  package promotion, or student assignment.

This decision is recorded in
`docs/adr/0582-prototype-intake-alert-tenant-scope.md`.

## DR-655: Prototype Intake Readiness Summary Tenant Scope

Status: Accepted

Decision: Require tenant-scoped readiness summary records and pass the same
scoped summary to the tenant alert and readiness panels.

Rationale:

- Alert identity is only meaningful when its readiness signal has the same
  tenant scope.
- Future tenant-specific evidence can replace the scoped factory without
  changing review-panel contracts.

Guardrails:

- Platform readiness uses the explicit `platform` scope.
- Tenant routes must construct their own summary/alert pair.
- The scoped preview remains review-only and cannot authorize import, promotion,
  route creation, or assignment.

This decision is recorded in
`docs/adr/0583-prototype-intake-readiness-summary-tenant-scope.md`.

## DR-656: Derived Tenant Prototype Readiness

Status: Accepted

Decision: Derive tenant prototype readiness lanes from tenant-filtered queue,
evidence, returned-manifest, and package-availability records.

Rationale:

- Tenant identity alone is insufficient if the readiness lanes still reuse
  platform-wide records.
- Missing tenant evidence must be visible as missing rather than appearing
  ready through a shared sample.

Guardrails:

- Platform-wide previews cannot make a tenant route appear ready.
- The derived summary remains review-only and cannot authorize Z.ai import,
  package promotion, route creation, or assignment.

This decision is recorded in
`docs/adr/0584-derived-tenant-prototype-readiness.md`.

## DR-657: Prototype Alert and Signal Scope Consistency

Status: Accepted

Decision: Require the prototype-intake alert tenant and readiness-signal tenant
to match during alignment validation.

Rationale:

- Validating alert and readiness records independently does not prevent a caller
  from pairing two different tenants.
- Route, alert, and readiness summary identity must form one auditable chain.

Guardrails:

- A valid alignment check remains review-only.
- Import, package promotion, route creation, scoring/reward mutation, and
  assignment remain blocked.

This decision is recorded in
`docs/adr/0585-prototype-alert-signal-scope-consistency.md`.

## DR-658: Prototype Readiness Summary Contract

Status: Accepted

Decision: Validate prototype-intake readiness summaries for tenant identity,
lane identity, derived status, Codex-alert consistency, and blocked next actions
before relying on them in review panels.

Rationale:

- A manually changed summary status must not override its lane collection.
- Readiness evidence needs an auditable contract before it can support a future
  Z.ai handoff signal.

Guardrails:

- Duplicate or malformed lanes are rejected.
- A valid summary remains review-only and cannot authorize Z.ai import, package
  promotion, route creation, or assignment.

This decision is recorded in
`docs/adr/0586-prototype-readiness-summary-contract.md`.

## DR-659: Prototype Return Readiness Summary Contract

Status: Accepted

Decision: Require prototype-return readiness summaries to validate summary
identity, unique lane IDs, supported lane statuses, derived status, Codex
return-review state, and blocked next actions before the return panel relies on
them.

Rationale:

- Return review is the final gate before an integration decision, so stale or
  duplicated lanes must not look authoritative.
- Intake and return summaries need matching contract discipline for an
  auditable handoff process.

Guardrails:

- A valid summary remains review-only.
- Archive import, app file copy, route replacement, package promotion, and
  assignment remain blocked.

This decision is recorded in
`docs/adr/0587-prototype-return-readiness-summary-contract.md`.

## DR-660: Tenant-Scoped Prototype Return Readiness

Status: Accepted

Decision: Derive prototype-return readiness from tenant-filtered returned
package checklists on each tenant workbench.

Rationale:

- A platform-wide return summary can leak another tenant's package or review
  state into a white-label workspace.
- Intake and return readiness must share the same tenant-isolation rule.

Guardrails:

- Every return summary carries an explicit tenant ID.
- Missing tenant checklists remain missing.
- Archive import, route replacement, package promotion, and assignment remain
  blocked.

This decision is recorded in
`docs/adr/0588-tenant-scoped-prototype-return-readiness.md`.

## DR-661: Tenant Return Summary Route Proof

Status: Accepted

Decision: Require active route assertions for tenant-specific returned
prototype summary labels and derived text on both tenant workbenches.

Rationale:

- A shared HTTP status or source marker cannot prove that tenant composition
  preserved white-label isolation.
- Rendered route evidence should verify the identity that a teacher actually
  sees.

Guardrails:

- Route checks remain observational and review-only.
- Archive import, route replacement, package promotion, and assignment remain
  blocked.

This decision is recorded in
`docs/adr/0589-tenant-return-summary-route-proof.md`.

## DR-662: Return Evidence Lane Completeness

Status: Accepted

Decision: Require audio, mobile/accessibility, and event/scoring evidence
together before the prototype-return proof lane can become ready.

Rationale:

- Audio coverage alone does not prove mobile usability or parent-engine scoring
  ownership.
- A returned package must be reviewed as a complete evidence packet.

Guardrails:

- Missing any required category keeps Codex return review blocked.
- Import, route replacement, package promotion, and assignment remain blocked.

This decision is recorded in
`docs/adr/0590-return-evidence-lane-completeness.md`.

## DR-663: Explicit Review-Surface Scope

Status: Accepted

Decision: Require evidence packet flows and prototype storage guards to declare
platform or tenant scope and render that scope visibly.

Rationale:

- A white-label workbench must distinguish shared policy from tenant-owned
  evidence.
- Explicit scope prevents future storage and import decisions from relying on
  ambiguous records.

Guardrails:

- Scope labels are review metadata only.
- Live storage, import, package promotion, and assignment remain blocked.

This decision is recorded in
`docs/adr/0591-explicit-review-surface-scope.md`.

## DR-664: Review-Surface Scope Validation

Status: Accepted

Decision: Enforce `platform` or `tenant` scope values with a shared
content-model validator for evidence flows and prototype storage guards.

Rationale:

- Scope is a white-label safety boundary, so presentation labels alone are
  insufficient.
- Invalid or ad-hoc scope values must fail before review data is trusted.

Guardrails:

- Scope validation remains review-only.
- Storage, import, package promotion, and assignment remain blocked.

This decision is recorded in
`docs/adr/0592-review-surface-scope-validation.md`.

## DR-665: Durable Evidence Scope Boundary

Status: Accepted

Decision: Evidence packet and evidence attachment records must preserve an
explicit `scope_kind` value of `platform` or `tenant` at the schema,
migration, and persistence-contract boundaries.

Rationale:

- Human-readable scope labels are not sufficient for storage queries or export
  isolation.
- Shared review infrastructure and tenant-owned evidence need different
  ownership semantics even when they use the same packet shape.
- The same scope vocabulary can be reused by hosted and local deployments.

Guardrails:

- The scope field describes ownership and visibility; it does not authorize
  upload, storage writes, approval, promotion, or student-facing use.
- Invalid or missing scope values keep the evidence contract blocked.
- Tenant filtering and release-control policy remain required independently.

This decision is recorded in
`docs/adr/0593-durable-evidence-scope-boundary.md`.

## DR-666: Adapter Evidence Scope Boundary

Status: Accepted

Decision: Hosted and local evidence-packet and evidence-attachment write
intents must preserve the durable record's explicit `scope_kind` and must
fail validation when the value is missing or does not align.

Rationale:

- A correct schema can still be weakened by an adapter plan that drops
  ownership scope.
- Hosted and closed/local deployments must carry the same boundary.
- Cross-layer alignment is cheaper to prove before a vendor or storage API is
  selected.

Guardrails:

- Scope alignment does not enable live writes.
- Upload, approval, promotion, download, and student-facing use remain
  separately blocked.
- A future tenant-specific adapter must declare its scope intentionally rather
  than inheriting platform defaults.

This decision is recorded in
`docs/adr/0594-adapter-evidence-scope-boundary.md`.

## DR-667: Evidence Migration Field Parity

Status: Accepted

Decision: Evidence packet and evidence attachment migration specifications
must declare the required identity, scope_kind, and tenant_id fields that the
vendor-neutral schema requires.

Rationale:

- Tenant scope written only in prose or an index description is not enough for
  an implementable migration.
- Schema-to-migration drift should fail before a backend vendor is selected.
- Hosted and local implementations need the same explicit record shape.

Guardrails:

- Migration parity does not enable live persistence.
- Evidence upload, approval, promotion, download, and student-facing use
  remain blocked by their separate gates.
- The required-field map is intentionally narrow until broader migration
  implementation begins.

This decision is recorded in
`docs/adr/0595-evidence-migration-field-parity.md`.

The migration-spec identity-field slice now requires every migration spec to
declare its primary key in the fields list, with non-empty field names and
types. A regression test proves that removing media_id is rejected before
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

The migration candidate coverage slice now requires every non-deferred
candidate to have at least one migration specification, while deferred
candidates must not carry implementation specs. The decision is recorded in
`docs/adr/0598-migration-candidate-spec-coverage.md` and
`docs/decision-register/DR-670-migration-candidate-spec-coverage.md`.
# DR-728: Canonical Replay Evidence Boundary

The shared progression adapter now adds deterministic replay-v1 evidence to
canonical interaction, audio-request, mastery, and completion events by
default. This protects older game slices from incomplete QA evidence while
preserving component-level seeds for deterministic layouts. No persistence,
provider, reward, or Phaser promotion changed. See `docs/adr/0656-canonical-replay-evidence-boundary.md`.
# DR-729: Target-Language Feedback Audio

Canonical immediate feedback must use the unit target language and emit shared
audio evidence. True or False no longer hard-codes English for its immediate
correctness response. Support-language audio remains non-authoritative for
mastery and rewards. See `docs/adr/0657-target-language-feedback-audio.md`.

# DR-730: Phaser Source Identity Record

External game candidate reviews now require an exact source commit SHA in
addition to repository and snapshot identity. The frozen MiniStar candidate
packets record commit `eb79ddf5940ab47cc3c45c119c67ee1b6b958e55` and hashed
reviewed-file manifests. This is provenance evidence only and does not
authorize source import or promotion; the same evidence is required from any
future returned Z.ai candidate package.
See `docs/adr/0658-phaser-source-identity-record.md`.

# DR-731: Phaser Evidence Reference Integrity

Every external candidate finding must cite a file present in its hashed
source manifest. This keeps evidence tied to the exact reviewed snapshot and
does not authorize source promotion. See
`docs/adr/0659-phaser-evidence-reference-integrity.md`.

# DR-734: Phaser Wrapper Approval Decision

External candidates now require an explicit wrapper approval record and remain
blocked by default until all evidence blockers are cleared. Wrapper approval
does not authorize source import or route, scoring, persistence, package, or
assignment changes. See `docs/adr/0662-phaser-wrapper-approval-decision.md`.

# DR-732: Runtime Replay Evidence Gate

The shared canonical event validator now requires `replay-v1:` evidence on
required learning events and `audio_requested` events. This protects all
canonical game routes and future Phaser wrappers at runtime. See
`docs/adr/0660-runtime-replay-evidence-gate.md`.

# DR-733: Canonical Event Runtime Harness

The runtime behavior harness now tests a valid canonical event sequence and
rejects missing replay-v1 evidence. This protects the shared completion gate
with executable evidence. See
`docs/adr/0661-canonical-event-runtime-harness.md`.

# DR-735: Phaser Wrapper Approval Runtime Check

The runtime behavior harness now exercises the shared Phaser candidate review
validator. It accepts a blocked candidate and rejects an approval with
unresolved blockers or missing evidence. This is runtime evidence only and
does not promote or route external source. See
`docs/adr/0663-phaser-wrapper-approval-runtime-check.md`.

# DR-736: Canonical Completion Acceptance Gate

The shared playable route shell now pauses progression and rewards when the
canonical event stream is missing or invalid. Contract errors remain visible
for review, and the rule applies to future approved wrappers as well. See
`docs/adr/0664-canonical-completion-acceptance-gate.md`.

# DR-737: Phaser Source Evidence Reproducibility Check

The isolated Phaser review packet now has a standalone hash verification
command. It confirms the five reviewed files against the frozen snapshot
without importing source, while remaining outside the normal foundation gate.
See `docs/adr/0665-phaser-source-evidence-reproducibility-check.md`.

# DR-738: Canonical Answer Activity Order

The shared event validator now rejects answer activity after mastery or
completion, with runtime regression coverage. This prevents late submissions
from changing a completed result. See
`docs/adr/0666-canonical-answer-activity-order.md`.

# DR-739: Canonical Game Report Evidence

Teacher report evidence now groups canonical game events by unit, launch,
learner session, and mode and validates each group with the shared sequence,
replay, tenant, launch, and completion contract. Incomplete or mismatched game
groups remain blocked from authoritative report status, while support-only
media/audio evidence stays separate. See
`docs/adr/0667-canonical-game-report-evidence.md`.

# DR-740: Canonical Game Event Chronology

The shared canonical game validator now requires valid, nondecreasing
`occurredAt` timestamps. Out-of-order or invalidly timestamped game evidence
is blocked before completion, teacher-report readiness, or future wrapper
promotion. See `docs/adr/0668-canonical-game-event-chronology.md`.

# DR-741: Report Runtime Canonical Game Gate

The provider-neutral report runtime now maps canonical game envelopes into the
shared game event shape and validates grouped sequence, replay, tenant, launch,
learner, and completion evidence. Standalone audio remains support-only. See
`docs/adr/0669-report-runtime-canonical-game-gate.md`.

# DR-742: Canonical Game Retry Attempts

Repeated plays of the same game mode are now split at each subsequent
`game_started` event and validated independently. This preserves classroom
retries, keeps incomplete attempts visibly blocked, and prevents duplicate
events from corrupting teacher-report evidence. See
`docs/adr/0670-canonical-game-retry-attempts.md`.

# DR-743: Ready And Blocked Report Fixture

The sample teacher report now includes an incomplete canonical game attempt and
a complete retry. The first remains blocked while the retry can pass sequence,
identity, replay, timestamp, and completion checks, proving both report paths
without enabling export or persistence. See
`docs/adr/0671-ready-and-blocked-report-fixture.md`.

# DR-747: Provider-Neutral Progression Continuity Envelope

Progression handoff between entry practice and curated game routes now has a
validated provider-neutral envelope. It preserves identity and progression
invariants without URL-encoded state, while the adapter remains review-only
with no side effect until persistence and policy gates are approved. See ADR
0675 and `docs/PROGRESSION_CONTINUITY_CONTRACT.md`.

# DR-748: Standalone Report Audio Boundary

Standalone `audio_requested` evidence remains support-only in teacher reports
and does not create an incomplete game attempt. This keeps tap-to-speak audio
 separate from mastery, Star Dust, and completion evidence. See ADR 0676.

The provider-neutral persistence map now names a separate
`progression-continuity` record for validated activity handoffs. Hosted and
local adapter intents, schema, migration candidate, and migration
specification preserve the same tenant/package/cursor/snapshot boundary while
blocking raw audio, transcripts, URL-authoritative state, and live side
effects. See ADR 0677 and DR-749.

Progression continuity runtime requests now validate expected identity fields
as non-blank strings before comparison. Malformed external input is rejected
as deterministic validation evidence rather than throwing, and the adapter
remains side-effect-free. See ADR 0678 and DR-750.

# DR-751: Canonical Student Launch Game Handoff

The QR launch pathway now mounts the canonical Match Up or Memory Match game
for supported next steps instead of rendering only a preview. The parent launch
flow selects the activity; the mounted game emits the single `game_started`
event; completion is accepted only after the shared canonical event validator
passes. This prevents duplicate starts and keeps in-page progression aligned
with standalone game routes. The handoff also creates and validates a
transient provider-neutral continuity envelope without writing it to a URL,
browser storage, or live persistence provider. See ADR 0679.

# DR-752: Shared Canonical Completion Gate

Standalone game routes and the QR student launch pathway now share
`validateCanonicalGameCompletion`. The gate filters evidence to the active
mode, rejects missing completion events, and delegates identity, replay,
chronology, event-order, and Star Dust checks to the shared canonical event
validator before progression changes. See ADR 0680.

# DR-753: Unit Star Dust Capacity

The application completion adapters now enforce the published 1,000 Star Dust
maximum per unit. Each completion event records only the remaining accepted
award, preserving deterministic scoring, continuity snapshot validity, teacher
report accuracy, and future overflow-ticket calculations. See ADR 0681.

# DR-754: Canonical Game Audio Evidence Gate

The shared canonical game validator now requires at least one
`audio_requested` event in every accepted game attempt. Audio remains
support-only and cannot unlock progress, grant mastery, award Star Dust, or
replace answer activity. See ADR 0682 and
`docs/decision-register/DR-754-canonical-game-audio-evidence-gate.md`.

# DR-758: Training Report Award Authority

Teacher recovery summaries now count Star Dust only from the authoritative
`training_completed` event. `training_answer_result` remains response evidence
and is not counted as a second award. This keeps teacher reporting aligned with
the normalized recovery progression result. See ADR 0686 and
`docs/decision-register/DR-758-training-report-award-authority.md`.

# DR-759: Front-Door Game Start Ownership

The front-door launch flow now selects the next unlocked mode without creating
its own `game_started` event. The mounted canonical game wrapper emits the
single start event, matching the QR launch flow and preventing duplicate game
attempts in teacher reports. See ADR 0687 and
`docs/decision-register/DR-759-front-door-game-start-ownership.md`.

# DR-760: Front-Door Canonical Completion Gate

The front-door Memory Match flow now validates its accumulated event evidence
through `validateCanonicalGameCompletion` before accepting progression, Star
Dust, or the completion event. Its event reference includes the final mastery
evidence emitted by the mounted wrapper. See ADR 0688 and
`docs/decision-register/DR-760-front-door-canonical-completion-gate.md`.

# DR-761: Front-Door Pairing Slice Integration

The front door now mounts canonical Match Up and Memory Match wrappers for the
selected unlocked mode. Both tenants can use a reviewed pairing activity with
shared audio, deterministic scoring, event evidence, and completion validation;
other modes remain explicit previews. See ADR 0689 and
`docs/decision-register/DR-761-front-door-pairing-slice-integration.md`.

# DR-762: Shared Next Recommended Mode Policy

Launch and progress surfaces now use the first uncompleted mode in the
tenant's ordered recommendation list. This prevents a completed first game
from recurring as the permanent next activity while keeping unlock authority
in progression state. See ADR 0690 and
`docs/decision-register/DR-762-shared-next-recommended-mode-policy.md`.

# DR-763: Label It Canonical Entry Integration

Label It is now mounted as a canonical reviewed activity in student and
front-door launch flows, using the shared event, audio, scoring, progression,
and completion contracts. Live image upload remains outside this integration
boundary. See ADR 0691 and
`docs/decision-register/DR-763-label-it-canonical-entry-integration.md`.

# DR-764: Balloon Pop Canonical Entry Integration

Balloon Pop is now mounted as a canonical selection/arcade activity in the
student and front-door flows, preserving shared audio, deterministic scoring,
progression, and completion evidence. See ADR 0692 and
`docs/decision-register/DR-764-balloon-pop-canonical-entry-integration.md`.

# DR-765: Quiz Canonical Entry Integration

Quiz is now mounted as a canonical selection activity in the student and
front-door flows, preserving shared audio, deterministic scoring, replay,
progression, and completion evidence. See ADR 0693 and
`docs/decision-register/DR-765-quiz-canonical-entry-integration.md`.

# DR-766: True or False Canonical Entry Integration

True or False is now mounted as a canonical selection activity in the student
and front-door flows, preserving shared audio, deterministic scoring, replay,
progression, and completion evidence. See ADR 0694 and
`docs/decision-register/DR-766-true-false-canonical-entry-integration.md`.

# DR-767: Type Answer Canonical Entry Integration

Type Answer is now mounted as a canonical text-spelling activity in the
student and front-door flows, preserving shared audio, deterministic scoring,
replay, progression, and completion evidence. See ADR 0695 and
`docs/decision-register/DR-767-type-answer-canonical-entry-integration.md`.

# DR-768: Spelling Practice Canonical Entry Integration

Spelling Practice is now mounted as a canonical text-spelling activity in the
student and front-door flows, preserving target-language prompt audio,
deterministic letter-tile scoring, replay, progression, and completion
evidence. English letter-tile normalization is the current supported fixture;
Japanese segmentation and script-aware spelling remain a separately reviewed
target-language expansion. See ADR 0696 and
`docs/decision-register/DR-768-spelling-practice-canonical-entry-integration.md`.

# DR-769: Fill in the Blank Canonical Entry Integration

Fill in the Blank is now mounted as a canonical text-spelling activity in the
student and front-door flows, preserving target-language sentence audio,
deterministic choice scoring, replay, progression, and completion evidence.
English answer normalization is the current supported fixture; Japanese
script-aware segmentation remains a separately reviewed target-language
expansion. See ADR 0697 and
`docs/decision-register/DR-769-fill-in-the-blank-canonical-entry-integration.md`.

# DR-770: Sentence Builder Canonical Entry Integration

Sentence Builder is now mounted as a canonical text-spelling activity in the
student and front-door flows, preserving target-language sentence and tile
audio, deterministic ordered-token scoring, replay, progression, and
completion evidence. `round_shown` is emitted when a round is displayed, not
for each tile tap. English token normalization is the current supported
fixture; Japanese segmentation remains a separately reviewed target-language
expansion. See ADR 0698 and
`docs/decision-register/DR-770-sentence-builder-canonical-entry-integration.md`.

Speak It is now mounted in the student launch and coded front-door flows. A
shared tenant-aware microphone approval hook keeps local record/replay policy
consistent across speaking surfaces. Recorder controls emit the support-only
`microphone_practice` event rather than additional `round_shown` events, so
local microphone activity cannot create gameplay rounds, mastery credit, or
rewards. See ADR 0648, DR-720, and
`docs/build-session-notes/2026-09-13-speak-it-canonical-integration.md`.

The canonical status-copy audit now keeps the teacher game sequence and speech
requirement record aligned with the runtime: Speak It is canonical in direct,
student, and coded front-door routes, while external Phaser candidates remain
review-only. The canonical-game verifier guards these status markers.

The isolated Z.ai MiniStar snapshot now passes the local five-file hash
reproducibility check against the frozen commit
`eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`. Provenance is verified, but the
candidate remains blocked for wrapper compatibility, accessibility, audio,
deterministic scoring, and white-label review.

# DR-771: Canonical Offer Engine Alignment

The sample unit game offer map must use the same parent-engine assignment as
the content model and web game catalog. Flashcards is `selection`; Match Up is
`pairing`. The corrected map is protected by a canonical integration verifier
and remains separate from external Phaser candidate approval.

Offer maps also declare curriculum level. Unsupported modes must be explicitly
blocked rather than appearing in a live Level 1 sequence. This keeps the
canonical game catalog, teacher offer map, and student recommendation policy
aligned without removing later-level routes.

The Level 1 activity compatibility matrix follows the same rule: Sentence
Builder is planned for Level 2+ and is not presented as a current Level 1 offer.

# DR-772: Teacher Monitor Offer-Map Alignment

The sample teacher session monitor must derive its reviewed ready game modes
from the tenant-scoped unit game offer map. Manually adding canonical modes to
sample progression allowed a blocked Level 1 Sentence Builder attempt to look
completed in teacher reporting after the student and teacher pathway contracts
had correctly removed it from the Level 1 sequence.

The monitor now uses ready, student-eligible offers as its sample unlocked and
completed scope. Teacher-only, premium, hidden, blocked, and not-ready offers
remain outside that sample student progression state. The monitor still uses
the launch session for assigned scope, so teacher-controlled activities remain
visible as assigned without being treated as student-completed evidence.

# DR-773: Assignment Curriculum-Level Alignment

Teacher assignment plans must declare their curriculum level and validate each
target game mode against the shared content-model supported-level contract.
Assignment plans are upstream of private links, QR entry, and teacher reports,
so leaving level validation to the student route would allow an unsupported
activity to be scheduled before the student gate is reached.

The Level 1 sample assignments now exclude Sentence Builder, which is a
Level 2+ mode. The assignment contract retains all reviewed Level 1 modes and
keeps teacher-controlled Speak It separate from ordinary student completion.

# DR-774: Runtime Level-Aware Game Access

The canonical game route and local progression adapter must independently
enforce the supported curriculum level for a game mode. A mode that is not
offered at the unit level must not render an interactive game, start a session,
complete a session, award Star Dust, or appear to unlock through a stale URL.

The route shell now shows a level-specific access explanation and returns the
student to the reviewed activity hub. The progression adapter rejects both
start and completion for unsupported modes. This is defense in depth: the
student-facing route remains understandable while the state boundary remains
authoritative. Later-level routes stay reusable and are not removed from the
catalog.

The student activity hub also filters reviewed offer-map recommendations by
the same supported-level contract before rendering route choices. Offer-map
validation remains the primary data boundary; the hub filter is a second
runtime defense against stale or malformed records.

The post-completion next-activity card follows the same rule, so both entry
navigation and completion navigation remain bounded by the unit curriculum
level.

# DR-775: Frozen Phaser Scene Inventory Evidence Boundary

The frozen Z.ai MiniStar Lab snapshot is now recorded as an exact 32-scene
evidence manifest with SHA-256 file identities, candidate family mappings, and
four parent-engine mappings. The source summary's claim of 25 games remains a
documented mismatch and must not be silently reconciled into product scope.

The inventory is review-only. It cannot import source, replace routes, own
scoring, own browser persistence, promote packages, or assign student work.
Memory Match remains the first bounded wrapper candidate, followed by Balloon
Pop. The foundation is now ready for a named candidate's replay, audio,
accessibility, and wrapper evidence handoff; a broad Z.ai merge is not
authorized. See ADR 0702 and the 2026-09-13 operating note.

# DR-776: Returned Phaser Candidate Package Verification

The first named candidate handoff now has a manual package inspector. It
checks the Memory Match return envelope against the frozen MiniStar snapshot,
requires exactly eight reviewed artifact kinds, verifies each artifact's
SHA-256 checksum and safe path, and preserves all blocked production actions.

The check is intentionally outside the full foundation gate because an
external package may not yet exist. `NOT READY` means no package was supplied;
a passing result proves evidence integrity only and does not approve a Phaser
wrapper. See ADR 0703 and `PHASER_CANDIDATE_PACKAGE_CHECKS.md`.

# DR-777: Canonical Completion Idempotence

Canonical playable surfaces now accept one validated completion per game mode
and session. Duplicate callbacks are ignored, and an already-completed replay
without an event is treated as a stable no-op instead of a contract error.
The first completion remains subject to canonical event-sequence validation;
the route guard does not replace the eventual hosted/local durable idempotency
boundary. See ADR 0704 and `COMPLETION_IDEMPOTENCE_CHECKS.md`.

# DR-778: Durable Completion Idempotency Contract

Hosted and local progress-event persistence now has an explicit canonical
completion key contract covering tenant, unit, launch, student session, and
game mode. Progress writes require the key; durable records and adapter intents
must reject duplicate completion writes and require atomic completion writes.
The content model exposes the shared key generator, while database selection,
live writes, and policy acceptance remain open. See ADR 0705 and
`COMPLETION_IDEMPOTENCE_CHECKS.md`.

# DR-779: Cross-Layer Persistence Alignment

The persistence alignment validator now compares durable progress-event
records with hosted and local adapter intents. Completion key fields,
duplicate-completion rejection, and atomic-write requirements must match across
both layers. This prevents provider drift before database selection or live
writes and is covered by the runtime behavior harness. See ADR 0706.

# DR-780: Provider-Neutral Completion Write Resolution

The content model now exposes a pure completion-write planner shared by future
hosted and local adapters. It distinguishes new creates, identical retries,
same-key payload conflicts, and invalid candidates before any provider call.
The planner does not enable live storage or bypass platform gates. See ADR
0707 and `COMPLETION_IDEMPOTENCE_CHECKS.md`.

# DR-782: Completion Key Identity Binding

Progress-event write requests now require structured canonical completion
identity alongside the idempotency key. The runtime derives the expected key
from tenant, unit, launch, student session, and game mode and rejects a key
bound to another identity before any provider operation. See ADR 0709.

# DR-781: Completion Scoring Profile Integrity

Canonical completion validation now requires matching deterministic scoring
profile identifiers on both `mastery_updated` and `game_completed`. Missing or
mismatched profile metadata blocks the completion boundary and keeps future
wrappers, reports, rewards, and persistence from using ambiguous scoring. See
ADR 0708.

# DR-784: Phaser Candidate Evidence Completeness

The controlled Phaser candidate package gate now validates the evidence
contents, not just the return envelope: fixture shape, canonical event replay,
target-language audio coverage, deterministic scoring scenarios, accessibility
evidence, source-manifest safety, and wrapper boundaries. A passing package
remains review-only and cannot authorize source import, route replacement,
student assignment, or live persistence. See ADR 0711.

# DR-785: Phaser Candidate Gate Behavior

The foundation suite now runs a source-free synthetic Memory Match package
through the candidate verifier. A complete packet must pass, while a packet
declaring random rewards must be rejected. This protects the candidate review
boundary before Z.ai returns an actual package and does not import source or
learner data. See ADR 0712.

# DR-786: Canonical Replay Seed Consistency

Canonical game evidence now requires one identical `replay-v1:` seed across
all required learning and audio events. A different but syntactically valid
seed is mixed-layout evidence and blocks the canonical completion boundary.
See ADR 0713.

# DR-787: Platform-Supplied Replay Seed Threading

Canonical web game wrappers may receive a replay seed from the platform so a
Phaser or future game implementation can bind its deterministic layout to the
launch session. Interaction, audio, and completion event factories must
preserve that supplied seed; when none is supplied they retain the existing
unit-and-mode-derived fallback. See ADR 0714.

The adapter also preserves a replay seed already carried in legacy event
metadata when no explicit argument is provided. Explicit platform arguments
take priority, followed by metadata compatibility, followed by the deterministic
unit-and-mode fallback. See ADR 0714.

# DR-788: Fail-Closed Replay Seed and Identity Validation

Canonical replay validation now rejects empty or transport-unsafe `replay-v1:`
values and reports missing unit identity instead of throwing on malformed
runtime evidence. This keeps candidate packages and future provider payloads
fail-closed at the shared validator boundary. See ADR 0715.

# DR-789: Route-Shell Replay Seed Ownership

`PlayableGameRouteShell` is the authoritative owner of the canonical replay
seed for mounted games. Every canonical game component must require that seed
as an input and pass it explicitly to interaction, learning-audio, and
completion event factories. Game components must not derive a second seed.
This creates one stable handoff for future platform-issued seeds and Phaser
wrappers while preserving deterministic local fallback behavior at the shell.
See ADR 0716.

# DR-790: Active Phaser Candidate Order Resolution

The active external candidate order is now explicitly Memory Match first,
Balloon Pop second, Label It third, and a gated voice candidate after those
reviews. Older inventory text that named Balloon Pop first remains historical
evidence and is marked superseded. This order reflects the lower-risk pairing
boundary first, followed by motion/timing, teacher image-asset, and microphone
risks. No candidate is approved for import by this ordering. See ADR 0717.

# DR-791: Platform Replay Seed Injection Boundary

The canonical route shell exposes an optional `platformReplaySeed` input for
future platform-issued or approved provider-issued replay seeds. Only a valid
transport-safe seed is accepted; an absent or malformed value falls back to
the deterministic unit-and-mode seed. The shell remains the single handoff
authority and mounted games must receive and reuse the resulting seed for
every required event. This reserves a stable Phaser integration seam without
importing frozen source or enabling persistence, provider networking, or live
assignment behavior. See ADR 0718.

# DR-792: Memory Match Source Mapping Remains Review-Only

The isolated frozen Memory Match scene has been mapped against the canonical
pairing, audio, scoring, replay, identity, persistence, lifecycle, and tenant
contracts without copying source. Its visual interaction is a promising first
wrapper candidate, but scene-owned randomness, scoring, browser persistence,
direct audio, and lifecycle behavior must be replaced or adapted before any
integration proposal. See `docs/PHASER_MEMORY_MATCH_MAPPING_REVIEW.md`.

# DR-793: Documentation Integrity Gate

The principles document and decision register now have an executable integrity
check. It rejects duplicate section IDs or titles and duplicate decision IDs or
titles, while allowing valid historical decision records to remain out of
numerical order. The check runs from foundation composition and preserves the
cross-cutting Agent Standards subsection as `11.1`. See ADR 0719.

# DR-794: Blueprint Foundation Phase Alignment

The blueprint now records the decisions already implemented by the foundation:
tenant configuration from day one, MiniStar as flagship tenant, the curated
Flashcards -> Match Up -> Label It -> Memory Match learner pathway, static JSON
before live AI, and provider-neutral backend contracts. Memory Match is the
first external Phaser review candidate, which is separate from student unlock
order. The next gate is the isolated Phaser candidate return package; source
promotion remains blocked until its evidence and wrapper review pass. See ADR
0720.

# DR-795: Balloon Pop Source Mapping Remains Review-Only

The frozen Balloon Pop scene has been mapped as the second external Phaser
candidate. Its timing, target-box, and motion ideas are useful, but random
round selection, scene-owned scoring/combo state, direct audio, global pointer
input, delayed callbacks, and BaseEngine identity/storage require platform
replacement before any wrapper proposal. The source remains isolated and the
candidate package gate remains mandatory. See ADR 0721 and
`docs/PHASER_BALLOON_POP_MAPPING_REVIEW.md`.

# DR-796: Phaser Candidate Profile Gate

The external Phaser evidence verifier now uses explicit approved candidate
profiles. Memory Match maps to `pairing` and requires the four baseline
deterministic scoring scenarios; Balloon Pop maps to `selection` and also
requires a `miss` scenario. Fixture and event metadata must match the selected
profile. This expands reviewability without permitting source import, route
replacement, package promotion, or student assignment. See ADR 0722.

# DR-797: Phaser Candidate Manifest Integrity

The shared Phaser candidate profile manifest is now validated before package
review. It must contain unique target modes, supported parent engines, labels,
and at least four unique non-blank deterministic scoring scenarios per profile.
Malformed configuration fails closed and cannot silently weaken the evidence
gate. This remains review configuration only and does not authorize source
import, route replacement, package promotion, or student assignment. See ADR
0723.

# DR-798: Phaser Source Evidence Command

Expose the frozen Phaser source identity check as the documented npm command
`npm run verify:phaser-source-evidence`. The command may read the default
isolated review folder or `LIVING_TEXTBOOK_ZAI_REVIEW_ROOT`, compares the
review packet's SHA-256 manifest, and reports source identity without changing
the application. A passing check does not authorize candidate import, route
activation, scoring ownership, persistence, or assignment. See ADR 0724.

# DR-799: Frozen Source Checker Quarantine Guard

Require the frozen Phaser source evidence checker to keep all manifest paths
inside the configured isolated snapshot and remain read-only. The dedicated
contract verifier must reject write, import, process, and application-path
markers while requiring the review-root override and path-containment checks.
This strengthens reproducibility without changing the review-only status or
authorizing source import, route activation, scoring, persistence, or
assignment. See ADR 0725.

# DR-800: Phaser Review Profile Binding

Require every Phaser contract-review record with a game mode and parent engine
to match the approved shared candidate profile. Unknown modes and incompatible
engines fail validation before review surfaces or external candidate evidence
can be treated as aligned. This strengthens profile identity without authorizing
source import, route activation, scoring, persistence, package promotion, or
assignment. See ADR 0726.

# DR-801: Phaser Review Source-Path Boundary

Require every source-file reference in a Phaser contract-review record to be a
unique repository-relative POSIX path. Absolute paths, Windows drive paths,
backslashes, and parent-directory traversal fail closed. This keeps evidence
portable and prevents review metadata from escaping the isolated candidate
boundary. The change does not authorize source import, route activation,
scoring, persistence, package promotion, or assignment. See ADR 0727.

# DR-802: Phaser Evidence Artifact-Path Uniqueness

Require every required artifact in a Phaser candidate return package to use a
distinct relative path in addition to a distinct kind and artifact identifier.
A checksum validates file bytes but cannot replace a missing evidence artifact;
duplicate paths therefore fail closed. The package remains review-only and the
change does not authorize source import, route activation, scoring,
persistence, package promotion, or assignment. See ADR 0728.

# DR-803: Phaser Review Payload-Shape Hardening

Treat Phaser contract-review handoffs as untrusted JSON. Missing or malformed
evidence arrays, null collection entries, and missing nested approval blockers
must fail closed with actionable validation errors rather than throwing. This
protects review tooling from partial handoffs without authorizing source
import, route activation, scoring, persistence, package promotion, or student
assignment. See ADR 0729.

# DR-804: Frozen Source Manifest Path Integrity

Require each frozen Phaser source evidence manifest path to be unique and a
normalized repository-relative POSIX path before hashing. Duplicate, absolute,
drive-letter, backslash, empty-segment, dot-segment, and parent-directory paths
fail closed. The checker remains read-only and isolated; this does not
authorize source import, route activation, scoring, persistence, package
promotion, or assignment. See ADR 0730.

# DR-805: Canonical Game Event Payload Hardening

Treat canonical game event evidence as untrusted JSON. Non-array inputs and
null or malformed event entries must fail closed with actionable validation
errors rather than throwing. Valid event ordering, identity, audio, replay,
scoring, mastery, completion, and support-language boundaries remain enforced.
This does not authorize live progression, persistence, reporting, or student
assignment. See ADR 0731.

# DR-806: Canonical Completion Terminal Boundary

Treat `game_completed` as the terminal gameplay event. Post-completion
`game_started`, `round_shown`, `answer_submitted`, `answer_result`, or
`mastery_updated` events fail closed, while non-gameplay learning-audio replay
may remain available without reopening progression. This protects canonical
wrappers and future Phaser adapters from late gameplay mutations. See ADR
0732.

# DR-808: Controlled Z.ai Intake State

Align the teacher foundation status with the explicitly opened controlled
external-prototype gate. The status may say `Controlled intake open` as a
human handoff signal for one isolated Z.ai or Phaser candidate in
`Drewsure/ministar-lab`, while `No Z.ai import before returned-package review`
remains visible. Returned evidence must still pass the candidate package gate
and a candidate-specific Codex integration decision before source import, route
activation, production promotion, persistence, scoring ownership, or student
assignment. See ADR 0734.

# DR-809: Progress Envelope Factory Boundary

Require progress-event envelope creation to fail closed for unsupported event
types and known event types missing from the supplied taxonomy. The factory
must not silently assign a fallback `report-only` effect, because that would
create misleading evidence before stream validation. This protects browser,
Phaser, import, teacher-report, and progression adapters without authorizing
live persistence, report export, progression, or assignment. See ADR 0735.

# DR-811: Shared Replay-Seed Factory Boundary

Require the shared web progression factories to normalize provider-supplied
replay seeds through the canonical `replay-v1` resolver before producing
game-start, interaction, audio, or completion events. Invalid seeds fall back
to the deterministic unit/mode seed. This keeps replay evidence consistent
across browser games and future Phaser wrappers without enabling live writes or
source promotion. See ADR 0737.

# DR-812: Progress Envelope Stream Chronology Boundary

Require progress-event envelope batches to preserve non-decreasing
`occurred_at` order after individual timestamp validation. An out-of-order
batch must fail closed before report or persistence interpretation, while
launch-scoped teacher reports may continue to contain multiple learner session
IDs. This remains verification-only and does not authorize live storage,
report export, progression, rewards, assignment, or Phaser source promotion.
See ADR 0738.

# DR-807: Canonical Game Event Type Boundary

Require canonical game event evidence to use the shared `GAME_EVENT_TYPES`
content-model vocabulary. Unknown runtime event strings must fail closed before
sequence ordering, completion, reporting, or progression evidence is accepted.
This protects DOM games, future Phaser wrappers, imports, and teacher report
evidence from silent taxonomy drift. The change does not authorize live
persistence, route activation, source promotion, or student assignment. See
ADR 0733.

# DR-813: Shared Learning-Audio Replay Handoff

Require the playable game route shell to pass its route-resolved canonical
replay seed into the shared learning-audio contract, and require shell-level
`audio_requested` events to preserve it. This keeps teacher and student audio
replays in the same canonical evidence stream as the mounted game without
authorizing persistence, scoring, progression, rewards, assignment, or Phaser
source promotion. See ADR 0739.

# DR-814: Canonical Game-Mode Scoring Profile Binding

Require canonical `mastery_updated` and `game_completed` events to use the
content-model scoring profile assigned to their game mode, in addition to
matching each other. This prevents browser or Phaser wrappers from claiming a
different deterministic scoring rule at the event boundary without enabling
live scoring mutation, persistence, progression, rewards, assignment, or
source promotion. See ADR 0740.
# DR-815: Shared Scoring Profile Source

Keep the canonical game-mode-to-scoring-profile assignments and derived
profile identifier type in the shared content model. Web catalog and scoring
helpers must consume that source, and mode lookup must be total for the
supported canonical modes. This prevents profile drift without enabling live
persistence, scoring mutation, progression, rewards, assignment, or Phaser
source promotion. See ADR 0741.
# DR-816: Required Scoring Profile At Playable Boundary

Require every canonical playable wrapper to resolve its scoring profile from
the shared mode map. Hard-coded identifiers, `none`, and nullable fallbacks
are prohibited in mastery or completion evidence; missing configuration must
fail clearly. See ADR 0742.

# DR-817: Target-Language Audio At Completion Boundary

Require playable game completion gates to validate learner-facing audio
evidence against the unit/tenant target language. Support-language cues remain
support-only and cannot unlock or complete target-language learning. Regional
language tags may match their base language. This does not enable live
persistence, scoring mutation, progression, rewards, assignment, or Phaser
source promotion. See ADR 0743.

# DR-818: Canonical Game Completion Dust Caps

Keep per-mode completion dust caps in the shared content model. Web scoring
profiles reference those caps; progression clamps awards at the mode cap and
the unit economy cap; canonical evidence rejects over-cap mastery or
completion awards. This does not enable persistence, scoring mutation,
progression policy changes, rewards, assignment, or Phaser source promotion.
See ADR 0744.

# DR-819: Canonical Report Target-Language Evidence

When tenant or unit language context is available, teacher report validation
must pass the resolved target language into canonical game evidence replay.
Support-language audio remains useful as assistance, but cannot satisfy the
target-language evidence required for a ready game report. Older review-only
callers may omit the language when they have no unit context. This does not
enable persistence, report export, progression, rewards, assignment, or Phaser
source promotion. See ADR 0745.

# DR-822: Canonical Wrapper Feedback-Language Alignment

Canonical learner-facing feedback and replay controls must use the resolved
tenant/unit target language when a reviewed cue does not provide a language.
This applies to Match Up and future canonical wrappers. This does not enable
live persistence, report export, progression, rewards, assignment, or Phaser
source promotion. See ADR 0748.

# DR-823: Canonical Audio Fallback Regression Guard

Canonical integration verification must reject learner-facing audio language
expressions that fall back directly to English inside a game wrapper. The
English baseline remains valid only at the explicit target-language resolver
boundary. This does not enable live persistence, report export, progression,
rewards, assignment, or Phaser source promotion. See ADR 0749.

# DR-824: Shared Route-Surface Audio

Locked-activity and next-activity learner cards must receive the resolved
tenant/unit target language from the playable route shell. They must not rely
on the audio component's English default when route language context exists.
This does not enable persistence, report export, progression, rewards,
assignment, or Phaser source promotion. See ADR 0750.

# DR-825: Explicit Target-Language Audio Actions

Make `audioLanguage` a required input for learner-facing
`AudioSupportedAction` controls. Canonical game actions and shared student,
training, media, and progress surfaces must pass the resolved tenant/unit
target language instead of relying on the audio component's English default.
This does not enable persistence, report export, progression, rewards,
assignment, or Phaser source promotion. See ADR 0751.

# DR-826: Learner Route-Guidance Audio

Recommended game paths, activity-hub summaries, recovery recommendations,
and media playlist controls must receive the resolved tenant/unit target
language for tap-to-speak content. Route guidance remains support-only and
cannot unlock mastery. This does not enable persistence, report export,
progression, rewards, assignment, or Phaser source promotion. See ADR 0752.

# DR-827: Explicit Speech Primitive Language

Require `language` on the shared speech primitives and reject their implicit
English defaults. Caller-owned tenant, unit, reviewed-cue, and assist
language context must be explicit at each learner speech boundary. This does
not enable persistence, report export, progression, rewards, assignment, or
Phaser source promotion. See ADR 0753.

# DR-828: Shared Target-Language Resolver

Use one content-model resolver for target-language precedence across tenant,
unit, learner route, canonical game, media, printable, training, and teacher
evidence boundaries. The resolver chooses tenant target language first, unit
language second, and the explicit English platform baseline last. This avoids
white-label drift caused by individual routes or games reimplementing the
fallback chain. It does not change support-language policy, progression
triggers, scoring, persistence, reporting, assignment, rewards, or Phaser
source promotion. See ADR 0754.

# DR-829: Printable Target-Language Boundary

Printable worksheet previews must receive tenant target-language context at
the route boundary and resolve it before unit language. This keeps paper
vocabulary and sentence outputs aligned with interactive games and media while
preserving the rule that print is support-only and cannot award mastery,
Star Dust, completion, or progression. See ADR 0755.

# DR-830: Runtime Target-Language Precedence Coverage

The shared target-language resolver must be covered by runtime assertions for
tenant override, unit fallback, whitespace normalization, explicit fallback,
and the English platform baseline. Static source checks alone do not prove the
precedence result. See ADR 0754.

# DR-832: Explicit AI Draft Target Language

AI-generated draft payloads must carry a non-empty `unit_meta.target_language`.
The validator must reject omission rather than silently selecting English,
because the draft is a white-label content boundary and its audio, progression,
and review evidence depend on the declared target language. No AI provider
dispatch, billing, persistence, package assembly, route creation, assignment,
or Phaser source promotion is enabled. See ADR 0754.

# DR-831: Teacher Evidence Language Display Boundary

Teacher session evidence must use the shared tenant-first target-language
resolver when an event does not carry a language value. A display fallback must
not silently label a white-label tenant's evidence as English. This is a
presentation boundary only and does not create event acceptance, persistence,
export, progression, scoring, assignment, or reward authority. See ADR 0754.

# DR-833: Required Canonical Completion Target Language

The canonical game completion gate must receive the resolved tenant-first
target language as a required input. This keeps completion evidence aligned
with the mounted learner experience and makes omissions visible at compile
time and in static verification. The gate remains validation-only and does
not create progression, mastery, persistence, reporting, assignment, reward,
or Phaser source-promotion authority. See ADR 0756.

# DR-834: Required Canonical Game Wrapper Language

All active canonical game wrappers must require the resolved target language
from their route/orchestration caller. Optional wrapper language would allow
learner audio and completion evidence to drift from tenant policy. The static
canonical verifier must guard every wrapper. This does not create progression,
mastery, persistence, reporting, assignment, reward, or Phaser
source-promotion authority. See ADR 0757.

# DR-835: Required Teacher Report Target Language

Teacher report runtime requests and canonical game evidence validation must
require a non-empty target language. This keeps teacher evidence aligned with
the white-label learner experience and prevents a silent English fallback.
Generic report parsing remains reusable outside the runtime boundary. This
does not create report export, persistence, progression, assignment, reward,
or Phaser source-promotion authority. See ADR 0758.

# DR-836: Non-Blank Completion Language Runtime Guard

Canonical completion must reject missing or blank target language before event
replay validation. This closes the runtime gap left by a type-only requirement
when data arrives through JavaScript or serialization. The guard is
validation-only and does not create progression, mastery, persistence,
reporting, assignment, rewards, or Phaser source-promotion authority. See ADR
0759.

# DR-837: AI Evidence Target Language Fail-Closed Assembly

AI-generated game build briefs and prototype audio-coverage evidence must
require explicit target language from reviewed source records. Missing
language must fail package assembly rather than silently selecting English.
This does not create provider calls, billing, assignment, progression,
persistence, reporting, or Phaser source-promotion authority. See ADR 0760.

# DR-838: Phaser Candidate Root Isolation

The Phaser candidate verifier must receive a package from an isolated folder
outside the `LivingTextbook` repository. It must resolve and check the return
manifest and every artifact as regular files inside that candidate root,
rejecting repository paths and symlink escapes before reading evidence. This
keeps the Z.ai handoff review-only and prevents an evidence packet from
accidentally becoming a source-import mechanism. It does not authorize source
promotion, route replacement, scoring mutation, audio-manifest mutation,
assignment, persistence, or student use. See ADR 0761.

# DR-839: Canonical Game Replay Harness

Every active canonical game mode must pass a deterministic synthetic replay
through the shared event validator. The replay must carry the mode's scoring
profile, dust cap, target-language audio, replay-v1 seed, tenant/unit/launch/
student identity, and ordered completion evidence. This is foundation
verification only. It does not create learner routes, write persistence,
award Star Dust, replace visual or browser tests, or authorize Phaser source
promotion. See ADR 0762.

# DR-840: Canonical Flashcard Entry Slice

Flashcards are registered as a separate canonical entry slice because they
open the teacher-QR learner journey through reviewed target-language practice,
not through the ordinary unlocked-game wrapper. The slice must preserve audio
replay, deterministic completion, next-mode policy, and the rule that support
language cannot unlock the next game. This does not create a new engine, route
authority, persistence provider, assignment path, or Phaser promotion path.
See ADR 0763.

# DR-841: Flashcard Entry Runtime Gate

The Flashcard entry adapter must reject partial target-language engagement
without emitting completion or unlock events. A complete reviewed pass must
award the canonical entry dust, complete Flashcards, and emit unlock events
with support-language unlocking explicitly false. This keeps teacher-QR
onboarding target-language triggered while preserving assist-language support.
It does not authorize persistence, assignment, or Phaser source promotion.
See ADR 0764.

# DR-842: Flashcard Entry Idempotence

Repeated completed Flashcard entry submissions must remain completed while
awarding zero additional Star Dust and emitting no duplicate completion or
unlock events. This protects teacher-QR onboarding from double taps, refreshes,
retries, and replayed requests. It does not authorize persistence, assignment,
or Phaser source promotion. See ADR 0765.

# DR-843: Pairing Engine Runtime Contract

The reusable Pairing engine must prove deterministic selection, duplicate-tap
handling, mismatch recovery, correct source/target matching, completion,
terminal retry safety, and progress summaries before Memory Match or another
pairing skin is treated as a canonical integration. This is foundation
evidence only and does not authorize Phaser source promotion, persistence, or
student assignment. See ADR 0766.

# DR-844: Selection Engine Runtime Contract

The reusable Selection engine must produce deterministic vocabulary and syntax
rounds with unique options, exactly one correct answer, prompt and option
audio text, and shared interaction event expectations before Quiz, True/False,
Balloon Pop, or another selection skin is treated as a canonical integration.
This is foundation evidence only and does not authorize Phaser source
promotion, persistence, or student assignment. See ADR 0767.

# DR-845: Text/Spelling Engine Runtime Contract

The reusable Text/Spelling engine must consume exactly two reviewed target
sentences and produce deterministic ordered tiles with learner-language audio,
stable punctuation handling, scoring identity, and shared event expectations
before Sentence Builder or another text/spelling skin is treated as a
canonical integration. This does not authorize source promotion, persistence,
or student assignment. See ADR 0768.

# DR-846: Speaking Engine Runtime Contract

Speak It must assemble deterministic term and sentence prompts with stable
identities, preserve reviewed target-language text, and match optional audio
cue assets case- and whitespace-insensitively. Microphone capture remains
teacher-controlled local replay and cannot be required for core completion.
This does not authorize AI speech scoring, persistence, or Phaser source
promotion. See ADR 0769.

# DR-847: Balloon Pop Evidence Handoff

Balloon Pop may be prepared as the second isolated Z.ai candidate after the
Selection parent-engine contract is green, but its timing, motion, misses,
audio, accessibility, scoring, and replay behavior require the complete
candidate evidence package before any wrapper promotion. The brief does not
authorize source import, route activation, persistence, assignment, or student
use. See ADR 0770.

# DR-848: Canonical Parent-Engine Binding

Canonical `mastery_updated` and `game_completed` evidence must identify the
parent engine declared for the game mode. The content model owns the mapping,
and the canonical replay verifier rejects missing or mismatched bindings.
This closes the integration boundary for future Z.ai/Phaser wrappers without
importing source or changing the active game routes. See ADR 0771.

# DR-849: Curated Unit Pathway Resolution

The visible game sequence now resolves from the tenant-scoped curated unit
offer map when one exists, using the shared catalog only as a structural
fallback. This preserves white-label curriculum control and the reviewed
activity order without creating a giant switch-anything panel. Training
Academy remains the final review lane. See ADR 0772.

# DR-850: Teacher Session Provider Boundaries

Teacher session reporting must consume roster and curated offer data from the
launch-context provider. Reusable teacher cards and monitors must not resolve
sample fixtures by launch code or package id. This preserves white-label
tenant substitution and keeps preview-only missing-plan behavior explicit.
See ADR 0773.

# DR-851: Dashboard Provider Boundary

The reusable dashboard consumes tenant-owned launch, package, offer-map, QR,
pilot, validation, and reporting data through props. Only the app/provider
boundary may compose MiniStar fixtures, keeping white-label substitution
possible without forking dashboard layout or game pathway components. See ADR
0774.

# DR-852: Teacher Reporting Contract Types

Reusable teacher reporting panels and demo providers import their contracts from
the neutral `packages/content-model/src/teacherReporting.ts` module. Tenant
configuration is also owned by the content model, with the web tenant type file
remaining only as a compatibility re-export. This keeps white-label reporting
providers interchangeable and prevents fixture or UI modules from becoming
domain APIs. See ADR 0775.

# DR-853: Curated Activity Offer Contract

`UnitGameOffer` and `UnitGameOfferMap` are neutral content/provider contracts,
not web-feature definitions. The web path remains a compatibility re-export so
existing screens can migrate without a flag day. Launch, student, teacher, and
dashboard surfaces consume curated maps from provider boundaries, preserving
white-label tenant substitution and pre-reviewed activity pathways. See ADR
0776.

# DR-854: Review Contract Public Boundary

Review-only evidence, verifier, intake-readiness, prototype-return, and AI
generation-preview contracts used by the web application are public
content-model contracts. Panels and sample fixtures consume them through the
package root, preventing reusable platform surfaces from coupling to internal
file paths. This is ownership hardening only and does not authorize live AI,
uploads, persistence, assignment, or Phaser promotion. See ADR 0777.

# DR-855: Persistence And Pilot Policy Public Boundary

Persistence record categories and pilot-policy requirements used by web
surfaces are neutral content-model contracts consumed through the package
root. This keeps tenant providers and reusable panels replaceable while
preserving the no-side-effect, privacy, reporting, deployment, and pilot
policy gates. It does not create live database writes or authorize Phaser
promotion. See ADR 0778.

# DR-856: Public Contract Import Guard

App source must consume content-model contracts through the package root. The
foundation composition suite now executes a guard that rejects internal
`@living-textbook/content-model/src/*` imports in web and AI-service source.
The migration is an API-boundary cleanup only; it does not enable live AI,
uploads, persistence, assignment, or Phaser promotion. See ADR 0779.

# DR-857: Content-Model Package Export Map

The content-model package exposes one canonical root export targeting
`src/index.ts` and does not expose internal subpath exports. The boundary
verifier checks this manifest contract alongside source import hygiene. This
does not enable live services or external game promotion. See ADR 0780.

# DR-858: UI Package Export Map

The UI package exposes one canonical root export targeting its public
component index and does not expose internal primitive subpaths. The shared
package-boundary verifier checks this alongside content-model exports. This
does not enable live services or external game promotion. See ADR 0781.

# DR-859: Game Audio Readiness Route Gate

Canonical game routes now use a shared content-model coverage calculation for
target-language terms, target sentences, and a mode-scoped instruction cue.
Missing audio coverage pauses gameplay and scoring with a review-only access
gate. It is not treated as learner failure and cannot produce mastery,
completion, or reward evidence. Approved browser text-to-speech remains a
possible cue source, but it does not bypass package review or language/scope
checks. See ADR 0782.

# DR-860: Audio-Consistent Activity Hub

The student activity hub must calculate readiness with the same shared game
audio coverage contract used by direct game routes. A progression-ready game
with incomplete target-language audio is displayed as an audio-review block,
not as a learner failure and not as a misleading open-game action. See ADR
0783.

# DR-861: Audio-Gated Entry Paths

All flashcard entry paths now calculate and enforce the shared target-language
audio coverage contract before unlocking the next activity. This includes the
dedicated flashcard route, front-door access flow, and normal student launch
flow. Support-language audio remains assistive only and cannot satisfy the
English/target-language progression gate. See ADR 0784.

# DR-862: Level-Safe Game Sequence Fallback

The game sequence fallback now filters canonical modes through each catalog
entry's supported curriculum levels when a curated offer map is unavailable.
Curated offers remain authoritative, and all downstream audio, progression,
and route gates remain in force. See ADR 0785.

# DR-863: Activity Hub Level Boundary

The student activity hub now filters both reviewed offers and no-map fallback
items through the catalog's supported curriculum levels before presentation.
This keeps the learner-facing pathway consistent with direct route safety and
does not treat a ready offer as permission to bypass level support. See ADR
0786.

# DR-864: Learner Continuation Audio Boundary

The Next Game card and recommended route list now combine progression readiness
with reviewed target-language audio readiness before offering a learner an
active continuation action. Route summaries and audio cues use the resolved
tenant language, while incomplete coverage is shown as audio review rather
than learner failure. See ADR 0787.

# DR-865: Completion Navigation Audio Boundary

The shared playable-route completion card now checks reviewed target-language
audio for the next activity before offering an active navigation action. The
route shell passes unit and audio context; the card calculates next-activity
readiness. A completed current game therefore cannot advertise a blocked next
route as ready. See ADR 0788.

# DR-866: Explicit Audio Scope

Shared game audio coverage now excludes cues whose explicit `gameMode` does
not match the current game. Generic unit-scoped term and sentence cues remain
reusable, while explicitly scoped vocabulary, sentence, and instruction cues
cannot satisfy another mode's readiness. See ADR 0789.

# DR-867: Audio Support Plan Authority

Learner game routes now pass the unit audio support plan into the shared
coverage contract. The plan's `gameModeAudioCueIds` authorizes reviewed reuse
of explicitly scoped term or sentence cues and determines which cue families
the mode requires. Package validation remains the first gate; runtime coverage
is the learner-facing final gate. See ADR 0790.

# DR-868: Mode-Scoped Instruction Audio

Runtime instruction readiness now uses the unit audio support plan as its
allow-list when a game-mode mapping exists. Shared instruction cues must be
listed in the plan, and mode-specific instruction cues must be listed in that
mode's `gameModeAudioCueIds`; a same-unit instruction cue by itself is not
enough to open the learner route. See ADR 0791.

# DR-869: Tenant-Owned Audio Evidence

The shared runtime audio coverage helper now requires each cue to match both
the active unit key and the unit's owning tenant before it can count toward
readiness. This is a runtime defense-in-depth boundary for white-label
isolation; package validation remains authoritative for content integrity. See
ADR 0792.

# DR-870: Front-Door Continuation Context

The teacher-directed front door now passes its resolved unit audio support plan
into the recommended-route card. This keeps front-door continuation aligned
with direct routes, the activity hub, completion navigation, and normal student
launch. See ADR 0793.

# DR-871: Authorized Game Playback Cues

The shared content model now exposes authorized game audio cues and uses the
same selection for readiness and gameplay playback. Direct routes, front-door
practice, and dynamic student launch games therefore receive only unit-owned,
target-language, reviewed mode-scope cues. See ADR 0794.

# DR-872: Reviewed Asset Audio Playback

The shared learner audio control now prefers a reviewed cue `sourceUri` when
one is available and falls back to browser speech synthesis when it is not
playable. The source choice remains presentation-only: it cannot grant
progress, mastery, rewards, or unlocks, and `localBundlePath` remains reserved
for a future local-companion resolver. See ADR 0795.

# DR-873: Browser Audio Locator Boundary

Browser learner audio now accepts only same-origin or HTTP(S) cue locators.
Filesystem, script, data, and malformed values fall back to speech synthesis;
local companion deployments must supply an explicit resolver. This protects
white-label media boundaries without adding provider cost or changing game
progression authority. See ADR 0796.

# DR-874: Explicit Media Delivery Mode

The multimedia resolver now keeps hosted-first browser playback hosted-only.
It does not fall back to a `localBundlePath`; local-first delivery must be an
explicit local-companion choice and may then fall back to hosted media. Missing
sources remain visible as unavailable rather than being treated as offline
ready. See ADR 0797.

# DR-875: Explicit Media Mode Propagation

Playlist and unit media components now accept an explicit media resolution
mode, and hosted sample routes declare `hosted-first` at their boundary.
Future local or hybrid companions must select `local-first` deliberately
through a deployment adapter. This keeps delivery transport separate from
rights, release, progression, and reporting authority. See ADR 0798.

# DR-876: Entry Practice Cue Fidelity

The canonical Flashcard Practice entry slice now passes reviewed instruction,
term, sentence, and completion cues into shared audio controls. Speech remains
the fallback, while listening engagement and progression gates remain separate.
See ADR 0799.

# DR-877: Canonical Game Cue Fidelity

Canonical game instructions, prompts, terms, sentences, and feedback now pass
authorized reviewed cues into shared audio controls where available. Speech
remains a fallback for uncued authored copy, and playback cannot affect game
authority. See ADR 0800.

# DR-878: Audio Transcript Match Guard

Shared audio controls now compare the visible text with the reviewed cue text
before using a recorded source. Mismatched feedback states use speech fallback
for the exact visible sentence instead of playing an incorrect recording. This
keeps reviewed audio trustworthy without changing gameplay authority. See ADR
0801.

# DR-879: Direct Playback Guard

Immediate term and feedback announcements now use the shared playback
primitive, including its transcript-match protection. This keeps direct game
announcements aligned with visible Listen/Replay controls and does not introduce
a second scoring or progression path. See ADR 0802.

# DR-880: Production-Shaped Vertical Slice Gate

The first release-shaped white-label slice is now governed by one auditable
cross-boundary gate. It must cover teacher package resolution, a second tenant,
QR/front-door launch, reviewed audio, Flashcard entry practice, Memory Match,
one canonical game, deterministic progression and reward evidence, teacher
report evidence, and hosted/local delivery boundaries.

The gate is intentionally preview-safe: a teacher report may prove the event
and evidence shape without claiming live durable student persistence or export.
Frozen Z.ai/Phaser source remains isolated until it satisfies the shared
contracts and promotion gates. See ADR 0803.

The first browser rehearsal evidence bridge is deliberately local and
non-authoritative. It lets the teacher view the actual same-origin demo event
stream while preserving the distinction between a rehearsal adapter and live
student-data persistence. See ADR 0804.

# DR-881: Synchronous Event Append Boundary

The canonical student event append boundary must update its synchronous event
ref before scheduling React state. Completion gates validate the ref snapshot,
so deferred-only ref updates can silently reject valid mastery evidence even
when the rendered event log later appears correct. See ADR 0805.

# DR-885: First Durable Progression Provider

The first real persistence slice now uses a server-only SQLite adapter behind
the typed hosted progression contract. It is durable across process restarts,
tenant-scoped by composite identity, idempotent by continuity id, and guarded
by explicit provider, write, school-policy, retention, release, and
server-side authorization gates. Process-memory rehearsal remains separate and
is never described as learner-data persistence. See ADR 0813.

# DR-886: Authenticated Student Session Boundary

The coded front door now has a server-validated session boundary for the first
durable pilot path. The server validates the tenant, package, launch, entry
code, and roster user code, then issues a signed expiring HttpOnly cookie. A
browser progression write is accepted only when that cookie matches every
tenant-scoped identity field in the request. Teacher/server reads retain their
separate server-only bearer authorization. Rehearsal mode remains available
when durable deployment gates are off. See ADR 0814.

# DR-887: Closed-Pilot Operations Boundary

The first durable progression provider now has a server-only operations
boundary for health, backup, restore, and retention deletion evidence. The
operations gate requires explicit school-policy, retention-policy, and release
approval settings. Deletion is identity-scoped and the teacher-facing status
surface is deliberately redacted. See ADR 0815.

# DR-888: Persistence Operations Evidence Ledger

Closed-pilot backup, restore, and retention deletion now have server-side
metadata receipts. The receipts use a one-way scope digest and preserve
checksum, timing, schema, retention, and deletion-count evidence without
storing raw student-session identifiers or learner payloads. The teacher
surface is read-only. See ADR 0816.

# DR-889: Persistence Evidence Chain

Persistence operation receipts now form a tamper-evident hash chain. Health
diagnostics verify the chain, and the teacher-safe status surface reports only
integrity state and verified count. This is an integrity signal for the closed
pilot, not a substitute for authenticated access, encrypted storage, or an
immutable external audit service. See ADR 0817.

# DR-891: Canonical Memory Match Integration Gate

Memory Match now has a focused integration gate that joins the active
canonical pairing wrapper and route to the frozen MiniStar Phaser candidate
review. The gate reports the candidate profile, frozen source provenance, and
all required evidence lanes in one review-only surface.

The gate remains blocked while wrapper, fixture, event, target-language audio,
deterministic scoring, mobile/accessibility, or Codex decision evidence is
missing. It explicitly blocks direct source import, route replacement,
scene-owned scoring or persistence, package promotion, and student assignment.
This is the point at which future Z.ai evidence work will be requested; it is
not an approval to integrate the frozen source. See ADR 0819 and
`docs/verification/CANONICAL_MEMORY_MATCH_INTEGRATION_GATE_CHECKS.md`.

# DR-892: Memory Match Evidence Handoff Packet

The first concrete Z.ai engagement point is now a human-triggered,
review-only evidence handoff packet for the frozen Memory Match candidate.
The packet binds frozen provenance and requires nine return artifacts covering
the reviewed fixture, canonical event replay, target-language audio,
deterministic scoring, mobile/accessibility, wrapper boundaries, checksums,
and setup limitations.

The packet is handoff-ready but integration-blocked. It does not dispatch Z.ai,
import source, replace the canonical route, allow scene-owned scoring or
persistence, activate a package, mutate rewards, or create an assignment.
Codex must review the returned evidence and record a separate integration
decision before any promotion work can begin. See ADR 0820 and
`docs/verification/MEMORY_MATCH_EVIDENCE_HANDOFF_CHECKS.md`.

# DR-893: Production-Shaped Vertical Slice Handoff

The first production-shaped white-label slice now requires handoff-aware
navigation across the canonical entry, Memory Match, and Sentence Builder
routes. Flashcard completion and completed game routes use one shared helper
to bind tenant, package, launch, student-session, source route, destination
route, progression snapshot, and event cursor before navigation.

Direct route access remains blocked by the destination game shell. Missing
package identity, failed storage, or identity mismatch keeps the destination
locked. The slice remains target-language driven, audio-first, deterministic,
tenant-neutral, and free of raw learner audio or transcript persistence. See
ADR 0821 and `docs/verification/PRODUCTION_VERTICAL_SLICE_CHECKS.md`.

# DR-894: Cross-Route Local Evidence Continuity

The browser rehearsal evidence record now carries the content-package identity
and accepts validated event contributions from standalone canonical routes.
Flashcards and the shared playable game shell merge route-local events into one
launch-bound record with exact-event deduplication; the newest validated
progression snapshot is retained.

This does not enable hosted persistence, live learner reporting, export, raw
audio or transcript storage, or cross-session merging. Package, tenant, unit,
launch, and student-session mismatches reject the append. Teacher views remain
read-only rehearsal surfaces. See ADR 0822 and
`docs/verification/LOCAL_SESSION_EVIDENCE_CONTINUITY_CHECKS.md`.

# DR-895: Teacher Rehearsal Reconciliation

The teacher session page now validates the local browser evidence record
against the expected tenant, content package, and student-session identity
before displaying its activity detail. A read-only journey summary groups
observed canonical routes and reports starts, answer results, completion,
mastery events, and learning-audio requests.

This is still browser rehearsal evidence, not hosted persistence or a live
classroom report. Mismatched evidence is hidden and explained. The surface
cannot mutate progression, unlock games, award rewards, store raw audio or
transcripts, or export a report. See ADR 0823 and
`docs/verification/TEACHER_REHEARSAL_RECONCILIATION_CHECKS.md`.

# DR-897: Pilot Evidence Envelope

## Decision

Introduce one typed, provider-neutral pilot evidence envelope derived from the
validated browser rehearsal record. Teacher reporting uses it as the coherent
session summary for the canonical Front Door -> Flashcards -> Memory Match ->
Sentence Builder -> Teacher Report journey.

## Included

- Tenant, package, launch, unit, student-session, and target-language identity.
- Ordered workflow, deterministic stage status, event counts, event types,
  completed modes, progression snapshot, and stable idempotency key.
- Explicit privacy flags excluding raw learner audio, transcripts,
  support-language progress, durable writes, and live classroom records.
- Browser-rehearsal derivation that remains independent of the future hosted or
  local persistence provider.

## Excluded

- Hosted storage, report export, assignment results, live classroom status,
  reward mutation, and student unlock authority from the envelope itself.

See ADR 0825 and
`docs/verification/PILOT_EVIDENCE_ENVELOPE_CHECKS.md`.

# DR-896: Pilot End-to-End Session Rehearsal

## Decision

Make the first production-shaped white-label rehearsal an ordered,
tenant-neutral journey from the coded front door through Flashcards, Memory
Match, Sentence Builder, and the teacher report. The canonical-games gate now
checks that this sequence is represented in the rehearsal fixture, runtime
handoffs, teacher evidence boundary, and hosted persistence safety boundary.

## Included

- A teacher-only, dry-run rehearsal sequence with explicit route expectations.
- Target-language Flashcard completion as the first unlock trigger.
- Validated handoffs into Memory Match and Sentence Builder.
- Cumulative, deduplicated local session evidence bound to package and student
  session identity.
- Teacher-visible read-only reconciliation of activity and progression summary.
- A typed hosted persistence contract that remains disabled by default and
  requires policy, retention, authorization, privacy, and release gates.
- Deterministic retry and idempotency expectations for completion evidence.

## Excluded

- Direct URL unlocks, support-language-only progression, live assignments,
  exports, raw learner audio, transcripts, reward mutation, and unreviewed
  frozen Z.ai/Phaser source integration.
- Durable writes from the browser rehearsal path.

See ADR 0824 and
`docs/verification/PILOT_END_TO_END_SESSION_REHEARSAL_CHECKS.md`.

# DR-898: Pilot Session Preflight

## Decision

Add a deterministic, review-only preflight evaluator for the pilot evidence
envelope. The evaluator distinguishes a complete controlled rehearsal from a
package that is authorized for classroom launch.

## Included

- Checks for tenant/session identity, canonical stage completion,
  target-language presence, and explicit privacy exclusions.
- Stable statuses of `ready-for-review`, `incomplete`, or `invalid` with
  human-readable details for the teacher evidence panel.
- A permanently blocked launch-boundary check during this foundation phase.

## Excluded

- Classroom launch approval, assignment release, reward mutation, report
  export, live status, and durable persistence.
- Any interpretation of review readiness as production readiness.

See ADR 0826 and
`docs/verification/PILOT_SESSION_PREFLIGHT_CHECKS.md`.

# DR-899: Pilot Preflight Behavior Gate

## Decision

Add executable behavior verification for the pilot session preflight. The
gate must prove that complete evidence is review-ready, incomplete evidence
stays incomplete, privacy violations are invalid, and no state authorizes
launch or durable writes.

## Included

- Temporary TypeScript compilation of the preflight and evidence-envelope
  modules using the repository's own compiler.
- Deterministic assertions for ready, incomplete, invalid, launch-blocked, and
  durable-write-blocked results.
- A package script included in the canonical game verification path.

## Excluded

- Classroom launch, live student data, reward mutation, export, or any write to
  hosted or local persistence.

See ADR 0827 and
`docs/verification/PILOT_SESSION_PREFLIGHT_CHECKS.md`.

# DR-900: Server-Owned Persistence Policy

## Decision

Separate browser persistence intent from server-owned institutional policy.
The browser may request a persistence mode, while the server derives policy
acceptance and write authorization from deployment configuration before
validation or provider execution.

## Included

- A client request contract with tenant/session identity, envelope, and
  `requestedMode` only.
- Rejection of client-supplied policy objects.
- Server-owned derivation of school, retention, release, and write gates.
- Runtime assertions that the derived policy cannot be replaced by browser
  claims.

## Excluded

- Enabling durable writes, selecting a production vendor, accepting school
  policy, or changing the review-only default.

See ADR 0828 and
`docs/verification/PERSISTENCE_SERVER_POLICY_BOUNDARY_CHECKS.md`.

# DR-901: Hosted Persistence Read Authorization

## Decision

Require every hosted progression read to declare its access purpose and to
pass the matching tenant-scoped authorization boundary before a provider is
queried.

## Included

- Learner continuity reads authenticated by the matching signed student
  session or server-only persistence token.
- Teacher review probes authenticated by the expiring tenant-scoped teacher
  review session.
- Fail-closed handling for missing or unknown access purpose and privacy-safe
  unauthorized responses.

## Excluded

- Any change to the review-only default, durable-write gates, provider choice,
  or classroom launch authorization.
- Treating a coded sample identity or a reachable endpoint as authentication.

See ADR 0829 and
`docs/verification/PERSISTENCE_READ_AUTHORIZATION_CHECKS.md`.

# DR-907: Teacher Report Persistence Rehearsal

## Decision

Join the report runtime contract, the teacher-report-package persistence
intent, and the durable report record in a provider-neutral rehearsal before
any report package write or export is enabled.

## Included

- Matching tenant-boundary keys across report persistence layers.
- Event-acceptance and settings-context preservation.
- Pseudonymous teacher evidence with raw audio and transcript exclusion.
- Runtime assertions proving valid alignment and rejecting contract drift.

## Excluded

- Hosted or local report writes, report export, learner identity promotion,
  report-driven progression, reward mutation, or provider selection.

See ADR 0835 and
`docs/verification/TEACHER_REPORT_PERSISTENCE_RUNTIME_CHECKS.md`.

# DR-908: Teacher Report Rehearsal Surface

## Decision

Expose the report-persistence rehearsal on teacher reporting and per-session
report-package review surfaces while keeping all provider, export, policy, and
release actions blocked.

## Included

- Shared MiniStar and partner tenant component path.
- Visible contract readiness and blocker summaries.
- Explicit review-only and no-side-effect states.
- Active-route verification for both tenant report-package previews.

## Excluded

Write buttons, export controls, provider selection, policy acceptance,
learner identity promotion, and release mutation.

See ADR 0836 and
`docs/verification/TEACHER_REPORT_PERSISTENCE_RUNTIME_CHECKS.md`.

# DR-909: Provider-Neutral Persistence Handoff

## Decision

Add a review-only implementation handoff packet to the persistence workbench.
It derives its status from the shared durable-record contracts, adapter plans,
and backend selection gate. No provider is selected and no storage side effect
is enabled.

## Included

- Cross-layer contract alignment summary.
- Hosted and local category coverage map.
- Visible provider, policy, cost, and side-effect blockers.
- Reusable panel for future tenant packages.

## Excluded

Provider activation, migrations, writes, exports, backups, restores, policy
acceptance, and live student data.

See ADR 0837 and
`docs/verification/PERSISTENCE_HANDOFF_PACKET_CHECKS.md`.

# DR-910: Persistence Handoff Shared Validator

## Decision

Move the persistence handoff packet schema and validation rules into the shared
content model and expose validator findings on the teacher persistence
workbench.

## Included

- Shared packet types and review-only invariants.
- Required tenant-bound category coverage rows.
- Visible validator findings when coverage is incomplete.
- Runtime marker verification for the shared contract.

## Excluded

Provider selection, storage writes, migrations, exports, backups, restores,
policy acceptance, and live student data.

See ADR 0838 and
`docs/verification/PERSISTENCE_HANDOFF_PACKET_CHECKS.md`.

# DR-911: Persistence Handoff Behavior Verification

## Decision

Extend the runtime behavior harness with persistence handoff tests for valid
review-only packets, provider injection, and missing tenant-bound coverage.

## Included

- Functional shared-validator coverage.
- Provider-neutral and no-side-effect assertions.
- Missing-category failure evidence.

## Excluded

Provider activation, durable writes, migrations, exports, backups, restores,
policy acceptance, and live student data.

See ADR 0839 and
`docs/verification/PERSISTENCE_HANDOFF_PACKET_CHECKS.md`.

# DR-912: Pilot Link Key Stability

## Decision

Key pilot command-view links by destination and label together, and verify the
key contract statically.

## Included

- React key collision fix for duplicate pilot destinations.
- Regression marker in review-list key verification.

## Excluded

Route changes, navigation permissions, partner data capture, and classroom
launch behavior.

See ADR 0840.

# DR-913: Pilot Handoff Shared Validator

## Decision

Move pilot handoff package types and safety invariants into the shared
content-model package and show concrete validator findings on the pilot command
view.

## Included

- Review-only package mode.
- Tenant-bound route requirements for entry, launch, and teacher review.
- Unique route, asset, and decision identifiers.
- Required student-data policy blocker.
- Runtime behavior coverage for valid and malformed packages.

## Excluded

Storage, export, publishing, policy acceptance, classroom launch, and real
learner data.

See ADR 0841 and
`docs/decision-register/DR-913-pilot-handoff-shared-validator.md`.

# DR-914: Source-to-Package Assembly Contract

## Decision

Add a shared source package assembly packet to connect reviewed extraction
evidence with candidate canonical packages without enabling promotion.

## Included

- Tenant/source/extraction/package identity and checksum.
- Candidate unit and media references.
- Required record inventory.
- Explicit false promotion guards.
- Review-only intake panel and runtime behavior checks.

## Excluded

File upload, extraction execution, storage, draft writes, package release,
route activation, QR mutation, and student assignment.

See ADR 0842 and
`docs/decision-register/DR-914-source-package-assembly-contract.md`.

# DR-902: Persistence Operations Diagnostics Authorization

## Decision

Protect the persistence status endpoint with the same tenant-scoped teacher
review boundary used by operation history and hosted adapter review.

## Included

- Explicit tenant query identity.
- Expiring teacher-session authorization before provider or deployment
  diagnostics are read.
- Privacy-safe unauthorized responses and a distinct protected state in the
  teacher client.

## Excluded

- Backup, restore, deletion, export, durable writes, classroom launch, or
  provider selection.

See ADR 0830 and
`docs/verification/PERSISTENCE_READ_AUTHORIZATION_CHECKS.md`.

# DR-915: Evidence-Only Package Approval Linkage

## Decision

Make the package approval ledger a shared content-model contract and require
every source-to-package assembly packet to link to an evidence-only ledger.

## Included

- Tenant/package/release-candidate identity.
- Required content, media, games, QR, policy, deployment, and platform roles.
- Explicit review-only and evidence-only state.
- Runtime and source-review validation for approval capture and promotion
  guards.

## Excluded

Signed approval capture, reviewer authentication, durable approval writes,
package promotion, route activation, assignment, and student-facing release.

See ADR 0843 and
`docs/decision-register/DR-915-evidence-only-package-approval.md`.

# DR-916: Package Readiness Reconciliation

## Decision

Join the major package evidence lanes into one tenant-scoped,
review-only readiness record before any future package promotion workflow.

## Included

- Source assembly, approval ledger, verifier, target-language audio, media
  rights, publish gate, and assignment rollout references.
- Explicit target-language progression authority and support-language boundary.
- Shared validation, runtime assertions, teacher intake visibility, and route
  verification.

## Excluded

Package writes, route registry changes, playlist writes, local bundle writes,
assignment creation, student activation, and live learner data.

See ADR 0844 and
`docs/decision-register/DR-916-package-readiness-reconciliation.md`.

# DR-917: Package Readiness Persistence Intent

## Decision

Create a tenant-scoped, provider-neutral persistence intent for the package
readiness reconciliation record before enabling a hosted or local adapter.

## Included

- Seven evidence-lane references.
- Hosted database and local classroom store previews.
- Explicit metadata-only state.
- Provider unselected, write blocked, promotion blocked, and student activation
  blocked guards.

## Excluded

Provider credentials, storage writes, local file writes, uploads, exports,
signed approvals, package publishing, route/playlist/assignment writes, and
student-facing activation.

See ADR 0845 and
`docs/decision-register/DR-917-package-readiness-persistence-intent.md`.

# DR-918: Package Readiness Backend Mapping

## Decision

Map package-readiness persistence into a provider-neutral schema entity,
migration candidate, and migration specification before any hosted or local
storage provider is selected.

## Included

- `package_readiness_reconciliation` schema entity.
- `m106-package-readiness-reconciliation-records` migration candidate.
- `spec-package-readiness-reconciliation` migration specification.
- Tenant/package/release-candidate scope and seven evidence-lane references.
- Hosted/local metadata parity and progression-authority preservation.

## Excluded

Provider credentials, migration execution, storage writes, package promotion,
route/playlist/assignment writes, local bundle writes, student activation, raw
learner audio, transcripts, and student data.

See ADR 0846 and
`docs/decision-register/DR-918-package-readiness-backend-mapping.md`.

# DR-919: Foundation Durable Persistence Gate

## Decision

Make durable progression, recovery operations, teacher operations
authorization, and cross-route persistence part of the canonical
`verify:foundation` gate.

## Included

- SQLite tenant-scoped persistence and idempotent writes.
- Server-owned policy and signed student-session boundaries.
- Backup, restore, retention deletion, checksums, integrity, and
  tamper-evident operation evidence.
- Separate tenant-scoped teacher review authorization.
- Cross-route progression handoff and gated hosted reads/writes.

## Excluded

Cloud vendor selection, automatic production activation, unrestricted writes,
raw learner audio, transcripts, and student-facing authorization bypasses.

See ADR 0847 and
`docs/decision-register/DR-919-foundation-durable-persistence-gate.md`.

# DR-920: Provider-Neutral Persistence Adapter Seam

## Decision

Put process-memory rehearsal and server-only SQLite progression persistence
behind one provider-neutral server adapter seam.

## Included

- Explicit provider and durability types.
- Central provider selection helper.
- Adapter-owned reads, writes, idempotency, and rehearsal state.
- Route independence from the concrete SQLite implementation.
- Shared provider selection for progression, status, and operations routes.

## Excluded

Cloud vendor selection, provider credentials, browser-controlled provider
selection, unrestricted durable writes, and student-data policy approval.

See ADR 0848 and
`docs/decision-register/DR-920-provider-neutral-persistence-adapter-seam.md`.

# DR-921: Persistence Provider Configuration Fails Closed

## Decision

Reject unsupported persistence provider configuration values as a blocked
deployment state instead of silently falling back to process-memory rehearsal.

## Included

- Explicit `process-memory` and `sqlite` provider values.
- Safe process-memory default when the variable is unset.
- Blocked progression, status, and operations responses for invalid values.
- No disclosure of credentials, database paths, learner records, raw audio, or
  transcripts.

## Excluded

Hosted cloud provider selection, browser provider selection, durable-write
authorization, and production deployment approval.

See ADR 0849 and
`docs/decision-register/DR-921-persistence-provider-configuration-fail-closed.md`.

# DR-922: Persistence Provider Runtime Configuration Check

## Decision

Keep provider configuration behavior executable through a focused runtime
verification script in addition to static adapter and route checks.

## Included

- Unset `process-memory` rehearsal default.
- Supported `process-memory` and `sqlite` values.
- Whitespace trimming for deployment configuration.
- Invalid provider values reported as invalid and unable to select a durable
  provider.

## Excluded

Database creation, hosted vendor selection, credential handling, learner data,
durable write activation, and deployment approval.

See ADR 0850 and
`docs/decision-register/DR-922-persistence-provider-runtime-configuration-check.md`.

# DR-923: Local Bundle Manifest Runtime Contract

## Decision

Use a shared runtime validator for local/offline bundle manifests before any
bundle writer or offline activation path is considered.

## Included

- Safe relative asset and content paths.
- Application-relative QR fallback paths.
- Unique asset identifiers and local paths.
- Final checksum and rights evidence requirements for offline-ready claims.
- Planning-mode warnings without student-facing activation.

## Excluded

File uploads, checksum generation, bundle writes, service-worker registration,
offline learner-data storage, rights approval, and local product handoff.

See ADR 0851 and
`docs/decision-register/DR-923-local-bundle-manifest-runtime-contract.md`.

# DR-925: Local Bundle Preview Resolution Evidence

## Decision

Make the local companion preview exercise the shared, validated,
tenant-scoped resolver and show its route and asset resolution evidence before
any local loader or offline activation is approved.

## Included

- MiniStar and partner tenant preview resolution.
- Manifest-declared QR fallback and local asset mapping.
- Visible resolver mode, tenant scope, resolved counts, and planning warnings.
- Explicit no-file-access, no-bundle-write, no-offline-activation, and
  no-learner-data-persistence boundaries.

## Excluded

Directory reads, file reads, file writes, uploads, bundle creation, service
workers, media caching, offline learner-data storage, rights approval, and
local handoff.

See ADR 0853 and
`docs/decision-register/DR-925-local-bundle-preview-resolution-evidence.md`.

# DR-926: Local Bundle Visual Asset Coverage

## Decision

Extend the local bundle planning summary to demonstrate image assets alongside
audio and video, using Labelled Diagram-style content as the reference visual
activity without enabling live uploads or student-facing image activation.

## Included

- Tenant-scoped image entries in the MiniStar and partner planning manifests.
- Resolver visibility for declared image paths.
- Checksum and rights-pending status in the preview.
- Explicit compatibility with future visual-game asset records.

## Excluded

Live file pickers, image processing, label/anchor editing, alt-text approval,
student-facing image gameplay, local file access, media caching, and offline
activation.

See ADR 0854 and
`docs/decision-register/DR-926-local-bundle-visual-asset-coverage.md`.

# DR-927: Local Bundle Media Accessibility Metadata

## Decision

Carry reviewed transcript/caption and poster paths in local audio/video
planning entries so accessibility evidence remains part of the package shape
from the beginning.

## Included

- Tenant-scoped transcript/caption paths for learning audio and video.
- Video poster paths for visual fallback.
- Shared manifest validation and read-only resolver visibility.
- Explicit separation between supporting-path evidence and actual media files.

## Excluded

Media file reads, transcription generation, caption generation, upload,
transcoding, rights approval, offline caching, student playback activation,
and media-only progression.

See ADR 0855 and
`docs/decision-register/DR-927-local-bundle-media-accessibility-metadata.md`.

# DR-928: Local Bundle Asset Evidence Handoff

## Decision

Give every local package asset a separate review-only evidence handoff across
rights, checksum, scan, target mapping, and accessibility before a future
loader or offline package can treat it as ready.

## Included

- Per-asset handoff status in MiniStar and partner previews.
- Passed-scan and reviewed-target-mapping requirements for offline readiness.
- Alt-text evidence requirement for offline image assets.
- Runtime rejection tests for incomplete offline image evidence.

## Excluded

Uploads, file reads, scanning services, rights approval, target mapping writes,
alt-text editing, package copying, publishing, caching, offline activation, and
student-facing asset promotion.

See ADR 0856 and
`docs/decision-register/DR-928-local-bundle-asset-evidence-handoff.md`.

# DR-929: Shared Local Bundle Asset Evidence Evaluator

## Decision

Keep local asset handoff readiness in the shared content model and make the
browser evidence panel a consumer of that evaluator.

## Included

- Separate rights, checksum, scan, target-mapping, and accessibility results.
- One overall handoff-ready result with explicit blockers.
- Runtime coverage for complete audio and incomplete video/image evidence.
- Reuse by future hosted/local package and release paths.

## Excluded

Uploads, file reads, scanning, rights approval, package writing, cache or
offline activation, student-facing promotion, and release mutation.

See ADR 0857 and
`docs/decision-register/DR-929-shared-local-bundle-asset-evidence-evaluator.md`.

# DR-930: Local Bundle Accessibility Readiness Parity

## Decision

Use one accessibility readiness boundary across offline-ready manifest
validation, shared asset evaluation, and teacher review surfaces.

## Included

- Transcript evidence for audio assets.
- Poster and transcript/caption evidence for video assets.
- Alt-text evidence for image assets.
- Asset-identified blockers in package-level review.
- Runtime rejection coverage for incomplete audio and video evidence.

## Excluded

Media file reads, transcription, caption generation, poster generation,
uploads, rights approval, package writing, caching, offline activation, and
student-facing promotion.

See ADR 0858 and
`docs/decision-register/DR-930-local-bundle-accessibility-readiness-parity.md`.

# DR-931: Local Bundle Snapshot Asset Gate

## Decision

Require machine-readable local companion snapshots to consume the shared asset
evidence aggregate before reporting that offline readiness is allowed.

## Included

- Asset evidence blocked count.
- Aggregate handoff-ready status.
- Offline readiness calculation that fails closed on any asset blocker.

## Excluded

Package writes, file reads, media copies, offline activation, caching, and
student-facing promotion.

See ADR 0859 and
`docs/decision-register/DR-931-local-bundle-snapshot-asset-gate.md`.

# DR-932: Review-Only Local Bundle Handoff Packet

## Decision

Use one shared review-only packet to assemble local companion evidence before
any package writer, exporter, installer, or offline shell exists.

## Included

- Tenant and bundle identity.
- Manifest, asset, route, release, and side-effect checks.
- Explicit blocked actions and fail-closed offline readiness.
- Runtime validation and local preview visibility.

## Excluded

File reads, package writes, exports, uploads, caching, offline activation,
hosted redirect mutation, and student-facing promotion.

See ADR 0860 and
`docs/decision-register/DR-932-review-only-local-bundle-handoff-packet.md`.

# DR-924: Read-Only Local Bundle Resolver

## Decision

Use a validated, tenant-scoped, read-only resolver to rehearse local QR and
media fallback behavior before implementing local bundle loading or activation.

## Included

- Manifest-declared QR fallback resolution.
- Manifest-declared local asset resolution.
- Expected-tenant matching.
- Unknown identifier rejection.
- Invalid-manifest rejection.

## Excluded

Directory reads, file reads, file writes, uploads, bundle creation, service
workers, media caching, offline learner-data storage, and local handoff.

See ADR 0852 and
`docs/decision-register/DR-924-read-only-local-bundle-resolver.md`.

# DR-933: Local Bundle Handoff Storage Alignment

## Decision

Align the provider-neutral `local_companion_handoff` schema, migration
candidate, and migration spec with the shared review-only handoff packet.

## Required Fields

`packet_id`, `mode`, `summary`, `checks`, and `blocked_actions` preserve the
packet identity, evidence, and explicit package-write, offline-activation,
student-promotion, and hosted-redirect-mutation blockers.

## Verification

The dedicated storage verifier runs from the local bundle readiness gate and
must pass before any future persistence adapter is implemented.

See ADR 0861 and
`docs/decision-register/DR-933-local-bundle-handoff-storage-alignment.md`.

# DR-934: Local Bundle Persistence Admission Preview

## Decision

Join local bundle handoff evidence to the shared provider-neutral persistence
handoff through a typed, review-only admission preview.

## Required Invariants

The local handoff and persistence packets must validate; local companion
handoff coverage must be durable, hosted, and local; provider selection must
remain null; and durable write, package write, offline activation, student
promotion, and hosted redirect mutation must remain false.

## Verification

The admission runtime verifier is included in local bundle readiness and the
full foundation gate.

See ADR 0862 and
`docs/decision-register/DR-934-local-bundle-persistence-admission-preview.md`.

# DR-935: Local Bundle Handoff Review Access

## Decision

Protect future local handoff record review behind a tenant-, bundle-, and
packet-scoped teacher-review request and the existing teacher persistence
authorization seam.

## Required Invariants

Access is teacher-only, tenant-bound, non-student-facing, and read-only. An
unconfigured provider returns blocked with no records and cannot synthesize a
package or expose media, learner data, or filesystem details.

## Verification

The local handoff review-access verifier runs from local bundle readiness and
the full foundation gate.

See ADR 0863 and
`docs/decision-register/DR-935-local-bundle-handoff-review-access.md`.

# DR-936: Local Bundle Provider Mapping

## Decision

Define a provider-neutral local handoff record and pure packet-to-record
mapper before any hosted or local handoff provider is selected. The protected
review route obtains results only through the provider boundary.

## Required Invariants

The mapper preserves tenant, bundle, package, and packet identity, derives
blocked count from checks and handoff items, and keeps offline readiness as
evidence rather than activation permission. The unconfigured adapter returns
no record and remains non-student-facing.

## Verification

The adapter mapping runtime check, local bundle readiness gate, typecheck,
production build, and active route verification are required before provider
implementation work advances.

See ADR 0864 and
`docs/decision-register/DR-936-local-bundle-provider-mapping.md`.

# DR-937: Local Provider Approval Evidence

## Decision

Add a review-only provider approval packet that makes retention, export,
backup, restore, safe fallback, tenant isolation, and data-exclusion evidence
explicit before any local or hosted handoff provider is selected.

## Required Invariants

Provider selection and activation remain uncommitted. Package writes, student
promotion, and learner-data export remain blocked. Raw learner audio and
transcripts remain excluded from the core record. Every required evidence lane
has a tenant-scoped reference and a review status.

## Verification

The provider approval evidence verifier runs from local bundle readiness. The
teacher persistence workbench displays the packet, while typecheck, build,
route, runtime, privacy, and tenant-isolation gates remain required.

See ADR 0865 and
`docs/decision-register/DR-937-local-provider-approval-evidence.md`.

# DR-938: Local Bundle Recovery Packet

## Decision

Define a provider-neutral, review-only recovery packet beneath provider
approval evidence. It makes backup checksum, restore rehearsal, rollback,
export, and retention boundaries explicit for local white-label packages
without selecting a provider or enabling writes.

## Required Invariants

Backup evidence uses SHA-256 and excludes raw learner audio and transcripts.
Restore evidence includes source, rehearsal, and rollback references and blocks
cross-tenant restore. Export excludes learner data, raw media, and credentials.
Retention is policy-bound and scoped to a tenant package session. Execution,
package writes, student promotion, and route mutation remain blocked.

## Verification

The local recovery packet verifier runs from local bundle readiness. The
teacher persistence workbench displays the four evidence lanes, while
typecheck, production build, route, privacy, and tenant-isolation gates remain
required before provider implementation.

See ADR 0866 and
`docs/decision-register/DR-938-local-bundle-recovery-packet.md`.

# DR-939: Local Recovery Evidence Reconciliation

## Decision

Reconcile provider-approval and local-recovery evidence through one shared,
provider-neutral function before any future adapter interprets the packets
together.

## Required Invariants

Tenant, bundle, and package identity must match exactly. The result must
classify aligned evidence, unresolved evidence, and identity/validation
mismatch separately. It must expose open checks and lanes, preserve all
blocked actions, and remain `executionAllowed: false` with `sideEffect: "none"`.

## Verification

The reconciliation verifier covers open evidence, identity drift, blocked
provider activation, and no-execution behavior. The persistence workbench
displays the result; the full foundation gate remains required before provider
implementation or live recovery work.

See ADR 0867 and
`docs/decision-register/DR-939-local-recovery-evidence-reconciliation.md`.

# DR-940: Local Export And Retention Dry-Run

## Decision

Define a provider-neutral dry-run classification for local package export and
retention. It previews safe manifest references, policy-required learner
progress, and excluded sensitive material without copying, exporting, or
deleting anything.

## Required Invariants

Content, route, game, and reviewed-media manifest references may be included
as metadata. Learner progress requires policy. Raw learner audio, transcripts,
and credentials are excluded from the core export. Retention is
tenant-package-session scoped, policy-required, and blocked when unresolved.
The dry run must return `sideEffect: "none"` and preserve all execution blocks.

## Verification

The export/retention dry-run verifier covers required classifications,
exclusions, policy gates, retention blocking, and no-execution behavior. The
persistence workbench displays the result; the full foundation gate remains
required before any exporter, file copier, or deletion worker is designed.

See ADR 0868 and
`docs/decision-register/DR-940-local-export-retention-dry-run.md`.

# DR-941: Local Package Manifest And Rollback Dry-Run

## Decision

Define a tenant-scoped, provider-neutral package manifest and rollback dry-run
before any local bundle can be activated or any package provider can mutate
routes, media, reports, or learner data.

## Required Invariants

The manifest covers content, media, routes, games, and reporting artifacts
using safe relative paths, version and checksum state, current/fallback
versions, stable QR fallback, and impact domains for QR, content, media,
games, reports, and learner progress. All writes, replacement, deletion,
activation, route mutation, and rollback execution remain blocked, with
`sideEffect: "none"`.

## Verification

The package manifest rollback verifier covers unsafe paths, missing impact
domains, QR fallback, version evidence, and blocked execution. The persistence
workbench displays the preview; the full foundation gate remains required
before a local provider or package activation path is designed.

See ADR 0869 and
`docs/decision-register/DR-941-local-package-manifest-rollback-dry-run.md`.

# DR-942: Local Media Evidence Binding

## Decision

Bind every local package media entry to its tenant, bundle, package version,
rights evidence, checksum state, scan, target mapping, accessibility evidence,
and local eligibility before any future media provider can copy or promote it.

## Required Invariants

Audio requires transcript evidence, video requires caption/transcript and
poster evidence, and images require an explicit alt-text readiness state.
Pending or false evidence is visible review state, not approval. Safe relative
paths and exact manifest identity are required. Upload, copy, package write,
local activation, student promotion, and QR mutation remain blocked with no
side effect.

## Verification

The media evidence binding verifier covers rights/checksum/accessibility state,
unsafe paths, required transcript evidence, and no-copy behavior. The
persistence workbench displays the binding; the full foundation gate remains
required before local eligibility or provider implementation.

See ADR 0870 and
`docs/decision-register/DR-942-local-media-evidence-binding.md`.

# DR-943: Local Media Manifest Reconciliation

## Decision

Reconcile each tenant-scoped media evidence binding against the exact
versioned package manifest before any future local provider can evaluate media
copy or activation.

## Required Invariants

- Tenant, bundle, package, manifest, and package-version identity must match.
- A declared media artifact must exist, its version must match, and every
  asset path must remain under that artifact's safe media root.
- `aligned`, `needs-evidence`, and `mismatch` remain separate diagnostic
  states; pending evidence must not be misreported as identity drift.
- Reconciliation remains review-only with no side effect, and media copy,
  package write, local activation, student promotion, and QR mutation remain
  blocked.

## Evidence

- `packages/content-model/src/localBundleMediaManifestReconciliation.ts`
- `apps/web/src/data/sampleLocalBundleMediaManifestReconciliation.ts`
- `apps/web/src/features/persistence/LocalBundleMediaManifestReconciliationPanel.tsx`
- `scripts/verify-local-bundle-media-manifest-reconciliation.mjs`

# DR-944: Media Release-Control Binding

## Decision

Feed provider-neutral media manifest reconciliation into the existing package
publish gate through an explicit review-only binding. The binding is evidence
for release control, not a release operation.

## Required Invariants

- Release-gate tenant and package identity must match the reconciled media
  evidence identity.
- Reconciliation mismatch is blocked; open media evidence or an open media
  publish gate is needs-review; evidence-ready means ready for human review
  only.
- Promotion, student-facing use, local activation, package writes, media
  release, and QR mutation remain false with no side effect.
- Required media and package approvals remain visible and cannot be bypassed
  by the binding or by a future package writer.

## Evidence

- `packages/content-model/src/localBundleMediaReleaseControlBinding.ts`
- `apps/web/src/data/sampleLocalBundleMediaReleaseControlBinding.ts`
- `apps/web/src/features/pilot/MediaReleaseControlBindingPanel.tsx`
- `scripts/verify-local-bundle-media-release-control-binding.mjs`

# DR-945: Release-Control To Pilot Launch Handoff

## Decision

Propagate the media release-control binding into the existing pilot readiness
summary and classroom launch gate so release evidence has one consistent,
read-only downstream meaning.

## Required Invariants

- Both downstream surfaces preserve tenant, package, release-candidate,
  approval, evidence, and blocked-action identity.
- Mismatch remains a launch blocker; open evidence remains visible as a
  review/policy blocker.
- No launch button, assignment activation, live learner data, report export,
  or release-state mutation is introduced by this handoff.
- Existing persistence, policy, roster, dry-run, reporting, and school gates
  remain required and cannot be replaced by media evidence.

## Evidence

- `apps/web/src/data/samplePilotReadinessSummary.ts`
- `apps/web/src/data/sampleClassroomLaunchGate.ts`
- `scripts/verify-pilot-readiness-dashboard.mjs`

# DR-946: Shared Release-Control Policy And Pilot Evidence

## Decision

Use one derived release-control evidence contract in both the school-policy
acceptance preflight and the controlled-pilot handoff package.

## Required Invariants

- The binding id, release gate, tenant, package version, decision, blockers,
  approvals, and blocked actions must remain traceable in both surfaces.
- Promotion, student-facing use, local activation, and side effects remain
  false or absent; this is evidence, not permission.
- Missing or malformed evidence invalidates a pilot handoff rather than being
  silently replaced by a panel-local summary.
- School policy acceptance, live launch, assignments, learner data, reports,
  uploads, and release-state mutation remain blocked.

## Evidence

- `packages/content-model/src/releaseControlEvidence.ts`
- `apps/web/src/data/sampleSchoolPolicyAcceptancePreflight.ts`
- `apps/web/src/data/samplePilotHandoffPackage.ts`
- `scripts/verify-release-control-readiness.mjs`

# DR-949: Release-Control Evidence In The Safe-Fallback Chain

## Decision

Carry the exact shared release-control evidence from rollback impact review
through safe-fallback planning, fallback preflight, activation preview, and
restoration preview.

## Required Invariants

- Binding id, release gate, tenant, package version, decision, blockers, and
  approvals remain unchanged across every fallback artifact.
- Fallback and restoration evidence cannot authorize QR changes, notifications,
  media replacement, local deactivation, learner-data operations,
  assignments, classroom shutdown, or release mutation.
- Missing or stale inherited evidence is a contract failure, not a local
  fallback.
- Target-language progression and support-language boundaries remain intact in
  all child-facing pause or restoration copy.

## Evidence

- `apps/web/src/data/sampleSchoolRollbackSafeFallbackPlan.ts`
- `apps/web/src/data/sampleSchoolRollbackSafeFallbackPreflight.ts`
- `apps/web/src/data/sampleSchoolRollbackSafeFallbackActivationPreview.ts`
- `apps/web/src/data/sampleSchoolRollbackSafeFallbackRestorationPreview.ts`
- `scripts/verify-release-control-readiness.mjs`

# DR-948: Release-Control Evidence In The Revocation And Rollback Chain

## Decision

Carry the exact shared release-control evidence from the acceptance-record
preview through the revocation/rollback plan into the rollback impact matrix.

## Required Invariants

- Binding id, release gate, tenant, package version, decision, blockers, and
  approvals remain unchanged across the chain.
- Rollback evidence cannot authorize revocation, release mutation, QR changes,
  learner-data deletion, media replacement, local deactivation, or premium
  entitlement changes.
- Stale or missing inherited evidence is a contract failure, not a local
  fallback.
- Safe fallback planning remains separate from live route or package changes.

## Evidence

- `apps/web/src/data/sampleSchoolPolicyRevocationRollbackPlan.ts`
- `apps/web/src/data/sampleSchoolPolicyRollbackImpactMatrix.ts`
- `apps/web/src/features/pilot/SchoolPolicyRevocationRollbackPanel.tsx`
- `scripts/verify-release-control-readiness.mjs`

# DR-947: Release-Control Evidence In The Acceptance Record Chain

## Decision

Carry the exact release-control evidence from the school policy preflight
through the policy text pack into the future acceptance-record preview.

## Required Invariants

- The binding id, gate, tenant, package version, decision, blockers, and
  approvals remain unchanged across the chain.
- A preview may display evidence but may not accept policy, store terms,
  capture signatures, export evidence, activate storage, or alter release state.
- Missing or malformed inherited evidence remains a visible contract failure,
  not a panel-local fallback.
- Target-language progression, support-language boundaries, premium opt-ins,
  and local/hosted policy gates remain separate and authoritative.

## Evidence

- `apps/web/src/data/sampleSchoolPolicyTextPack.ts`
- `apps/web/src/data/sampleSchoolPolicyAcceptanceRecordPreview.ts`
- `apps/web/src/features/pilot/SchoolPolicyAcceptanceRecordPreviewPanel.tsx`
- `scripts/verify-release-control-readiness.mjs`

# DR-964: Phaser Provenance Verifier Identity

## Decision

The frozen Phaser source evidence verifier reads the immutable snapshot tag and
commit from `packages/content-model/src/phaserCandidateSourceIdentity.ts`, not
from a duplicated sample review fixture.

## Required Invariants

- Verification remains read-only and hashes only declared, safe paths inside
  the isolated review root.
- Shared identity is the single source of truth for the frozen snapshot.
- A provenance match never authorizes source import, wrapper approval,
  promotion, route replacement, or student assignment.

## Evidence

- `scripts/verify-phaser-source-evidence.mjs`
- `scripts/verify-phaser-source-evidence-contract.mjs`
- `packages/content-model/src/phaserCandidateSourceIdentity.ts`

# DR-965: Memory Match Accessibility State

## Decision

The canonical Memory Match wrapper exposes card state through `aria-pressed`
and changing learner feedback through a polite live region.

## Required Invariants

- Hidden, selected, mismatched, and matched states remain understandable
  without relying on color or animation.
- Keyboard activation uses the same pairing engine path as pointer activation.
- Accessibility state does not own scoring, persistence, rewards, or
  progression.

## Evidence

- `apps/web/src/features/game-shell/pairing/PairingMemoryMatchGame.tsx`
- `scripts/verify-canonical-game-integrations.mjs`

# DR-966: Shared App Shell Skip Navigation

## Decision

Use one tenant-themed skip link and one focusable `main-content` target in the
shared `AppShell` so keyboard users can reach route content immediately.

## Required Invariants

- The link is present before repeated header navigation.
- The target is programmatically focusable with `tabIndex={-1}`.
- Focus styling remains visible against each tenant's configured primary color.
- Skip navigation does not own route transitions, scoring, persistence,
  rewards, or progression.

## Evidence

- `apps/web/src/components/layout/AppShell.tsx`
- `scripts/verify-shared-app-shell-accessibility.mjs`

# DR-967: Audio Status Accessibility

## Decision

Expose a stable, polite status region for every shared audio control so the
learner can distinguish ready, playing, and unavailable states without relying
on visual text changes alone.

## Required Invariants

- The button references its status region with `aria-describedby`.
- Status updates are polite and atomic.
- Reviewed audio and speech fallback use the same status vocabulary.
- Audio status never owns scoring, persistence, rewards, or progression.

## Evidence

- `apps/web/src/features/audio/AudioCueButton.tsx`
- `scripts/verify-audio-accessibility.mjs`

# DR-968: App Shell Current Route

## Decision

Centralize current-route semantics in the shared tenant navigation and mark
only the most specific matching item with `aria-current="page"`.

## Required Invariants

- Root matches only `/`.
- Nested routes may match their section prefix, but the longest matching href
  is the sole current item.
- Active styling uses tenant variables and remains visible on keyboard focus.
- Navigation state does not own routing authorization, scoring, persistence,
  rewards, or progression.

## Evidence

- `apps/web/src/components/layout/AppShellNavigation.tsx`
- `apps/web/src/components/layout/AppShell.tsx`
- `scripts/verify-app-shell-navigation.mjs`

# DR-969: Audio Label Interaction Boundary

## Decision

Keep tap-to-speak prompt controls outside native form labels and connect text
entry fields to their prompt container with an explicit `aria-labelledby`
relationship.

## Required Invariants

- Type Answer retains a speakable instruction prompt.
- The text input has an explicit accessible name.
- No interactive audio control is nested inside the input label.
- Audio remains support behavior and cannot submit, score, persist, reward, or
  advance a round.

## Evidence

- `apps/web/src/features/game-shell/text-spelling/TypeAnswerPracticeGame.tsx`
- `scripts/verify-canonical-game-integrations.mjs`

# DR-970: App Shell Hydration Boundary

## Decision

Keep route-dependent active navigation state suppressed until the shared app
shell navigation has hydrated. Then select exactly one most-specific matching
route from the browser pathname.

## Required Invariants

- The first server and client render do not depend on browser-only route state.
- After hydration, only the most-specific matching route receives
  `aria-current="page"`.
- The root route remains an exact match and nested routes remain prefix-aware.
- The guard changes navigation presentation only; it does not own routing
  authorization, scoring, persistence, rewards, or progression.

## Evidence

- `apps/web/src/components/layout/AppShellNavigation.tsx`
- `scripts/verify-app-shell-navigation.mjs`
- `docs/adr/0898-app-shell-hydration-boundary.md`

# DR-971: Locale-Independent Content Matching

## Decision

Use locale-independent lowercase normalization for canonical content matching
and ordinal comparison for serialized metadata keys used in browser evidence
fingerprints.

## Required Invariants

- Vocabulary duplicate detection does not depend on the host locale.
- Reviewed audio-cue matching does not depend on the host locale.
- Equivalent metadata objects produce the same evidence fingerprint regardless
  of locale-specific collation rules.
- Display localization may remain locale-aware, but identity and evidence
  comparisons must not be.

## Evidence

- `packages/content-model/src/index.ts`
- `apps/web/src/features/audio/AudioCueButton.tsx`
- `apps/web/src/features/persistence/localSessionEvidenceStore.ts`
- `scripts/verify-audio-accessibility.mjs`

# DR-972: Tenant-Scoped Browser Evidence Key

## Decision

Scope browser rehearsal evidence storage by tenant, package, launch, and
student-session identity before reading or writing localStorage.

## Required Invariants

- The storage key contains all four identity components.
- Key parts are encoded before joining so tenant/package identifiers cannot
  alter the key structure.
- Read validation rejects a record whose embedded identity differs from the
  lookup used to retrieve it.
- Teacher review reads the same tenant/package/student-scoped lookup.
- The browser record remains rehearsal-only and cannot become hosted
  persistence, export, assignment, or release state.

## Evidence

- `apps/web/src/features/persistence/localSessionEvidenceStore.ts`
- `apps/web/src/features/teacher/TeacherSessionLocalEvidencePanel.tsx`
- `scripts/verify-local-evidence-tenant-key.mjs`

# DR-974: Non-Blank Browser Evidence Identity

## Decision

Reject local rehearsal records and event entries whose canonical identity
fields are empty or whitespace-only, even when their values have string types.

## Required Invariants

- Package, tenant, unit, launch, and student-session identities are non-blank.
- Saved timestamps and progression/event identity fields are non-blank.
- Existing v4 tenant-scoped and content-bound checks remain in force.
- The boundary remains browser rehearsal only with no hosted side effects.

## Evidence

- `apps/web/src/features/persistence/localSessionEvidenceStore.ts`
- `scripts/verify-local-evidence-tenant-key.mjs`

# DR-975: Browser Evidence Runtime Harness

## Decision

Exercise browser rehearsal evidence behavior with a temporary in-memory
storage double. The runtime contract must prove valid acceptance, tenant
isolation, mixed-event rejection without mutation, and blank-identity
rejection.

## Required Invariants

- The harness never writes hosted or real learner data.
- A valid record can be read through its exact scoped lookup.
- Cross-tenant reads return no record.
- Rejected mixed events do not mutate an accepted record.
- Malformed blank-identity records are hidden.

## Evidence

- `apps/web/src/features/persistence/localSessionEvidenceStore.ts`
- `scripts/verify-local-evidence-runtime.mjs`
- `scripts/verify-foundation-composition.mjs`

# DR-976: Browser Evidence Write Boundary

## Decision

Validate the complete v4 local evidence record inside the shared write helper,
so direct save calls cannot bypass tenant, unit, launch, student-session, and
non-blank identity checks.

## Required Invariants

- Invalid writes return without touching localStorage.
- Valid evidence remains readable through its exact scoped lookup.
- The append and direct-save paths share one validation boundary.
- No hosted persistence, export, assignment, or release mutation is enabled.

## Evidence

- `apps/web/src/features/persistence/localSessionEvidenceStore.ts`
- `scripts/verify-local-evidence-runtime.mjs`

# DR-973: Canonical-Identity Browser Evidence Contents

## Decision

Browser rehearsal evidence must bind not only its localStorage key but also
its progression snapshot and every event to the same tenant, content package,
unit, launch, and student-session identity. Mixed or incomplete event batches
are rejected before local evidence is merged.

## Required Invariants

- The v4 storage key includes encoded tenant, package, launch, unit, and
  student-session identity.
- The progression snapshot must match the outer evidence identity.
- Every persisted event must preserve unit, launch, student-session, and tenant
  metadata identity.
- Invalid incoming batches and stale malformed records remain hidden from
  teacher review.
- This is still browser rehearsal evidence only; it does not enable hosted
  persistence, export, assignment, or release state.

## Evidence

- `apps/web/src/features/persistence/localSessionEvidenceStore.ts`
- `apps/web/src/features/teacher/TeacherSessionLocalEvidencePanel.tsx`
- `scripts/verify-local-evidence-tenant-key.mjs`

# DR-977: Memory Match Audio Event Order

## Decision

The canonical Memory Match interaction records `round_shown` before its first
term-level `audio_requested` event.

## Required Invariants

- A visible round is established before supporting learning audio is recorded.
- Learning audio remains support-only and cannot trigger progress or rewards.
- Replay and report consumers can associate the audio request with the round.
- Frozen Phaser candidates must follow the same ordering when reviewed.

## Evidence

- `apps/web/src/features/game-shell/pairing/PairingMemoryMatchGame.tsx`
- `scripts/verify-canonical-game-integrations.mjs`
- `docs/adr/0905-memory-match-audio-event-order.md`

# DR-978: Pairing Audio Event Order

## Decision

Canonical pairing modes record `round_shown` before term-level
`audio_requested` evidence for a selected card.

## Required Invariants

- Memory Match and Match Up establish the visible interaction first.
- Learning audio remains support-only and cannot trigger progress or rewards.
- Replay and report consumers can associate card audio with its round.
- Frozen Phaser pairing candidates must preserve the same ordering when reviewed.

## Evidence

- `apps/web/src/features/game-shell/pairing/PairingMemoryMatchGame.tsx`
- `apps/web/src/features/game-shell/pairing/PairingMatchUpGame.tsx`
- `scripts/verify-canonical-game-integrations.mjs`

# DR-979: Audio Round Replay Boundary

## Decision

Canonical and Phaser candidate replays must place `audio_requested` after
`round_shown`.

## Required Invariants

- Audio evidence is attached to a visible learning round.
- Audio cannot stand in for `round_shown` or create progression evidence.
- Native and external candidate validators enforce the same ordering.
- Timestamp, tenant, launch, learner-session, and replay identity checks remain required.

## Evidence

- `packages/content-model/src/canonicalGameIntegration.ts`
- `scripts/verify-phaser-candidate-package.mjs`
- `scripts/verify-runtime-behavior.mjs`
- `scripts/verify-phaser-candidate-package-behavior.mjs`

# DR-980: Closed Audio Replay Boundary

## Decision

Canonical and Phaser candidate replays must reject `audio_requested` after
`game_completed`.

## Required Invariants

- A completed attempt is closed for replay and teacher-report grouping.
- Completion-screen audio is not silently merged into game evidence.
- Native and external candidate validators enforce the same boundary.
- Timestamp, tenant, launch, learner-session, and replay identity checks remain required.

## Evidence

- `packages/content-model/src/canonicalGameIntegration.ts`
- `scripts/verify-phaser-candidate-package.mjs`
- `scripts/verify-runtime-behavior.mjs`
- `scripts/verify-phaser-candidate-package-behavior.mjs`

# DR-981: Audio Mastery Boundary

## Decision

Canonical and Phaser candidate replays must reject `audio_requested` after
`mastery_updated`.

## Required Invariants

- Learning audio is contained within the active game attempt.
- Mastery closes learning evidence before the final completion event.
- Native and external candidate validators enforce the same ordering.
- Timestamp, tenant, launch, learner-session, and replay identity checks remain required.

## Evidence

- `packages/content-model/src/canonicalGameIntegration.ts`
- `scripts/verify-phaser-candidate-package.mjs`
- `scripts/verify-runtime-behavior.mjs`
- `scripts/verify-phaser-candidate-package-behavior.mjs`

# DR-982: Hosted Progress Event Evidence

## Decision

Add a policy-gated hosted persistence lane for completed canonical game event
evidence, separate from the latest progression snapshot.

## Required Invariants

- Event streams are tenant, package, launch, and pseudonymous student-session
  scoped.
- Streams pass the shared taxonomy, chronological, and completion checks.
- Canonical completion identity makes replay writes idempotent and changed
  payloads conflicts.
- Raw learner audio and transcripts remain excluded.
- Student and teacher reads use different authorization boundaries.
- Durable writes remain explicitly gated by deployment policy.

## Evidence

- `packages/content-model/src/progressEventPersistence.ts`
- `apps/web/src/server/persistence/sqliteProgressionStore.ts`
- `apps/web/src/app/api/persistence/events/route.ts`
- `scripts/verify-progress-event-persistence.mjs`

# DR-983: Tenant-Bound Taxonomy Resolution

## Decision

Bind event taxonomy authority to tenant and reviewed package identity before
event evidence reaches hosted persistence.

## Required Invariants

- The browser cannot provide or override taxonomy policy.
- Supported tenant/package pairs require explicit reviewed bindings.
- Unknown bindings fail closed for both event writes and reads.
- MiniStar is a sample binding, not a platform-wide taxonomy rule.

## Evidence

- `apps/web/src/server/persistence/progressEventTaxonomyResolver.ts`
- `apps/web/src/app/api/persistence/events/route.ts`
- `docs/adr/0911-tenant-bound-taxonomy-resolution.md`

# DR-984: Event Record Shape Boundary

## Decision

Validate progress-event record shape at both the shared model boundary and the
SQLite storage boundary.

## Required Invariants

- Canonical completion identity must match the persisted record.
- Raw learner audio and transcripts remain excluded at every layer.
- Empty or malformed event records cannot be inserted.
- Stored reads are revalidated against the tenant-bound taxonomy.

## Evidence

- `packages/content-model/src/progressEventPersistence.ts`
- `apps/web/src/server/persistence/sqliteProgressionStore.ts`
- `docs/adr/0912-event-record-shape-boundary.md`

# DR-985: Teacher Launch-Scoped Event Review

Decision: Add a teacher-only, read-only event-stream listing scoped to one
tenant, reviewed package, and classroom launch. Revalidate every candidate
record before returning it, while keeping student continuity reads exact and
session-scoped.

Required invariants:

- Teacher authorization and all three launch scope fields are required.
- Unknown tenant/package bindings fail closed.
- Invalid stored evidence is omitted rather than treated as reportable.
- Process-memory rehearsal and SQLite durable adapters share the same contract.
- Raw learner audio and transcripts remain excluded.

Evidence: `docs/adr/0913-teacher-launch-scoped-event-review.md`,
`apps/web/src/app/api/persistence/events/route.ts`,
`apps/web/src/server/persistence/progressionPersistenceAdapter.ts`.

# DR-986: Teacher Event Review Panel

Decision: Connect the teacher session monitor to the launch-scoped event list
through a read-only same-origin client boundary. Render only pseudonymous
summary fields and keep server-side taxonomy and privacy validation
authoritative.

Required invariants:

- The panel uses teacher review authorization and never grants authorization.
- Raw event payloads, learner audio, and transcripts are not rendered.
- Empty, protected, blocked, and unavailable states remain distinct.
- Session authorization changes trigger a fresh read.

Evidence: `docs/adr/0914-teacher-event-review-panel.md`,
`apps/web/src/features/persistence/HostedProgressEventReviewPanel.tsx`,
`apps/web/src/features/persistence/hostedProgressionPersistenceClient.ts`.

# DR-987: Teacher Review Authorization Handoff

Decision: Place the existing tenant-scoped teacher operations session on the
launch monitor and reuse its session-change event to refresh the bounded event
review panel.

Required invariants:

- No second login path or client-held access token is introduced.
- Session tenant must match the launch tenant.
- Review remains read-only and excludes raw learner media.
- Sign-out removes access and refreshes the dependent panel.

Evidence: `docs/adr/0915-teacher-review-authorization-handoff.md`,
`apps/web/src/app/teacher/sessions/[launchCode]/page.tsx`,
`apps/web/src/features/persistence/TeacherOperationsAccessPanel.tsx`.

# DR-988: Teacher Launch Report Aggregation

Decision: return a deterministic, pseudonymous, read-only summary alongside
the authorized launch-scoped event review response. The summary counts
learners, streams, event effects, completions, mastery updates, game modes,
and earned Star Dust without exposing raw session identifiers, learner audio,
or transcripts.

Required invariants:

- Records must match the tenant, reviewed package, and classroom launch scope.
- Progress-affecting, report-only, and support-only events remain separate.
- Explicit Star Dust deltas are summed; cumulative snapshots are counted once
  per stream.
- The aggregation cannot authorize export, mutation, live launch, or broader
  student discovery.

Evidence: `docs/adr/0916-teacher-launch-report-aggregation.md`,
`docs/decision-register/DR-988-teacher-launch-report-aggregation.md`.

# DR-989: Report Package Aggregation Integration

Decision: place the bounded, tenant/package/launch-scoped aggregation on the
teacher report-package preview route. Keep the static rehearsal and the live
review evidence visibly distinct; neither path authorizes export, mutation,
live classroom launch, roster promotion, or broad student discovery.

Required invariants:

- The route derives identity from the resolved server-side monitor context.
- The existing teacher operations authorization handoff is reused.
- Protected, blocked, unavailable, and empty states remain visible.
- Both MiniStar and sample publisher report-package routes remain covered by
  the active route verification gate.

Evidence: `docs/adr/0917-report-package-aggregation-integration.md`,
`docs/decision-register/DR-989-report-package-aggregation-integration.md`.

# DR-990: Provider-Neutral Report Package Snapshot

Decision: require a canonical report-package snapshot in teacher persistence
review and support both hosted-managed and local-classroom deployment modes
without changing the privacy, tenant, or no-side-effect rules.

Required invariants:

- Snapshot tenant, package, and launch identity must match the aggregation.
- `exportAllowed` and `writesAllowed` remain false in foundation mode.
- Raw event records, learner audio, transcripts, and real learner identifiers
  remain excluded.
- Event acceptance and progress-event envelope summaries are preserved.
- Provider activation remains a separate approved step.

Evidence: `docs/adr/0918-provider-neutral-report-package-snapshot.md`,
`docs/decision-register/DR-990-provider-neutral-report-package-snapshot.md`.

# DR-991: Provider-Neutral Report Snapshot Recovery

Decision: add a deterministic, provider-neutral recovery packet and a
review-only adapter for teacher report-package snapshots. Hosted-managed and
local-classroom deployments may be rehearsed through the same contract, but
no backup, restore, export, or provider write is authorized in foundation
mode.

Required invariants:

- The packet preserves snapshot tenant, package, launch, and deployment scope.
- The packet fingerprint must match its embedded sanitized snapshot.
- Raw event records, learner audio, transcripts, and real learner identifiers
  remain excluded.
- `restoreAllowed`, `exportAllowed`, and `writesAllowed` remain false.
- Invalid packets fail closed; valid packets still return `allowed: false` and
  `sideEffect: "none"` until the separate provider and policy gates are
  approved.

Evidence: `docs/adr/0919-provider-neutral-report-snapshot-recovery.md`,
`packages/content-model/src/teacherReportPackageSnapshotRuntime.ts`, and
`scripts/verify-teacher-report-package-snapshot-runtime.mjs`.

# DR-992: Report Snapshot Recovery Review Surface

Decision: expose the shared provider-neutral report snapshot recovery
rehearsal on both the persistence workbench and the tenant-aware report
package preview. Keep the surfaces read-only and clearly separate evidence
validity from execution permission.

Required invariants:

- The snapshot is resolved from the tenant/package/launch monitor context.
- Hosted-managed and closed-local packet checks use the same contract.
- No backup, restore, export, provider write, or activation control is added.
- The review surface does not render raw event records, learner audio,
  transcripts, or real learner identifiers.

Evidence: `docs/adr/0920-report-snapshot-recovery-review-surface.md`,
`apps/web/src/features/persistence/TeacherReportSnapshotRecoveryRehearsalPanel.tsx`,
and `scripts/verify-report-runtime.mjs`.

# DR-993: Local Companion Report Snapshot Parity

Decision: show the shared report snapshot recovery rehearsal in both local
companion previews. Resolve each preview from its tenant-aware sample context,
while keeping local writes, recovery execution, export, and activation
blocked.

Required invariants:

- MiniStar and sample publisher local routes remain tenant-specific.
- Hosted-managed and closed-local checks use the canonical snapshot contract.
- The panel is evidence only and does not create a local file or store.
- Raw events, learner audio, transcripts, and real learner identifiers remain
  excluded.

Evidence: `docs/adr/0921-local-companion-report-snapshot-parity.md`,
`apps/web/src/features/deployment/LocalCompanionPackagePreviewPanel.tsx`,
and `scripts/verify-active-routes.mjs`.

# DR-994: Reporting Workbench Recovery Coverage

Decision: show report snapshot recovery rehearsal evidence for MiniStar and
the sample publisher on the teacher reporting workbench. Resolve each context
independently and keep execution blocked.

Required invariants:

- Tenant, package, and launch identity remain independently resolved.
- Both tenants use the same hosted/local snapshot contract.
- Export, backup, restore, provider writes, and progression mutation remain
  blocked.
- Raw events, learner audio, transcripts, and real learner identifiers remain
  excluded.

Evidence: `docs/adr/0922-reporting-workbench-recovery-coverage.md`,
`apps/web/src/app/teacher/reporting/page.tsx`, and
`scripts/verify-active-routes.mjs`.
