# ADR 1256: Hosted Opt-In Packet Release Receipt Binding

- **Status:** Accepted for foundation implementation; release-blocked
- **Decision:** Carry the hosted persistence opt-in packet identity through
  the manual release receipt, package index, metadata writer, and local
  runtime reader.
- **Reason:** A manifest-only binding could be lost at the final release and
  package boundaries. The receipt and runtime must preserve the same decision
  lineage before QR or package handoff is considered coherent.
- **Boundary:** The binding is metadata evidence, not permission to activate
  a provider or retain learner records.
- **Exit evidence:** Receipt, package-index, metadata-writer, and runtime
  binding checks pass alongside typecheck, production build, and route preview.
