# ADR 1265: Live Handoff Precedence

## Status

Accepted.

## Decision

When a real quarantine ID is present, render the live publisher handoff first
and label the remaining MiniStar/sample panels as static reference contracts.
The live handoff remains the authoritative view for tenant, quarantine,
package, checksum, evidence, delivery mode, release, and QR status.

## Rationale

Reference fixtures are useful for demonstrating the white-label platform, but
they must never be mistaken for a publisher's reviewed package. Precedence
reduces operator error during the first saleable pilot.

## Consequences

- Human reviewers see the real submission before any sample data.
- Route tests can continue to use stable reference fixtures when no quarantine
  ID is supplied.
- The live handoff must keep explicit blocked states until release evidence is
  independently complete.
