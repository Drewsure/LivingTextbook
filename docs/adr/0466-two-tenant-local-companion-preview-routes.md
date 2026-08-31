# ADR 0466: Two-Tenant Local Companion Preview Routes

Status: Accepted

Date: 2026-08-31

## Context

The local companion package preview existed for the sample publisher tenant, but the flagship MiniStar tenant also has a local bundle manifest. Both tenants need visible local-package review routes so the school product and white-label textbook product can be evaluated against the same closed-companion package expectations.

## Decision

Add a MiniStar local companion preview route at `/local/ministar` and keep the sample publisher route at `/local/sample-publisher`. Both routes must remain review-only and use the same local companion package preview panel.

## Consequences

- MiniStar and partner local package previews can be compared from browser verification.
- The active route list covers both local companion examples.
- Local bundle verification now requires both local companion preview routes.
- Local package work stays tenant-configurable without turning MiniStar into the universal product shape.

## Still Blocked

- No local package export.
- No installer.
- No offline-ready claim.
- No local student-data retention.
