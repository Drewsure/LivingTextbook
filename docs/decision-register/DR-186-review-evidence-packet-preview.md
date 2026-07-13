# DR-186: Review Evidence Packet Preview

## Decision

Show a blocked evidence packet preview on the teacher draft review queue.

## Rationale

Reviewer decisions need proof. The product should expose the evidence requirement early, but actual uploads and signatures require authentication, storage, policy, and approval ledgers.

## Implications

- `/teacher/review` shows future evidence requirements.
- Evidence upload remains blocked.
- No file upload, signature capture, approval, publish, or assignment occurs.
- Future evidence storage must preserve reviewer identity, draft revision, audio gaps, rights/version proof, route compatibility, and release-control evidence.

## Next

Add durable evidence storage only after reviewer identity, file storage, approval ledger policy, and release-control rules are accepted.
