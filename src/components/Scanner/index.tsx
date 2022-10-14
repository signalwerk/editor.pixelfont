import React, { useRef, useEffect } from "react";
import ImageUploading from "react-images-uploading";
import QrScanner from "qr-scanner";
import { getJpgInfo } from "./getJpgInfo";
import { document } from "../../packages/mini-pdf/src/generator/ast/document";
import { artboard } from "../../packages/mini-pdf/src/generator/ast/artboard";
import { rect } from "../../packages/mini-pdf/src/generator/ast/rect";
import { point } from "../../packages/mini-pdf/src/generator/ast/point";
import {
  polygon,
  pointsFromArrOfObj,
} from "../../packages/mini-pdf/src/generator/ast/polygon";
import { style } from "../../packages/mini-pdf/src/generator/ast/style";
import {
  rgb,
  RED,
  CYAN,
  WHITE,
  TRANSPARENT,
} from "../../packages/mini-pdf/src/generator/ast/color";
import { svg } from "../../packages/mini-pdf/src/writer/svg";
import { renderAsJSX } from "../renderAsJSX";
// import { useOpenCv } from "opencv-react";

import { RenderCanvas } from "./canvas";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import PerspT from "perspective-transform";
// import fixPerspective from "fix-perspective";

import { settings } from "../Form/settings";
// import { getPerspectiveTransform } from "./getPerspectiveTransform";

const arrayOfPointsToArray = (arr: any) => {
  const points: any = [];
  arr.forEach((point: any) => {
    points.push(point.x);
    points.push(point.y);
  });
  return points;
};

function getTransform({ width, height }: any, positions: qrPositionsType) {
  // const bbox = [
  //   positions?.tl?.[0],
  //   positions?.tr?.[3],
  //   positions?.bl?.[1],
  //   positions?.br?.[2],
  // ];

  const bbox = [
    positions?.tl?.[0],
    positions?.tr?.[3],
    positions?.br?.[2],
    positions?.bl?.[1],
  ];

  // const offsetX = 727;
  // const offsetY = 599;
  const offsetX = 0;
  const offsetY = 0;

  const page = [
    {
      x: offsetX + 0,
      y: offsetY + 0,
    },
    {
      x: offsetX + settings.page.width - settings.page.padding * 2,
      y: offsetY + 0,
    },
    {
      x: offsetX + settings.page.width - settings.page.padding * 2,
      y: offsetY + settings.page.height - settings.page.padding * 2,
    },
    {
      x: offsetX + 0,
      y: offsetY + settings.page.height - settings.page.padding * 2,
    },
  ];

  var srcCorners = arrayOfPointsToArray(bbox);
  var dstCorners = arrayOfPointsToArray(page);

  // console.log({ dstCorners, srcCorners });

  // var perspT = PerspT(dstCorners, srcCorners);
  var perspT = PerspT(srcCorners, dstCorners);
  // var t = perspT.coeffsInv;4
  var t = perspT.coeffs;
  const matrix = [
    t[0],
    t[3],
    0,
    t[6],
    t[1],
    t[4],
    0,
    t[7],
    0,
    0,
    1,
    0,
    t[2],
    t[5],
    0,
    t[8],
  ];

  return {
    transform: "matrix3d(" + matrix.join(",") + ")",
    transformOrigin: "0 0",
    width: `${width}px`,
  };
}

function svgOverlay({ width, height }: any, positions: qrPositionsType) {
  const bbox = [
    positions?.tl?.[0],
    positions?.tr?.[3],
    positions?.br?.[2],
    positions?.bl?.[1],
  ];

  // var srcPt = [250, 120];
  // var dstPt = perspT.transform(srcPt[0], srcPt[1]);

  // const to = toOrigin.map((p) => ({
  //   x: p.x * 50,
  //   y: p.y * 50,
  // }));

  // var transformation = fixPerspective(to, bbox);
  // const matrix = transformation.H;
  // const css3D =
  //   "matrix3d(" +
  //   matrix
  //     .map((items: any) => items.map((item: any) => item.toFixed(20)).join(","))
  //     .join(",") +
  //   ")";
  // console.log(css3D);
  // console.log(transformation, transformation.H);
  // document.querySelector('#image').style.transform = 'matrix3d(' + m.join(',') + ')';

  const DOC = document(
    {
      className: "image-img-sections",
    },
    [
      // page 1
      artboard(width, height, [
        rect({
          x: 0,
          y: 0,
          width: width,
          height: height,
          style: style({
            strokeWidth: 5,
            stroke: RED,
            fill: TRANSPARENT,
            vectorEffect: "non-scaling-stroke",
          }),
        }),
        polygon({
          points: pointsFromArrOfObj(positions.tl),
          style: style({
            strokeWidth: 1,
            stroke: RED,
            fill: TRANSPARENT,
            vectorEffect: "non-scaling-stroke",
          }),
        }),
        polygon({
          points: pointsFromArrOfObj(positions.tr),
          style: style({
            strokeWidth: 1,
            stroke: RED,
            fill: TRANSPARENT,
            vectorEffect: "non-scaling-stroke",
          }),
        }),
        polygon({
          points: pointsFromArrOfObj(positions.bl),
          style: style({
            strokeWidth: 1,
            stroke: RED,
            fill: TRANSPARENT,
            vectorEffect: "non-scaling-stroke",
          }),
        }),
        polygon({
          points: pointsFromArrOfObj(positions.br),
          style: style({
            strokeWidth: 1,
            stroke: RED,
            fill: TRANSPARENT,
            vectorEffect: "non-scaling-stroke",
          }),
        }),

        polygon({
          points: bbox.map((p) => point(p?.x || 0, p?.y || 0)),
          style: style({
            strokeWidth: 1,
            stroke: CYAN,
            fill: TRANSPARENT,
            vectorEffect: "non-scaling-stroke",
          }),
        }),
      ]),
    ]
  );

  return DOC;
}

export type imgDimension = {
  width: number | undefined;
  height: number | undefined;
};

export type pointType = {
  x: number;
  y: number;
};

export type qrPositionsType = {
  tl: Array<pointType> | undefined;
  tr: Array<pointType> | undefined;
  bl: Array<pointType> | undefined;
  br: Array<pointType> | undefined;
};

export function Scanner() {
  const [images, setImages] = React.useState<Array<any>>([]);
  const [transform, setTransform] = React.useState<Object>({});
  const [imageOverlay, setImageOverlay] = React.useState<JSX.Element | null>();
  const [imgDimension, setImgDimension] = React.useState<imgDimension>({
    width: undefined,
    height: undefined,
  });

  const [qrPositions, setQrPositions] = React.useState<qrPositionsType>({
    tl: [],
    tr: [],
    bl: [],
    br: [],
  });

  const onChange = (imageList: any, addUpdateIndex: any) => {
    // data for submit
    setImages(imageList);
  };

  const scan = async () => {
    const image = images[0]?.file;
    // const header = readJpegHeader(image);
    const header = await getJpgInfo(image);

    if (header) {
      setImgDimension({ height: header.height, width: header.width });

      const TL = await QrScanner.scanImage(image, {
        returnDetailedScanResult: true,
        scanRegion: {
          x: 0,
          y: 0,
          width: header.width / 2,
          height: header.height / 2,
        },
      }).catch((error) => console.log(error || "TL No QR code found."));

      const TR = await QrScanner.scanImage(image, {
        returnDetailedScanResult: true,
        scanRegion: {
          x: header.width / 2,
          y: 0,
          width: header.width / 2,
          height: header.height / 2,
        },
      }).catch((error) => console.log(error || "TR No QR code found."));

      const BL = await QrScanner.scanImage(image, {
        returnDetailedScanResult: true,
        scanRegion: {
          x: 0,
          y: header.height / 2,
          width: header.width / 2,
          height: header.height / 2,
        },
      }).catch((error) => console.log(error || "BL No QR code found."));

      const BR = await QrScanner.scanImage(image, {
        returnDetailedScanResult: true,
        scanRegion: {
          x: header.width / 2,
          y: header.height / 2,
          width: header.width / 2,
          height: header.height / 2,
        },
      }).catch((error) => console.log(error || "BR No QR code found."));

      const positions: qrPositionsType = {
        tl: TL?.cornerPoints,
        tr: TR?.cornerPoints,
        bl: BL?.cornerPoints,
        br: BR?.cornerPoints,
      };

      setQrPositions(positions);

      const overlay = svgOverlay(
        { width: header.width, height: header.height },
        positions
      );
      setImageOverlay(renderAsJSX(svg([overlay]))[0]);

      const t = getTransform(
        { width: header.width, height: header.height },
        positions
      );

      setTransform(t);

      console.log({ qrPositions });
    } else {
      setImgDimension({
        width: undefined,
        height: undefined,
      });
    }
  };
  // const { loaded, cv } = useOpenCv();

  // useEffect(() => {
  //   if (cv) {
  //   }
  // }, [cv]);

  return (
    <div className="App">
      <button onClick={scan}>Scan</button>
      {/* <pre>{JSON.stringify({ imgDimension, qrPositions }, null, 2)}</pre> */}
      <ImageUploading
        value={images}
        onChange={onChange}
        dataURLKey="data_url"
        acceptType={["jpg"]}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <>
              <button
                style={isDragging ? { color: "red" } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                Click or Drop here
              </button>
              &nbsp;
              <button onClick={onImageRemoveAll}>Remove all images</button>
              {imageList.map((image, index) => (
                <>
                  {/* <RenderCanvas image={image} /> */}

                  <div key={index} className="image-item">
                    <div key={index} className="image-img">
                      <img src={image["data_url"]} alt="" style={transform} />

                      {imgDimension?.width && imgDimension?.height && (
                        <> {imageOverlay}</>
                      )}
                    </div>
                    <div className="image-item__btn-wrapper">
                      <button onClick={() => onImageUpdate(index)}>
                        Update
                      </button>
                      <button onClick={() => onImageRemove(index)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </>
              ))}
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                errors,
              }: {
                imageList: any;
                onImageUpload: any;
                onImageRemoveAll: any;
                errors: any;
              }) =>
                errors && (
                  <div>
                    {errors.maxNumber && (
                      <span>Number of selected images exceed maxNumber</span>
                    )}
                    {errors.acceptType && (
                      <span>Your selected file type is not allow</span>
                    )}
                    {errors.maxFileSize && (
                      <span>Selected file size exceed maxFileSize</span>
                    )}
                    {errors.resolution && (
                      <span>
                        Selected file is not match your desired resolution
                      </span>
                    )}
                  </div>
                )
              }
            </>
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
