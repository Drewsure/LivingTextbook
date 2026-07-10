# ADR 0113: First Pilot Backend Selection Gate

## Status

Accepted

## Context

The platform needs real persistence for partner pilots, but the product is white-label and must support hosted, hybrid, and closed/local deployment models. Backend choice affects cost, privacy, export, QR permanence, media rights, and optional AI features.

## Decision

Add a visible backend selection gate to `/teacher/intake`. Keep the actual backend unselected until privacy, reporting, release-control, schema, migration sequence, deployment mode, and cost limits are reviewed together.

## Consequences

- The team can continue building durable contracts without locking into a provider too early.
- Cost and local-deployment compatibility stay first-class in pilot planning.
- Optional AI Tutor and speech scoring cannot silently become base-package storage obligations.

