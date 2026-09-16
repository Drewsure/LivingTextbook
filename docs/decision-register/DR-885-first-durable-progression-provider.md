# DR-885: First Durable Progression Provider

The first real storage slice uses a server-only SQLite adapter behind the
existing hosted progression contract. It is durable across process restarts,
tenant-scoped by composite identity, idempotent by continuity id, and guarded
by explicit provider, write, school-policy, retention, release, and
server-token gates. Process-memory rehearsal remains separate and is never
described as learner-data persistence. See ADR 0813.
