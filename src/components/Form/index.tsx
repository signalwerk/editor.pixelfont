import React from "react";

import { document } from "../../packages/mini-pdf/src/generator/ast/document";
import { artboard } from "../../packages/mini-pdf/src/generator/ast/artboard";
import { rect } from "../../packages/mini-pdf/src/generator/ast/rect";
import { text as t } from "../../packages/mini-pdf/src/generator/ast/text";
import { style } from "../../packages/mini-pdf/src/generator/ast/style";
import {
  rgb,
  RED,
  WHITE,
  CYAN,
  TRANSPARENT,
} from "../../packages/mini-pdf/src/generator/ast/color";
import { svg } from "../../packages/mini-pdf/src/writer/svg";

import "./styles.css";
import { QR } from "./QR";
import { renderAsJSX } from "../renderAsJSX";
import { Char } from "./Char";
import { settings, charMap } from "./settings";
import { title, subTitle } from "../const";

const qrInfo = {
  tl: {
    p: 1,
    u: settings.uid,
  },
  tr: {
    p: 2,
    l: `${settings.layout.version}-${settings.layout.type}`,
  },
  bl: {
    p: 3,
    d: settings.font.descender,
    x: settings.font.xHeight,
    c: settings.font.capHeight,
  },
  br: {
    p: 3,
    a: settings.font.ascender,
    w: settings.font.width,
  },
};

function qrString(obj: any) {
  return Object.keys(obj)
    .map((key) => `${key}:${obj[key]}`)
    .join(";");
}

export type FontInfo = {
  descender: number;
  xHeight: number;
  capHeight: number;
  ascender: number;
  width: number;
};

const DOC = document({}, [
  // page 1
  artboard(settings.page.width, settings.page.height, [
    rect({
      x: 0,
      y: 0,
      width: settings.page.width,
      height: settings.page.height,
      style: style({
        strokeWidth: 1,
        stroke: RED,
        fill: WHITE,
      }),
    }),

    t({
      x: settings.page.padding,
      y: 24,
      text: title,
      className: "form__title",
    }),

    t({
      x: settings.page.padding,
      y: 32,
      text: subTitle,
      className: "form__sub-title",
    }),

    // rect({
    //   x: settings.page.padding,
    //   y: settings.page.padding,
    //   width: settings.page.width - settings.page.padding * 2,
    //   height: settings.page.height - settings.page.padding * 2,
    //   style: style({
    //     strokeWidth: 0.5,
    //     stroke: CYAN,
    //     fill: TRANSPARENT,
    //   }),
    // }),
    // QR(qrString(qrInfo.tl), {
    //   x: settings.page.padding,
    //   y: settings.page.padding,
    //   width: settings.qrSize,
    //   height: settings.qrSize,
    // }),
    // QR(qrString(qrInfo.tr), {
    //   x: settings.page.width - settings.page.padding - settings.qrSize,
    //   y: settings.page.padding,
    //   width: settings.qrSize,
    //   height: settings.qrSize,
    // }),
    // QR(qrString(qrInfo.bl), {
    //   x: settings.page.padding,
    //   y: settings.page.height - settings.page.padding - settings.qrSize,
    //   width: settings.qrSize,
    //   height: settings.qrSize,
    // }),
    // QR(qrString(qrInfo.br), {
    //   x: settings.page.width - settings.page.padding - settings.qrSize,
    //   y: settings.page.height - settings.page.padding - settings.qrSize,
    //   width: settings.qrSize,
    //   height: settings.qrSize,
    // }),
    ...Array.from(
      { length: settings.page.layout.columns * settings.page.layout.rows },
      (_, i) => {
        const x = i % settings.page.layout.columns;
        const y = Math.floor(i / settings.page.layout.columns);
        const height = settings.font.capHeight + settings.font.descender;
        const totalWidth = settings.page.width - settings.page.padding * 2;
        const totalHeight = settings.page.height - settings.page.padding * 2;

        const totalUnitsX =
          settings.font.width * settings.page.layout.columns +
          (settings.page.layout.columns - 1) * settings.page.layout.gap.columns;

        const totalUnitsY =
          height * settings.page.layout.rows +
          (settings.page.layout.rows - 1) * settings.page.layout.gap.rows;

        const unitWidth = totalWidth / totalUnitsX;
        const charWidth = unitWidth * settings.font.width;
        const charHeight = unitWidth * height;

        const xGap = unitWidth * settings.page.layout.gap.columns;
        const yGap = unitWidth * settings.page.layout.gap.rows;
        const yOffset = (totalHeight - totalUnitsY * unitWidth) / 2 + 5;
        return Char({
          text: charMap[y][x],
          x: settings.page.padding + xGap + (x * charWidth + xGap * (x - 1)),
          y:
            yOffset +
            settings.page.padding +
            yGap +
            (y * charHeight + yGap * (y - 1)),
          width: charWidth,
          fontInfo: settings.font,
        });
      },
    ),
  ]),
]);

function App() {
  return (
    <div className="form">
      {renderAsJSX(svg([DOC]))[0]}
      <hr />
      <hr />
    </div>
  );
}

export default App;
