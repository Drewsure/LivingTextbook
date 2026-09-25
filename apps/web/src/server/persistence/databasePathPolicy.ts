import { isAbsolute, relative, resolve } from "node:path";

export interface DurableDatabasePathPolicySnapshot {
  valid: boolean;
  errors: string[];
}

export function validateDurableDatabasePath(
  databasePath: string | undefined,
  configuredRoot: string | undefined,
): string[] {
  if (typeof configuredRoot !== "string" || configuredRoot.trim().length === 0) {
    return ["Durable persistence requires a configured data custody root."];
  }
  if (typeof databasePath !== "string" || databasePath.trim().length === 0) {
    return ["Durable persistence requires a configured SQLite database path."];
  }

  const rootPath = resolve(configuredRoot.trim());
  const artifactPath = resolve(databasePath.trim());
  const relativePath = relative(rootPath, artifactPath);
  if (!relativePath || relativePath === ".") {
    return ["The durable SQLite database must be stored below, not at, the data custody root."];
  }
  if (isAbsolute(relativePath) || relativePath === ".." || relativePath.startsWith(`..${pathSeparator}`)) {
    return ["The durable SQLite database must remain inside the configured data custody root."];
  }
  if (!artifactPath.toLowerCase().endsWith(".sqlite")) {
    return ["The durable SQLite database path must use the .sqlite extension."];
  }
  return [];
}

export function getDurableDatabasePathPolicySnapshot(): DurableDatabasePathPolicySnapshot {
  const configuredDatabasePath = process.env.LIVING_TEXTBOOK_PROGRESSION_DB_PATH?.trim();
  const databasePath = configuredDatabasePath || resolve(process.cwd(), "data", "living-textbook-progress.sqlite");
  const errors = validateDurableDatabasePath(databasePath, process.env.LIVING_TEXTBOOK_PERSISTENCE_DATA_ROOT);
  return { valid: errors.length === 0, errors };
}

const pathSeparator = process.platform === "win32" ? "\\" : "/";
