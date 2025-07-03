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
  suite("Higlight translation tests", function () {
    let browser, page;
    suiteSetup(async function () {
      browser = await puppeteer.launch();
      page = await browser.newPage();
      page.setDefaultTimeout(10000);
      page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    });

    test(`should highlight translation for sentence`, async function () {
      let highlightSpans, spanTexts;
      try {
        //wait for everything to load
        await Promise.all([
          page.waitForSelector("#text-input"),
          page.waitForSelector("#locale-select"),
          page.waitForSelector("#translate-btn"),
        ]);
        // type in field, select locale, and click on translate button
        await page.type("#text-input", testSentencesAmericanToBritish[0]);
        await page.select("#locale-select", "american-to-british");
        await page.click("#translate-btn");

        //wait for response and get check if there are highlight spans
        await page.waitForSelector("#translated-sentence");
        highlightSpans = await page.$$("#translated-sentence span.highlight"); //get spans texts
        spanTexts = await Promise.all(
          highlightSpans.map((span) => span.evaluate((el) => el.textContent))
        );

        console.log("🟢 Test completed!", highlightSpans, spanTexts);
      } catch (error) {
        console.log("🔴 Error:", error.message);
        throw error;
      }

      chai.assert.isAbove(highlightSpans.length, 0);
      chai.assert.deepEqual(spanTexts, ["favourite"]);
    });
  });
});
//});

/*
Highlight translation in Mangoes are my favorite fruit.
Highlight translation in I ate yogurt for breakfast.
Highlight translation in We watched the footie match for a while.
Highlight translation in Paracetamol takes up to an hour to work.
*/
