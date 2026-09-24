# DR-1168: White-Label Selection Option Identity

Decision: Selection Engine option IDs must include deterministic round and
option position so punctuation and hyphenation variants cannot collide after
slugging.

Labels, audio text, correctness, scoring, progression, and tenant content
remain unchanged. Evidence: `selectionEngineAdapter.ts`, the selection runtime
verifier, ADR 1168, and build session 1082.
