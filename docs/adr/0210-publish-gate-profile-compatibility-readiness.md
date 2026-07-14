# ADR 0210: Publish Gate Profile Compatibility Readiness

Date: 2026-07-14

## Status

Accepted

## Context

The platform now has durable contracts for activity compatibility snapshots, template rendering profiles, and font accessibility profiles. Those records must affect release control, not only backend readiness.

## Decision

Add a release-blocking package publish gate item for activity compatibility and rendering profiles.

The gate requires reviewed `activity_compatibility_snapshot`, `template_rendering_profile`, and `font_accessibility_profile` records before pathway changes, rendered variants, printables, tenant font packs, or extra conversions become student-facing.

## Consequences

A package can remain demo-visible while these records are open, but it cannot be marked pilot-publishable. Switch-to-anything panels, unchecked printable or puzzle conversion, and unapproved font use remain blocked at release time.

