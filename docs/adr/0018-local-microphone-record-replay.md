# ADR 0018: Local Microphone Record/Replay Before Speech Scoring

Status: Accepted

Date: 2026-07-01

## Context

The Living Textbook platform needs speaking games from the beginning, but automatic speech recognition, pronunciation scoring, transcript storage, and conversational AI introduce cost, privacy, safety, and infrastructure obligations. The platform also needs to support closed/local textbook companion deployments where reliable internet or premium AI entitlements may not exist.

## Decision

Add local browser microphone record/replay as the first active microphone capability, gated by teacher/school approval.

The control is intentionally limited:

- teacher approval controls whether local record/replay appears in Speak It,
- microphone permission is requested only after the learner taps `Record`,
- audio stays in the browser tab as a temporary object URL,
- the learner can stop, replay, and clear the recording,
- the system emits metadata that microphone practice occurred,
- no raw audio is uploaded,
- no raw audio is persisted by default,
- no transcript is generated,
- no pronunciation score is generated,
- no AI Tutor entitlement is required for local replay,
- recording alone does not complete a prompt or award progress.

The learner still completes the core prompt through the target-language `I said it` action. Later speech matching can replace or supplement that confirmation only after teacher/school privacy and premium entitlement rules are accepted.

## White-Label Impact

Positive. Every tenant can get a low-cost speaking-practice foundation, while schools or publishers that pay for premium speech services can later enable deeper assessment without changing the basic activity route.

## Cost Impact

Positive for the core product. Native browser recording avoids immediate speech service costs, cloud storage costs, and AI Tutor usage billing. Future speech-to-text and pronunciation scoring remain optional premium additions and may create API usage costs.

## Teacher Control

The first scaffold uses tenant microphone policy plus browser-local teacher approval storage:

- `/teacher` exposes the local microphone approval control.
- `Speak It` reads the teacher approval before showing record/replay controls.
- This local approval is a foundation scaffold, not production classroom persistence.
- Production launch/session settings must persist teacher approval before real multi-device classroom use.

## Constraints

- Do not ask for microphone permission on page load.
- Do not autoplay a learner recording.
- Do not show microphone controls when teacher approval is off.
- Do not upload or persist raw audio without a future privacy decision.
- Do not treat a recording as mastery by itself.
- Do not let assist-language text complete speaking practice.
- Keep the no-microphone classroom fallback available.
- Future speech scoring must use explicit tenant entitlement and teacher/school controls.

## Verification

- Open `http://127.0.0.1:3000/teacher`.
- Confirm the Microphone approval panel explains local replay cost and premium AI scoring cost.
- Toggle `Allow local mic` and open `http://127.0.0.1:3000/speak/demo-unit-1`.
- Confirm record/replay controls appear only when teacher approval is on.
- Confirm no microphone prompt appears on page load.
- Tap `Record` and confirm the browser asks for microphone permission.
- Say the English prompt, tap `Stop`, then tap `Replay`.
- Confirm `Clear` removes the temporary recording.
- Confirm the event log records microphone practice metadata.
- Confirm the spoken counter changes only when `I said it` is tapped.
