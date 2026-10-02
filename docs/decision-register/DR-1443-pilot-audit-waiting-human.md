# DR-1443: First Saleable Pilot Audit Waiting-Human State

- **Decision:** Accept `waiting-human` as the truthful state after the production proof and foundation contracts pass.
- **Evidence:** `npm run audit:pilot` passes production-build, operator-handoff, and foundation-contracts, then waits for real publisher and release evidence.
- **Boundary:** Do not fabricate source, rights, delivery, review, QR, release, or final checksum evidence.
- **Next human inputs:** Publisher Unit 1 package, deployment choice, package-review evidence, named release approval, QR authorization, rollback evidence, and corrected Z.ai Memory Match evidence.

Related ADR: `docs/adr/1443-pilot-audit-waiting-human.md`.
