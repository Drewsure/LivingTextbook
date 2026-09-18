# Evidence-Only Package Approval Checks

The approval linkage is accepted only when:

- the shared ledger validator requires tenant/package/release identity;
- content, media, games, QR, policy, deployment, and platform roles exist;
- ledger mode is `review-only` and state is `evidence-only`;
- approval capture and package promotion remain false;
- every source-package assembly packet links an approval ledger;
- runtime, source-review, typecheck, build, and active routes pass.

Passing this check does not authorize reviewer authentication, signed approval
storage, package promotion, route activation, QR mutation, assignment, or
student-facing release.
