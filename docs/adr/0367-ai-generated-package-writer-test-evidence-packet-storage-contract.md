# ADR 0367: AI Generated Package Writer Test Evidence Packet Storage Contract

Date: 2026-08-10

## Status

Accepted

## Context

Generator routes now expose review-only package writer test evidence packets. Those packets name fixture, route/QR, audio/media, local/assignment, rollback, and support-language evidence lanes before any future writer test harness can exist.

## Decision

Add a backend-neutral `ai_generated_package_writer_test_evidence_packet` schema contract and matching `ai-generated-package-writer-test-evidence-packet` durable record category.

Hosted and local adapters must preserve module test plan links, implementation readiness links, rollback drill links, evidence lanes, source records, required evidence, acceptance checks, missing evidence, blocked evidence actions, and support-language boundaries. They must block automated writer test execution, writer mutation browser runs, evidence upload, signed approval capture, app file patches, generated package JSON writes, route registry writes, media playlist writes, local bundle packaging, assignment activation, production QR redirect mutation, and support-language-only evidence passes.

## Consequences

- Future writer test harness work has durable evidence-lane requirements before tests can run.
- Hosted and closed-local deployments share the same evidence packet vocabulary.
- This does not create writer tests, evidence upload, signed approval capture, app file writes, route mutation, playlist creation, local bundle packaging, assignment activation, or production QR redirect mutation.
