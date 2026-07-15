# ADR 0241: Evidence Export Readiness Gate

## Status

Accepted.

## Context

Evidence packet review and handoff preview routes now define what reviewers need before a pilot can move forward. The next risk is premature export tooling: PDFs, JSON packets, local bundle manifests, email handoff, or signature capture could appear before identity, attachment storage, retention, and release-control policy are ready.

## Decision

Add an evidence export readiness gate to `/teacher/intake`. The gate names planned export formats, recipient lanes, identity/signature requirements, retention/policy requirements, and blocked actions while keeping all export and approval behavior disabled.

## Consequences

- Teachers/admins can discuss export expectations without mistaking the platform for export-ready.
- PDF, JSON, and local companion manifest outputs have clear prerequisites.
- Publisher, school, and platform recipient responsibilities are visible before sending evidence.
- Evidence export, signed approval capture, PDF generation, JSON export, downloadable ZIPs, email handoff, release-state mutation, and student assignment from export remain blocked.
