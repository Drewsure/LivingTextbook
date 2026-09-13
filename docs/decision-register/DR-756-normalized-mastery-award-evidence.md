# DR-756: Normalized Mastery Award Evidence

Canonical game components now write the adapter-returned
`result.earnedStarDust` into `mastery_updated` rather than repeating the local
requested award. This keeps mastery evidence aligned with the unit-cap-aware
completion event and progression state when several curated games are played.
See ADR 0684.
