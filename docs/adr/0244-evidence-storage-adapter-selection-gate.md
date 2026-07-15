# 0244 Evidence Storage Adapter Selection Gate

Status: accepted
Date: 2026-07-15

## Context

Evidence attachment metadata now exists as a backend-neutral contract. The next risk is prematurely choosing or implying a storage implementation before comparing hosted, local, and hybrid deployment needs.

## Decision

Add an evidence storage adapter selection gate to `/teacher/intake`.

The gate makes hosted managed evidence storage the recommended first-pilot candidate because it is the cheapest practical way to test tenant isolation, metadata/file separation, quarantine, checksum, malware scan status, access control, audit logs, and export/delete policy. Closed local evidence storage remains a first-class path for publisher-owned or school-local deployments, but it is higher complexity because it adds installer, backup, restore, offline scan, and update obligations. Hybrid archive movement is deferred until hosted and local adapters both pass the same evidence attachment contract.

## Consequences

- The build can continue with a cost-conscious hosted pilot path without abandoning closed local white-label needs.
- No storage vendor is selected by this slice.
- Buckets, local folders, signed URLs, uploads, downloads, migrations, retention clocks, and release-state changes remain blocked.
