const LOCALES = require("./constants.js");
const DICTIONARY = require("./dictionary.js");
const REGEXES = require("./Regex.js");

const translationRules = [
  {
    locale: LOCALES.AMERICAN_TO_BRITISH,
    regex: REGEXES.AMERICAN_WORDS,
    replaceRegex: REGEXES.AMERICAN_WORDS,
    replaceWith: (match) => {
      let lowerCase = match.toLowerCase();
      return DICTIONARY.AM_TO_BRIT_WORDS[lowerCase];
    },
  },
  {
    locale: LOCALES.BRITISH_TO_AMERICAN,
    regex: REGEXES.BRITISH_WORDS,
    replaceRegex: REGEXES.BRITISH_WORDS,
    replaceWith: (match) => {
      let lowerCase = match.toLowerCase();
      return DICTIONARY.BRIT_TO_AM_WORDS[lowerCase];
    },
  },
  {
    locale: LOCALES.AMERICAN_TO_BRITISH,
    regex: REGEXES.AMERICAN_TITLES,
    replaceRegex: /\./,
    replaceWith: "",
  },
  {
    locale: LOCALES.BRITISH_TO_AMERICAN,
    regex: REGEXES.BRITISH_TITLES,
    replaceRegex: REGEXES.BRITISH_TITLES,
    replaceWith: "$<title>.",
  },
  {
    locale: LOCALES.AMERICAN_TO_BRITISH,
    regex: REGEXES.AMERICAN_TIME,
    replaceRegex: REGEXES.AMERICAN_TIME,
    replaceWith: "$<hours>.$<minutes>",
  },
  {
    locale: LOCALES.BRITISH_TO_AMERICAN,
    regex: REGEXES.BRITISH_TIME,
    replaceRegex: REGEXES.BRITISH_TIME,
    replaceWith: "$<hours>:$<minutes>",
  },
];
module.exports = translationRules;
