# DR-798: Phaser Source Evidence Command

Expose the frozen Phaser source identity check as
`npm run verify:phaser-source-evidence`. The command reads the isolated review
folder, compares the review packet's SHA-256 manifest, and reports source
identity without changing the application. It does not authorize candidate
import, route activation, scoring ownership, persistence, or assignment. See
ADR 0724.
