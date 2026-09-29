# ADR 1266: Live Release and QR Closure Visibility

## Status

Accepted.

## Decision

Show the live quarantine preview's future release receipt and package-index
identities, together with an ordered blocked closure path, in the publisher
handoff. Keep all release, package assembly, QR printing, persistence, and
student-use actions disabled.

## Rationale

The first saleable white-label pilot needs an operator-readable path from
reviewed source material to a printable QR package. Showing the path early
reduces confusion without prematurely creating release artifacts or creating a
second approval mechanism.

## Consequences

- Reviewers can see which identities will bind the eventual package.
- The required human decisions remain visible in the correct order.
- The preview remains safe to use in demos and rehearsals because it cannot
  activate delivery or learner-facing behavior.
- A later release implementation must bind to these identities and preserve
  the same independent gates.
