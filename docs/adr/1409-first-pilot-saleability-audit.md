# ADR 1409: First-Pilot Saleability Audit

## Status

Accepted for pilot operations.

## Context

The platform has extensive verified foundation and rehearsal evidence, but a
saleable pilot also requires real publisher files, an external game return
package, a delivery choice, and named human release decisions. A green route or
sample tenant must not be allowed to blur those boundaries.

## Decision

Add `npm run audit:pilot`. The audit reports proved platform checks separately
from human-owned gates, accepts explicit publisher and candidate roots, prints
exact next actions, and exits non-zero until every saleability requirement is
proved.

## Consequences

Operators have one honest status command for handoff meetings and release
reviews. The audit is read-only: it does not upload, assemble, release, print
QR codes, activate persistence, or enable students.
