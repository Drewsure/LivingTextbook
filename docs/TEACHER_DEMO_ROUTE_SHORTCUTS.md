# Teacher Demo Route Shortcuts

## Purpose

The teacher launch page now exposes direct demo shortcuts for the current scaffold routes. This makes local testing and partner walkthroughs faster without changing the production QR strategy.

## Current Routes

- `/launch/[code]`
- `/quiz/[code]`
- `/sentence/[code]`
- `/speak/[code]`
- `/training/[code]`
- `/teacher/sessions/[launchCode]`

## Boundary

These shortcuts are demo and verification aids. Printed textbook QR codes must still use the permanent route registry and package release process. A shortcut on the teacher page is not approval for production classroom release.

## Acceptance Standard

- The teacher launch page must load.
- All shortcut labels must fit on mobile.
- Shortcuts must use shared route helpers where available.
- The panel must not imply durable backend settings, permanent QR aliases, or real classroom report export.
