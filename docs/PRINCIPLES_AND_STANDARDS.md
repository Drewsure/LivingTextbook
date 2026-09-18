# Living Textbook Principles And Standards

Document type: standing hard-gate standards artifact

Canonical location: `docs/PRINCIPLES_AND_STANDARDS.md`

Readable mirror: `Living Textbook - Principles and Standards` in the Documents app when document-write tooling is available

Related strategic document: `docs/BLUEPLAN.md`

## 1. Engagement Checklist

Every future engagement must begin by checking this list before code, design, AI-agent delegation, game work, curriculum generation, or visual polish begins.

- Confirm this is a white-label saleable platform first.
- Confirm MiniStar English Lab is the flagship tenant and reference curriculum, not the only product.
- Confirm no work begins with visual polish before clean component structure, routing, data boundaries, and layout stability exist.
- Confirm teacher-led QR onboarding and student self-progression are both preserved.
- Confirm all learner-facing text in student games, flashcards, instructions, feedback, and critical controls has audio support through recorded audio, teacher audio, partner audio, or text-to-speech.
- Confirm the preferred learner audio interaction is tap/click the text itself; autoplay is a controlled opt-in exception only.
- Confirm rewards use earned collection mechanics, not gambling-like pressure.
- Confirm AI Tutor, when present, is optional premium entitlement and the core platform still works without it.
- Confirm any Z.ai or outside AI output must obey schema, component, integration, audio-support, and review standards before adoption.
- Confirm public repository, library, and asset research has been considered before major custom engine, media, PWA, AI-verifier, reward, avatar, or content-pipeline work.
- Confirm no external code or assets are adopted without license, provenance, white-label fit, and integration review.
- Confirm no legacy code is promoted into `apps/web` or `apps/ai-service` without an explicit integration plan.
- Confirm textbook partner, multimedia, local/closed deployment, and permanent QR requirements are preserved when white-label architecture is affected.
- Confirm competitive coverage has been checked for teacher time-saving, activity pathways, printables, assignment/reporting, private libraries, sharing/embedding, and testing implications when the affected area overlaps those concerns.
- Confirm hybrid QR is the default: stable QR registry, optional tiny hosted redirect, and local app/content-package fallback.
- Confirm changes are compatible with the current `docs/BLUEPLAN.md` unless a documented standards update is intentionally made.

If any item cannot be confirmed, stop and record the exception before continuing.

## 2. North Star

The Living Textbook platform is a premium, white-label, saleable PWA learning portal.

MiniStar English Lab is the first complete tenant, the flagship curriculum, and the proof-of-value implementation. Its curriculum, game progression, and classroom needs should guide the build, but the underlying architecture must support other schools, academies, publishers, and curriculum owners.

A living textbook unit is not only text plus games. It is a complete reviewed package of textbook reference, learning payload, games, multimedia, audio-supported learner text, QR entry, progression, and reporting.

The platform must support tenant-specific:

- Branding
- Curriculum
- Avatar families
- Visual rules
- Game progression
- QR routes
- Teacher dashboards
- Student progression systems
- Reward economies
- Content packages
- Multimedia catalogs for audio and video
- Audio cues for vocabulary, sentences, instructions, feedback, and critical learner controls
- Unit playlists and optional background media
- Feature entitlements and premium package options
- Optional bounded AI Tutor capability for eligible upper-level packages
- Local or closed companion deployments
- Target-language expansion beyond English, including Japanese as a possible target language for suitable tenants

## 3. Build Order Standard

Build in this order:

1. Clean component structure, routing, data boundaries, and layout stability.
2. Interaction polish, animation, progression surfaces, and feedback loops.
3. Premium visual assets, micro-interactions, mascot/avatar evolution, and advanced delight.

Do not reverse this order.

A beautiful unstable screen is not acceptable. A clean stable layout can be improved. Therefore, foundation comes first, polish second, premium expression third.

Hosted adapter readiness may be probed from a teacher-only workbench through a read-only coded request. A reachable endpoint or rehearsal record must never be presented as durable production persistence, and the probe must not enable learner-data writes.

### Cross-route and hosted persistence standard

Student progression crosses routes only through a validated continuity envelope scoped to tenant, package, launch, student session, and exact destination path. Browser session storage is rehearsal-only. The first hosted adapter is a non-durable, explicitly policy-gated rehearsal boundary; production persistence requires an approved provider, identity model, retention policy, school policy, migration plan, and release gate.

## 4. Component Standards

Components must be reusable, named, and domain-specific. Avoid tangled one-off screens where layout, state, data access, scoring, and visual polish are fused together.

Required component habits:

- Prefer clear product/domain names over vague component names.
- Keep layout components separate from game logic.
- Keep game engines separate from payload generation.
- Keep media playback separate from game scoring while allowing controlled game/media coordination.
- Keep learner text separate from audio playback, but make student-facing text itself able to receive audio cue ids and act as the default listen/replay control.
- Keep tenant branding separate from hard-coded MiniStar assumptions.
- Shared navigation must be tenant-aware. Tenant-scoped links should resolve from the active tenant and route helpers, not from hard-coded sample or flagship tenant paths.
- Keep tenant feature entitlements separate from individual game or media screens.
- Build mobile-first and QR-classroom friendly.
- Keep student surfaces simple enough for young learners.
- Use stable dimensions for game boards, cards, counters, controls, and rewards so animation or dynamic text does not shift the layout.
- Use stable contextual React keys for repeated review lists; visible text alone is not enough when blockers, warnings, and checklist items can repeat.
- Use accessible buttons, labels, focus states, and readable contrast.

Preferred early learner UI inspiration:

- `legacy/ministar-game-studio-ai`

This repository currently contains the strongest young-learner UI direction, including avatar onboarding, game completion feedback, multilingual completion copy, and power-up patterns.

## 5. Game Standards

Do not build 48 isolated games.

The platform should use:

- 8 pedagogical game families for curriculum and teacher-facing organization
- 4 parent technical engines for implementation efficiency
- 48 modes as configurations, skins, rule subsets, scoring profiles, and content mappings

Every game mode must consume a standardized payload and report standardized progress events.

Game URLs must never unlock themselves. Direct URLs may remain visible for
teacher review and route verification, but the interactive game surface must
be gated by progression established through entry practice. This protects the
teacher-led QR -> flashcard -> curated activity path and applies equally to
future Phaser wrappers.

Progression passed between routes must use a validated, provider-neutral
continuity envelope. It must preserve tenant, package, launch, learner-session,
unit, event-cursor, and progression identity without putting learner state in
QR URLs. Until storage, identity, school policy, reporting, recovery, and
release gates are approved, continuity remains review-only and has no side
effect. See `docs/PROGRESSION_CONTINUITY_CONTRACT.md` and ADR 0675.

Curated unit offer maps must agree with the shared game-mode family and parent
engine contracts. A map mismatch is review evidence needing correction, not a
reason to patch a route or create a one-off game.

Unlock checks must exist at both the route-mount boundary and the progression
adapter boundary. A wrapper cannot earn Star Dust or completion by calling the
adapter for a mode that the learner has not unlocked.

Game-mode routes must be resolved through the shared route helper before they appear in launch, activity hub, recommendation, completion, teacher shortcut, or partner demo surfaces. The helper must stay exhaustive so typecheck fails when a new playable mode is added without a route. Do not add private switch statements or one-off route branches when adding a mode.

Every game mode must also support learner audio. Vocabulary, sentence prompts, instructions, feedback, and critical game controls should be listenable and replayable. This is required because the core audience includes young children and English learners who cannot be assumed to read independently.

Minimum game event requirements:

- Game started
- Round/item shown
- Student answer submitted
- Correct/incorrect result
- Hint or power-up used
- Time elapsed
- Game completed
- Star Dust or XP earned
- Mastery state updated

A game mode is not platform-ready until it can participate in teacher launch, student progression, scoring, audio support, and review flows.

## 6. Activity Pathway And Competitive Coverage Standards

The platform should not copy a competitor's unrestricted template switching as the default student or teacher experience.

Living Textbook should provide curated, teacher-approved activity pathways generated from reviewed unit packages. For each unit, the teacher/admin package should show:

- Required entry activity
- Recommended next activities
- Optional review activities
- Teacher-only or premium activities
- Printable companion outputs when available
- Blocked activity types and the reason they are blocked
- Audio coverage status for each offered activity
- Target-language progression trigger
- Support-language role
- Timer, difficulty, motion, background media, microphone, and AI Tutor controls where relevant

Template or activity conversion is still important, but it should be governed by compatibility rules. Some payloads can safely become flashcards, quiz, matching, sentence builder, and printables. Other payloads should not become crossword, word search, typing, or arcade modes unless the content structure, text rules, audio plan, and scoring/reporting rules fit.

The first library model should be private and tenant-scoped. Public community sharing is not a v1 requirement because it introduces moderation, copyright, privacy, student-safety, tenant-isolation, and quality-control risk. The preferred order is:

1. Private teacher drafts inside one tenant.
2. Tenant-approved package library.
3. School or publisher sharing inside the same tenant.
4. Cross-tenant marketplace or public community only after governance exists.

Printable activities are a planned platform capability. They should be generated from the same reviewed content package as interactive activities so worksheets, homework, classroom printouts, and textbook companions do not drift from the digital unit.

## 7. Progression And Collection Standards

Earned collection is the default engagement model.

Students should unlock rewards through mastery, persistence, and completion. Rewards should create ownership, creativity, and identity without gambling-like pressure.

Allowed reward types:

- Avatar choices
- Avatar outfits and accessories
- Pet/mascot evolution stages
- Room, base, or learning-space decorations
- Color palettes
- Animation upgrades
- Title tags
- Stickers or badges
- Power-ups earned through mastery
- Spin Wheel tickets from Star Dust overflow

Surprise rewards are allowed only as child-safe bonus cosmetics. They must not become pressure-based gacha, paid gambling-like loops, or systems that punish students for not chasing random rewards.

Reward design principles:

- Primary rewards should be predictable and mastery-linked.
- Surprise rewards should be bonus delight, not the main progression path.
- Students should feel ownership over a space, avatar, or companion.
- Teachers and parents should be able to understand why a reward was earned.
- The system must support white-label reward themes, not only MiniStar-specific mascots.

## 8. Star Dust Standard

Star Dust is a mastery economy, not just a points animation.

Canonical unit scoring target:

- 1,000 Star Dust per unit
- Vocabulary: up to 300
- Syntax: up to 300
- Accuracy, reflex, completion, or mode-specific bonus: up to 400

Canonical content default:

- 8 vocabulary terms per unit
- Allowed range: 8-12 vocabulary terms
- Exactly 2 target sentence structures per unit

Vocabulary scoring must scale to the number of terms in the unit.

Module progression:

- 4 units per module
- 4,000 maximum Star Dust per module
- 3,000 Star Dust mastery threshold
- Overflow above 3,000 can convert to Spin Wheel tickets at 250 Star Dust per ticket

Training Academy should help students recover gaps without feeling like they failed. Low-scoring areas should map to review games or practice sessions.

## 9. AI Authoring Standards

The AI Authoring Studio generates structured curriculum/game payloads, not final ad hoc game code.

AI teaching game generator creates draft package requests, verifier packets, target-language audio plans, and curated activity pathway proposals. It must not create student-facing routes, live game code, playlist releases, or assignments without the normal review gates.

AI generation must run from reviewed, versioned, tenant-scoped prompt packages. Prompt packages must lock input slots, JSON schema, content limits, audio requirements, tenant brand rules, support-language rules, model-use state, usage budget, and cost controls. No raw student data may be sent into prompt packages, and students must never edit generator prompts or see premium upsell copy.

AI-generated game packages must include deterministic gamification mappings before review. Generated activities must name their accepted events, Star Dust scoring lanes, mastery thresholds, collection unlock bindings, and blocked reward shortcuts. AI generation cannot create random rewards, generated gacha, purchase-like unlocks, support-language-only mastery, or media-only Star Dust.

AI-generated game packages must include a verifier submission packet before teacher approval. The packet must show schema, pedagogy, target-language progression, audio, engine, gamification, compatibility, media-rights, and teacher-approval evidence with rejection rules. No route, playlist, assignment, package approval, or student-ready marker may be created from a generated package until those checks are durable and reviewed.

AI-generated draft packages must enter the normal teacher review queue, not a privileged AI shortcut lane. The queue must show source lineage, verifier packet requirements, blocked route/playlist/assignment actions, audio blockers, media-rights blockers, and approval blockers before any generated package review workflow can be activated.

AI-generated draft packages must produce a generated package manifest before package assembly exists. The manifest links prompt, draft JSON, audio, engine, gamification, verifier, and review queue evidence while keeping package assembly, route registry writes, media playlist writes, assignment writes, local bundle writes, and student-ready marking blocked.

AI generation must bind generated activity proposals to the existing game mode catalog, parent engines, scoring profiles, and standard event contract. It must not generate one-off game code, bypass parent engines, or promote Z.ai/outside prototypes without integration review.

Required content rules:

- Default 8 vocabulary terms
- Allowed range 8-12 vocabulary terms
- Exactly 2 target sentence structures
- Level-appropriate vocabulary and syntax
- Game-mode-aligned payloads
- Learner-facing text suitable for audio generation or recording
- Teacher Launch Protocol included
- JSON-first output
- Explicit `unit_meta.target_language`; a missing target language must be rejected rather than defaulted to English
- Verification before student assignment

The Vision/Verifier layer must check:

- Term count validity
- Sentence count validity
- Audio support plan existence for learner-facing text
- Level match
- Game mode match
- Tenant visual rules
- Tenant brand rules
- Forbidden motifs or visual drift
- Schema validity

No generated payload should be assigned to students until it passes verification or teacher approval.

Live AI generation, speech scoring, and AI Tutor features are optional package capabilities. They require tenant/school adoption, cost controls, privacy review, and teacher-visible enablement before use.

## 10. White-Label Standards

Tenant configurability is a first-class requirement.

The following must not be hard-coded as global assumptions:

- MiniStar branding
- Cloud Dog / Star Kid motifs
- MiniStar color palette
- MiniStar reward names
- MiniStar curriculum sequence
- MiniStar visual blacklist rules
- MiniStar voice, pronunciation, audio vendor, or audio style
- MiniStar AI Tutor availability, tutor name, tutor persona, tutor voice, or tutor package state

They may be default tenant configuration for MiniStar English Lab, but other tenants must be able to define different equivalents.

Required abstractions:

- Tenant
- Curriculum
- Level
- Unit
- Brand theme
- Avatar family
- Reward catalog
- Visual rules
- Content rules
- Feature entitlements
- Premium package tiers
- Optional AI Tutor plan
- QR launch route
- Content package
- Multimedia catalog
- Audio cue catalog
- Local/closed deployment profile
- Backend/storage adapter selection gate
- Target language, script policy, segmentation policy, and assist-language options

Every tenant content package must pass a pure isolation check before it can be treated as reviewed. Package metadata, units, media, audio, playlists, multimedia bindings, and assist-language plans must use the package tenant and valid unit references; duplicate units, orphan assets, cross-tenant references, and cross-unit playlist or multimedia bindings are rejected.

Student-visible Japanese assist is also package-validated: plans declare a script policy, Foundation/Bronze/Plus bands use hiragana-only content, and later mixed-script support requires a reviewed policy. This protects the language standard across generated, imported, and future uploaded packages without making Japanese a universal platform requirement.

AI authoring requests must carry the applicable assist-language script policy and level band alongside target language, pedagogy, audio, and review constraints; generation cannot weaken a package rule.

Package readiness surfaces must show assist-policy coverage explicitly. “Reviewed translation” and “script-safe for this level” are separate evidence statements, and neither may be represented as a student unlock or mastery signal.

The platform must not assume English is always the target language. MiniStar English uses English as the progression trigger, but a white-label Japanese-learning tenant could configure Japanese as the target learning language. That future path requires kana, kanji, optional furigana/ruby text, Japanese audio, Japanese segmentation, and level-aware script policy.

Storage decisions must remain backend-neutral until the relevant school or tenant policies are accepted. The first pilot should prefer the cheapest practical hosted managed storage path unless a partner explicitly requires a closed local install. Closed local and hybrid storage must remain supported product directions, but they require installer, backup, restore, encryption, update, retention, and export procedures before activation.

## 11. Teacher And Student Experience Standards

The platform must support both teacher-led classroom use and student self-progression from day one.

Teacher-led requirements:

- Teacher can select or approve a unit.
- Teacher can launch by QR code.
- Teacher can review assignment readiness and rollout gates before scheduling a classroom pilot.
- Teacher can see the Teacher Launch Protocol.
- Teacher can monitor completion and mastery.
- Teacher can monitor media engagement separately from language-game mastery.
- Teacher can confirm audio support exists for learner-facing text before assignment.
- Teacher can trigger or recommend Training Academy review.
- Teacher or school can enable premium AI Tutor only when the tenant has adopted that package.

Student self-progression requirements:

- Student can enter through a QR route.
- Student can enter through a front-door login flow where a tenant requires entry code and user code.
- Student can enter through a private assignment link only when the link is tenant-scoped, student-safe, and not a public sharing or teacher/admin route.
- Student can complete an entry practice flow, usually flashcards.
- Student can tap or click learner-facing text to hear vocabulary terms, target sentences, instructions, feedback, and critical controls without needing independent reading ability.
- Student can unlock the next recommended game mode.
- Student can see progress, Star Dust, and reward movement.
- Student can access approved unit media such as songs, videos, chants, or playlists.
- Student can return without a heavy login burden, especially for younger learners.
- Student progression cannot depend on AI Tutor being enabled.

## 11.1 Agent Standards

Codex is the lead systems architect, integration engineer, and build governor for this repository.

Codex responsibilities:

- Preserve source material
- Define and maintain canonical architecture
- Prevent fragmentation
- Maintain schema discipline
- Integrate useful code from legacy systems
- Write build directives for other AI agents
- Review Z.ai or outside AI outputs before adoption
- Keep MiniStar useful without compromising white-label resale potential

Z.ai and other AI tools may be used for:

- Isolated game prototypes
- Visual polish experiments
- Phaser/arcade mode improvements
- Single-engine tasks with strict contracts
- Asset generation experiments

Z.ai and outside AI tools must not own:

- Canonical schema
- Repository architecture
- Auth/database decisions
- Cross-engine contracts
- Final integration decisions
- Security model
- Tenant model

Every outside-agent task must include:

- Target engine
- Expected input JSON
- Expected output events
- Scoring telemetry contract
- Audio-support requirements for all learner-facing text
- Accessibility requirements
- Mobile/PWA requirements
- Source/license requirements if public repositories, libraries, or assets are referenced
- Forbidden architectural changes

Once the foundation gate is green, Z.ai may be asked for isolated prototype
packages in an explicitly approved prototype repository. This is an
intake-phase opening, not permission to copy, merge, route, publish, or assign
the prototype. Every returned package must pass the source, schema, event,
audio, scoring, mobile, accessibility, rights, and wrapper review gates before
integration is proposed.

## 12. Legacy Code Promotion Standard

Legacy code is preserved for reference and extraction. It is not automatically production code.

Before any legacy code moves into `apps/web`, `apps/ai-service`, or shared packages, the integration plan must identify:

- Source path
- Target path
- Why it is being promoted
- What dependencies it brings
- What must be refactored
- How it fits the standardized payload schema
- How it reports scoring/progress events
- How it respects white-label tenant boundaries
- How it supports audio for learner-facing text
- How it will be tested

Do not copy large legacy screens directly into the canonical app without separation of layout, state, data, and game logic.

## 13. UI Polish And Asset Standard

Premium polish is required, but only after foundation quality exists.

Allowed after structure is stable:

- Micro-interactions
- Motion feedback
- Particle effects
- Completion celebrations
- Premium avatar/mascot art
- Collectible room/base visuals
- Audio feedback
- Themed game skins

Not allowed before structure is stable:

- Decorative-only rewrites
- Asset-heavy screens that hide weak data flow
- Complex animation that breaks mobile layout
- Hard-coded visual systems that block white-labeling

## 14. Pull Request And Review Checklist

Every significant change should be reviewed against this checklist:

- Does this preserve white-label platform architecture?
- Does this avoid hard-coding MiniStar as the only tenant?
- Does this improve or preserve clean component boundaries?
- Does this avoid premature polish before stable layout?
- Does this support teacher-led QR launch or student self-progression?
- Does this support audio for learner-facing student text?
- Does this support the multimedia package model when unit content is affected?
- Does this use earned collection rather than pressure-based reward loops?
- Does this keep games data-driven?
- Does this report or preserve standard scoring/progress events?
- Does this avoid promoting legacy code without a plan?
- Does this keep AI Tutor optional, premium-gated, and disabled cleanly when not adopted?
- Does this include public repository/license research when major custom work or external assets are involved?
- Does this include or update a verification path in `docs/VERIFICATION_CHECKLIST.md` when user-facing flows change or local verification is blocked?
- Does this remain compatible with `docs/BLUEPLAN.md`?

If the answer to any item is no, document the reason before merging.

## 15. Operational Memory And Workaround Standard

Repeatable procedures and workarounds must be documented so future engagements do not rediscover the same constraints.

Required practice:

- Product, architecture, and build rules belong in this document.
- Major accepted decisions belong in `docs/DECISION_REGISTER.md` and, when useful, `docs/adr/`.
- Repeatable environment constraints, connector procedures, branch-state notes, and tool workarounds belong in `docs/OPERATING_NOTES.md`.
- Route and flow contracts belong in focused design documents such as `docs/ROUTE_CONTRACTS.md`.
- Verification procedures belong in `docs/VERIFICATION_CHECKLIST.md`.

When a workaround is used more than once, document:

- What behavior was observed
- Why the workaround was needed
- The safest repeatable procedure
- What must be verified afterward
- Any risk of branch, file, or environment mismatch

Do not let durable operational knowledge live only in chat history.

## 16. Maintenance Rule

This document must be maintained at the start of each major engagement.

Update it when:

- A product principle changes
- A build standard changes
- A white-label assumption changes
- A new agent workflow is adopted
- A reward/progression rule changes
- A repeated mistake needs to become a standing rule
- A repeatable environment constraint or workaround is discovered
- A verification path changes

Do not let standards live only in chat history. If a rule matters, preserve it here.

## 17. Textbook Companion, Multimedia, And Local Deployment Standard

White-label tenants may include textbook publishers, curriculum owners, or schools that need a closed local companion product rather than a public-only web portal.

The platform must support this product shape without becoming partner-specific.

Required standing rules:

- PDF or document-derived textbook units enter as reviewed content packages, not trusted raw extraction.
- Content packages preserve tenant, series, book, unit, page, activity, language, edition, and version metadata where available.
- Audio and video assets belong to a multimedia catalog with rights, owner, duration, unit links, activity links, and local/offline availability metadata.
- A music/video platform is implemented as reusable media playback and playlist infrastructure, not as one-off music or video pages.
- Unit games may optionally use unit music, chants, or video as background/support media, but this must be teacher/tenant configurable and disable-able.
- Teacher media library previews must be tenant-aware and must not show another tenant's brand, ownership language, rights records, playlists, or local bundle state.
- Local/closed companion manifests must name every active playable game mode as included, planned, or blocked, using shared `GameModeId`, shared parent-engine ids, target-language audio coverage, progress-reporting status, and local route paths.
- Printed QR codes resolve stable identifiers, not local files, temporary localhost ports, or version-specific asset paths.
- The default QR strategy is hybrid: stable registry, optional tiny hosted redirect, and local app/content-package fallback.
- Local/closed deployment must document whether it uses an installed app, installed PWA, local classroom server, custom deep link, hosted redirect, or hybrid approach.
- Pure offline QR behavior must not be promised unless app installation, deep-link behavior, content package availability, and update constraints are explicit.
- A small hosted redirect layer remains acceptable when true long-term printed QR permanence is needed.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-007, DR-008, `docs/adr/0004-permanent-qr-and-local-companion-mode.md`, and `docs/adr/0005-core-multimedia-package.md`.

## 18. Audio-First Learner Support Standard

Audio engagement is essential across all student games and activities.

The platform must assume many learners are young, pre-literate, emerging readers, or English learners who cannot reliably read instructions, labels, vocabulary, or feedback without support.

Required standing rules:

- Every student-facing vocabulary term must have an audio cue.
- Every target sentence must have an audio cue.
- Student-facing instructions, feedback, prompts, and critical controls must have listen/replay support.
- The preferred default interaction is tap/click the learner-facing text itself to hear it.
- Separate listen buttons are acceptable when text-as-control would be unclear, crowded, or inaccessible.
- Autoplay is allowed only as a controlled opt-in behavior for specific cases such as first-card reveal, listening drills, accessibility settings, or teacher-led presentation mode.
- Autoplay must be disable-able, must not overlap competing audio, and must respect classroom noise, browser permission, and accessibility constraints.
- Every parent game engine must accept audio cue references as part of its mode payload.
- Audio cues may resolve to recorded files, partner-provided media, teacher-recorded audio, generated text-to-speech, or a reviewed placeholder during early development.
- Text-to-speech is acceptable as a cost-efficient fallback, but tenant/product configuration must allow replacement with recorded or partner-owned audio.
- Audio cue support is separate from optional background music. Background music can be disabled; comprehension audio cannot be silently omitted from student-facing learning flows.
- Audio behavior must remain tenant-configurable for voice, accent, language, pronunciation rules, playback speed, autoplay defaults, and offline/local bundle availability.
- Media playback, video watching, background music, and support-language listening are useful engagement signals, but they cannot unlock progress, mastery, scoring, rewards, routes, or release state.
- Teacher reports may eventually track audio engagement, but lack of tracking must not block the presence of listen/replay support.
- A game or unit is not student-ready until its learner-facing text has an audio support plan.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-009 and `docs/adr/0006-audio-first-learner-support.md`.

## 19. Public Repository And Asset Research Standard

Public repositories, open-source libraries, and public asset sources may help the build reach higher quality faster, but they must be governed.

Required standing rules:

- Before major custom game-engine, media-player, PWA/offline, AI-verifier, reward, avatar, collection-room, or content-pipeline work, perform a focused public-repository and best-practice research pass.
- Record useful candidates, rejected candidates, license notes, risks, and integration choices in `docs/RESEARCH_NOTES_PUBLIC_REPOS.md` or an ADR.
- Check license compatibility before any code or asset adoption.
- Confirm commercial white-label use, modification rights, redistribution rights, and attribution requirements before adopting assets.
- Prefer proven libraries, clean patterns, and small adapters over copying large public game screens.
- Do not import public assets into tenant-facing product surfaces without provenance and rights documentation.
- Do not use unclear-license, incompatible-license, or abandoned code in production without an explicit decision.
- Public examples may guide Z.ai or outside-agent task specs, but outside-agent output still requires Codex integration review.
- External code must not enter `apps/web`, `apps/ai-service`, or shared packages without a written integration plan.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-010, `docs/FUTURE_REQUIREMENTS.md` FR-003, and `docs/RESEARCH_NOTES_PUBLIC_REPOS.md`.

## 20. Optional Premium AI Tutor Standard

AI Tutor is a future upper-level learning capability and an optional premium package. It is not required for the core Living Textbook platform to function.

Baseline Living Textbook must remain complete without AI Tutor:

- QR/front-door launch
- Audio-first flashcards
- Game progression
- Multimedia packages
- Earned rewards
- Teacher launch protocols
- Teacher-visible progress reporting

Required standing rules:

- AI Tutor must be represented through tenant feature entitlements and unit/package tutor plans.
- AI Tutor must be disabled cleanly when a school, publisher, or tenant has not adopted the package.
- Active AI Tutor plans must require premium or enterprise entitlement.
- AI Tutor should be aimed first at upper-level speaking, writing, correction, role play, and adaptive review.
- No open-ended general chatbot for children is allowed.
- No tutor response should ignore the current tenant, curriculum, unit, approved vocabulary, or approved sentence patterns unless a reviewed mode explicitly allows broader scope.
- No raw transcript storage should be default behavior.
- No active tutor UI, model call, speech service, billing logic, or student chat route should be built before the foundation slice is locally verified.
- AI Tutor usage must be cost-controlled through tenant/package enablement, allowed levels, allowed modes, usage limits, and teacher/school controls.
- Teacher reporting should distinguish premium tutor summaries from baseline game/media progress.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-011 and DR-012, `docs/adr/0007-bounded-ai-tutor-upper-levels.md`, `docs/adr/0008-ai-tutor-premium-entitlement.md`, `docs/AI_TUTOR_STRATEGY.md`, and `docs/future-requirements/FR-006-bounded-ai-tutor-upper-levels.md`.

## 21. Tenant Navigation Boundary Standard

White-label navigation is part of product separation, not decoration.

Required standing rules:

- Shared platform routes may appear across tenants when they preserve tenant branding, review-only status, and common guardrails.
- Tenant-scoped review routes must resolve from tenant-aware route helpers or route data.
- Sample-publisher-only operational routes must not appear on MiniStar-branded pages until equivalent MiniStar data, records, and verification exist.
- MiniStar-only media state, ownership labels, support-language rules, and local package state must not appear on sample-publisher pages.
- Teacher/admin route examples may be visible inside boundary review panels, but they must not become live workflow actions.
- Navigation cannot activate uploads, storage writes, evidence exports, release-state mutation, local package export, assignment activation, scoring, rewards, or classroom launch.
- The tenant navigation boundary panel must remain visible on `/teacher/intake` before more tenant workbenches are created.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-541 and DR-542, `docs/adr/0470-tenant-aware-app-shell-navigation.md`, and `docs/adr/0471-tenant-navigation-boundary-panel.md`.

## 22. Route Graduation Standard

An active local route is not a production promise.

Required standing rules:

- Scaffold routes prove rendering, data shape, and review-only boundaries only.
- Student-ready routes require reviewed content, target-language audio coverage, standard progress events, teacher controls, and private assignment rules.
- Pilot-ready routes require school policy acceptance, backend storage selection, roster identity boundaries, report/export policy, and rollback evidence.
- Production QR routes require stable QR aliases, versioned package manifests, rights proof, rollback plans, and local companion fallback strategy where applicable.
- No route may graduate because it is visible, linked, generated, or locally previewable.
- Route graduation cannot activate upload controls, storage writes, production QR mutation, classroom launch, real learner data collection, report export, direct media-file targets, or support-language-only progress.
- The route graduation gate must remain visible on `/teacher/intake` while the platform is in foundation and pilot-readiness stages.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-543 and `docs/adr/0472-route-graduation-gate.md`.

## 23. Foundation Workstream Visibility Standard

The foundation dashboard must remain readable as the build expands.

Required standing rules:

- `/teacher/intake` must show a visible workstream index before the detailed review panels.
- The index must name the current build focus and the major build lanes: routes/QR, content intake/uploads, game engines, audio/media/language, teacher operations/reporting, pilot/policy/evidence, backend/persistence/local companion, and future Z.ai intake.
- The index must preserve the future Z.ai intake alert until Codex explicitly signals that outside prototypes should be inventoried, reviewed, and wrapped.
- The index cannot activate live features, student data collection, public community libraries, unmanaged asset adoption, direct AI publish, or Z.ai imports.
- The visible build map must stay aligned with the build sessions document, principles and standards document, decision register, ADRs, and route verification checks.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-544 and `docs/adr/0473-foundation-workstream-index.md`.

## 24. Teacher-Facing Build Status Standard

Teacher-facing entry surfaces should communicate the current build state in plain language.

Required standing rules:

- `/teacher` must show a compact foundation status snapshot while the platform is in foundation and pilot-readiness stages.
- The snapshot must state that structure comes before premium polish.
- The snapshot must expose route health, tenant-boundary status, and the current Z.ai/prototype timing.
- The snapshot must link to `/teacher/intake` for the full foundation control room.
- The snapshot cannot activate live features, classroom launch, real learner data collection, report export, or Z.ai imports.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-545 and `docs/adr/0474-teacher-page-foundation-status-snapshot.md`.

## 25. Z.ai Human Handoff Signal Standard

Outside game builds can be valuable, but they must enter the platform through a controlled signal.

Required standing rules:

- Codex will explicitly tell the user when Z.ai or outside prototype intake is ready.
- Until that signal is given, Z.ai work stays isolated in `Drewsure/ministar-lab` or another explicitly approved prototype repository.
- The user may keep preserving prompts, fixture JSON, screenshots, notes, and demo observations for later review.
- No Z.ai source handoff, Phaser import, archive upload, pull request, app patch, route replacement, scoring mutation, audio manifest mutation, reward write, playlist write, package promotion, or student assignment is requested before the alert.
- The alert may move to ready-for-review only after target parent-engine readiness, fixture replay, event replay, target-language audio coverage, deterministic scoring replay, mobile/accessibility evidence, and wrapper-boundary evidence exist for a specific candidate.
- Codex owns the final integration review and merge decision.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-546 and `docs/adr/0475-zai-human-handoff-signal.md`.

## 26. PWA And Offline Honesty Standard

Installability is not the same as offline readiness.

Required standing rules:

- The platform may expose an installable hosted PWA shell while the foundation build is still review-only.
- No page, package, route, teacher panel, or partner handoff may claim offline-ready status until service worker, cache policy, media rights, checksums, package manifests, QR fallback, rollback, learner-data, and school policy gates are complete.
- Service worker registration, cache mutation, media precache, background sync, local installer export, local package activation, and student data offline storage stay blocked during foundation.
- Offline media bundles require rights proof, versioned manifests, checksums, package size review, and tenant approval for offline distribution.
- Learning audio priority must be preserved before any background music, video, media cache, or offline bundle behavior is allowed.
- Printed QR codes must resolve through stable alias/front-door behavior and may only fall back to local companion routes after edition compatibility and rollback rules are verified.
- A closed local textbook companion is a product strategy, not a shortcut around hosted PWA, storage, evidence, report, or privacy gates.
- Local companion preview routes must show the same PWA/offline honesty gate as `/teacher/intake` before any package can be discussed as a partner-facing handoff.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-547 and DR-548, `docs/adr/0476-pwa-offline-readiness-gate.md`, and `docs/adr/0477-local-preview-offline-readiness-parity.md`.

## 27. Media Bundle Integrity Standard

Closed textbook companions need package engineering, not just file upload.

Required standing rules:

- Audio, music, video, poster, image, and future game asset bundles must pass size, checksum, rights, duplicate, fallback, replacement, and learning-audio priority checks before closed-package or offline handoff.
- Bundle size budgets must exist at unit and edition level before video or large media can be included in an offline/local package.
- Every distributed media file requires a checksum manifest, relative path map, versioned manifest id, and restore verification step.
- Shared songs, chants, posters, videos, and game assets should be referenced through tenant media libraries when possible to avoid duplicated package weight.
- Publisher yearly replacement must preserve edition versioning, QR alias rollback, legacy package retention, and rights proof.
- Learning audio must remain audible and target-language governed when music, video, or background media exists.
- No package-size approval, checksum-free bundle, direct folder activation, uncompressed video handoff, media-only progress, background music override, offline-ready claim, or local installer export is allowed from review-only surfaces.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-549 and `docs/adr/0478-media-bundle-integrity-gate.md`.

## 28. Deployment Decision Workbench Standard

Deployment choices must be understandable before they become live product operations.

Required standing rules:

- Hosted PWA is the default first pilot recommendation because it is fastest to review, lowest cost to support, and avoids installer/offline media complexity while the foundation is still stabilizing.
- Local classroom server and packaged textbook companion delivery remain valid white-label opportunities, but they are paid or policy-gated paths, not foundation defaults.
- Deployment discussions must show cost profile, commercial fit, required evidence, and blocked actions for hosted PWA, local classroom server, and packaged companion options.
- No deployment page may activate local packages, export installers, claim offline readiness, mutate production QR redirects, store learner data offline, export reports, or enable premium AI Tutor features.
- Closed local or packaged delivery requires media rights, checksums, package-size budget, versioned bundle manifests, QR fallback proof, storage policy, report/export policy, rollback evidence, and school acceptance.
- Deployment decisions must preserve target-language progress triggers, learning audio priority, private assignment/front-door rules, tenant package entitlements, and child-safe cost controls.
- The focused `/teacher/deployment` workbench must stay aligned with `/teacher/intake`, `/teacher/persistence`, `/teacher/entitlements`, `/local/ministar`, and `/local/sample-publisher`.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-550 and `docs/adr/0479-deployment-decision-workbench.md`.

## 29. Pilot Readiness Dashboard Standard

Pilot conversations need one plain go/no-go view before any school or publisher sees live workflow promises.

Required standing rules:

- `/teacher/pilot` must separate controlled demo evidence from classroom-ready evidence.
- The dashboard must show demo-ready status, classroom blockers, source/media evidence, school policy, persistence, teacher reports, deployment, launch gates, and package publish gates in one review-only surface.
- The first partner conversation may use the controlled demo routes, but it must not imply live learner data, report export, school policy acceptance, local package activation, offline readiness, premium AI Tutor activation, or Z.ai prototype intake.
- The route must link back to the source evidence routes instead of duplicating or bypassing them.
- The page may summarize policy and storage warnings, but it cannot accept policy, select a storage adapter, upload evidence, launch a class, export reports, mutate QR aliases, or activate paid features.
- The dashboard must preserve hosted PWA as the recommended first pilot stance unless a partner requires closed local operation and accepts the extra policy, media, support, and cost burden.
- Active route verification and `npm run verify:pilot` must protect the route, route contract, navigation, dashboard data, standards, ADR, decision register entry, and no-live-action blockers.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-551 and `docs/adr/0480-pilot-readiness-dashboard.md`.

## 30. Partner Pilot Requirements Intake Standard

Partner onboarding starts as a requirements conversation, not as a live upload workflow.

Required standing rules:

- `/teacher/pilot/requirements/[tenantId]` must show what the publisher must supply, what the school must decide, and what the platform must still build or enable before a real classroom pilot.
- The route must cover source PDF/text files, audio, music, video, posters, images, game pathway scope, QR/front-door entry, learner data, teacher reports, deployment, package tier, optional AI Tutor/speech scoring, and outside prototype timing.
- The route must include an evidence traceability map that links each requirement to the review route holding its proof or blocker, including current signal, blocked-until condition, and pilot dependency.
- The route must include a first partner pilot meeting agenda that defines questions to ask, evidence to request, decisions not made during the meeting, and live actions still blocked.
- The route must state demo-ready, not classroom-ready, until source evidence, media rights, school policy, persistence, report/export, deployment, launch-gate, and package publish gates close.
- The first recommended pilot path remains hosted PWA for cost control unless a partner requires closed local operation and accepts the extra support, media, storage, QR, rollback, and policy burden.
- The route may guide a meeting, but it cannot upload files, save partner answers, accept policy, select storage, export reports, bill premium services, request microphone access, import Z.ai work, or launch student sessions.
- Z.ai and outside prototype requirements remain visible but blocked until Codex explicitly changes the handoff signal to ready-for-review.
- `npm run verify:pilot-requirements` and active route verification must protect the route, route contract, tenant navigation, dashboard link, standards, ADR, decision record, checklist, and no-live-capture blockers.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-552, DR-553, and DR-554, `docs/adr/0481-partner-pilot-requirements-intake.md`, `docs/adr/0482-partner-pilot-evidence-traceability.md`, and `docs/adr/0483-partner-pilot-meeting-agenda.md`.

## 31. Evidence Handoff Lineage Standard

Evidence packets must preserve the path from reviewed content to an eventual teacher or publisher handoff without creating a live export workflow prematurely.

Required standing rules:

- The evidence handoff preview must carry unit-package readiness, payload validation, target-language audio coverage, assist-language script policy, and curated activity pathway evidence.
- Every handoff section must link back to a source review route and name what remains missing before export or signing.
- Assist-language evidence remains support-only and must never be interpreted as a progression, mastery, score, reward, or unlock authority.
- Package snapshots, authenticated reviewer identity, signed teacher release, retention policy, storage, export, publishing, and assignment activation remain blocked until their own gates close.
- The handoff packet is evidence, not a package writer, upload endpoint, release mutation, or Z.ai import channel.
- `npm run verify:package-readiness`, active route verification, typecheck, and production build must protect this lineage.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-560 and `docs/adr/0489-evidence-handoff-package-lineage.md`.

## 32. AI Service Boundary Standard

The AI service is a backend boundary, not a hidden provider shortcut. It must become reliable before live AI calls, premium billing, or generated package writes are considered.

Required standing rules:

- The service must validate tenant, source review status, target language, game mode, parent engine, vocabulary range, exactly two sentence structures, target-language audio, and media rights before any provider decision.
- The service must resolve game-mode, parent-engine, and level compatibility through the shared content-model catalog; provider-specific compatibility tables are not allowed.
- If an assist language is configured for an AI request, it must differ from the target language and remain comprehension support only; it cannot satisfy scoring, mastery, or progression.
- AI request readiness booleans must be accompanied by tenant-scoped evidence identifiers for source review, activity compatibility, target-language audio, media rights, and premium AI cost policy.
- AI audio readiness must name the covered language and match the configured target learning language; a generic “audio ready” flag is insufficient.
- Support-language policy must be explicit and permanently set `progressionAllowed: false` at this boundary.
- External AI request JSON is untrusted input. Malformed objects, scalar fields, arrays, and policy records must return deterministic validation errors instead of throwing or reaching a provider adapter.
- AI readiness and approval flags must be strict booleans; stringified truthy values cannot satisfy audio, rights, teacher-approval, or premium-cost gates.
- AI review-warning formatters must use the same strict boolean interpretation as the validator, so malformed direct callers cannot receive misleading approval or cost-readiness messages.
- The default service result is review-only and must have no side effects: no model call, provider billing, source write, package write, verifier submission, route write, playlist write, assignment activation, or support-language progression.
- Provider SDKs, storage vendors, web routes, student progression state, and Phaser/game view code must not become dependencies of the contract boundary.
- Premium AI cost policy and teacher approval are explicit evidence lanes, not implicit environment flags.
- Future hosted and local adapters must consume the same request/result contract and remain replaceable for white-label deployments.
- Downstream content-package runtime policy, persistence, release, student-use, and QR flags must also be validated as strict booleans before any future publisher or QR adapter interprets them.
- Persistence privacy, school-policy, and release flags must be strict booleans before hosted, local, or hybrid adapters interpret record requests.
- Teacher-report role, policy, persistence, export, release, and raw-media exclusion flags must be strict booleans before any report adapter interprets learner evidence.
- Assignment teacher, package, launch, link-policy, roster, persistence, reporting, audio, support-language, student-use, private-link, and write flags must be strict booleans before classroom adapters interpret assignment requests.
- Launch teacher, package, assignment, QR, fallback, school, roster, persistence, reporting, audio, support-language, learner-data, and student-launch flags must be strict booleans before QR or front-door adapters interpret launch requests.
- Asset storage, size-budget, target-mapping, release, learner-media, learner-upload, and student-facing-use flags must be strict booleans before an upload or media adapter interprets asset requests.
- Source upload, scan, lineage, rights, OCR, extraction, segmentation, schema, mapping, package, release, raw-source, draft, AI-extraction, and student-facing-use flags must be strict booleans before a source-ingestion adapter interprets PDF, DOCX, OCR, or AI extraction requests.
- Release source, asset, audio, pathway, package, teacher, school, persistence, rollback, QR-mutation, and student-activation flags must be strict booleans before a release adapter interprets approval, activation, or rollback requests.
- Recovery persistence, backup, checksum, encryption, access-control, retention, school-policy, report-integrity, rollback, release, raw-learner-media, and local-fallback flags must be strict booleans before a recovery adapter interprets backup, restore, export, or rollback requests.
- Progression policy, persistence, reporting, deterministic reward, and target-language evidence flags must be strict booleans before a progression adapter interprets mastery, score, unlock, or reward events.
- Reward mastery, provenance, policy, persistence, release, random-reward, gacha-pressure, purchase, and Spin Wheel flags must be strict booleans before a collection or reward adapter interprets ownership or ticket requests.
- Entitlement teacher, school, privacy, cost, persistence, release, level, usage-limit, and target-language-audio flags must be strict booleans before optional AI Tutor, microphone, media, assist-language, or package-tier adapters interpret feature requests.
- `npm run typecheck --workspace @living-textbook/ai-service` and `node scripts/verify-ai-service-boundary.mjs` must remain green before service implementation advances.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-561 and `docs/adr/0490-ai-service-boundary-foundation.md`.

## 33. Persistence Runtime Boundary Standard

Persistence plans and record schemas are not sufficient on their own. Every future hosted, local, or hybrid adapter must pass one shared runtime boundary before it can write or export anything.

Required standing rules:

- Every request is tenant-scoped and names an explicit record id, record category, operation, privacy flags, policy state, release state, and optional payload hash.
- Student-data records require school or tenant policy. Raw learner audio and transcripts are excluded from core persistence.
- Writes, deletes, and exports require release approval; the review-only adapter must produce no side effects.
- Hosted managed storage, local classroom storage, and hybrid sync are interchangeable implementation choices behind the same contract.
- Adapter selection, storage writes, report export, local sync, release mutation, and learner-data collection remain blocked until the corresponding policy and release gates close.
- `node scripts/verify-persistence-runtime.mjs`, typecheck, production build, and foundation verification must protect the runtime boundary.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-562 and `docs/adr/0491-persistence-runtime-boundary.md`.

## 34. Teacher Report Runtime Boundary Standard

Teacher report plans describe what a report could contain; they do not authorize a report export. Every future report provider must pass a shared runtime boundary before a teacher-facing file, event stream, or retained report can be produced.

Required standing rules:

- Runtime requests must match one tenant, one launch session, one approved format, and explicitly named report scopes.
- The event stream must validate against the shared progress-event taxonomy, including target-language-only progression and support-only media/audio effects.
- Core reports use pseudonymous learner slots only. Raw learner audio and transcripts are excluded from the core report contract.
- Teacher role verification, accepted school or tenant policy, persistence readiness, explicit export approval, and release approval are separate required gates.
- Review-only execution returns `sideEffect: "none"`; it cannot export, persist, mutate progression, or award rewards.
- Hosted managed, local classroom, and hybrid reporting providers must consume this contract rather than bypassing it through a route or UI component.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-563 and `docs/adr/0492-teacher-report-runtime-boundary.md`.

## 35. Asset And Media Runtime Boundary Standard

Upload readiness records and media manifests are not permission to move a file into a student-facing package. Every future asset, media, font, or source-document provider must pass a shared runtime boundary before intake, promotion, binding, export, or storage can occur.

Required standing rules:

- Every asset is tenant-scoped and carries an asset id, explicit kind, MIME type, positive size, checksum, and source lineage.
- Scan status, size-budget review, rights status, and source review are mandatory; unknown rights and rejected or unreviewed source records remain blocked.
- Unit/game mapping must be reviewed before promotion, binding, or export. Student-facing use requires approved source review and release approval.
- Learner-recorded media and learner uploads are excluded from the core asset runtime. They require a separate explicitly approved privacy and cost product boundary.
- Review-only execution returns `sideEffect: "none"`; it cannot upload, transcode, copy, activate, mutate QR/playlist/game manifests, or promote a file.
- Hosted, local, and hybrid asset providers must consume this contract rather than bypassing it through teacher UI routes.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-564 and `docs/adr/0493-asset-media-runtime-boundary.md`.

## 36. Content Package Runtime Boundary Standard

Content validation and readiness evidence do not authorize a package for student use. Every future package publisher, assignment service, QR activator, or local companion writer must pass one shared content-package runtime boundary first.

Required standing rules:

- Runtime requests must match one tenant, one package, and one declared target language.
- The package validator must pass before a package can be considered; every learner-facing vocabulary, sentence, instruction, feedback, and active-game cue must remain covered by target-language audio.
- Curated activity pathway review, storage policy, persistence readiness, teacher or tenant release approval, and approved content review are separate gates.
- Assist-language plans remain optional support. When student-visible, their script and review policy must pass; they can never unlock progression, mastery, rewards, or QR activation.
- Student-facing use and QR activation require approved content review, storage/persistence evidence, curated pathways, and release approval.
- Review-only execution returns `sideEffect: "none"`; it cannot write packages, activate assignments/routes/QRs/playlists, or mark content student-ready.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-565 and `docs/adr/0494-content-package-runtime-boundary.md`.

## 37. Classroom Launch Runtime Boundary Standard

QR routes, front-door pages, and assignment plans are not permission to open a live classroom session. Every future hosted, local, or hybrid launch provider must pass one shared launch runtime boundary first.

Required standing rules:

- Runtime requests must match one tenant, one package, one reviewed launch session, and one declared access mode.
- Teacher role, package runtime, assignment runtime, QR/front-door review, school policy, roster policy, persistence, reporting policy, and target-language audio are separate gates.
- Student launch requires an open session. Permanent QR launch additionally requires local fallback readiness; teacher QR and front-door access remain bound to their reviewed access policies.
- Support-language progress and media-only progress must remain disabled. Target-language engagement is the only progression authority.
- Real learner data cannot be collected until persistence and roster/identity policy are accepted.
- Review-only execution returns `sideEffect: "none"`; it cannot activate classrooms, collect learner data, mutate QR redirects, bind rosters, activate reports, progression, or rewards.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-566 and `docs/adr/0495-classroom-launch-runtime-boundary.md`.

## 38. Assignment Runtime Boundary Standard

An assignment plan or private URL is not permission to bind a roster or collect student progress. Every future assignment provider must pass a shared runtime boundary before assignment writes, private-link activation, or report-stream activation can occur.

Required standing rules:

- Runtime requests must match one tenant and one reviewed assignment plan.
- Teacher role, package runtime, classroom launch runtime, private-link policy, roster policy, persistence, reporting policy, and target-language audio are separate gates.
- Student-facing assignment use requires `ready-for-pilot` assignment readiness. Entry-code, user-code, stable-QR, and local-fallback rules must remain explicit.
- Support-language and media-only progress remain disabled; target-language engagement is the only learning trigger.
- Review-only execution returns `sideEffect: "none"`; it cannot write assignments, activate private links, bind rosters, activate progress streams, export reports, or launch classrooms.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-567 and `docs/adr/0496-assignment-runtime-boundary.md`.

## 39. Source Intake Runtime Boundary Standard

Source files are evidence for reviewed content, not student payloads. Every future PDF, DOCX, spreadsheet, manual, media, OCR, parser, or AI-assisted extraction provider must pass a shared source-intake runtime boundary.

Required standing rules:

- Every source is tenant-scoped, package-scoped, checksum-bound, and linked to an explicit extraction method.
- File policy, scan, source lineage, rights, OCR confidence, segmentation, schema, and target mapping are separate review gates.
- Raw PDFs and other source files cannot become student payloads. Unreviewed OCR, parser output, or AI extraction cannot become a teacher draft, route, game, playlist, or assignment.
- Teacher draft creation requires accepted extraction review, reviewed segmentation, schema review, and target mapping.
- Student-facing use additionally requires content-package runtime approval and teacher or tenant release approval.
- Review-only execution returns `sideEffect: "none"`; it cannot write/replace source files, promote extraction, create drafts, assign AI output, or activate student content.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-568 and `docs/adr/0497-source-intake-runtime-boundary.md`.

## 40. Release Runtime Boundary Standard

Review status is not release status. Every future hosted, local, or hybrid release provider must pass one shared release runtime boundary before package state, QR targets, assignments, or student-facing activation can change.

Required standing rules:

- Every release request is tenant-scoped, package-scoped, release-scoped, and explicit about current and requested state.
- Source extraction, asset rights, target-language audio, curated pathways, content-package runtime, and verifier evidence are required before approval.
- Approved or active state additionally requires teacher or tenant approval, school policy, persistence, and rollback readiness.
- Production QR mutation and student-facing activation require an explicit active-release request; neither may be inferred from a local route or preview.
- Rollback is a first-class reviewed state and cannot execute without rollback evidence.
- Review-only execution returns `sideEffect: "none"`; it cannot mutate release state, QR redirects, student-ready markers, assignments, or classroom launch.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-569 and `docs/adr/0498-release-runtime-boundary.md`.

## 41. Foundation Verification Composition Standard

The canonical foundation command must verify the whole provider-neutral boundary chain, not only the web application. A green web build is necessary but insufficient if the AI service, persistence runtime, or another backend contract has drifted out of verification.

Required standing rules:

- `verify:foundation` must include every focused runtime verifier for AI service, persistence, reports, assets/media, content packages, classroom launch, assignments, source intake, and release control.
- `verify:foundation` must typecheck the AI service and web workspace, run the production webpack build, and run active route verification.
- A composition verifier must fail when a required focused check or workspace check is removed from the canonical command.
- Focused verifiers remain independently runnable so a future agent can diagnose one boundary without weakening the complete gate.
- This composition check protects cost efficiency and white-label replaceability by detecting missing backend contract coverage before provider integration.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-570 and `docs/adr/0499-foundation-verification-composition.md`.

## 42. Recovery And Continuity Runtime Boundary Standard

Backup, restore, export, and rollback plans are not permission to move or recover learner data. Every hosted, local, or hybrid continuity provider must pass one shared recovery runtime boundary before it can create an archive, restore a package, copy media, recover learner records, or execute rollback.

Required standing rules:

- Every recovery request is tenant-scoped, package-scoped, and explicit about operation, mode, and requested state.
- Persistence, backup manifest, checksum, encryption, access control, retention, school policy, report integrity, rollback, and release evidence are separate gates.
- Raw learner audio and transcripts remain excluded from the core recovery contract unless a separate privacy and cost product boundary is approved.
- Non-hosted recovery requires reviewed local fallback evidence; restore and rollback require rollback readiness.
- Review-only execution returns `sideEffect: "none"`; it cannot create backups, restore records, export archives, copy packages/media, mutate QR/routes, or recover learner data.
- Hosted managed, local classroom, and hybrid continuity providers must consume this contract rather than bypassing it through a deployment or teacher route.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-571 and `docs/adr/0500-recovery-continuity-runtime-boundary.md`.

## 43. Progression Event Runtime Boundary Standard

The event taxonomy classifies learning evidence, but classification alone is not permission to change mastery or rewards. Every future progression, scoring, reward, or unlock provider must pass one shared runtime boundary around the reviewed progress-event envelope.

Required standing rules:

- Progression requests are tenant-scoped, package-scoped, session-scoped, and bound to the active taxonomy registry.
- Progress-affecting events require target-language evidence, accepted progression policy, persistence readiness, report-runtime readiness, and deterministic reward policy readiness.
- Support-only events, including assist-language audio, tap-to-speak, route guidance, and background media, cannot enter the progression authority.
- Report-only events cannot mutate mastery, scores, rewards, unlocks, or learner progress.
- Review-only execution returns `sideEffect: "none"`; it cannot mutate mastery, scores, Star Dust, rewards, unlocks, or persistence.
- Hosted, local, and hybrid progression providers must use the same event envelope and runtime contract.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-572 and `docs/adr/0501-progression-event-runtime-boundary.md`.

## 44. Reward And Collection Runtime Boundary Standard

Reward catalogs and collection previews do not authorize inventory writes or reward issuance. Every future reward, collection, avatar, cosmetic, pet-evolution, or Spin Wheel provider must pass one shared runtime boundary after progression evidence is accepted.

Required standing rules:

- Rewards are tenant-scoped, package-scoped, pseudonymous-learner-scoped, and linked to a source event and deterministic rule.
- Ownership provenance, earned mastery evidence, reward policy, persistence, and release approval are separate gates.
- Random rewards, generated gacha, purchase-required unlocks, and reward-driven progression bypasses remain blocked.
- Spin Wheel ticket issuance remains separately policy-gated and cannot be inferred from a generic reward request.
- Review-only execution returns `sideEffect: "none"`; it cannot write collection inventory, mutate ownership, issue tickets, or bypass mastery.
- Hosted, local, and hybrid reward providers must use the same contract and must not let a game view write the collection directly.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-573 and `docs/adr/0502-reward-collection-runtime-boundary.md`.

## 45. Feature Entitlement Runtime Boundary Standard

Tenant feature configuration and package catalogs do not authorize a premium, privacy-sensitive, or cost-bearing capability. Every future entitlement provider must pass one shared runtime boundary before AI Tutor, microphone practice, assist-language packages, background media, local companion, reports, or assignments can become student-facing.

Required standing rules:

- Entitlement requests are tenant-scoped, package-scoped, feature-scoped, and explicit about the requested state.
- Teacher approval, school policy, privacy policy, cost policy, persistence, release approval, allowed levels, usage limits, and target-language audio are separate gates.
- AI Tutor requires a premium or enterprise entitlement and remains optional; core student progression cannot depend on it.
- Microphone practice requires explicit teacher/school approval and privacy/cost controls; it cannot activate from a student route alone.
- Review-only execution returns `sideEffect: "none"`; it cannot activate entitlements, bill providers, activate recording, dispatch AI Tutor, unlock student features, or mutate persistence/release state.
- Hosted, local, and hybrid entitlement providers must use the same contract and remain replaceable for white-label tenants.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-574 and `docs/adr/0503-feature-entitlement-runtime-boundary.md`.

## 46. Runtime Behavior Verification Standard

Source markers and focused contract checks are useful coverage, but they are not enough to prove that safety decisions behave correctly. The foundation must execute representative negative cases against the compiled shared runtime contracts.

Required standing rules:

- The behavior harness must exercise support-only progression rejection, random/gacha reward rejection, unsafe recovery rejection, and invalid premium entitlement rejection.
- The harness must verify review-only results return `sideEffect: "none"`.
- The harness must compile the shared TypeScript contracts rather than duplicating their logic in JavaScript.
- Behavior verification remains deterministic, local, provider-neutral, and safe to run in CI or a partner review environment.
- A green web build without runtime behavior verification is not a complete foundation result.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-575 and `docs/adr/0504-runtime-behavior-verification.md`.

## 47. Ingestion, Asset, And Release Behavior Verification Standard

The multimedia and textbook-ingestion foundation is a high-risk boundary because source files, images, audio, video, fonts, and release metadata can eventually become student-facing content. Static readiness markers are not enough to prove that these boundaries reject unsafe promotion.

Required standing rules:

- The behavior harness must exercise learner-media exclusion at the asset boundary, raw-source-as-student-payload rejection at the source boundary, and a fully satisfied release candidate path at the release boundary.
- Asset, source, and release review-only adapters must return `sideEffect: "none"`; they cannot upload, promote, publish, mutate QR routes, create playlists, activate assignments, or mark content student-ready.
- A successful release decision in the harness proves only that the typed evidence is complete; it does not activate a live provider or bypass the review-only adapter.
- The harness must compile the actual shared contracts and remain deterministic, local, provider-neutral, and safe for CI and partner review.
- No upload button, storage provider, PDF extraction path, media promotion path, or release writer may be treated as production-ready until both static readiness and compiled behavior verification remain green.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-576 and `docs/adr/0505-ingestion-asset-release-behavior-verification.md`.

## 48. Classroom Doorway Behavior Verification Standard

The teacher QR/front-door journey is the platform's most important cross-boundary path: it connects reviewed content packages to assignments, sessions, student identity, audio, progression, and teacher reporting. The foundation must prove that these contracts preserve tenant isolation and learning authority before any live classroom provider exists.

Required standing rules:

- The behavior harness must reject package tenant mismatch and keep package review-only execution side-effect free.
- QR launch validation must reject any request that allows support language or media-only evidence to count as progress.
- Assignment validation must enforce the same target-language authority boundary; private-link or assignment readiness cannot grant support-language progression.
- Launch and assignment review-only adapters must return `sideEffect: "none"`; they cannot activate sessions, bind rosters, write assignments, mutate QR routes, start report streams, or award progress.
- The teacher QR/front-door contract remains compatible with hosted, local, and hybrid deployment options without selecting a provider.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-577 and `docs/adr/0506-classroom-doorway-behavior-verification.md`.

## 49. Persistence And Teacher Report Behavior Verification Standard

Persistence and reporting are separate product boundaries. A route can display a report preview without proving that a future provider will protect student data, exclude raw microphone material, or prevent an unapproved export.

Required standing rules:

- The behavior harness must reject raw learner audio from core persistence and teacher reports.
- Teacher report behavior must reject real or mixed learner identifiers when the core contract is pseudonymous-slot-only.
- Persistence mutations and report exports require their own policy, release, persistence, and approval evidence; a preview route cannot satisfy those gates.
- Review-only persistence and report adapters must return `sideEffect: "none"`; they cannot write, export, promote identities, store raw audio, store transcripts, or mutate progression.
- Hosted, local, and hybrid providers must consume the same privacy boundary without introducing provider-specific exceptions.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-578 and `docs/adr/0507-persistence-report-behavior-verification.md`.

## 50. AI Authoring Behavior Verification Standard

The AI authoring service is a content-drafting boundary, not a direct publishing or game-generation shortcut. Its pedagogical locks and provider controls must be executable before any future model provider or outside prototype is considered for integration.

Required standing rules:

- The compiled behavior harness must reject vocabulary payloads outside the 8–12 range and sentence payloads other than exactly two target structures.
- Generation review must reject requests without target-language audio evidence and media-rights evidence.
- AI authoring remains review-only: provider dispatch, provider billing, source writes, package writes, verifier submission, route/playlist writes, assignment activation, and support-language progression remain blocked.
- Assist language is optional support and cannot repair a failed target-language or pedagogical gate.
- The AI service contract must remain provider-neutral so hosted, local, tenant-selected, or future premium providers cannot bypass the same locks.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-579 and `docs/adr/0508-ai-authoring-behavior-verification.md`.

## 51. Assist-Language Script Behavior Verification Standard

Assist language must remain genuinely supportive and level-appropriate. Japanese is the first reviewed assist-language package, so its script rules must be enforced in the shared content model rather than left to teacher UI or generated text.

Required standing rules:

- Foundation, Bronze, and Plus Japanese assist plans must use `hiragana-only` when student-visible.
- Hiragana-only plans must reject katakana and kanji in vocabulary, sentence, and instruction glosses.
- Silver-or-later Japanese plans may use mixed script only with `reviewed-mixed-script` or `tenant-defined` policy and the required review status.
- Student-visible Japanese plans must declare a script policy; teacher-only plans remain exempt from student rendering rules.
- Assist-language validation never grants progression, mastery, rewards, or unlocks; target-language evidence remains authoritative.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-580 and `docs/adr/0509-assist-language-script-behavior-verification.md`.

## 52. Premium And Microphone Entitlement Behavior Verification Standard

Premium AI Tutor and microphone practice are optional commercial capabilities, not foundation assumptions. Their entitlement records must prove cost, privacy, policy, usage, and teacher controls before any provider can be activated.

Required standing rules:

- Core-tier AI Tutor activation remains rejected; premium or enterprise tier is required.
- Microphone practice remains disabled in the review-only foundation mode, even when a premium package is selected.
- Enabled premium requests require teacher approval, school policy, privacy policy, cost policy, persistence, release approval, declared levels, usage limits, and target-language audio readiness.
- A validated premium request is evidence that the contract is complete, not permission for a student route to dispatch a provider.
- Review-only entitlement execution returns `sideEffect: "none"`; it cannot bill, record, dispatch AI Tutor, unlock a student feature, or mutate persistence/release state.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-581 and `docs/adr/0510-premium-microphone-entitlement-behavior-verification.md`.

## 53. Continuity And Deployment Behavior Verification Standard

Hosted, local-classroom, and hybrid deployment options must share one continuity contract. A local or hybrid promise is not complete until fallback, recovery, privacy, checksum, rollback, and retention evidence is reviewed.

Required standing rules:

- Non-hosted recovery requests require explicit local fallback review.
- Hosted-managed recovery may validate without local fallback evidence, but it still requires persistence, backup, checksum, encryption, access, retention, school policy, report integrity, rollback, release, and learner-media exclusion gates.
- Restore execution requires rollback readiness; rollback execution requires an explicit executing recovery request.
- Review-only recovery execution returns `sideEffect: "none"`; it cannot create backups, restore data, export archives, copy packages/media, mutate QR/routes, recover learner data, or execute rollback.
- Deployment mode is a policy and evidence choice, not a provider shortcut; white-label tenants can adopt hosted, local, or hybrid later without changing the shared contract.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-582 and `docs/adr/0511-continuity-deployment-behavior-verification.md`.

## 54. Deterministic Progression And Star Dust Behavior Verification Standard

Progression is the core engagement loop, so its first behavior contract must be predictable, mastery-linked, and independent of random reward generation.

Required standing rules:

- A new student session starts at `entry-practice` with only the entry game mode unlocked.
- Completing entry practice moves the student to `recommended-game`, records the entry mode as completed, and unlocks only the reviewed recommended modes for that launch session.
- Support-language audio, route guidance, background media, and other support-only events cannot complete entry practice or unlock a game.
- Star Dust calculations must be deterministic for identical inputs, bounded to the defined vocabulary, syntax, and bonus capacities, and capped at 1,000 per unit.
- Progression and scoring behavior must not call a random source, provider, storage adapter, or reward inventory writer.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-583 and `docs/adr/0512-deterministic-progression-stardust-behavior-verification.md`.

## 55. Audio-First Package Behavior Verification Standard

Audio is part of the learner-facing content contract, not a later game enhancement. Every unit package must declare how its target-language vocabulary, sentence, instruction, feedback, and game-mode cues are supported before the package can be treated as ready for student use.

Required standing rules:

- Every learner-facing unit must include an audio support plan with a declared target language.
- Required plans must cover every vocabulary term and every target sentence; referenced instruction, feedback, and game-mode cues must also resolve to existing audio cues.
- Package validation must reject any referenced cue whose language does not match the plan target language.
- Runtime validation must reject any plan whose declared language does not match the package runtime target language.
- Support-language audio may assist comprehension, but it cannot satisfy target-language audio readiness, progression, mastery, scoring, unlock, or release authority.
- Audio validation remains provider-neutral: it may describe recorded, teacher-recorded, partner-provided, or text-to-speech assets without dispatching a provider, writing storage, recording a learner, or mutating a route.
- Review-only package validation and runtime adapters remain side-effect free.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-584 and `docs/adr/0513-audio-first-package-behavior-verification.md`.

## 56. Audio Cue Semantic Coverage Standard

Audio readiness is semantic coverage, not merely a file count. A unit's vocabulary and sentence arrays must reference cues of the correct kind so every game engine receives the intended learner-facing evidence.

Required standing rules:

- Vocabulary coverage arrays must reference `term` cues.
- Sentence coverage arrays must reference `sentence` cues.
- Instruction, feedback, and game-mode arrays may reference their appropriate support cues but cannot substitute for required vocabulary or sentence coverage.
- Wrong cue kinds must fail package validation before review, release, assignment, or student use.
- The semantic check remains tenant-neutral, target-language-aware, and side-effect free.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-585 and `docs/adr/0514-audio-cue-semantic-coverage.md`.

## 57. Pedagogical Text Integrity Standard

Vocabulary and target sentence counts are necessary but not sufficient. A unit with blank or duplicated terms can pass a superficial schema check and still produce unusable cards, audio mappings, game rounds, or teacher reports.

Required standing rules:

- Vocabulary terms must be non-empty after trimming.
- Vocabulary terms must be unique case-insensitively after trimming.
- Both target sentence structures must be non-empty after trimming.
- The shared content model and the AI authoring request boundary must apply the same text-integrity rules before review or generation evidence is accepted.
- These checks do not change the canonical 8-12 term range or exactly-two-sentence rule.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-586 and `docs/adr/0515-pedagogical-text-integrity.md`.

## 58. Unit Metadata And Teacher Launch Integrity Standard

The unit payload is the contract shared by imported textbooks, tenant authoring, AI drafts, game engines, audio packages, and teacher launch surfaces. Valid vocabulary cannot compensate for an unusable unit identity or missing teacher guidance.

Required standing rules:

- Unit level must be an integer from 1 through 8; module and unit numbers must be positive integers.
- Theme, game mode, game family, and parent engine identifiers must be present before a unit can enter review.
- Visual rules must identify an avatar family and character focus, with the existing blacklist gate still required.
- Teacher launch protocol must include non-empty hook, activity, and review copy.
- These checks are structural and provider-neutral; they do not choose a game implementation, provider, visual theme, or tenant mascot.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-587 and `docs/adr/0516-unit-metadata-teacher-launch-integrity.md`.

## 59. Content Package Metadata Integrity Standard

Package metadata is evidence used by review, release, persistence, backup, report, and tenant workflows. A malformed timestamp makes that evidence unreliable even when the unit payload is otherwise valid.

Required standing rules:

- Every content package must carry a valid creation timestamp.
- An optional update timestamp must be valid and must not precede creation.
- Metadata validation runs before package review, release, QR activation, persistence, backup, report export, or student-facing use.
- Timestamp validation is provider-neutral and does not activate storage, release, or route behavior.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-588 and `docs/adr/0517-content-package-metadata-integrity.md`.

## 60. Audio Cue Identity Integrity Standard

Audio cue IDs are package references used by flashcards, games, teacher previews, reports, and future provider adapters. Duplicate IDs create ambiguous resolution and can silently attach the wrong audio to a learner-facing control.

Required standing rules:

- Every audio cue ID must be unique within a content package.
- Duplicate IDs must be rejected before audio plans, review, release, routing, or student use can resolve them.
- Tenant, unit, language, text, and source checks remain independent of the identity check.
- Validation remains provider-neutral and side-effect free.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-589 and `docs/adr/0518-audio-cue-identity-integrity.md`.

## 61. Media Asset Metadata Integrity Standard

Images, audio, video, posters, transcripts, and background media are all package assets. Before real upload providers exist, their metadata must still be reliable enough for tenant review, rights review, playlists, labelled diagrams, game mapping, and future local bundles.

Required standing rules:

- Every media asset must have a non-empty identifier and title.
- Media asset kind and type must remain compatible.
- Optional duration must be finite and non-negative.
- Tenant, unit, rights, source, scan, checksum, and release gates remain separate and must still be satisfied before live use.
- Metadata validation does not upload, transcode, store, publish, assign, or expose a learner asset.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-590 and `docs/adr/0519-media-asset-metadata-integrity.md`.

## 62. Approved Package Rights And Placeholder Safety Standard

Draft and reviewed packages may display incomplete rights or placeholder media as repair evidence. An approved package is different: it represents a candidate for student-facing release and must not hide unresolved media rights or placeholder learner audio.

Required standing rules:

- Approved packages must not contain media assets with unknown rights.
- Approved packages must not contain placeholder audio cues.
- Draft and reviewed packages may retain these records only as visible review blockers; they cannot be treated as student-ready.
- Release, storage, upload, provider, QR, and assignment gates remain separate and continue to apply.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-591 and `docs/adr/0520-approved-package-rights-placeholder-safety.md`.

## 63. Playlist And Multimedia Relation Integrity Standard

Playlists and optional game-background plans are package structure, not decorative metadata. They must describe a usable and unambiguous media pathway before a package can be treated as release evidence.

Required standing rules:

- Playlist identifiers and titles must be present.
- Every playlist must contain at least one media asset.
- A playlist must not repeat a media asset ID.
- A content package may contain at most one multimedia plan for a unit.
- Background media cannot be enabled by default without a declared background asset.
- Storage, upload, playback, release, QR, offline, and student-use gates remain separate.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-592 and `docs/adr/0521-playlist-multimedia-relation-integrity.md`.

## 64. Approved Media Provenance And Locator Standard

An approved media record must be usable by a permitted delivery mode and traceable to its owner. The content model remains provider-neutral: a hosted source, a local bundle path, or both may satisfy the locator requirement.

Required standing rules:

- Approved media assets must identify an owner.
- Approved media assets must provide at least one non-empty hosted or local locator.
- Unknown rights remain blocked from approved packages.
- Hosted, local, and hybrid deployment decisions remain separate from package validation.
- Upload, storage, checksum, scan, release, QR, and student-use gates remain separate.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-593 and `docs/adr/0522-approved-media-provenance-and-locators.md`.

## 65. Approved Video Accessibility Evidence Standard

Video is optional enrichment, but an approved video still needs a safe learner-facing presentation path. A poster gives the player a stable visual fallback, while a transcript or caption reference supports access when sound is unavailable or reading support is needed.

Required standing rules:

- Approved video assets must include a poster reference.
- Approved video assets must include a transcript or caption reference.
- Draft and reviewed videos may remain incomplete as visible repair blockers.
- Video playback remains optional and cannot replace learner-critical target-language audio.
- Upload, storage, scan, rights, release, and student-use gates remain separate.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-594 and `docs/adr/0523-approved-video-accessibility-evidence.md`.

## 66. Audio Cue Media Binding Standard

An audio cue may use a concrete media asset, a reviewed voice source, or a permitted fallback. When it declares a media-asset reference, that reference must be real, audio-compatible, and within the same tenant and unit boundary.

Required standing rules:

- Referenced audio media assets must exist in the same content package.
- An audio cue must reference an audio asset, never a video asset.
- Cue and asset tenant boundaries must match.
- Cue and asset unit boundaries must match when both are unit-scoped.
- Text-to-speech and fallback-voice plans may remain provider-neutral and do not require a media asset ID.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-595 and `docs/adr/0524-audio-cue-media-binding-integrity.md`.

## 67. Recorded Audio Delivery Locator Standard

Audio coverage is only meaningful when a non-generated recording has a concrete route to delivery. Recorded, teacher-recorded, and partner-provided cues must therefore identify either a package media asset or a direct hosted/local locator. Text-to-speech and reviewed fallback-voice cues remain provider-neutral.

Required standing rules:

- Recorded, teacher-recorded, and partner-provided cues require a media asset ID, hosted source URI, or local bundle path.
- Placeholder cues remain repair evidence only and are blocked from approved packages.
- Text-to-speech cues may use the unit fallback voice without a media asset ID.
- Learner-critical audio remains separate from optional music and video.
- Upload, storage, provider billing, release, and student-use gates remain separate.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-596 and `docs/adr/0525-recorded-audio-delivery-locators.md`.

## 68. Audio Coverage Uniqueness Standard

Coverage must be checked against every canonical vocabulary term and target sentence, not inferred from cue counts. Alternate recordings with distinct IDs are permitted, but cannot substitute for missing text. A covering cue must match the lane kind, tenant, unit, and target language. See DR-602.

Audio support plans must represent real coverage, not inflated counts. The same cue may be intentionally reused across a unit’s general coverage and a game mode, but it must not appear twice inside one coverage group.

Required standing rules:

- Vocabulary, sentence, instruction, and feedback coverage arrays must not repeat a cue ID.
- Each game-mode coverage array must not repeat a cue ID.
- Reuse of a cue across separate coverage groups is allowed when it is pedagogically intentional.
- Duplicate package cue IDs remain invalid independently of plan coverage.
- Coverage validation remains side-effect free and does not select audio providers.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-597 and `docs/adr/0526-audio-coverage-uniqueness.md`.

## 69. Audio Cue Instruction And Feedback Coverage Standard

Audio support plans describe more than a list of playable files. Each coverage lane carries meaning for the game engine and teacher review, so instruction and feedback lanes must use cues with the corresponding semantic kind.

Required standing rules:

- Vocabulary coverage uses `term` cues.
- Sentence coverage uses `sentence` cues.
- Instruction coverage uses `instruction` cues.
- Feedback coverage uses `feedback` cues.
- Game-mode arrays may combine relevant cue kinds, but all referenced cues must exist and match the target language.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-598 and `docs/adr/0527-audio-cue-semantic-coverage.md`.

## 70. Audio Cue Canonical Text And Unit Binding Standard

Audio coverage must point to the actual language content of the unit, not merely to a cue with a plausible kind. This prevents a playable recording from silently teaching a different word or sentence, and prevents one unit from borrowing another unit's learner-facing cue.

Required standing rules:

- Vocabulary cue text must match a canonical vocabulary term after whitespace and case normalization.
- Sentence cue text must match a canonical target sentence after whitespace and case normalization.
- Every cue referenced by a unit audio plan must be explicitly bound to that same unit.
- Instruction and feedback cues remain semantically typed and unit-bound, even when their exact copy is authored outside the canonical vocabulary/sentence arrays.
- Mismatch evidence remains a review blocker and does not trigger provider lookup, storage, or student progression.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-599 and `docs/adr/0528-audio-cue-canonical-text-and-unit-binding.md`.

## 71. Game-Mode Audio Coverage Standard

Game-mode audio arrays are the bridge between content packages and parent engines. They may reuse a unit's learner-facing cues across curated activities, but they must not accept arbitrary UI or story cues as gameplay evidence, or silently disagree with a cue's declared mode.

Required standing rules:

- Game-mode coverage keys must use one of the supported curated game modes.
- Game-mode arrays may use term, sentence, instruction, and feedback cues.
- UI-label and story-line cues remain outside gameplay coverage and must not satisfy a game audio lane.
- When a cue declares a game mode, that declaration must match the coverage lane using it.
- Cross-mode reuse remains allowed when the cue has no conflicting mode declaration.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-600 and `docs/adr/0529-game-mode-audio-coverage.md`.

## 72. Background Media Mode Policy Standard

Background music and video are optional support layers, not progression systems. Their allowed-mode policy must therefore resolve to the same curated game-mode catalog used by the platform and must not contain ambiguous duplicate entries.

Required standing rules:

- Allowed background game modes must use supported curated mode IDs.
- Each allowed background game mode may appear only once per multimedia plan.
- Missing or invalid background mode policy remains a review blocker, not an automatic playback decision.
- Background media remains subordinate to learning audio, instructions, feedback, and scoring.
- Mode policy validation does not enable autoplay, change volume, or persist teacher settings.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-601 and `docs/adr/0530-background-media-mode-policy.md`.

## 73. Playlist Role And Playback Context Standard

Playlist metadata determines where media can appear. A playlist assigned to game-background playback must identify itself as background media so teacher review, future engine adapters, and local bundles cannot interpret primary learning media as ambient support.

Required standing rules:

- A playlist with `game-background` playback context must use the `background` usage role.
- Playlist role and context remain separate from media rights, teacher enablement, and audio-priority checks.
- Context validation does not start playback, change volume, or create progress events.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-603 and `docs/adr/0531-playlist-role-playback-context.md`.

## 74. Media And Audio Enum Integrity Standard

Imported packages are runtime data. Media and audio fields therefore need explicit value checks before tenant review can treat them as meaningful.

Required standing rules:

- Media asset types, kinds, and rights statuses must use the supported catalog values.
- Audio cue kinds and sources must use the supported catalog values.
- Playlist usage roles and playback contexts must use the supported catalog values.
- Invalid values remain review blockers and cannot be interpreted by game, media, local-bundle, or reporting adapters.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-604 and `docs/adr/0532-media-audio-enum-integrity.md`.

## 75. Unit Metadata Catalog Integrity Standard

Unit metadata is the routing contract between reviewed content and a parent game engine. Runtime imports must therefore use identifiers from the shared curated catalog before a unit can be interpreted by pathways, reports, or future adapters.

Required standing rules:

- Unit game modes must be supported curated `GameModeId` values.
- Unit game families must be supported `GameFamily` values.
- Unit parent engines must be supported `ParentEngine` values.
- Unknown identifiers remain review blockers and must not be silently mapped to a nearest mode or engine.
- Adding a new mode, family, or engine requires an explicit catalog update, compatibility review, and regression coverage.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-605 and `docs/adr/0533-unit-metadata-enum-integrity.md`.

## 76. Unit Mode Compatibility Standard

Supported identifiers are necessary but not sufficient. A unit's selected mode must remain aligned with its game family, parent engine, and curriculum level before the pathway can be considered review-ready.

Required standing rules:

- Each curated game mode has one declared game family and one parent engine.
- Each curated game mode has an explicit supported-level range.
- A unit with a mismatched family, parent engine, or level remains blocked from review and release.
- Compatibility is validated from the shared content-model contract; consumers must not silently infer or repair mismatches.
- Changing a mode's family, engine, or level range requires compatibility, route, audio, scoring, and regression review.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-606 and `docs/adr/0534-unit-mode-compatibility.md`.

## 77. Cross-Catalog Game Contract Standard

The shared content model and web catalog must describe the same curated game contract. A mode is not foundation-ready if one layer advertises a different family, parent engine, or supported level range.

Required standing rules:

- The game-mode verification gate compares content-model and web-catalog entries for every supported mode.
- Missing, extra, or duplicate compatibility entries fail verification.
- Family, parent engine, and supported-level drift fails verification before build or release review.
- A new mode must update the shared contract and web catalog together, with route, scoring, audio, and replay evidence.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-607 and `docs/adr/0535-cross-catalog-game-contract.md`.

## 78. Game Catalog Pedagogical Contract Standard

Every curated game mode must carry usable pedagogical bounds, not just a name and route. The catalog is the contract that lets the same unit payload serve multiple reviewed pathways safely.

Required standing rules:

- Each mode must identify itself with the same ID as its catalog key.
- Each mode requires exactly two target sentence structures.
- Each mode's recommended term range must be ordered and remain within the canonical 1–12 structural bound.
- Each mode must expose a non-empty, unique, ascending supported-level list within Levels 1–8.
- Mode-specific ranges may be narrower than the canonical unit range when the activity needs fewer active items, but the exception must remain explicit in the catalog.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-608 and `docs/adr/0536-game-catalog-pedagogical-contract.md`.

## 79. Background Media Mode Capability Standard

Background media permission is a mode capability, not merely a teacher preference. A multimedia plan may name only modes whose curated contract explicitly allows optional ambient media.

Required standing rules:

- The shared game-mode contract records whether each mode allows background media.
- Multimedia plans must reject background media for modes without that capability.
- The web catalog and content model must agree on the capability flag.
- Learning audio, instruction, feedback, scoring, and progression remain higher priority even when a mode allows background media.
- Capability validation does not enable playback, autoplay, volume changes, persistence, or progress credit.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-609 and `docs/adr/0537-background-media-mode-capability.md`.

## 80. Game Catalog Learner-Facing Metadata Standard

Catalog metadata is part of the learner and teacher experience. A route can be technically available yet still be unusable if its role, skill focus, or explanation is missing or invalid.

Required standing rules:

- Every mode must declare one supported learner role: entry practice, reinforcement, assessment, or review.
- Every mode must declare one supported skill focus.
- Every mode must carry a non-empty summary suitable for teacher and student pathway review.
- Background-media capability must be explicit rather than inferred from a missing field.
- Metadata validation remains separate from visual branding and does not enable gameplay or progression.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-610 and `docs/adr/0538-game-catalog-learner-metadata.md`.

## 81. Scoring Profile Compatibility Standard

Scoring profiles are behavioral contracts, not interchangeable reward labels. Every curated mode must use a profile whose declared engine, learner role, and skill focus match the mode catalog.

Required standing rules:

- Every scoring profile must explicitly declare its supported parent engine set.
- Every scoring profile must explicitly declare its supported learner-role set and skill-focus set.
- Every catalog mode must reference an existing profile whose compatibility declarations include the mode's engine, role, and skill focus.
- Changing a mode's engine, role, skill focus, or scoring profile requires scoring replay and catalog verification.
- Profile compatibility validation does not award dust, unlock progression, write inventory, or enable a game provider.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-611 and `docs/adr/0539-scoring-profile-compatibility.md`.

## 82. Deterministic Scoring Math Standard

Scoring profiles must be mathematically bounded before they can guide a game or a future progression adapter. A compatible profile is still unsafe if its component awards, cap, or accuracy helper can produce unexplained values.

Required standing rules:

- Vocabulary, syntax, bonus, and completion-cap values must be non-negative integers.
- A profile completion cap must equal the sum of its vocabulary, syntax, and bonus components.
- A profile completion cap must not exceed the canonical 1,000 Star Dust unit ceiling.
- Accuracy-derived awards must be clamped to the selected profile's completion cap, including when a caller supplies a minimum award.
- Verification and scoring helpers do not persist dust, unlock progression, or write inventory.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-612 and `docs/adr/0540-deterministic-scoring-math.md`.

## 83. Progression Award Normalization Standard

Scoring math must remain bounded at the event and progression boundary, not only inside individual game profiles. Every adapter must normalize malformed award inputs before they reach a completion event or learner state.

Required standing rules:

- Negative, fractional, and non-finite mastery inputs normalize to safe deterministic values before Star Dust calculation.
- Star Dust calculation remains bounded to the vocabulary, syntax, and bonus lanes and therefore to 1,000 per unit.
- Local completion adapters must accept only non-negative integer awards up to 1,000 per completed mode event.
- Completion-event metadata and progression state must use the same normalized award value.
- Normalization does not authorize persistence, reporting, inventory, unlock, or provider writes.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-613 and `docs/adr/0541-progression-award-normalization.md`.

## 84. Reserved Completion Metadata Standard

Completion-event metadata may be extended by a game adapter, but core scoring fields remain platform-owned. Optional metadata must never overwrite the normalized award that the progression adapter applies to learner state.

Required standing rules:

- Completion adapters merge optional metadata before writing reserved `earnedStarDust` metadata.
- The `earnedStarDust` event value must equal the normalized value returned to progression state.
- Game-specific metadata may explain scoring but cannot redefine the authoritative award.
- Reserved-field protection does not create persistence, reporting, inventory, or unlock side effects.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-614 and `docs/adr/0542-reserved-completion-metadata.md`.

## 85. Progress Event Timestamp Standard

Progress events are the future evidence stream for reports, replay, mastery, and persistence. Their timestamps must therefore be unambiguous across hosted, local, and hybrid deployments.

Required standing rules:

- Every progress-event envelope must use a parseable ISO/RFC3339 `occurred_at` value.
- Every timestamp must include an explicit UTC marker or numeric timezone offset.
- Date-only strings, locale-formatted strings, and invalid dates remain review blockers.
- Timestamp validation is evidence validation only; it does not accept events for progression or enable storage.

## 86. Progress Event Mode Identity Standard

Progress evidence must identify a real curated game mode so catalog, engine, scoring, audio, and reporting contracts remain aligned.

Required standing rules:

- Every event envelope uses a supported shared `GameModeId`.
- Telemetry reuses the content-model catalog helper; it does not maintain a second allowlist.
- Unknown or retired mode IDs block review until the catalog and dependent contracts are updated together.
- This guard is verification-only and does not enable gameplay, scoring, persistence, or provider writes.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-616 and `docs/adr/0544-progress-event-mode-identity.md`.

## 87. Progress Event Unit Identity Standard

Progress evidence must remain traceable to one canonical white-label content unit so teacher reports, replay, migration, and hosted/local reconciliation cannot drift.

Required standing rules:

- Every event envelope uses the shared `tenantId:curriculumId:L[level]:U[unit]` key format.
- Levels remain within 1 through 8 and unit numbers remain positive integers.
- Tenant and curriculum segments are non-empty and cannot contain the structural separator or whitespace.
- This guard is verification-only and does not enable gameplay, scoring, persistence, or provider writes.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-617 and `docs/adr/0545-progress-event-unit-identity.md`.

## 88. Progress Event Mode-Level Compatibility Standard

Event identity is not complete if the named mode is impossible for the unit level. Event envelopes must agree with the same curated mode contract that validates unit payloads and activity pathways.

Required standing rules:

- The level is read from the canonical unit key and compared with the shared mode contract.
- A supported mode at another level blocks review for that event envelope.
- Mode-level validation reuses the shared content-model catalog rather than a telemetry-specific matrix.
- This guard is verification-only and does not enable gameplay, scoring, persistence, or provider writes.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-618 and `docs/adr/0546-progress-event-mode-level-compatibility.md`.

## 89. Progress Event Type Identity Standard

Runtime JSON must not invent a new evidence event by supplying an arbitrary event type. Every event must belong to the reviewed taxonomy before it can be enveloped or reported.

Required standing rules:

- Support-only, report-only, and progress-affecting event sets are the runtime event identity source.
- Unknown event types block review even when a registry entry supplies an effect label.
- Adding an event requires coordinated type, taxonomy, teacher-visibility, persistence, and runtime verification updates.
- This guard is verification-only and does not enable gameplay, scoring, persistence, or provider writes.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-619 and `docs/adr/0547-progress-event-type-identity.md`.

## 90. Progress Event Stream Context Standard

Individual event validity does not guarantee stream validity. Reports and persistence batches must remain within one content unit and launch context while allowing multiple curated modes and learner sessions inside that classroom launch.

Required standing rules:

- A stream may contain multiple modes for one unit, but cannot mix unit keys.
- Present launch codes must refer to one launch session.
- Student session IDs may vary within a launch-scoped teacher report because one class report can contain multiple learners.
- This guard is verification-only and does not enable gameplay, scoring, persistence, or provider writes.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-620 and `docs/adr/0548-progress-event-stream-context.md`.

## 91. Progress Event Acceptance Gate Consistency Standard

An event-acceptance gate binds evidence to the reviewed session and policy boundary. A stream that mixes gate IDs cannot safely be treated as one report or persistence batch, even when its unit and launch match.

Required standing rules:

- All envelopes in one stream use one `event_acceptance_gate_id`.
- Multiple learner sessions and game modes remain allowed when they belong to the same unit, launch, and acceptance gate.
- This guard is verification-only and does not enable gameplay, scoring, persistence, or provider writes.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-621 and `docs/adr/0549-progress-event-acceptance-gate-consistency.md`.

## 92. Progress Event Contract Revision Consistency Standard

- One progress-event stream uses one taxonomy revision and one settings contract revision.
- Curated game modes may retain different settings profiles and teacher snapshots within that shared contract.
- Mixed taxonomy or settings contract revisions block review; this remains a no-side-effect verification gate.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-622 and `docs/adr/0550-progress-event-contract-revision-consistency.md`.

## 93. Teacher Report Launch Binding Standard

- Teacher report evidence must include a launch code on every event envelope.
- Every event launch code must match the report request launch code.
- The report boundary may be stricter than reusable pre-launch stream review, and remains a no-side-effect verification gate.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-623 and `docs/adr/0551-teacher-report-event-launch-binding.md`.

## 94. Teacher Report Tenant Binding Standard

- Teacher report evidence must resolve to the requested white-label tenant through its canonical unit key.
- Cross-tenant evidence blocks report review even if launch and event fields are otherwise valid.
- The tenant check is a no-side-effect verification gate.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-624 and `docs/adr/0552-teacher-report-tenant-binding.md`.

## 95. Persistence Tenant-Boundary Preservation Standard

- Progress-event and teacher-report storage contracts must explicitly preserve tenant-boundary evidence.
- Hosted and local adapter plans must carry the same guarantee.
- Storage contracts cannot weaken the white-label isolation already enforced at report review.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-625 and `docs/adr/0553-persistence-tenant-boundary-preservation.md`.

## 96. Prototype Integration Gate Tenant Boundary Standard

- AI prototype integration-readiness gate and Codex integration-review decision records must preserve the tenant boundary.
- Hosted and local readiness-gate and Codex-decision write intents must preserve the same boundary.
- Every tenant-scoped persistence contract must name the concrete `tenantBoundaryKey` mapping used by its backend adapter.
- Z.ai, Phaser, and other external prototype evidence remains publisher-scoped review material; it cannot be reused across tenants.
- This is a storage-contract safeguard only. It does not authorize prototype import, app patching, route creation, scoring changes, package promotion, or student assignment.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-626 and `docs/adr/0554-prototype-integration-readiness-tenant-boundary.md`.

## 97. Explicit Tenant Boundary Key Standard

- Boolean tenant-boundary preservation is insufficient by itself for backend implementation.
- Progress and teacher-report contracts use the canonical unit-key tenant mapping.
- Prototype readiness and Codex decision contracts use the explicit `tenant_id` mapping.
- Hosted and local adapters must carry the same named mapping before vendor or storage implementation begins.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-627 and `docs/adr/0555-explicit-tenant-boundary-key.md`.

## 98. Complete External Prototype Tenant Scope Standard

- Every external-prototype intake, return, evidence, integration, patch-review, approval, release-lock, work-order, and change-set record is tenant-scoped.
- Hosted and local adapters must reuse one shared category list rather than maintaining divergent protection lists.
- A missing tenant boundary or concrete key blocks the record before Codex review can treat it as evidence.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-628 and `docs/adr/0556-complete-external-prototype-tenant-scope.md`.

## 99. Persistence Contract Alignment Standard

- Durable-record validation and adapter-plan validation are necessary but not sufficient in isolation.
- Tenant-bound progress, teacher-report, and external-prototype categories must be present in both layers.
- Hosted and local intents must use the same concrete `tenantBoundaryKey` as their durable record contract.
- A storage intent must not reject raw audio when its durable record explicitly stores raw audio.
- Review-only records may remain unpaired until a later storage decision; this exception must not weaken the shared tenant-bound category list.
- Alignment remains a verification-only gate. It does not select a vendor, activate storage, import Z.ai work, or authorize student assignment.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-629 and `docs/adr/0557-persistence-contract-alignment.md`.

## 100. Backend Contract Alignment Standard

- The vendor-neutral schema, migration candidates, and migration specifications are one contract surface.
- Every migration target must resolve to a schema entity.
- Every migration specification must resolve to a real migration candidate.
- Specifications must name a primary key, tenant scope, and unique field names.
- The alignment gate remains read-only and vendor-neutral; it does not authorize migrations, live writes, or provider selection.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-630 and `docs/adr/0558-backend-contract-alignment.md`.

## 101. External Prototype Evidence Alignment Standard

- A valid return review, integration plan, wrapper review, fixture replay, event replay, audio report, mobile report, scoring report, Codex decision, and readiness gate must describe the same tenant and request.
- The integration plan must point to the return review, and every report plus readiness gate must point to that integration plan.
- Every evidence record must cover the same mode IDs and preserve each mode's parent-engine identity.
- Alignment is a cross-artifact review gate. It does not authorize prototype import, route replacement, scoring mutation, package promotion, or student assignment.
- Z.ai or other external prototype evidence remains quarantined until this packet is aligned and separately accepted by the Codex integration decision.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-631 and `docs/adr/0559-external-prototype-evidence-alignment.md`.

## 102. Derived Prototype Intake Readiness Standard

- Prototype intake readiness summaries must derive their evidence-alignment lane from the shared cross-artifact validator.
- A green structural alignment lane means only that the review records agree with one another; it is not a returned-package acceptance or a Z.ai integration approval.
- Missing returned source packages, replay evidence, wrapper decisions, and Codex approvals must remain independently visible.
- Any mismatch must become a visible blocked lane before future intake or integration review.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-632 and `docs/adr/0560-derived-prototype-intake-readiness.md`.

## 103. Returned Prototype Manifest Standard

- Every external prototype return must identify the approved source repository, immutable source snapshot, repository-relative prototype folder, target mode, parent engine, and artifact manifest.
- The first approved external prototype repository is `Drewsure/ministar-lab`; returned source cannot point into `apps/web` or `apps/ai-service`.
- Source archives, fixtures, README/setup notes, event replay, audio coverage, scoring replay, mobile evidence, and wrapper notes are separate review artifacts.
- Missing or unreviewed artifacts keep the package out of Codex integration review.
- The manifest is evidence only; it cannot import files, replace routes, mutate scoring, promote packages, or assign students.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-633 and `docs/adr/0561-returned-prototype-manifest.md`.

## 104. Returned Package Checklist Alignment Standard

- A returned package manifest must agree with its tenant-scoped return checklist on tenant, queue item, source repository, target mode, and parent engine.
- A manifest cannot claim `review-only` while its checklist remains below `ready-for-return-review`.
- Alignment is a review-only consistency gate; it does not authorize source import, route replacement, scoring mutation, package promotion, or student assignment.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-634 and `docs/adr/0562-returned-package-checklist-alignment.md`.

## 105. Returned Artifact Shape Standard

- Returned manifests must carry a non-empty target mode and parent engine.
- Artifact entries must use a supported kind, non-empty artifact ID, safe path, and supported status.
- A `review-only` package must mark every required evidence artifact as reviewed, not merely present.
- Malformed artifact entries cannot be silently discarded as if no evidence had been supplied.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-635 and `docs/adr/0563-returned-artifact-shape.md`.

## 106. Returned Package Intake Provenance Standard

- A returned package manifest must agree with the original intake queue item on tenant, queue ID, source repository, target mode, and parent engine.
- Checklist alignment and intake alignment are separate gates so neither record can hide drift in the other.
- A green provenance check remains evidence only and never authorizes import, route replacement, scoring mutation, package promotion, or assignment.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-636 and `docs/adr/0564-returned-package-intake-provenance.md`.

## 107. Returned Prototype Surface Standard

- Every returned package must declare whether it is a `dom-reference`, `phaser`, or `hybrid` prototype.
- The declared surface must match both the intake queue and the return checklist.
- Surface identity is an integration boundary, not a permission to import or expose a direct game route.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-637 and `docs/adr/0565-returned-prototype-surface.md`.

## 108. Returned Package Readiness Separation Standard

- Readiness must show manifest/provenance contract validity separately from actual returned-package availability.
- Structurally valid preview records must never count as a returned Z.ai package.
- A green contract lane cannot issue the Codex or Z.ai integration alert while the real return, evidence, and wrapper lanes remain incomplete.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-638 and `docs/adr/0566-returned-package-readiness-separation.md`.

## 109. Derived Prototype Alert Standard

- The Z.ai/Codex intake alert decision must be derived from readiness status and named structural lanes.
- A blocked evidence-alignment or returned-package-manifest lane blocks the alert.
- A structurally valid preview with no real returned package remains `not-ready`.
- The alert decision function cannot import source, create routes, mutate scoring, promote packages, or assign students.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-639 and `docs/adr/0567-derived-prototype-alert.md`.

## 110. Derived Prototype Readiness Summary Standard

- The prototype intake summary status must be derived from its readiness lanes, not hand-maintained.
- Missing work keeps the summary `not-ready`; when no evidence is missing, a blocked lane produces `evidence-review-needed`; only an all-ready lane set may produce `ready-for-codex-alert`.
- The visible Codex-alert label must be derived from the same alert decision as the handoff signal.
- Shared content-model status types are the contract for both the review workbench and verification harness.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-640 and `docs/adr/0568-derived-prototype-readiness-summary.md`.

## 111. Derived Prototype Return Review Standard

- The returned-package readiness summary must derive its status and Codex return-review label from its evidence lanes.
- Missing source, fixture, audio, mobile, or scoring evidence keeps return review unopened.
- A blocked lane with no missing evidence requires evidence review; only an all-ready lane set can open Codex return review.
- A return-review summary remains a review signal and cannot authorize archive import, app writes, route replacement, scoring changes, package promotion, or assignment.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-641 and `docs/adr/0569-derived-prototype-return-review.md`.

## 112. Derived Prototype Integration Gate Standard

- Prototype integration-gate status must be derived from wrapper, fixture, event, audio, mobile, scoring, and Codex-decision evidence checks.
- Missing or blocked evidence keeps the gate `blocked`; pending evidence remains `review-only`; only all-reviewed evidence may become `ready-for-codex-review`.
- `ready-for-codex-review` means the evidence packet is ready for Codex review, never that an app patch, route write, scoring change, package promotion, or assignment is authorized.
- The UI must expose this distinction clearly and preserve the blocked actions in the gate record.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-642 and `docs/adr/0570-derived-prototype-integration-gate.md`.

## 113. Integration Evidence Provenance Standard

- Integration-gate evidence-check statuses must be derived from the corresponding wrapper, fixture, event, audio, mobile, scoring, and Codex-decision records.
- An integration gate may summarize those records, but it may not replace their statuses with a blanket blocked or reviewed value.
- The readiness-gate self-check is reviewed only after every upstream evidence record is reviewed; it cannot bootstrap its own approval.
- Missing or unknown upstream records remain blocked and preserve the existing no-import, no-patch boundary.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-643 and `docs/adr/0571-integration-evidence-provenance.md`.

## 114. Derived Codex Decision Standard

- The Codex integration-decision status must be derived from its review checks.
- Missing or blocked checks keep the decision blocked; pending checks keep it review-only; all-reviewed checks make it ready for Codex review.
- Ready for Codex review is not an approval and must not populate the selected decision or authorize integration.
- The decision record must continue to preserve tenant boundaries, support-language restrictions, and all blocked actions.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-644 and `docs/adr/0572-derived-codex-decision.md`.

## 115. Codex Decision Evidence Provenance Standard

- Codex-decision checks must be populated from the corresponding upstream wrapper, fixture, event, audio, mobile, and scoring records.
- Not-started, not-run, missing, blocked, or unknown upstream records remain blocked checks; only explicit reviewed records become reviewed checks.
- The readiness-gate check may become reviewed only after every upstream check is reviewed and cannot bootstrap its own state.
- A MiniStar support-language boundary remains an independent protected check and cannot be satisfied by English-game evidence alone.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-645 and `docs/adr/0573-codex-decision-evidence-provenance.md`.

## 116. Canonical Game Audio Evidence Standard

- Every accepted canonical game attempt must emit at least one meaningful
  `audio_requested` event after `game_started` and before completion.
- The audio event must carry non-blank cue text, language, and supported cue
  kind.
- Audio evidence must use the shared adapter and preserve replay, tenant, and
  learner identity fields.
- Audio remains support-only: listening cannot unlock a game, grant mastery,
  award Star Dust, or replace answer activity.
- Missing audio evidence blocks completion at the shared canonical gate for
  DOM, canvas, Phaser, and future game wrappers.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-754 and
`docs/adr/0682-canonical-game-audio-evidence-gate.md`.

## 117. Progression Adapter Identity Standard

- Entry completion, game start, and game completion must compare progression
  and launch-session `unitKey`, `launchCode`, and `studentSessionId`.
- A mismatch must produce no start event, no completion event, no unlock, no
  score, and no Star Dust.
- Identity validation is provider-neutral and side-effect-free; later route,
  continuity, and report gates remain required defense in depth.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-755 and
`docs/adr/0683-progression-adapter-identity-gate.md`.

## 118. Normalized Mastery Award Standard

- Canonical games must write the normalized `result.earnedStarDust` returned
  by `completeGameMode` into `mastery_updated`.
- The locally calculated requested award is adapter input, not authoritative
  mastery evidence.
- Mastery, completion, and progression awards must remain identical after
  unit-cap normalization.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-756 and
`docs/adr/0684-normalized-mastery-award-evidence.md`.

## 119. Training Recovery Award Standard

- Training Academy recovery counts must normalize to non-negative integers.
- Recovery awards must use the shared unit Star Dust ceiling and record the
  normalized accepted value in completion evidence.
- Recovery completion must preserve unit, launch, and learner-session identity
  and must not create an event on mismatch.
- Recovery remains deterministic and cannot become an alternate authority for
  unlocks, mastery, or persistence.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-757 and
`docs/adr/0685-training-recovery-award-boundary.md`.

## 120. Training Report Award Authority Standard

- `training_answer_result` is response evidence, not an additional reward.
- `training_completed` is the authoritative recovery award event.
- Teacher summaries must count `earnedStarDust` only from completion events.
- Duplicate metadata copies must never inflate learner rewards or teacher
  reports.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-758 and
`docs/adr/0686-training-report-award-authority.md`.

## 121. Launch-Surface Game Start Ownership Standard

- Parent launch surfaces select and gate the next game mode.
- The mounted canonical game wrapper owns the single `game_started` event.
- Front-door, QR, and future Phaser wrappers must not create duplicate starts.
- Locked and preview-only modes must not emit game-start evidence.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-759 and
`docs/adr/0687-front-door-game-start-ownership.md`.

## 122. Launch-Surface Canonical Completion Standard

- Every launch surface must validate game completion through the shared
  canonical completion gate.
- Event evidence must be accumulated synchronously before completion is
  accepted.
- Gate failure must preserve progression and Star Dust and explain the review
  boundary to the teacher or learner.
- Front-door, QR, standalone, and future Phaser wrappers share the same
  acceptance rule.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-760 and
`docs/adr/0688-front-door-canonical-completion-gate.md`.

## 123. Reviewed Pairing Slice Reuse Standard

- Reviewed pairing wrappers must be reusable across QR and front-door entry.
- `match-up` and `memory-match` use the same shared audio, scoring,
  progression, and completion contracts for every tenant.
- Unsupported modes remain explicit previews until their own wrapper is
  reviewed for the target entry surface.
- Tenant-specific route behavior must not fork canonical game authority.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-761 and
`docs/adr/0689-front-door-pairing-slice-integration.md`.

## 124. Shared Recommended-Path Advancement Standard

- The next activity is the first uncompleted mode in the tenant's ordered,
  reviewed recommendation list.
- Student launch, front-door, flashcard entry, progress summary, and game
  completion surfaces must use the shared next-mode policy.
- Unlock state remains a separate progression authority check.
- When all reviewed recommendations are complete, the surface must show the
  end of the path rather than inventing or silently repeating an activity.
- Training Academy recovery source selection is a separate evidence-derived
  decision and is not replaced by this student-path helper.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-762 and
`docs/adr/0690-shared-next-recommended-mode-policy.md`.

## 125. Reviewed Activity Promotion Standard

- A recommended mode may be promoted into a launch surface only after its
  wrapper satisfies the shared event, audio, deterministic scoring, identity,
  and completion contracts.
- Student and front-door surfaces must explicitly mount each promoted mode;
  a recommendation must never imply that a preview is a completed activity.
- Asset-dependent modes remain review-only for live uploads until rights,
  safety, metadata, anchor, audio, storage, and release gates are satisfied.
- Unpromoted modes remain visible previews and cannot emit accepted mastery or
  Star Dust through a launch surface.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-763 and
`docs/adr/0691-label-it-canonical-entry-integration.md`.

## 126. Canonical Selection Activity Standard

- Selection and arcade activities may enter the curated launch path only when
  their standalone wrapper satisfies the shared audio, replay, event, scoring,
  identity, and completion contracts.
- The student and front-door flows must explicitly mount each promoted
  selection activity; preview text is not a substitute for accepted gameplay.
- Target-language answer activity remains authoritative. Support language,
  random rewards, and media engagement cannot unlock or award progress.
- Unpromoted modes remain preview-only until separately reviewed for the target
  surface.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-764 and
`docs/adr/0692-balloon-pop-canonical-entry-integration.md`.

## 127. Canonical Assessment Activity Standard

- A reviewed assessment may enter a curated launch path only when target
  language, audio, replay, deterministic scoring, identity, event, and
  completion contracts are satisfied.
- Student and front-door surfaces must mount promoted assessment wrappers
  explicitly and route their evidence through the shared completion gate.
- Support language, media, uploads, and random rewards cannot become
  progression authority or replace target-language answer activity.
- Unpromoted assessment modes remain preview-only until their launch-surface
  review is complete.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-765 and
`docs/adr/0693-quiz-canonical-entry-integration.md`.

## 128. Canonical Binary Assessment Standard

- Binary assessment modes may enter a curated launch path only when visible
  content, target-language audio, replay, deterministic scoring, identity,
  event, and completion contracts are satisfied.
- Student and front-door surfaces must explicitly mount promoted binary
  assessment wrappers and route their evidence through the shared completion
  gate.
- Support language, media, uploads, and random rewards cannot unlock or award
  progress or replace target-language answer activity.
- Unpromoted binary modes remain preview-only until their launch-surface review
  is complete.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-766 and
`docs/adr/0694-true-false-canonical-entry-integration.md`.

## 129. Canonical Typed-Response Standard

- Typed-response modes may enter a curated launch path only when prompt,
  input guidance, feedback, replay, target-language audio, deterministic
  scoring, identity, event, and completion contracts are satisfied.
- Student and front-door surfaces must explicitly mount promoted typed-response
  wrappers and route their evidence through the shared completion gate.
- Support language, media, uploads, and random rewards cannot unlock or award
  progress or replace target-language response activity.
- Unpromoted typed-response modes remain preview-only until their launch-surface
  review is complete.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-767 and
`docs/adr/0695-type-answer-canonical-entry-integration.md`.

## 130. Canonical Spelling Practice Standard

- Spelling Practice may enter a curated launch path only when target-language
  prompt audio, instruction and feedback audio, replay, deterministic letter
  construction, scoring, identity, event, and completion contracts are
  satisfied.
- Student and front-door surfaces must explicitly mount the promoted spelling
  wrapper and route its evidence through the shared completion gate.
- Support language, media, uploads, and random rewards cannot unlock or award
  progress or replace target-language spelling activity.
- Script-specific behavior must be declared per tenant and target language;
  the English letter-normalization fixture does not claim Japanese spelling
  support.
- Unpromoted or unsupported script modes remain preview-only until separately
  reviewed.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-768 and
`docs/adr/0696-spelling-practice-canonical-entry-integration.md`.

## 131. Canonical Fill in the Blank Standard

- Fill in the Blank may enter a curated launch path only when reviewed target
  sentence audio, prompt and choice audio, feedback, replay, deterministic
  answer handling, scoring, identity, event, and completion contracts are
  satisfied.
- Student and front-door surfaces must explicitly mount the promoted wrapper
  and route its evidence through the shared completion gate.
- Support language, media, uploads, and random rewards cannot unlock or award
  progress or replace target-language syntax activity.
- Script-specific answer behavior must be declared per tenant and target
  language; the English normalization fixture does not claim Japanese
  segmentation support.
- Unpromoted or unsupported script modes remain preview-only until separately
  reviewed.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-769 and
`docs/adr/0697-fill-in-the-blank-canonical-entry-integration.md`.

## 132. Canonical Sentence Builder Standard

- Sentence Builder may enter a curated launch path only when reviewed target
  sentence and tile audio, instruction and feedback audio, replay,
  deterministic ordered-token handling, scoring, identity, event, and
  completion contracts are satisfied.
- A `round_shown` event describes a displayed round; tile selection and tile
  removal must not masquerade as additional round-display events.
- Student and front-door surfaces must explicitly mount the promoted wrapper
  and route its evidence through the shared completion gate.
- Support language, media, uploads, and random rewards cannot unlock or award
  progress or replace target-language syntax activity.
- Script-specific token behavior must be declared per tenant and target
  language; the English normalization fixture does not claim Japanese
  segmentation support.
- Unpromoted or unsupported script modes remain preview-only until separately
  reviewed.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-770 and
`docs/adr/0698-sentence-builder-canonical-entry-integration.md`.

## 133. External Phaser Evidence Standard

- Frozen outside-game source is preserved as evidence and must not be treated
  as canonical product code because its scene count, catalog, lifecycle,
  persistence, audio, scoring, and reward behavior may differ from platform
  contracts.
- Controlled candidate evidence may be requested one named game at a time
  after the foundation intake gate passes; the first candidate is Memory Match.
- A candidate package must include source identity, fixture replay, standard
  event replay, target-language audio coverage, deterministic scoring replay,
  mobile/accessibility evidence, and wrapper notes.
- Phaser may own presentation and interaction facts. The platform owns schema,
  identity, audio resolution, scoring, mastery, rewards, persistence, reports,
  routes, and assignments.
- No outside agent may import source, replace routes, mutate scoring, write
  learner persistence, promote packages, or assign students without a written
  Codex integration decision.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-775 and
`docs/adr/0702-phaser-scene-inventory-evidence-boundary.md`.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-615 and `docs/adr/0543-progress-event-timestamps.md`.

## 134. Durable Completion Idempotency Standard

- Hosted and local progress-event writes must use the same canonical completion
  identity: tenant, unit, launch, student session, and game mode.
- The shared `createCanonicalCompletionIdempotencyKey` helper is the source of
  the key shape; adapters must not invent provider-specific variants.
- Durable completion writes must reject duplicate keys atomically and return
  the existing accepted result on a retry where the provider supports it.
- A missing key is a write-validation error. A key does not bypass event
  acceptance, target-language progress, scoring, mastery, policy, or release
  gates.
- This contract keeps hosted and closed/local deployments interchangeable and
  does not select a database or activate live storage.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-778 and
`docs/adr/0705-durable-completion-idempotency.md`.

## 135. Cross-Layer Persistence Alignment Standard

- Durable records and hosted/local adapter intents must be checked together,
  not only validated independently.
- Progress-event completion key fields must match across both layers.
- Duplicate-completion rejection and atomic-write requirements must match
  across both layers.
- Any mismatch blocks provider selection and live persistence planning until
  the contract is corrected and the runtime harness passes.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-779 and
`docs/adr/0706-persistence-alignment-idempotency.md`.

## 136. Completion Write Resolution Standard

- Hosted and local adapters must share the same create, retry, conflict, and
  invalid-input semantics.
- A same-key retry with the same payload hash may return the existing accepted
  record; a same-key retry with a different hash must be a conflict.
- Missing identity, payload, or record fields must be rejected before the
  provider operation.
- The shared planner is pure and does not authorize storage, rewards, reports,
  assignments, or live learner data.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-780 and
`docs/adr/0707-completion-write-resolution.md`.

## 137. Completion Scoring Identity Standard

- `mastery_updated` and `game_completed` must both carry a non-blank
  deterministic scoring profile identifier.
- The two identifiers must match before a completion can affect progression,
  reports, rewards, or persistence planning.
- A wrapper may not infer or replace the platform scoring profile from its own
  presentation logic.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-781 and
`docs/adr/0708-completion-scoring-profile-integrity.md`.

## 138. Completion Key Identity Binding Standard

- Progress-event write requests must carry structured completion identity with
  the idempotency key.
- The expected key must be derived from tenant, unit, launch, student session,
  and game mode, then compared before provider access.
- Cross-identity key reuse is an integrity failure, not a successful retry.
- This check remains side-effect free and does not authorize live persistence.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-782 and
`docs/adr/0709-completion-key-identity-binding.md`.

## 139. Canonical Game Event Identity Standard

- Every canonical game event must carry tenant metadata.
- Every canonical game event must carry unit, launch, and student-session
  identity.
- Expected identity comparison is an additional consistency check and cannot
  be used to make missing identity acceptable.
- Unbound game evidence cannot affect progression, reports, rewards, or
  persistence planning.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-783 and
`docs/adr/0710-canonical-game-event-identity.md`.

## 140. Phaser Candidate Evidence Completeness Standard

- A returned Phaser candidate is not reviewable from its manifest and hashes
  alone; its fixture, event replay, audio map, scoring replay, accessibility
  evidence, source manifest, and wrapper notes must also be validated.
- Candidate evidence must prove the canonical content range, tenant-bound
  identity, deterministic replay and scoring, reviewed audio coverage, and a
  platform-owned persistence/reporting boundary.
- Passing evidence does not promote a candidate or authorize source import,
  route replacement, student assignment, or live writes.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-784 and
`docs/adr/0711-phaser-candidate-evidence-completeness.md`.

## 141. Candidate Gate Behavior Standard

- The candidate evidence gate must have a source-free positive fixture test.
- The same test must include a deliberate rejection case for random rewards.
- This test protects the verifier contract and must run before any candidate
  source is available.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-785 and
`docs/adr/0712-phaser-candidate-gate-behavior.md`.

## 142. Canonical Replay Seed Consistency Standard

- All canonical learning and audio evidence for one game sequence must use one
  identical `replay-v1:` seed.
- A valid seed from another layout, unit, or session is not acceptable evidence
  for the current sequence.
- Mixed replay evidence cannot affect completion, progression, reporting,
  rewards, or persistence planning.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-786 and
`docs/adr/0713-canonical-replay-seed-consistency.md`.

## 143. Platform-Supplied Replay Seed Standard

- A game wrapper may receive a replay seed from the platform when it needs to
  bind deterministic layout or replay evidence to a launch session.
- The same supplied seed must be passed through interaction, audio, and
  completion event factories; silently deriving a replacement seed is invalid.
- When no seed is supplied, the adapter must retain the deterministic
  unit-and-mode fallback for existing callers.
- Existing metadata-carried seeds remain compatible during migration, but new
  wrappers should use the explicit argument.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-787 and
`docs/adr/0714-platform-supplied-replay-seed-threading.md`.

## 144. Fail-Closed Replay Evidence Standard

- Canonical replay seeds must be non-empty and transport-safe after the
  `replay-v1:` prefix; prefix-only values are invalid.
- Shared event validation must return actionable errors for missing identity
  fields rather than throwing on malformed runtime evidence.
- Candidate evidence that fails these checks remains review-only and cannot
  affect progression, reporting, rewards, or persistence.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-788 and
`docs/adr/0715-fail-closed-replay-validation.md`.

## 145. Route-Shell Replay Seed Ownership Standard

- The shared playable route shell owns the canonical replay seed for a game
  sequence.
- Canonical games must require the shell-provided seed and pass it explicitly
  to all interaction, learning-audio, and completion event factories.
- A game component must not derive a second seed; future platform-issued or
  approved Phaser-wrapper seeds enter through the shell boundary.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-789 and
`docs/adr/0716-route-shell-replay-seed-ownership.md`.

## 146. Active Phaser Candidate Order Standard

- Review one external candidate at a time in this order: Memory Match, Balloon
  Pop, Label It, then a gated voice candidate.
- Candidate order is a risk-management sequence, not production approval.
- Historical inventory wording must be marked superseded rather than silently
  treated as a current integration instruction.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-790 and
`docs/adr/0717-active-phaser-candidate-order.md`.

## 147. Candidate Mapping Before Source Integration Standard

- Frozen external game source may be inspected and mapped without being copied
  into the canonical application.
- A mapping review must identify reusable interaction ideas and every behavior
  that must be replaced by platform-owned content, audio, scoring, replay,
  identity, persistence, lifecycle, accessibility, and tenant contracts.
- A working deployment, source hash, or visual quality claim cannot substitute
  for the complete evidence packet and explicit integration decision.
- The first Phaser candidate remains review-only until the candidate package
  gate passes; no scene may own canonical progression or browser persistence.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-792 and
`docs/PHASER_MEMORY_MATCH_MAPPING_REVIEW.md` and
`docs/PHASER_BALLOON_POP_MAPPING_REVIEW.md`.

## 148. Platform Replay Seed Injection Standard

- The canonical route shell may accept an optional platform-issued replay seed
  as the only future provider or Phaser injection point.
- Only a valid transport-safe issued seed may be used; absent or malformed
  input falls back to the deterministic unit-and-mode seed.
- Mounted games must reuse the resolved seed for start, interaction, learning
  audio, and completion evidence; components must not derive a second seed.
- This interface does not authorize source import, route replacement, live
  persistence, student assignment, or production provider networking.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-791 and
`docs/adr/0718-platform-replay-seed-injection-boundary.md`.

## 149. Documentation Integrity Standard

- `docs/PRINCIPLES_AND_STANDARDS.md` must have unique numbered section IDs and
  unique section titles; the cross-cutting Agent Standards subsection is
  intentionally identified as `11.1`.
- `docs/DECISION_REGISTER.md` must have unique decision IDs and unique decision
  titles. Historical records may be out of numerical order when earlier work
  is recorded after a later decision; they must not be silently rewritten.
- The integrity verifier must run before foundation composition is accepted.
- A documentation-only correction must preserve the meaning and traceability
  of prior decisions, ADRs, build sessions, and verification records.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-793 and
`docs/adr/0719-documentation-integrity-gate.md`.

## 150. Phaser Candidate Profile Standard

- The external-package verifier must use explicit approved candidate profiles,
  not a single first-candidate special case.
- Each profile must declare its target mode, parent engine, and deterministic
  scoring scenarios; a candidate cannot substitute another mode's replay
  expectations.
- Adding a profile does not approve source import, route replacement, package
  promotion, or student assignment. It only makes that named candidate
  reviewable through the same evidence boundary.
- Profile definitions must live in the shared content-model manifest and be
  consumed by both the verifier and teacher review surface.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-796 and
`docs/adr/0722-phaser-candidate-profile-gate.md`.

## 151. Phaser Candidate Manifest Integrity Standard

- The shared Phaser candidate profile manifest must be non-empty and contain
  unique target modes, supported parent engines, and at least four unique
  non-blank deterministic scoring scenarios per profile.
- A malformed profile manifest must fail closed before a candidate package is
  evaluated; it must never silently remove a scoring requirement.
- The manifest remains review configuration only and cannot authorize source
  import, route replacement, package promotion, or student assignment.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-797 and
`docs/adr/0723-phaser-candidate-manifest-integrity.md`.

## 152. Phaser Evidence Packet Integrity Standard

- Contract-review source references must be unique, repository-relative POSIX
  paths; absolute paths, drive-letter paths, backslashes, and parent-directory
  traversal are invalid.
- Every returned Phaser evidence artifact must have a distinct kind,
  `artifactId`, and relative path, with a reviewed status and matching SHA-256
  checksum.
- Evidence path validation must fail closed before candidate alignment or
  wrapper review can be treated as complete.
- These integrity checks preserve portability and quarantine; they do not
  authorize source import, route replacement, package promotion, scoring,
  persistence, or student assignment.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-801 and DR-802 and
`docs/adr/0727-phaser-review-source-path-boundary.md` and
`docs/adr/0728-phaser-evidence-artifact-path-uniqueness.md`.

## 153. Phaser Review Payload-Shape Standard

- Phaser review handoffs are untrusted JSON and must not be allowed to crash
  the review surface when collections or nested fields are missing or null.
- Missing or malformed source-file, finding, missing-evidence, blocked-action,
  or approval-blocker collections must return actionable validation errors.
- A malformed review remains blocked and cannot be treated as aligned,
  wrapper-ready, or eligible for candidate promotion.
- Fail-closed payload handling does not authorize source import, route
  replacement, scoring, persistence, package promotion, or assignment.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-803 and
`docs/adr/0729-phaser-review-payload-shape.md`.

## 154. Frozen Source Manifest Path Standard

- Frozen Phaser source evidence manifests must list each reviewed source path
  exactly once using normalized repository-relative POSIX syntax.
- Absolute paths, drive-letter paths, backslashes, empty segments, dot
  segments, and parent-directory traversal must fail before hashing.
- The reproducibility checker must remain read-only and contained within the
  configured isolated snapshot.
- A valid source manifest proves identity only; it does not authorize source
  import, route replacement, package promotion, scoring, persistence, or
  assignment.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-804 and
`docs/adr/0730-frozen-source-manifest-path-integrity.md`.

## 155. Canonical Game Event Payload Standard

- Canonical game event evidence must be treated as untrusted JSON at runtime.
- Non-array event collections and null or malformed entries must return
  actionable fail-closed validation errors instead of throwing.
- Valid events must continue to preserve identity, chronology, target-language
  audio, replay seed, deterministic scoring, mastery, completion, and
  support-language boundaries.
- Payload-shape hardening does not authorize live progression, persistence,
  reporting, route activation, or student assignment.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-805 and
`docs/adr/0731-canonical-game-event-payload.md`.

## 156. Canonical Completion Terminal Standard

- `game_completed` is the terminal gameplay boundary for every canonical
  game sequence.
- No `game_started`, `round_shown`, `answer_submitted`, `answer_result`, or
  `mastery_updated` event may occur after completion.
- Learning-audio replay may remain available as a support action, but it must
  not reopen gameplay or change progression.
- The terminal check applies equally to DOM games and future approved Phaser
  wrappers.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-806 and
`docs/adr/0732-canonical-completion-terminal.md`.

## 157. Canonical Game Event Type Standard

- The complete canonical event vocabulary must live in the shared content
  model as `GAME_EVENT_TYPES`, with `GameEventType` derived from that list.
- Runtime event evidence from browser games, Phaser wrappers, imports, and
  teacher reports is untrusted JSON; an event type outside the shared list must
  fail closed before ordering, completion, reporting, or progression evidence
  is accepted.
- Adding an event requires coordinated taxonomy classification and regression
  coverage; a local string in one game is not an approved platform event.
- This boundary does not authorize live persistence, route activation, source
  promotion, or student assignment.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-807 and
`docs/adr/0733-canonical-game-event-type-boundary.md`.

## 158. Controlled Z.ai Intake State Standard

- The teacher foundation status may say `Controlled intake open` only after
  Codex has explicitly opened the controlled external-prototype gate.
- This status is a human handoff signal: one isolated Z.ai or Phaser candidate
  may be returned for evidence review in `Drewsure/ministar-lab`.
- The status must continue to show `No Z.ai import before returned-package
  review`; source copy, route activation, production promotion, persistence,
  scoring ownership, and student assignment remain blocked.
- A returned package is not approved merely because the intake is open; it must
  pass the candidate package gate and a candidate-specific Codex integration
  decision.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-808 and
`docs/adr/0734-controlled-zai-intake-state.md`.

## 159. Progress Envelope Factory Standard

- Progress-event envelope creation must reject unsupported event types before
  an envelope is produced.
- A known event type missing from the supplied taxonomy must also fail closed;
  no factory may silently assign a fallback `report-only` effect.
- Factory errors must be actionable and must preserve the same event vocabulary
  and classification boundary used by stream validation.
- This rule protects browser, Phaser, import, teacher-report, and progression
  adapters without authorizing live persistence, report export, progression, or
  assignment.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-809 and
`docs/adr/0735-progress-envelope-factory-boundary.md`.

## 160. Progress Envelope Stream Input Standard

- Progress-event stream validators must treat their input as untrusted runtime
  data and explicitly reject non-array containers.
- A malformed stream must produce deterministic diagnostics rather than a
  JavaScript collection-method exception.
- The validation error and report-preview warning must remain distinct so
  report runtimes can fail closed while review surfaces explain the issue.
- This boundary protects report, persistence, Phaser, and game adapters without
  authorizing live storage, progression, rewards, or assignment.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-810 and
`docs/adr/0736-progress-envelope-stream-input-boundary.md`.

## 161. Shared Replay-Seed Factory Standard

- Shared progression factories must resolve every supplied replay seed through
  the canonical `replay-v1` resolver before creating game-start, interaction,
  audio, or completion evidence.
- Invalid provider or wrapper seeds must normalize to the deterministic
  unit/mode seed; malformed replay evidence must not be emitted by a factory.
- Game components may receive a platform-issued seed, but they must not own a
  second seed format or bypass the shared resolver.
- This protects replay, scoring, teacher reporting, and future Phaser wrappers
  without authorizing persistence, progression, rewards, or assignment writes.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-811 and
`docs/adr/0737-shared-replay-seed-factory-boundary.md`.

## 162. Progress Envelope Stream Chronology Standard

- Progress-event envelope batches must preserve non-decreasing
  `occurred_at` order after individual envelope timestamp validation.
- An out-of-order batch must fail closed before it is treated as one report or
  persistence stream; student sessions may still vary in a launch-scoped class
  report.
- Malformed timestamps remain individual envelope errors and must not be
  silently repaired by the stream helper.
- This protects browser, Phaser, report, and persistence adapters without
  authorizing live storage, progression, rewards, or assignment.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-812 and
`docs/adr/0738-progress-envelope-stream-chronology.md`.

## 163. Shared Learning-Audio Replay Standard

- The shared learning-audio contract inside a playable game route must receive
  the route-resolved canonical replay seed.
- Every shell-level `audio_requested` event must preserve that seed so a
  teacher or student audio replay cannot create mixed canonical evidence.
- Individual game components must continue to receive the same seed from the
  route shell; no component or shared card may derive a second replay format.
- This protects replay, scoring, reporting, and future Phaser wrappers without
  authorizing persistence, progression, rewards, or assignment writes.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-813 and
`docs/adr/0739-shared-learning-audio-replay.md`.

## 164. Canonical Game Scoring Profile Standard

- The content model must own the canonical mapping from every supported game
  mode to its deterministic scoring profile.
- `mastery_updated` and `game_completed` evidence must use the profile assigned
  to the selected mode, and the two events must agree with each other.
- A wrapper or future Phaser adapter must not claim a different profile to
  change scoring behavior at the event boundary.
- This protects scoring, replay, reporting, and white-label mode configuration
  without authorizing live persistence, progression, rewards, or assignment.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-814 and
`docs/adr/0740-canonical-game-scoring-profile.md`.
## 165. Shared Scoring Profile Source Standard

- The content model owns the canonical mode-to-scoring-profile map and the
  profile identifier type derived from it.
- Web catalogs, scoring helpers, browser games, and future Phaser wrappers
  must consume that shared map rather than repeat mode assignments.
- Mode profile lookup must be total for every supported canonical mode; an
  optional lookup must not silently produce an unscored or `none` profile.
- This reduces drift across white-label tenants and future game adapters
  without authorizing live persistence, scoring mutation, progression,
  rewards, assignment, or source promotion.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-815 and
`docs/adr/0741-shared-scoring-profile-source.md`.
## 166. Required Scoring Profile At Playable Boundary

- Every canonical playable wrapper must resolve a required scoring profile
  from the shared mode map before creating mastery or completion evidence.
- A wrapper must not hard-code a profile identifier, use `none`, or apply a
  nullable fallback that could emit unscored evidence.
- Engine preview adapters must read the same canonical profile assignment as
  the event validator and web catalog.
- Missing configuration must fail clearly during development and verification
  rather than silently changing scoring behavior for a white-label tenant.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-816 and
`docs/adr/0742-required-scoring-profile-playable-boundary.md`.

## 167. Target-Language Audio Completion Standard

- Canonical game completion gates must receive the unit/tenant target
  language when the playable route has it available.
- Every learner-facing `audio_requested` event used as canonical game evidence
  must match that target language, allowing compatible regional tags.
- Assist-language audio may support comprehension, but it must never satisfy
  the target-language learning or completion trigger.
- Report-only validation may omit the language when no unit context exists;
  playable student and teacher routes must provide it.
- Route shells and launch flows should filter target-language cues before
  passing them to game wrappers; support-language cues remain visible to
  review and assistance panels.
- Canonical wrappers should receive the resolved target language explicitly so
  fallback instructions, generated feedback, and speech events cannot silently
  default to English for another tenant.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-817 and
`docs/adr/0743-target-language-audio-boundary.md`.

## 168. Teacher Report Target-Language Evidence Standard

- When a teacher report has tenant or unit target-language context, its
  canonical game evidence validator must receive that language.
- Report evidence must reject learner-facing audio in an assist language even
  when the event order, replay seed, and scoring profile are otherwise valid.
- Legacy review-only callers may omit the language when no unit context exists;
  this is an explicit compatibility path, not permission to weaken student or
  tenant-aware report validation.
- Teacher session monitors must resolve the target language from tenant
  settings first, then the unit textbook reference, before defaulting to the
  platform baseline.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-819 and
`docs/adr/0745-canonical-report-target-language.md`.

## 169. Canonical Game Dust Cap Standard

- The content model must own the maximum completion award for every canonical
  game mode.
- Web scoring profiles and future Phaser adapters must reference that shared
  cap map rather than duplicate numeric limits.
- The progression adapter must clamp awards to both the mode cap and the
  unit-wide economy cap.
- Canonical mastery and completion evidence must reject awards above the mode
  cap, even when the scoring profile identifier is otherwise correct.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-818 and
`docs/adr/0744-canonical-game-dust-caps.md`.

## 170. Canonical Wrapper Scoring-Cap Standard

- A canonical game wrapper must use the completion cap from its required
  shared scoring profile rather than a smaller mode-specific literal.
- The progression adapter and canonical event validator remain authoritative
  for the mode cap and the unit-wide economy cap.
- Static integration checks must guard against wrapper-specific scoring drift
  so browser and future Phaser adapters remain interchangeable.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-820 and
`docs/adr/0746-speak-it-scoring-cap-alignment.md`.

## 171. Flashcard Fallback Target-Language Standard

- Learner-facing flashcard speech must resolve tenant target language first,
  then the unit textbook language, before using the English platform baseline.
- Missing reviewed audio cues must not silently change the learner language;
  they remain a content-quality issue for authoring and release review.
- Assist-language glosses must remain separate support controls and must never
  trigger target-language practice completion.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-821 and
`docs/adr/0747-flashcard-fallback-target-language.md`.

## 172. Canonical Wrapper Feedback-Language Standard

- Every learner-facing text-to-speech control in a canonical game wrapper
  must resolve missing cue language from the tenant/unit target language
  before using the platform baseline.
- Feedback and replay controls are part of the learner experience, not an
  exception to the target-language boundary.
- Static integration checks must cover fallback controls as well as emitted
  audio events, so a wrapper cannot pass completion validation while speaking
  feedback in the wrong language.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-822 and
`docs/adr/0748-canonical-wrapper-feedback-language.md`.

## 173. Canonical Audio Fallback Regression Standard

- Canonical game verification must reject learner-facing audio expressions
  that fall back directly to English inside a wrapper.
- The English baseline is permitted only at the explicit tenant/unit target
  language resolver boundary.
- New game wrappers must inherit the same guard before they can be treated as
  canonical integration candidates.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-823 and
`docs/adr/0749-canonical-audio-fallback-regression-guard.md`.

## 174. Shared Route-Surface Audio Standard

- Shared learner route surfaces, including access gates and next-activity
  summaries, must receive the same resolved target language as the mounted
  game wrapper.
- A route-level card must not use the audio component's English default when
  the playable shell already has tenant/unit language context.
- Canonical verification must cover shared learner surfaces as well as each
  game component.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-824 and
`docs/adr/0750-shared-route-surface-audio.md`.

## 175. Explicit Target-Language Action Standard

- Every learner-facing `AudioSupportedAction` must receive an explicit
  resolved target language from its unit or tenant boundary.
- The shared audio action component must not provide an implicit English
  fallback for caller-owned learner actions.
- Progress summaries, unlock actions, training controls, media controls, and
  canonical game submit actions all belong to the same target-language audio
  contract.
- English remains a valid platform baseline only at the explicit target
  language resolver boundary, never because a learner surface omitted its
  language.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-825 and
`docs/adr/0751-explicit-target-language-actions.md`.

## 176. Learner Route-Guidance Audio Standard

- Recommended-game paths, activity-hub summaries, recovery recommendations,
  and media playlist controls must use the same resolved target language as
  the mounted unit experience.
- Route guidance is learner-facing instructional content, even when it does
  not award mastery, and must not silently use the audio component baseline.
- Assist-language controls remain explicitly separate and support-only; route
  guidance must not weaken the English-triggered progression boundary.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-826 and
`docs/adr/0752-learner-route-guidance-audio.md`.

## 177. Shared Speech Primitive Language Standard

- `AudioCueText`, `AudioCueButton`, and `playAudioCueText` must require an
  explicit language from their caller.
- The shared speech primitives must not silently default learner speech to
  English; the target-language resolver is the only permitted baseline.
- Static canonical verification must guard the primitive API as well as game
  and route callsites, so future wrappers fail early when language context is
  omitted.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-827 and
`docs/adr/0753-explicit-speech-primitive-language.md`.

## 178. Shared Target-Language Resolver Standard

- Tenant target language has precedence over unit language for every mounted
  learner experience.
- Unit language is the fallback when a tenant has not configured a target
  language. English is the explicit platform baseline only when neither
  boundary supplies a language.
- Canonical games, route shells, training, media, print previews, student
  launch, and teacher evidence must consume the shared content-model resolver;
  individual surfaces must not reimplement the precedence chain.
- This is a white-label platform rule. MiniStar's English target-language and
  Japanese support-language choices remain tenant configuration, not universal
  platform requirements.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-828 and
`docs/adr/0754-shared-target-language-resolver.md`.

## 179. Printable Target-Language Boundary Standard

- Printable worksheet previews must receive the tenant target language at the
  route boundary before resolving unit language.
- Printable vocabulary and sentence outputs must use the same target-language
  contract as interactive games and media; paper output must not silently
  drift to a unit or English baseline when a tenant override exists.
- Print remains a preview and teacher-controlled bridge. It does not award
  mastery, Star Dust, completion, or progression by itself.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-829 and
`docs/adr/0755-printable-target-language-boundary.md`.

## 180. Canonical Completion Target-Language Contract

- The canonical game completion gate must receive a resolved, non-empty target
  language from every student, teacher, and playable-route caller.
- Completion evidence must validate learner audio against the same
  tenant-first target-language contract used by the mounted game and route
  guidance.
- This is a validation boundary only. It does not grant mastery, Star Dust,
  progression, persistence, reporting, assignment, or reward authority by
  itself.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-833 and
`docs/adr/0756-canonical-completion-target-language.md`.

## 181. Canonical Game Wrapper Language Contract

- Every canonical game wrapper must require the resolved target language in
  its props; optional wrapper language is not an acceptable integration
  boundary.
- Route and orchestration layers remain responsible for tenant-first language
  resolution before mounting a game.
- Static canonical verification must cover every active wrapper so a new game
  cannot omit learner-language context while still appearing integrated.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-834 and
`docs/adr/0757-canonical-game-wrapper-language.md`.

## 182. Teacher Report Target-Language Contract

- A teacher report runtime request must declare a non-empty target language
  before canonical learner evidence can be evaluated.
- Report evidence must use the same target-language value as the learner game
  and must never silently treat a missing value as English.
- Generic report parsing may remain reusable for inspection, but the runtime
  report boundary is tenant-scoped and explicit.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-835 and
`docs/adr/0758-teacher-report-target-language.md`.

## 183. Non-Blank Completion Language Runtime Guard

- Canonical completion must reject a missing or blank target language at
  runtime, even when a caller bypasses TypeScript through serialized or
  JavaScript data.
- Completion validation must fail closed before event replay can award or
  accept mastery evidence when language context is invalid.
- The guard remains validation-only and does not itself grant progression,
  Star Dust, persistence, reporting, assignment, or rewards.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-836 and
`docs/adr/0759-non-blank-completion-language.md`.

## 184. AI Evidence Package Language Fail-Closed Standard

- AI-generated game build briefs and prototype audio-coverage reports must
  receive an explicit target language from their reviewed source records.
- Evidence-package assembly must fail closed when that language is missing;
  it must not silently label a white-label package as English.
- This applies before external prototype evidence can be considered for
  canonical integration and does not authorize provider calls, student use,
  assignment, progression, or Phaser promotion.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-837 and
`docs/adr/0760-ai-evidence-target-language.md`.

## 185. Isolated Phaser Candidate Root Standard

- Returned Z.ai evidence packages must live outside the `LivingTextbook`
  repository; `apps`, `packages`, `scripts`, and other product paths are not
  candidate staging areas.
- The candidate verifier must resolve the return manifest and every artifact,
  require regular files, and reject symlink or path escapes before reading.
- A passing package remains review-only. Isolation prevents accidental source
  promotion; it does not authorize route replacement, scoring mutation,
  persistence, assignment, or student use.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-838 and
`docs/adr/0761-phaser-candidate-root-isolation.md`.

## 186. Canonical Game Replay Coverage Standard

- Every active canonical game mode must pass a deterministic synthetic replay
  through the shared event validator before it is treated as a foundation
  reference implementation.
- Replay evidence must preserve the mode's scoring profile, dust cap,
  target-language audio, replay seed, tenant/unit/launch/student identity,
  and ordered completion sequence.
- This harness is contract verification only. It does not replace visual or
  browser interaction testing, award learner progress, or authorize Phaser
  source promotion.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-839 and
`docs/adr/0762-canonical-game-replay-harness.md`.

## 187. Canonical Flashcard Entry Slice Standard

- Flashcards are the teacher-QR entry slice, distinct from the eleven
  ordinary unlocked-game wrappers.
- Entry completion must require reviewed target-language engagement, preserve
  tap-to-speak evidence, use the shared next-mode policy, and reject
  support-language-only unlocking.
- The entry slice may use its dedicated completion adapter, but it remains
  under the same event, scoring, progression, audio, and white-label rules.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-840 and
`docs/adr/0763-canonical-flashcard-entry-slice.md`.

## 188. Flashcard Entry Runtime Gate Standard

- Partial target-language engagement must produce no entry completion and no
  next-game unlock events.
- A complete reviewed entry pass may award the canonical entry dust and unlock
  reviewed next modes, but each unlock must explicitly mark support-language
  unlocking as false.
- The runtime adapter must preserve the same teacher-QR and white-label
  language boundary enforced by the Flashcards UI.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-841 and
`docs/adr/0764-flashcard-entry-runtime-gate.md`.

## 189. Flashcard Entry Idempotence Standard

- A repeated completed Flashcards entry submission must remain completed while
  awarding zero additional Star Dust.
- Repeated entry submissions must emit no duplicate completion or unlock
  events, preserving one canonical progression record across retries,
  refreshes, and double taps.
- This runtime guard is an integration prerequisite, not permission to add a
  persistence provider, assignment side effect, or Phaser source promotion.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-842 and
`docs/adr/0765-flashcard-entry-idempotence.md`.

## 190. Pairing Engine Runtime Standard

- The shared Pairing engine must have executable evidence for selection,
  duplicate taps, mismatch recovery, correct source/target matching,
  completion, terminal retry safety, and progress summaries.
- Memory Match and future pairing skins must consume this parent-engine
  contract rather than create independent selection or completion rules.
- Passing the engine harness is foundation evidence only; it does not promote
  frozen Phaser source or authorize persistence or student assignment.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-843 and
`docs/adr/0766-pairing-engine-runtime.md`.

## 191. Selection Engine Runtime Standard

- The shared Selection engine must produce deterministic vocabulary and syntax
  rounds with unique options and exactly one correct answer.
- Every prompt and option must carry learner-language audio text, and every
  round must declare the shared interaction evidence it requires.
- Quiz, True/False, Balloon Pop, and future selection skins must consume this
  parent-engine contract rather than create independent answer or audio rules.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-844 and
`docs/adr/0767-selection-engine-runtime.md`.

## 192. Text/Spelling Engine Runtime Standard

- The shared Text/Spelling engine must consume exactly two reviewed target
  sentences and produce deterministic, ordered tiles.
- Every tile and sentence prompt must carry learner-language audio text, while
  terminal punctuation may be removed from tile order without changing the
  reviewed target sentence.
- Sentence Builder and future text/spelling skins must consume this parent
  contract rather than generate uncontrolled grammar inside a game.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-845 and
`docs/adr/0768-text-spelling-engine-runtime.md`.

## 193. Speaking Engine Runtime Standard

- Speak It must assemble deterministic term and sentence prompts with stable
  identities and preserve reviewed target-language text.
- Optional audio cues must match safely without inventing missing assets, and
  every prompt remains available to the shared tap-to-hear path.
- Microphone capture is teacher-controlled local replay and must not be
  required for core completion or silently become AI speech scoring.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-846 and
`docs/adr/0769-speaking-engine-runtime.md`.

## 194. External Candidate Handoff Standard

- Each external game candidate must receive a mode-specific evidence brief
  covering fixture shape, event replay, deterministic scoring, target-language
  audio, accessibility, source identity, and wrapper boundaries.
- Balloon Pop is the second approved candidate after Memory Match and remains
  isolated until its complete package passes the candidate verifier.
- A working deployment or frozen source hash is not evidence of wrapper
  compatibility and never authorizes direct source import.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-847 and
`docs/adr/0770-balloon-pop-evidence-handoff.md`.

## 195. Canonical Parent-Engine Binding Standard

- Every canonical mode has one platform-owned parent engine binding in the
  content model; completion evidence must carry that binding on both
  `mastery_updated` and `game_completed`.
- The canonical verifier rejects missing or mismatched parent-engine metadata
  before a completion can be accepted, reported, or used by an external game
  wrapper.
- A Phaser or other outside prototype must map to the declared parent engine;
  visual similarity, deployment success, or a frozen repository snapshot does
  not override this contract.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-848 and
`docs/adr/0771-canonical-parent-engine-binding.md`.

## 196. Curated Unit Pathway Standard

- The student-facing game sequence must be resolved from the tenant's curated
  unit offer map whenever one is available, preserving reviewed order,
  availability, and parent-engine ownership.
- The shared game catalog is the safe structural fallback for units that do
  not yet have a published offer map; it must never silently replace a
  tenant's curated pathway.
- Reusable student route cards and game shells receive offer maps from the
  launch or content-provider boundary; they must not import sample tenant
  fixtures or resolve package storage internally.
- Training Academy remains a review pathway after the curated modes and does
  not become a random or unreviewed activity switcher.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-849 and
`docs/adr/0772-curated-unit-pathway-resolution.md`.

## 197. Teacher Session Provider Boundary Standard

- Teacher roster identity cards and session monitors must consume provider
  data from the launch context rather than resolving sample fixtures by code.
- Missing roster or pathway data must remain an explicit preview or review
  state; reusable components must not invent production identities or routes.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-850 and
`docs/adr/0773-teacher-session-provider-boundaries.md`.

## 198. Dashboard Provider Boundary Standard

- Reusable dashboard layout and feature composition must consume tenant-owned
  launch, package, pathway, QR, validation, pilot, and reporting data through
  explicit props or provider contracts.
- MiniStar fixtures may be composed by the reference app page, but must not be
  runtime dependencies of the reusable dashboard feature.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-851 and
`docs/adr/0774-dashboard-provider-boundary.md`.

## 199. Teacher Reporting Contract Ownership Standard

- Reusable teacher reporting panels, progress-summary components, and data
  providers must import their public contracts from the neutral
  `packages/content-model` public module, not from a sample
  provider or web feature module.
- Demo providers may construct preview records against shared contracts, but
  they must not become the source of truth for tenant reporting APIs. Tenant
  configuration is likewise owned by the content model; web type files may
  re-export it for compatibility but must not redefine it.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-852 and
`docs/adr/0775-teacher-reporting-contract-types.md`.

## 200. Curated Activity Offer Contract Standard

- `UnitGameOffer` and `UnitGameOfferMap` are content/provider contracts owned
  by `packages/content-model`; the web feature path may only re-export them for
  compatibility.
- Launch, student, teacher, and dashboard surfaces must receive curated offer
  maps from a provider boundary rather than resolve tenant fixtures internally.
- Curated offers remain pre-reviewed pathways. A future compatibility or
  printable conversion must preserve tenant scope, curriculum level, parent
  engine, audio, reporting, and readiness requirements.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-853 and
`docs/adr/0776-curated-activity-offer-contract.md`.

## 201. Review Contract Public-Boundary Standard

- Review-only evidence, verifier, intake-readiness, and prototype-return
  contracts used by the web application must be exported through the public
  `packages/content-model` package boundary.
- Panels and sample fixtures may not depend on internal content-model file
  paths when the contract is part of a reusable platform surface.
- Public export does not authorize live AI calls, uploads, persistence,
  student assignment, or Phaser source promotion; those actions remain behind
  their existing evidence and approval gates.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-854 and
`docs/adr/0777-review-contract-public-boundary.md`.

## 202. Persistence And Pilot Policy Public-Boundary Standard

- Persistence record categories and pilot-policy requirements are neutral
  content-model contracts consumed through the public package root.
- Web panels and sample providers may not make internal content-model paths
  part of the platform contract.
- Public contract access does not create a database connection, enable live
  writes, or remove pilot policy, privacy, reporting, or deployment gates.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-855 and
`docs/adr/0778-persistence-pilot-policy-public-boundary.md`.

## 203. Public Contract Import Guard Standard

- The foundation suite must fail when app source imports
  `@living-textbook/content-model/src/*` directly.
- New web, AI-service, local, and future white-label surfaces must consume
  shared contracts through the package root.
- Internal module imports may remain inside the content-model package itself,
  but they are not an app integration boundary.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-856 and
`docs/adr/0779-public-contract-import-guard.md`.

## 204. Content-Model Package Export Standard

- `@living-textbook/content-model` must expose one canonical package-root
  export targeting `src/index.ts`.
- Internal content-model modules must not be exposed as package subpaths to
  application consumers.
- Package export changes must be checked alongside app source imports,
  typechecks, production builds, and runtime verification.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-857 and
`docs/adr/0780-content-model-package-export.md`.

## 205. UI Package Export Standard

- `@living-textbook/ui` must expose a single canonical package-root export
  targeting its public component index.
- White-label themes and feature surfaces must consume UI primitives through
  that root rather than reaching into internal primitive files.
- UI export changes require package-boundary verification and a production
  build before they are accepted.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-858 and
`docs/adr/0781-ui-package-export.md`.

## 206. Game Audio Readiness Gate Standard

- Every canonical game must have target-language audio coverage for every
  unit vocabulary term, every target sentence, and at least one instruction
  cue scoped to that game mode before gameplay or scoring can begin.
- The shared content model owns the coverage calculation so route shells,
  games, teacher previews, and future white-label clients use the same rule.
- Missing coverage is a release/readiness problem, not a learner failure; the
  game route must pause with an actionable review message and must not emit
  mastery, reward, or completion evidence.
- Browser text-to-speech may remain an implementation source for an approved
  cue, but it does not bypass content review, target-language matching, unit
  scope, or game-mode instruction coverage.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-859 and
`docs/adr/0782-game-audio-readiness-route-gate.md`.

## 207. Audio-Consistent Activity Hub Standard

- The student activity hub must use the same shared audio readiness contract
  as direct game routes; a route must not appear ready in the hub when its
  learner-facing audio package is incomplete.
- Incomplete audio is shown as an audio-review state, not learner failure, and
  the hub must not offer a misleading open-game action for that state.
- Curated offer, progression, level, and audio readiness remain separate
  decisions: a game can be reviewed and unlocked but still paused until its
  target-language audio evidence is ready.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-860 and
`docs/adr/0783-audio-consistent-activity-hub.md`.

## 208. Audio-Gated Entry Path Standard

- Every entry path that can complete flashcard practice must calculate the
  shared target-language audio coverage before it can unlock the next
  activity.
- Front-door access, normal student launch, and the dedicated flashcard route
  must enforce the same rule; a card-level message alone is insufficient.
- Japanese or another support language may explain and assist, but it never
  satisfies the target-language audio requirement or unlocks progression.
- A learner who has engaged every card must still wait for reviewed audio
  coverage when the package is incomplete; this is package readiness, not
  learner failure.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-861 and
`docs/adr/0784-audio-gated-entry-paths.md`.

## 209. Level-Safe Fallback Path Standard

- Curated unit game offers remain the primary source of the student pathway.
- If a curated offer map is unavailable, the fallback sequence must filter
  modes through the catalog's supported curriculum levels before displaying
  them.
- Fallback presentation may preserve the canonical order, but it must never
  bypass level support, audio readiness, progression, or route safety gates.
- A missing offer map is a platform-data condition, not permission to expose
  every available game mode to a learner.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-862 and
`docs/adr/0785-level-safe-game-sequence-fallback.md`.

## 210. Activity Hub Level Boundary Standard

- The student activity hub must apply curriculum-level support checks to both
  curated offers and no-map fallback items before displaying a game pathway.
- A reviewed offer is not student-visible merely because it is marked ready;
  its game mode must also support the unit's level.
- Presentation filtering complements, and never replaces, direct route and
  progression enforcement.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-863 and
`docs/adr/0786-activity-hub-level-boundary.md`.

## 211. Continuation Promise Standard

- Every learner-facing continuation card or recommended route must use the
  same effective readiness state as the direct game route.
- Progression unlock alone must not produce an active open or start action
  while target-language audio coverage is incomplete.
- Route summaries and status labels must distinguish audio review from learner
  lockout, and must use the tenant-resolved target language for all audio.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-864 and
`docs/adr/0787-learner-continuation-audio-boundary.md`.

## 212. Completion Navigation Audio Standard

- A completed game may report its own completion without automatically
  authorizing the next activity route.
- Completion navigation must evaluate the next activity's reviewed
  target-language audio before offering an active open action.
- The route shell owns the handoff context; the completion card owns the
  next-activity readiness calculation, keeping the boundary explicit and
  reusable.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-865 and
`docs/adr/0788-completion-navigation-audio-boundary.md`.

## 213. Explicit Audio Scope Standard

- A learner-facing audio cue bound to a unit and target language may be reused
  across games only when it has no explicit game-mode restriction.
- When a cue declares a game mode, coverage must count it only for that mode;
  an explicitly scoped cue from another game cannot satisfy readiness.
- The same scope rule applies to vocabulary, sentence, and instruction cues,
  keeping package evidence and runtime route behavior consistent.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-866 and
`docs/adr/0789-explicit-audio-scope.md`.

## 214. Audio Support Plan Authority Standard

- `UnitAudioSupportPlan.gameModeAudioCueIds` is the reviewed manifest that
  authorizes reusable term or sentence cues for a particular game mode.
- Runtime learner routes must receive the unit's audio support plan before
  calculating readiness; a cue's source `gameMode` alone is not a substitute
  for the package's reviewed reuse declaration.
- A mode may require only the cue families it actually uses. For example,
  Memory Match may require vocabulary and instruction audio without being
  forced to carry sentence audio that belongs to a later syntax activity.
- Package validation remains the first gate; runtime coverage is the final
  learner-facing enforcement boundary.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-867 and
`docs/adr/0790-audio-support-plan-authority.md`.

## 215. Mode-Scoped Instruction Audio Standard

- A game-mode instruction cue is learner-facing evidence and must be covered
  by the unit audio support plan before that mode can open.
- Generic unit instructions may be reused only when they are listed as shared
  instruction coverage; a same-unit cue is not automatically approved merely
  because it exists.
- Direct game routes, activity hubs, continuation cards, and front-door
  navigation must receive the same instruction-scope result from the shared
  content-model helper.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-868 and
`docs/adr/0791-mode-scoped-instruction-audio.md`.

## 216. Tenant-Owned Audio Evidence Standard

- Runtime learner audio coverage must require both the canonical unit key and
  the owning tenant identifier to match the active unit.
- Package validation remains the primary content-integrity gate, but route
  readiness must also defend against malformed or cross-tenant runtime input.
- A cue owned by another tenant cannot satisfy terms, sentences, instructions,
  progression, completion, or reward eligibility.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-869 and
`docs/adr/0792-tenant-owned-audio-evidence.md`.

## 217. Front-Door Continuation Context Standard

- The teacher-directed front door and the normal student launch must pass the
  same unit audio support plan into recommended-route presentation.
- A continuation card is not allowed to infer audio readiness from raw cues
  when the active package has a reviewed mode-scope manifest.
- Route-entry, activity-hub, completion, and front-door continuation surfaces
  must remain aligned so a student sees one consistent readiness decision.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-870 and
`docs/adr/0793-front-door-continuation-context.md`.

## 218. Authorized Playback Cue Standard

- The same shared cue-selection contract must govern both readiness and the
  actual audio list handed to a canonical game.
- Gameplay components must receive cues scoped to the active unit, tenant,
  target language, and reviewed game-mode manifest.
- A cue that cannot satisfy the route's audio gate must not remain available to
  gameplay playback through a broad language-only list.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-871 and
`docs/adr/0794-authorized-game-playback-cues.md`.

## 219. Reviewed Asset Playback Standard

- A reviewed audio cue with a tenant-approved `sourceUri` must be played as
  the primary learning audio when a learner taps its text or listen control.
- Browser speech synthesis remains a low-cost resilience fallback for cues
  without a playable asset or when a browser cannot load the asset.
- Playback source choice must not alter answer marking, Star Dust, mastery,
  unlocks, support-language behavior, or teacher reporting authority.
- Future local companion bundles may resolve approved `localBundlePath`
  values through a deployment adapter; browser routes must not guess at local
  filesystem paths.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-872 and
`docs/adr/0795-reviewed-asset-audio-playback.md`.

## 220. Browser Audio Locator Standard

- Browser learner playback may use same-origin or HTTP(S) reviewed asset
  locators only.
- Filesystem, script, data, malformed, or otherwise non-web locators must not
  be handed to a browser media element.
- An unsafe or unavailable locator falls back to the approved text-to-speech
  path without changing the content, scoring, progression, or release state.
- Local companion playback must resolve local paths in its own deployment
  adapter rather than weakening the hosted browser boundary.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-873 and
`docs/adr/0796-browser-audio-locator-boundary.md`.

## 221. Explicit Media Delivery Mode Standard

- Hosted browser routes use hosted media locators only; a local bundle path
  must not silently become a hosted fallback.
- Local companion routes must opt into local-first resolution explicitly and
  may use hosted media only as a documented fallback.
- A missing source is a visible readiness state, not permission to invent a
  filesystem URL or claim offline availability.
- Delivery mode is independent of content rights, release approval, and
  learner progress; all three remain required separately.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-874 and
`docs/adr/0797-explicit-media-delivery-mode.md`.

## 222. Explicit Media Mode Propagation Standard

- The deployment boundary must pass media delivery mode explicitly through
  playlist, engagement, and playback components.
- Hosted routes must declare `hosted-first`; they must not rely on an implicit
  default that could later change during local companion work.
- A local or hybrid companion must opt into `local-first` only after its
  bundle-path adapter, rights checks, update procedure, and offline report
  policy are verified.
- Delivery mode is a transport choice only. It cannot grant media rights,
  unlock a game, award Star Dust, or change teacher reporting.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-875 and
`docs/adr/0798-explicit-media-mode-propagation.md`.

## 223. Entry Practice Cue Fidelity Standard

- The first QR-launched Flashcard Practice slice must pass its reviewed
  instruction, vocabulary, sentence, and completion cues into the shared audio
  control whenever those cues exist.
- Browser speech remains the fallback for missing or unavailable assets; it
  must not replace a valid tenant-approved recording silently.
- Cue playback remains presentation-only and cannot satisfy English listening,
  unlock the next game, award Star Dust, or change progression by itself.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-876 and
`docs/adr/0799-entry-practice-cue-fidelity.md`.

## 224. Canonical Game Cue Fidelity Standard

- Canonical game instructions, prompts, vocabulary, sentence, and feedback
  controls must pass their authorized `AudioCue` into the shared playback
  primitive whenever the cue exists.
- A game may use speech synthesis for authored UI copy that has no reviewed
  cue, but it must not bypass an approved tenant recording for convenience.
- Cue source selection remains independent from answer correctness, score,
  mastery, rewards, unlocks, microphone approval, and reporting.
- Any future Phaser or external game wrapper must demonstrate the same cue
  handoff before it can be considered for canonical integration.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-877 and
`docs/adr/0800-canonical-game-cue-fidelity.md`.

## 225. Audio Transcript Match Standard

- Shared learner audio controls may use a reviewed asset only when its cue text
  matches the visible learner-facing text after whitespace and case
  normalization.
- When a visible retry, success, next-round, or completion sentence has no
  exact reviewed match, the control falls back to speech for that exact text.
- This rule is centralized so canonical DOM games, future tenant themes, and
  approved Phaser wrappers inherit the same protection.
- Transcript matching cannot change scoring, mastery, rewards, unlocks,
  assignments, reports, or microphone policy.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-878 and
`docs/adr/0801-audio-transcript-match-guard.md`.

## 226. Direct Playback Guard Standard

- Immediate term and feedback announcements must use the same shared playback
  primitive as learner-facing Listen and Replay controls.
- Direct playback may pass a reviewed cue, but the shared primitive must apply
  the transcript match guard before using its source URI.
- A direct announcement cannot create a second audio policy, score path,
  progression trigger, or language default.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-879 and
`docs/adr/0802-direct-playback-guard.md`.

## 227. Production-Shaped Vertical Slice Gate

- The first release-shaped slice must be proved as one cross-boundary path:
  teacher content package, white-label tenant resolution, QR/front-door launch,
  reviewed target-language audio, Flashcard entry practice, Memory Match, one
  canonical game, deterministic scoring, progression reward, and teacher-visible
  progress evidence.
- MiniStar and the sample publisher must use the same package, audio, game,
  progression, and reporting contracts. A second tenant is required evidence
  that the platform is white-label rather than MiniStar-specific.
- Teacher evidence may remain a preview or demo report while live persistence,
  export, retention, and school policy gates are unfinished. Preview evidence
  must never be presented as durable student storage.
- Hosted-first and local-first delivery are explicit boundary modes. Media,
  content, QR fallback routes, and report policy must be represented before a
  closed local deployment is called production-ready.
- Frozen Z.ai/Phaser source remains review-only until source mapping, contract
  evidence, accessibility, audio, scoring, and release gates approve promotion.
- `npm run verify:vertical-slice` is the standing gate for this cross-boundary
  proof and runs as the first step of `verify:foundation`.
- The browser rehearsal evidence bridge is a bounded demonstration adapter:
  coded event/progression evidence only, no names, raw audio, transcripts,
  hosted sync, export, or classroom retention. Storage failure must never
  block student gameplay.
- Any event stream used by a completion gate must update its synchronous ref
  before scheduling UI state. Rendered logs are not a substitute for the
  authoritative in-turn replay snapshot.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-880 and
`docs/adr/0803-production-shaped-vertical-slice-gate.md`. The event ordering
rule is recorded in DR-881 and `docs/adr/0805-synchronous-event-append-boundary.md`.

## 228. Durable Persistence Provider Standard

- Durable progression storage must remain behind the shared typed continuity
  contract; route and game components must not write a database directly.
- The first provider is server-only SQLite for the closed/local pilot path.
  Rehearsal process memory must remain visibly separate and non-durable.
- Every stored progression record must preserve tenant, package, launch, and
  coded student-session identity in the storage key, with idempotency protection.
- Durable writes require explicit provider selection, server-side school/tenant
  policy, retention-policy, and release-approval gates, plus either a matching
  signed student session or a server-only token for service-to-service access.
- Raw learner audio, learner transcripts, support-language evidence, and
  media-only evidence remain excluded from progression records.
- A cloud provider is not production-ready until authentication, encryption,
  backup/restore, deletion, retention, monitoring, and multi-instance behavior
  are evidenced.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-885 and
`docs/adr/0813-first-durable-progression-provider.md`.

## 229. Authenticated Student Session Boundary Standard

- A coded front-door launch must be validated by the server before a durable
  student session exists. Client-side code checks are guidance, not authority.
- The server must bind tenant, package, launch, and coded student-session
  identity into a signed, expiring, HttpOnly session cookie.
- Browser progression writes may use only a matching signed student session;
  teacher/server probes may use a separate server-only authorization token.
- The browser must never receive the persistence API token or a database
  credential. Invalid, expired, cross-tenant, or cross-session writes fail
  closed.
- When durable storage is disabled, the front door may remain rehearsal-only,
  but the interface and evidence must label that mode accurately.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-886 and
`docs/adr/0814-authenticated-student-session-boundary.md`.

## 230. Closed-Pilot Operations Boundary Standard

- Durable progression is not pilot-operable until health, backup, restore, and
  retention-deletion evidence can be repeated against the selected provider.
- Backup and restore are server-side evidence procedures. They must not be
  represented as a student-facing control or a browser shortcut.
- Every backup must produce a checksum manifest with schema version, creation
  time, retention period, and explicit raw-audio/transcript exclusion markers;
  restore evidence must verify that checksum before acceptance.
- Retention deletion must be explicit, policy-gated, and scoped to the full
  tenant/package/launch/student-session identity. It must prove that another
  tenant's record remains untouched.
- Teacher-facing persistence status may show provider, durability, health,
  policy readiness, and the configured retention period, but never learner
  records, database paths, credentials, raw audio, or transcripts.
- An operations gate is separate from the durable-write gate. It must require
  school-policy acceptance, retention-policy acceptance, release approval, and
  a positive retention period before backup, restore, or deletion evidence can
  run.
- These controls do not authorize cloud launch, report export, public sharing,
  local package synchronization, or live student-data administration.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-887 and
`docs/adr/0815-closed-pilot-operations-boundary.md`.

## 231. Persistence Operations Evidence Standard

- Completed backup, checksum-verified restore, and identity-scoped retention
  deletion operations must emit server-side metadata receipts.
- Receipts may contain operation type, time, schema, checksum, byte size,
  retention period, deletion count, and a one-way scope digest only.
- Receipts must not become a second learner-data store: raw student-session
  identifiers, progression payloads, raw audio, transcripts, credentials, and
  database paths are prohibited.
- Teacher history is read-only evidence. It must not expose browser controls
  for backup, restore, deletion, export, launch, or release mutation.
- Missing evidence is not a successful recovery state and must remain visible
  as unavailable or blocked.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-888 and
`docs/adr/0816-persistence-operations-evidence-ledger.md`.

## 232. Persistence Evidence Chain Standard

- Every completed persistence operation receipt must preserve a previous hash
  and canonical evidence hash so silent metadata edits are detectable.
- Hashes cover metadata only; raw student-session identifiers, progression
  payloads, raw audio, transcripts, credentials, and database paths remain
  prohibited.
- Store initialization must migrate and backfill existing receipts safely, and
  health diagnostics must report a failed chain as unhealthy.
- Teacher status may show integrity state and verified receipt count, but the
  browser must not repair, rewrite, delete, restore, export, or launch from
  the evidence surface.
- The chain is an integrity signal, not a replacement for access control,
  encryption, external backup custody, or immutable audit storage.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-889 and
`docs/adr/0817-persistence-evidence-chain.md`.

## 233. Tenant-Scoped Teacher Operations Authorization Standard

- Persistence operation history must require a separate teacher authorization
  boundary; a student session must never authorize teacher history.
- The closed-pilot bridge uses a signed, expiring HttpOnly teacher session with
  tenant identity, teacher role, and `persistence:read` scope.
- Session issuance requires a server-only review code and an explicit tenant
  allowlist. Production tenants must replace this bridge with an approved
  identity provider without weakening tenant binding, expiry, or scope checks.
- Every history request must name a tenant and return only receipts carrying
  the matching one-way tenant scope digest. Platform-wide backup and restore
  receipts remain platform-operator evidence, not tenant teacher evidence.
- Teacher history stays read-only and metadata-only. No browser control may
  back up, restore, delete, export, launch, repair, or mutate release state.
- Missing or unscoped receipt attribution remains hidden rather than being
  guessed. Access control is required in addition to redaction and tamper
  evidence.
- A page refresh may discover the current signed teacher session through a
  read-only status request, but client state, tenant input, and review-code
  input cannot create or broaden authorization.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-890,
`docs/decision-register/DR-890-teacher-operations-authorization.md`, and
`docs/adr/0818-teacher-operations-authorization.md`.

## 234. Canonical Memory Match Integration Gate Standard

- The active `PairingMemoryMatchGame` and `/memory/[code]` route remain the
  canonical platform reference surface for Memory Match.
- A frozen Z.ai/Phaser Memory Match candidate is evidence only until its
  candidate profile, frozen provenance, wrapper, fixture, event, target-
  language audio, deterministic scoring, mobile/accessibility, and Codex
  decision lanes are all reviewed.
- The external candidate must wrap the pairing engine and must not own unit
  payload interpretation, audio manifest selection, scoring, Star Dust,
  persistence, route registration, progression, or assignments.
- The focused gate may be reviewed by teachers and engineers, but it cannot
  approve a patch, import source, replace the canonical route, or create a
  student assignment.
- Z.ai engagement for returned-package work begins only after this gate has
  a concrete evidence packet request. Until then, the next work remains
  platform foundation hardening and canonical contract verification.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-891,
`docs/decision-register/DR-891-canonical-memory-match-integration-gate.md`,
and `docs/adr/0819-canonical-memory-match-integration-gate.md`.

## 235. Memory Match Evidence Handoff Standard

- The first concrete Z.ai request for the frozen Memory Match candidate is an
  evidence-only return package. It is initiated by a human after review of the
  packet; the platform never dispatches an agent automatically.
- The return package must bind the frozen repository, snapshot, and commit and
  must include the manifest, reviewed unit fixture, canonical event replay,
  target-language audio report, deterministic scoring replay,
  mobile/accessibility report, wrapper adapter review, source checksum
  manifest, and setup/limitations README.
- Handoff-ready means the request is sufficiently specified for human review.
  It does not mean integration-ready, production-ready, or approved for
  source import.
- The package must prove that the canonical wrapper owns content, audio,
  scoring, progression, persistence, rewards, and assignment boundaries. A
  Phaser scene may render and report through the wrapper only.
- Source promotion, route replacement, scene-owned scoring or persistence,
  package activation, reward mutation, and student assignment remain blocked
  until Codex reviews the returned evidence and records an explicit decision.
- The teacher surface is a read-only evidence preview. It must expose the
  acceptance checks and blocked actions without adding a live dispatch button
  or a hidden integration path.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-892,
`docs/decision-register/DR-892-memory-match-evidence-handoff-packet.md`,
and `docs/adr/0820-memory-match-evidence-handoff-packet.md`.

## 236. Production-Shaped Vertical Slice Handoff Standard

- An unlocked student activity route must be opened through a validated,
  tenant/package/launch/student-session-bound progression handoff.
- Flashcard completion must save the handoff before opening the next curated
  activity. Completed canonical game routes must use the same rule for their
  next activity.
- The destination route may rehydrate the progression snapshot, but it must
  still validate the handoff identity and destination path before gameplay
  unlocks. Direct URLs remain useful for rehearsal and review, but cannot
  bypass progression.
- The handoff contains no raw learner audio, transcript, support-language-only
  evidence, or media-only evidence. Audio helps the learner; it cannot unlock
  progress by itself.
- The vertical slice must remain tenant-neutral: package identity, target
  language, audio cues, curated offers, and reward names come from the tenant
  package rather than a MiniStar-only constant.
- A missing package identity, failed save, identity mismatch, or route mismatch
  must keep the destination blocked and expose a reviewable error rather than
  navigating optimistically.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-893,
`docs/decision-register/DR-893-production-shaped-vertical-slice-handoff.md`,
and `docs/adr/0821-production-shaped-vertical-slice-handoff.md`.

## 237. Cross-Route Local Evidence Continuity Standard

- The canonical browser rehearsal slice uses one local evidence record per
  launch code, bound to tenant, content-package, unit, and student-session
  identity.
- Standalone Flashcards, Memory Match, Sentence Builder, and later canonical
  routes may contribute route-local events to that record. Events are merged
  in order and exact duplicates are removed so re-renders and route retries do
  not inflate teacher-visible counts.
- The latest validated progression snapshot replaces the prior snapshot, while
  the event history remains cumulative for the same package and student
  session.
- A package, tenant, unit, launch, or student-session mismatch rejects the
  append. It must never merge records across learners or white-label tenants.
- The record remains `browser-rehearsal-only`: it is not hosted persistence,
  a classroom record, an export, or a live assignment data channel. Raw audio,
  transcripts, and support-language-only evidence remain excluded.
- Teacher surfaces may read this record for local verification, but a failed
  local evidence write must not silently unlock a game or award mastery.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-894,
`docs/decision-register/DR-894-cross-route-local-evidence-continuity.md`,
and `docs/adr/0822-cross-route-local-evidence-continuity.md`.

## 238. Teacher Rehearsal Reconciliation Standard

- The teacher session surface must reconcile browser rehearsal evidence against
  the expected tenant, content package, launch, and student-session identity
  before showing local activity details.
- Reconciliation is read-only and explanatory. It may summarize observed
  activity modes, starts, answers, completion, mastery events, and audio
  requests, but it may not mutate progression, unlock a game, award Star Dust,
  export a report, or create a classroom record.
- The activity journey is derived from the validated event history and latest
  progression snapshot. It must make route continuity understandable without
  exposing raw audio, transcripts, or support-language-only evidence.
- A mismatch hides the local record and names the failed binding checks. It is
  safer to show no evidence than to attach one student's rehearsal to another
  tenant or session.
- The teacher surface must continue to label browser rehearsal as non-hosted
  and keep the future hosted adapter behind policy, privacy, retention, and
  release gates.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-895,
`docs/decision-register/DR-895-teacher-rehearsal-reconciliation.md`,
and `docs/adr/0823-teacher-rehearsal-reconciliation.md`.

## 239. Pilot Evidence Envelope Standard

- Teacher reporting must consume one provider-neutral session evidence
  envelope, not separate unrelated route summaries.
- The envelope is bound to tenant, content package, launch, unit, student
  session, and target language, and preserves the canonical workflow order.
- It may summarize event counts, observed event types, completed modes,
  progression state, and journey readiness, but it must not include raw learner
  audio, learner transcripts, support-language progress, durable-write claims,
  or live-classroom status.
- The envelope is derived from validated browser rehearsal evidence and is not
  itself a hosted record, export, assignment result, or release approval.
- Stable identity and deterministic stage status are required so repeated
  route visits and retries do not create multiple packets or inflate results.
- A future hosted or local adapter may store this envelope only after its
  tenant, privacy, retention, authorization, and release contracts align with
  the same shape.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-897,
`docs/decision-register/DR-897-pilot-evidence-envelope.md`,
and `docs/adr/0825-pilot-evidence-envelope.md`.

## 240. Pilot End-to-End Session Rehearsal Standard

- The first production-shaped rehearsal is one ordered, tenant-neutral journey:
  front door, Flashcards, Memory Match, Sentence Builder, and teacher report.
- The coded front door establishes the tenant, package, launch, and student
  session boundary. It must state that the rehearsal does not collect real
  learner data.
- Target-language Flashcard completion is the only first unlock trigger.
  Support-language playback, audio requests, direct URLs, and media-only
  evidence cannot advance the student.
- Memory Match and Sentence Builder open only from a validated progression
  handoff and append cumulative, deduplicated local evidence for the same
  package and student session.
- Completion and retry handling must be deterministic and idempotent. A route
  retry must not duplicate accepted completion, mastery, Star Dust, or reward
  evidence.
- The teacher report is read-only and must reconcile tenant, package, launch,
  and student-session identity before showing activity summaries.
- The hosted persistence adapter remains a typed contract behind an explicit
  feature flag. Durable writes, live reporting, exports, and raw learner audio
  or transcript storage remain blocked by default until school-policy,
  retention, authorization, privacy, and release gates are accepted.
- A rehearsal failure must be visible and reviewable; it must never silently
  unlock the next game or present local evidence as a live classroom record.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-896,
`docs/decision-register/DR-896-pilot-end-to-end-session-rehearsal.md`,
and `docs/adr/0824-pilot-end-to-end-session-rehearsal.md`.

## 241. Pilot Session Preflight Standard

- The pilot preflight is a deterministic review-readiness evaluator for the
  coherent evidence envelope. It checks identity, canonical workflow,
  target-language presence, and privacy exclusions before evidence is shown as
  ready for human review.
- `ready-for-review` means that the controlled rehearsal has complete,
  internally consistent evidence. It does not mean that the package is
  approved for classroom launch, assignment use, rewards, export, or hosted
  persistence.
- Invalid or incomplete evidence remains visibly invalid or incomplete. It
  must never unlock a game, alter mastery, create a live classroom record, or
  be presented as a successful pilot.
- The launch-boundary check is always blocked in this phase. Both
  `launchAllowed` and `durableWriteAllowed` are literal `false` values until
  separate authorization, school-policy, privacy, retention, and release gates
  are implemented and reviewed.
- The teacher panel may display the preflight summary and individual check
  details, but the panel remains read-only and provider-neutral.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-898,
`docs/decision-register/DR-898-pilot-session-preflight.md`,
and `docs/adr/0826-pilot-session-preflight.md`.

## 242. Pilot Preflight Behavior Gate Standard

- The preflight contract requires executable coverage for complete,
  incomplete, and invalid evidence states, not only source-fragment checks.
- A complete envelope must pass the identity, workflow, target-language, and
  privacy checks while the launch-boundary check remains blocked.
- Incomplete workflow evidence must remain incomplete and side-effect free.
- Any prohibited privacy flag must produce an invalid result with explanatory
  validation errors.
- Every state must return literal `launchAllowed: false` and
  `durableWriteAllowed: false` until a separately reviewed release gate exists.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-899,
`docs/decision-register/DR-899-pilot-preflight-behavior-gate.md`,
and `docs/adr/0827-pilot-preflight-behavior-gate.md`.

## 243. Server-Owned Persistence Policy Standard

- A browser persistence request may identify the tenant-scoped session and
  request `rehearsal-only` or `durable-managed` handling, but it may not attest
  that school policy, retention policy, release approval, or durable-write
  permission has been granted.
- The server must derive those policy flags from deployment configuration and
  validate the resulting internal request before any persistence provider is
  reached.
- A client-supplied policy object is rejected as invalid rather than merged or
  trusted. The request remains bound to the signed student session or a
  server-only persistence token.
- This boundary protects white-label tenants from treating learner-device
  input as institutional authorization and keeps provider selection replaceable.
- Review, rehearsal, invalid, unauthorized, and unavailable responses must
  remain side-effect free; a browser cannot turn a blocked response into a
  durable write by changing request flags.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-900,
`docs/decision-register/DR-900-server-owned-persistence-policy.md`,
and `docs/adr/0828-server-owned-persistence-policy.md`.

## 244. Hosted Persistence Read-Purpose Authorization Standard

- Every hosted progression read must declare one access purpose: matching
  learner continuity or tenant-scoped teacher review.
- Learner continuity reads require a matching signed student session or a
  server-only persistence token for the complete tenant, package, launch, and
  student-session identity.
- Teacher review probes require the expiring teacher review session for the
  requested tenant. A coded sample identity is not an authorization mechanism.
- Missing, unknown, or mismatched access purpose must fail closed before a
  process-memory or durable provider is queried. Provider choice must never
  change the privacy boundary.
- Unauthorized responses must not reveal whether a record exists, and the
  read-only teacher probe remains evidence of adapter behavior rather than a
  live learner-data workflow.
- Browser result handling must preserve the distinction between protected,
  no-record, and unavailable states; an unauthorized response must never be
  rendered as proof that a record is absent.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-901,
`docs/decision-register/DR-901-hosted-persistence-read-authorization.md`,
and `docs/adr/0829-hosted-persistence-read-authorization.md`.

## 245. Persistence Operations Diagnostics Authorization Standard

- Provider, schema, journal, retention, session-boundary, and evidence-chain
  diagnostics are teacher operations data and must not be publicly probeable.
- The status endpoint requires an explicit tenant identifier and the same
  expiring tenant-scoped teacher review session used by operation history and
  hosted adapter review.
- Unauthorized status responses must withhold provider selection, deployment
  configuration, database paths, learner records, and operation evidence.
- The teacher persistence workbench may render protected status before sign-in,
  but it must not label the deployment healthy, blocked, or rehearsal until an
  authorized response is received.
- This boundary is diagnostics-only: it does not enable backup, restore,
  deletion, export, durable writes, classroom launch, or provider selection.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-902,
`docs/decision-register/DR-902-persistence-operations-diagnostics-authorization.md`,
and `docs/adr/0830-persistence-operations-diagnostics-authorization.md`.

## 246. Teacher Operations Session Synchronization Standard

- The teacher persistence workbench must use one tenant-scoped session-change
  signal for its read-only status, hosted-adapter, and operation-evidence
  panels.
- A successful sign-in or sign-out may refresh only panels for the changed
  tenant; a browser event must never grant authorization, carry a review code,
  or replace the server cookie boundary.
- Refreshes must remain read-only and must preserve the distinct protected,
  healthy, rehearsal, unavailable, and no-record states.
- A failed sign-in must not cause another tenant's panels to refresh or reveal
  deployment information.
- The synchronization contract is a usability aid for the review workbench,
  not a persistence, reporting, classroom-launch, export, or write feature.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-903,
`docs/decision-register/DR-903-teacher-operations-session-synchronization.md`,
and `docs/adr/0831-teacher-operations-session-synchronization.md`.

## 247. Active Teacher Tenant Revocation Standard

- A signed teacher cookie is not sufficient by itself: every teacher-session
  status read and every teacher operations read must revalidate the current
  deployment tenant allowlist.
- Removing a tenant from the active allowlist must invalidate its existing
  review access without waiting for cookie expiry.
- A tenant mismatch, revoked tenant, expired cookie, invalid signature, or
  missing session must produce the same privacy-safe unauthorized boundary.
- Server-only persistence tokens remain deployment credentials and must not be
  exposed to browser code; future tenant-aware service tokens must carry an
  explicit tenant scope before production use.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-904,
`docs/decision-register/DR-904-active-teacher-tenant-revocation.md`,
and `docs/adr/0832-active-teacher-tenant-revocation.md`.

## 248. Unauthorized Operations Privacy Parity Standard

- Persistence status and operation-history endpoints must return the same
  generic unauthorized boundary before teacher authorization is established.
- Unauthorized operation-history responses must not disclose provider,
  durability, schema, database path, record existence, tenant digest, learner
  identity, raw audio, transcript, or operation evidence.
- Provider and durability details may appear only after the tenant-scoped
  teacher authorization boundary has passed, and only as read-only diagnostics.
- This is a privacy boundary, not a replacement for authentication,
  authorization, retention, export, or classroom-launch policy.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-905,
`docs/decision-register/DR-905-unauthorized-operations-privacy-parity.md`,
and `docs/adr/0833-unauthorized-operations-privacy-parity.md`.

## 249. Teacher Operations Runtime Verification Standard

- Runtime verification must prove the complete review boundary, not only
  source fragments: teacher sign-in, same-tenant session discovery, same-tenant
  status/history access, cross-tenant rejection, and privacy-safe unauthorized
  responses.
- The runtime verifier must use an explicitly configured test deployment and
  review code; production credentials must never be committed or embedded in
  fixtures.
- A second deployment may be supplied to prove that an existing cookie is
  rejected after tenant allowlist revocation.
- This verifier proves read authorization only. It must not create learner
  records, enable durable writes, export reports, launch a classroom, or mutate
  deployment state.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-906,
`docs/decision-register/DR-906-teacher-operations-runtime-verification.md`,
and `docs/adr/0834-teacher-operations-runtime-verification.md`.

## 250. Teacher Report Persistence Rehearsal Standard

- A teacher report package must align three contracts before any provider is
  considered: the validated report request, the tenant-bound persistence write
  intent, and the durable teacher-report-package record.
- The aligned contracts must preserve event-acceptance summaries and settings
  context so a report cannot silently convert rejected, support-only, or
  differently configured activity into teacher evidence.
- Core teacher reports remain pseudonymous-slot based and must exclude raw
  learner audio and transcripts. A report package may describe audio support
  engagement without storing the source audio or a transcript.
- The persistence and durable-record tenant boundary keys must match exactly;
  tenant or launch identity may not be inferred from a browser route alone.
- The current adapter is review-only and always returns `sideEffect: "none"`.
  A future hosted or local adapter may not be introduced until policy,
  release, privacy, retention, export, backup, and tenant-isolation evidence
  is approved together.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-907,
`docs/decision-register/DR-907-teacher-report-persistence-rehearsal.md`,
and `docs/adr/0835-teacher-report-persistence-rehearsal.md`.

## 251. Teacher Report Rehearsal Surface Standard

- Teacher reporting and per-session report-package routes may expose the
  provider-neutral rehearsal result, readiness labels, and blockers.
- The surface must clearly distinguish contract alignment from live readiness;
  “review-only,” “no side effect,” and “live export blocked” remain visible.
- The surface must not offer a write, export, provider-selection, learner
  identity, policy-acceptance, or release-mutation control.
- MiniStar and partner tenants must use the same component and contract path;
  only tenant data and policy state may vary.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-908,
`docs/decision-register/DR-908-teacher-report-rehearsal-surface.md`,
and `docs/adr/0836-teacher-report-rehearsal-surface.md`.

## 252. Provider-Neutral Persistence Handoff Standard

- Before a real adapter is implemented, the platform must produce one
  provider-neutral handoff packet from the durable-record contracts, adapter
  write intents, and backend selection gate.
- The packet must show category coverage for hosted and local deployment
  channels, matching tenant-boundary keys, and unresolved policy or cost
  criteria. It must not invent readiness from a missing contract.
- A review packet may show "provider unselected," "writes blocked," and
  implementation blockers, but it must not select a vendor or expose storage,
  export, migration, backup, restore, billing, or policy-acceptance actions.
- Hosted PWA, local classroom, and closed companion paths remain alternate
  adapter channels over the same portable contract. None becomes the universal
  source of truth until the pilot gate is explicitly approved.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-909,
`docs/decision-register/DR-909-provider-neutral-persistence-handoff.md`,
and `docs/adr/0837-provider-neutral-persistence-handoff.md`.

## 253. Shared Persistence Handoff Validation Standard

- The persistence handoff packet schema and invariants belong in the shared
  content model, not only in a web component.
- Every handoff must prove that provider selection is null, the required
  review-only checks exist, live side effects remain disabled, and each
  tenant-bound persistence category has an explicit coverage row.
- Incomplete hosted, local, or durable coverage must be shown as a validator
  finding. The UI may summarize it, but may not hide or reinterpret it as
  readiness.
- Shared validation is evidence for implementation review only; it does not
  authorize a provider, storage write, export, migration, backup, restore,
  policy acceptance, or live student-data flow.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-910,
`docs/decision-register/DR-910-persistence-handoff-shared-validator.md`,
and `docs/adr/0838-persistence-handoff-shared-validator.md`.

## 254. Persistence Handoff Behavior Verification Standard

- Shared persistence handoff validation must be exercised behaviorally, not
  only checked through source markers or a successful typecheck.
- The runtime harness must prove a valid review-only packet, reject any
  provider value, and reject missing tenant-bound category coverage.
- The harness remains deterministic and provider-neutral; passing it proves
  contract behavior only and never authorizes storage, export, migration,
  backup, restore, billing, policy acceptance, or live student data.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-911,
`docs/decision-register/DR-911-persistence-handoff-behavior-verification.md`,
and `docs/adr/0839-persistence-handoff-behavior-verification.md`.

## 255. Review Navigation Key Stability Standard

- Review and pilot navigation lists must use stable keys that identify the
  rendered item, not merely its destination. Duplicate destinations are valid
  when they represent distinct adult-review actions.
- A route check proving HTTP success is not enough to prove React list safety;
  the review-list verifier must protect key construction for repeated links
  and repeated review evidence.
- Fixes in this lane must not change route authorization, teacher capture,
  classroom launch, or student progression behavior.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-912,
`docs/decision-register/DR-912-pilot-link-key-stability.md`,
and `docs/adr/0840-pilot-link-key-stability.md`.

## 256. Pilot Handoff Shared Validation Standard

- A partner pilot handoff is a contract boundary, not merely a presentation
  fixture; its schema and safety rules belong in the shared content model.
- Every handoff must remain review-only and must include tenant-bound entry,
  launch, and teacher-session routes with unique identifiers.
- The handoff must keep a blocked student-data policy decision visible before a
  classroom pilot; a complete-looking demo must not imply launch readiness.
- Validator findings may be shown to adult reviewers, but validation never
  authorizes storage, export, publication, policy acceptance, or classroom
  launch.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-913,
`docs/decision-register/DR-913-pilot-handoff-shared-validator.md`,
and `docs/adr/0841-pilot-handoff-shared-validator.md`.

## 257. Source-to-Package Assembly Standard

- Source extraction evidence must pass through an explicit assembly packet
  before it can be considered a canonical package draft candidate.
- Assembly packets must preserve tenant, source, extraction, checksum, target
  package, candidate unit, candidate media, and required-record identity.
- Draft creation, student-facing payload, and package promotion flags remain
  false until later approved workflows exist.
- A valid assembly packet proves contract completeness only; it never authorizes
  upload, extraction execution, storage, release, QR activation, or assignment.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-914,
`docs/decision-register/DR-914-source-package-assembly-contract.md`,
and `docs/adr/0842-source-package-assembly-contract.md`.

## 258. Evidence-Only Package Approval Standard

- Every source-to-package candidate must link to a tenant-scoped approval
  ledger before it can be discussed as a release candidate.
- Approval ledgers are shared content-model contracts, not web-only fixtures;
  they must enumerate content, media, games, QR, policy, deployment, and
  platform responsibilities.
- Foundation ledgers record evidence and open sign-off conditions only.
  Approval capture and package promotion remain explicitly blocked.
- A linked ledger improves traceability but never substitutes for rights,
  verifier, audio, persistence, school-policy, or release-control evidence.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-915,
`docs/decision-register/DR-915-evidence-only-package-approval.md`,
and `docs/adr/0843-evidence-only-package-approval.md`.

## 259. Package Readiness Reconciliation Standard

- A package candidate must expose one tenant-scoped evidence chain across
  source assembly, approval, verifier, target-language audio, media rights,
  publish, and assignment lanes.
- Readiness reconciliation is a decision record, not a publish command; it
  must remain review-only and must keep promotion and student activation false.
- Target-language activity remains the only progression authority. Support
  language, media engagement, and approval review cannot unlock progress.
- Every unresolved lane must remain visible so a polished demo cannot be
  mistaken for a production-ready package.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-916,
`docs/decision-register/DR-916-package-readiness-reconciliation.md`,
and `docs/adr/0844-package-readiness-reconciliation.md`.

## 260. Package Readiness Persistence Standard

- The seven-lane readiness chain must have a named tenant-scoped metadata
  record before a hosted or local persistence implementation is selected.
- Hosted and local deployments must preserve the same evidence references and
  must not infer release readiness from UI state, route state, or partial
  package records.
- A persistence intent is not a storage write: provider selection, writes,
  promotion, route/playlist/assignment changes, local bundle writes, and
  student activation remain false until later policy and implementation gates
  pass.
- The core record excludes raw learner audio, learner transcripts, and student
  data; future adapters must add authorization, retention, export, backup,
  migration, and rollback controls before activation.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-917,
`docs/decision-register/DR-917-package-readiness-persistence-intent.md`,
and `docs/adr/0845-package-readiness-persistence-intent.md`.

## 261. Package Readiness Backend Mapping Standard

- Every shared persistence intent must have an explicit provider-neutral schema
  entity, migration candidate, and migration specification before a provider
  can be selected.
- The backend map must preserve tenant/package/release-candidate scope, all
  required evidence references, hosted/local parity, and the target-language
  progression rule.
- A mapped schema is not an executed migration: provider selection, writes,
  package promotion, route/playlist/assignment changes, local bundle writes,
  and student activation remain blocked.
- Release-control records must exclude raw learner audio, transcripts, provider
  credentials, and student data unless a separate approved policy and storage
  contract exists.

This standard is recorded in `docs/DECISION_REGISTER.md` DR-918,
`docs/decision-register/DR-918-package-readiness-backend-mapping.md`,
and `docs/adr/0846-package-readiness-backend-mapping.md`.
