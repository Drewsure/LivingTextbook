import { isAbsolute, relative, resolve } from "node:path";

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

const pathSeparator = process.platform === "win32" ? "\\" : "/";
