# Partner Demo Active Route List

## Purpose

The white-label partner demo page now lists the same active scaffold routes that the MiniStar teacher page exposes. This keeps the saleable platform story visible without requiring anyone to remember route paths manually.

## Current Partner Routes

- `/partner-demo`
- `/enter/sample-publisher`
- `/launch/partner-demo-unit-1`
- `/quiz/partner-demo-unit-1`
- `/sentence/partner-demo-unit-1`
- `/speak/partner-demo-unit-1`
- `/training/partner-demo-unit-1`
- `/teacher/sessions/partner-demo-unit-1`

## Boundary

These links are demo and verification aids. They do not replace permanent QR routing, package release approval, teacher assignment rollout, or backend persistence requirements.

## Acceptance Standard

- `http://127.0.0.1:3000/partner-demo` loads.
- The route list includes active game, recovery, and teacher monitor routes.
- Route paths are generated through shared route helpers where possible.
- The page still presents the sample publisher as a second tenant, not a MiniStar clone.
