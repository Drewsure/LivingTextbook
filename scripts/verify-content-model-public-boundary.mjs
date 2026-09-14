import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const sourceRoots = [join(repoRoot, "apps", "web", "src"), join(repoRoot, "apps", "ai-service", "src")];
const internalImportPattern = /@living-textbook\/content-model\/src\/[A-Za-z0-9]+/g;
const violations = [];
const packageManifest = JSON.parse(readFileSync(join(repoRoot, "packages", "content-model", "package.json"), "utf8"));

if (!packageManifest.exports || typeof packageManifest.exports !== "object" || !packageManifest.exports["."]) {
  console.error("FAIL content-model package must expose a root export.");
  process.exit(1);
}

if (Object.keys(packageManifest.exports).length !== 1 || packageManifest.exports["./*"]) {
  console.error("FAIL content-model package must not expose internal subpath exports.");
  process.exit(1);
}

if (packageManifest.exports["."].types !== "./src/index.ts" || packageManifest.exports["."].default !== "./src/index.ts") {
  console.error("FAIL content-model root export must target the canonical package index.");
  process.exit(1);
}

function scanDirectory(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      scanDirectory(path);
      continue;
    }

    if (!entry.name.endsWith(".ts") && !entry.name.endsWith(".tsx")) continue;

    const source = readFileSync(path, "utf8");
    const lines = source.split(/\r?\n/);

    lines.forEach((line, index) => {
      if (internalImportPattern.test(line)) {
        violations.push(`${relative(repoRoot, path)}:${index + 1}`);
      }
      internalImportPattern.lastIndex = 0;
    });
  }
}

sourceRoots.forEach(scanDirectory);

if (violations.length > 0) {
  for (const violation of violations) {
    console.error(`FAIL internal content-model import: ${violation}`);
  }
  process.exit(1);
}

console.log("PASS app source consumes content-model contracts through the public package root.");
console.log("PASS content-model package exposes only the canonical root export.");
