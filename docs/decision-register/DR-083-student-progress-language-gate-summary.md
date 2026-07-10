# DR-083: Student Progress Language Gate Summary

## Decision

Show English-listening progress and support-language unlock count in the student progress summary.

## Rationale

The launch flow already blocks completion until target-language items are heard. The student progress summary should display that same rule so the learner sees why the next game unlocks.

## Consequences

- Student progress summary now shows English listened count.
- Support unlocks remain visible and should stay zero.
- Teacher reports and student summaries use the same language-gate principle.

## Non-Goals

- Support-language scoring.
- Backend persistence.
- New rewards.
- Premium polish.
