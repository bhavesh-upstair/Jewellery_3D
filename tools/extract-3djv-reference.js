const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'decoded');
const enginePath = 'C:\\Users\\Bhavesh_Patel\\Downloads\\main-engine.min.js';
const uiPath = 'C:\\Users\\Bhavesh_Patel\\Downloads\\main-ui.min.js';

function readLines(file) {
  return fs.readFileSync(file, 'utf8').split(/\r?\n/);
}

function sliceLines(lines, start, end) {
  return lines.slice(start - 1, end).join('\n');
}

fs.mkdirSync(outDir, { recursive: true });

const engine = readLines(enginePath);
const ui = readLines(uiPath);

const excerpts = [
  ['ground-shadow.js', engine, 2184, 2354],
  ['metal-material.js', engine, 2512, 2560],
  ['ring-head-standing-scene.js', engine, 7385, 7510],
  ['ui-ring-head-standing.js', ui, 820, 900],
];

for (const [name, lines, start, end] of excerpts) {
  const header = [
    '// Decoded excerpt from downloaded 3D Jewelry Viewer bundle.',
    `// Source lines: ${start}-${end}`,
    '// Kept as reference only; do not paste this engine code into production.',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(outDir, name), header + sliceLines(lines, start, end), 'utf8');
}

const notes = `# 3D Jewelry Viewer Reference Notes

Extracted from:
- ${enginePath}
- ${uiPath}

Useful settings found:
- Ring-head-standing scene background: 16185078 (#F6F6F6)
- Metal env map: DARK
- Gem env/cube map: BASIC_REFRACTION
- Metal envMapIntensity: 2
- Diamond raw color: 12303291 (#BBBBBB)
- Diamond refractionIndex: 2.42
- Diamond dispersion: 0.035
- GroundShadow intensity: 0.4
- GroundShadow decay: 0.8
- GroundShadow lightPosition: spherical(1, PI / 4, 3 * PI / 4)
- Camera target motion: from Vector3(0, 2, 0) to Vector3(0, 0.6, 0.5)
- Orbit: enablePan false, minDistance 0.5, maxDistance 3, maxPolarAngle 1.5

Implementation choice in this repo:
- Use the settings and rendering approach as guidance.
- Do not copy the protected/minified engine wholesale.
- Keep the local viewer based on Three.js + our GLB model switching architecture.
`;

fs.writeFileSync(path.join(outDir, '3djewelryviewer-notes.md'), notes, 'utf8');

console.log(`Wrote decoded reference excerpts to ${outDir}`);
