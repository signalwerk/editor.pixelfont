// source: https://viereck.ch/jpeg-header/
// Author: Thomas Lochmatter, thomas.lochmatter@viereck.ch
// License: MIT

export type jpgHeaderType = {
  progressive: boolean;
  bitDepth: number;
  height: number;
  width: number;
  components: number;
};

// Returns an object with the width and height of the JPEG image stored in bytes, or null if the bytes do not represent a JPEG image.
export function readJpegHeader(bytes: any): jpgHeaderType | undefined {
  // JPEG magick
  if (bytes[0] !== 0xff) return;
  if (bytes[1] !== 0xd8) return;

  // Go through all markers
  var pos = 2;
  var dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  while (pos + 4 < bytes.byteLength) {
    // Scan for the next start marker (if the image is corrupt, this marker may not be where it is expected)
    if (bytes[pos] !== 0xff) {
      pos += 1;
      continue;
    }

    var type = bytes[pos + 1];

    // Short marker
    pos += 2;
    if (bytes[pos] === 0xff) continue;

    // SOFn marker
    var length = dv.getUint16(pos);
    if (pos + length > bytes.byteLength) return;
    if (length >= 7 && (type === 0xc0 || type === 0xc2)) {
      var data: jpgHeaderType = {
        progressive: type === 0xc2,
        bitDepth: bytes[pos + 2],
        width: dv.getUint16(pos + 5),
        height: dv.getUint16(pos + 3),
        components: bytes[pos + 7],
      };
      return data;
    }

    // Other marker
    pos += length;
  }

  return;
}
