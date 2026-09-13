# DR-799: Frozen Source Checker Quarantine Guard

Keep the frozen Phaser source evidence checker path-contained and read-only.
Absolute or traversal paths that escape the isolated snapshot fail closed, and
`npm run verify:phaser-source-evidence-contract` rejects mutation, import,
process, and application-path markers. The guard strengthens evidence
reproducibility without authorizing source import, route activation, scoring,
persistence, or assignment. See ADR 0725.
