# DR-1208: Freeze Does Not Satisfy Candidate Return

The Z.ai frozen snapshot is provenance only. Memory Match candidate review now
requires a separate isolated package containing `evidence/return-package.json`,
all eight reviewed artifacts, and a passing canonical verifier. A successful
freeze cannot authorize source import, route activation, scoring, persistence,
promotion, or student assignment.

References: ADR 1208 and the 2026-09-25 freeze-versus-return-package build
session.
