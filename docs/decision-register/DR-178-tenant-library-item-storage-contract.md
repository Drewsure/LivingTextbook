# DR-178: Tenant Library Item Storage Contract

## Decision

Treat tenant library items as first-class backend-neutral records.

## Rationale

Private tenant libraries are commercially important, but reusable resources must keep ownership, rights, and source lineage attached. Library records must not copy student data or enable public community publishing before governance exists.

## Implications

- Durable records and adapter plans include `tenant-library-item`.
- Backend schema, migration candidates, and migration specs include tenant library items.
- Library records preserve source lineage and rights snapshots.
- Student data copying and public community publishing remain blocked.

## Next

Map tenant library item storage to the selected backend after authentication, teacher ownership, package versioning, rights snapshots, and school sharing policy are accepted.
