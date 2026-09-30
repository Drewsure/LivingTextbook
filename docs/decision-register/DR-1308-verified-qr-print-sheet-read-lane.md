# DR-1308: Verified QR Print Sheet Read Lane

The assembled QR print artifact now carries an HTML checksum. The local
runtime validates that checksum and exposes the exact immutable print sheet
through a bounded, separately gated route. Missing, changed, or detached HTML
fails closed; the route cannot mutate aliases, activate students, enable
hosted persistence, or write learner records.

This improves the publisher handoff for the closed-local pilot without
confusing artifact retrieval with production print authorization.

See `docs/adr/1309-verified-qr-print-sheet-read-lane.md`.
