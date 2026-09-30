# ADR 1324: Publisher Submission Package Evidence Reconciliation

Date: 2026-09-30  
Status: Accepted

## Decision

Publisher manifest coverage is reconciled against the existing canonical
package-evidence lanes: content, game, audio, video, image, font,
accessibility, and rights. The reconciliation is a derived review preview;
it does not replace `upload_quarantine_package_evidence_review` or invent a
second package approval system.

The reconciliation remains blocked until every canonical lane has a reviewer
evidence reference. Missing game evidence is explicit because a publisher
source document alone does not prove that the curated activity pathway,
deterministic scoring, progression, and target-language audio are ready.

## Consequences

- A publisher can see why a source submission is not yet a saleable package.
- Multimedia, font, accessibility, rights, and game evidence cannot disappear
  between intake and package review.
- Existing checksum, quarantine, delivery, QR, persistence, and release gates
  remain authoritative.
- The preview cannot assemble files, promote assets, print QR codes, or expose
  students to incomplete work.

## Verification

`npm run verify:publisher-submission-package-evidence-reconciliation` checks
canonical lane completeness, manifest identity, blocked actions, and the
read-only route/panel boundary. The full foundation gate includes this check.
