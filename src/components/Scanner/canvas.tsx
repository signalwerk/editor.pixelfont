import React, { useRef, useEffect } from "react";
import { settings } from "../Form/settings";

export function RenderCanvas({ image }: { image: any }) {
  console.log({ image });
  // const canvas = useRef<HTMLCanvasElement>();
  const canvas = useRef<HTMLCanvasElement | null>(null);

  let ctx = null;

  useEffect(() => {
    // dynamically assign the width and height to canvas
    const canvasEle = canvas.current;

    if (canvasEle) {
      const w = settings.page.width - settings.page.padding * 2;
      const h = settings.page.height - settings.page.padding * 2;

      // @ts-ignore
      canvasEle.width = w;
      // @ts-ignore
      canvasEle.height = h;

      // @ts-ignore
      canvasEle.style.width = `${w}px`;
      // @ts-ignore
      canvasEle.style.height = `${h}px`;

      // canvasEle.width = canvasEle.clientWidth;
      // canvasEle.height = canvasEle.clientHeight;

      // get context of the canvas
      // @ts-ignore
      let ctx = canvasEle.getContext("2d");

      const text = "Clue Mediator!";
      const x = 180;
      const y = 70;
      const fontSize = 20;
      const fontFamily = "Arial";
      const color = "black";
      const textAlign = "left";
      const textBaseline = "top";

      if (ctx) {
        ctx.beginPath();
        ctx.font = fontSize + "px " + fontFamily;
        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        ctx.stroke();

        var img = new Image();
        img.onload = function () {
          // @ts-ignore
          ctx.drawImage(img, 20, 20);
          alert("the image is drawn");
        };
        img.src = URL.createObjectURL(image.file);
      }
    }
  }, []);

  return (
    <>
      <canvas ref={canvas}></canvas>
    </>
  );
}
