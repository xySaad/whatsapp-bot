export const decodeHtmlEntities = (str) => {
  return str.replace(/&#x([0-9A-Fa-f]+);|&#(\d+);/g, (match, hex, dec) => {
    // Check if the match is hexadecimal or decimal
    let codePoint = hex ? parseInt(hex, 16) : parseInt(dec, 10);
    return String.fromCodePoint(codePoint);
  });
};
