# ADR 0001: Tailwind And PostCSS Foundation

Status: Accepted

Date: 2026-06-28

## Context

The web app needs a real styling pipeline before layout and component structure can be verified. The platform also needs to remain white-label, cost efficient, and easy for future builders or AI agents to extend.

The risk is not Tailwind itself. The risk is using Tailwind as a shortcut for scattered, tenant-specific styling that later makes the platform hard to sell beyond MiniStar.

## Decision

Use Tailwind with PostCSS for `apps/web`, while keeping tenant branding behind `TenantConfig` and CSS custom properties.

This gives the project a practical styling foundation now without buying into a heavy commercial component system or a premature design-token service.

## White-Label Impact

Positive.

Tenant-specific values live in configuration, not in shared primitives. MiniStar can have its own colors, reward name, avatar family, and curriculum identity while the platform remains reusable for other schools, publishers, or branded learning products.

## Cost Impact

Positive.

Tailwind and PostCSS are widely known, inexpensive, and easy to host inside a Next.js PWA. The first version avoids paid UI vendors, custom design-token infrastructure, and heavyweight animation systems until the vertical slice proves the need.

## Alternatives Considered

Plain CSS only: lower dependency count, but slower for quickly building responsive layout structure across many screens.

CSS-in-JS: flexible, but adds runtime or build complexity and can make long-term style ownership less obvious.

Commercial component library: faster for generic admin screens, but can create licensing cost, visual sameness, and white-label friction.

Custom design system from day one: attractive in theory, but too expensive before the platform interaction model is proven.

## Guardrails

- Use Tailwind for layout, spacing, responsiveness, and interaction states.
- Use tenant CSS variables for reusable component color, border, focus, and surface decisions.
- Keep shared components in `packages/ui` small and reusable.
- Keep domain-specific product composition in `apps/web/src/features/*`.
- Do not hard-code MiniStar palette, mascots, reward names, or curriculum rules into shared primitives.
- Revisit this decision only after the first complete vertical slice is working.

## Consequences

The team can build structure quickly and cheaply. The tradeoff is that review discipline matters: new screens must still pass the component and tenant-boundary standards before polish expands.
