# DR-232: Partner Demo Upload Workspace Shortcut

## Decision

Expose `/teacher/uploads/sample-publisher` from the partner demo route using a route-contract helper.

## Why

The white-label partner demo should show source intake, private library, upload planning, media planning, games, printables, and teacher reporting as a connected package. Hiding upload planning in the global nav makes partner handoff less clear.

## Rules

- Partner demo shortcut links must use route-contract helpers where practical.
- Upload workspace remains teacher/admin preview-only.
- The shortcut does not imply live upload, storage, OCR, media processing, or student-facing uploaded assets.

## Follow-Up

When tenant routing moves to persisted route registry data, derive this shortcut from tenant package capabilities rather than static sample route links.
