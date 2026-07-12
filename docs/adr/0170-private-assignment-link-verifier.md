# ADR 0170: Private Assignment Link Verifier

Date: 2026-07-12

## Status

Accepted

## Context

`/assign/[assignmentId]` is now the first safe sharing surface. Because it sits near public-link and embed expectations, it needs a foundation guard that keeps it private-first.

## Decision

Add `npm run verify:private-assignments` and include it in `npm run verify:foundation`.

The verifier checks sample assignment links, route contracts, active route coverage, route copy, and share/embed rules. It protects against accidental drift into public sharing, public community discovery, iframe embed behavior, teacher/admin exposure, or report-export overclaiming.

## Consequences

Private assignment link changes now have an automated foundation check. Public sharing and iframe embeds remain separate future work behind access, rights, moderation, reporting, retention, and origin-policy gates.
