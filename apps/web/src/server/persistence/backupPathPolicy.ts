import { existsSync, realpathSync, statSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";

export function validateDurableBackupPath(candidatePath: string, configuredRoot: string | undefined): string[] {
  if (typeof configuredRoot !== "string" || configuredRoot.trim().length === 0) {
    return ["Durable backup operations require a configured backup custody root."];
  }
  if (typeof candidatePath !== "string" || candidatePath.trim().length === 0) {
    return ["Durable backup operations require a non-empty artifact path."];
  }

  const rootPath = resolve(configuredRoot.trim());
  const artifactPath = resolve(candidatePath.trim());
  const relativePath = relative(rootPath, artifactPath);
  if (!relativePath || relativePath === ".") return ["Durable backup artifacts must be stored below, not at, the custody root."];
  if (isAbsolute(relativePath) || relativePath === ".." || relativePath.startsWith(`..${pathSeparator}`)) {
    return ["Durable backup artifacts must remain inside the configured custody root."];
  }
  return [];
}

export function validateDurableBackupFilesystemPath(candidatePath: string, configuredRoot: string | undefined): string[] {
  const lexicalErrors = validateDurableBackupPath(candidatePath, configuredRoot);
  if (lexicalErrors.length > 0) return lexicalErrors;

  const rootPath = resolve((configuredRoot as string).trim());
  const artifactPath = resolve((candidatePath as string).trim());
  if (!existsSync(rootPath)) {
    return ["The durable backup custody root must exist before backup operations can be used."];
  }
  if (!statSync(rootPath).isDirectory()) {
    return ["The durable backup custody root must be a directory."];
  }

  const rootRealPath = realpathSync.native(rootPath);
  const existingBoundary = findExistingAncestor(artifactPath);
  const boundaryRealPath = realpathSync.native(existingBoundary);
  if (!isWithin(boundaryRealPath, rootRealPath)) {
    return ["The durable backup filesystem path escapes the configured custody root."];
  }

  if (existsSync(artifactPath)) {
    const artifactRealPath = realpathSync.native(artifactPath);
    if (!isWithin(artifactRealPath, rootRealPath)) {
      return ["The durable backup artifact resolves outside the configured custody root."];
    }
  }
  return [];
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
