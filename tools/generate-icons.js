/* ==========================================================================
   Icon generator for the Hijri Calendar PWA.
   Pure Node (zlib only) — draws a crescent-and-star brand mark on a dark
   celestial gradient and writes square PNGs at the sizes a PWA needs.

   Run:  node tools/generate-icons.js
   Outputs: icon-192.png, icon-512.png, icon-maskable.png
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// ---- PNG encoding (RGBA, 8-bit) ----------------------------------------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // color type RGBA
  ihdr[10] = 0;  // compression
  ihdr[11] = 0;  // filter
  ihdr[12] = 0;  // interlace

  // Add filter byte (0) per scanline
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---- Drawing helpers ----------------------------------------------------
const lerp = (a, b, t) => a + (b - a) * t;
const mix = (c1, c2, t) => [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const NAVY_TOP = [14, 24, 53];   // cosmic sky
const NAVY_BOT = [3, 7, 18];     // deep space
const GOLD_TOP = [253, 230, 138];
const GOLD_BOT = [217, 119, 6];
const GOLD_GLOW = [251, 191, 36];

// A few decorative stars (unit coords) kept clear of the crescent.
const STARS = [
  [0.16, 0.20, 0.011], [0.24, 0.78, 0.009], [0.12, 0.55, 0.007],
  [0.82, 0.80, 0.010], [0.30, 0.34, 0.006],
];

function buildStarPolygon(cx, cy, outer, inner) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? outer : inner;
    pts.push([cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad]);
  }
  return pts;
}

function pointInPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// Build geometry for a given content scale (1.0 = full bleed, < 1 = maskable safe zone)
function geometry(k) {
  const tp = (p) => [0.5 + (p[0] - 0.5) * k, 0.5 + (p[1] - 0.5) * k];
  const O = tp([0.5, 0.5]);
  const I = tp([0.63, 0.45]);
  const S0 = tp([0.72, 0.40]);
  return {
    O, Ro: 0.36 * k,
    I, Ri: 0.315 * k,
    star: buildStarPolygon(S0[0], S0[1], 0.11 * k, 0.046 * k),
    topY: 0.5 - 0.36 * k,
    botY: 0.5 + 0.36 * k,
  };
}

// Returns [r,g,b] for a unit coordinate (0..1)
function colorAt(ux, uy, g) {
  // Background gradient
  let col = mix(NAVY_TOP, NAVY_BOT, clamp(uy, 0, 1));

  // Soft gold glow behind the mark
  const dG = Math.hypot(ux - g.O[0], uy - g.O[1]);
  const glow = Math.exp(-((dG / 0.42) ** 2)) * 0.14;
  col = mix(col, GOLD_GLOW, glow);

  // Decorative stars
  for (const [sx, sy, sr] of STARS) {
    const d = Math.hypot(ux - sx, uy - sy);
    if (d < sr) col = mix(col, [255, 255, 255], clamp(1 - d / sr, 0, 1) * 0.85);
  }

  // Crescent: inside outer disc AND outside the inner (carving) disc
  const dO = Math.hypot(ux - g.O[0], uy - g.O[1]);
  const dI = Math.hypot(ux - g.I[0], uy - g.I[1]);
  const inStar = pointInPoly(ux, uy, g.star);
  if ((dO <= g.Ro && dI >= g.Ri) || inStar) {
    const t = clamp((uy - g.topY) / (g.botY - g.topY), 0, 1);
    col = mix(GOLD_TOP, GOLD_BOT, t);
  }
  return col;
}

function render(size, k) {
  const g = geometry(k);
  const SS = 4; // supersampling factor for anti-aliasing
  const rgba = Buffer.alloc(size * size * 4);
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let r = 0, gg = 0, b = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const ux = (px + (sx + 0.5) / SS) / size;
          const uy = (py + (sy + 0.5) / SS) / size;
          const c = colorAt(ux, uy, g);
          r += c[0]; gg += c[1]; b += c[2];
        }
      }
      const n = SS * SS;
      const o = (py * size + px) * 4;
      rgba[o] = Math.round(r / n);
      rgba[o + 1] = Math.round(gg / n);
      rgba[o + 2] = Math.round(b / n);
      rgba[o + 3] = 255;
    }
  }
  return encodePNG(size, size, rgba);
}

// ---- Emit ---------------------------------------------------------------
const outDir = path.join(__dirname, '..');
const jobs = [
  ['icon-192.png', 192, 0.86],
  ['icon-512.png', 512, 0.86],
  ['icon-maskable.png', 512, 0.60], // extra padding for adaptive-icon safe zone
];

for (const [name, size, k] of jobs) {
  const png = render(size, k);
  fs.writeFileSync(path.join(outDir, name), png);
  console.log(`wrote ${name} (${size}x${size}, ${Math.round(png.length / 1024)}KB)`);
}
console.log('done');
