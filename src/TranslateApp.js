import React from "react";

class TranslateApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      englishWords: "",
      arabicWords: [],
      swedishWords: [],
    };
    this.handleWordChange = this.handleWordChange.bind(this);
    this.handleSpeak = this.handleSpeak.bind(this);
  }

  handleWordChange(event) {
    this.setState({ englishWords: event.target.value });
  }

  handleSpeak(text, lang) {
    return new Promise((resolve, reject) => {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = lang;
      speech.rate = 1;
      speech.onend = () => resolve();
      speech.onerror = (error) => reject(error);
      window.speechSynthesis.speak(speech);
    });
  }

  async handleTranslateAndSpeak() {
    const apiKey = "AIzaSyDE-wAlnykNe_rgHjTeXFpO_2h3AeIiebw";
    const englishWords = this.state.englishWords.split(" ");
    const arabicWords = [];
    const swedishWords = [];

    for (const englishWord of englishWords) {
      // Translate to Arabic
      const arabicResponse = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${englishWord}&source=en&target=ar`
      );
      const arabicData = await arabicResponse.json();
      const arabicWord = arabicData.data.translations[0].translatedText;
      arabicWords.push(arabicWord);
      await this.handleSpeak(englishWord, "en-US");
      await this.handleSpeak(arabicWord, "ar-SA");

      // Translate to Swedish
      const swedishResponse = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${englishWord}&source=en&target=sv`
      );
      const swedishData = await swedishResponse.json();
      const swedishWord = swedishData.data.translations[0].translatedText;
      swedishWords.push(swedishWord);
      await this.handleSpeak(swedishWord, "sv-SE");
    }

    this.setState({ arabicWords, swedishWords });
  }

  render() {
    const wordSpelling = this.state.englishWords
      .split(" ")
      .map((word, index) => {
        const arabicWord = this.state.arabicWords[index];
        const swedishWord = this.state.swedishWords[index];
        if (arabicWord && swedishWord) {
          return (
            <React.Fragment key={index}>
              <p>{word}</p>
              <p>{arabicWord}</p>
              <p>{swedishWord}</p>
            </React.Fragment>
          );
        } else if (arabicWord) {
          return (
            <React.Fragment key={index}>
              <p>{word}</p>
              <p>{arabicWord}</p>
            </React.Fragment>
          );
        } else if (swedishWord) {
          return (
            <React.Fragment key={index}>
              <p>{word}</p>
              <p>{swedishWord}</p>
            </React.Fragment>
          );
        }
        return <p key={index}>{word}</p>;
      });

    return (
      <div>
        <label htmlFor="englishWords">English words:</label>
        <input
          type="text"
          id="englishWords"
          value={this.state.englishWords}
          onChange={this.handleWordChange}
        />
        <button onClick={this.handleTranslateAndSpeak.bind(this)}>Speak</button>
        <br />
        <label htmlFor="arabicWords">Spelling:</label>
        <div id="arabicWords">{wordSpelling}</div>
       
        <div id="swedishWord">{wordSpelling}</div>
      </div>
    );
  }
}

export default TranslateApp;
