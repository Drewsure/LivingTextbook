# DR-806: Canonical Completion Terminal Boundary

Treat `game_completed` as the terminal gameplay event. Post-completion
`game_started`, `round_shown`, `answer_submitted`, `answer_result`, or
`mastery_updated` events fail closed, while non-gameplay learning-audio replay
may remain available without reopening progression. This protects canonical
wrappers and future Phaser adapters from late gameplay mutations. See ADR
0732.
