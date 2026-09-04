# DR-552: Partner Pilot Requirements Intake

Status: Accepted

Decision: Add a tenant-scoped partner requirements intake route before live partner onboarding workflows exist.

Rationale:

- The first partner or school pilot conversation needs a practical checklist of supplied content, media rights, school policy, reports, deployment, package tiers, optional AI, and prototype timing.
- The route supports white-label sales without pretending the platform can already ingest live files or launch classrooms.
- Requirements collection should stay cheaper and simpler than building premature upload and persistence workflows.

Guardrails:

- No upload button, file picker write, policy acceptance, live storage write, report export, classroom launch, local package activation, premium AI Tutor activation, microphone request, or Z.ai source handoff request can happen here.
- Hosted PWA remains the default first pilot path unless closed local operation is required.
- Evidence traceability is handled by DR-553 and must point each requirement to its proof route, current signal, blocked-until condition, and pilot dependency.
- `npm run verify:pilot-requirements` and active route verification protect the route.

ADR: `docs/adr/0481-partner-pilot-requirements-intake.md`
