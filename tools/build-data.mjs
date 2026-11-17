// Genera los datos de constelaciones a partir de d3-celestial (carpeta data/)
// y los inserta en index.html entre los marcadores /*GEO-START*/ y /*GEO-END*/.
// Uso: node tools/build-data.mjs        (no es un build del sitio: se corre una vez)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = f => JSON.parse(fs.readFileSync(path.join(ROOT, "data", f), "utf8"));
const LINES = read("constellations.lines.json");
const BOUNDS = read("constellations.bounds.json");
const BORDERS = read("constellations.borders.json");
const CONSJ = read("constellations.json");
const STARS = read("stars.6.json");
const NAMES = read("starnames.json");

const D2R = Math.PI / 180, R2D = 180 / Math.PI;
const r2 = x => Math.round(x * 100) / 100;
const normRa = ra => ((ra % 360) + 360) % 360;           // 0..360
const id3 = id => id.toLowerCase();

/* ---------- Densificar bordes (los tramos a lo largo de un paralelo son largos) ---------- */
function densify(ring, step = 1.5) {
  const out = [];
  for (let i = 0; i < ring.length; i++) {
    const [a, b] = [ring[i], ring[(i + 1) % ring.length]];
    let dra = b[0] - a[0];
    if (dra > 180) dra -= 360;
    if (dra < -180) dra += 360;
    const ddec = b[1] - a[1];
    const n = Math.max(1, Math.ceil(Math.max(Math.abs(dra) * Math.cos(a[1] * D2R), Math.abs(ddec)) / step));
    for (let k = 0; k < n; k++) out.push([normRa(a[0] + dra * k / n), a[1] + ddec * k / n]);
  }
  return out;
}

/* ---------- Punto dentro de polígono esférico (número de vueltas por azimut) ---------- */
function bearing(ra1, de1, ra2, de2) {
  const dl = (ra2 - ra1) * D2R, p1 = de1 * D2R, p2 = de2 * D2R;
  return Math.atan2(Math.sin(dl) * Math.cos(p2), Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl));
}
const ringCenters = new WeakMap();
function inside(ra, dec, ring) {
  // El azimut da ±2π tanto si el punto está dentro como si lo está su antípoda:
  // se descarta lo que esté a más de 90° del centro del polígono (todas son menores a un hemisferio).
  let ctr = ringCenters.get(ring);
  if (!ctr) { ctr = centerOf(ring); ringCenters.set(ring, ctr); }
  const cosd = Math.sin(dec * D2R) * Math.sin(ctr[1] * D2R) + Math.cos(dec * D2R) * Math.cos(ctr[1] * D2R) * Math.cos((ra - ctr[0]) * D2R);
  if (cosd <= 0) return false;
  let sum = 0, prev = bearing(ra, dec, ring[ring.length - 1][0], ring[ring.length - 1][1]);
  for (const [r, d] of ring) {
    const cur = bearing(ra, dec, r, d);
    let diff = cur - prev;
    if (diff > Math.PI) diff -= 2 * Math.PI;
    if (diff < -Math.PI) diff += 2 * Math.PI;
    sum += diff; prev = cur;
  }
  return Math.abs(sum) > Math.PI;
}

/* ---------- Agrupar por constelación (Serpens viene en dos partes) ---------- */
const cons = {};
const get = id => (cons[id3(id)] ??= { id: id3(id), lines: [], bounds: [], nb: new Set() });
for (const f of LINES.features) get(f.id).lines.push(...f.geometry.coordinates);
for (const f of BOUNDS.features) {
  const raw = f.geometry.coordinates[0].map(([r, d]) => [normRa(r), d]);
  if (raw.length > 1 && raw[0].join() === raw[raw.length - 1].join()) raw.pop();
  get(f.id).raw = [...(get(f.id).raw || []), raw];
  get(f.id).bounds.push(densify(raw));
}
for (const f of BORDERS.features) {
  const [a, b] = f.ids.split(",").map(id3);
  if (a !== b) { get(a).nb.add(b); get(b).nb.add(a); }
}
for (const f of CONSJ.features) get(f.id).label = f.geometry.coordinates;

/* ---------- Estrellas ---------- */
const starByPos = new Map(STARS.features.map(f => [f.geometry.coordinates.join(), f]));
const BG_MAG = 5.0;
const bg = [];
const vertexKeys = new Set();
for (const c of Object.values(cons)) for (const l of c.lines) for (const p of l) vertexKeys.add(p.join());
for (const f of STARS.features) {
  if (f.properties.mag > BG_MAG || vertexKeys.has(f.geometry.coordinates.join())) continue;
  const [r, d] = f.geometry.coordinates;
  bg.push(r2(normRa(r)), r2(d), Math.round(f.properties.mag * 10) / 10);
}

/* ---------- Centro de la figura (promedio de vectores unitarios) ---------- */
function centerOf(points) {
  let x = 0, y = 0, z = 0;
  for (const [r, d] of points) {
    x += Math.cos(d * D2R) * Math.cos(r * D2R);
    y += Math.cos(d * D2R) * Math.sin(r * D2R);
    z += Math.sin(d * D2R);
  }
  return [normRa(Math.atan2(y, x) * R2D), Math.atan2(z, Math.hypot(x, y)) * R2D];
}

/* ---------- Áreas por Monte Carlo (también valida que los bordes cubran el cielo una vez) ---------- */
function areas(N = 60000) {
  const list = Object.values(cons);
  const bbox = list.map(c => {
    const pts = c.bounds.flat();
    let minD = Math.min(...pts.map(p => p[1])), maxD = Math.max(...pts.map(p => p[1]));
    // Si el borde da la vuelta completa en AR, contiene un polo (Octans, Osa Menor)
    for (const ring of c.bounds) {
      let sweep = 0;
      ring.forEach((p, i) => { let d = ring[(i + 1) % ring.length][0] - p[0]; if (d > 180) d -= 360; if (d < -180) d += 360; sweep += d; });
      if (Math.abs(sweep) > 180) { if (maxD > 0) maxD = 90; else minD = -90; }
    }
    return { c, minD, maxD };
  });
  const cnt = Object.fromEntries(list.map(c => [c.id, 0]));
  let none = 0, multi = 0, seed = 12345;
  const noneAt = [];
  const rnd = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  for (let i = 0; i < N; i++) {
    const ra = rnd() * 360, dec = Math.asin(2 * rnd() - 1) * R2D;
    const hits = bbox.filter(b => dec >= b.minD - 0.5 && dec <= b.maxD + 0.5 && b.c.bounds.some(ring => inside(ra, dec, ring)));
    if (!hits.length) { none++; noneAt.push([ra, dec].map(Math.round)); }
    else { if (hits.length > 1) multi++; cnt[hits[0].c.id]++; }
  }
  const total = 41253;
  return { area: Object.fromEntries(Object.entries(cnt).map(([k, v]) => [k, v / N * total])), none, multi, N, noneAt };
}

/* ---------- Estrellas con nombre (para etiquetas en la ficha) ---------- */
const hipPos = new Map(STARS.features.map(f => [String(f.id), f]));
export function findStar(con, bayer) {
  for (const [hip, n] of Object.entries(NAMES)) {
    if (n.c && n.c.toLowerCase() === con && (n.bayer === bayer || n.desig === bayer || n.name === bayer)) {
      const f = hipPos.get(hip);
      if (f) return [r2(normRa(f.geometry.coordinates[0])), r2(f.geometry.coordinates[1]), f.properties.mag];
    }
  }
  return null;
}

/* ---------- Rango de declinación (los casquetes polares llegan a ±90) ---------- */
function decRange(c) {
  const pts = c.raw.flat();
  let dmin = Math.min(...pts.map(p => p[1])), dmax = Math.max(...pts.map(p => p[1]));
  for (const ring of c.raw) {
    let sweep = 0;
    ring.forEach((p, i) => { let d = ring[(i + 1) % ring.length][0] - p[0]; if (d > 180) d -= 360; if (d < -180) d += 360; sweep += d; });
    if (Math.abs(sweep) > 180) { if (dmax > 0) dmax = 90; else dmin = -90; }
  }
  return { dmin: r2(dmin), dmax: r2(dmax) };
}

/* ---------- Contenido en español ---------- */
const CONTENT = [];
for (const f of fs.readdirSync(path.join(ROOT, "data")).filter(f => /^contenido-.*\.mjs$/.test(f)).sort()) {
  CONTENT.push(...(await import(pathToFileURL(path.join(ROOT, "data", f)).href)).default);
}
const ZODIAC = ["ari", "tau", "gem", "cnc", "leo", "vir", "lib", "sco", "oph", "sgr", "cap", "aqr", "psc"];
const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const GENERIC = new Set(["mayor", "menor", "austral", "boreal", "macho", "cochero"]);
const warnings = [];

/* ---------- Construcción ---------- */
const { area, none, multi, N, noneAt } = areas();
const officialRank = [...CONTENT].sort((a, b) => b.area - a.area).map(c => c.id);
const CONS = [];
for (const c of Object.values(cons).sort((a, b) => a.id.localeCompare(b.id))) {
  const k = CONTENT.find(x => x.id === c.id);
  if (!k) { warnings.push(`sin contenido: ${c.id}`); continue; }
  if (Math.abs(k.area - area[c.id]) / k.area > 0.2) warnings.push(`área sospechosa ${c.id}: oficial ${k.area}, calculada ${Math.round(area[c.id])}`);
  const st = [];
  for (const [bayer, nombre, ra, dec] of k.estrellas) {
    const s = ra !== undefined ? [ra, dec] : findStar(c.id, bayer);
    if (s) st.push([nombre, s[0], s[1]]); else warnings.push(`estrella no encontrada ${c.id} ${bayer} (${nombre})`);
  }
  // Fugas: la pista no puede contener el nombre de la constelación
  const words = [...norm(k.es).split(/[^a-z]+/), ...norm(k.la).split(/[^a-z]+/)].filter(w => w.length >= 4 && !GENERIC.has(w));
  for (const [campo, txt] of [["rep", k.rep], ["pista", k.pista], ["objeto", k.objeto]]) {
    if (!txt) continue;
    for (const w of words) if (norm(txt).includes(w)) warnings.push(`FUGA ${c.id}.${campo} contiene «${w}»`);
  }
  const ctr = centerOf(c.lines.flat());
  CONS.push({
    ...k, estrellas: undefined,
    zod: ZODIAC.includes(c.id),
    st,
    c: [r2(ctr[0]), r2(ctr[1])],
    l: c.lines.map(l => l.map(([r, d]) => {
      const s = starByPos.get([r, d].join());
      return [r2(normRa(r)), r2(d), s ? Math.round(s.properties.mag * 10) / 10 : 5];
    })),
    b: c.raw.map(ring => ring.map(([r, d]) => [r2(r), r2(d)])),
    ...decRange(c),
    ab: LINES.features.find(f => id3(f.id) === c.id).id,
    n: [...c.nb].sort(),
    rank: officialRank.indexOf(c.id) + 1,
  });
}
for (const k of CONTENT) if (!cons[k.id]) warnings.push(`contenido sin geometría: ${k.id}`);

// Estrella más brillante con nombre (para revisar el campo "pista" a mano)
const brightest = {};
for (const [hip, n] of Object.entries(NAMES)) {
  const f = hipPos.get(hip); if (!f) continue;
  if (!n.c) continue;
  const id = n.c.toLowerCase();
  if (!brightest[id] || f.properties.mag < brightest[id].mag) brightest[id] = { mag: f.properties.mag, name: n.name || "(sin nombre) " + n.desig };
}

const out = `const CONS=${JSON.stringify(CONS)};\nconst BGSTARS=${JSON.stringify(bg)};`;
fs.writeFileSync(path.join(ROOT, "data", "geo.generated.js"), out);

const idx = path.join(ROOT, "index.html");
if (fs.existsSync(idx)) {
  const html = fs.readFileSync(idx, "utf8");
  const re = /\/\*GEO-START\*\/[\s\S]*?\/\*GEO-END\*\//;
  if (re.test(html)) {
    fs.writeFileSync(idx, html.replace(re, () => `/*GEO-START*/\n${out}\n/*GEO-END*/`));
    console.log("index.html actualizado");
  }
}

console.log(`constelaciones: ${CONS.length} · estrellas de fondo: ${bg.length / 3} · ${(out.length / 1024).toFixed(1)} KB`);
console.log(`Monte Carlo ${N}: sin constelación ${none}, en más de una ${multi}`);
if (process.argv.includes("--pistas")) for (const c of CONS) console.log(`${c.id} pista=${c.pista} · más brillante: ${brightest[c.id]?.name} (${brightest[c.id]?.mag})`);
console.log(warnings.length ? "AVISOS:\n  " + warnings.join("\n  ") : "Sin avisos.");
