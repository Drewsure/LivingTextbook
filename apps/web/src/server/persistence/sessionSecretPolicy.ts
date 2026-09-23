export const SESSION_SECRET_MIN_BYTES = 32;

export function readServerSessionSecret(environmentName: string): string | undefined {
  const secret = process.env[environmentName]?.trim();
  if (!secret || Buffer.byteLength(secret, "utf8") < SESSION_SECRET_MIN_BYTES) return undefined;
  return secret;
}
