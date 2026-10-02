# DR-1440: Runtime Source-Review Non-Leakage

The active route verifier now checks the rendered generic source-review route
for reference-tenant source labels, identifiers, and media records. A passing
HTTP response and empty-state copy alone are not sufficient tenant-isolation
evidence. The check remains read-only and does not enable extraction or source
promotion.

See ADR 1440 and `scripts/verify-active-routes.mjs`.
