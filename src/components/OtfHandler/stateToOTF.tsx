// @ts-ignore
import opentype from "opentype.js";
import range from "../Store/range";
import { otfChar } from "./otfChar";
import { defaultFontName } from "../const";

export function stateToOTF(
  fontState: any,
  nameOverride: string = defaultFontName,
) {
  const fontInfo = fontState.info;
  const scaler = 125;

  const charHeight = fontInfo.capHeight + fontInfo.descender;

  const notdefGlyph = otfChar(
    ".notdef",
    0,
    range(charHeight, () => range(fontInfo.width, () => false)),
    scaler,
    fontInfo.capHeight,
  );

  const glyph = fontState.characters[0];

  const glyphs = [notdefGlyph];

  fontState.characters.forEach((glyph: any) => {
    const aGlyph = otfChar(
      glyph.id,
      glyph.id.charCodeAt(0),
      glyph.data,
      scaler,
      fontInfo.capHeight,
    );

    glyphs.push(aGlyph);

    if (glyph.id !== glyph.id.toUpperCase()) {
      const aGlyph = otfChar(
        glyph.id.toUpperCase(),
        glyph.id.toUpperCase().charCodeAt(0),
        glyph.data,
        scaler,
        fontInfo.capHeight,
      );
      glyphs.push(aGlyph);
    }
  });

  const font = new opentype.Font({
    familyName: nameOverride || defaultFontName,
    styleName: "Regular",
    unitsPerEm: 1000,
    ascender: fontInfo.capHeight * scaler,
    descender: 0 - fontInfo.descender * scaler,
    glyphs: glyphs,
  });

  return font;
}
