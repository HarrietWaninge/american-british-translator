"use strict";

const Translator = require("../components/translator.js");

module.exports = function (app) {
  const translator = new Translator();

  app.route("/api/translate").post((req, res) => {
    try {
      let response = translator.translate(req.body.text, req.body.locale);
      console.log(req.body.text, req.body.locale, response);
      res.json(response);
    } catch (error) {
      console.log("ERROR", error);
    }
  });
};
