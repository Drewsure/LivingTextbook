# DR-1198: Quarantine Filename Portability

Quarantine upload metadata now validates a bounded portable filename while
preserving Unicode. Path separators, control characters, unsafe Windows
characters, trailing dots, and reserved device names are rejected. The store
normalizes backslashes before taking a basename, and payload files remain named
from the quarantine identity. See ADR 1198.
