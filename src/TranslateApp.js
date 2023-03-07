import React from "react";

class TranslateApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      englishWords: "",
      arabicWords: [],
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

    for (const englishWord of englishWords) {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${englishWord}&source=en&target=ar`
      );
      const data = await response.json();
      const arabicWord = data.data.translations[0].translatedText;
      arabicWords.push(arabicWord);
      await this.handleSpeak(englishWord, "en-US");
      await this.handleSpeak(arabicWord, "ar-SA");
    }

    this.setState({ arabicWords });
  }

  render() {
    const wordSpelling = this.state.englishWords
      .split(" ")
      .map((word, index) => {
        const arabicWord = this.state.arabicWords[index];
        if (arabicWord) {
          return (
            <React.Fragment key={index}>
              <p>{word}</p>
              <p>{arabicWord}</p>
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
      </div>
    );
  }
}

export default TranslateApp;
