# DR-1185: Assist-Language Audio Decision Snapshot Adjudication

Decision: bind the assist-language audio release-review packet to the exact
provider-neutral pilot review decision snapshot and fingerprint already used by
the release-control review room.

This is an auditable evidence bridge, not a second approval system. It carries
tenant/package scope, persistence mode, release-control identity, approval-ledger
identity, snapshot identity, and fingerprint. Snapshot writes, restore, export,
approval capture, promotion, activation, and student launch remain blocked.

Verification: `npm run verify:assist-language-audio-catalog-release-decision-snapshot-binding`.
