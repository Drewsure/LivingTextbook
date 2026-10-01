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

Structured QR references then produce a review-only alias preview. The preview
binds page, unit, activity, language, edition, package, and local fallback
identity before the separate QR registry and print-authorization gates.
