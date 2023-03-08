import React from "react";
import "./index.css";

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
      const arabicResponse = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${englishWord}&source=en&target=ar`
      );
      const arabicData = await arabicResponse.json();
      const arabicWord = arabicData.data.translations[0].translatedText;
      arabicWords.push(arabicWord);
      await this.handleSpeak(englishWord, "en-US");
      await this.handleSpeak(arabicWord, "ar-SA");

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
    const { englishWords, arabicWords, swedishWords } = this.state;
    const wordSpelling = englishWords
      .split(" ")
      .map((word, index) => {
        const arabicWord = arabicWords[index];
        const swedishWord = swedishWords[index];
        return (
          <div key={index} className="word">
            <p>{word}</p>
            {arabicWord && <p className="translation">{arabicWord}</p>}
            {swedishWord && <p className="translation">{swedishWord}</p>}
          </div>
        );
      });

    return (
      <div className="container">
        <h1>Word Translator</h1>
        <label htmlFor="englishWords">Enter English words:</label>
        <input
          type="text"
          id="englishWords"
          value={englishWords}
          onChange={this.handleWordChange}
        />
        <button onClick={this.handleTranslateAndSpeak.bind(this)}>Speak</button>
        <div className="word-container">{wordSpelling}</div>
      </div>
    );
  }
}

export default TranslateApp;
