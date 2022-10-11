import React from "react";
import QRCode, { QRCodeOptions } from "qrcode";

import { document } from "../../packages/mini-pdf/src/generator/ast/document";
import { artboard } from "../../packages/mini-pdf/src/generator/ast/artboard";
import { rect } from "../../packages/mini-pdf/src/generator/ast/rect";
import { style } from "../../packages/mini-pdf/src/generator/ast/style";
import {
  group,
  translate,
  scale,
} from "../../packages/mini-pdf/src/generator/ast/group";
import {
  rgb,
  BLACK,
  RED,
  WHITE,
  TRANSPARENT,
} from "../../packages/mini-pdf/src/generator/ast/color";
import { AstBoxAttributes } from "../../packages/mini-pdf/src/dataTypes/ast/Box";
import { svg } from "../../packages/mini-pdf/src/writer/svg";

import "./styles.css";

const settings = {
  qrSize: 20,
  page: {
    width: 297,
    height: 210,
    padding: 7,
    layout: {
      columns: 10,
      rows: 4,
      gap: {
        columns: 1,
        rows: 2,
      },
    },
  },
  uid: "asdfz",
  layout: {
    version: 1,
    type: "full-1",
  },
  font: {
    descender: 1,
    xHeight: 5,
    capHeight: 7,
    ascender: 6,
    width: 8,
  },
};

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

type FontInfo = {
  descender: number;
  xHeight: number;
  capHeight: number;
  ascender: number;
  width: number;
};

const chunk = (a: any, n: any) =>
  [...Array(Math.ceil(a.length / n))].map((_, i) => a.slice(n * i, n + n * i));

function Char({
  x,
  y,
  width,
  fontInfo,
}: {
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

  console.log("totalHeight", totalHeight);

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
            stroke: RED,
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
    boxes
  );
}

function QR(text: string, { x, y, width, height }: AstBoxAttributes): any {
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
          })
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
    boxes
  );
}

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
    rect({
      x: settings.page.padding,
      y: settings.page.padding,
      width: settings.page.width - settings.page.padding * 2,
      height: settings.page.height - settings.page.padding * 2,
      style: style({
        strokeWidth: 0.5,
        stroke: RED,
        fill: TRANSPARENT,
      }),
    }),
    QR(qrString(qrInfo.tl), {
      x: settings.page.padding,
      y: settings.page.padding,
      width: settings.qrSize,
      height: settings.qrSize,
    }),
    QR(qrString(qrInfo.tr), {
      x: settings.page.width - settings.page.padding - settings.qrSize,
      y: settings.page.padding,
      width: settings.qrSize,
      height: settings.qrSize,
    }),
    QR(qrString(qrInfo.bl), {
      x: settings.page.padding,
      y: settings.page.height - settings.page.padding - settings.qrSize,
      width: settings.qrSize,
      height: settings.qrSize,
    }),
    QR(qrString(qrInfo.br), {
      x: settings.page.width - settings.page.padding - settings.qrSize,
      y: settings.page.height - settings.page.padding - settings.qrSize,
      width: settings.qrSize,
      height: settings.qrSize,
    }),
    ...Array.from({ length: settings.page.layout.columns }, (_, i) => {
      const totalWidth = settings.page.width - settings.page.padding * 2;
      const totalUnits =
        settings.font.width * settings.page.layout.columns +
        (settings.page.layout.columns - 1) * settings.page.layout.gap.columns;
      const unitWidth = totalWidth / totalUnits;
      const charWidth = unitWidth * settings.font.width;
      const xGap = unitWidth * settings.page.layout.gap.columns;

      return Char({
        x: settings.page.padding + xGap + (i * charWidth + xGap * (i - 1)),
        y: 50,
        width: charWidth,
        fontInfo: settings.font,
      });
    }),
  ]),
]);

function renderAsJSX(nodes: any[]): any[] {
  return nodes.map((node: any) => {
    let children = null;

    if (node.children && node.children.length > 0) {
      children = renderAsJSX(node.children);
    }
    return <>{React.createElement(node.tag, node.attributes, children)}</>;
  });
}

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
