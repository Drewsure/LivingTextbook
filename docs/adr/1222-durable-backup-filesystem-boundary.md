# ADR 1222: Durable Backup Filesystem Boundary

**Status:** Accepted  
**Date:** 2026-09-28

## Context

Durable backup and restore paths were lexically bound to the configured
backup custody root. Lexical containment does not protect a deployment when
an existing directory or artifact path is a junction or symlink to another
filesystem location.

## Decision

Backup and restore operations must validate the real filesystem boundary in
addition to the existing lexical policy. The configured root must already
exist as a directory; the nearest existing ancestor and any existing artifact
must resolve beneath that root. Junction and symlink escapes are rejected
before SQLite backup or restore work begins.

## Consequences

- Backup and restore custody is enforced against both path traversal and
  filesystem indirection.
- A deployment must provision the backup root before durable operations can
  become ready.
- The focused verifier may skip only the junction creation case when the host
  forbids creating junctions; lexical and existing-root checks remain required.
- No production backup, restore, or learner data is touched by verification.

## Verification

Run `npm run verify:foundation-composition` and the full `npm run
verify:foundation` gate.
