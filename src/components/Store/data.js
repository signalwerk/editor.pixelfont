import { settings, chars, charHeight, charWidth } from "../../settings.tsx";
import range from "./range";

export const characters = chars.map((char) => {
  return {
    id: char,
    data: range(charHeight, (y) => range(charWidth, (x) => false)),
  };
});

export const font = {
  info: {
    ...settings.font,
  },
  characters,
};

// get an element from an array at a specific position (index) – the index can be negative and exceed the length of the array (Modulo wrapping)
const at = (arr, n) => {
  return arr[getWrppingIndex(arr.length, n)];
};

const getWrppingIndex = (length, index) => {
  const offset = Math.abs(index) % length;

  if (index >= 0) {
    return index % length;
  } else {
    return (length - offset) % length;
  }
};

const get = (data, x, y) => {
  return at(at(data, y), x);
};

export const set = (data, x, y, value) => {
  const newData = structuredClone(data);
  const lineInex = getWrppingIndex(newData.length, y);

  const newLine = newData[lineInex].map((pixel, index) =>
    index === x ? value : pixel,
  );

  newData[lineInex] = newLine;

  return newData;
};

const fallback = font.characters.find((char) => char.id === " ");
export const getChar = (font, id) => {
  return font.characters.find((char) => char.id === id) || fallback;
};
