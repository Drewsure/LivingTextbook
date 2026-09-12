# DR-715: Canonical Game Tenant Event Boundary

**Status:** Accepted

Shared canonical game event helpers now carry `LaunchSession.tenantId` into
event metadata, and the completion validator checks that metadata against the
tenant that owns the route. This hardens white-label isolation for Memory Match,
Balloon Pop, and future parent-engine wrappers.

The boundary does not enable persistence or approve frozen Phaser source. It
only prevents tenant drift inside the shared game evidence stream.
