# DR-812: Progress Envelope Stream Chronology Boundary

Require progress-event envelope streams to preserve non-decreasing
`occurred_at` order after individual timestamp validation. Out-of-order valid
entries fail closed before report or persistence interpretation; malformed
timestamps remain individual envelope errors. This keeps browser, Phaser,
report, and persistence adapters timeline-compatible without enabling live
writes or source promotion.
