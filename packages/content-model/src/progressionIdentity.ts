export interface ProgressionLaunchIdentity {
  unitKey?: string;
  launchCode?: string;
  studentSessionId?: string;
}

export function validateProgressionLaunchIdentity(
  progression: unknown,
  launchSession: unknown,
): string[] {
  const errors: string[] = [];
  const progressionIdentity = readIdentity(progression, "progression");
  const launchIdentity = readIdentity(launchSession, "launch session");

  for (const field of ["unitKey", "launchCode", "studentSessionId"] as const) {
    if (!progressionIdentity[field] || !launchIdentity[field]) continue;
    if (progressionIdentity[field] !== launchIdentity[field]) {
      errors.push(
        `Progression launch identity ${field} must match; progression has ${progressionIdentity[field]}, launch session has ${launchIdentity[field]}.`,
      );
    }
  }

  return errors;
}

function readIdentity(value: unknown, label: string): ProgressionLaunchIdentity {
  if (!isRecord(value)) {
    return {};
  }

  return {
    unitKey: readOptionalField(value.unitKey),
    launchCode: readOptionalField(value.launchCode),
    studentSessionId: readOptionalField(value.studentSessionId),
  };
}

function readOptionalField(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
