# DR-1319: Pilot Deployment Configuration Preflight

- **Date:** 2026-09-30
- **Status:** Accepted and implemented
- **Scope:** First saleable white-label pilot deployment handoff

## Decision

The deployment route now exposes a read-only operator preflight for hosted,
closed-local, and hybrid delivery. It checks tenant-bound upload and delivery
credentials, custody roots, local package read lanes, QR print origin, and the
optional persistence provider without exposing secret values or performing
writes.

## Why

The publisher needs a practical answer to “is this server configured for my
package?” before a package handoff or QR print rehearsal. The answer must be
useful to an adult operator while remaining unable to bypass review, release,
or student-activation gates.

## Rejected Alternatives

- Showing raw environment values in the browser.
- Treating a configured token as universal tenant authority.
- Enabling package assembly or persistence from the preflight.
- Declaring a closed-local package offline-ready from configuration alone.

## Follow-up

Production deployment must configure the required tenant allowlists and
server-side secrets, then complete the existing review, rights, release,
backup, and human browser rehearsal gates.

