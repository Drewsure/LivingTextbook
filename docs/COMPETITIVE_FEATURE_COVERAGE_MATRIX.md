# Competitive Feature Coverage Matrix

Document type: strategic coverage matrix

Source basis: owner-provided notes from Wordwall feature and technology pages, reviewed as product inspiration rather than a feature-copy mandate.

Related:

- `docs/PRINCIPLES_AND_STANDARDS.md`
- `docs/FUTURE_REQUIREMENTS.md`
- `docs/BUILD_SESSIONS.md`
- `docs/UNIT_GAME_OFFER_MAP_CONTRACT.md`
- `docs/LOCAL_OFFLINE_BUNDLE_CONTRACT.md`

## Purpose

This matrix prevents foundation-stage blind spots. It does not mean Living Textbook should copy every competitor feature. It identifies which capabilities are core, planned, optional, not for v1, or a white-label risk.

## Status Legend

- `Core`: already foundational to the Living Textbook direction.
- `Planned`: important, but must wait for the correct build phase.
- `Optional`: useful as a premium, tenant-specific, or later feature.
- `Not for v1`: intentionally deferred.
- `White-label risk`: valuable only with strong governance, rights, privacy, or moderation controls.

## Coverage Matrix

| Competitor-style feature | Living Textbook position | Status | Foundation response |
| :--- | :--- | :--- | :--- |
| Fast activity creation | AI Authoring Studio plus human review should make unit/game package creation fast without bypassing validation. | Planned | Build reviewed package intake first; do not assign raw AI output to students. |
| Many activity types | Use reusable parent engines, game families, and mode configs instead of isolated games. | Core | Continue game-mode catalog, scoring, audio, and route verification. |
| Switch template | Use curated activity pathways and compatibility rules, not an unrestricted switch-anything panel. | Planned | Each unit should expose teacher-approved offers such as flashcards, Memory Match, quiz, sentence builder, Speak It, printables, or premium arcade modes. |
| Printable worksheets | Required for schools, homework, textbook partners, and low-device classrooms. | Planned | Add printable/PDF activity output as a future foundation slice. |
| Student assignments | Teacher QR/front-door launch, entry code, learner code, session monitor, and report package preview cover the same product need. | Core | Continue event taxonomy, teacher settings, roster, report export, and storage gates. |
| Teacher-led classroom play | Teacher launch protocol and QR onboarding are core. | Core | Preserve teacher-led and student self-progression from day one. |
| Student self-play | Student progression, unlocks, Training Academy, and earned rewards are core. | Core | Keep target-language progress as the unlock trigger. |
| Edit any activity | Teachers/tenants should edit reviewed package drafts before assignment. | Planned | Build edit/review workflow after package model and persistence are stable. |
| Visual styles and themes | Tenant branding and game skins are white-label requirements. | Planned | Build theme tokens/config first; premium style packs later. |
| Timer and difficulty options | Teacher controls should configure timing, difficulty, motion, and accessibility. | Planned | Add mode config fields before building many arcade variants. |
| Early reader visual style | Young-learner surfaces need readable type, stable layout, tap-to-speak, and calm controls. | Core | Keep early learner UI inspired by the strongest legacy MiniStar game-studio patterns. |
| Private teacher libraries | Tenant/private libraries can help schools reuse reviewed materials. | Planned | Build private tenant library before any public community marketplace. |
| Public community library | High upside, high moderation, copyright, privacy, and quality-control burden. | White-label risk | Not for v1; require rights, moderation, tenant isolation, reporting, and abuse policy first. |
| Share with teachers | Private sharing inside a tenant or school is useful. | Planned | Design after auth, ownership, and package versioning are selected. |
| Public sharing links | Useful but must not leak private tenant or student data. | Optional | Add only with access-control, package visibility, and rights policy. |
| Embed on websites | Useful for publishers and school portals. | Optional | Support only after route/security model is stable; assignment embeds must preserve reporting boundaries. |
| Activity customization | Game rules, visuals, timer, difficulty, audio, support language, background media, and premium features should be configurable. | Planned | Keep configs in package/tenant/mode contracts, not one-off screen state. |
| Printable plus interactive pairing | A unit should support both screen activity and printable companion output. | Planned | Add printable projection from the same reviewed payload. |
| Cloud hosting and CDN | Hosted PWA is recommended first pilot path. | Core | Keep deployment provider decision open until backend selection gate closes. |
| Local/closed app | Closed local companion is a first-class white-label path. | Core | Keep local bundle readiness gated by rights, checksums, installer/update, report export, and school policy. |
| Analytics and experiments | Useful but sensitive in child learning contexts. | Optional | Start with teacher-visible learning/report events; anonymized product analytics later with policy review. |
| Automated game bots/tests | Strong opportunity for game quality and template coverage. | Planned | Add automated play-through bots after parent-engine APIs stabilize. |
| AI layout/template conversion | Useful for printables and activity compatibility. | Optional | Use deterministic compatibility rules first; AI suggestions must be teacher-reviewed. |
| AI content generator | Core idea, but student assignment must be verification-gated. | Planned | Keep AI Authoring Studio JSON-first with verifier and teacher approval. |
| Japanese schools teaching Japanese | Plausible white-label market if Japanese is target language, not merely assist language. | Planned | Add target-language-agnostic content model requirements including kana, kanji, furigana, Japanese audio, and Japanese sentence segmentation. |

## Activity Pathway Standard

Living Textbook should prefer curated teacher-approved pathways over unrestricted template switching.

For each reviewed unit package, the teacher/admin package should name:

- required entry mode,
- recommended next modes,
- optional review modes,
- premium/teacher-enabled modes,
- printable companion outputs,
- blocked modes and why they are blocked,
- required audio coverage for every offered mode,
- support-language role,
- target-language progression trigger,
- teacher controls for timer, difficulty, background media, microphone, and AI Tutor.

This preserves the time-saving value of template switching while keeping young learner flow, reporting, and white-label governance stable.

The current sample implementation is recorded in `docs/TEACHER_AUTHORING_READINESS_CONTRACT.md`, `docs/ACTIVITY_PATHWAY_COMPATIBILITY_MATRIX.md`, `docs/PRINTABLE_OUTPUT_READINESS_CONTRACT.md`, `docs/PRIVATE_TENANT_LIBRARY_CONTRACT.md`, and shown on `/teacher/intake`.

## Community Library Standard

The first library model should be private and tenant-scoped.

Build order:

1. Private teacher drafts inside one tenant.
2. Tenant-approved package library.
3. School or publisher sharing inside the same tenant.
4. Cross-tenant marketplace or public community only after moderation, copyright, privacy, licensing, and quality systems exist.

Public community sharing is not a v1 requirement.

The current private library planning contract is recorded in `docs/PRIVATE_TENANT_LIBRARY_CONTRACT.md`.

## Japanese Target-Language Opportunity

Japanese assist language support for MiniStar English does not automatically make the platform a Japanese-learning platform. A Japanese school teaching Japanese would need Japanese as the target language.

Future target-language support should consider:

- target language set to Japanese,
- optional assist language set to English or another language,
- hiragana, katakana, kanji, and optional furigana/ruby display,
- Japanese audio cues and pronunciation models,
- kana/kanji typing support,
- particle and phrase segmentation rather than only English whitespace tokenization,
- level-aware script policy,
- handwriting or stroke-order games as optional future modes,
- Japanese teacher review and school-specific curriculum rules.

This is plausible and valuable for white-label expansion, but should be planned as a target-language expansion, not as an assist-language tweak.
