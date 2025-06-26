const americanOnly = require("./RawData/american-only.js");
const americanToBritishSpelling = require("./RawData/american-to-british-spelling.js");
const americanToBritishTitles = require("./RawData/american-to-british-titles.js");
const britishOnly = require("./RawData/british-only.js");

const DICTIONARY = {
  BRITISH_TITLES: Object.freeze(Object.values(americanToBritishTitles)),
  AMERICAN_TITLES: Object.freeze(Object.keys(americanToBritishTitles)),
  AM_TO_BRIT_WORDS: Object.freeze({
    ...americanOnly,
    ...americanToBritishSpelling,
  }),
  BRIT_TO_AM_WORDS: Object.freeze({
    ...britishOnly,
    //flipping object keys and values for easier translation-management
    ...Object.fromEntries(
      Object.entries(americanToBritishSpelling).map(([key, value]) => [
        value,
        key,
      ])
    ),
  }),
};

module.exports = DICTIONARY;
