# Publisher Pilot Input Kit

The first saleable white-label pilot needs a real publisher package. This kit
turns that human handoff into a repeatable, reviewable input without granting
package assembly, QR printing, persistence, or student use.

## Create A Kit

From PowerShell:

```powershell
Set-Location -LiteralPath "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
node scripts/create-publisher-pilot-intake-kit.mjs `
  --root "D:\LIVING TEXTBOOOK PROJECT\publisher-pilot-input" `
  --tenant-id "publisher-name" `
  --publisher-name "Publisher Name" `
  --book-title "Book Title" `
  --unit-key "series:book:L1:U1"
```

The generator refuses to overwrite an existing brief. It creates folders for
source, images, audio, video, transcripts, fonts, and background media, plus a
`publisher-pilot-intake.json` metadata brief and a handoff README.

The default source declaration is `source/unit-1.pdf`. For an editable or
text-based publisher handoff, pass an explicit safe source path such as
`--source-file source/unit-1.docx`, `source/unit-1.txt`, `source/unit-1.md`,
or `source/unit-1.csv`. The canonical source contract validates the declared
type and the same review-only gates apply to every format.

Assist languages are optional and tenant-selected. Add
`--support-languages ja` (or a comma-separated list) only after the publisher
or school approves the support-language policy. Support language is assistive
only; English/target-language completion remains the progression trigger.

The target language and delivery mode are also explicit tenant choices. The
kit defaults to `--target-language en` and `--delivery-mode hybrid` for the
reference pilot, but a publisher may choose another bounded language id and
`hosted-pwa`, `closed-local`, or `hybrid` delivery:

```powershell
node scripts/create-publisher-pilot-intake-kit.mjs `
  --root "D:\PublisherPilotInput" `
  --tenant-id "publisher-name" `
  --publisher-name "Publisher Name" `
  --book-title "Book Title" `
  --unit-key "series:book:L1:U1" `
  --target-language "ja" `
  --delivery-mode "closed-local"
```

Hosted persistence remains opt-in and is never inferred from `hosted-pwa` or
`hybrid`. Add `--hosted-persistence-opt-in` only when the publisher or school
has separately approved hosted storage, retention, backup, cost, and reporting
policy. The flag is rejected for `closed-local` delivery and all generated
kits remain review-only.

The intake preflight independently rechecks these language and delivery fields
after generation. If a publisher edits the JSON manually, malformed language
ids, duplicate support languages, unsupported delivery modes, or an invalid
closed-local hosted opt-in keep the inventory incomplete.

The kit also creates an `evidence` folder with structured declarations for
rights, accessibility/captions, and scan evidence. These declarations are
inventory inputs only; they do not assert that the evidence is valid or
approved.

## Required Human Completion

The publisher must replace the `REPLACE_WITH_*` placeholders, supply the real
source and media files, and provide:

- rights owner and permission scope for every file;
- a rights, accessibility/captions, and scan evidence file at every declared
  evidence path;
- edition, version, page or section, and unit mapping;
- target-language audio, transcript/caption, and accessibility evidence;
- QR page references and the chosen hosted, closed-local, or hybrid mode;
- teacher reporting, student identity, retention, backup, and persistence policy.

The brief is deliberately review-only. A completed folder is evidence for the
existing quarantine and source-review workflow, not a release approval.

Before source preflight, run the no-write inventory check:

```powershell
node scripts/publisher-pilot-intake-preflight.mjs `
  --root "D:\PublisherPilotInput"
```

It must report `inventoryStatus: "complete"`. An incomplete result names
missing files, unsafe paths, unresolved placeholders, and structural errors; it
does not write or promote anything.

To preserve the completed inventory as a handoff artifact, provide a new output
path. The preflight report refuses to overwrite an existing report:

```powershell
node scripts/publisher-pilot-intake-preflight.mjs `
  --root "D:\PublisherPilotInput" `
  --output "D:\PublisherPilotOperator\evidence\publisher-intake-preflight.json"
```

This report contains bounded inventory metadata and gate results only. It does
not contain bearer credentials, learner records, raw payload bytes, or a
student-facing release decision. Keep it with the publisher handoff and attach
it to the later quarantine/source-review record.

## Bridge To The Canonical Source Manifest

After the intake brief is complete and the create-once intake preflight reports
`inventoryStatus: "complete"`, generate the canonical source declaration from
the same kit:

```powershell
node scripts/create-publisher-source-manifest-from-pilot-kit.mjs `
  --root "D:\PublisherPilotInput"
```

This bridge reads `publisher-pilot-intake.json` and creates only
`publisher-source-manifest.json`. It refuses to overwrite an existing
manifest, does not copy or upload files, and keeps package assembly,
promotion, QR printing, persistence, and student use blocked. It creates a
deterministic pilot package identity from the tenant and unit metadata.

Then run the canonical source preflight against the same folder:

```powershell
$env:LIVING_TEXTBOOOK_PUBLISHER_SOURCE_DIRECTORY = "D:\PublisherPilotInput"
$env:LIVING_TEXTBOOOK_PUBLISHER_PREFLIGHT_OUTPUT = "D:\PublisherPilotInput\evidence\publisher-source-preflight.json"
npm run preflight:publisher-source
```

The canonical preflight is the next review handoff. Its report is create-once
and must remain beside the publisher folder at
`evidence/publisher-source-preflight.json`; rerun it to a new handoff folder
after changing the manifest or source inventory. The report is still
review-only evidence; a complete inventory does not prove rights,
accessibility, package approval, release, QR authorization, persistence, or
student readiness.

Structured QR references then produce a review-only alias preview. The preview
binds page, unit, activity, language, edition, package, and local fallback
identity before the separate QR registry and print-authorization gates.

## Create A Versioned Revision

When a publisher supplies a missing asset or changes an intake input, preserve
the old handoff and create a new external folder. Never overwrite the earlier
preflight reports or manifest. The revision helper copies only the brief,
README, and files declared by the brief; it excludes old manifests and
preflight reports and remains review-only:

```powershell
node scripts/create-publisher-pilot-intake-revision.mjs `
  --source-root "D:\PublisherPilotInput" `
  --output-root "D:\PublisherPilotInput-2026-10-03-audio-revision"
```

The command refuses repository-local roots, symlinked inputs, non-empty output
folders, and overwrite. It reports missing required files and omitted optional
media without inventing placeholders. After the revision is created, run the
intake preflight with a new output path, then regenerate the canonical source
manifest only when the brief and required files are complete. A revision is a
custody-preserving handoff, not an approval or a package release. It also
creates `evidence/publisher-handoff-revision.json`, a checksum-bound,
metadata-only record of copied, missing, omitted, and excluded paths. That
record is create-once and remains blocked from package assembly, QR printing,
persistence, and student use.
