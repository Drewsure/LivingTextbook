# ADR 0387: AI Generated Package Writer Harness Implementation Decision Storage Contract

Date: 2026-08-11

Status: Accepted

## Context

The generator route now shows a review-only package writer harness implementation decision preview.

Before any future decision capture or harness implementation is designed, the platform needs a backend-neutral record that preserves the required evidence, file scope, decision options, reviewer identity requirements, and blocked actions.

## Decision

Add `ai_generated_package_writer_harness_implementation_decision` / `ai-generated-package-writer-harness-implementation-decision` to schema drafts, migration candidates, migration specs, durable records, adapter write intents, validators, and route verification.

## Consequences

- A readable decision preview cannot become harness approval or code by accident.
- Hosted and local deployments use the same storage vocabulary.
- Writer tests, mutation browser runs, evidence uploads, signed approvals, app patches, route writes, playlists, local bundles, assignments, production QR mutation, and support-language-only implementation decisions remain blocked.
- MiniStar keeps English as the target-language assembly trigger while hiragana Japanese support remains support-only.
