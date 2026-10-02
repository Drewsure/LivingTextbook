# DR-1432: Clarify Publisher Audit Blockers

The first-pilot audit now labels a well-formed but incomplete source handoff as
`incomplete` rather than `invalid` and names required missing files when the
durable evidence records them. Existing evidence remains immutable and all
release gates remain fail-closed.

See ADR 1432 and `docs/PILOT_EXECUTION_RUNBOOK.md`.
