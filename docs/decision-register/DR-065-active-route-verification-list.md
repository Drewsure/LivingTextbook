# DR-065: Active Route Verification List

## Decision

Keep the local sync runbook, verification index, and main verification checklist aligned with every active scaffold route.

## Rationale

The platform now has multiple student, teacher, game, and recovery routes. If the route list drifts, local verification becomes inconsistent and future agents may miss broken slices.

## Consequences

- Quiz, Sentence Builder, Speak It, Training Academy, and partner equivalents are part of the regular local smoke path.
- New active routes should update the verification route list in the same session.
- Future route additions must distinguish demo scaffold checks from production QR approval.

## Non-Goals

- Requiring exhaustive manual gameplay testing after every small documentation change.
- Treating scaffold route smoke checks as pilot release approval.
