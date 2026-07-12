# DR-173: Earned Collection Storage Contract

## Decision

Treat earned collection inventory as a first-class backend-neutral storage contract before choosing a backend vendor.

## Rationale

Avatar, room, cosmetic, title, companion evolution, palette, and power-up ownership are central to the Living Textbook engagement loop. These records must remain deterministic, mastery-earned, and portable across hosted and local deployments.

## Implications

- Durable records and adapter plans now include `collection-inventory`.
- Backend schema, migration candidates, and migration specs include earned collection inventory.
- Collection ownership must reference accepted mastery or completion events.
- Random pressure loops, paid gacha-like ownership, and purchase-like unlock states are blocked.

## Next

When real persistence is selected, map the collection inventory spec to the chosen hosted and local storage implementations with export, backup, retention, and student-identity policy.
