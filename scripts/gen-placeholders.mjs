// One-off script: generates SVG placeholder imagery for products, categories,
// and lifestyle sections until real photography is uploaded via the admin dashboard.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function tone(seed, base = 20) {
  const h = hash(seed);
  const l = base + (h % 10);
  return `hsl(${(h % 40) + 20} 8% ${l}%)`;
}

function garmentPath(kind) {
  switch (kind) {
    case "jacket":
      return `<path d="M85 60 L70 40 L50 55 L30 40 L15 60 L25 90 L35 85 L35 170 L165 170 L165 85 L175 90 L185 60 L170 40 L150 55 L130 40 L115 60 L100 50 Z" />`;
    case "pants":
      return `<path d="M55 20 H145 L150 100 L125 190 L108 190 L100 110 L92 190 L75 190 L50 100 Z" />`;
    default:
      return `<path d="M75 30 L60 20 L30 45 L15 75 L40 90 L55 78 L55 175 L145 175 L145 78 L160 90 L185 75 L170 45 L140 20 L125 30 C115 45 85 45 75 30 Z" />`;
  }
}

function svgFor({ label, sub, kind = "hoodie" }) {
  const bg1 = tone(label + "1", 12);
  const bg2 = tone(label + "2", 18);
  const fg = "hsl(0 0% 92%)";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 200 250">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg1}" />
      <stop offset="1" stop-color="${bg2}" />
    </linearGradient>
  </defs>
  <rect width="200" height="250" fill="url(#g)" />
  <g fill="none" stroke="${fg}" stroke-width="1.4" opacity="0.55" transform="translate(7,35)">
    ${garmentPath(kind)}
  </g>
  <text x="14" y="228" font-family="Arial, sans-serif" font-size="8" fill="${fg}" opacity="0.75" letter-spacing="1">${label}</text>
  ${sub ? `<text x="14" y="240" font-family="Arial, sans-serif" font-size="6" fill="${fg}" opacity="0.45" letter-spacing="1.5">${sub}</text>` : ""}
</svg>`;
}

function wideSvgFor({ label, kind = "hoodie" }) {
  const bg1 = tone(label + "w1", 10);
  const bg2 = tone(label + "w2", 20);
  const fg = "hsl(0 0% 92%)";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 300 200">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg1}" />
      <stop offset="1" stop-color="${bg2}" />
    </linearGradient>
  </defs>
  <rect width="300" height="200" fill="url(#g)" />
  <g fill="none" stroke="${fg}" stroke-width="1.2" opacity="0.4" transform="translate(105,15)">
    ${garmentPath(kind)}
  </g>
  <text x="18" y="182" font-family="Arial, sans-serif" font-size="9" fill="${fg}" opacity="0.8" letter-spacing="2">${label}</text>
</svg>`;
}

const products = [
  ["placeholder-1", "SIGNATURE 555", "hoodie"],
  ["placeholder-2", "SIGNATURE 11:11", "hoodie"],
  ["placeholder-3", "SIGNATURE 777", "hoodie"],
  ["placeholder-4", "SIGNATURE 222", "hoodie"],
  ["placeholder-5", "LEGENDS ESSENTIAL", "pants"],
  ["placeholder-6", "SIGNATURE ZIP", "jacket"],
];

for (const [file, label, kind] of products) {
  writeFileSync(
    join(publicDir, "products", `${file}.svg`),
    svgFor({ label, sub: "DOPE BEYOND", kind }),
  );
}

const categories = [
  ["angel-collection", "ANGEL COLLECTION", "hoodie"],
  ["hoodies", "HOODIES", "hoodie"],
  ["sweatpants", "SWEATPANTS", "pants"],
  ["jackets", "JACKETS", "jacket"],
];

for (const [file, label, kind] of categories) {
  writeFileSync(join(publicDir, "categories", `${file}.svg`), wideSvgFor({ label, kind }));
}

const lifestyle = [
  ["hero", "BUILT DIFFERENT", "jacket"],
  ["story-1", "OUR STORY", "hoodie"],
  ["story-2", "OUR STORY", "jacket"],
  ["winter", "WINTER COLLECTION", "jacket"],
  ["community-1", "COMMUNITY", "hoodie"],
  ["community-2", "COMMUNITY", "jacket"],
  ["community-3", "COMMUNITY", "pants"],
  ["community-4", "COMMUNITY", "hoodie"],
  ["community-5", "COMMUNITY", "jacket"],
  ["community-6", "COMMUNITY", "hoodie"],
  ["lifestyle-footer", "LIFESTYLE OF LEGENDS", "jacket"],
];

for (const [file, label, kind] of lifestyle) {
  writeFileSync(join(publicDir, "lifestyle", `${file}.svg`), wideSvgFor({ label, kind }));
}

console.log(`Generated ${products.length + categories.length + lifestyle.length} placeholder SVGs.`);
