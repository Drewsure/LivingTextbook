# 2026-07-17: Private Assignment Link Storage Contract

## Added

- Backend-neutral `private_assignment_link` schema contract.
- Migration candidate `m050-private-assignment-link-records`.
- Migration spec `spec-private-assignment-link`.
- Hosted and local adapter write intents.
- Durable record and persistence boundary.
- Backend and route verification hooks.

## Rule Preserved

Private assignment links are the first safe sharing lane. They do not create public sharing, public community discovery, iframe embeds, teacher/admin student-route controls, real learner data collection, or report export.
