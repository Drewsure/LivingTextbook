# DR-1017: Pilot delivery release preflight

## Decision

Add a review-only preflight binding the delivery manifest, delivery release
receipt, and QR alias registry preview before any future release writer or QR
printing workflow can be considered.

## Scope

The preflight checks tenant, package, version, manifest, receipt, QR preview,
and source assembly identity. It reports unresolved requirements and forces all
operational flags to false.

## Not authorized

This decision does not authorize release receipt writes, production QR printing,
route mutation, student activation, hosted persistence, or learner-data storage.

## Follow-up

An authorized human release design must supply durable QR registry evidence,
rollback evidence, release approval, and a separate authenticated write boundary.
