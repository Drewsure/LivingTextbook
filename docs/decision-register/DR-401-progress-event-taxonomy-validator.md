# DR-401: Progress Event Taxonomy Validator

Date: 2026-08-11

## Decision

Progress event taxonomy rules are now enforced through a shared content-model validator before future game, media, speech, AI Tutor, reward, upload, reporting, assignment, or storage work can claim foundation readiness.

## Rationale

The platform is adding many event sources. Without one shared taxonomy guard, support-language taps, route guidance, background media, media playback, random reward ideas, and prototype game events could accidentally become mastery or Star Dust evidence.

## Rules Preserved

- Support-only events remain support-only and must explicitly block progress, mastery, Star Dust, or scoring effects.
- Report-only events remain visible to teachers without changing mastery.
- Progress-affecting events remain limited to reviewed entry practice, game unlock, answer result, game completion, and mastery update events.
- All events remain teacher-visible and persistence-required before pilot use.

## Consequences

Future routes and engines can add event records only after classification. The teacher intake page surfaces guard blocks and warnings, and `verify:taxonomy` fails if the shared taxonomy, sample registry, or visible panel drift from this rule.
