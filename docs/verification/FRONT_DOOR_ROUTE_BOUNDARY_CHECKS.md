# Front-Door Route Boundary Checks

These checks protect the white-label front door while the route registry is
still represented by reviewed sample data.

## Required checks

- `npm run verify:front-door-route-boundary`
- `npm run verify:sample-launch-boundary`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run verify:routes`

The registry must reject duplicate route IDs, paths, and active tenants. Each
route must bind its tenant to the content package, access policy, launch
session, progression state, and permanent QR identity.

## Explicit non-goals

These checks do not authorize route creation, QR alias mutation, redirect
activation, package promotion, assignment activation, or student-ready state.
Those actions require the future durable registry, release state, rollback,
authorization, and local-fallback evidence gates.
