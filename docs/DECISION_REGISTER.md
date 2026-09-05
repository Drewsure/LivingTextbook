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
