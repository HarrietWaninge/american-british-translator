const chai = require("chai");
const assert = chai.assert;

const Translator = require("../components/translator.js");
const translator = new Translator();

const {
  testSentencesBritishToAmerican,
  testSentencesAmericanToBritish,
  testSentencesAmericanTranslations,
  testSentencesBritishTranslations,
} = require("./testingData.js");
const LOCALES = require("../components/constants.js");

suite("Unit Tests", () => {
  test("Sentence Translation Test", (done) => {
    console.log("Brit -> Am");
    for (let i = 0; i < testSentencesBritishToAmerican.length; i++) {
      assert.equal(
        translator.translate(
          testSentencesBritishToAmerican[i],
          LOCALES.BRITISH_TO_AMERICAN
        ).translation,
        testSentencesAmericanTranslations[i]
      );
    }
    console.log("Am -> Brit");

    for (let i = 0; i < testSentencesAmericanToBritish.length; i++) {
      assert.equal(
        translator.translate(
          testSentencesAmericanToBritish[i],
          LOCALES.AMERICAN_TO_BRITISH
        ).translation,
        testSentencesBritishTranslations[i]
      );
    }
    done();
  });
  test("Highligt translation tests", function (done) {});
});

/*
Highlight translation in Mangoes are my favorite fruit.
Highlight translation in I ate yogurt for breakfast.
Highlight translation in We watched the footie match for a while.
Highlight translation in Paracetamol takes up to an hour to work.
*/
