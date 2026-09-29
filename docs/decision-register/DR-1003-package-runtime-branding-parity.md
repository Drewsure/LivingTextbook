# DR-1003: Package Runtime Branding Parity

Date: 2026-09-30
Status: Accepted

The dynamic local package runtime entry route now resolves tenant branding from
the verified package configuration, using the same resolver already used by
the package front door, Memory Match, media, and teacher evidence routes.
This makes the white-label boundary consistent across the whole local package
surface instead of allowing the root route to depend on an application-level
MiniStar/sample-publisher registry.

Unknown safe tenant ids may receive a generic review/error shell, while unsafe
ids remain rejected. This is a presentation and isolation rule only. It does
not enable package installation, update, activation, QR mutation, learner
records, hosted persistence, or release approval.
