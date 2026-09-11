# Living Textbook Decision Register

## DR-602: Complete Canonical Audio Coverage

Require matching audio for each canonical term and sentence. Distinct cue IDs repeating one text cannot satisfy coverage for other text. Alternate recordings and reordered cue lists remain valid. See `docs/decision-register/DR-602-complete-canonical-audio-coverage.md`.

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
