# Living Textbook Decision Register

This register is a standing gate for platform decisions. It exists to keep the Living Textbook build saleable, maintainable, and tenant-ready while still moving fast enough to remain cost efficient.

The repo is the source of truth. Every major technical, product, AI-agent, game-engine, styling, infrastructure, or data decision should be checked here before implementation.

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
