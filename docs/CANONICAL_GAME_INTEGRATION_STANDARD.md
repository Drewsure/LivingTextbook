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
- emit at least one meaningful `audio_requested` event after `game_started`
  during every accepted game attempt; the event must carry non-blank cue text,
  language, and supported cue kind, and remains support evidence only;
- send learning audio through `createAudioRequestedEvent` without granting
  mastery, unlocking, or Star Dust by listening alone;
- carry a deterministic `replay-v1` seed on game, audio, interaction, mastery,
  and completion evidence;
- complete through `completeGameMode`, with scoring identified by a named
  deterministic scoring profile; and
- leave route, progression, tenant scope, rewards, assignment effects, and
  persistence to the platform contracts.

Canonical game access is also progression-controlled. The shared playable
route shell must not self-unlock a mode because its URL was opened. A direct
game URL may remain visible for teacher review and route verification, but a
locked route must show the entry-practice gate and withhold the interactive
game component. This prevents direct URLs, Phaser wrappers, and future route
aliases from producing game-start or completion evidence before the teacher
QR -> flashcard entry step has succeeded. See ADR 0672 and DR-744.

Curated unit game offers must also agree with the shared game-mode contract.
Offer maps are reviewed for tenant scope, unique mode identity, parent family,
parent engine, ready-route presence, and audio/reporting requirements before
they are treated as clean package evidence. See ADR 0673 and DR-745.

The progression adapter must independently reject completion for a mode that
is absent from `unlockedGameModes`, even when a future wrapper or route calls
the adapter directly. The shell gate is a user-facing boundary; the adapter
check is the scoring and reward boundary.

When progression moves from entry practice to a curated game route, the
handoff must use the validated provider-neutral continuity envelope. It must
match tenant, package, launch, learner session, and unit identity, preserve the
unlock snapshot, and remain review-only until approved persistence exists. A
route or wrapper must not use URL state, support-language evidence, media-only
evidence, raw learner audio, or transcripts to establish progression.

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

For pairing modes such as Memory Match and Match Up, the canonical interaction
records `round_shown` before the first term-level `audio_requested` event.
Learning audio remains supporting evidence for the visible round; it cannot
represent an answer, mastery, or completion event. The integration verifier
guards this ordering so a future Phaser wrapper cannot silently change replay
semantics.

The shared event validator also rejects a replay whose `audio_requested` event
appears before `round_shown`. Candidate-package review applies the same rule,
so a returned external replay cannot pass on timestamps and identity alone.
It also closes the attempt at `game_completed`: learning-audio evidence after
completion is rejected so report consumers cannot attach late support activity
to a finished score.

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

The provider-neutral teacher report runtime applies the same gate when report
requests contain canonical game envelopes. Standalone `audio_requested` remains
support-only and does not create a game group. This keeps future hosted, local,
and hybrid report adapters aligned with the student completion boundary. See
ADR 0669, DR-741, and ADR 0676.

Repeated plays of a game mode are separate canonical report attempts. A new
`game_started` event closes the prior attempt for validation, so a retry cannot
be merged into or corrupt an earlier score. See ADR 0670 and DR-742.

The teacher sample report includes both a blocked partial attempt and a
complete retry. This positive-and-negative fixture proves that the report
surface recognizes valid canonical evidence without turning sample data into
exportable or persisted classroom data. See ADR 0671 and DR-743.

## Review Gate

Run `node scripts/verify-canonical-game-integrations.mjs`, the focused route
check, and the full `npm run verify:foundation` gate before accepting a new
canonical slice. The canonical verifier must remain green after every game
promotion.
