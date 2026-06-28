# Game Engine Contracts

This document defines the foundation for game implementation without building 48 isolated games.

It works with:

- `docs/PRINCIPLES_AND_STANDARDS.md`
- `docs/ROUTE_CONTRACTS.md`
- `docs/COMPONENT_STRUCTURE.md`
- `apps/web/src/features/game-shell/gameModeCatalog.ts`

## Core Rule

Do not build every mode as a separate product.

Game modes should be data-driven configurations of reusable parent engines. The early implementation should prove one simple mode chain before expanding the catalog.

## Parent Engines

| Parent engine | Responsibility | Early examples |
| --- | --- | --- |
| `pairing` | Match source and target items, handle pair validation, memory boards, and matching loops. | Memory Match, Word Match, Matching Pairs. |
| `selection` | Present prompts and selectable answers, handle state-based decisions and simple reflex choices. | Flashcards, Quiz, Balloon Pop, Whack-a-Mole shell. |
| `text-spelling` | Handle typed input, word ordering, spelling, and string validation. | Spelling, Type Answer, Sentence Builder, Anagram. |
| `narrative` | Track story/dialogue state, mission branches, boss runs, and mystery flows. | Mystery Detective, Boss Battle, Story Bridge. |

## Mode Catalog Contract

Each mode definition should eventually include:

- `id`: stable mode id.
- `label`: student/teacher readable name.
- `family`: pedagogical family.
- `engineId`: parent technical engine.
- `role`: entry practice, reinforcement, assessment, or review.
- `summary`: why this mode exists in the learning flow.

Current scaffold:

- Flashcard Practice: entry practice using the selection engine.
- Memory Match: reinforcement using the pairing engine.

## Required Engine Inputs

Every playable engine should receive:

- `UnitPayload`
- `LaunchSession`
- `StudentProgressionState`
- Tenant display configuration
- Mode configuration

## Required Engine Outputs

Every playable engine must emit standard `GameProgressEvent` records:

- `game_started`
- `round_shown`
- `answer_submitted`
- `answer_result`
- `powerup_used` when applicable
- `game_completed`
- `mastery_updated`

Entry practice may also emit:

- `entry_practice_completed`
- `game_unlocked`

## Current Pairing Scaffold

Implemented scaffold:

- `apps/web/src/features/game-shell/pairing/pairingEngineAdapter.ts` converts unit vocabulary into pairing items.
- `apps/web/src/features/game-shell/pairing/pairingEngineState.ts` creates deterministic pair cards and handles pure card-selection state transitions.
- `apps/web/src/features/game-shell/pairing/PairingEnginePreview.tsx` confirms that the active mode has pairing data and generated card state ready.
- Starting the Memory Match shell emits `game_started` through the local progression adapter.

Intentional limits:

- No visible Memory Match board yet.
- No board randomization yet.
- No animated mismatch reveal yet.
- No scoring loop beyond the flashcard entry reward yet.
- No full Memory Match gameplay yet.

## First Engine Build Candidate

The first real game engine candidate should be the `pairing` parent engine, implemented through Memory Match.

Reason:

- It is simple enough for Level 1 students.
- It directly follows flashcard entry practice.
- It exercises source/target pairing, completion, scoring, and unlock events.
- It can reuse ideas from legacy repositories without promoting legacy code directly.

## Research Gate

Before building a substantial engine, check `docs/FUTURE_REQUIREMENTS.md` FR-003 for public repository and best-practice research requirements.

Useful external ideas may be adopted only after license, maintenance, accessibility, mobile/PWA, and integration risks are reviewed.
