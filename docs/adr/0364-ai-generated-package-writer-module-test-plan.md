# ADR 0364: AI Generated Package Writer Module Test Plan

Date: 2026-08-09

## Status

Accepted

## Context

Package writer implementation readiness is now visible and preserved as a backend-neutral storage contract. The next risk is allowing a future writer implementation to exist before its module-level test evidence is named.

## Decision

Add a review-only AI generated package writer module test plan to tenant generator routes after implementation readiness. The plan names required test suites for the content package writer, route registry writer, media playlist writer, local companion writer, assignment shell writer, and release rollback guard.

The plan must remain blocked. It cannot execute tests, patch app files, write generated package JSON, mutate route registries, create playlists, package local bundles, activate assignments, mutate production QR redirects, or accept support-language-only test passes.

## Consequences

- Future package writer implementation work gets explicit module-level test expectations first.
- Hosted and closed-local deployments can share the same test vocabulary.
- This does not create a runnable test harness or any writer implementation.
