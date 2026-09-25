# DR-1200: Source Draft Import Checksum

Source draft import previews now reject arbitrary source checksum strings and
require the canonical `sha256:<64 hexadecimal characters>` format. This keeps
the final review-only publisher intake handoff independently identity-safe
before upstream binding. See ADR 1200.
