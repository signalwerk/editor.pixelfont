export const charMap = ["nomiueaskx", "cbdpqlhvwz", "ftgjyr.:@/", "0123456789"];
export const chars = [...charMap, " "].join("").split("");

export const settings = {
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
