# Z.ai Evidence Request: Balloon Pop

**Status:** Ready for controlled evidence handoff after Memory Match review
**Repository scope:** `Drewsure/ministar-lab` only
**Source snapshot:** `frozen-2026-09-12-aaa-stable`
**Source commit:** `eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`
**Target LivingTextbook mode:** `balloon-pop`
**Parent engine:** `selection`

## Authority

Codex owns LivingTextbook architecture, schema discipline, event taxonomy,
audio policy, scoring, mastery, rewards, persistence, reporting, routes, and
the final wrapper decision. Z.ai is being asked to produce isolated evidence
for a candidate, not to modify the LivingTextbook application.

## Task

Prepare a review-only Balloon Pop candidate package in
`Drewsure/ministar-lab`. Use the frozen Balloon Pop scene as source context,
but keep the returned work isolated in a clearly named candidate folder. The
package must prove whether the timing-and-targeting interaction can sit behind
the LivingTextbook `selection` contract.

Do not copy anything into `Drewsure/LivingTextbook`. Do not create a production
merge, route replacement, student assignment, database, auth, billing, or live
telemetry integration. Return evidence for this named candidate only.

## Input contract

Use a JSON fixture with:

- `unit_meta.tenant_id`
- `unit_meta.level`
- `unit_meta.theme`
- `unit_meta.game_mode: "balloon-pop"`
- `unit_meta.engine_id: "selection"`
- `pedagogical_payload.vocabulary_terms` containing 8-12 reviewed terms
- `pedagogical_payload.target_sentences` containing exactly 2 structures
- reviewed target-language `audio_cues` for every learner-facing cue
- a platform-supplied deterministic `replay-v1:` seed

Do not assume exactly 12 terms. Do not hard-code MiniStar, Cloud Dog, Star
Kid, English-only speech, or any tenant's colors, art, or reward names.

## Required behavior evidence

1. Show one bounded target-selection challenge at a time.
2. Accept touch and keyboard interaction with a readable semantic fallback.
3. Make every visible term, instruction, feedback message, and critical
   control listenable through the reviewed target-language cue manifest.
4. Keep background music/SFX separate from learning audio.
5. Make target order, balloon placement, timing, and replay outcomes
   deterministic from the supplied seed.
6. Prevent duplicate submission for one target and record misses explicitly.
7. Keep score, mastery, Star Dust, collection, identity, persistence, and
   teacher reporting outside the scene.
8. Respect reduced-motion behavior and responsive touch-target constraints.

## Required event replay

Provide a JSON replay containing, in valid nondecreasing timestamp order:

- `game_started`
- `round_shown`
- `audio_requested`
- `answer_submitted`
- `answer_result`
- `game_completed`
- `mastery_updated`

Every learning event must carry the same tenant, unit, launch/session identity,
and `replay-v1` seed. Audio remains support evidence and must not unlock
progress by itself.

## Required return package

Return these files inside the isolated candidate folder:

- `README.md` with setup, controls, dependencies, known limits, and wrapper
  boundary notes.
- `evidence/return-package.json` with frozen source identity, request and
  queue identifiers, `targetMode: "balloon-pop"`, `parentEngine: "selection"`,
  target surface, eight reviewed artifact records, and all blocked actions.
- `fixtures/balloon-pop-unit.json` with the reviewed fixture.
- `evidence/event-replay.json` with the standard event sequence.
- `evidence/scoring-replay.json` proving deterministic correct, incorrect,
  miss, retry, and completion outcomes without random rewards.
- `evidence/audio-map.json` covering terms, instructions, feedback, and
  critical controls in the target language.
- `evidence/accessibility.md` covering keyboard, focus, touch targets,
  readable fallback behavior, reduced motion, and small-screen checks.
- `evidence/source-manifest.sha256` listing every candidate source file used
  in review with repository-relative paths and SHA-256 hashes.
- `evidence/wrapper-notes.md` mapping Phaser lifecycle and interaction facts to
  the LivingTextbook selection adapter without importing platform code.

The return package artifact records must use these kinds exactly once:
`source-archive`, `fixture`, `readme`, `event-replay`, `audio-coverage`,
`scoring-replay`, `mobile-evidence`, and `wrapper-notes`. Each record must
include a reviewed status, safe repository-relative path, and SHA-256 checksum.

## Rejection conditions

Reject or refactor the package if it:

- writes learner identity, progress, rewards, or reports to browser storage;
- owns canonical score, mastery, Star Dust, or collection decisions;
- posts directly to a fixed telemetry endpoint;
- uses non-deterministic target order or motion without replay evidence;
- lacks target-language audio coverage;
- has no keyboard, touch, or readable fallback path;
- changes LivingTextbook files or creates a student-facing route;
- includes unclear-license assets or unreviewed tenant-specific art.

## Codex review gate

When the package is returned, Codex will verify source identity, fixture shape,
event replay, audio coverage, deterministic scoring, accessibility evidence,
tenant safety, and wrapper boundaries. A complete package may receive
`approved-for-wrapper`; that status still does not authorize direct source
import, route replacement, scene-owned scoring, or persistence ownership.

Codex can verify the returned folder locally with:

```powershell
$env:LIVING_TEXTBOOOK_ZAI_CANDIDATE_ROOT = "C:\path\to\isolated\balloon-pop-candidate"
npm run verify:phaser-candidate-package
```

No package is supplied to the foundation gate by default; a missing candidate
folder is a not-ready handoff, not a production failure.
