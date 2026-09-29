# DR-1001: Closed-Local QR Fallback Resolution

Date: 2026-09-30
Status: Accepted

The local package writer now requires QR fallbacks to match the package-scoped
front-door route derived from tenant, package, version, and unit identity. The
bundle route and delivery manifest must agree with the printed QR artifact.
Generic `/launch/...` fallbacks are blocked until an explicit package resolver
exists. This keeps the first white-label pilot deterministic and prevents a
printed QR code from opening the wrong tenant or an unavailable route.

This is a foundation hardening decision, not a sale approval. Human publisher,
rights, device, installer, rollback, school-policy, and release evidence remain
required.
