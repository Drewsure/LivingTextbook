# Canonical Game Integration Standard

## Purpose

This is the standing contract for every student-facing game slice in the
Living Textbook platform. A game may have a distinctive interaction or visual
skin, but its identity, audio evidence, scoring, mastery, completion, and
teacher reporting remain platform-owned.

## Required Boundary

Every canonical game route must:

- use the shared playable route shell and its tenant, unit, launch, and student
  session identity;
- start only through `startUnlockedGameMode`;
- emit `game_started`, `round_shown`, `answer_submitted`, `answer_result`,
  `mastery_updated`, and `game_completed` in the required order;
- send learning audio through `createAudioRequestedEvent` without granting
  mastery, unlocking, or Star Dust by listening alone;
- carry a deterministic `replay-v1` seed on game, audio, interaction, mastery,
  and completion evidence;
- complete through `completeGameMode`, with scoring identified by a named
  deterministic scoring profile; and
- leave route, progression, tenant scope, rewards, assignment effects, and
  persistence to the platform contracts.

The playable route shell treats the shared event validator as an acceptance
gate. If completion evidence is missing or invalid, the route reports the
contract errors and pauses progression, Star Dust, and next-activity state.
The validator also requires all answer activity to finish before mastery or
completion, preventing late submissions from changing a completed result.
Canonical events must also carry valid nondecreasing `occurredAt` timestamps;
timestamp order is part of replay and report integrity. See ADR 0668 and DR-740.

## Determinism And Accessibility

Game state may own round selection and interaction state, but it must not own
`localStorage`, `sessionStorage`, random reward logic, or an alternate student
identity. Semantic DOM controls and tap-to-speak text remain available even
when a future Phaser or canvas skin is reviewed.

## Phaser And External Prototypes

Phaser, Z.ai, and other outside prototypes remain tenant-scoped review
artifacts until their candidate packet demonstrates this contract. A future
wrapper may provide motion, physics, or richer presentation, but it may not
bypass the parent engine, shared event adapter, audio policy, scoring profile,
or route shell.

Every external candidate must also record its source repository, immutable
snapshot identifier, and exact 40-character source commit SHA. The snapshot
label is useful for human review, but the commit SHA is the reproducibility
authority. A missing or malformed commit identity keeps the candidate in
review-only status and blocks source import, route replacement, and package
promotion.

The packet must include a repository-relative source-file manifest with a
64-character SHA-256 hash for every file used as review evidence. File hashes
prove what was inspected without making external source part of the product
build. The manifest is evidence, not a license or an integration approval.
Every finding reference must resolve to one of those manifest paths; a free-
floating line citation is not sufficient evidence.

The shared event-sequence validator independently enforces replay-v1 evidence
on every required learning event and every audio-request event. Component
string checks are useful diagnostics, but they are not the authority for
runtime acceptance.
The runtime behavior harness exercises both a valid canonical sequence and a
rejected sequence with missing replay evidence.

Every external candidate also carries an explicit wrapper approval decision.
Candidates are blocked by default; `approved-for-wrapper` means only that a
platform-owned wrapper may be reviewed. It never authorizes direct source
import, route replacement, scene-owned scoring, or persistence ownership.
The runtime behavior harness validates this gate with a blocked candidate
fixture and rejects an approval that still contains blockers or missing
evidence.

Teacher report previews and future report adapters must also validate canonical
game evidence by unit, launch, learner session, and mode. Generic event-envelope
validity is not enough to call a game attempt report-ready: the grouped sequence
must pass the shared learning-event, replay, tenant, launch, identity, and
completion checks. Incomplete sample groups remain visible as blocked review
evidence. See ADR 0667 and DR-739.

## Review Gate

Run `node scripts/verify-canonical-game-integrations.mjs`, the focused route
check, and the full `npm run verify:foundation` gate before accepting a new
canonical slice. The canonical verifier must remain green after every game
promotion.
