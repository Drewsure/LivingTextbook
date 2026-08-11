# DR-388: AI Generator Summary Harness Decision Blocker

Date: 2026-08-11

Status: Accepted

## Decision

Surface `ai_generated_package_writer_harness_implementation_decision` in the top AI generator review summary for both sample publisher and MiniStar routes.

## Rationale

The generator route is intentionally evidence-rich, but the most important package writer blocker should be visible before a reviewer scrolls through the full package-review section.

## Impact

Teachers and admins see that package assembly, routes, playlists, assignments, and harness implementation remain blocked by the package writer harness decision gate.

MiniStar still shows English as the target-language pathway and keeps Japanese support-language release blocked.

## Verification

- `npm.cmd run verify:ai-generator`
- `npm.cmd run verify:foundation`
