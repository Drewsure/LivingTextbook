# ADR 1302: Bind the live quarantine release previews

## Decision

Every live publisher submission that reaches the package-readiness binding route
receives a review-only release preflight joining its delivery-manifest preview,
release-receipt preview, and package-index preview. The join is checked against
tenant, quarantine, package, manifest, receipt, delivery mode, and source
checksum identity.

## Rationale

The synthetic package already has a release preflight, but a saleable publisher
workflow must make the same identity check on the real quarantined submission.
This prevents a future operator from approving one preview while printing or
assembling another package version.

## Safety boundary

The live preflight is always blocked and review-only. It cannot write a release
receipt, assemble a package, persist QR aliases, print production codes, enable
hosted persistence, or activate students.
