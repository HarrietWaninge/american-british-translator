// const chai = require("chai");
// const assert = chai.assert;
// require("@babel/polyfill");

// const puppeteer = require("puppeteer");

// const Translator = require("../components/translator.js");
// const translator = new Translator();

// const {
//   testSentencesBritishToAmerican,
//   testSentencesAmericanToBritish,
//   testSentencesAmericanTranslations,
//   testSentencesBritishTranslations,
//   spanTranslations,
//   spanTestSentences,
// } = require("./testingData.js");
// const LOCALES = require("../components/constants.js");

// suite("Unit Tests", () => {
//   for (
//     let i = 0;
//     i <
//     testSentencesAmericanToBritish.length +
//       testSentencesBritishToAmerican.length;
//     i++
//   ) {
//     if (i < testSentencesAmericanToBritish.length) {
//       test(`Translate ${testSentencesBritishToAmerican[i]} to British English`, (done) => {
//         assert.equal(
//           translator.translate(
//             testSentencesBritishToAmerican[i],
//             LOCALES.BRITISH_TO_AMERICAN
//           ).translation,
//           testSentencesAmericanTranslations[i]
//         );
//         done();
//       });
//     } else {
//       let j = i - testSentencesAmericanToBritish.length;

//       test(`Translate ${testSentencesAmericanToBritish[j]} to American English`, (done) => {
//         assert.equal(
//           translator.translate(
//             testSentencesAmericanToBritish[j],
//             LOCALES.AMERICAN_TO_BRITISH
//           ).translation,
//           testSentencesBritishTranslations[j]
//         );
//         done();
//       });
//     }
//   }
//   suite("Higlight translation tests", function () {
//     let browser, page;
//     suiteSetup(async function () {
//       browser = await puppeteer.launch();
//       page = await browser.newPage();
//       page.setDefaultTimeout(10000);
//       await page.goto("http://localhost:3000", {
//         waitUntil: "domcontentloaded",
//       });
//     });
//     for (let i = 0; i < 4; i++) {
//       test(`Highlight transition in ${spanTestSentences[i]}`, async function () {
//         let highlightSpans, spanTexts;
//         try {
//           let locale;
//           if (i < 2) {
//             locale = LOCALES.AMERICAN_TO_BRITISH;
//           } else {
//             locale = LOCALES.BRITISH_TO_AMERICAN;
//           }
//           //wait for everything to load
//           await Promise.all([
//             page.waitForSelector("#text-input"),
//             page.waitForSelector("#locale-select"),
//             page.waitForSelector("#translate-btn"),
//           ]);

//           await page.evaluate(() => {
//             document.querySelector("#text-input").value = "";
//           });

//           await page.type("#text-input", spanTestSentences[i]);
//           await page.select("#locale-select", locale);
//           await page.click("#translate-btn");

//           //wait for response and get check if there are highlight spans
//           await page.waitForSelector("#translated-sentence");
//           await page.waitForFunction(() => {
//             const element = document.querySelector("#translated-sentence");
//             return element && element.textContent.trim().length > 0;
//           });

//           highlightSpans = await page.$$("#translated-sentence span.highlight"); //get spans texts
//           spanTexts = await Promise.all(
//             highlightSpans.map((span) => span.evaluate((el) => el.textContent))
//           );
//         } catch (error) {
//           console.log("Error:", error.message);
//           throw error;
//         }

//         chai.assert.isAbove(highlightSpans.length, 0);
//         chai.assert.deepEqual(spanTexts, spanTranslations[i]);
//       });
//     }
//   });
// });
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
  suite("American to British English", () => {
    test("Translate Mangoes are my favorite fruit. to British English", (done) => {
      assert.equal(
        translator.translate(
          "Mangoes are my favorite fruit.",
          LOCALES.AMERICAN_TO_BRITISH
        ).translation,
        'Mangoes are my <span class="highlight">favourite</span> fruit.'
      );
      done();
    });

    test("Translate I ate yogurt for breakfast. to British English", (done) => {
      assert.equal(
        translator.translate(
          "I ate yogurt for breakfast.",
          LOCALES.AMERICAN_TO_BRITISH
        ).translation,
        'I ate <span class="highlight">yoghurt</span> for breakfast.'
      );
      done();
    });

    test("Translate We had a party at my friend's condo. to British English", (done) => {
      assert.equal(
        translator.translate(
          "We had a party at my friend's condo.",
          LOCALES.AMERICAN_TO_BRITISH
        ).translation,
        `We had a party at my friend's <span class="highlight">flat</span>.`
      );
      done();
    });

    test("Translate Can you toss this in the trashcan for me? to British English", (done) => {
      assert.equal(
        translator.translate(
          "Can you toss this in the trashcan for me?",
          LOCALES.AMERICAN_TO_BRITISH
        ).translation,
        `Can you toss this in the <span class="highlight">bin</span> for me?`
      );
      done();
    });

    test("Translate The parking lot was full. to British English", (done) => {
      assert.equal(
        translator.translate(
          "The parking lot was full.",
          LOCALES.AMERICAN_TO_BRITISH
        ).translation,
        `The <span class="highlight">car park</span> was full.`
      );
      done();
    });

    test("Translate Like a high tech Rube Goldberg machine. to British English", (done) => {
      assert.equal(
        translator.translate(
          "Like a high tech Rube Goldberg machine.",
          LOCALES.AMERICAN_TO_BRITISH
        ).translation,
        `Like a high tech <span class="highlight">Heath Robinson device</span>.`
      );
      done();
    });

    test("Translate To play hooky means to skip class or work. to British English", (done) => {
      assert.equal(
        translator.translate(
          "To play hooky means to skip class or work.",
          LOCALES.AMERICAN_TO_BRITISH
        ).translation,
        `To <span class="highlight">bunk off</span> means to skip class or work.`
      );
      done();
    });

    test("Translate No Mr. Bond, I expect you to die. to British English", (done) => {
      assert.equal(
        translator.translate(
          "No Mr. Bond, I expect you to die.",
          LOCALES.AMERICAN_TO_BRITISH
        ).translation,
        `No <span class="highlight">Mr</span> Bond, I expect you to die.`
      );
      done();
    });

    test("Translate Dr. Grosh will see you now. to British English", (done) => {
      assert.equal(
        translator.translate(
          "Dr. Grosh will see you now.",
          LOCALES.AMERICAN_TO_BRITISH
        ).translation,
        `<span class="highlight">Dr</span> Grosh will see you now.`
      );
      done();
    });

    test("Translate Lunch is at 12:15 today. to British English", (done) => {
      assert.equal(
        translator.translate(
          "Lunch is at 12:15 today.",
          LOCALES.AMERICAN_TO_BRITISH
        ).translation,
        `Lunch is at <span class="highlight">12.15</span> today.`
      );
      done();
    });
  });

  suite("British to American English", () => {
    test("Translate We watched the footie match for a while. to American English", (done) => {
      assert.equal(
        translator.translate(
          "We watched the footie match for a while.",
          LOCALES.BRITISH_TO_AMERICAN
        ).translation,
        `We watched the <span class="highlight">soccer</span> match for a while.`
      );
      done();
    });

    test("Translate Paracetamol takes up to an hour to work. to American English", (done) => {
      assert.equal(
        translator.translate(
          "Paracetamol takes up to an hour to work.",
          LOCALES.BRITISH_TO_AMERICAN
        ).translation,
        `<span class="highlight">Tylenol</span> takes up to an hour to work.`
      );
      done();
    });

    test("Translate First, caramelise the onions. to American English", (done) => {
      assert.equal(
        translator.translate(
          "First, caramelise the onions.",
          LOCALES.BRITISH_TO_AMERICAN
        ).translation,
        `First, <span class="highlight">caramelize</span> the onions.`
      );
      done();
    });

    test("Translate I spent the bank holiday at the funfair. to American English", (done) => {
      assert.equal(
        translator.translate(
          "I spent the bank holiday at the funfair.",
          LOCALES.BRITISH_TO_AMERICAN
        ).translation,
        `I spent the <span class="highlight">public holiday</span> at the <span class="highlight">carnival</span>.`
      );
      done();
    });

    test("Translate I had a bicky then went to the chippy. to American English", (done) => {
      assert.equal(
        translator.translate(
          "I had a bicky then went to the chippy.",
          LOCALES.BRITISH_TO_AMERICAN
        ).translation,
        `I had a <span class="highlight">cookie</span> then went to the <span class="highlight">fish-and-chip shop</span>.`
      );
      done();
    });

    test("Translate I've just got bits and bobs in my bum bag. to American English", (done) => {
      assert.equal(
        translator.translate(
          "I've just got bits and bobs in my bum bag.",
          LOCALES.BRITISH_TO_AMERICAN
        ).translation,
        `I've just got <span class="highlight">odds and ends</span> in my <span class="highlight">fanny pack</span>.`
      );
      done();
    });

    test("Translate The car boot sale at Boxted Airfield was called off. to American English", (done) => {
      assert.equal(
        translator.translate(
          "The car boot sale at Boxted Airfield was called off.",
          LOCALES.BRITISH_TO_AMERICAN
        ).translation,
        `The <span class="highlight">swap meet</span> at Boxted Airfield was called off.`
      );
      done();
    });

    test("Translate Have you met Mrs Kalyani? to American English", (done) => {
      assert.equal(
        translator.translate(
          "Have you met Mrs Kalyani?",
          LOCALES.BRITISH_TO_AMERICAN
        ).translation,
        `Have you met <span class="highlight">Mrs.</span> Kalyani?`
      );
      done();
    });

    test("Translate Prof Joyner of King's College, London. to American English", (done) => {
      assert.equal(
        translator.translate(
          "Prof Joyner of King's College, London.",
          LOCALES.BRITISH_TO_AMERICAN
        ).translation,
        `<span class="highlight">Prof.</span> Joyner of King's College, London.`
      );
      done();
    });

    test("Translate Tea time is usually around 4 or 4.30. to American English", (done) => {
      assert.equal(
        translator.translate(
          "Tea time is usually around 4 or 4.30.",
          LOCALES.BRITISH_TO_AMERICAN
        ).translation,
        `Tea time is usually around 4 or <span class="highlight">4:30</span>.`
      );
      done();
    });
  });

  suite("Highlight translation tests", () => {
    test("Highlight translation in Mangoes are my favorite fruit.", (done) => {
      const result = translator.translate(
        "Mangoes are my favorite fruit.",
        LOCALES.AMERICAN_TO_BRITISH
      );

      // Check that translation contains highlighted spans
      assert.include(
        result.translation,
        '<span class="highlight">favourite</span>'
      );
      // Or check the expected highlighted translation

      done();
    });

    test("Highlight translation in I ate yogurt for breakfast.", (done) => {
      const result = translator.translate(
        "I ate yogurt for breakfast.",
        LOCALES.AMERICAN_TO_BRITISH
      );

      assert.include(
        result.translation,
        '<span class="highlight">yoghurt</span>'
      );

      done();
    });

    test("Highlight translation in We watched the footie match for a while.", (done) => {
      const result = translator.translate(
        "We watched the footie match for a while.",
        LOCALES.BRITISH_TO_AMERICAN
      );
      assert.include(
        result.translation,
        '<span class="highlight">soccer</span>'
      );
      done();
    });

    test("Highlight translation in Paracetamol takes up to an hour to work.", (done) => {
      const result = translator.translate(
        "Paracetamol takes up to an hour to work.",
        LOCALES.BRITISH_TO_AMERICAN
      );

      assert.include(
        result.translation,
        '<span class="highlight">Tylenol</span>'
      );
      done();
    });
  });
});

// suite("Highlight translation tests", () => {
//   test("Highlight translation in Mangoes are my favorite fruit.", (done) => {
//     const result = translator.translate(
//       "Mangoes are my favorite fruit.",
//       LOCALES.AMERICAN_TO_BRITISH
//     );

//     assert.include(
//       result.translation,
//       '<span class="highlight">favourite</span>'
//     );
//     done();
//   });

//   test("Highlight translation in I ate yogurt for breakfast.", (done) => {
//     const result = translator.translate(
//       "I ate yogurt for breakfast.",
//       LOCALES.AMERICAN_TO_BRITISH
//     );

//     assert.include(
//       result.translation,
//       '<span class="highlight">yoghurt</span>'
//     );
//     done();
//   });

//   test("Highlight translation in We watched the footie match for a while.", (done) => {
//     const result = translator.translate(
//       "We watched the footie match for a while.",
//       LOCALES.BRITISH_TO_AMERICAN
//     );

//     assert.include(
//       result.translation,
//       '<span class="highlight">yoghurt</span>'
//     );
//     done();
//   });

//   test("Highlight translation in Paracetamol takes up to an hour to work.", (done) => {
//     const result = translator.translate(
//       "Paracetamol takes up to an hour to work.",
//       LOCALES.BRITISH_TO_AMERICAN
//     );

//     assert.deepEqual(result.translatedWords, ["Tylenol"]);
//     assert.equal(result.translation, "Tylenol takes up to an hour to work.");
//     done();
//   });
// });
