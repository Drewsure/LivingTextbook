import { createHmac, timingSafeEqual } from "node:crypto";

export const STUDENT_SESSION_COOKIE = "living-textbook-student-session";
export const STUDENT_SESSION_VERSION = 1 as const;
export const STUDENT_SESSION_COOKIE_MAX_BYTES = 8 * 1024;
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
  const secret = getSessionSecret();
  if (!secret) return undefined;

  const payload = toBase64Url(JSON.stringify(claims));
  return `${payload}.${sign(payload, secret)}`;
}

export function readStudentSessionClaims(request: Request): StudentSessionClaims | undefined {
  const secret = getSessionSecret();
  if (!secret) return undefined;

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
  if (!payload || !signature || !isValidSignature(payload, signature, secret)) return undefined;

  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Partial<StudentSessionClaims>;
    if (claims.version !== STUDENT_SESSION_VERSION) return undefined;
    if (!hasBoundedString(claims.tenantId, 160) || !hasBoundedString(claims.packageId, 160) || !hasBoundedString(claims.launchCode, 160) || !hasBoundedString(claims.studentSessionId, 512)) return undefined;
    if (!isIsoTimestamp(claims.issuedAt) || !isIsoTimestamp(claims.expiresAt)) return undefined;
    const issuedAt = Date.parse(claims.issuedAt);
    const expiresAt = Date.parse(claims.expiresAt);
    const now = Date.now();
    if (issuedAt > now + 30_000 || expiresAt <= now || expiresAt <= issuedAt) return undefined;
    return claims as StudentSessionClaims;
  } catch {
    return undefined;
  }
}

export function getStudentSessionExpiry(now = Date.now()): string {
  const configured = Number(process.env.LIVING_TEXTBOOK_STUDENT_SESSION_TTL_SECONDS);
  const ttlSeconds = Number.isSafeInteger(configured) && configured > 0 ? configured : DEFAULT_TTL_SECONDS;
  return new Date(now + ttlSeconds * 1000).toISOString();
}

export function setStudentSessionCookie(response: Response, value: string, expiresAt: string): void {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.headers.set(
    "Set-Cookie",
    `${STUDENT_SESSION_COOKIE}=${value}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${Math.max(0, Math.floor((Date.parse(expiresAt) - Date.now()) / 1000))}${secure}`,
  );
}

export function clearStudentSessionCookie(response: Response): void {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.headers.set("Set-Cookie", `${STUDENT_SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`);
}

function getSessionSecret(): string | undefined {
  const secret = process.env.LIVING_TEXTBOOK_STUDENT_SESSION_SECRET?.trim();
  return secret || undefined;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function isValidSignature(payload: string, signature: string, secret: string): boolean {
  const expected = Buffer.from(sign(payload, secret), "utf8");
  const received = Buffer.from(signature, "utf8");
  return expected.length === received.length && timingSafeEqual(expected, received);
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
