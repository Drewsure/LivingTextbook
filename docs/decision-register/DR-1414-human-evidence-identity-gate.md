# DR-1414: Human Evidence Identity Must Gate Both Decisions

The saleability audit now requires the canonical human-evidence verifier to
prove identity binding before either the delivery-policy or release-
authorization gate can be marked proved. Tenant, package, unit, delivery mode,
and hosted-persistence choice must agree across both records. A negative
self-test covers identity drift so valid-but-mismatched records cannot be
treated as a saleable pilot. See ADR 1414 and
`docs/adr/1414-human-evidence-identity-gate.md`.
