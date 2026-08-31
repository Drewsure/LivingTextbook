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

The platform must not assume English is always the target language. MiniStar English uses English as the progression trigger, but a white-label Japanese-learning tenant could configure Japanese as the target learning language. That future path requires kana, kanji, optional furigana/ruby text, Japanese audio, Japanese segmentation, and level-aware script policy.

Storage decisions must remain backend-neutral until the relevant school or tenant policies are accepted. The first pilot should prefer the cheapest practical hosted managed storage path unless a partner explicitly requires a closed local install. Closed local and hybrid storage must remain supported product directions, but they require installer, backup, restore, encryption, update, retention, and export procedures before activation.

## 11. Teacher And Student Experience Standards

The platform must support both teacher-led classroom use and student self-progression from day one.

Teacher-led requirements:

- Teacher can select or approve a unit.
- Teacher can launch by QR code.
- Teacher can see the Teacher Launch Protocol.
- Teacher can monitor completion and mastery.
- Teacher can monitor media engagement separately from language-game mastery.
- Teacher can confirm audio support exists for learner-facing text before assignment.
- Teacher can trigger or recommend Training Academy review.
- Teacher or school can enable premium AI Tutor only when the tenant has adopted that package.

Student self-progression requirements:

- Student can enter through a QR route.
- Student can enter through a front-door login flow where a tenant requires entry code and user code.
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
