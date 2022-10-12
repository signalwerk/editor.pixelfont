import { readJpegHeader, jpgHeaderType } from "../../lib/jpeg-header";

// QrScanner.scanImage(image)
//   .then(result => console.log(result))
//   .catch(error => console.log(error || 'No QR code found.'));
export function getJpgInfo(file: any) {
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
