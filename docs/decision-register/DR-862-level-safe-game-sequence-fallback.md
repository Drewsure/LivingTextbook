# DR-862: Level-Safe Game Sequence Fallback

`GameSequence` now filters its no-offer-map fallback through the game catalog's
`supportedLevels` list. Curated offers remain authoritative and downstream
audio, progression, and route safety gates remain required. See ADR 0785.
