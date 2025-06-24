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

suite("Unit Tests", () => {
  suite("Post", () => {
    test("blob", (done) => {
      console.log("Brit -> Am");
      for (let i = 0; i < testSentencesBritishToAmerican.length; i++) {
        translator.translate(
          testSentencesBritishToAmerican[i],
          "british-to-american"
        );
        // assert.equal(
        //   translator.translate(testSentencesBritishToAmerican[i]),
        //   testSentencesAmericanTranslations[i]
        // );
      }
      console.log("Am -> Brit");

      for (let i = 0; i < testSentencesAmericanToBritish.length; i++) {
        translator.translate(
          testSentencesAmericanToBritish[i],
          "american-to-british"
        );
        // assert.equal(
        //   translator.translate(testSentencesBritishToAmerican[i]),
        //   testSentencesAmericanTranslations[i]
        // );
      }
      done();
    });
  });
});
