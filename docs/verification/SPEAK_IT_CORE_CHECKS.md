# Speak It Core Verification Checks

Use this checklist after pulling `legacy-source-import` and restarting the local web app.

## Full Test Address

[http://127.0.0.1:3000/speak/demo-unit-1](http://127.0.0.1:3000/speak/demo-unit-1)

## Route Checks

1. Open `http://127.0.0.1:3000/speak/demo-unit-1`.
2. Confirm the page title says `Speak It` and the unit theme is visible.
3. Confirm no microphone permission prompt appears on page load.
4. Confirm the mode states that AI Tutor is off or not required.
5. Confirm the speaking progress summary appears.
6. Confirm each prompt has target-language audio support.

## Microphone Practice Checks

1. Tap `Record` on one English prompt and confirm the browser asks for microphone permission.
2. Say the English prompt aloud.
3. Tap `Stop` and confirm a replay-ready message appears.
4. Tap `Replay` and confirm the recorded audio plays locally.
5. Tap `Clear` and confirm replay becomes unavailable.
6. Confirm microphone events appear in the event log as local practice metadata.
7. Confirm no transcript, score, or AI Tutor feedback appears.

## Practice Checks

1. Tap each term or sentence and confirm audio plays or browser text-to-speech attempts playback.
2. Tap `I said it` after speaking the prompt aloud.
3. Confirm the spoken counter increases only from `I said it`, not from Japanese assist text or microphone replay.
4. Confirm repeated taps on completed prompts do not double-count.
5. Complete every vocabulary term and both target sentences.
6. Confirm Star Dust is awarded after completion.
7. Confirm the event log records `round_shown`, `answer_submitted`, `answer_result`, `mastery_updated`, and `game_completed`.

## Boundary Checks

- No microphone permission prompt occurs before `Record` is tapped.
- No speech-to-text service is required.
- No pronunciation score is displayed.
- No transcript or raw audio is stored.
- No raw audio is uploaded.
- Recording alone does not complete a prompt.
- The mode remains usable without premium AI Tutor.
- Future AI speech matching must plug into this mode without removing the no-AI classroom fallback.
