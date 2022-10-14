export const charMap = ["nomiueaskx", "cbdpqlhvwz", "ftgjyr.:@/", "0123456789"];
export const chars = [...charMap, " "].join("").split("");
export const allExports = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", ...charMap, " "]
  .join("")
  .split("");

export const settings = {
  qrSize: 20,
  page: {
    width: 297,
    height: 210,
    padding: 18,
    layout: {
      columns: 10,
      rows: 4,
      gap: {
        columns: 1,
        rows: 3,
      },
    },
  },
  uid: "dos",
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

export const charHeight = settings.font.capHeight + settings.font.descender;
export const charWidth = settings.font.width;
