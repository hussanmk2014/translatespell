import React, { Component } from "react";
import Recorder from "recorderjs";

class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: "",
      recording: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this);
    this.handleRecordButtonClick = this.handleRecordButtonClick.bind(this);
    this.handleStopButtonClick = this.handleStopButtonClick.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      word: event.target.value,
    });
  }

  async handlePlayButtonClick() {
    // Create an instance of the SpeechSynthesis API
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(this.state.word);

    // Speak the word using the default voice
    await new Promise((resolve, reject) => {
      // Check if speech synthesis is supported
      if (synth && synth.speak) {
        // Add an event listener to the utterance to detect when it finishes speaking
        utterance.addEventListener("end", () => {
          // Create an audio element and set its source to the speech output
          const audio = new Audio(
            URL.createObjectURL(new Blob([utterance]))
          );
          audio.play();

          // Resolve the Promise
          resolve();
        });

        // Speak the word using the default voice
        synth.speak(utterance);
      } else {
        // Speech synthesis is not supported
        reject("Speech synthesis is not supported.");
      }
    });
  }

  async handleRecordButtonClick() {
    // Create an instance of the getUserMedia API to access the microphone
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    // Create an instance of the Recorder.js library and start recording
    this.recorder = new Recorder(stream);
    this.recorder.record();

    // Update the state to indicate that recording has started
    this.setState({
      recording: true,
    });
  }

  async handleStopButtonClick() {
    // Stop recording and export the audio as a WAV file
    this.recorder.stop();
    this.recorder.exportWAV((blob) => {
      // Create a URL object and set its href to the audio blob
      const url = URL.createObjectURL(blob);

      // Create a new audio element and set its source to the URL object
      const audio = new Audio(url);

      // Play the audio
      audio.play();

      // Save the audio file
      const link = document.createElement("a");
      link.download = `${this.state.word}.wav`;
      link.href = url;
      link.click();
    });

    // Update the state to indicate that recording has stopped
    this.setState({
      recording: false,
    });
  }

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.word}
          onChange={this.handleInputChange}
        />
        <button onClick={this.handlePlayButtonClick}>Play</button>
        {!this.state.recording && (
          <button onClick={this.handleRecordButtonClick}>Record</button>
        )}
        {this.state.recording && (
          <button onClick={this.handleStopButtonClick}>Stop</button>
        )}
      </div>
    );
  }
}

export default AudioPlayer;
