const sections = [
  ['Master repo', 'seeded'],
  ['Source inventory', 'docs/source-inventory.md'],
  ['Consolidation plan', 'docs/consolidation-plan.md'],
  ['Architecture notes', 'docs/architecture-notes.md'],
];

for (const [label, value] of sections) {
  console.log(`${label}: ${value}`);
}
