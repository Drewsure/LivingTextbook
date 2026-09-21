# ADR 0928: Pilot Handoff Persistence Gate Evidence

Status: Accepted for review-only foundation

## Decision

Add a sanitized persistence-gate evidence record to the shared pilot handoff
package. It must be scoped to the same tenant, report package, and launch as
the handoff and must remain evidence rather than an activation command.

## Required invariants

- `writesAllowed` is always false in a handoff packet.
- Blocked and rehearsal states include safe blocker or explanation text.
- A ready status has no blockers and still does not authorize live behavior.
- Secrets, database paths, learner records, raw audio, and transcripts are
  excluded.

## Consequence

Publisher and school reviewers can see the real reason persistence is not yet
pilot-ready in the same package they use to review routes, media, release
evidence, and reporting. This reduces handoff ambiguity without opening live
storage.
