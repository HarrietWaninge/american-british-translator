const { text } = require("body-parser");
const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

class Translator {
  constructor() {
    this.locale = ["british-to-american", "american-to-british"];
    // make word/phases regex
    let americanRegexBits = Object.keys(americanOnly).concat(
      Object.keys(americanToBritishSpelling)
    );
    let britishRegexBits = this.escapeDots(
      Object.keys(britishOnly).concat(Object.values(americanToBritishSpelling))
    );

    this.americanWordsRegex = new RegExp(
      `\\b(${americanRegexBits.join("|")})\\b`,
      "gi"
    );
    this.britishWordsRegex = new RegExp(
      `\\b(${britishRegexBits.join("|")})\\b`,
      "gi"
    );

    //make titles regex
    let britishTitles = Object.values(americanToBritishTitles);
    let americanTitles = Object.keys(americanToBritishTitles);

    this.britishTitlesRegex = new RegExp(
      `\\b(?<title>${britishTitles.join("|")})(?!\\.)(?=[\\s,]|$)`,
      "gi"
    );
    this.americanTitlesRegex = new RegExp(
      `\\b(?<title>${this.escapeDots(americanTitles).join("|")})(?=[\\s,.]|$)`,
      "gi"
    );

    //make time rexex
    this.britishTimeRegex = new RegExp(
      "(?<hours>\\d?\\d)\\.(?<minutes>\\d{2})",
      "g"
    );
    this.americanTimeRegex = new RegExp(
      "(?<hours>\\d?\\d):(?<minutes>\\d{2})",
      "g"
    );
  }

  translate(textString, locale) {
    this.buildTranslationReturn(textString, locale);
    return "We watched the soccer match for a while.";
  }

  buildTranslationReturn(textString, locale) {
    let translatedWords = this.getTranslations(
      textString,
      "american-to-british"
    );
  }

  findToBeTranslated(textString, locale) {
    let translationObject;
    // get all american
    let americanTime = textString.match(this.americanTimeRegex) ?? [];
    let americanTitles = textString.match(this.americanTitlesRegex) ?? [];
    let americanWordsPhrases = textString.match(this.americanWordsRegex) ?? [];
    // get all british
    let britishTime = textString.match(this.britishTimeRegex) ?? [];
    let britishTitles = textString.match(this.britishTitlesRegex) ?? [];
    let britishWordsPhrases = textString.match(this.britishWordsRegex) ?? [];

    let obj = {
      american: { americanTime, americanTitles, americanWordsPhrases },
      british: { britishTime, britishTitles, britishWordsPhrases },
    };
    console.log("IN FIND TO BE", obj);
    translationObject = this.useLocale(obj, locale);

    return translationObject;
  }

  useLocale(wordsObject, locale) {
    console.log("IN USE LOC");
    let translationObject = {
      toBeTranslated: { words: [], translations: [] },
      alreadyGreat: [],
    };
    let { americanTime, americanTitles, americanWordsPhrases } =
      wordsObject.american;
    if (locale == this.locale[1]) {
      //locale = american to british, find translations for wordsObject.american
      for (let i = 0; i < americanTime.length; i++) {
        translationObject.toBeTranslated.translations.push(
          this.translateAmericanTime(americanTime[i])
        );
      }
      for (let i = 0; i < americanTitles.length; i++) {
        translationObject.toBeTranslated.translations.push(
          this.translateAmericanTitles(americanTitles[i])
        );
      }
      for (let i = 0; i < americanWordsPhrases.length; i++) {
        translationObject.toBeTranslated.translations.push(
          this.translateAmericanWordsPhrases(americanWordsPhrases[i])
        );
      }
      console.log("TRANSL:", translationObject.toBeTranslated.translations);
    }
    // i'll have to translate here.

    return translationObject;
  }

  translateAmericanTime(time) {
    return time.replace(this.americanTimeRegex, "$<hours>.$<minutes>");
  }
  translateAmericanTitles(title) {
    return title.replace(".", "");
  }

  translateAmericanWordsPhrases() {}

  getTranslations(textString, locale) {
    let translation;

    let allSuspects = this.findToBeTranslated(textString, locale);
    if (allSuspects.toBeTranslated.length == 0) {
      //no words to translate
      if (allSuspects.alreadyGreat.length > 0) {
        // if there are any words of the to be translated to locale
        return { text: "Everything looks good to me!" };
      } else {
        // no words found at all
        return { text: textString };
      }
    } else {
      for (let i = 0; i < allSuspects.toBeTranslated.length; i++) {
        //mijn probleem: de titles hoofdletters don't translate. stelletje fuckers. they did this on purpose. they knew this.
        let lowerCaseToBeTranslated =
          allSuspects.toBeTranslated[i].toLowerCase();
        console.log("LC", lowerCaseToBeTranslated);
        if (lowerCaseToBeTranslated.matchAll(this.americanTimeRegex)) {
          //handle american time
          translation = lowerCaseToBeTranslated.replace(
            this.americanTimeRegex,
            "$<hours>.$<minutes>"
          );
        } else if (lowerCaseAmerican.match(this.americanTitlesRegex)) {
          console.log("HOP!", lowerCaseToBeTranslated);
        } else {
          translation =
            americanOnly[lowerCaseToBeTranslated] ||
            americanToBritishSpelling[lowerCaseToBeTranslated] ||
            americanToBritishTitles[lowerCaseToBeTranslated];
        }

        console.log(
          "american:",
          allSuspects.toBeTranslated[i],
          "british:",
          translation
        );
      }
    }
    if (locale == this.locale[1]) {
      // american-to-british, find translations of american words
    }
  }

  translateTime(textString) {
    return time;
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
