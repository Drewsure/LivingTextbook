# DR-036: PWA Installability Foundation

Status: Accepted

Decision: Add a minimal PWA installability foundation before implementing offline caching, service workers, local sync, or tenant-specific app packaging.

White-label impact: Positive. A saleable platform should be installable and app-like, but the global manifest must stay tenant-neutral until tenant-specific deployment packaging is designed.

Cost impact: Positive. Manifest and metadata work is low-cost. Service worker, offline media caching, sync queues, update prompts, and local classroom storage are higher-cost and should wait for policy and persistence decisions.

Portability: Positive. The current manifest is a foundation that can later be generated per tenant or deployment channel.

Constraints:

- Do not hard-code MiniStar as the global app identity.
- Do not add offline caching or sync before storage, update, and rights policies are settled.
- Do not cache student data, raw learner audio, transcripts, or partner media without an accepted policy.
- Local/closed deployments remain first-class but require explicit packaging and update strategy.

Verification:

- See `docs/verification/PWA_INSTALLABILITY_CHECKS.md`.
