# ADR-0522: Approved Media Provenance And Locators

Status: Accepted

## Context

The Living Textbook content package supports hosted PWA, local classroom, and hybrid delivery. Media records already carry rights status, owner, hosted source, and local bundle fields, but package approval could previously succeed with no owner and no delivery locator. That would make a release record difficult to audit and impossible to resolve through the currently supported delivery boundaries.

## Decision

When a content package claims approved status, every media asset must have a non-empty owner name and at least one non-empty `sourceUri` or `localBundlePath`. The validator does not choose a storage vendor or deployment channel.

## Consequences

Approved packages have durable provenance and a usable delivery reference. Draft and reviewed packages can retain incomplete records as visible repair blockers. Hosted-only, local-only, and hybrid choices remain runtime and release decisions, with checksum, scan, storage, QR, and student-use gates still required.

