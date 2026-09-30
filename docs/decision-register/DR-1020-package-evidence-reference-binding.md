# DR-1020: Package evidence reference binding

## Decision

The live publisher package-evidence review now records one bounded evidence
reference per reviewed lane. Complete package evidence requires all eight
canonical lanes and all eight corresponding references.

## Evidence

The content model validates reference identity and lane completeness; the
tenant API accepts only bounded lane/reference pairs; the review panel exposes
one reference field per lane; and the rehearsal verifies complete, incomplete,
unsafe, and activation-drift cases.

## Not authorized

The references are not file paths, download URLs, payloads, or release
approvals. Package assembly, QR printing, local delivery, hosted writes, and
student use remain blocked.
