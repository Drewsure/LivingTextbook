# DR-1409: First-Pilot Saleability Audit

- **Decision:** Add `npm run audit:pilot` as the single fail-closed status
  report for the first saleable white-label pilot.
- **Reason:** Separate strong platform evidence from the real publisher,
  Z.ai, delivery-policy, and human-release evidence still required.
- **Boundary:** Read-only reporting only; no file promotion, package assembly,
  QR printing, persistence activation, or student use.
- **Verification:** Run `npm run audit:pilot -- --json` and confirm missing
  human inputs remain non-success until their evidence is supplied.
