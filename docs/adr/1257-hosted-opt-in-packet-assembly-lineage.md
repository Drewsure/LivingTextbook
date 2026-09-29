# ADR 1257: Hosted Opt-In Packet Assembly Lineage

- **Status:** Accepted for foundation implementation; release-blocked
- **Decision:** Preserve the hosted/local decision packet identity through
  metadata handoff records and local assembly records, and require runtime
  agreement before exposing the package.
- **Reason:** The final package writer is a separate boundary from the review
  workbench. Lineage must survive that boundary for a publisher to receive an
  auditable saleable pilot package.
- **Boundary:** Assembly lineage is not hosted activation and cannot create
  learner records or provider writes.
- **Exit evidence:** Metadata writer, local assembler, runtime reader, focused
  verifiers, typecheck, production build, and route rehearsal pass.
