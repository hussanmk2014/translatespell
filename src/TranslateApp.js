/* import React from "react";

class TranslateApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      englishWord: "",
      arabicWord: "",
    };
    this.handleEnglishWordChange = this.handleEnglishWordChange.bind(this);
    this.handleTranslateClick = this.handleTranslateClick.bind(this);
    this.handleSpeakEnglishClick = this.handleSpeakEnglishClick.bind(this);
    this.handleSpeakArabicClick = this.handleSpeakArabicClick.bind(this);
  }

  handleEnglishWordChange(event) {
    this.setState({ englishWord: event.target.value });
  }

  handleTranslateClick() {
    const apiKey = "AIzaSyDE-wAlnykNe_rgHjTeXFpO_2h3AeIiebw";
    const englishWord = this.state.englishWord;

    fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${englishWord}&source=en&target=ar`
    )
      .then((response) => response.json())
      .then((data) => {
        const arabicWord = data.data.translations[0].translatedText;
        this.setState({ arabicWord });
      })
      .catch((error) => console.error(error));
  }

  handleSpeakEnglishClick() {
    const englishWord = this.state.englishWord;
    const speech = new SpeechSynthesisUtterance(englishWord);
    speech.lang = "en-US";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  }

  handleSpeakArabicClick() {
    const arabicWord = this.state.arabicWord;
    const speech = new SpeechSynthesisUtterance(arabicWord);
    speech.lang = "ar-SA";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  }

  render() {
    return (
      <div>
        <label htmlFor="englishWord">English word:</label>
        <input
          type="text"
          id="englishWord"
          value={this.state.englishWord}
          onChange={this.handleEnglishWordChange}
        />
        <button onClick={this.handleTranslateClick}>Translate</button>
        <br />
        <label htmlFor="arabicWord">Arabic word:</label>
        <span id="arabicWord">{this.state.arabicWord}</span>
        <br />
        <button onClick={this.handleSpeakEnglishClick}>Speak English</button>
        <button onClick={this.handleSpeakArabicClick}>Speak Arabic</button>
      </div>
    );
  }
}

export default TranslateApp;
 */
import React from "react";

class TranslateApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      englishWord: "",
      arabicWord: "",
    };
    this.handleWordChange = this.handleWordChange.bind(this);
    this.handleSpeak = this.handleSpeak.bind(this);
  }

  handleWordChange(event) {
    this.setState({ englishWord: event.target.value });
  }

  handleSpeak(text, lang) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = lang;
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  }

  handleTranslateAndSpeak() {
    const apiKey = "AIzaSyDE-wAlnykNe_rgHjTeXFpO_2h3AeIiebw";
    const englishWord = this.state.englishWord;

    fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${englishWord}&source=en&target=ar`
    )
      .then((response) => response.json())
      .then((data) => {
        const arabicWord = data.data.translations[0].translatedText;
        this.handleSpeak(`${englishWord}`, "en-US");
        setTimeout(() => this.handleSpeak(`${arabicWord}`, "ar-SA"), 2000);
        this.setState({ arabicWord });
      })
      .catch((error) => console.error(error));
  }

  render() {
    return (
      <div>
        <label htmlFor="englishWord">English word:</label>
        <input
          type="text"
          id="englishWord"
          value={this.state.englishWord}
          onChange={this.handleWordChange}
        />
        <button onClick={this.handleTranslateAndSpeak.bind(this)}>Speak</button>
        <br />
        <label htmlFor="arabicWord">Arabic word:</label>
        <span id="arabicWord">{this.state.arabicWord}</span>
      </div>
    );
  }
}

export default TranslateApp;
