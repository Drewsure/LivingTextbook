# DR-770: Sentence Builder Canonical Entry Integration

Sentence Builder is now a canonical text-spelling activity in student and
front-door launch flows. Its reviewed target-language sentence and tile audio,
deterministic ordered-token scoring, replay, standard events, and shared
completion gate are reused.

The `round_shown` event is now emitted when a round appears rather than for
each tile tap. The current fixture supports English token normalization.
Japanese script-aware segmentation remains a separately reviewed
target-language expansion and is not implied by this promotion.

See ADR 0698, operating note OW-051, and the canonical integration verifier.
