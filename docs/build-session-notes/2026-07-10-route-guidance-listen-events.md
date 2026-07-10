# 2026-07-10: Route Guidance Listen Events

## Work Completed

- Added `route_guidance_listened` to the shared progress event union.
- Added an optional play callback to audio cue buttons.
- Recorded recommended-route listen taps from launch and front-door flows.
- Surfaced route listen counts in student progress and teacher report summaries.

## Verification

- Run typecheck/build.
- Check `http://127.0.0.1:3000/launch/demo-unit-1`.
- Check `http://127.0.0.1:3000/enter/ministar`.
- Confirm route listen support does not unlock progress.

