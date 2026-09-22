# DR-1023: Pilot Review Decision Retention Policy

Decision: require explicit tenant/package-bound retention, deletion, audit,
and school-policy evidence before production snapshot writes.

The core policy rejects raw audio and transcript retention and keeps all
review-decision persistence actions blocked until acceptance.

Evidence: `docs/adr/0951-pilot-review-decision-retention-policy.md`,
`packages/content-model/src/pilotReviewDecisionRetentionPolicy.ts`, and
`scripts/verify-pilot-review-decision-retention-policy.mjs`.
