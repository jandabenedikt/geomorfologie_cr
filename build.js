// Sestavení aplikace: node build.js
// Vytvoří index.html (vše v jednom souboru) a data/*.geojson pro další použití.
const fs = require('fs');
const path = require('path');
const { feats, txt } = require('./src/dekodovani.js');
const { PROV, SUB, U } = require('./src/jednotky.js');
const LABELS = require('./src/popisky.js');

const root = __dirname;
const sablona = fs.readFileSync(path.join(root, 'src', 'sablona.html'), 'utf8');

const geoBlock = txt.split('#').filter(Boolean).map(l => l + '#').join('\n');
const app = sablona
  .replace('__GEO__', () => geoBlock)
  .replace('__LABELS__', () => JSON.stringify(LABELS))
  .replace('__UNITS__', () => JSON.stringify({ PROV, SUB, U }));

// <title> a <link> ze šablony patří do <head>
const headEnd = app.indexOf('<style>');
const headPart = app.slice(0, headEnd);
const rest = app.slice(headEnd);
const styleEnd = rest.indexOf('</style>') + '</style>'.length;

const html = `<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Atlas a trénink geomorfologického členění Česka: provincie, subprovincie, jednotky a vrcholy.">
${headPart.trim()}
<style>
:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
*,*::before,*::after{box-sizing:border-box}
body{margin:0;font:14px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
img{max-width:100%}
[hidden]{display:none!important}
</style>
${rest.slice(0, styleEnd)}
</head>
<body>
${rest.slice(styleEnd).trim()}
</body>
</html>
`;
fs.writeFileSync(path.join(root, 'index.html'), html);

// ---- GeoJSON export ----
const signedArea = r => { let a = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += (r[j][0] - r[i][0]) * (r[j][1] + r[i][1]); return a / 2; };
const inRing = (p, r) => { let c = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const [xi, yi] = r[i], [xj, yj] = r[j]; if ((yi > p[1]) != (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
const ccw = r => (signedArea(r) < 0 ? r : r.slice().reverse()); // RFC 7946: vnější prstenec proti směru hodinek
const cw = r => (signedArea(r) > 0 ? r : r.slice().reverse());
function toGeometry(rings) {
  // ESRI: vnější prstence po směru hodinek, díry proti
  const outers = rings.filter(r => signedArea(r) > 0).map(r => [ccw(r)]);
  rings.filter(r => signedArea(r) <= 0).forEach(h => {
    const o = outers.find(poly => inRing(h[0], poly[0]));
    if (o) o.push(cw(h)); else outers.push([ccw(h)]);
  });
  return outers.length === 1 ? { type: 'Polygon', coordinates: outers[0] } : { type: 'MultiPolygon', coordinates: outers };
}
const level = id => ({ S: 'subprovincie', O: 'oblast', C: 'celek', P: 'podcelek' })[id[0]];
const byId = Object.fromEntries(feats.map(f => [f.id, f]));
const tableUnit = Object.fromEntries(U.map(u => [u[2], u[0]]));

const fc = {
  type: 'FeatureCollection',
  features: feats.map(f => ({
    type: 'Feature',
    properties: { kod: f.id.slice(1), nazev: f.name, uroven: level(f.id), v_tabulce: tableUnit[f.id] || null },
    geometry: toGeometry(f.rings),
  })),
};
fs.mkdirSync(path.join(root, 'data'), { recursive: true });
fs.writeFileSync(path.join(root, 'data', 'geomorfologicke-jednotky.geojson'), JSON.stringify(fc));

const pk = { type: 'FeatureCollection', features: [] };
U.forEach(u => u[3].forEach(k => pk.features.push({
  type: 'Feature',
  properties: { nazev: k[0], vyska_m: k[1], jednotka: u[0], subprovincie: SUB.find(s => s.id === u[1]).name, mimo_cr: k[4] || null },
  geometry: { type: 'Point', coordinates: [k[3], k[2]] },
})));
fs.writeFileSync(path.join(root, 'data', 'vrcholy.geojson'), JSON.stringify(pk, null, 1));

console.log('index.html', html.length, 'B;', fc.features.length, 'polygonů;', pk.features.length, 'vrcholů');
