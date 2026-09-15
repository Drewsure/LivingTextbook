# DR-867: Audio Support Plan Authority

Learner game routes now pass the unit audio support plan into shared audio
coverage. `gameModeAudioCueIds` authorizes reviewed cross-mode reuse and the
mode plan defines the required cue families. This keeps the runtime gate strict
without requiring every activity to carry unrelated sentence audio. See ADR
0790.
