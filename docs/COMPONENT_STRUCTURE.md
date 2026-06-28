# Component Structure

This document records the first clean structure for the white-label Living Textbook web app. It follows `docs/PRINCIPLES_AND_STANDARDS.md`: foundation first, polish later.

## Layers

- `packages/content-model` owns shared platform types, sample payload validation, game event names, and Star Dust calculations.
- `packages/ui` owns small reusable UI primitives with stable dimensions and accessible defaults.
- `apps/web` owns the Next.js application shell, routes, tenant configuration, and feature composition.

## App Boundaries

- `apps/web/src/app` contains routes only.
- `apps/web/src/components` contains app-level reusable layout.
- `apps/web/src/features` contains domain features: teacher launch, student onboarding, game shell, progression, and tenant config.
- `apps/web/src/data` contains static seed data until live persistence is chosen.

## Current Rule

No legacy component is promoted directly into the canonical app until an explicit integration plan exists.
