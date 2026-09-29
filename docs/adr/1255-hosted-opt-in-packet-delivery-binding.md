# ADR 1255: Hosted Opt-In Packet Delivery Binding

- **Status:** Accepted for foundation implementation; release-blocked
- **Decision:** Bind every hosted or hybrid pilot delivery manifest and
  package index to the exact hosted persistence opt-in decision packet.
- **Local exception:** Closed-local delivery records no hosted packet identity
  and remains a complete fallback lane rather than a partially configured
  hosted deployment.
- **Reason:** A manifest-level hosted boolean could otherwise drift away from
  the package-scoped human decision packet. The identity binding makes the
  commercial handoff auditable and prevents accidental hosted activation.
- **Exit evidence:** Delivery-manifest and package-index validation, local
  runtime summary propagation, focused verifier, typechecks, production build,
  and route preview pass. Human provider, policy, cost, and release evidence
  remain required for a saleable hosted pilot.
