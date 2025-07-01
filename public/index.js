const translateHandler = async () => {
  const textArea = document.getElementById("text-input");
  const localeArea = document.getElementById("locale-select");
  const errorArea = document.getElementById("error-msg");
  const translatedArea = document.getElementById("translated-sentence");

  errorArea.innerText = "";
  translatedArea.innerText = "";
  const data = await fetch("/api/translate", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({ text: textArea.value, locale: localeArea.value }),
  });

  const parsed = await data.json();

  const config = {
    data: "translation",
    render: function (translatedWords, finalSentence) {
      for (let i = 0; i < translatedWords.length; i++) {
        finalSentence = finalSentence.replace(
          translatedWords[i],
          '<span class = "highlight">' + translatedWords[i] + "</span>"
        );
      }
      return finalSentence;
    },
  };

  if (parsed.error) {
    errorArea.innerText = JSON.stringify(parsed);
    return;
  }

  translatedArea.innerHTML = config.render(
    parsed["translatedWords"],
    parsed[config.data]
  );

  return;
};
document
  .getElementById("translate-btn")
  .addEventListener("click", translateHandler);
