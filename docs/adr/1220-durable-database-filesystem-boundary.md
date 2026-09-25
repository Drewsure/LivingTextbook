# ADR 1220: Durable Database Filesystem Boundary

**Status:** Accepted  
**Date:** 2026-09-25

## Context

The durable SQLite path is now required to be lexically below the configured
data custody root. Lexical containment alone does not protect a deployment if
an existing directory or database file is a symlink or junction to another
filesystem location.

## Decision

Durable database readiness must validate both normalized path containment and
the real filesystem path of the existing root, nearest existing database
ancestor, and database file when present. A missing root, an outside-resolving
ancestor, or an outside-resolving database file blocks readiness. New nested
directories may still be created below an existing root by the SQLite adapter.

## Consequences

- Junction and symlink escapes cannot silently move learner data outside the
  reviewed custody root.
- The root must exist before durable readiness is reported.
- Process-memory rehearsal and pure lexical contract tests remain unchanged.

## Verification

`node scripts/verify-durable-progression-database-path.mjs` covers the
filesystem boundary and attempts a junction escape test where the host permits
junction creation.
