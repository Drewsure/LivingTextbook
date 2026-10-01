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
