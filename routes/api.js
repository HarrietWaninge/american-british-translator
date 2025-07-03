"use strict";

const Translator = require("../components/translator.js");

module.exports = function (app) {
  const translator = new Translator();

  app.route("/api/translate").post((req, res) => {
    try {
      res.json(translator.translate(req.body.text, req.body.locale));
    } catch (error) {
      console.log("ERROR", error);
    }
  });
};
