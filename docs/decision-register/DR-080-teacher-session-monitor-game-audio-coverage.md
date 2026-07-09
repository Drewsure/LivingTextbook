# DR-080: Teacher Session Monitor Game Audio Coverage

## Decision

Show assigned game audio coverage in the teacher session monitor.

## Rationale

Audio coverage is already visible before release, assignment, rollout, and session preflight. The teacher report surface should also show whether assigned games are audio-covered so a teacher can understand the launch state without searching other panels.

## Consequences

- Teacher session context now includes audio-covered game modes and assignment audio gaps.
- The assigned game path in the monitor labels each mode as audio-covered or needing review.
- The monitor remains sample-data only and does not imply production persistence.

## Non-Goals

- Backend writes.
- Raw learner audio storage.
- Speech scoring.
- Premium polish.
