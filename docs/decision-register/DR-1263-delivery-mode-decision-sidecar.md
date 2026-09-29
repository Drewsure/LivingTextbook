# DR-1263: Delivery Mode Decision Sidecar

**Status:** Accepted

**Decision:** Add an immutable review-only delivery-mode sidecar to each real
publisher quarantine submission. It records `closed-local`, `hosted-pwa`, or
`hybrid` and propagates that choice into the live manifest preview.

**Safety boundary:** The sidecar cannot select a provider, activate hosted
persistence, assemble a package, print QR codes, release a package, or authorize
student-facing use. Those remain independent gates.

**Reason:** Saleable white-label pilots need a clear deployment shape while
preserving honest separation between planning, evidence, cost/policy review,
and irreversible release actions.

**Verification:** The focused delivery-mode verifier and publisher-intake
rehearsal must pass, and the full foundation composition must include the
focused verifier.
