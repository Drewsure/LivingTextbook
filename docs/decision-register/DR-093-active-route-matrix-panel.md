# DR-093: Active Route Matrix Panel

## Decision

Show a compact active route matrix on `/teacher/intake`.

## Reason

The route verification list is useful for engineering, but teacher/admin review needs the current scaffold routes visible in the app. This helps non-technical checks without turning scaffold routes into production promises.

## Standard

- The matrix lists only representative active scaffold/demo routes.
- Focused Training Academy routes are visible.
- Stable QR aliases are distinguished from ordinary scaffold routes.
- Production QR readiness remains governed by route registry, print readiness, publish gates, and approval ledgers.

