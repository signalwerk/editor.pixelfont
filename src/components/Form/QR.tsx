import QRCode, { QRCodeOptions } from "qrcode";
import { rect } from "../../packages/mini-pdf/src/generator/ast/rect";
import { style } from "../../packages/mini-pdf/src/generator/ast/style";
import {
  group,
  translate,
  scale,
} from "../../packages/mini-pdf/src/generator/ast/group";
import { BLACK } from "../../packages/mini-pdf/src/generator/ast/color";
import { AstBoxAttributes } from "../../packages/mini-pdf/src/dataTypes/ast/Box";
import { chunk } from "./chunk";

export function QR(
  text: string,
  { x, y, width, height }: AstBoxAttributes,
): any {
  const option: QRCodeOptions = { errorCorrectionLevel: "medium" };
  const qr = QRCode.create(text, option);
  const size = qr.modules.size;
  const data = qr.modules.data;
  const lines = chunk(Array.from(data), size);

  const boxDimensions = {
    width: width / size,
    height: height / size,
  };

  const boxes: any = [];
  // const full = style({
  //   fill: BLACK,
  // });
  // const empty = style({
  //   fill: TRANSPARENT,
  // });
  lines.forEach((row, iRow) => {
    row.forEach((col: any, iCol: number) => {
      if (col) {
        boxes.push(
          rect({
            x: iRow * 1,
            y: iCol * 1,
            width: 1,
            height: 1,
            style: style({
              fill: BLACK,
            }),
          }),
        );
      }
    });
  });

  return group(
    {
      transform: [
        translate(x, y),
        scale(boxDimensions.width, boxDimensions.height),
      ],
    },
    boxes,
  );
}
