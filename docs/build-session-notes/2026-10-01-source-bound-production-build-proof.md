# Build session: Bind pilot build evidence to the current source revision

Replaced the saleability audit's stale-output check with a source-bound
production-build proof. The web workspace writes the proof after a successful
webpack build; the audit verifies the proof's source revision, build ID,
timestamp, and command. A commit made after the last build now correctly
requires a fresh production build before the pilot can advance.

The foundation composition verifier also checks that the web postbuild hook,
the proof verification command, and the saleability audit remain wired to one
another.

Recorded under ADR 1415 / DR-1415.
