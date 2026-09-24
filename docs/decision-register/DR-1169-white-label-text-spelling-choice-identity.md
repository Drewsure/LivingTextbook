# DR-1169: White-Label Text/Spelling Choice Identity

Text/Spelling tile and answer-choice IDs must be deterministic and
position-based rather than derived only from learner-visible labels. This
prevents punctuation, spacing, and hyphenation variants from colliding while
preserving labels, audio, correctness, scoring, progression, and replay
behavior. Evidence: the Text/Spelling adapter, Fill in the Blank wrapper, and
the text/spelling runtime verifier.
