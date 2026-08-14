# DR-418: AI Generated Game Build Brief Validator

Date: 2026-08-11

## Decision

AI generated game build brief packets now use a shared content-model validator before external prototype handoff, issue creation, archive export, returned prototype review, wrapper planning, or package review can treat a brief as structurally valid.

## Rationale

External builders such as Z.ai can help the project move faster, including Phaser-based prototypes where appropriate. The risk is letting prototype choices define production architecture. The shared guard keeps parent engines, JSON fixtures, standard events, audio coverage, deterministic scoring, and integration authority inside LivingTextbook.

## Rules Preserved

- Build briefs must stay `review-only`.
- Required source records include request packet, engine binding plan, game mode catalog, standard event contract, audio cue manifest, gamification mapping, activity compatibility snapshot, and verifier submission.
- Every mode brief must include the required standard events.
- Target-language text remains the learning trigger.
- Visible text and critical controls require tap-to-speak or replay.
- Support-language audio remains support-only.
- Scoring must be deterministic and cannot create random rewards.
- Phaser is allowed only behind parent-engine wrapper review and the event contract.
- Standalone game promotion, generated route writes, scoring overrides, media-only progress, and student assignment remain blocked.

## Consequences

Teacher generator routes now surface `Build brief guard active`, `Build brief guard blocks`, and `Build brief guard warnings`. `verify:ai-generator` fails if the shared validator, sample guard exports, or visible guard labels are removed.
