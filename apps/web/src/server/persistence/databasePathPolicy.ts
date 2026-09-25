import { existsSync, realpathSync, statSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";

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

export function validateDurableDatabaseFilesystemPath(
  databasePath: string | undefined,
  configuredRoot: string | undefined,
): string[] {
  const lexicalErrors = validateDurableDatabasePath(databasePath, configuredRoot);
  if (lexicalErrors.length > 0) return lexicalErrors;

  const rootPath = resolve((configuredRoot as string).trim());
  const artifactPath = resolve((databasePath as string).trim());
  if (!existsSync(rootPath)) return ["The durable data custody root must exist before SQLite readiness can be reported."];
  if (!statSync(rootPath).isDirectory()) return ["The durable data custody root must be a directory."];
  const rootRealPath = realpathSync.native(rootPath);
  const existingBoundary = findExistingAncestor(artifactPath);
  const boundaryRealPath = realpathSync.native(existingBoundary);
  if (!isWithin(boundaryRealPath, rootRealPath)) {
    return ["The durable SQLite database filesystem path escapes the configured data custody root."];
  }
  if (existsSync(artifactPath)) {
    const artifactRealPath = realpathSync.native(artifactPath);
    if (!isWithin(artifactRealPath, rootRealPath)) {
      return ["The durable SQLite database resolves outside the configured data custody root."];
    }
  }
  return [];
}

export function getDurableDatabasePathPolicySnapshot(): DurableDatabasePathPolicySnapshot {
  const configuredDatabasePath = process.env.LIVING_TEXTBOOK_PROGRESSION_DB_PATH?.trim();
  const databasePath = configuredDatabasePath || resolve(process.cwd(), "data", "living-textbook-progress.sqlite");
  const configuredRoot = process.env.LIVING_TEXTBOOK_PERSISTENCE_DATA_ROOT;
  const errors = [
    ...validateDurableDatabasePath(databasePath, configuredRoot),
    ...validateDurableDatabaseFilesystemPath(databasePath, configuredRoot),
  ];
  return { valid: errors.length === 0, errors: [...new Set(errors)] };
}

function findExistingAncestor(candidatePath: string): string {
  let currentPath = candidatePath;
  while (!existsSync(currentPath)) {
    const parentPath = dirname(currentPath);
    if (parentPath === currentPath) return currentPath;
    currentPath = parentPath;
  }
  return currentPath;
}

function isWithin(candidatePath: string, rootPath: string): boolean {
  const relativePath = relative(rootPath, candidatePath);
  return !isAbsolute(relativePath)
    && relativePath !== ".."
    && !relativePath.startsWith(`..${pathSeparator}`);
}

const pathSeparator = process.platform === "win32" ? "\\" : "/";
