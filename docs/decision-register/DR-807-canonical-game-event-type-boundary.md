# DR-807: Canonical Game Event Type Boundary

Require canonical game event evidence to use the shared `GAME_EVENT_TYPES`
content-model vocabulary. Unknown runtime event strings must fail closed before
sequence ordering, completion, reporting, or progression evidence is accepted.
This protects DOM games, future Phaser wrappers, imports, and teacher report
evidence from silent taxonomy drift. The change does not authorize live
persistence, route activation, source promotion, or student assignment. See ADR
0733.
