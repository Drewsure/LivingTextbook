# DR-1187: Explicit Upstream Identity Carriage

Decision: require the assist-language audio decision-snapshot adjudication
record to carry exact reconciliation, reviewer-gate, and controlled human-
review packet IDs. The same IDs are shown in the media review and the main
release-control room.

This prevents a UI summary or composite label from hiding upstream identity
drift. All operational actions remain blocked.

Verification: `npm run verify:assist-language-audio-catalog-release-decision-snapshot-binding`.
