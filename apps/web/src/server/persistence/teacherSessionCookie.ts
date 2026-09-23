import { createHmac, timingSafeEqual } from "node:crypto";

export const TEACHER_SESSION_COOKIE = "living-textbook-teacher-session";
export const TEACHER_SESSION_VERSION = 1 as const;
export const TEACHER_PERSISTENCE_READ_SCOPE = "persistence:read" as const;
export const TEACHER_SESSION_COOKIE_MAX_BYTES = 8 * 1024;
const DEFAULT_TTL_SECONDS = 2 * 60 * 60;

export interface TeacherSessionClaims {
  version: typeof TEACHER_SESSION_VERSION;
  tenantId: string;
  role: "teacher";
  scope: typeof TEACHER_PERSISTENCE_READ_SCOPE;
  issuedAt: string;
  expiresAt: string;
}

export function createTeacherSessionCookieValue(claims: TeacherSessionClaims): string | undefined {
  const secret = getTeacherSessionSecret();
  if (!secret) return undefined;

  const payload = toBase64Url(JSON.stringify(claims));
  return `${payload}.${sign(payload, secret)}`;
}

export function readTeacherSessionClaims(request: Request): TeacherSessionClaims | undefined {
  const secret = getTeacherSessionSecret();
  if (!secret) return undefined;

  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookieValue = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${TEACHER_SESSION_COOKIE}=`))
    ?.slice(TEACHER_SESSION_COOKIE.length + 1);
  if (!cookieValue) return undefined;
  if (Buffer.byteLength(cookieValue, "utf8") > TEACHER_SESSION_COOKIE_MAX_BYTES) return undefined;

  const segments = cookieValue.split(".");
  if (segments.length !== 2) return undefined;
  const [payload, signature] = segments;
  if (!payload || !signature || !isValidSignature(payload, signature, secret)) return undefined;

  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Partial<TeacherSessionClaims>;
    if (claims.version !== TEACHER_SESSION_VERSION || claims.role !== "teacher" || claims.scope !== TEACHER_PERSISTENCE_READ_SCOPE) return undefined;
    if (!hasBoundedString(claims.tenantId, 160)) return undefined;
    if (!isIsoTimestamp(claims.issuedAt) || !isIsoTimestamp(claims.expiresAt)) return undefined;
    const issuedAt = Date.parse(claims.issuedAt);
    const expiresAt = Date.parse(claims.expiresAt);
    const now = Date.now();
    if (issuedAt > now + 30_000 || expiresAt <= now || expiresAt <= issuedAt) return undefined;
    return claims as TeacherSessionClaims;
  } catch {
    return undefined;
  }
}

export function getTeacherSessionExpiry(now = Date.now()): string {
  const configured = Number(process.env.LIVING_TEXTBOOK_TEACHER_SESSION_TTL_SECONDS);
  const ttlSeconds = Number.isSafeInteger(configured) && configured > 0 ? configured : DEFAULT_TTL_SECONDS;
  return new Date(now + ttlSeconds * 1000).toISOString();
}

export function setTeacherSessionCookie(response: Response, value: string, expiresAt: string): void {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.headers.set(
    "Set-Cookie",
    `${TEACHER_SESSION_COOKIE}=${value}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${Math.max(0, Math.floor((Date.parse(expiresAt) - Date.now()) / 1000))}${secure}`,
  );
}

export function clearTeacherSessionCookie(response: Response): void {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.headers.set("Set-Cookie", `${TEACHER_SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`);
}

export function isTeacherSessionConfigured(): boolean {
  return Boolean(getTeacherSessionSecret() && process.env.LIVING_TEXTBOOK_TEACHER_REVIEW_CODE?.trim());
}

export function isTeacherTenantAllowed(tenantId: string): boolean {
  const configuredTenants = process.env.LIVING_TEXTBOOK_TEACHER_REVIEW_TENANTS
    ?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return Boolean(configuredTenants?.length && configuredTenants.includes(tenantId));
}

export function isTeacherReviewCodeValid(reviewCode: string): boolean {
  const configuredCode = process.env.LIVING_TEXTBOOK_TEACHER_REVIEW_CODE?.trim();
  if (!configuredCode) return false;
  const expected = createHashDigest(configuredCode);
  const received = createHashDigest(reviewCode);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

function getTeacherSessionSecret(): string | undefined {
  const secret = process.env.LIVING_TEXTBOOK_TEACHER_SESSION_SECRET?.trim();
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

function createHashDigest(value: string): Buffer {
  return createHmac("sha256", "living-textbook-teacher-review-code").update(value).digest();
}

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value)) && value.includes("T");
}

function hasBoundedString(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}
