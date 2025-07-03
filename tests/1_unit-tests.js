const chai = require("chai");
const assert = chai.assert;
require("@babel/polyfill");

const puppeteer = require("puppeteer");

const Translator = require("../components/translator.js");
const translator = new Translator();

const {
  testSentencesBritishToAmerican,
  testSentencesAmericanToBritish,
  testSentencesAmericanTranslations,
  testSentencesBritishTranslations,
  spanTranslations,
  spanTestSentences,
} = require("./testingData.js");
const LOCALES = require("../components/constants.js");

suite("Unit Tests", () => {
  for (
    let i = 0;
    i <
    testSentencesAmericanToBritish.length +
      testSentencesBritishToAmerican.length;
    i++
  ) {
    if (i < testSentencesAmericanToBritish.length) {
      test(`Translate ${testSentencesBritishToAmerican[i]} to British English`, (done) => {
        assert.equal(
          translator.translate(
            testSentencesBritishToAmerican[i],
            LOCALES.BRITISH_TO_AMERICAN
          ).translation,
          testSentencesAmericanTranslations[i]
        );
        done();
      });
    } else {
      let j = i - testSentencesAmericanToBritish.length;

      test(`Translate ${testSentencesAmericanToBritish[j]} to American English`, (done) => {
        assert.equal(
          translator.translate(
            testSentencesAmericanToBritish[j],
            LOCALES.AMERICAN_TO_BRITISH
          ).translation,
          testSentencesBritishTranslations[j]
        );
        done();
      });
    }
  }
  suite("Higlight translation tests", function () {
    let browser, page;
    suiteSetup(async function () {
      browser = await puppeteer.launch();
      page = await browser.newPage();
      page.setDefaultTimeout(10000);
      await page.goto("http://localhost:3000", {
        waitUntil: "domcontentloaded",
      });
    });
    for (let i = 0; i < 4; i++) {
      test(`Highlight transition in ${spanTestSentences[i]}`, async function () {
        let highlightSpans, spanTexts;
        try {
          let locale;
          if (i < 2) {
            locale = LOCALES.AMERICAN_TO_BRITISH;
          } else {
            locale = LOCALES.BRITISH_TO_AMERICAN;
          }
          //wait for everything to load
          await Promise.all([
            page.waitForSelector("#text-input"),
            page.waitForSelector("#locale-select"),
            page.waitForSelector("#translate-btn"),
          ]);

          await page.evaluate(() => {
            document.querySelector("#text-input").value = "";
          });

          await page.type("#text-input", spanTestSentences[i]);
          await page.select("#locale-select", locale);
          await page.click("#translate-btn");

          //wait for response and get check if there are highlight spans
          await page.waitForSelector("#translated-sentence");
          await page.waitForFunction(() => {
            const element = document.querySelector("#translated-sentence");
            return element && element.textContent.trim().length > 0;
          });

          highlightSpans = await page.$$("#translated-sentence span.highlight"); //get spans texts
          spanTexts = await Promise.all(
            highlightSpans.map((span) => span.evaluate((el) => el.textContent))
          );
        } catch (error) {
          console.log("Error:", error.message);
          throw error;
        }

        chai.assert.isAbove(highlightSpans.length, 0);
        chai.assert.deepEqual(spanTexts, spanTranslations[i]);
      });
    }
  });
});
