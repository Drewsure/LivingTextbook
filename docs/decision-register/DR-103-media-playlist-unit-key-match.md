# DR-103: Media Playlist Unit-Key Match

## Decision

Media playlist panels should match the displayed unit by `playlist.unitKey`.

## Reason

Future content packages will contain multiple units. Matching by package id alone can show the wrong unit context once multi-unit packages arrive.

## Standard

- Playlist route UI resolves unit context using the playlist unit key.
- Package id identifies the package, not the specific unit.
