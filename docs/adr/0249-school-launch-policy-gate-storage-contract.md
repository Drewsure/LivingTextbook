# 0249 School Launch Policy Gate Storage Contract

Status: accepted
Date: 2026-07-16

## Context

The school launch policy gate is visible on the teacher intake and classroom launch gate routes. A visible gate is not enough for a white-label platform because hosted and closed/local deployments need the same durable vocabulary before any policy acceptance workflow, launch-ready state, report export, or local activation can exist.

## Decision

Add `school_launch_policy_gate` as a backend-neutral durable record category.

The record preserves school, publisher, platform, and shared teacher dry-run ownership lanes. It blocks school policy acceptance workflows, live classroom launch, real learner data collection, teacher report export, local deployment activation, release-state mutation, launch-ready status, and support-language-only progression until the relevant policy, storage, evidence, release, and dry-run gates pass.

## Consequences

- Backend choice remains vendor-neutral while the school launch policy shape becomes stable.
- Hosted and local deployments share the same school launch policy gate vocabulary.
- Partner demos can stay polished without becoming school launch promises.
- No policy acceptance workflow, approval workflow, live launch, learner-data write, report export, local activation, or launch-ready mutation is enabled by this slice.
