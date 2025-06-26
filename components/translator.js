const { text } = require("body-parser");
const translationRules = require("./translation-rules");

class Translator {
  translate(textString, locale) {
    let suspects = this.findSuspects(textString);
    let translationObject = this.getTranslationObject(suspects, locale);
    let response = this.buildTranslationReturn(textString, translationObject);
    return response;
  }

  findSuspects(textString) {
    let allSuspects = [];
    // push all words that match a Regex in an array
    translationRules.map((rule) => {
      let matches = textString.match(rule.regex);
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

  buildTranslationReturn(textString, translationObject) {
    //for clarity
    let { toBeTranslated, alreadyGreat } = translationObject;
    let result;

    //if there is nothing to translate
    if (toBeTranslated.words.length == 0) {
      //if there is something in 'already great'
      if (alreadyGreat.length > 0) {
        result = "Everything looks fine to me!";
      }
      // if there aren't words in both lists
      else {
        result = "Nothing to translate";
      }
    }
    // if there is something to be translated
    else {
      for (let i = 0; i < toBeTranslated.words.length; i++) {
        textString = textString.replace(
          toBeTranslated.words[i],
          toBeTranslated.translations[i]
        );
      }
      result = textString;
    }
    return result;
  }
}

module.exports = Translator;
