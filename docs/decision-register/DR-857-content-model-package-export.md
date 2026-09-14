# DR-857: Content-Model Package Export Map

The content-model package exposes one canonical root export targeting
`src/index.ts` and does not expose internal subpath exports. The boundary
verifier checks this manifest contract alongside source import hygiene. This
does not enable live services or external game promotion. See ADR 0780.
