# DR-1099: Persistence Payload Shape Bounds

- Shared persistence validators bound identifiers, routes, metadata, event
  streams, and progression mode lists before provider storage or reporting.
- Browser requests, server-created records, provider reads, and replay
  evidence use the same fail-closed shape rules.
- The 128 KiB request limit remains a separate transport safeguard.
- No provider selection, live write, raw learner audio retention, transcript
  storage, or school rollout is enabled by this decision.

References: ADR 1099, Build session 1013, FR-057, and the runtime behavior
regression.
