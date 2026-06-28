# ADR 0002: Local Progression Before Persistence

Status: Accepted

Date: 2026-06-28

## Context

The first Living Textbook student flow needs to prove that teacher QR launch, flashcard entry practice, completion events, game unlocks, and Star Dust updates work as a coherent route experience.

It is tempting to introduce database tables, auth, classroom rosters, and live teacher monitoring early. That would add substantial build cost before the core interaction is proven.

## Decision

Build the first interactive student progression slice with local component state and a small app-level progression adapter.

Do not introduce database persistence, full authentication, classroom rosters, or live monitoring until the route behavior and event contract have been proven.

## White-Label Impact

Positive.

This avoids locking tenant, school, classroom, or student-account assumptions into database structure too early. The platform can prove the flow first, then design persistence around the verified contract.

## Cost Impact

Positive.

Local state is cheap to build and easy to change. It lets the team validate interaction flow before paying the complexity cost of backend services, account management, migrations, security rules, and operational support.

## Implementation Boundary

Current slice:

- `/launch/[code]` receives a sample launch session.
- Student completes flashcard entry practice.
- App records `entry_practice_completed` locally.
- App records `game_unlocked` locally for the next recommended mode.
- Student progression state updates with earned Star Dust.

Not included yet:

- Persistent saved progress.
- Authentication.
- Classroom roster linkage.
- Teacher live dashboard.
- Full Memory Match gameplay.
- Premium visual reward presentation.

## Revisit Criteria

Revisit this decision when:

- The first interactive slice works and has been visually checked.
- At least one real game mode emits standard progress events.
- Teacher monitoring needs data from multiple student sessions.
- Saved progress becomes necessary for student return flows.
- Tenant-specific data isolation requirements are clear.

## Consequences

The build stays fast and flexible, but progress resets on refresh until persistence is introduced. That is acceptable for this phase because the purpose is to prove the route and event contract, not to operate a classroom yet.
