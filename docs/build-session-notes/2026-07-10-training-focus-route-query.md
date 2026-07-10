# 2026-07-10: Training Focus Route Query

## Work Completed

- Added optional focus query support to Training Academy routes.
- Updated recovery trigger links to include the recommended focus.
- Added safe fallback for unknown focus values.

## Verification

- Run typecheck/build.
- Check `http://127.0.0.1:3000/training/demo-unit-1`.
- Check `http://127.0.0.1:3000/training/demo-unit-1?focus=sentence-review`.

