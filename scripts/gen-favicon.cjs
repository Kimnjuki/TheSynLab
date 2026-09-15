const fs = require('fs');
const { deflateSync, crc32 } = require('zlib');

function transparentPng(size) {
  const w = size, h = size;
  const stride = w * 4 + 1;
  const raw = Buffer.alloc(stride * h); // filter byte 0 per scanline (already zeroed)
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const makeChunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
    const t = Buffer.from(type, 'ascii');
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([t, data])) >>> 0, 0);
    return Buffer.concat([len, t, data, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const idat = deflateSync(raw);
  return Buffer.concat([sig, makeChunk('IHDR', ihdr), makeChunk('IDAT', idat), makeChunk('IEND', Buffer.alloc(0))]);
}

const imgs = [transparentPng(16), transparentPng(32)];
const sizes = [16, 32];
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);            // reserved (must be 0)
header.writeUInt16LE(1, 2);            // type: 1 = ICO (2 would mean CUR/cursor)
header.writeUInt16LE(imgs.length, 4); // number of images in the file

const entries = Buffer.alloc(imgs.length * 16);
let offset = 6 + imgs.length * 16;
imgs.forEach((img, i) => {
  const s = sizes[i];
  entries[i * 16 + 0] = s & 0xff;     // width  (0 for 256)
  entries[i * 16 + 1] = s & 0xff;     // height (0 for 256)
  entries[i * 16 + 2] = 0;            // color count (0 = >256)
  entries[i * 16 + 3] = 0;            // reserved
  entries.writeUInt16LE(1, i * 16 + 4);             // color planes
  entries.writeUInt16LE(32, i * 16 + 6);            // bits per pixel
  entries.writeUInt32LE(img.length, i * 16 + 8);    // size in bytes
  entries.writeUInt32LE(offset, i * 16 + 12);       // image data offset
  offset += img.length;
});

fs.writeFileSync('public/favicon.ico', Buffer.concat([header, entries, ...imgs]));
console.log('favicon.ico written:', fs.statSync('public/favicon.ico').size, 'bytes');
