import { readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import {
  validateHostedPersistenceActivationBinding,
  type HostedPersistenceActivationRecord,
} from "@living-textbook/content-model";
import { validateDurableBackupFilesystemPath, validateDurableBackupPath } from "./backupPathPolicy";

export type HostedPersistenceActivationReadResult =
  | { status: "available"; relativePath: string; record: HostedPersistenceActivationRecord; errors: string[] }
  | { status: "not-found" | "blocked"; relativePath: string | null; record: null; errors: string[] };

export async function readHostedPersistenceActivation(input: {
  tenantId: string;
  packageId: string;
}): Promise<HostedPersistenceActivationReadResult> {
  if (![input.tenantId, input.packageId].every(isSafeSegment)) {
    return blocked(["Hosted persistence activation reads require safe tenant and package path segments."]);
  }

  const configuredRoot = process.env.LIVING_TEXTBOOOK_HOSTED_PERSISTENCE_ACTIVATION_ROOT?.trim();
  if (!configuredRoot) return blocked(["Hosted persistence activation requires an explicit server-side custody root."]);

  const root = resolve(configuredRoot);
  const directory = resolve(root, input.tenantId, input.packageId);
  const activationPath = resolve(directory, "activation.json");
  const pathErrors = [
    ...validateDurableBackupPath(directory, root),
    ...validateDurableBackupPath(activationPath, root),
    ...validateDurableBackupFilesystemPath(directory, root),
  ];
  if (pathErrors.length > 0) return blocked([...new Set(pathErrors)]);

  try {
    const record = JSON.parse(await readFile(activationPath, "utf8")) as HostedPersistenceActivationRecord;
    const errors = validateHostedPersistenceActivationBinding(record, input);
    if (errors.length > 0) return { status: "blocked", relativePath: relative(root, activationPath).replaceAll("\\", "/"), record: null, errors };
    return { status: "available", relativePath: relative(root, activationPath).replaceAll("\\", "/"), record, errors: [] };
  } catch {
    return {
      status: "not-found",
      relativePath: relative(root, activationPath).replaceAll("\\", "/"),
      record: null,
      errors: ["No package-scoped hosted persistence activation record was found in the configured custody root."],
    };
  }
}

function blocked(errors: string[]): HostedPersistenceActivationReadResult {
  return { status: "blocked", relativePath: null, record: null, errors: [...new Set(errors)] };
}

function isSafeSegment(value: string): boolean {
  return typeof value === "string" && value.length > 0 && value.length <= 160 && /^[A-Za-z0-9._-]+$/.test(value);
}
