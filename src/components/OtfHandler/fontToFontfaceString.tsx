export function fontToFontfaceString(font: any) {
  const arrayBuffer = font.toArrayBuffer();

  var base64String = btoa(
    // @ts-ignore
    String.fromCharCode(...new Uint8Array(arrayBuffer))
  );

  const css = `
  @font-face {
    font-family: 'test';
    font-weight: 400;
    src: url('data:font/opentype;base64,${base64String}') format('opentype');
  }`;

  return css;
}
