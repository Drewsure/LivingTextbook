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
- Confirm rewards use earned collection mechanics, not gambling-like pressure.
- Confirm any Z.ai or outside AI output must obey schema, component, integration, and review standards before adoption.
- Confirm no legacy code is promoted into `apps/web` or `apps/ai-service` without an explicit integration plan.
- Confirm changes are compatible with the current `docs/BLUEPLAN.md` unless a documented standards update is intentionally made.

If any item cannot be confirmed, stop and record the exception before continuing.

## 2. North Star

The Living Textbook platform is a premium, white-label, saleable PWA learning portal.

MiniStar English Lab is the first complete tenant, the flagship curriculum, and the proof-of-value implementation. Its curriculum, game progression, and classroom needs should guide the build, but the underlying architecture must support other schools, academies, publishers, and curriculum owners.

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
- Keep tenant branding separate from hard-coded MiniStar assumptions.
- Build mobile-first and QR-classroom friendly.
- Keep student surfaces simple enough for young learners.
- Use stable dimensions for game boards, cards, counters, controls, and rewards so animation or dynamic text does not shift the layout.
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

A game mode is not platform-ready until it can participate in teacher launch, student progression, scoring, and review flows.

## 6. Progression And Collection Standards

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

## 7. Star Dust Standard

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

## 8. AI Authoring Standards

The AI Authoring Studio generates structured curriculum/game payloads, not final ad hoc game code.

Required content rules:

- Default 8 vocabulary terms
- Allowed range 8-12 vocabulary terms
- Exactly 2 target sentence structures
- Level-appropriate vocabulary and syntax
- Game-mode-aligned payloads
- Teacher Launch Protocol included
- JSON-first output
- Verification before student assignment

The Vision/Verifier layer must check:

- Term count validity
- Sentence count validity
- Level match
- Game mode match
- Tenant visual rules
- Tenant brand rules
- Forbidden motifs or visual drift
- Schema validity

No generated payload should be assigned to students until it passes verification or teacher approval.

## 9. White-Label Standards

Tenant configurability is a first-class requirement.

The following must not be hard-coded as global assumptions:

- MiniStar branding
- Cloud Dog / Star Kid motifs
- MiniStar color palette
- MiniStar reward names
- MiniStar curriculum sequence
- MiniStar visual blacklist rules

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
- QR launch route

## 10. Teacher And Student Experience Standards

The platform must support both teacher-led classroom use and student self-progression from day one.

Teacher-led requirements:

- Teacher can select or approve a unit.
- Teacher can launch by QR code.
- Teacher can see the Teacher Launch Protocol.
- Teacher can monitor completion and mastery.
- Teacher can trigger or recommend Training Academy review.

Student self-progression requirements:

- Student can enter through a QR route.
- Student can complete an entry practice flow, usually flashcards.
- Student can unlock the next recommended game mode.
- Student can see progress, Star Dust, and reward movement.
- Student can return without a heavy login burden, especially for younger learners.

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
- Accessibility requirements
- Mobile/PWA requirements
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
- Does this use earned collection rather than pressure-based reward loops?
- Does this keep games data-driven?
- Does this report or preserve standard scoring/progress events?
- Does this avoid promoting legacy code without a plan?
- Does this remain compatible with `docs/BLUEPLAN.md`?

If the answer to any item is no, document the reason before merging.

## 15. Operational Memory And Workaround Standard

Repeatable procedures and workarounds must be documented so future engagements do not rediscover the same constraints.

Required practice:

- Product, architecture, and build rules belong in this document.
- Major accepted decisions belong in `docs/DECISION_REGISTER.md` and, when useful, `docs/adr/`.
- Repeatable environment constraints, connector procedures, branch-state notes, and tool workarounds belong in `docs/OPERATING_NOTES.md`.
- Route and flow contracts belong in focused design documents such as `docs/ROUTE_CONTRACTS.md`.

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

Do not let standards live only in chat history. If a rule matters, preserve it here.
