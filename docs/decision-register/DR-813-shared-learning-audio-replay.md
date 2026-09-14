# DR-813: Shared Learning-Audio Replay Handoff

Require the playable route shell to pass its canonical replay seed into the
shared learning-audio contract. Shell-level `audio_requested` evidence must
carry the same seed as mounted game evidence, preventing mixed replay streams
without enabling live writes or source promotion.
