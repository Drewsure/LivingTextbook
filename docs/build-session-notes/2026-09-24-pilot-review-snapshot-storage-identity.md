## Build session 1060: Pilot review snapshot storage identity

- Added explicit storage-selection preflight and evidence-storage gate identity
  to the provider-neutral pilot review snapshot.
- Added fail-closed matching against the embedded canonical pilot decision.
- Exposed storage identity in the persistence workbench snapshot cards.
- Added storage-identity drift runtime verification and route markers.
- Recorded ADR 1146 and DR-1146.

The snapshot remains a review record, not a persistence activation mechanism:
write, restore, export, activation, provider selection, learner data, and
release mutation remain blocked.
