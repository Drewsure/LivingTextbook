import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const studentModule = fileURLToPath(new URL("../apps/web/src/server/persistence/studentSessionCookie.ts", import.meta.url));
const teacherModule = fileURLToPath(new URL("../apps/web/src/server/persistence/teacherSessionCookie.ts", import.meta.url));
const script = `
import { setStudentSessionCookie, STUDENT_SESSION_MAX_TTL_SECONDS } from ${JSON.stringify(pathToFileURL(studentModule).href)};
import { setTeacherSessionCookie, TEACHER_SESSION_MAX_TTL_SECONDS } from ${JSON.stringify(pathToFileURL(teacherModule).href)};

process.env.NODE_ENV = "production";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function maxAge(header) {
  const match = header.match(/Max-Age=(\\d+)/);
  assert(match, "Set-Cookie must contain a numeric Max-Age");
  return Number(match[1]);
}

const studentResponse = new Response();
setStudentSessionCookie(studentResponse, "student-value", new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString());
const studentHeader = studentResponse.headers.get("Set-Cookie") ?? "";
assert(studentHeader.includes("HttpOnly") && studentHeader.includes("SameSite=Lax") && studentHeader.includes("Path=/") && studentHeader.includes("Secure"), "student cookie attributes are incomplete");
assert(maxAge(studentHeader) <= STUDENT_SESSION_MAX_TTL_SECONDS, "student Max-Age exceeded the declared lifetime cap");

const invalidStudentResponse = new Response();
setStudentSessionCookie(invalidStudentResponse, "student-value", "not-a-date");
assert(maxAge(invalidStudentResponse.headers.get("Set-Cookie") ?? "") === 0, "invalid student expiry did not fail closed");

const teacherResponse = new Response();
setTeacherSessionCookie(teacherResponse, "teacher-value", new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString());
const teacherHeader = teacherResponse.headers.get("Set-Cookie") ?? "";
assert(teacherHeader.includes("HttpOnly") && teacherHeader.includes("SameSite=Lax") && teacherHeader.includes("Path=/") && teacherHeader.includes("Secure"), "teacher cookie attributes are incomplete");
assert(maxAge(teacherHeader) <= TEACHER_SESSION_MAX_TTL_SECONDS, "teacher Max-Age exceeded the declared lifetime cap");

const invalidTeacherResponse = new Response();
setTeacherSessionCookie(invalidTeacherResponse, "teacher-value", "not-a-date");
assert(maxAge(invalidTeacherResponse.headers.get("Set-Cookie") ?? "") === 0, "invalid teacher expiry did not fail closed");

console.log("PASS session cookie emitters produce secure, finite, capped, and fail-closed Max-Age values.");
`;

try {
  execFileSync(process.execPath, ["--experimental-strip-types", "--input-type=module", "--eval", script], {
    stdio: "inherit",
  });
} catch {
  process.exitCode = 1;
}
