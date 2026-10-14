// Dekódování geometrie ze src/geometrie.txt
// Formát řádku: ID|název|prstenec|prstenec…#
// Prstenec = souřadnice (zem. délka, šířka) v tisícinách stupně, delta kódování,
// zigzag + 5bitové varinty zapsané abecedou base64url.
const fs = require('fs');
const path = require('path');
const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

const txt = fs.readFileSync(path.join(__dirname, 'geometrie.txt'), 'utf8').replace(/[\r\n]/g, '');

function decRing(s) {
  const vals = [];
  let i = 0;
  while (i < s.length) {
    let r = 0, sh = 0, b;
    do { b = A.indexOf(s[i++]); r |= (b & 0x1f) << sh; sh += 5; } while (b >= 0x20);
    vals.push((r & 1) ? ~(r >> 1) : (r >> 1));
  }
  const out = [];
  let x = 0, y = 0;
  for (let k = 0; k < vals.length; k += 2) { x += vals[k]; y += vals[k + 1]; out.push([x / 1000, y / 1000]); }
  return out;
}

const feats = txt.split('#').filter(Boolean).map(l => {
  const p = l.split('|');
  return { id: p[0], name: p[1], rings: p.slice(2).map(decRing) };
});

module.exports = { feats, txt };
