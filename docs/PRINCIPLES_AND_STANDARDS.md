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

## 11. Agent Standards

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

## 69. Audio Cue Semantic Coverage Standard

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

This standard is recorded in `docs/DECISION_REGISTER.md` DR-615 and `docs/adr/0543-progress-event-timestamps.md`.
