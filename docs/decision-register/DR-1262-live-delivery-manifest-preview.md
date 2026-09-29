# DR-1262: Live Delivery Manifest Preview

Date: 2026-09-29
Status: Accepted

The real quarantine handoff now derives a tenant- and package-bound delivery
manifest preview from its live source, evidence review, package review packet,
and source checksum. It names the future delivery manifest, release receipt,
and package-index identities and exposes checks for evidence, package review,
delivery mode, package preview, release receipt, and QR authorization.

The preview is deliberately always blocked, review-only, and side-effect-free.
It cannot write a manifest, assemble a local package, print QR codes, activate
hosted persistence, or expose student use. This closes the traceability gap
between live intake and the eventual controlled delivery writer without
pretending that the publisher package is already released. See ADR 1262.
