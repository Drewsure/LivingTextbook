# DR-1175: Local Bundle Package Identity

- **Decision:** Require tenant, bundle, curriculum, series, book, and unit
  identity before the read-only local resolver can resolve routes or assets.
- **Reason:** A white-label package must remain bound to its own textbook scope;
  generic preview identifiers are not sufficient evidence.
- **Scope:** Local companion manifests, sample tenant package plans, and the
  read-only route/asset resolver.
- **Non-goals:** This does not enable file access, bundle writes, service
  workers, offline activation, learner-data persistence, or package promotion.
- **Verification:** `npm run verify:local-bundle` plus the full foundation gate.
