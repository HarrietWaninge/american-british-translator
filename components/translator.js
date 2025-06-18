const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

class Translator {
  constructor() {
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
      `\\b(${britishTitles.join("|")})(?!\\.)(?=[\\s,]|$)`,
      "gi"
    );
    this.americanTitlesRegex = new RegExp(
      `\\b(${this.escapeDots(americanTitles).join("|")})(?=[\\s,.]|$)`,
      "gi"
    );

    //make time rexex
    this.britishTimeRegex = new RegExp("\\d?\\d\\.\\d{2}", "g");
    this.americanTimeRegex = new RegExp("\\d?\\d:\\d{2}", "g");
  }

  translate(textString) {
    console.log(this.findAllSuspects(textString));
    return "We watched the soccer match for a while.";
  }

  findAllSuspects(textString) {
    let americanBits =
      textString.match(this.americanTitlesRegex) ??
      []
        .concat(textString.match(this.americanTimeRegex) ?? [])
        .concat(textString.match(this.americanWordsRegex) ?? []);

    let britishBits =
      textString.match(this.britishTitlesRegex) ??
      []
        .concat(textString.match(this.britishTimeRegex) ?? [])
        .concat(textString.match(this.britishWordsRegex) ?? []);

    return { american: americanBits, british: britishBits };
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
