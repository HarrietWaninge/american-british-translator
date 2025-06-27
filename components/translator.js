const LOCALES = require("./constants");
const translationRules = require("./translation-rules");

class Translator {
  translate(text, locale) {
    console.log(text);
    let inputError = this.checkInput(text, locale);
    if (inputError.error) return inputError;

    let suspects = this.findSuspects(text);
    // console.log("susp:", suspects);
    let translationObject = this.getTranslationObject(suspects, locale);
    //console.log("translObj", translationObject);
    let response = this.buildTranslationReturn(text, translationObject);
    // console.log("resp:", response);
    return response;
  }

  checkInput(text, locale) {
    if (
      text === null ||
      text === undefined ||
      locale === null ||
      locale === undefined
    )
      return { error: "Required field(s) missing" };

    if (
      locale !== LOCALES.AMERICAN_TO_BRITISH &&
      locale !== LOCALES.BRITISH_TO_AMERICAN
    ) {
      return { error: "Invalid value for locale field" };
    }
    if (text == "" || !text) {
      return { error: "No text to translate" };
    } else {
      return { error: null };
    }
  }

  findSuspects(text) {
    let allSuspects = [];
    // push all words that match a Regex in an array with the structure { word, rule }
    translationRules.map((rule) => {
      let matches = text.match(rule.regex);
      if (matches) {
        allSuspects.push(
          ...matches.map((match) => {
            return { word: match, rule };
          })
        );
      }
    });
    return allSuspects;
  }

  getTranslationObject(suspects, locale) {
    // find translations for words, and strucure them like this:
    let translationObject = {
      toBeTranslated: { words: [], translations: [] },
      alreadyGreat: [],
    };

    suspects.map((wordObject) => {
      let { word, rule } = wordObject;
      if (locale === rule.locale) {
        translationObject.toBeTranslated.words.push(wordObject.word);
        translationObject.toBeTranslated.translations.push(
          wordObject.word.replace(rule.replaceRegex, rule.replaceWith)
        );
      } else {
        translationObject.alreadyGreat.push(word);
      }
    });
    return translationObject;
  }

  buildTranslationReturn(text, translationObject) {
    //for clarity
    //  console.log("FINAL TRANSLOBJ", translationObject);
    let { toBeTranslated, alreadyGreat } = translationObject;
    let result = { text, translation: "" };
    let translation = text;
    //if there is nothing to translate
    if (toBeTranslated.words.length == 0) {
      //   //if there is something in 'already great'
      //   if (alreadyGreat.length > 0) {
      //     result.translation = "Everything looks good to me!";
      //   }
      //   // if there aren't words in both lists
      //   else {
      result.translation = "Everything looks good to me!";
      //   }
    }
    // if there is something to be translated
    else {
      for (let i = 0; i < toBeTranslated.words.length; i++) {
        translation = translation.replace(
          toBeTranslated.words[i],
          toBeTranslated.translations[i]
        );
      }
      result.translation = translation;
    }
    console.log("RESULT:", result);
    return result;
  }
}

module.exports = Translator;
