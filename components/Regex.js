const DICTIONARY = require("./dictionary");

//helperfunction to regexify the dots in american titles
const escapeDots = (stringsArray) => {
  return stringsArray.map((word) => {
    return word.replace(/\./gi, "\\.");
  });
};

const REGEXES = Object.freeze({
  AMERICAN_WORDS: new RegExp(
    `\\b(${Object.keys(DICTIONARY.AM_TO_BRIT_WORDS).join("|")})\\b`,
    "gi"
  ),
  BRITISH_WORDS: new RegExp(
    `\\b(${Object.keys(DICTIONARY.BRIT_TO_AM_WORDS).join("|")})\\b`,
    "gi"
  ),
  AMERICAN_TITLES: new RegExp(
    `\\b(?<title>${escapeDots(DICTIONARY.AMERICAN_TITLES).join(
      "|"
    )})(?=[\\s,.]|$)`,
    "gi"
  ),
  BRITISH_TITLES: new RegExp(
    `\\b(?<title>${DICTIONARY.BRITISH_TITLES.join("|")})(?!\\.)(?=[\\s,]|$)`,
    "gi"
  ),
  AMERICAN_TIME: new RegExp("(?<hours>\\d?\\d):(?<minutes>\\d{2})", "g"),
  BRITISH_TIME: new RegExp("(?<hours>\\d?\\d)\\.(?<minutes>\\d{2})", "g"),
});

module.exports = REGEXES;
