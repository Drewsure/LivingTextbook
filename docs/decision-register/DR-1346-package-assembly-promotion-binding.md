# DR-1346: Package Assembly Promotion Binding

Local package assembly must prefer the exact tenant/package/version approved asset directory created by the controlled promotion writer. A valid promotion record must bind delivery manifest and receipt identities before any publisher bytes are copied into the local package. The assembly record records whether package-scoped promotion custody or the compatibility flat-root path was used. Tampering, missing promotion metadata, and identity drift fail closed; student activation, hosted persistence, QR mutation, and learner records remain separate. See ADR 1347.

