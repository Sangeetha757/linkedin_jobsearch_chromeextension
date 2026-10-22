/**
 * generate-icons.js
 * Generates icon16.png, icon48.png, icon128.png with no npm dependencies.
 * Uses Node.js built-in zlib to create valid PNG files.
 *
 * Run:  node generate-icons.js
 */

const fs   = require("fs");
const path = require("path");
const zlib = require("zlib");

// ── PNG helpers ───────────────────────────────────────────────

function crc32(buf) {
  const table = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[i] = c;
    }
    return t;
  })();
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const len       = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcBuf = Buffer.concat([typeBytes, data]);
  const crcVal = Buffer.alloc(4);
  crcVal.writeUInt32BE(crc32(crcBuf));
  return Buffer.concat([len, typeBytes, data, crcVal]);
}

function makePNG(size, drawFn) {
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);   // width
  ihdr.writeUInt32BE(size, 4);   // height
  ihdr[8]  = 8;  // bit depth
  ihdr[9]  = 2;  // color type: RGB
  ihdr[10] = 0;  // compression
  ihdr[11] = 0;  // filter
  ihdr[12] = 0;  // interlace

  // Build raw pixel data: each row = filter byte (0) + R G B per pixel
  const raw = Buffer.alloc(size * (1 + size * 3));
  for (let y = 0; y < size; y++) {
    raw[y * (1 + size * 3)] = 0; // filter type None
    for (let x = 0; x < size; x++) {
      const [r, g, b] = drawFn(x, y, size);
      const offset = y * (1 + size * 3) + 1 + x * 3;
      raw[offset]     = r;
      raw[offset + 1] = g;
      raw[offset + 2] = b;
    }
  }

  const compressed = zlib.deflateSync(raw);

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

// ── Drawing function ──────────────────────────────────────────
// Draws a rounded-rect with LinkedIn blue gradient + white briefcase "B" letter

function drawIcon(x, y, size) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.45; // circle radius

  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Outside circle → transparent → white background
  if (dist > radius) {
    return [255, 255, 255];
  }

  // Gradient: top-left = #0a66c2, bottom-right = #004182
  const t = (x + y) / (size * 2);  // 0..1
  const r = Math.round(10  + (0  - 10)  * t);
  const g = Math.round(102 + (65 - 102) * t);
  const b = Math.round(194 + (130 - 194) * t);

  // Draw a simple briefcase shape in white
  // Handle bar (top center rectangle)
  const handleW = size * 0.22;
  const handleH = size * 0.12;
  const handleX1 = cx - handleW / 2;
  const handleX2 = cx + handleW / 2;
  const handleY1 = cy - size * 0.22;
  const handleY2 = handleY1 + handleH;

  // Body rectangle
  const bodyW  = size * 0.54;
  const bodyH  = size * 0.36;
  const bodyX1 = cx - bodyW / 2;
  const bodyX2 = cx + bodyW / 2;
  const bodyY1 = cy - size * 0.10;
  const bodyY2 = bodyY1 + bodyH;

  const thick = Math.max(1, size * 0.055);

  // Handle: two vertical sides + top bar
  const inHandle =
    (x >= handleX1 && x <= handleX1 + thick && y >= handleY1 && y <= handleY2) ||
    (x >= handleX2 - thick && x <= handleX2 && y >= handleY1 && y <= handleY2) ||
    (x >= handleX1 && x <= handleX2 && y >= handleY1 && y <= handleY1 + thick);

  // Body: outline
  const inBody =
    (x >= bodyX1 && x <= bodyX2 && y >= bodyY1 && y <= bodyY1 + thick) ||
    (x >= bodyX1 && x <= bodyX2 && y >= bodyY2 - thick && y <= bodyY2) ||
    (x >= bodyX1 && x <= bodyX1 + thick && y >= bodyY1 && y <= bodyY2) ||
    (x >= bodyX2 - thick && x <= bodyX2 && y >= bodyY1 && y <= bodyY2);

  // Center divider line
  const inDivider =
    x >= bodyX1 && x <= bodyX2 &&
    y >= cy - thick / 2 && y <= cy + thick / 2;

  if (inHandle || inBody || inDivider) {
    return [255, 255, 255];
  }

  return [r, g, b];
}

// ── Write files ───────────────────────────────────────────────
const sizes = [16, 48, 128];
const dir   = __dirname;

for (const size of sizes) {
  const png  = makePNG(size, drawIcon);
  const file = path.join(dir, `icon${size}.png`);
  fs.writeFileSync(file, png);
  console.log(`✓ Created ${file} (${png.length} bytes)`);
}

console.log("\nAll icons generated successfully.");
