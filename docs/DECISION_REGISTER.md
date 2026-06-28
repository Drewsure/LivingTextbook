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

Decision: Treat permanent QR identifiers, content packages, local/closed app deployment, and a media/audio companion layer as first-class white-label requirements.

White-label impact: Strongly positive. This expands Living Textbook from a MiniStar-first school product into a saleable companion platform for textbook publishers, curriculum owners, schools, and private education brands.

Cost impact: Mixed but acceptable. The route registry, content package, media catalog, and packaging strategy add foundation work, but they prevent much more expensive rework after QR codes are printed or partner content is imported.

Portability impact: Positive if implemented through tenant/book/unit/activity identifiers rather than partner-specific pages. The same model can serve MiniStar, a colleague's textbook series, or a future publisher tenant.

Constraints:

- Printed QR codes must not point directly to local files, temporary localhost ports, or version-specific asset paths.
- QR payloads should resolve stable identifiers such as tenant, series, book, unit, activity, language, edition, and version.
- A local/closed app can be supported through an installed app, installed PWA, local classroom server, or similar package, but the tradeoffs must be documented.
- A tiny hosted redirect layer remains the recommended option when printed QR codes need true long-term external permanence.
- PDF-derived content must enter as draft content packages and require human review plus verifier checks before student assignment.
- The media/music platform is an asset and playback layer, not a hard-coded music page.
- See `docs/adr/0004-permanent-qr-and-local-companion-mode.md` and `docs/partner-strategies/LOCAL_TEXTBOOK_COMPANION_STRATEGY.md`.
