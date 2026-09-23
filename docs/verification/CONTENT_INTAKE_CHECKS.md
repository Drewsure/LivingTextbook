# Content Intake Checks

Use these checks after pulling the latest `legacy-source-import` branch and running the local dev server.

## Commands

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git restore apps/web/next-env.d.ts
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

## Routes

- `http://127.0.0.1:3000/teacher/intake`
- `http://127.0.0.1:3000/enter/ministar`
- `http://127.0.0.1:3000/enter/sample-publisher`

## Expected Results

- `/teacher/intake` shows the content intake and route registry page.
- The intake panel lists both the MiniStar DOCX sample and the Sample Publisher PDF sample.
- The intake gates distinguish completed review items from media-rights and teacher-approval items that remain pending.
- The package release section shows MiniStar and Sample Publisher release records.
- Release records show edition, version, stable route path, active QR state, unit count, media count, and game-mode count.
- Release records list changes since the previous version and release gates for media files, rights proof, route persistence, or teacher approval.
- The route registry panel lists `/enter/ministar` and `/enter/sample-publisher`.
- The route registry keeps permanent QR paths separate from front-door paths.
- The teacher/admin page does not claim automated PDF extraction is production-ready.
- The teacher/admin page shows `source_extraction_review_packet` and `Source extraction review packet record` before OCR/parser/AI extraction workflows are enabled.
- The student front-door routes still require target-language practice after entry.
- Source-runtime review records carry a MIME type compatible with the declared
  source type and a positive byte length at or below 50 MiB before extraction
  or draft decisions.

## Failure Signals

- Raw PDF/DOCX intake is treated as automatically student-ready.
- OCR, parser output, or AI extraction can create assignments, routes, games, or package releases without a reviewed extraction packet.
- A package release is shown as QR-active before route registry, media, or teacher approval gates are represented.
- Yearly package changes are not visible to the teacher/admin review route.
- Missing media files are hidden instead of represented as pending rights/file handoff.
- Route data is hard-coded only inside route components.
- The intake route introduces production auth claims or database persistence that do not exist yet.
- A source can enter extraction review using only a checksum while its MIME or
  byte length is missing, incompatible, or over the shared review ceiling.

## Asset Runtime Boundary

- Asset runtime records preserve a kind-compatible MIME type for image, audio,
  video, font, and source-document assets.
- Asset byte length is a positive integer and remains at or below the shared
  256 MiB platform ceiling before future storage or release decisions.
- Tenant size-budget policy may be stricter than the shared ceiling.
- MIME and byte checks do not authorize upload, storage, scan, rights approval,
  media transformation, promotion, or student-facing use.
- Learner-recorded media and learner uploads remain outside the core asset
  runtime until a separately approved privacy and cost boundary exists.

## Asset Evidence Binding

- Labelled Diagram and media evidence flows bind validated asset kind, MIME
  type, positive byte length, checksum, tenant, asset identity, and source
  lineage metadata.
- Evidence attachment records are metadata-first and do not carry raw file
  bytes or storage/download URLs.
- Evidence packets explicitly block attachment upload, object storage writes,
  downloads, asset promotion, and student-facing use.
- Tenant mismatch and invalid asset file metadata are rejected before a future
  storage adapter could receive the packet.

## Asset Manifest Release Preview

- Validated asset evidence derives target-aware previews for game assets,
  media manifests, and source documents.
- Previews expose target mapping, rights, accessibility, release-control, and
  persistence blockers.
- Evidence-ready is explicitly a release-review state, not a storage,
  promotion, download, playlist, game, assignment, or student-facing grant.
- Manifest previews remain provider-neutral, review-only, and side-effect-free.

## Asset Manifest Release-Control Binding

- Manifest previews reconcile with release-control evidence and declare hosted,
  local, or hybrid deployment intent.
- Deployment policy, hosted storage, local bundle, package release, and
  required approval blockers remain visible together.
- Paths, folders, preview status, and evidence-ready status cannot authorize
  storage, local activation, promotion, QR mutation, or student-facing use.
- Tenant and package identity remain bound through the release-control preview.

## Cross-Deployment Persistence Recovery Rehearsal

- The persistence workbench shows one recovery rehearsal for hosted-managed,
  closed-local, and hybrid deployment paths.
- Each path requires backup, restore, export, tenant-isolation, retention, and
  rollback evidence and excludes raw learner audio and transcripts.
- Provider selection remains uncommitted and the rehearsal remains review-only.
- Persistence writes, backup creation, restore execution, export, package
  promotion, QR mutation, and route mutation remain blocked.
- Run `npm run verify:runtime-behavior` after changing the rehearsal runtime or
  its source records; run the full foundation gate before publishing.

## Deployment Continuity Decision

- The deployment workbench binds hosted PWA, local classroom server, and
  packaged companion paths to the shared recovery rehearsal.
- Each product path shows its recovery modes, continuity evidence, and open
  blockers without treating a recommendation as a selection.
- Policy acceptance, provider selection, persistence activation, classroom
  launch, offline-ready status, installer export, and route mutation remain
  blocked.
- Run `npm run verify:runtime-behavior` after changing the continuity decision
  contract and the full foundation gate before publishing.
