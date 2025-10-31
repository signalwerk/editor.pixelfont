// @ts-ignore
import opentype from "opentype.js";

// function otfPixel(x, y, size) {
//   const w = size;
//   const h = size;
//   const aPath = new opentype.Path();
//   aPath.moveTo(0, 0);
//   aPath.lineTo(0, w);
//   aPath.lineTo(h, w);
//   aPath.lineTo(h, 0);
// }
export function otfChar(
  name: string,
  unicode: number,
  data: any,
  size: number,
  capHeight: number,
) {
  const totalHeight = data.length * size;

  const aPath = new opentype.Path();

  data.forEach((line: any, y: number) => {
    return line.forEach((pixel: any, x: number) => {
      if (pixel) {
        const offsetX = x * size;
        const offsetY = (capHeight - 1) * size - y * size;

        aPath.moveTo(offsetX, offsetY);
        aPath.lineTo(offsetX, offsetY + size);
        aPath.lineTo(offsetX + size, offsetY + size);
        aPath.lineTo(offsetX + size, offsetY);
      }
    });
  });

  const gylph = new opentype.Glyph({
    name,
    unicode,
    advanceWidth: data[0].length * size,
    path: aPath,
  });

  return gylph;
}
