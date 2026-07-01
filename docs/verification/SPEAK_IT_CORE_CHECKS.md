# Speak It Core Verification Checks

Use this checklist after pulling `legacy-source-import` and restarting the local web app.

## Full Test Addresses

[http://127.0.0.1:3000/teacher](http://127.0.0.1:3000/teacher)

[http://127.0.0.1:3000/speak/demo-unit-1](http://127.0.0.1:3000/speak/demo-unit-1)

## Teacher Approval Checks

1. Open `http://127.0.0.1:3000/teacher`.
2. Confirm the page includes `Microphone approval`.
3. Confirm the panel states local record/replay has no API cost.
4. Confirm the panel states AI transcription or pronunciation scoring is premium and may create API usage costs.
5. Click `Keep mic off`, then open `http://127.0.0.1:3000/speak/demo-unit-1` and confirm record/replay controls are hidden.
6. Return to `http://127.0.0.1:3000/teacher`, click `Allow local mic`, then reopen `http://127.0.0.1:3000/speak/demo-unit-1` and confirm record/replay controls appear.

## Route Checks

1. Open `http://127.0.0.1:3000/speak/demo-unit-1`.
2. Confirm the page title says `Speak It` and the unit theme is visible.
3. Confirm no microphone permission prompt appears on page load.
4. Confirm the mode states that AI Tutor is off or not required.
5. Confirm the speaking progress summary appears.
6. Confirm each prompt has target-language audio support.

## Microphone Practice Checks

1. With teacher mic approval on, tap `Record` on one English prompt and confirm the browser asks for microphone permission.
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
- No microphone controls appear when teacher approval is off.
- No speech-to-text service is required.
- No pronunciation score is displayed.
- No transcript or raw audio is stored.
- No raw audio is uploaded.
- Recording alone does not complete a prompt.
- The mode remains usable without premium AI Tutor.
- Future AI speech matching must plug into this mode without removing the no-AI classroom fallback.
