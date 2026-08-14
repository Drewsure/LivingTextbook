# DR-423: AI Prototype Wrapper Adapter Review Validator

Date: 2026-08-14

## Decision

AI prototype wrapper adapter reviews now use a shared content-model validator before fixture replay, event replay, audio coverage, scoring replay, app patch planning, route planning, package promotion, or assignment can be considered.

## Rationale

Outside prototypes, especially Phaser candidates, should contribute interaction quality without taking ownership of platform state. A shared wrapper validator keeps the boundary explicit: parent engines own routes, scoring, mastery, progress, rewards, audio manifests, tenant configuration, and assignments.

## Rules Preserved

- Wrapper reviews stay not-started, blocked, or review-only.
- Source records must include wrapper review, integration plan, return review, standard event contract, audio cue manifest, and scoring profile snapshot.
- Parent-engine boundaries must keep reviewed JSON, standard events, shared audio cues, injected tenant config, local-only interaction state, and platform-owned progress effects.
- Fixture inputs must include unit meta, pedagogy, audio cues, game mode config, scoring profile, and blocked actions.
- Standard event outputs must include game started, round shown, audio requested, answer submitted, answer result, mastery updated, and game completed.
- Direct app import, route writes, event bypass, scoring/audio mutation, tenant hard-coding, package promotion, assignment, and support-language progress triggers remain blocked.
- MiniStar wrapper reviews must preserve hiragana-only support-language evidence and block Japanese support-language scoring or release.

## Consequences

Teacher generator routes now surface `Wrapper guard active`, `Wrapper guard blocks`, and `Wrapper guard warnings`. `verify:ai-generator` fails if the shared validator, sample guard exports, or visible wrapper guard labels are removed.
