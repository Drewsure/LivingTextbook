import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const configPath = path.join(root, "apps/web/next.config.ts");
const source = fs.existsSync(configPath) ? fs.readFileSync(configPath, "utf8") : "";
const failures = [];

for (const marker of [
  'source: "/(.*)"',
  'X-Content-Type-Options", value: "nosniff"',
  'Referrer-Policy", value: "strict-origin-when-cross-origin"',
  'X-Frame-Options", value: "SAMEORIGIN"',
  'Permissions-Policy", value: "microphone=(self), camera=(), geolocation=()"',
]) {
  if (!source.includes(marker)) failures.push(`next config is missing ${marker}`);
}

if (source.includes("Content-Security-Policy")) {
  failures.push("a rigid Content-Security-Policy must not be added before tenant media/CDN origins are modeled");
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS web security headers protect MIME, referrer, framing, and browser capability boundaries.");
}
