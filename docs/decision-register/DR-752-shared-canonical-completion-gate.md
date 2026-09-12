# DR-752: Shared Canonical Completion Gate

Standalone game routes and the QR student launch pathway now share
`validateCanonicalGameCompletion`. The gate filters evidence to the active
mode, rejects missing completion events, and delegates identity, replay,
chronology, event-order, and Star Dust checks to the shared canonical event
validator before progression changes. See ADR 0680.
