# DR-1197: SQLite Provider Cache Lifecycle

The SQLite progression adapter now closes its cached database connection before
replacing it when `LIVING_TEXTBOOOK_PROGRESSION_DB_PATH` changes. This prevents
file-handle and WAL-resource leaks during local/hosted configuration changes
without changing provider selection, activation, tenant scope, or persistence
policy gates.
