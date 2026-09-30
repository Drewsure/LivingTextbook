# DR-1320: Pilot Operator Gate Sequence

Date: 2026-09-30  
Status: Accepted

The deployment workbench now presents an ordered, read-only operator sequence
bound to the exact tenant, package, and delivery mode. It exposes the next
human gate and separates server configuration blockers from manual publisher,
school, and shared review gates.

The sequence cannot accept evidence, enable a write gate, mutate QR routes,
activate persistence, or start students. `writesEnabled` and
`studentActivationAllowed` remain false. This is an operational handoff aid,
not a release approval.

See ADR 1321 and `docs/PILOT_EXECUTION_RUNBOOK.md`.
