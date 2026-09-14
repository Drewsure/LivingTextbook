# DR-856: Public Contract Import Guard

App source must consume content-model contracts through the package root. The
foundation composition suite executes a guard that rejects internal
`@living-textbook/content-model/src/*` imports in web and AI-service source.
The migration is an API-boundary cleanup only; it does not enable live AI,
uploads, persistence, assignment, or Phaser promotion. See ADR 0779.
