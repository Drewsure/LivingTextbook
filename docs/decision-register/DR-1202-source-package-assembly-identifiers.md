# DR-1202: Source Package Assembly Identifiers

Source-package assembly now validates bounded safe identities for its packet,
tenant, source, package, extraction, approval-ledger, candidate-unit, and
candidate-media fields. Namespaced unit keys remain supported while path-like
identities are rejected before reconciliation. See ADR 1202.
