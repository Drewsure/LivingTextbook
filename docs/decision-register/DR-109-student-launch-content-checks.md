# DR-109: Student Launch Content Checks

## Decision

Active route verification should confirm that both student launch routes render `Unit media`.

## Reason

Unit media is now part of the core Living Textbook flow for MiniStar and sample publisher packages. A route returning 200 is not enough if the package media shortcut disappears.

## Standard

- `/launch/demo-unit-1` checks for `Unit media`.
- `/launch/partner-demo-unit-1` checks for `Unit media`.
- The check remains lightweight and supplements visual browser review.
