# DR-1167: Pairing Round Event Semantics

Decision: one pairing attempt emits one `round_shown` event at first-card
selection. The second card emits the paired submission and result evidence;
card audio remains support-only.

Evidence: the Memory Match and Match Up wrappers, pairing runtime verification,
ADR 1167, and build session 1081.
