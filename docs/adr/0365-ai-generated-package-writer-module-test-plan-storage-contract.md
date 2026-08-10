# ADR 0365: AI Generated Package Writer Module Test Plan Storage Contract

Date: 2026-08-10

## Status

Accepted

## Context

Generator routes now expose review-only package writer module test plans. Those plans name the module-level test suites, fixtures, assertions, evidence, and blocked test actions needed before a future generated package writer can be considered.

## Decision

Add a backend-neutral `ai_generated_package_writer_module_test_plan` schema contract and matching `ai-generated-package-writer-module-test-plan` durable record category.

Hosted and local adapters must preserve implementation readiness links, rollback drill links, package id previews, module test suites, required fixtures, required assertions, required evidence, blocked test actions, and support-language boundaries. They must block automated writer test execution, writer mutation browser runs, app file patches, generated package JSON writes, route registry writes, media playlist writes, local bundle packaging, assignment activation, production QR redirect mutation, and support-language-only test passes.

## Consequences

- Future package writer implementation work has durable test-plan evidence before any writer tests can run.
- Hosted and closed-local deployments share the same module test vocabulary.
- This does not create runnable writer tests, app file writes, package JSON writes, route mutation, playlist creation, local bundle packaging, assignment activation, or production QR redirect mutation.
