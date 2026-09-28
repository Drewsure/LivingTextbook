import { existsSync, realpathSync, statSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";

export function validateQuarantineFilesystemPath(candidatePath: string, configuredRoot: string | undefined): string[] {
  if (typeof configuredRoot !== "string" || configuredRoot.trim().length === 0) {
    return ["Upload quarantine requires a configured filesystem root."];
  }
  if (typeof candidatePath !== "string" || candidatePath.trim().length === 0) {
    return ["Upload quarantine requires a non-empty filesystem path."];
  }

  const rootPath = resolve(configuredRoot.trim());
  const artifactPath = resolve(candidatePath.trim());
  const lexicalPath = relative(rootPath, artifactPath);
  if (!lexicalPath || lexicalPath === ".") {
    return ["Upload quarantine paths must be below, not equal to, the configured root."];
  }
  if (isAbsolute(lexicalPath) || lexicalPath === ".." || lexicalPath.startsWith(`..${pathSeparator}`)) {
    return ["Upload quarantine paths must remain inside the configured root."];
  }
  if (!existsSync(rootPath)) {
    return ["The upload quarantine root must exist before filesystem access is allowed."];
  }
  if (!statSync(rootPath).isDirectory()) {
    return ["The upload quarantine root must be a directory."];
  }

  const rootRealPath = realpathSync.native(rootPath);
  const existingBoundary = findExistingAncestor(artifactPath);
  const boundaryRealPath = realpathSync.native(existingBoundary);
  if (!isWithin(boundaryRealPath, rootRealPath)) {
    return ["The upload quarantine filesystem path escapes the configured root."];
  }

  if (existsSync(artifactPath)) {
    const artifactRealPath = realpathSync.native(artifactPath);
    if (!isWithin(artifactRealPath, rootRealPath)) {
      return ["The upload quarantine artifact resolves outside the configured root."];
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
