# Unit Package Readiness Verification

Use this checklist after pulling `legacy-source-import` and running local typecheck/build.

## Route

Open:

- `http://127.0.0.1:3000/teacher/intake`

## Checks

- The page shows a `Unit package readiness` panel below the pilot readiness gate.
- The content-model validator rejects duplicate units, cross-tenant identifiers, orphan media/audio references, cross-unit playlist media, and multimedia bindings from another unit.
- The panel lists both the MiniStar sample package and the sample publisher package.
- Each package shows unit count, term/sentence count, game mode count, audio cue count, media count, assist-language count, and validation issue count.
- The package gates include reviewed source package, validated unit payload, audio-first learner support, media assets and rights, route and game coverage, assist-language review, and teacher release approval.
- Audio-first learner support is treated as a pilot blocker when cue coverage is missing.
- Assist language is marked as support only and must not be described as a progression unlock path.
- Placeholder media and media-rights handoff are visible as review work, not hidden behind a ready badge.
- The sample publisher package can remain draft or not QR-active without breaking the MiniStar sample package.

## Acceptance

A reviewer should be able to decide whether a specific tenant unit package is:

- safe for a static demo,
- ready for teacher review,
- blocked for live student data,
- or waiting on media/route/release work before pilot launch.
