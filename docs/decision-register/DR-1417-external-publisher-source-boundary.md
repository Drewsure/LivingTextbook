# DR-1417: External Publisher Source Boundary

The saleability audit now rejects publisher roots inside the LivingTextBook
repository before running source preflight. Sample/reference data cannot count
as a real publisher handoff; an external folder with rights and evidence must
pass the canonical preflight. See ADR 1417 and
`docs/adr/1417-external-publisher-source-boundary.md`.
