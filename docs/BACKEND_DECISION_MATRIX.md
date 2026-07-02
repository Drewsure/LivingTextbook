# Backend Decision Matrix

The backend decision matrix keeps the first real storage choice disciplined. It compares backend patterns by cost, white-label fit, deployment path, pilot blockers, and things that are not allowed yet.

## Current Recommendation

For the first real partner pilot, prefer a hosted managed database pattern for:

- tenant records,
- route registry,
- reviewed content package versions,
- teacher launch sessions,
- coded learner roster slots,
- progress and media event streams,
- report policy records.

Keep media delivery in rights-managed object storage or local/offline bundles depending on tenant needs.

Keep local/closed deployment compatible, but do not make installer, sync, backup, and local update complexity the first cost burden unless the partner explicitly requires closed deployment immediately.

## Decision Rule

Choose the lowest-cost option that supports stable QR routes, reviewed content packages, teacher launch sessions, coded learner progress, and report policy without locking future local deployments out.

## Options Compared

The current matrix compares:

- static source-controlled demo data,
- hosted relational database pattern,
- hosted document database pattern,
- local SQLite-style classroom package,
- hybrid hosted registry plus local media bundle.

These are patterns, not final vendor choices. Supabase, Firebase, SQLite, custom local storage, or another provider should only be chosen after the record contracts and policy gates are reviewed.

## Standing Constraints

- Do not store raw learner audio in core records.
- Do not store speech transcripts in core records.
- Do not enable ungated report exports.
- Do not write student progress before privacy, retention, and access-control policy are accepted.
- Do not point printed QR codes directly at local files.
- Do not make AI Tutor a core storage dependency.

## Current Implementation

- Sample data: `apps/web/src/data/sampleBackendDecisionMatrix.ts`
- Panel: `apps/web/src/features/persistence/BackendDecisionMatrixPanel.tsx`
- Route: `/teacher/intake`
