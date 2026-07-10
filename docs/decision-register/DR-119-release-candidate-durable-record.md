# DR-119: Release Candidate Durable Record

## Decision

Represent package release candidate status as a durable record category and adapter write intent before choosing a backend provider.

## Reason

The pilot release candidate summary should not remain only a UI calculation. Hosted and local deployments both need a portable record that distinguishes demo-visible packages from pilot-ready packages and summarizes open release gates and approvals.

## Standard

- `package-release-candidate` is a backend-agnostic persistence category.
- Hosted and local adapter plans must include package release candidate write intents.
- The backend schema draft must include a package release candidate entity.
- Release candidate status must be derived from publish gate and approval ledger state, not manually overridden.
- Release candidate records must not store raw learner audio, transcripts, or fake approval evidence.

