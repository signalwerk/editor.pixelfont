import React from "react";
import ImageUploading from "react-images-uploading";
import { readJpegHeader, jpgHeaderType } from "./lib/jpeg-header";
import QrScanner from "qr-scanner";

// QrScanner.scanImage(image)
//   .then(result => console.log(result))
//   .catch(error => console.log(error || 'No QR code found.'));

function getJpgInfo(file: any) {
  return new Promise<jpgHeaderType>((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = function () {
      var arrayBuffer = this.result;

      if (arrayBuffer) {
        const constInt8 = new Uint8Array(arrayBuffer as ArrayBuffer);

        const header = readJpegHeader(constInt8);
        if (header) {
          resolve(header);
        } else {
          reject(new Error("failed to read header in jpg"));
        }
      } else {
        reject(new Error("failed to read file"));
      }
    };
    reader.readAsArrayBuffer(file);

    // setTimeout(() => {
    //   resolve("foo");
    // }, 300);
  });
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
  tl: Array<pointType>;
  tr: Array<pointType>;
  bl: Array<pointType>;
};

export function Scanner() {
  const [images, setImages] = React.useState<Array<any>>([]);
  const [imgDimension, setImgDimension] = React.useState<imgDimension>({
    width: undefined,
    height: undefined,
  });
  const [qrPositions, setQrPositions] = React.useState<qrPositionsType>({
    tl: [],
    tr: [],
    bl: [],
  });


  const onChange = (imageList: any, addUpdateIndex: any) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  const scan = async () => {
    const image = images[0]?.file;
    // const header = readJpegHeader(image);
    const header = await getJpgInfo(image);
    console.log({ image, header });

    if (header) {
      setImgDimension({ height: header.height, width: header.width });

      QrScanner.scanImage(image, {
        returnDetailedScanResult: true,
        scanRegion: {
          x: 0,
          y: 0,
          height: header.height / 2,
          width: header.width / 2,
        },
      })
        .then((result) => {
          const { data, cornerPoints } = result;

          // @ts-ignore
          setQrPositions((val) => ({ ...val, tl: cornerPoints }));
          console.log(result);
        })
        .catch((error) => console.log(error || "TL No QR code found."));

      QrScanner.scanImage(image, {
        returnDetailedScanResult: true,
        scanRegion: {
          x: header.height / 2,
          y: 0,
          height: header.height / 2,
          width: header.width / 2,
        },
      })
        .then((result) => {
          const { data, cornerPoints } = result;

          // @ts-ignore
          setQrPositions((val) => ({ ...val, tr: cornerPoints }));
          console.log(result);
        })
        .catch((error) => console.log(error || "TR No QR code found."));

      QrScanner.scanImage(image, {
        returnDetailedScanResult: true,
        scanRegion: {
          x: 0,
          y: header.height / 2,
          height: header.height / 2,
          width: header.width / 2,
        },
      })
        .then((result) => {
          const { data, cornerPoints } = result;

          // @ts-ignore
          setQrPositions((val) => ({ ...val, bl: cornerPoints }));
          console.log(result);
        })
        .catch((error) => console.log(error || "BL No QR code found."));
    } else {
      setImgDimension({
        width: undefined,
        height: undefined,
      });
    }
  };

  return (
    <div className="App">
      <button onClick={scan}>Scan</button>
      <pre>{JSON.stringify({ imgDimension, qrPositions }, null, 2)}</pre>
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
                <div key={index} className="image-item">
                  <div key={index} className="image-img">
                    <img src={image["data_url"]} alt="" />

                    {imgDimension?.width && imgDimension?.height && (
                      <svg
                        className="image-img-sections"
                        viewBox={[
                          0,
                          0,
                          imgDimension.width,
                          imgDimension.height,
                        ].join(" ")}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width={imgDimension.width}
                          height={imgDimension.height}
                          className="image-all image-section"
                        />
                        <rect
                          width={imgDimension.width / 2}
                          height={imgDimension.height / 2}
                          className="image-section"
                        />
                        <rect
                          x={imgDimension.width / 2}
                          width={imgDimension.width / 2}
                          height={imgDimension.height / 2}
                          className="image-section"
                        />
                        <rect
                          y={imgDimension.height / 2}
                          width={imgDimension.width / 2}
                          height={imgDimension.height / 2}
                          className="image-section"
                        />
                        <rect
                          x={imgDimension.width / 2}
                          y={imgDimension.height / 2}
                          width={imgDimension.width / 2}
                          height={imgDimension.height / 2}
                          className="image-section"
                        />
                        {qrPositions?.tl && (
                          <polygon
                            className="image-qr"
                            points={qrPositions.tl
                              .map((item) => `${item.x},${item.y}`)
                              .join(" ")}
                          />
                        )}
                        {qrPositions?.tr && (
                          <polygon
                            className="image-qr"
                            points={qrPositions.tr
                              .map((item) => `${item.x},${item.y}`)
                              .join(" ")}
                          />
                        )}
                        {qrPositions?.bl && (
                          <polygon
                            className="image-qr"
                            points={qrPositions.bl
                              .map((item) => `${item.x},${item.y}`)
                              .join(" ")}
                          />
                        )}
                        <rect x="120" width="100" height="100" rx="15" />
                      </svg>
                    )}
                  </div>
                  <div className="image-item__btn-wrapper">
                    <button onClick={() => onImageUpdate(index)}>Update</button>
                    <button onClick={() => onImageRemove(index)}>Remove</button>
                  </div>
                </div>
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
