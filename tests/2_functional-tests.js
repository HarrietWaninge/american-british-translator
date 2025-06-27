const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server.js");

const {
  testSentencesBritishToAmerican,
  testSentencesAmericanToBritish,
  testSentencesAmericanTranslations,
  testSentencesBritishTranslations,
} = require("./testingData.js");

chai.use(chaiHttp);

let Translator = require("../components/translator.js");
const LOCALES = require("../components/constants.js");

suite("Functional Tests", () => {
  suite("Post Tests", () => {
    test("Translation with text and locale fields: POST request to /api/translate", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/translate")
        .type("form")
        .send({
          text: testSentencesAmericanToBritish[0],
          locale: LOCALES.AMERICAN_TO_BRITISH,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.text, testSentencesAmericanToBritish[0]);
          assert.equal(
            res.body.translation,
            testSentencesBritishTranslations[0]
          );
          done(err);
        });
    });
    test("Translation with text and invalid locale field: POST request to /api/translate", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/translate")
        .type("form")
        .send({
          text: testSentencesAmericanToBritish[0],
          locale: LOCALES.AMERICAN_TO_BRITISH + ".",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "Invalid value for locale field",
          });
          done(err);
        });
    });
    test("Translation with missing text field: POST request to /api/translate", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/translate")
        .type("form")
        .send({
          locale: LOCALES.AMERICAN_TO_BRITISH,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Required field(s) missing" });
          done(err);
        });
    });
    test("Translation with missing locale field: POST request to /api/translate", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/translate")
        .type("form")
        .send({
          text: testSentencesAmericanToBritish[0],
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Required field(s) missing" });
          done(err);
        });
    });
    test("Translation with empty text: POST request to /api/translate", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/translate")
        .type("form")
        .send({
          text: "",
          locale: LOCALES.AMERICAN_TO_BRITISH,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "No text to translate" });
          done(err);
        });
    });
    test("Translation with text that needs no translation: POST request to /api/translate", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/translate")
        .type("form")
        .send({
          text: testSentencesAmericanToBritish[0],
          locale: LOCALES.BRITISH_TO_AMERICAN,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(
            res.body.translation,
            "Everything looks good to me!"
          );
          done(err);
        });
    });
  });
});

/*

 */
