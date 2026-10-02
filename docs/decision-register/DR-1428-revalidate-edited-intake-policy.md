# DR-1428: Revalidate Edited Intake Policy

Publisher intake preflight now revalidates language identifiers, duplicate
support-language declarations, delivery mode, and hosted-persistence policy
after the external brief is edited. This keeps a manually changed brief from
bypassing white-label delivery or storage rules while preserving the existing
review-only boundary.

See ADR 1428 and `docs/PUBLISHER_PILOT_INPUT_KIT.md`.
