# ADR 0327: AI Prototype Mobile Accessibility Report

## Status

Accepted

## Context

Returned prototypes from Z.ai or other outside builders may look exciting while still failing the real classroom context: phone-first QR launches, small hands, early readers, English learners, support-language text, and teacher-led review. Phaser or canvas prototypes add extra risk because polished visuals can hide inaccessible controls, clipped text, missing focus order, or wrapper state that bypasses the parent engine.

The platform also has a known visual risk from earlier testing: buttons can become dark with hidden text if component-level contrast and layout checks are not preserved.

## Decision

Add review-only AI prototype mobile accessibility reports to `/teacher/generator/sample-publisher` and `/teacher/generator/ministar`.

The report must show source records, viewport policy, learner control policy, readability policy, mobile viewport smoke evidence, touch target checks, keyboard and focus checks, readable text checks, visual stability checks, mode-level evidence, failure triggers, and blocked actions.

## Consequences

- Returned prototypes must prove phone-first layout, touch targets, focus order, visible text, and readable controls before integration review continues.
- Phaser and canvas wrappers must expose accessible DOM controls for critical learning actions.
- Visual polish cannot waive accessibility, readability, or parent-engine requirements.
- Student-facing preview, direct import into `apps/web`, route writes, and assignments remain blocked.
- MiniStar early Japanese support text must remain hiragana-readable and unable to unlock English progress.
