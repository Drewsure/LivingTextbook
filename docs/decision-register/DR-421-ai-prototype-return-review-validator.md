# DR-421: AI Prototype Return Review Validator

Date: 2026-08-14

## Decision

AI prototype return review packets now use a shared content-model validator before wrapper integration, route planning, scoring changes, audio manifest changes, package promotion, student-facing previews, or assignment can be considered.

## Rationale

Returned Z.ai or outside-builder work can accelerate game exploration, including Phaser candidates, but returned code is only useful when it proves it can obey the LivingTextbook parent-engine contract. A shared validator keeps evidence, audio, scoring, accessibility, white-label configuration, and Codex review requirements consistent across tenants.

## Rules Preserved

- Return review packets remain not-submitted, blocked, or review-only.
- Returned artifacts must include source/manifest, JSON fixture, README, standard event sample, target-language audio map, and mobile evidence.
- Required evidence must prove source build brief lineage, reviewed JSON fixture use, standard events, target-language-first audio, deterministic scoring, and quarantine outside `apps/web`.
- Integration gates must include wrapper, fixture, event, audio, scoring, mobile accessibility, and white-label branding review.
- Every mode review must require fixture-driven boundaries, standard event adapter output, injected tenant configuration, target-language audio, deterministic scoring, mobile accessibility, and visible control text.
- Production merge, route writes, scoring mutation, audio manifest mutation, assignments, and student-facing previews remain blocked.
- MiniStar returns must preserve hiragana-only Japanese support evidence and block Japanese support-language scoring or release.

## Consequences

Teacher generator routes now surface `Return review guard active`, `Return review guard blocks`, and `Return review guard warnings`. `verify:ai-generator` fails if the shared validator, sample guard exports, or visible return-review guard labels are removed.
