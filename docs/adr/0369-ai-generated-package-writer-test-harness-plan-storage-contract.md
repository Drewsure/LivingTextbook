# ADR 0369: AI Generated Package Writer Test Harness Plan Storage Contract

Date: 2026-08-10

## Status

Accepted

## Context

Generator routes now expose review-only package writer test harness plans. Those plans name future dry-run phases, environment adapters, prerequisites, blocked harness actions, and support-language boundaries before any future package writer test harness can exist.

## Decision

Add a backend-neutral `ai_generated_package_writer_test_harness_plan` schema contract and matching `ai-generated-package-writer-test-harness-plan` durable record category.

Hosted and local adapters must preserve test evidence packet links, module test plan links, implementation readiness links, rollback drill links, harness phases, environment adapters, required-before-harness prerequisites, blocked harness actions, and support-language boundaries. They must block test harness implementation, automated writer test execution, writer mutation browser runs, evidence upload, signed approval capture, app file patches, generated package JSON writes, route registry writes, media playlist writes, local bundle packaging, assignment activation, production QR redirect mutation, and support-language-only harness passes.

## Consequences

- Future package writer test harness work has durable phase and adapter requirements before implementation can begin.
- Hosted and closed-local deployments share the same harness-planning vocabulary.
- This does not create a test harness, run writer tests, upload evidence, capture signed approvals, patch app files, write packages, mutate routes, create playlists, package local bundles, activate assignments, or alter production QR redirects.
