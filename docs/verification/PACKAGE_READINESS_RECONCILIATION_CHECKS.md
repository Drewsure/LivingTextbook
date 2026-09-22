# Package Readiness Reconciliation Checks

Package readiness reconciliation is the canonical review-only evidence
chain for a candidate package.

The package readiness chain is accepted only when:

- source assembly, approval, verifier, target-language audio, media rights,
  publish, and assignment evidence each have a tenant-scoped reference;
- source assembly and structured extraction preview tenant, package, preview
  ID, and checksum identity agree;
- composite readiness lineage rejects candidate-unit scope drift across the
  readiness, assembly, and extraction preview records;
- composite readiness lineage rejects malformed normalized text and summary
  output before later package evidence can pass;
- every reconciliation remains review-only and blocked from promotion;
- target-language activity is the only progression authority;
- support language cannot unlock progress;
- the teacher intake route shows unresolved lanes and blocked actions;
- shared runtime validation, typecheck, build, and active-route checks pass.

The reconciliation must explicitly preserve these blocked actions:

- No package promotion from reconciliation.
- No student-facing activation from reconciliation.

Passing this check does not authorize package writes, route registry changes,
playlist writes, local bundle writes, assignments, or student-facing
activation.
