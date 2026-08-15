# DR-133: Local Companion Bundled Game Routes

## Decision

Add bundled game route summaries to local companion manifests and the local companion preview route.

## Reason

A closed textbook companion must include games, not only media and QR fallback. The local package should show which reusable engine routes are included or planned, whether audio coverage exists, and whether each route reports standard progress events.

## Standard

- `/local/sample-publisher` shows `Bundled game routes`.
- Local manifests include game id, label, mode, engine id, route path, status, audio coverage, report-event support, and note.
- Local game routes must preserve audio-first behavior and standard progress events.
- Match Up is treated as the visible pairing bridge before hidden Memory Match recall in local companion manifests.
- Speak/microphone routes remain teacher/school policy gated.
- The generated manifest snapshot includes local game route metadata.
