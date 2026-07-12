# DR-170: Private Assignment Link Verifier

Decision: Add `npm run verify:private-assignments` to the foundation gate.

Rationale: The private assignment route is intentionally close to the future sharing model. It needs automated protection so a convenient class link does not become public sharing, public community discovery, or an iframe embed without the required policy and access controls.

Implications:

- `npm run verify:foundation` now includes private assignment link checks.
- Active assignment links must remain student-facing and private-first.
- Teacher/admin controls, public sharing, iframe embeds, and report exports remain gated.

Next: Expand this verifier when assignment links become persistent records.
