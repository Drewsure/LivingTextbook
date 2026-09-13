# DR-755: Progression Adapter Identity Gate

The local progression adapter now checks `unitKey`, `launchCode`, and
`studentSessionId` against the launch session before entry completion, game
start, or game completion. A mismatch produces no start event, no completion
event, no unlock, no score, and no Star Dust. The shared helper is exported
from the content model so future providers and wrappers can use the same
rule. See ADR 0683.
