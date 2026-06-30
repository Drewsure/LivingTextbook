# ADR 0018: Local Microphone Record/Replay Before Speech Scoring

Status: Accepted

Date: 2026-07-01

## Context

The Living Textbook platform needs speaking games from the beginning, but automatic speech recognition, pronunciation scoring, transcript storage, and conversational AI introduce cost, privacy, safety, and infrastructure obligations. The platform also needs to support closed/local textbook companion deployments where reliable internet or premium AI entitlements may not exist.

## Decision

Add local browser microphone record/replay as the first active microphone capability.

The control is intentionally limited:

- microphone permission is requested only after the learner taps `Record`,
- audio stays in the browser tab as a temporary object URL,
- the learner can stop, replay, and clear the recording,
- the system emits metadata that microphone practice occurred,
- no raw audio is uploaded,
- no raw audio is persisted by default,
- no transcript is generated,
- no pronunciation score is generated,
- no AI Tutor entitlement is required,
- recording alone does not complete a prompt or award progress.

The learner still completes the core prompt through the target-language `I said it` action. Later speech matching can replace or supplement that confirmation only after teacher/school privacy and premium entitlement rules are accepted.

## White-Label Impact

Positive. Every tenant can get a low-cost speaking-practice foundation, while schools or publishers that pay for premium speech services can later enable deeper assessment without changing the basic activity route.

## Cost Impact

Positive for the core product. Native browser recording avoids immediate speech service costs, cloud storage costs, and AI Tutor usage billing. Future speech-to-text and pronunciation scoring remain optional premium additions.

## Constraints

- Do not ask for microphone permission on page load.
- Do not autoplay a learner recording.
- Do not upload or persist raw audio without a future privacy decision.
- Do not treat a recording as mastery by itself.
- Do not let assist-language text complete speaking practice.
- Keep the no-microphone classroom fallback available.
- Future speech scoring must use explicit tenant entitlement and teacher/school controls.

## Verification

- Open `http://127.0.0.1:3000/speak/demo-unit-1`.
- Confirm no microphone prompt appears on page load.
- Tap `Record` and confirm the browser asks for microphone permission.
- Say the English prompt, tap `Stop`, then tap `Replay`.
- Confirm `Clear` removes the temporary recording.
- Confirm the event log records microphone practice metadata.
- Confirm the spoken counter changes only when `I said it` is tapped.
