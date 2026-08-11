# DR-396: Assignment And Launch Activity Hub Navigation

Date: 2026-08-11

Status: Accepted

## Decision

Link private assignment previews and student launch pages to the curated activity hub for the same launch code.

## Rationale

The activity hub should be reachable from the student pathways teachers already use: QR launch and private assignment links. This keeps the reviewed route family visible without introducing a switch-to-anything template panel or teacher/admin controls on student pages.

## Impact

- Assignment contexts now carry an `activityHubPath`.
- Assignment previews show a secondary `Open activity hub` action.
- Student launch recommended-game guidance shows the reviewed activity hub route.
- Active route verification asserts the hub link appears from both MiniStar and sample publisher launch/assignment surfaces.

## Constraints

- The activity hub remains a curated navigation surface only.
- Opening the hub does not unlock progress.
- Target-language activity still triggers mastery.
- Media, print, support language, and route guidance remain support-only.

## Verification

- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
