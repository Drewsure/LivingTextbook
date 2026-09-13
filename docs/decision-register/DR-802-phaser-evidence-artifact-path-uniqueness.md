# DR-802: Phaser Evidence Artifact-Path Uniqueness

Require every required artifact in a Phaser candidate return package to use a
distinct relative path in addition to a distinct kind and artifact identifier.
A checksum validates file bytes but cannot replace a missing evidence artifact;
duplicate paths therefore fail closed. The package remains review-only and the
change does not authorize source import, route activation, scoring,
persistence, package promotion, or assignment. See ADR 0728.
