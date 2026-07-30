# ADR 0301: AI Generator Tenant Coverage Gate

Status: Accepted  
Date: 2026-07-31

## Decision

Add an AI generator tenant coverage gate to the teacher/admin generator route.

The gate shows covered, partial, and missing preview records for each tenant generator request before any live generation, verifier submission, package assembly, route creation, playlist creation, or student assignment exists.

## Rationale

White-label readiness cannot be inferred from one tenant's sample data. MiniStar, sample publishers, and future textbook partners need visible request-specific records so a route can load without implying that the tenant is ready for live AI generation or student use.

The gate also protects optional premium AI features. A tenant may have an AI Tutor or speech scoring plan on the roadmap, but those features remain blocked unless package, school approval, privacy, transcript, usage, cost, and verifier records exist.

## Consequences

- `/teacher/generator/sample-publisher` shows tenant coverage for both the sample publisher routine request and the premium-gated upper-level AI Tutor request.
- `/teacher/generator/ministar` is now an active verified route and shows missing tenant generator preview records instead of inheriting sample-publisher scaffolds.
- The active route matrix and verifier now include the MiniStar generator route.
- Missing records block generator request submission, live model calls, verifier submission, package assembly, route or playlist creation, and student assignment.
- `npm run verify:ai-generator` checks the tenant coverage gate.
