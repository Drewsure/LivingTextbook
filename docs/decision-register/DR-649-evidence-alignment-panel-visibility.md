# DR-649: Evidence Alignment Panel Visibility

Status: Accepted

Decision: Teacher prototype review panels must use the shared collection-level
evidence-alignment validator and show duplicate packet identity as a blocked
review condition.

Guardrails:

- The panel remains read-only.
- Per-packet and collection-level errors are shown together.
- No prototype import, route replacement, scoring mutation, package promotion,
  playlist write, or assignment is enabled.

Related ADR: `docs/adr/0577-evidence-alignment-panel-visibility.md`
