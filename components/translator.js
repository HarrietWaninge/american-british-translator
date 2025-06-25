const { text } = require("body-parser");
const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

const escapeDots = (stringsArray) => {
  return stringsArray.map((word) => {
    return word.replace(/\./gi, "\\.");
  });
};

const BRITISH_TITLES = Object.freeze(Object.values(americanToBritishTitles));
const AMERICAN_TITLES = Object.freeze(Object.keys(americanToBritishTitles));
const AM_TO_BRIT_WORDS = Object.freeze({
  ...americanOnly,
  ...americanToBritishSpelling,
});
const BRIT_TO_AM_WORDS = Object.freeze({
  ...britishOnly,
  //flipping object keys and values for easier translation-management
  ...Object.fromEntries(
    Object.entries(americanToBritishSpelling).map(([key, value]) => [
      value,
      key,
    ])
  ),
});

const REGEXES = Object.freeze({
  AMERICAN_WORDS: new RegExp(
    `\\b(${Object.keys(AM_TO_BRIT_WORDS).join("|")})\\b`,
    "gi"
  ),
  BRITISH_WORDS: new RegExp(
    `\\b(${Object.keys(BRIT_TO_AM_WORDS).join("|")})\\b`,
    "gi"
  ),
  AMERICAN_TITLES: new RegExp(
    `\\b(?<title>${escapeDots(AMERICAN_TITLES).join("|")})(?=[\\s,.]|$)`,
    "gi"
  ),
  BRITISH_TITLES: new RegExp(
    `\\b(?<title>${BRITISH_TITLES.join("|")})(?!\\.)(?=[\\s,]|$)`,
    "gi"
  ),
  AMERICAN_TIME: new RegExp("(?<hours>\\d?\\d):(?<minutes>\\d{2})", "g"),
  BRITISH_TIME: new RegExp("(?<hours>\\d?\\d)\\.(?<minutes>\\d{2})", "g"),
});

const translationRules = [
  {
    regex: REGEXES.AMERICAN_WORDS,
    replaceRegex: REGEXES.AMERICAN_WORDS,
    replaceWith: (match) => {
      let lowerCase = match.toLowerCase();
      return AM_TO_BRIT_WORDS[lowerCase];
    },
  },
  {
    regex: REGEXES.BRITISH_WORDS,
    replaceRegex: REGEXES.BRITISH_WORDS,
    replaceWith: (match) => {
      let lowerCase = match.toLowerCase();
      return BRIT_TO_AM_WORDS[lowerCase];
    },
  },
  {
    regex: REGEXES.AMERICAN_TITLES,
    replaceRegex: /\./,
    replaceWith: "",
  },
  {
    regex: REGEXES.BRITISH_TITLES,
    replaceRegex: REGEXES.BRITISH_TITLES,
    replaceWith: "$<title>.",
  },
  {
    regex: REGEXES.AMERICAN_TIME,
    replaceRegex: REGEXES.AMERICAN_TIME,
    replaceWith: "$<hours>.$<minutes>",
  },
  {
    regex: REGEXES.BRITISH_TIME,
    replaceRegex: REGEXES.BRITISH_TIME,
    replaceWith: "$<hours>:$<minutes>",
  },
];

const LOCALES = Object.freeze({
  BRITISH_TO_AMERICAN: "british-to-american",
  AMERICAN_TO_BRITISH: "american-to-british",
});

class Translator {
  translate(textString, locale) {
    console.log("The test-sentence is:", textString);
    let allSuspectsObject = this.findAllSuspects(textString);
    // console.log("ALLSUSPS", allSuspectsObject);
    let translationObject = this.getTranslationObject(
      allSuspectsObject,
      locale
    );
    console.log("TRANSLATEDWORDS:", translationObject);
    this.buildTranslationReturn(textString, locale);
    return "We watched the soccer match for a while.";
  }

  buildTranslationReturn(textString, locale) {}

  findAllSuspects(textString) {
    // get all american out of sentence
    let americanTime = textString.match(REGEXES.AMERICAN_TIME) ?? [];
    let americanTitles = textString.match(REGEXES.AMERICAN_TITLES) ?? [];
    let americanWordsPhrases = textString.match(REGEXES.AMERICAN_WORDS) ?? [];
    // get all british out of sentence
    let britishTime = textString.match(REGEXES.BRITISH_TIME) ?? [];
    let britishTitles = textString.match(REGEXES.BRITISH_TITLES) ?? [];
    let britishWordsPhrases = textString.match(REGEXES.BRITISH_WORDS) ?? [];

    let allSuspectsObject = {
      american: { americanTime, americanTitles, americanWordsPhrases },
      british: { britishTime, britishTitles, britishWordsPhrases },
    };
    return allSuspectsObject;
  }
  getTranslationObject(allSuspectsObject, locale) {
    let translationObject = this.splitLocale(allSuspectsObject, locale);

    return translationObject;
  }

  splitLocale(wordsObject, locale) {
    let translationObject = {
      toBeTranslated: { words: [], translations: [] },
      alreadyGreat: [],
    };
    if (locale == LOCALES.AMERICAN_TO_BRITISH) {
      translationObject = this.translateAmerican(
        wordsObject,
        translationObject
      );
    } else if (locale == LOCALES.BRITISH_TO_AMERICAN) {
      translationObject = this.translateBritish(wordsObject, translationObject);
    }

    return translationObject;
  }

  replace(regex, replacePattern, originalText) {
    return originalText.replace(regex, replacePattern);
  }

  translateAmerican(wordsObject, translationObject) {
    let { americanTime, americanTitles, americanWordsPhrases } =
      wordsObject.american;
    for (let i = 0; i < americanTime.length; i++) {
      translationObject = this.pushWordAndTranslationToArray(
        americanTime[i],
        translationObject,
        this.translateAmericanTime
      );
    }
    for (let i = 0; i < americanTitles.length; i++) {
      translationObject = this.pushWordAndTranslationToArray(
        americanTitles[i],
        translationObject,
        this.translateAmericanTitles
      );
    }
    for (let i = 0; i < americanWordsPhrases.length; i++) {
      translationObject = this.pushWordAndTranslationToArray(
        americanWordsPhrases[i],
        translationObject,
        this.translateWordsPhrases
      );
    }
    return translationObject;
  }

  /// this is all the same, there should be a lambda possibility here.
  // for britishTime, titles and phrases
  translateBritish(wordsObject, translationObject) {
    console.log("TRANSLATE british:", wordsObject, translationObject);
    let { britishTime, britishTitles, britishWordsPhrases } =
      wordsObject.british;
    //locale = american to british, find translations for wordsObject.american
    for (let i = 0; i < britishTime.length; i++) {
      translationObject = this.pushWordAndTranslationToArray(
        britishTime[i],
        translationObject,
        this.translateBritishTime
      );
    }
    for (let i = 0; i < britishTitles.length; i++) {
      translationObject = this.pushWordAndTranslationToArray(
        britishTitles[i],
        translationObject,
        this.translateBritishTitles
      );
    }
    for (let i = 0; i < britishWordsPhrases.length; i++) {
      translationObject = this.pushWordAndTranslationToArray(
        britishWordsPhrases[i],
        translationObject,
        this.translateWordsPhrases
      );
    }
    return translationObject;
  }
  pushWordAndTranslationToArray(
    toBeTranslated,
    translationObject,
    translationFunction
  ) {
    translationObject.toBeTranslated.translations.push(
      translationFunction(toBeTranslated)
    );
    translationObject.toBeTranslated.words.push(toBeTranslated);

    return translationObject;
  }

  translateAmericanTime(time) {
    return time.replace(REGEXES.AMERICAN_TIME, "$<hours>.$<minutes>");
  }
  translateAmericanTitles(title) {
    return title.replace(/\./, "");
  }

  translateWordsPhrases(wordPhrase) {
    //can I do this in a replace.

    return wordPhrase.replace(REGEXES.AMERICAN_WORDS, (match) => {
      let lowerCase = match.toLowerCase();
      return AM_TO_BRIT_WORDS[lowerCase];
    });
    let lowerCaseToBeTranslated = wordPhrase.toLowerCase();

    /// regex would be....

    let translation = dictionary[lowerCaseToBeTranslated];
    return translation;
  }

  translateBritishTime(time) {
    return time.replace(REGEXES.BRITISH_TIME, "$<hours>:$<minutes>");
  }
  translateBritishTitles(title) {
    return title.replace(REGEXES.BRITISH_TITLES, "$<title>.");
  }

  escapeDots(stringsArray) {
    for (let i = 0; i < stringsArray.length; i++) {
      if (stringsArray[i].includes(".")) {
        let escapedWord = stringsArray[i].split(/(?=\.)/).join("\\");
        stringsArray[i] = escapedWord;
      }
    }
    return stringsArray;
  }
}

module.exports = Translator;
