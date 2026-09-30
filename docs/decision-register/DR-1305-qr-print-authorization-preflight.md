# DR-1305: QR Print Authorization Preflight

Bind future QR printing to a side-effect-free preflight that reconciles the
delivery manifest, approved release receipt, QR registry preview, checksum,
alias set, fallback paths, and rollback evidence. The preflight can report
readiness for a human decision but must keep print authorization pending and
must not write a registry, mutate routes, swap a package, or activate students.

See `docs/adr/1305-qr-print-authorization-preflight.md`.
