import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const standardsPath = resolve(root, "docs/PRINCIPLES_AND_STANDARDS.md");
const registerPath = resolve(root, "docs/DECISION_REGISTER.md");

const standards = readFileSync(standardsPath, "utf8");
const register = readFileSync(registerPath, "utf8");
const errors = [];

function assertUnique(label, values) {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  if (duplicates.length > 0) {
    errors.push(`${label} contains duplicates: ${[...new Set(duplicates)].join(", ")}`);
  }
}

const sectionHeadings = [...standards.matchAll(/^## (\d+(?:\.\d+)?)(?:\.)? ([^\r\n]+)$/gm)]
  .map((match) => ({ id: match[1], title: match[2] }));
const sectionIds = sectionHeadings.map(({ id }) => id);
const sectionTitles = sectionHeadings.map(({ title }) => title);
assertUnique("principles section ids", sectionIds);
assertUnique("principles section titles", sectionTitles);

const numericSections = sectionIds
  .filter((id) => /^\d+$/.test(id))
  .map(Number);
if (numericSections.length === 0 || numericSections[0] !== 1) {
  errors.push("principles sections must begin at section 1");
}
for (let index = 1; index < numericSections.length; index += 1) {
  if (numericSections[index] !== numericSections[index - 1] + 1) {
    errors.push(
      `principles numeric section sequence breaks between ${numericSections[index - 1]} and ${numericSections[index]}`,
    );
    break;
  }
}
if (!sectionHeadings.some(({ id, title }) => id === "11.1" && title === "Agent Standards")) {
  errors.push("cross-cutting Agent Standards subsection 11.1 is missing");
}

const decisions = [...register.matchAll(/^# DR-(\d+): ([^\r\n]+)$/gm)]
  .map((match) => ({ id: Number(match[1]), title: match[2] }));
assertUnique("decision register ids", decisions.map(({ id }) => id));
assertUnique("decision register titles", decisions.map(({ title }) => title));
if (errors.length > 0) {
  console.error("FAIL standards integrity");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `PASS standards integrity (${sectionHeadings.length} principles sections, ${decisions.length} decision records)`,
);
