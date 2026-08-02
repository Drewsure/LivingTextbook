# DR-325: AI Prototype Audio Coverage Report

## Decision

The platform will require a review-only AI prototype audio coverage report before returned prototypes can continue toward integration review.

## Rationale

Audio is part of the learning contract, not polish. Young learners and multilingual students need target-language tap-to-speak support for text they cannot yet read. Returned prototypes must therefore prove audio coverage before they can be considered for wrapper integration, especially for speaking and speech-matching games.

## Implementation Notes

- Generator routes expose the report for sample publisher and MiniStar tenants.
- Reports show target language, assist-language boundary, learning-audio priority, required cue families, target-language checks, control audio checks, support-language rules, replay evidence, and failure triggers.
- Required cue families include term audio, sentence audio, instruction audio, feedback audio, and critical control audio.
- The report references `prototype_audio_coverage_report`, `audio_cue_manifest`, `package_game_audio_coverage`, and `background_media_policy_binding`.
- Generated voice calls, voice API cost, audio manifest mutation, playlist writes, package audio-complete markers, media-only mastery, support-language progress, and assignments remain blocked.
- MiniStar reports keep Japanese support audio hiragana-only for early levels and unable to unlock English progress.

## Follow-Up

Completed by `DR-326-ai-prototype-audio-coverage-storage-contract.md`; future work should keep the report review-only until a backend or local storage adapter is selected.
