# ADR 0371: AI Generated Package Writer Test Harness Implementation Proposal Storage Contract

Date: 2026-08-10

## Status

Accepted

## Context

Tenant generator routes now expose review-only package writer test harness implementation proposals. Those proposals name future module scope, implementation boundaries, review gates, dry-run-only checks, next records, and support-language boundaries before executable harness code can exist.

## Decision

Add a backend-neutral `ai_generated_package_writer_test_harness_implementation_proposal` schema contract and matching `ai-generated-package-writer-test-harness-implementation-proposal` durable record category.

Hosted and local adapters must preserve test harness plan links, test evidence packet links, module test plan links, proposed module scope, implementation boundaries, required review gates, dry-run-only checks, next records, blocked actions, and support-language boundaries. They must block harness implementation, automated writer test execution, writer mutation browser runs, evidence upload, signed approval capture, app file patches, generated package JSON writes, route registry writes, media playlist writes, local bundle packaging, assignment activation, production QR redirect mutation, and support-language-only harness passes.

## Consequences

- Future harness implementation has durable module-scope and review-gate requirements before code exists.
- Hosted and closed-local deployments share the same implementation-proposal vocabulary.
- This does not create a harness, run writer tests, upload evidence, capture signed approvals, patch app files, write packages, mutate routes, create playlists, package local bundles, activate assignments, or alter production QR redirects.
