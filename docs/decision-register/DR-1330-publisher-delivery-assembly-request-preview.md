# DR-1330: Publisher Delivery Assembly Request Preview

The live publisher handoff now exposes a review-only assembly request preview
that lists the seven identity-bound inputs required by the closed-local package
writer: manifest, release receipt, QR registry, package index, bundle manifest,
review packet binding, and operator timestamp.

This is an operator-facing evidence projection only. It remains blocked and
cannot write packages, create QR output, activate persistence, or start
students. See ADR 1331.
