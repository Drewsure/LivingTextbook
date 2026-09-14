# Living Textbook Operating Notes

This document records repeatable procedures, environment constraints, and workarounds that future Codex sessions, engineers, or outside AI agents may need to recall.

These notes are not product standards. Product standards live in `docs/PRINCIPLES_AND_STANDARDS.md`. This file is the operational memory for how work actually gets done when tooling, branches, local permissions, or connectors behave in a consistent way.

## OW-001: GitHub Connector File Updates When Local Repo Access Is Blocked

Status: Active

Observed behavior: The local checkout may allow reading the repository root but block nested reads inside `LivingTextbook`, even after explicit read permission is requested. This prevents normal local patching and local build verification in that session.

Procedure:

1. Confirm the intended branch before editing. Current planning/build work has been on `legacy-source-import`.
2. Fetch target files through the GitHub connector using repository `Drewsure/LivingTextbook` and ref `legacy-source-import`.
3. Update or create files through the GitHub connector on the same branch.
4. Read back changed files through the connector after every meaningful update.
5. State clearly in the final response that local build/typecheck was not run if the local checkout remained inaccessible.
6. Do not assume the local checkout mirrors the remote working branch until it has been explicitly synchronized and verified.

Why this matters: It prevents accidental work on `main`, avoids destructive local workarounds, and preserves a reliable audit trail on the remote branch.

## OW-002: Branch Comparison May Fail Between `main` And `legacy-source-import`

Status: Active

Observed behavior: GitHub compare between `main` and `legacy-source-import` may report no common ancestor.

Procedure:

1. Do not use branch comparison as the only verification method.
2. Verify by reading back changed files directly from the target branch.
3. Mention this branch-state limitation when summarizing verification.
4. Avoid merge or reset operations until branch history is intentionally normalized.

## OW-003: Standards Must Be Updated When A Repeated Rule Appears

Status: Active

Procedure:

1. If a product/build principle affects future decisions, update `docs/PRINCIPLES_AND_STANDARDS.md`.
2. If a repeatable technical workaround or environment behavior appears, update this file.
3. If a major architecture decision is accepted, update `docs/DECISION_REGISTER.md` and add an ADR when useful.
4. Do not leave durable process knowledge only in chat history.

## OW-004: GitHub Connector Stale SHA Conflict

Status: Active

Observed behavior: Updating a file through the GitHub connector can fail with a 409 conflict if the file SHA is stale. This can happen after a recent create/update or when multiple related edits happen close together.

Procedure:

1. Stop updating that path immediately.
2. Refetch the exact file from `legacy-source-import`.
3. Use the fresh `sha` from the refetch.
4. Reapply the intended update against the fresh content.
5. Read back the changed file after the update succeeds.

Why this matters: It prevents accidental overwrites and keeps connector-based edits safe when local checkout verification is unavailable.

## OW-005: Local Checkout May Not Track Remote Connector Branch

Status: Active

Observed behavior: The local `D:\LIVING TEXTBOOOK PROJECT\LivingTextbook` checkout can be present but still not match the active GitHub connector branch. In the current observed state, local `git status --short --branch` reported `main`, `git log --oneline -5` showed a single local import commit, and `git remote -v` returned no configured remotes. Network permission was granted for a sync attempt, but adding the GitHub remote was blocked because `.git` write permission was not granted.

Procedure:

1. Do not run build or typecheck as proof of `legacy-source-import` unless the local checkout has first been synchronized to that branch.
2. Check local branch and remotes before claiming local verification.
3. If no remote is configured, either use GitHub connector readback only or intentionally configure/sync the repo in a separate setup step.
4. To sync locally, the session needs both network access and write access to `D:\LIVING TEXTBOOOK PROJECT\LivingTextbook\.git`.
5. Clearly distinguish connector readback verification from local build, typecheck, or browser verification.
6. Avoid local edits on `main` while connector work is happening on `legacy-source-import` unless the task explicitly calls for local branch repair.

Preferred recovery when `.git` write remains blocked:

1. Preserve the stale local folder by renaming it to `LivingTextbook-local-main-backup`.
2. Clone `Drewsure/LivingTextbook` fresh into `D:\LIVING TEXTBOOOK PROJECT\LivingTextbook` using branch `legacy-source-import`.
3. Confirm `git status --short --branch` reports `legacy-source-import`.
4. Confirm `git remote -v` shows the GitHub remote.
5. Install dependencies if needed.
6. Run typecheck/build.
7. Start the local web app and verify `/launch/demo-unit-1` and `/enter/ministar` against `docs/VERIFICATION_CHECKLIST.md`.

Manual PowerShell recovery commands:

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT"
Rename-Item "LivingTextbook" "LivingTextbook-local-main-backup"
git clone --branch legacy-source-import https://github.com/Drewsure/LivingTextbook.git LivingTextbook
```

Why this matters: It prevents false confidence, avoids testing stale files, and keeps future work from splitting between an unsynced local checkout and the remote branch.

## OW-006: Fresh Clone Dependency Install Requires One-Time Lockfile Creation

Status: Active

Observed behavior: After a fresh clone of `legacy-source-import`, the repository may not contain `package-lock.json` or `node_modules`. In the managed Codex desktop environment, `npm ci` is allowed, but `npm install` can be blocked by local command policy. Because `npm ci` requires an existing lockfile, build and typecheck will fail until the first install creates the lockfile and dependencies.

Observed failure signatures:

- `npm ci` fails with `The npm ci command can only install with an existing package-lock.json`.
- `npm run typecheck --workspace @living-textbook/web` fails with `'tsc' is not recognized`.
- `npm run build --workspace @living-textbook/web` fails with `'next' is not recognized`.

Procedure:

1. Confirm the clone is on `legacy-source-import`.
2. If `package-lock.json` is missing and Codex cannot run `npm install`, ask the repository owner to run the one-time install locally:

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
npm install
```

3. After `package-lock.json` exists, future sessions should prefer the reproducible install path:

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
npm ci
```

4. Then run:

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

5. Do not mark local build/browser verification complete until dependencies have been installed and the route checks have actually run.

Why this matters: It prevents the team from mistaking missing local dependencies for application bugs, while preserving a clean path toward reproducible installs once a lockfile is committed.

## OW-007: Stale Next Dev Server Blocks Local Route Verification

Status: Active

Observed behavior: A prior `next dev` process can continue holding port `3000` or block a second dev server even when browser navigation hangs. Next may print the active process id, directory, and log path with `Another next dev server is already running`.

Observed failure signatures:

- `listen EADDRINUSE: address already in use 127.0.0.1:3000`.
- `Another next dev server is already running` followed by a `PID`, `Dir`, and `.next\dev\logs\next-development.log`.
- HTTP or browser route checks hang even though a port appears occupied.

Procedure:

1. Confirm the printed `Dir` points to the intended app, usually `D:\LIVING TEXTBOOOK PROJECT\LivingTextbook\apps\web`.
2. Stop only the printed process id:

```powershell
taskkill /PID <printed-pid> /F
```

3. Restart the dev server from the repository root:

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

4. Leave the terminal window open while browser verification runs.
5. If port `3000` is intentionally unavailable, try `3001`, but stop stale same-app Next servers first because Next may block multiple dev servers for the same app directory.

Why this matters: It avoids wasting time debugging the app when the real issue is a stale local development process.

## OW-008: Managed Session Allows Local Reads But Rejects Local Writes

Status: Active

Observed behavior: Some managed Codex desktop sessions can read the local `LivingTextbook` checkout but reject local write operations, including directory creation and `apply_patch`, even inside `D:\LIVING TEXTBOOOK PROJECT`. Git network fetch may also be blocked from the agent side while the user can still pull successfully in PowerShell.

Observed failure signatures:

- Shell write command returns `approval required by policy`, but sandbox approval is unavailable.
- `apply_patch` returns `writing outside of the project; rejected by user approval settings`.
- `git fetch` is blocked for the agent even though the repository owner can run `git pull --ff-only` locally.

Procedure:

1. Read local files for context when available.
2. Use the GitHub connector for repository writes on `legacy-source-import`.
3. Read back connector-created files before asking for local verification.
4. Ask the human owner to run `git pull --ff-only` locally when connector commits need to be synchronized.
5. After the human pull, run typecheck/build and browser verification locally if the agent is allowed to execute those commands.
6. Keep the generated `apps/web/next-env.d.ts` local modification uncommitted unless a real source change requires it.

Why this matters: It keeps progress moving without unsafe local workarounds, and it makes the human-side pull an explicit bridge rather than a mystery failure.

## OW-009: Tailwind Variable Color Classes Need Explicit Color Syntax

Status: Active

Observed behavior: Tailwind arbitrary text color classes such as `text-[var(--tenant-primary-text)]` can be interpreted ambiguously or fail to compile as a color utility. The visual symptom is a dark tenant-primary button with invisible dark inherited text, even though the component appears correct in JSX.

Observed failure signatures:

- Primary buttons render as dark blocks with no readable label.
- `Mark practice complete` or `Start Memory Match` appears to be missing even though the button exists and is clickable.
- Typecheck/build pass because the issue is CSS utility generation, not TypeScript.

Procedure:

1. For tenant color variables used as text colors, use explicit color syntax: `text-[color:var(--tenant-primary-text)]`.
2. Use the same explicit syntax for secondary or quiet variants when they depend on tenant text variables.
3. After changing shared UI primitives, verify `/launch/demo-unit-1` visually, not only by typecheck/build.
4. Confirm primary action buttons show readable labels in both locked/unlocked states.
5. Add or update visual verification notes if a new arbitrary variable color class is introduced.

Why this matters: Tailwind syntax ambiguity can hide primary learning controls, which blocks young learners from finding Memory Match or completing entry practice.

## OW-010: Learner Action Buttons Need Local Style Fallbacks

Status: Active

Observed behavior: A connector-side shared UI primitive update may not immediately appear in a local dev server or a local checkout that has not pulled the latest remote commit. The visual symptom can persist as a black, blank-looking action button even after the shared `Button` source has been corrected on GitHub.

Procedure:

1. Keep the shared `Button` primitive correct, but do not rely only on shared-package Tailwind classes for critical learner action colors.
2. For wrappers such as `AudioSupportedAction`, pass explicit inline CSS variable fallback styles for background, border, and text color.
3. Use `var(--tenant-accent)` and `var(--tenant-accent-text)` for primary learner actions.
4. After pulling and rebuilding, hard refresh `/launch/demo-unit-1` or restart the dev server if the old visual remains.
5. Verify by screenshot or direct browser view, not only typecheck/build.

Why this matters: Young learners must be able to see the action button immediately. Shared package caching or stale local files should not hide the next step in the classroom flow.

## OW-011: Next 16 Windows Build Uses Webpack Fallback

Status: Active

Observed behavior: `next build` can fail on Windows with a Turbopack internal error while processing `apps/web/src/app/globals.css` through PostCSS. The dev server may still start successfully, which indicates the app source and routes are not necessarily broken.

Procedure:

1. Keep the dev server on the normal Next path.
2. Keep the production build script on `next build --webpack` until a future Next upgrade proves the Windows Turbopack/PostCSS worker path is stable.
3. Before local verification, pull the branch and run:

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

4. See `docs/operating-notes/2026-07-02-next16-windows-webpack-build.md` for the detailed failure signature and recovery note.

Why this matters: The project can keep the low-cost Next/Tailwind foundation while avoiding repeat production-build interruptions from a tooling worker failure.

## OW-012: Transient Git Index Lock After Parallel Checks

Status: Active

Observed behavior: A `git commit` can briefly fail with `.git/index.lock` after nearby parallel status/diff/staging checks. In the observed cases, no active Git process remained and the lock disappeared without manual deletion.

Observed failure signature:

- `fatal: Unable to create '.git/index.lock': File exists.`

Procedure:

1. Do not immediately delete `.git/index.lock`.
2. Check for an active Git process:

```powershell
Get-Process git -ErrorAction SilentlyContinue
```

3. Check whether `.git\index.lock` still exists:

```powershell
Get-Item .git\index.lock -ErrorAction SilentlyContinue
```

4. If no Git process is active and the lock has already cleared, retry the original Git command.
5. Only consider manually removing the lock after confirming no Git process is active and the lock persists.

Why this matters: It avoids corrupting the repository while still giving future sessions a quick recovery path for a repeat Windows/local tooling hiccup.

## OW-013: Full Foundation Verification May Need A Longer Tool Window

Status: Active

Observed behavior: `npm run verify:foundation` can pass but take longer than a short command timeout because it runs many focused verifiers, Next type generation, a production build, and 47 live route checks. A timeout with no failure output should not be treated as a broken build until rerun with a longer window.

Observed failure signature:

- Tool reports `command timed out` around 300 seconds.
- A rerun with a longer timeout completes successfully.

Procedure:

1. Run targeted checks first when developing a narrow slice.
2. Before commit, run the full command with a longer timeout:

```powershell
npm run verify:foundation
```

3. If a managed tool timeout occurs without verifier failure output, rerun the same command with a longer command window.
4. Treat actual `FAIL` lines from a verifier as build failures; treat a bare timeout as inconclusive.

Why this matters: The foundation gate is intentionally broad. A longer verification window protects quality without misreading a slow Windows/Next route pass as a product defect.

## OW-014: Next Route Type Generation Must Run Sequentially

Status: Active

Observed behavior: Running `npm run typecheck --workspace @living-textbook/web` and `npm run build --workspace @living-textbook/web` in parallel can produce temporary `TS6053` missing-file errors under `apps/web/.next/types/app/...`. This is a generated route-type race, not necessarily a source-code failure.

Procedure:

1. Run typecheck and build sequentially.
2. If the route-type `TS6053` error appears after a parallel run, wait for build to finish and rerun typecheck.
3. Treat a repeated sequential failure as real.
4. See `docs/operating-notes/2026-07-17-next-route-typegen-sequential-run.md` for the detailed note.

Why this matters: Next route type generation writes into `.next/types`. Sequential verification avoids false failures and keeps the local build process calm.

## OW-015: GitHub Push Can Block On Missing Windows Credentials

Status: Active

Observed behavior: Local commits can succeed, but `git push origin legacy-source-import` may hang until the tool window times out. A non-interactive retry can reveal that Windows/Git has no available GitHub credentials.

Observed failure signature:

- `fatal: unable to access 'https://github.com/Drewsure/LivingTextbook.git/': schannel: AcquireCredentialsHandle failed: SEC_E_NO_CREDENTIALS`

Procedure:

1. Confirm the local branch is clean and ahead of the remote:

```powershell
git status -sb
git log --oneline --decorate -4
```

2. Try a non-interactive diagnostic push to avoid silent waiting:

```powershell
$env:GIT_TERMINAL_PROMPT='0'
git push --porcelain origin legacy-source-import
```

3. If `SEC_E_NO_CREDENTIALS` appears, the human-side fix is to run:

```powershell
git push origin legacy-source-import
```

4. Complete the GitHub/Git Credential Manager sign-in prompt, then rerun:

```powershell
git rev-parse origin/legacy-source-import
```

5. If the remote commit still does not match local `HEAD`, retry the normal push after credentials are refreshed.

Why this matters: It separates a real GitHub credential prompt from source-control or build failure. Work can continue locally, but the user must refresh credentials before the verified commit reaches GitHub.

## OW-016: Active Route Verification Can Hit Transient Local Fetch Failures

Status: Active

Observed behavior: `npm run verify:routes` can pass several routes and then report many `fetch failed` entries if the local Next server briefly stops responding during a long route sweep. A rerun can pass without source changes.

Observed failure signature:

- Many consecutive `FAIL error http://127.0.0.1:3000/... fetch failed` lines after earlier successful route checks.

Procedure:

1. Confirm the local server still responds:

```powershell
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/ -TimeoutSec 10
```

2. If it responds, rerun:

```powershell
npm run verify:routes
```

3. The verifier retries each route fetch twice with a short backoff and a 20-second per-attempt timeout.
4. Treat missing expected text, repeated fetch failure after retry, or repeated route fetch timeout as a real issue.

Why this matters: The active route list is intentionally broad. Lightweight retry behavior reduces false negatives without hiding real route content failures.

## OW-017: Recursive Text Search In PowerShell

Status: Active

Observed behavior: Windows PowerShell can reject `Select-String -Recurse` with a parameter-binding error in this environment.

Preferred procedure:

```powershell
rg "search text" path
```

Fallback procedure if `rg` is unavailable:

```powershell
Get-ChildItem -Recurse -File path | Select-String -Pattern "search text"
```

Why this matters: Search should stay fast and read-only. Do not use this workaround to build delete, move, or overwrite command strings.

## OW-018: PowerShell Needs Literal Paths For Bracketed Next Routes

Status: Active

Observed behavior: Next.js App Router folders such as `[tenantId]` are valid route folders, but PowerShell treats square brackets as wildcard pattern syntax when reading or staging files by path.

Observed failure signature:

- `Get-Content : specified path ... [tenantId] ... does not exist or was filtered by -Include or -Exclude.`

Procedure:

1. Use `-LiteralPath` when reading bracketed route files:

```powershell
Get-Content -LiteralPath "apps\web\src\app\teacher\maintenance\[tenantId]\page.tsx"
```

2. Quote bracketed route paths when staging or inspecting them through Git.
3. Do not treat a failed normal `Get-Content -Path` call as evidence that the route file is missing.

Why this matters: Dynamic route folders are now common in the build. Literal-path handling prevents false missing-file diagnosis.

## OW-019: Active Route Verification Uses Small-Batch Fetching

Status: Active

Observed behavior: As the active route matrix grew past 60 routes, `npm run verify:routes` could time out or appear frozen while checking large pages, especially `/teacher/intake`, if the verifier waited until the end to print route results.

Procedure:

1. Keep `scripts/verify-active-routes.mjs` on small-batch route fetching rather than a fully sequential route sweep.
2. Keep the per-route fetch timeout finite so a stalled local server produces a clear route failure instead of a silent hang.
3. Keep the heavy shell routes fully checked sequentially before the concurrent sweep and exclude them from the worker pool: `/`, `/teacher`, `/teacher/intake`, `/teacher/persistence`, `/teacher/session-settings`, `/teacher/reporting`, `/teacher/entitlements`, `/teacher/game-readiness`, `/teacher/generator/sample-publisher`, and `/teacher/generator/ministar`.
4. Keep route output streaming and concise: passing routes should report the route path and expected-text count, while failures should report missing text, forbidden text, or timeout details.
5. If `npm run verify:routes` times out, directly probe the newest route and `/teacher/intake` first:

```powershell
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/match/demo-unit-1
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/teacher/intake
```

6. If those routes return `200`, rerun `npm run verify:routes` with a longer command timeout before assuming a source failure.
7. Treat missing expected text, failed route status, or repeated timeout after direct probes as a real issue.

Why this matters: The verifier is now protecting a broad commercial foundation. Small-batch fetching keeps the check practical without weakening the expected-text gate.

## OW-020: Repeated Review Text Needs Contextual React Keys

Status: Active

Observed behavior: Large teacher/admin review pages often repeat blocker, warning, and evidence text across cards. Using only the visible text as a React key can produce duplicate-key console warnings when the same sentence appears twice.

Procedure:

1. For mapped review lists, include a stable owner/context id plus the row index in the key.
2. Acceptable examples:

```tsx
items.map((item, index) => <li key={`${title}-${index}-${item}`}>{item}</li>)
records.map((record, index) => <section key={`${tenantId}-record-${index}-${record}`}>{record}</section>)
```

3. Prefer real record ids when the data model has them, such as `packetId`, `uploadId`, `laneId`, or `workspaceId`.
4. Do not use `Math.random()` or timestamp keys; they make React remount rows unnecessarily.

Why this matters: These pages are evidence-heavy and intentionally repetitive. Contextual keys keep the console clean and prevent row identity drift as the review data grows.

## OW-021: Next Type Generation And Build Must Run Sequentially

Status: Active

Observed behavior: `next typegen`, TypeScript checks, and `next build` all touch generated files under `.next/types`. Running typecheck and build in parallel can create false missing-file errors even when the source code is valid.

Observed failure signature:

- `TS6053: File '.next/types/app/.../page.ts' not found.`

Procedure:

1. Run typecheck first:

```powershell
npm run typecheck --workspace @living-textbook/web
```

2. After it finishes, run build:

```powershell
npm run build --workspace @living-textbook/web
```

3. Prefer `npm run verify:foundation` for the full local gate because it already runs checks in the correct order.
4. Do not diagnose route type files as missing until the checks have been rerun sequentially.

Why this matters: The foundation verifier must stay trustworthy. Avoiding parallel generated-file writes prevents noisy failures from hiding real build issues.

## OW-022: Next Dev Cold Route Warmup Can Produce A Transient 500

Status: Active

Observed behavior: On a cold Windows Next dev server, a broad active-route sweep can hit a transient route `500` during first compilation even when the same route returns `200` immediately afterward. In the observed case, `/assign/assignment-ministar-demo-whole-class` and `/teacher/units/ministar%3Aministar-english%3AL1%3AU1` briefly showed `SyntaxError: Unexpected end of JSON input`, then both returned `200` on direct repeat requests and the full route verifier passed without source changes.

Observed failure signatures:

- A small number of route `500` failures during the first `npm run verify:routes` sweep after starting `next dev`.
- Next dev log shows `SyntaxError: Unexpected end of JSON input` without a useful source stack.
- Direct `Invoke-WebRequest` calls to the same route return `200`.

Procedure:

1. Directly probe the failed route or routes:

```powershell
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:3000/assign/assignment-ministar-demo-whole-class"
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:3000/teacher/units/ministar%3Aministar-english%3AL1%3AU1"
```

2. If the direct probes return `200`, rerun:

```powershell
npm run verify:routes
```

3. Treat the failure as real if the same route returns `500` repeatedly, if direct probes fail, or if expected text remains missing after the route has warmed.
4. Do not weaken expected-text coverage to hide a transient cold compile issue.

Why this matters: Route verification should remain strict, but broad cold-start sweeps can expose dev-server timing noise. Warming and rerunning protects quality without misdiagnosing stable source code as broken.

## OW-023: PWA Manifest Does Not Mean Offline Ready

Status: Active

Observed behavior: A web app can expose a valid manifest and still have no approved offline lesson, media, QR fallback, report, cache, or local data behavior. This is especially easy to confuse when discussing closed textbook companions.

Procedure:

1. Treat the manifest as installable-shell evidence only.
2. Keep offline readiness blocked until service worker registration, cache policy, media rights, checksums, versioned manifests, QR fallback, rollback, learner-data exclusions, report/export policy, and school policy are complete.
3. Do not add service worker registration, cache writes, media precache, local installer export, local package activation, background sync, or student data offline storage from a review panel.
4. Preserve learning audio priority before allowing background music, video, or offline media behavior.
5. Run `npm run verify:local-bundle` and `npm run verify:routes` after any local companion, PWA, media bundle, manifest, or QR fallback change.

Why this matters: The white-label product can sell hosted PWA and future closed companion options only if each delivery promise is explicit, reliable, and policy-backed.

## OW-024: Deployment Workbench Is A Decision Surface, Not Activation

Status: Active

Observed behavior: Hosted PWA, local classroom server, and packaged textbook companion discussions can easily blur into implementation promises if they are not shown with cost, policy, media, storage, QR, report, and rollback blockers beside them.

Procedure:

1. Use `/teacher/deployment` for deployment conversations with schools or publishers.
2. Treat hosted PWA as the default first pilot recommendation unless a school requirement forces local operation.
3. Keep local classroom server and packaged companion options visible as paid or policy-gated product paths.
4. Do not activate local packages, export installers, claim offline readiness, mutate production QR redirects, export reports, collect real learner data, or enable premium AI Tutor features from the deployment workbench.
5. Run `npm run verify:deployment` and `npm run verify:routes` after any hosted/local/package deployment wording, route, offline, media bundle, or package tier change.

Why this matters: The platform can be sold confidently only when deployment choices are clear, cost-aware, and honest about what is ready versus what still needs evidence.

## OW-025: Pilot Dashboard Is A Go/No-Go Conversation Surface

Status: Active

Observed behavior: A strong controlled demo can sound like a live pilot if the evidence and blocker routes are not shown together.

Procedure:

1. Use `/teacher/pilot` for first colleague, publisher, or school pilot-readiness conversations.
2. State the current position as demo-ready, not classroom-ready.
3. Keep source/media evidence, school policy, persistence, reports, deployment, launch gates, and package publish gates visible from the dashboard.
4. Do not launch classrooms, collect real learner data, export reports, accept school policy, activate local packages, claim offline readiness, enable premium AI Tutor, or request Z.ai prototype intake from this route.
5. Run `npm run verify:pilot`, `npm run verify:deployment`, and `npm run verify:routes` after any pilot-readiness wording, evidence-link, deployment, policy, persistence, report, or package-gate change.

Why this matters: The first partner conversation should build confidence without creating promises the platform has not yet earned.

## OW-026: Partner Pilot Intake Is Requirements First

Status: Active

Observed behavior: Once a partner asks for uploads, QR codes, reports, videos, games, or a closed local package, it is tempting to create live forms too early.

Procedure:

1. Use `/teacher/pilot/requirements/sample-publisher` to guide the first partner requirements conversation.
2. Record what the partner must supply and what the school must decide before building live upload, storage, policy, report, or local package workflows.
3. Keep source files, media rights, game pathway scope, QR/front-door entry, learner data, reports, deployment, package tier, optional AI Tutor, and Z.ai timing visible.
4. Keep hosted PWA as the default first pilot recommendation unless a closed local operation is explicitly required.
5. Do not add upload buttons, file picker writes, policy acceptance, live storage writes, report exports, classroom launch, local package activation, premium AI Tutor activation, microphone prompts, or Z.ai source handoff requests from this route.
6. Run `npm run verify:pilot-requirements` and `npm run verify:routes` after any partner intake, source/media requirement, school decision, deployment, package tier, or Z.ai timing change.

Why this matters: Good commercial onboarding starts by reducing ambiguity, not by accepting files into an unfinished workflow.

## OW-027: Partner Pilot Evidence Traceability

Status: Active

Observed behavior: Requirements meetings can drift into loose promises unless every ask points back to a review route and a blocked-until condition.

Procedure:

1. Keep the evidence traceability map visible inside `/teacher/pilot/requirements/sample-publisher`.
2. Link source extraction, media rights, curated activity pathway, QR/front-door, learner data policy, teacher report/export, deployment, premium AI Tutor, and Z.ai/outside prototype items to their evidence routes.
3. Preserve current signal, blocked-until condition, and pilot dependency text for each trace item.
4. Do not use the trace map to capture partner answers, upload files, accept policy, write storage, export reports, mutate routes, activate packages, enable premium AI, request outside source handoff, or launch classes.
5. Run `npm run verify:pilot-requirements`, `npm run verify:routes`, and `npm run verify:foundation` after traceability changes.

Why this matters: Traceability lets a partner see exactly how close the pilot is without confusing demo evidence for classroom approval.

## OW-028: First Partner Pilot Meeting Agenda

Status: Active

Observed behavior: A promising partner conversation can accidentally become a promise to upload files, launch a class, or provide local software before the foundation gates are ready.

Procedure:

1. Use the meeting agenda inside `/teacher/pilot/requirements/sample-publisher` for first publisher or school discovery calls.
2. Ask through source package, multimedia rights, curated activity pathway, QR/front-door, learner data policy, reporting, deployment, premium AI, and outside prototype topics in that order.
3. Request evidence only as future required materials; do not collect files through the route.
4. Keep decisions not made here visible beside each agenda section.
5. Do not treat meeting notes as policy acceptance, storage selection, report export approval, local app approval, premium AI adoption, Z.ai handoff approval, or classroom launch approval.
6. Run `npm run verify:pilot-requirements`, `npm run verify:routes`, and `npm run verify:foundation` after agenda changes.

Why this matters: The first meeting should make the product feel organized and saleable while protecting the build from premature live workflow promises.

## OW-029: Partner Pilot Follow-Up Packet Preview

Status: Active

Observed behavior: After a strong first meeting, partners need a concise next-step summary, but a packet preview can easily become an accidental email, export, attachment, or approval workflow.

Procedure:

1. Use the follow-up packet preview inside `/teacher/pilot/requirements/sample-publisher` to show requested evidence, school decisions, demo links, blockers, and the next evidence gate.
2. Keep packet contents explicit and tenant-scoped; each item must name its owner, review route, and reason.
3. Treat the preview as an adult review aid only. It must not send email, download a file, create an attachment, save meeting answers, accept school policy, or mutate release state.
4. Keep the first packet centered on source files, media rights, curated pathway approval, entry rules, policy, deployment, and dry-run evidence.
5. Do not put premium AI Tutor adoption, microphone approval, or Z.ai source handoff into the core packet as an enabled action.
6. Run `npm run verify:pilot-requirements`, `npm run verify:routes`, and `npm run verify:foundation` after packet-preview or partner handoff changes.

Why this matters: A clear follow-up packet makes the white-label sales conversation actionable while preserving the boundary between a review summary and a live operational workflow.

## OW-030: Windows GitHub Credential Handoff

Status: Active

Observed behavior: Local verification and commits can succeed while `git push origin legacy-source-import` fails with `SEC_E_NO_CREDENTIALS` from Windows Schannel credential acquisition.

Procedure:

1. Preserve the local commit; do not reset, amend, or discard it just because the push failed.
2. Confirm the local branch and commit with `git status --short` and `git log -1 --oneline`.
3. Have the human operator re-authenticate GitHub in the approved connector or Windows Git credential flow, then rerun `git push origin legacy-source-import` from `D:\LIVING TEXTBOOOK PROJECT\LivingTextbook`.
4. Confirm the remote advances to the local commit with `git rev-parse origin/legacy-source-import` after the push.
5. Keep the local dev server on `http://127.0.0.1:3000` separate from Git authentication; a working browser does not prove that the push credential is available.

Why this matters: A credential failure is an external handoff problem, not a reason to undo verified local work. Recording the exact recovery steps prevents repeated rework and makes the human intervention small and safe.

## OW-031: Canonical Student Launch Handoff

Status: Active

Observed behavior: The QR launch screen can own transient pathway state while a
canonical game component owns its learning events. If both layers emit a start
event, teacher reports see duplicate attempts; if the parent accepts completion
without replay validation, the launch route can drift from standalone game
routes.

Procedure:

1. Let the mounted canonical game emit `game_started`; the launch screen only
   selects the unlocked activity.
2. Buffer events in a ref as well as visible state so completion validation sees
   same-click events before React rendering completes.
3. Filter the buffered events to the active game mode, append the completion
   event, and run `validateCanonicalGameEventSequence` before changing
   progression or Star Dust.
4. Keep unsupported modes as explicit previews until their canonical component
   is integrated; never treat a preview as a completed game.
5. Run `npm run verify:canonical-games` and the student launch checklist after
   changing this pathway.

Why this matters: The launch route remains a clean classroom doorway while
canonical game engines retain one event owner and one completion acceptance
boundary.

## OW-032: Shared Canonical Completion Gate

Status: Active

Observed behavior: Completion validation duplicated across a standalone game
route and the QR launch pathway can drift as event, replay, or identity rules
evolve.

Procedure:

1. Route every canonical game completion through
   `validateCanonicalGameCompletion`.
2. Pass the complete buffered event list, expected mode, tenant, learner
   identity, and candidate completion result.
3. Let the gate filter events to the active mode and delegate to the shared
   content-model validator.
4. Do not update progression, Star Dust, rewards, or reports when the gate
   returns errors.
5. Run `npm run verify:canonical-games` and the web typecheck after changing
   any completion consumer or event contract.

Why this matters: One completion boundary keeps future DOM and Phaser wrappers
consistent without allowing a game engine to become its own authority.

## OW-033: Unit Star Dust Capacity

Status: Active

Observed behavior: A unit can expose several curated game modes. Adding each
mode's deterministic award without a unit ceiling can exceed the published
1,000 Star Dust capacity.

Procedure:

1. Calculate the mode award from its approved scoring profile.
2. Pass it through the shared unit-cap helper before changing progression.
3. Record the accepted capped award in completion and mastery evidence.
4. Keep already-completed and invalid awards at zero.
5. Run `npm run verify:progression-runtime` and the web typecheck after scoring
   boundary changes.

Why this matters: The economy, continuity snapshots, teacher reports, and
future overflow conversion all need the same accepted unit total.

## OW-034: Shared Economy Policy Ownership

Status: Active

Observed behavior: A fixed economy rule duplicated in a web adapter, content
validator, or AI authoring validator can silently diverge across tenants and
future game wrappers.

Procedure:

1. Put platform-wide economy constants in
   `packages/content-model/src/economyPolicy.ts`.
2. Import the shared constant into scoring, event, continuity, and authoring
   validators; do not add a competing literal.
3. Keep tenant-specific reward catalogs and presentation labels separate from
   platform capacity rules.
4. Run canonical-game, progression-runtime, AI-generator, and web typechecks
   after changing the economy policy.

Why this matters: One policy source protects white-label consistency while
keeping tenant reward presentation configurable.

## OW-035: Canonical Game Audio Evidence

Status: Active

Observed behavior: A game component can contain audio controls and still fail
to leave runtime evidence if a wrapper forgets to route a request through the
shared event adapter.

Procedure:

1. Route learner-facing game audio through `createAudioRequestedEvent`.
2. Ensure the attempt emits at least one meaningful `audio_requested` event
   after `game_started` and before completion; the event must carry cue text,
   language, cue kind, replay, and tenant evidence.
3. Keep audio support-only: it cannot unlock a mode, grant mastery, award Star
   Dust, or replace answer activity.
4. Run `npm run verify:canonical-games`,
   `npm run verify:runtime-behavior`, and the web typecheck after changing a
   game wrapper or audio pathway.

Why this matters: Runtime evidence makes the all-games audio requirement a
real platform boundary instead of a best-effort component convention.

## OW-036: Progression Adapter Identity

Status: Active

Observed behavior: Route and report identity gates run later than a direct
progression-adapter call, so a wrapper must not be allowed to create candidate
progress before those later checks.

Procedure:

1. Compare progression and launch-session `unitKey`, `launchCode`, and
   `studentSessionId` with `validateProgressionLaunchIdentity`.
2. Return unchanged progression and zero award for entry or game completion
   when the comparison fails.
3. Return no `game_started` event when the comparison fails.
4. Keep the check provider-neutral and side-effect-free; do not infer tenant
   identity or write a recovery record from it.
5. Run `npm run verify:progression-runtime`,
   `npm run verify:canonical-games`, and the web typecheck after changing the
   identity boundary.

Why this matters: Identity is protected at the first scoring boundary, not
only after a mismatched event has reached a route or report validator.

## OW-038: Training Recovery Award Boundary

Status: Active

Observed behavior: Training Academy is a progression-writing recovery lane;
its award must not bypass the shared unit cap or accept malformed practice
counts.

Procedure:

1. Normalize practice counts to non-negative integers.
2. Cap the requested recovery award against the shared
   `UNIT_STAR_DUST_CAP` and the remaining unit capacity.
3. Preserve the normalized count and accepted award in recovery completion
   evidence.
4. Compare progression and launch-session `unitKey`, `launchCode`, and
   `studentSessionId` before creating a completion event.
5. Run the web typecheck and recovery verification after changing the recovery
   adapter.

Why this matters: Recovery stays deterministic and helpful without becoming a
second, weaker progression authority.

## OW-039: Training Report Award Authority

Status: Active

Observed behavior: Recovery response evidence and recovery completion evidence
can both carry the accepted Star Dust value. Summing both records inflates the
teacher-visible reward total.

Procedure:

1. Treat `training_answer_result` as evidence of the learner's response.
2. Treat `training_completed` as the authoritative recovery award event.
3. Count `earnedStarDust` in teacher summaries only from completion events.
4. Preserve the evidence value for inspection, but never treat metadata copies
   as additional awards.
5. Run `npm run verify:recovery-runtime`, the web typecheck, and the production
   build after changing recovery reporting.

Why this matters: Teacher reports must agree with the progression adapter even
when one recovery attempt contains multiple evidence records.

## OW-040: Launch-Surface Game Start Ownership

Status: Active

Observed behavior: A launch parent can accidentally emit `game_started` and
then mount a wrapper that emits the same event, producing duplicate attempt
boundaries.

Procedure:

1. Let the parent route select and gate the unlocked game mode.
2. Let the mounted canonical wrapper call `startUnlockedGameMode` and emit the
   one `game_started` event.
3. Keep locked and preview-only modes free of game-start evidence.
4. Apply the rule to front-door, QR, and future Phaser launch surfaces.
5. Run `npm run verify:canonical-games`, the web typecheck, and the production
   build after changing launch ownership.

Why this matters: One start event gives reports, replay validation, and future
durable persistence one reliable attempt boundary.

## OW-041: Front-Door Canonical Completion

Status: Active

Observed behavior: A launch surface can mount a compliant game wrapper while
still accepting its completion callback without the shared canonical gate.

Procedure:

1. Keep a synchronous event reference alongside rendered event state.
2. Append wrapper events to that reference before validating completion.
3. Call `validateCanonicalGameCompletion` with the active mode, tenant, launch,
   learner identity, and proposed result.
4. Apply progression and append the completion event only when the gate passes.
5. Show contract errors and pause completion when evidence is incomplete or
   invalid.

Why this matters: Every launch surface must enforce the same audio, replay,
identity, chronology, scoring, and award-consistency boundary.

## OW-042: Reuse Reviewed Pairing Wrappers Across Entry Surfaces

Status: Active

Observed behavior: A partner package can select a reviewed game mode that a
front-door surface still renders as a preview, creating tenant-specific gaps.

Procedure:

1. Check the selected mode against the progression unlock state.
2. Mount the reviewed wrapper for `match-up` or `memory-match` when selected.
3. Keep event, audio, scoring, progression, and completion ownership inside the
   shared wrapper and adapter boundary.
4. Leave unsupported modes as explicit previews until their own wrapper is
   reviewed for that surface.
5. Run `npm run verify:canonical-games`, web typecheck, and the production build
   after changing entry-surface coverage.

Why this matters: White-label tenants should share a reliable canonical slice
without promoting incomplete modes or duplicating game logic.

## OW-043: Advance Through Uncompleted Recommended Modes

Status: Active

Observed behavior: Reading `recommendedNextModes[0]` directly causes a
completed activity to be offered again after a learner finishes it.

Procedure:

1. Use `getNextUncompletedRecommendedMode` for student launch, front-door,
   flashcard entry, progress summary, and completion handoff surfaces.
2. Keep unlock checks separate from recommendation ordering.
3. Treat an undefined result as the end of the reviewed recommendation path,
   not as permission to invent another activity.
4. Do not apply this helper to Training Academy recovery source selection;
   recovery source is evidence-derived and has a different purpose.
5. Run `npm run verify:canonical-games`, web typecheck, production build, and
   route verification after changing progression ordering.

Why this matters: Students move through the curated pathway predictably, and
white-label tenants can reorder reviewed activities without code forks.

## OW-044: Promote Only Reviewed Next Activities

Status: Active

Observed behavior: A recommendation can advance to a mode that is already
implemented but still mounted as a preview on a launch surface.

Procedure:

1. Confirm the wrapper emits the standard start, round, answer, audio,
   mastery, and completion evidence.
2. Confirm it uses deterministic scoring and the shared completion gate.
3. Mount it explicitly for the student and front-door surfaces.
4. Keep live uploads and unreviewed modes outside the promoted wrapper.
5. Extend `verify:canonical-games`, then run web typecheck, production build,
   and route verification.

Why this matters: The curated path only promises activities that can actually
record safe, tenant-bound progress.

## OW-045: Promote Canonical Selection Activities

Status: Active

Observed behavior: A selection or arcade wrapper can pass its standalone review
while remaining a preview in a launch flow.

Procedure:

1. Confirm the wrapper has deterministic round state and scoring.
2. Confirm target-language prompt/audio evidence, standard events, replay
   metadata, and canonical completion handling.
3. Mount the wrapper explicitly in student and front-door flows.
4. Keep support language, random rewards, and live uploads outside the
   progression authority.
5. Extend `verify:canonical-games`, then run web typecheck, production build,
   and route verification.

Why this matters: A curated activity pathway must be playable, measurable, and
safe on every surface that offers it.

## OW-046: Promote Canonical Assessment Activities

Status: Active

Observed behavior: An assessment wrapper can be fully reviewed on its own
route but still be preview-only in the student pathway.

Procedure:

1. Confirm prompt and answer text have target-language audio support.
2. Confirm deterministic scoring, replay evidence, standard events, and shared
   completion validation.
3. Mount the wrapper explicitly in student and front-door flows.
4. Keep support language, upload state, and random rewards outside progression
   authority.
5. Extend `verify:canonical-games`, then run web typecheck, production build,
   and route verification.

Why this matters: Assessment routes must report the same trustworthy evidence
whether launched directly or from the curated student path.

## OW-047: Promote Binary Assessment Activities

Status: Active

Observed behavior: A binary assessment wrapper can be contract-compliant on
its direct route but still be preview-only in the curated launch flow.

Procedure:

1. Confirm the prompt, visible content, and answer choices have target-language
   audio support.
2. Confirm deterministic round completion, replay evidence, standard events,
   and shared completion validation.
3. Mount the wrapper explicitly in student and front-door flows.
4. Keep support language, media, uploads, and random rewards outside
   progression authority.
5. Extend `verify:canonical-games`, then run web typecheck, production build,
   and route verification.

Why this matters: Simple assessment modes should be as trustworthy in a
curated pathway as they are on their standalone route.

## OW-048: Promote Canonical Typed Responses

Status: Active

Observed behavior: A typed-response wrapper can be complete on its standalone
route while the curated launch flow still shows only a preview.

Procedure:

1. Confirm the prompt, input label, feedback, and replay controls have
   target-language audio support.
2. Confirm deterministic answer comparison, standard events, replay evidence,
   and shared completion validation.
3. Mount the wrapper explicitly in student and front-door flows.
4. Keep support language, media, uploads, and random rewards outside
   progression authority.
5. Extend `verify:canonical-games`, then run web typecheck, production build,
   and route verification.

Why this matters: Typed practice must remain auditable and consistent whether
it is launched directly or from the curated pathway.

## OW-037: Normalized Mastery Award Evidence

Status: Active

Observed behavior: A mode's requested score can be higher than the remaining
unit capacity after earlier curated activities, so mastery evidence cannot
copy the pre-adapter calculation.

Procedure:

1. Calculate the mode score using its reviewed deterministic scoring profile.
2. Pass that requested value to `completeGameMode`.
3. Write `result.earnedStarDust` into `mastery_updated`; do not repeat the
   requested value as the authoritative award.
4. Let the shared completion gate compare mastery, completion, and progression
   values before accepting the attempt.
5. Run `npm run verify:canonical-games` and the web typecheck after changing a
   scoring or mastery-event consumer.

Why this matters: Multi-game unit pathways remain valid when the platform
unit cap normalizes a later activity's award.

## OW-049: Promote Canonical Spelling Practice

Status: Active

Observed behavior: Spelling Practice can be fully verified on its standalone
route while the curated launch surfaces still render it as a preview.

Procedure:

1. Confirm the target-language prompt, instruction labels, letter tiles,
   feedback, and replay controls have audio support.
2. Confirm deterministic letter-bank construction, answer comparison,
   standard events, replay evidence, and shared completion validation.
3. Mount the wrapper explicitly in student and front-door flows.
4. Keep support language, media, uploads, and random rewards outside
   progression authority.
5. Confirm the supported script before promotion; do not present an English
   letter-normalization path as Japanese spelling support.
6. Extend `verify:canonical-games`, then run web typecheck, production build,
   and route verification.

Why this matters: Spelling practice must be auditable in the curated pathway,
and script-specific behavior must be explicit for white-label tenants.

## OW-050: Promote Canonical Fill in the Blank

Status: Active

Observed behavior: Fill in the Blank can be verified on its standalone route
while the curated launch surfaces still render it as a preview.

Procedure:

1. Confirm the reviewed target sentence, blank prompt, answer choices,
   feedback, and replay controls have target-language audio support.
2. Confirm deterministic answer normalization, choice ordering, standard
   events, replay evidence, and shared completion validation.
3. Mount the wrapper explicitly in student and front-door flows.
4. Keep support language, media, uploads, and random rewards outside
   progression authority.
5. Confirm the supported script before promotion; do not present English
   answer normalization as Japanese segmentation support.
6. Extend `verify:canonical-games`, then run web typecheck, production build,
   and route verification.

Why this matters: Syntax reinforcement must remain auditable in the curated
pathway, with target-language behavior explicit for white-label tenants.

## OW-051: Promote Canonical Sentence Builder

Status: Active

Observed behavior: Sentence Builder can be verified on its standalone route
while the curated launch surfaces still render it as a preview. Event names
must describe the actual boundary: showing a round is distinct from selecting
a tile.

Procedure:

1. Confirm the reviewed target sentences, instruction, target sentence, word
   tiles, feedback, and replay controls have target-language audio support.
2. Confirm one `round_shown` event is emitted when each round appears, while
   tile taps remain interaction evidence rather than round-display events.
3. Confirm deterministic ordered-token comparison, standard events, replay
   evidence, and shared completion validation.
4. Mount the wrapper explicitly in student and front-door flows.
5. Keep support language, media, uploads, and random rewards outside
   progression authority.
6. Confirm the supported script before promotion; do not present English token
   normalization as Japanese segmentation support.
7. Extend `verify:canonical-games`, then run web typecheck, production build,
   and route verification.

Why this matters: Syntax construction must be auditable at round level and
must remain consistent across white-label launch surfaces.
## OW-054: Runtime Level-Aware Game Access

Status: Active

When a direct route or stale QR code points to a game that is not supported at
the unit's curriculum level, the route must show a level-specific explanation
and return to the reviewed activity hub. It must not mount the interactive
child. The local progression adapter must independently reject both start and
completion, preserve state, and award zero Star Dust.

Use the shared `isGameModeSupportedAtLevel` contract, keep later-level routes
reusable, and run the canonical-game, runtime, typecheck, build, and route
verification gates after changes. External Phaser candidates remain isolated;
this boundary is not an integration approval.

The frozen Phaser scene inventory is now protected by a SHA-256 evidence
manifest and `verify:phaser-scene-inventory`. If the source snapshot is used in
future work, review the exact manifest and candidate mapping first. The first
human/Z.ai handoff may now request Memory Match evidence only: fixture replay,
event/scoring replay, target-language audio map, mobile/accessibility capture,
and wrapper notes. Do not request a broad source merge or route replacement.

Canonical completion handlers now use an explicit idempotence guard. Run
`npm run verify:completion-idempotence` after completion-flow changes. The
first completion remains event-validated; duplicate callbacks and
already-completed replays are quiet no-ops. This is a browser-session guard,
not durable persistence, so the future hosted/local adapter must carry a
stable completion idempotency key at its write boundary. See ADR 0704, DR-777,
and `docs/operating-notes/2026-09-13-completion-idempotence.md`.

The durable progress-event contract now preserves the same completion identity
across hosted and local adapters. Use
`createCanonicalCompletionIdempotencyKey` for future writes and reject a
progress-event write that has no key. Atomic create-or-return-existing behavior
is required before live persistence is enabled; this remains a contract, not a
database selection or write approval. See ADR 0705 and DR-778.

The cross-layer persistence alignment check must remain enabled when a new
hosted or local intent is added. Confirm its completion key fields, duplicate
rejection, and atomic-write flags match the durable progress-event record; an
isolated adapter validator is not sufficient. See ADR 0706.

Future adapters must use `planCanonicalCompletionWrite` before their provider
operation. Treat `create` as the only new-write path, `return-existing` as a
successful idempotent retry, `conflict` as a visible integrity failure, and
`invalid` as a rejected request. The planner is pure and must not be presented
as live persistence. See ADR 0707.

Every canonical game must carry the same non-blank `scoringProfileId` on
`mastery_updated` and `game_completed`. When a new wrapper or route is added,
test both missing completion metadata and profile mismatch; do not rely on
mastery metadata alone. See ADR 0708.

Future progress-event requests must pass `completionIdentity` and an
idempotency key together. Use `validateCanonicalCompletionIdempotencyKey` to
derive the expected value; reject a key from another unit, tenant, launch,
session, or mode before calling a provider. See ADR 0709.

When adding a canonical game event, always preserve `tenantId`, `unitKey`,
`launchCode`, and `studentSessionId`. The sequence validator now rejects a
missing field even when no expected identity object is supplied. See ADR 0710.

When adding replay evidence, preserve one identical `replay-v1:` seed across
all required game and audio events. A syntactically valid but different seed is
still rejected as mixed replay evidence. See ADR 0713.

When reviewing a returned Phaser candidate, run the package gate after setting
`LIVING_TEXTBOOOK_ZAI_CANDIDATE_ROOT`. Confirm that the fixture, event replay,
audio map, scoring replay, accessibility evidence, source manifest, and wrapper
notes all pass before any wrapper decision. A valid package is still
review-only; it does not authorize source import, route replacement, or live
persistence. See ADR 0711.

The package verifier has a source-free synthetic behavior check in
`verify:foundation`. Keep both the passing packet and the deliberate
`randomRewards: true` and cross-session audio rejection cases intact when
changing the candidate contract. This catches accidental weakening of the
review gate without needing Z.ai files. See ADR 0712.

When adding canonical replay evidence, preserve one identical `replay-v1:` seed
across every required game and audio event. A different valid seed is still
invalid mixed-layout evidence. See ADR 0713.

When a platform or game wrapper supplies a replay seed, pass the same value to
`startUnlockedGameMode`, `createGameInteractionEvent`,
`createAudioRequestedEvent`, and `completeGameMode`. The adapter preserves the
supplied value; omitted values use the deterministic unit-and-mode fallback.
Run `npm run verify:runtime-behavior` when changing this boundary. See ADR
0714.

Current game components may still carry `replaySeed` in event metadata. The
adapter preserves that value when no explicit argument is supplied; new
wrappers should pass the explicit `replaySeed` argument, which takes priority.

Replay evidence must use a non-empty transport-safe `replay-v1:` seed. The
canonical validator rejects empty or unsafe seeds and reports missing unit
identity without throwing. Keep malformed evidence on the review path and run
`npm run verify:runtime-behavior` when changing this boundary. See ADR 0715.

When changing a canonical game wrapper, treat `PlayableGameRouteShell` as the
replay-seed authority. Require `replaySeed` in the game props and pass the
same explicit value to start, interaction, audio, and completion factories.
Do not recreate the seed inside a game component. Run
`npm run verify:canonical-games` and `npm run verify:foundation` after
changing this boundary. See ADR 0716.

`PlayableGameRouteShell` also accepts an optional `platformReplaySeed` for a
future approved platform or Phaser adapter. The shared resolver accepts only
a valid transport-safe seed and falls back deterministically for absent or
malformed input. Use that input only at the route-shell boundary; do not derive
or replace it inside a game. Every start, interaction, audio, and completion
event must reuse the resolved value. This is an integration seam, not
permission to import frozen source or enable live writes.
Run `npm run verify:canonical-games` and `npm run verify:foundation` after
changing it. See ADR 0718.

The standards and decision-register documents are executable project memory.
When editing either file, run `node scripts/verify-standards-integrity.mjs`
before committing. The check intentionally allows historical decision records
to be out of numeric order, but rejects duplicate IDs and titles. If a nested
cross-cutting standard is needed without renumbering the established document,
use an explicit subsection such as `11.1`. The foundation composition invokes
the same check automatically. See ADR 0719.

The frozen Z.ai/Phaser snapshot has a dedicated reproducibility command:
`npm run verify:phaser-source-evidence`. It reads the isolated review folder,
or the folder named by `LIVING_TEXTBOOK_ZAI_REVIEW_ROOT`, and compares the
review packet's SHA-256 manifest. A passing result proves source identity only;
it never authorizes source import, route activation, or student assignment. Run
it before reviewing a returned candidate package. See ADR 0724.

The frozen-source checker must remain path-contained and read-only. Run
`npm run verify:phaser-source-evidence-contract` after changing that checker;
it rejects write, import, process, and application-path markers while requiring
the isolated review-root and path-containment guards. This protects the
review-only boundary before `npm run verify:phaser-source-evidence` is run.
See ADR 0725.

Phaser contract-review records must resolve their `gameMode` through the
approved shared candidate profile and preserve that profile's `parentEngine`.
Run `npm run verify:phaser-candidate-reviews` and
`npm run verify:runtime-behavior` after changing review records or profile
validation. A nonblank mode/engine pair is not sufficient if the pair is
incompatible. See ADR 0726.

Phaser contract-review `sourceFiles` are evidence references, not arbitrary
filesystem locations. Keep every path unique and repository-relative using
forward slashes; reject drive letters, leading slashes, backslashes, and
parent-directory traversal. This keeps review packets portable and prevents a
candidate record from escaping its isolated evidence boundary. Run
`npm run verify:runtime-behavior` and `npm run verify:phaser-candidate-reviews`
after changing this validation. See ADR 0727.

Every Phaser return-package artifact must have a unique `kind`, `artifactId`,
and `relativePath`. A checksum proves the bytes at a path, but it does not
prove that separate evidence obligations were supplied; duplicate paths must
fail the package gate. Keep the duplicate-path regression in
`verify-phaser-candidate-package-behavior.mjs` and run
`npm run verify:phaser-candidate-package-behavior` after changing artifact
validation. See ADR 0728.

Treat Phaser contract-review records as untrusted JSON at the boundary. The
validator must normalize or reject missing/non-array `sourceFiles`,
`findings`, `missingEvidence`, and `blockedActions`, plus malformed nested
approval blockers, without throwing. Keep null-entry and non-array regression
cases in `verify-runtime-behavior.mjs`; run `npm run verify:runtime-behavior`
and the web typecheck after changing this boundary. See ADR 0729.

Frozen Phaser source manifests must list each reviewed path exactly once using
normalized repository-relative POSIX syntax. Reject duplicate entries, drive
letters, backslashes, empty segments, dot segments, and parent traversal before
hashing. Run `npm run verify:phaser-source-evidence-contract` and
`npm run verify:phaser-source-evidence` after changing this checker; it must
remain read-only and isolated. See ADR 0730.

Treat canonical game event evidence as untrusted at every adapter and review
boundary. `validateCanonicalGameEventSequence` must return an invalid report
for non-array inputs and malformed entries rather than throwing; valid events
must retain the existing identity, audio, replay, scoring, mastery, and
completion checks. Run `npm run verify:runtime-behavior` and both workspace
typechecks after changing this contract. See ADR 0731.

Treat `game_completed` as the terminal gameplay boundary. A canonical wrapper
must not emit another `game_started`, `round_shown`, `answer_submitted`,
`answer_result`, or `mastery_updated` event afterward. Learning-audio replay
may remain available as a support action, but it cannot reopen gameplay or
change progression. Run `npm run verify:runtime-behavior` and
`npm run verify:canonical-games` after changing this rule. See ADR 0732.
