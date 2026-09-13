export interface ProgressionLaunchIdentity {
  unitKey: string;
  launchCode: string;
  studentSessionId: string;
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
    return { unitKey: `${label} missing`, launchCode: `${label} missing`, studentSessionId: `${label} missing` };
  }

  return {
    unitKey: readField(value.unitKey, `${label} unitKey`),
    launchCode: readField(value.launchCode, `${label} launchCode`),
    studentSessionId: readField(value.studentSessionId, `${label} studentSessionId`),
  };
}

function readField(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
