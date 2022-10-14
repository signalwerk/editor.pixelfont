import { rect } from "../../packages/mini-pdf/src/generator/ast/rect";
import { line } from "../../packages/mini-pdf/src/generator/ast/line";
import { text as t } from "../../packages/mini-pdf/src/generator/ast/text";
import { style } from "../../packages/mini-pdf/src/generator/ast/style";
import {
  group,
  translate,
  scale,
} from "../../packages/mini-pdf/src/generator/ast/group";
import {
  BLACK,
  CYAN,
  MAGENTA,
  RED,
  TRANSPARENT,
} from "../../packages/mini-pdf/src/generator/ast/color";
import { FontInfo } from "./index";

const settings = {
  colors: {
    grid: CYAN,
    baseline: MAGENTA,
    xHeight: MAGENTA,
  },
};

export function Char({
  text,
  x,
  y,
  width,
  fontInfo,
}: {
  text: string;
  x: number;
  y: number;
  width: number;
  fontInfo: FontInfo;
}): any {
  const {
    descender,
    xHeight,
    capHeight,
    ascender,
    width: totalWidth,
  } = fontInfo;

  const totalHeight = capHeight + descender;

  const scaler = width / totalWidth;

  // const charPixels = chunk(
  //   Array.from({ length: totalHeight * totalWidth }, (_, i) => i),
  //   totalWidth
  // );
  const charPixels = Array.from({ length: totalWidth }, (_, i) =>
    Array.from({ length: totalHeight }, (_, i) => i)
  );
  const boxes: any = [];
  // const full = style({
  //   fill: BLACK,
  // });
  // const empty = style({
  //   fill: TRANSPARENT,
  // });
  charPixels.forEach((col, iCol) => {
    col.forEach((row: any, iRow: number) => {
      boxes.push(
        rect({
          x: iCol * 1,
          y: iRow * 1,
          width: 1,
          height: 1,
          style: style({
            strokeWidth: 0.1 / scaler,
            stroke: settings.colors.grid,
            fill: TRANSPARENT,
          }),
        })
      );
    });
  });

  return group(
    {
      transform: [translate(x, y), scale(scaler, scaler)],
    },
    [
      t({
        x: 0,
        y: -0.5,
        text,
        className: "char",
      }),
      ...boxes,
      line({
        x1: 0,
        y1: capHeight,
        x2: totalWidth,
        y2: capHeight,

        style: style({
          strokeWidth: 0.2 / scaler,
          stroke: settings.colors.baseline,
        }),
      }),
      line({
        x1: 0,
        y1: capHeight - xHeight,
        x2: totalWidth,
        y2: capHeight - xHeight,

        style: style({
          strokeWidth: 0.2 / scaler,
          stroke: settings.colors.xHeight,
        }),
      }),
    ]
  );
}
