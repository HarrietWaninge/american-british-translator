"use strict";

const Translator = require("../components/translator.js");

module.exports = function (app) {
  const translator = new Translator();

  app.route("/api/translate").post((req, res) => {
    try {
      const result = translator.translate(req.body.text, req.body.locale);
      res.json(result);
    } catch (error) {
      console.log("ERROR", error);
    }
  });
};
