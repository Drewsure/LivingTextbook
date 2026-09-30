# DR-1307: QR Registry Bound Local Package

Closed-local and hybrid package assembly now requires an approved QR alias
registry record and stores it beside the generated QR print artifact. The
assembler and runtime validate tenant, package, version, manifest, receipt,
checksum, alias, and local fallback identity before accepting or serving the
package.

This binding improves recovery and print integrity but does not mutate routes,
activate students, enable hosted persistence, or close the human release gate.

See `docs/adr/1308-qr-registry-bound-local-package.md`.
