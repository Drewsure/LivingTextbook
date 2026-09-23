import { createHmac, timingSafeEqual } from "node:crypto";
import { readServerSessionSecret, readServerSessionSecrets } from "./sessionSecretPolicy.ts";

export const STUDENT_SESSION_COOKIE = "living-textbook-student-session";
export const STUDENT_SESSION_VERSION = 1 as const;
export const STUDENT_SESSION_COOKIE_MAX_BYTES = 8 * 1024;
export const STUDENT_SESSION_MAX_TTL_SECONDS = 24 * 60 * 60;
const DEFAULT_TTL_SECONDS = 8 * 60 * 60;

export interface StudentSessionClaims {
  version: typeof STUDENT_SESSION_VERSION;
  tenantId: string;
  packageId: string;
  launchCode: string;
  studentSessionId: string;
  issuedAt: string;
  expiresAt: string;
}

export function createStudentSessionCookieValue(
  claims: StudentSessionClaims,
): string | undefined {
  if (!isValidStudentSessionShape(claims)) return undefined;
  const secret = getSessionSecret();
  if (!secret) return undefined;

  const payload = toBase64Url(JSON.stringify(claims));
  const value = `${payload}.${sign(payload, secret)}`;
  return Buffer.byteLength(value, "utf8") <= STUDENT_SESSION_COOKIE_MAX_BYTES ? value : undefined;
}

export function readStudentSessionClaims(request: Request): StudentSessionClaims | undefined {
  const secrets = getSessionSecrets();
  if (secrets.length === 0) return undefined;

  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookieValue = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${STUDENT_SESSION_COOKIE}=`))
    ?.slice(STUDENT_SESSION_COOKIE.length + 1);
  if (!cookieValue) return undefined;
  if (Buffer.byteLength(cookieValue, "utf8") > STUDENT_SESSION_COOKIE_MAX_BYTES) return undefined;

  const segments = cookieValue.split(".");
  if (segments.length !== 2) return undefined;
  const [payload, signature] = segments;
  if (!payload || !signature || !isValidSignature(payload, signature, secrets)) return undefined;

  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Partial<StudentSessionClaims>;
    if (!isValidStudentSessionShape(claims)) return undefined;
    const issuedAt = Date.parse(claims.issuedAt);
    const expiresAt = Date.parse(claims.expiresAt);
    const now = Date.now();
    if (issuedAt > now + 30_000 || expiresAt <= now || expiresAt <= issuedAt || expiresAt - issuedAt > STUDENT_SESSION_MAX_TTL_SECONDS * 1000) return undefined;
    return claims as StudentSessionClaims;
  } catch {
    return undefined;
  }
}

export function getStudentSessionExpiry(now = Date.now()): string {
  const configured = Number(process.env.LIVING_TEXTBOOK_STUDENT_SESSION_TTL_SECONDS);
  const ttlSeconds = Number.isSafeInteger(configured) && configured > 0
    ? Math.min(configured, STUDENT_SESSION_MAX_TTL_SECONDS)
    : DEFAULT_TTL_SECONDS;
  return new Date(now + ttlSeconds * 1000).toISOString();
}

export function setStudentSessionCookie(response: Response, value: string, expiresAt: string): void {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const maxAge = getStudentSessionCookieMaxAge(expiresAt);
  response.headers.set(
    "Set-Cookie",
    `${STUDENT_SESSION_COOKIE}=${value}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`,
  );
}

export function clearStudentSessionCookie(response: Response): void {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.headers.set("Set-Cookie", `${STUDENT_SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`);
}

function getStudentSessionCookieMaxAge(expiresAt: string): number {
  const expiresAtMs = Date.parse(expiresAt);
  if (!Number.isFinite(expiresAtMs)) return 0;
  const remainingSeconds = Math.floor((expiresAtMs - Date.now()) / 1000);
  return Math.max(0, Math.min(STUDENT_SESSION_MAX_TTL_SECONDS, remainingSeconds));
}

function getSessionSecret(): string | undefined {
  return readServerSessionSecret("LIVING_TEXTBOOK_STUDENT_SESSION_SECRET");
}

function getSessionSecrets(): string[] {
  return readServerSessionSecrets("LIVING_TEXTBOOK_STUDENT_SESSION_SECRET");
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function isValidSignature(payload: string, signature: string, secrets: string[]): boolean {
  const received = Buffer.from(signature, "utf8");
  return secrets.reduce((valid, secret) => {
    const expected = Buffer.from(sign(payload, secret), "utf8");
    const matches = expected.length === received.length && timingSafeEqual(expected, received);
    return valid || matches;
  }, false);
}

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value)) && value.includes("T");
}

function hasBoundedString(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

function isValidStudentSessionShape(claims: Partial<StudentSessionClaims>): claims is StudentSessionClaims {
  return claims.version === STUDENT_SESSION_VERSION
    && hasBoundedString(claims.tenantId, 160)
    && hasBoundedString(claims.packageId, 160)
    && hasBoundedString(claims.launchCode, 160)
    && hasBoundedString(claims.studentSessionId, 512)
    && isIsoTimestamp(claims.issuedAt)
    && isIsoTimestamp(claims.expiresAt)
    && Date.parse(claims.expiresAt) > Date.parse(claims.issuedAt)
    && Date.parse(claims.expiresAt) - Date.parse(claims.issuedAt) <= STUDENT_SESSION_MAX_TTL_SECONDS * 1000;
}
