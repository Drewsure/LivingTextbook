import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = mkdtempSync(join(tmpdir(), "living-textbook-deployment-config-"));
const failures = [];
const environmentNames = [
  "LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN",
  "LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_ALLOWED_TENANTS",
  "LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_ROOT",
  "LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN",
  "LIVING_TEXTBOOOK_PILOT_DELIVERY_ALLOWED_TENANTS",
  "LIVING_TEXTBOOOK_PILOT_DELIVERY_ROOT",
  "LIVING_TEXTBOOOK_PILOT_QR_REGISTRY_ROOT",
  "LIVING_TEXTBOOOK_LOCAL_PACKAGE_ROOT",
  "LIVING_TEXTBOOOK_APPROVED_ASSET_ROOT",
  "LIVING_TEXTBOOOK_PILOT_PRINT_BASE_URL",
  "LIVING_TEXTBOOK_PERSISTENCE_PROVIDER",
  ...[
    "LIVING_TEXTBOOOK_LOCAL_PACKAGE_READS_ENABLED",
    "LIVING_TEXTBOOOK_LOCAL_PACKAGE_HANDOFF_READS_ENABLED",
    "LIVING_TEXTBOOOK_LOCAL_PACKAGE_INTEGRITY_READS_ENABLED",
    "LIVING_TEXTBOOOK_LOCAL_PACKAGE_CONTENT_READS_ENABLED",
    "LIVING_TEXTBOOOK_LOCAL_PACKAGE_MEDIA_READS_ENABLED",
  ],
];

try {
  const sourcePath = join(root, "apps", "web", "src", "server", "delivery", "pilotDeploymentConfiguration.ts");
  const modulePath = join(output, "pilotDeploymentConfiguration.cjs");
  writeModule(sourcePath, modulePath);
  const configuration = await import(`file://${modulePath}`);
  const originals = new Map(environmentNames.map((name) => [name, process.env[name]]));
  try {
    clearEnvironment();
    const blocked = configuration.readPilotDeploymentConfiguration("sample-publisher", "hosted-pwa");
    assert(blocked.status === "blocked", "unset deployment configuration must be blocked");
    assert(blocked.writesEnabled === false && blocked.studentActivationAllowed === false && blocked.sideEffect === "none", "blocked configuration must remain side-effect-free");
    assert(blocked.exposedSecretValues === false && JSON.stringify(blocked).includes("token-value") === false, "configuration snapshot must not expose secret values");

    const rootDirectory = join(output, "roots");
    for (const child of ["quarantine", "delivery", "qr", "package", "approved"]) mkdirSync(join(rootDirectory, child), { recursive: true });
    setEnvironment({
      LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN: "token-value",
      LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_ALLOWED_TENANTS: "other, sample-publisher",
      LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_ROOT: join(rootDirectory, "quarantine"),
      LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN: "delivery-token-value",
      LIVING_TEXTBOOOK_PILOT_DELIVERY_ALLOWED_TENANTS: "sample-publisher",
      LIVING_TEXTBOOOK_PILOT_DELIVERY_ROOT: join(rootDirectory, "delivery"),
      LIVING_TEXTBOOOK_PILOT_QR_REGISTRY_ROOT: join(rootDirectory, "qr"),
      LIVING_TEXTBOOOK_LOCAL_PACKAGE_ROOT: join(rootDirectory, "package"),
      LIVING_TEXTBOOOK_APPROVED_ASSET_ROOT: join(rootDirectory, "approved"),
      LIVING_TEXTBOOOK_PILOT_PRINT_BASE_URL: "https://publisher.example/print",
      LIVING_TEXTBOOOK_LOCAL_PACKAGE_READS_ENABLED: "true",
      LIVING_TEXTBOOOK_LOCAL_PACKAGE_HANDOFF_READS_ENABLED: "true",
      LIVING_TEXTBOOOK_LOCAL_PACKAGE_INTEGRITY_READS_ENABLED: "true",
      LIVING_TEXTBOOOK_LOCAL_PACKAGE_CONTENT_READS_ENABLED: "true",
      LIVING_TEXTBOOOK_LOCAL_PACKAGE_MEDIA_READS_ENABLED: "true",
      LIVING_TEXTBOOK_PERSISTENCE_PROVIDER: "sqlite",
    });

    const matrix = configuration.readPilotDeploymentConfigurationMatrix("sample-publisher");
    assert(matrix.length === 3, "configuration matrix must cover hosted, local, and hybrid modes");
    assert(matrix.every((snapshot) => snapshot.ready), "complete server configuration must be ready for operator review");
    assert(matrix.every((snapshot) => snapshot.configuredSecretNames.includes("LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN")), "configured secret names must be reported without secret values");
    assert(matrix.every((snapshot) => !JSON.stringify(snapshot).includes("delivery-token-value")), "delivery secret value must never appear in a configuration snapshot");

    process.env.LIVING_TEXTBOOOK_PILOT_DELIVERY_ALLOWED_TENANTS = "other-publisher";
    const wrongTenant = configuration.readPilotDeploymentConfiguration("sample-publisher", "hosted-pwa");
    assert(wrongTenant.status === "blocked" && wrongTenant.blockers.some((value) => value.includes("Pilot delivery tenant allowlist")), "wrong tenant must remain blocked");

    process.env.LIVING_TEXTBOOOK_PILOT_DELIVERY_ALLOWED_TENANTS = "sample-publisher";
    process.env.LIVING_TEXTBOOOK_PILOT_DELIVERY_ROOT = ".\\relative-delivery-root";
    const relativeRoot = configuration.readPilotDeploymentConfiguration("sample-publisher", "hosted-pwa");
    assert(relativeRoot.status === "blocked" && relativeRoot.blockers.some((value) => value.includes("Pilot delivery metadata root")), "relative custody roots must remain blocked");
  } finally {
    for (const [name, value] of originals) restoreEnvironment(name, value);
  }
} finally {
  rmSync(output, { recursive: true, force: true });
}

const page = readSource("apps/web/src/app/teacher/deployment/page.tsx");
const panel = readSource("apps/web/src/features/deployment/PilotDeploymentConfigurationPanel.tsx");
if (!page.includes("PilotDeploymentConfigurationPanel") || !page.includes("readPilotDeploymentConfigurationMatrix")) failures.push("deployment page must mount the operator configuration preflight");
for (const marker of ["Operator configuration preflight", "No secret values", "No side effects", "studentActivationAllowed", "writesEnabled"]) {
  if (!panel.includes(marker)) failures.push(`configuration panel is missing marker: ${marker}`);
}
if (page.includes("input type=\"file\"") || page.includes("fetch(") || panel.includes("navigator.mediaDevices.getUserMedia")) failures.push("configuration preflight must remain read-only and browser-side-effect-free");

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS pilot deployment configuration preflight is tenant-scoped, secret-safe, path-aware, mode-aware, and side-effect-free.");

function writeModule(sourcePath, outputPath) {
  const source = readFileSync(sourcePath, "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.NodeNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  writeFileSync(outputPath, compiled, "utf8");
}

function clearEnvironment() {
  for (const name of environmentNames) delete process.env[name];
}

function setEnvironment(values) {
  for (const [name, value] of Object.entries(values)) process.env[name] = value;
}

function restoreEnvironment(name, value) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function readSource(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}
