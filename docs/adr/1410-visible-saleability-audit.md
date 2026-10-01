# ADR 1410: Show Saleability Audit In The Tenant Workspace

## Status

Accepted for the pilot operator experience.

## Context

The repository now has a fail-closed saleability audit, but operators working
from the tenant requirements page should not need to discover it elsewhere.
The page must communicate that a green platform foundation is not the same as
a released publisher pilot.

## Decision

Add a read-only audit command panel to `PublisherPilotInputKitPanel`. It names
proved platform evidence, waiting human evidence, and blocked actions while
remaining informational.

## Consequences

Publisher and school conversations have a shared status vocabulary. The panel
does not gain any upload, assembly, QR, persistence, release, or student
capability.
