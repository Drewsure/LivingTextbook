# DR-851: Dashboard Provider Boundary

The reusable dashboard consumes tenant-owned launch, package, offer-map, QR,
pilot, validation, and reporting data through props. Only the app/provider
boundary may compose MiniStar fixtures. This keeps white-label substitution
possible without forking dashboard layout or game pathway components.
See ADR 0774.
