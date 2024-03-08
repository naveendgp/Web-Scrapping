import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import { useSpeechSynthesis } from 'react-speech-kit';

function App() {

  const [inputText, setInputText] = useState('');
  const [output, setOutput] = useState('');
  const [question,setQuestion] = useState('');
  const [answer,setAnswer] = useState('')
  const { speak } = useSpeechSynthesis();
  const api = "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"

  
  const SummarizeText = async() => {
    try{
      const res = await axios.post(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        {
          inputs: inputText,
        },
        {
          headers: {
            Authorization: `Bearer ${api}`,
          },
        }
      );
      console.log(res.data[0].summary_text)
      setOutput(res.data[0].summary_text );
      console.log(output)
    }
    catch(e){
      console.log(e.response.data)
    }
  }

  const AnswerQuestion = async () => {
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/deepset/roberta-base-squad2",
        {
          "inputs":{
            "question":question,
            "context":inputText
          }
        },
        {
          headers: {
            Authorization: `Bearer ${api}`,
          },
        }
      );

      setAnswer(response.data.answer)
      console.log(response.data.answer);
    } catch (e) {

      console.error("Error during API request:", e);


    }
  };

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      const synthesis = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(answer);
      const voices = synthesis.getVoices()
      const feminineVoice = voices.find((voice) =>
        voice.name.includes("female"));
        utterance.voice = feminineVoice || console.log('no female voice');
      synthesis.speak(utterance);
    } else {
      alert("Sorry, your browser does not support the Web Speech API.");
    }
  };



  return (
    <>
      <h2>Get You Answers</h2>
      <div className="main">
        <div className="container">
          <div className="input-div">
            <h3>Enter Your Text!</h3>
            <textarea
              type="text"
              className="text-input"
              placeholder="Enter your paragraph"
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <div className="side-text">
            <h3 style={{ marginLeft: "100px" }}>Summarize Text</h3>
            <ol className="list">
              <li>Enter your Text to Summarize</li>
              <li> Find Answer for your Questions</li>
            </ol>
            <button className="btn" onClick={() => SummarizeText()}>
              Submit
            </button>
          </div>
        </div>
        <h3>Summarized Text: {output}</h3>
        <div>
          <h3>Answer: {answer}</h3>
          
          <input
            className="input-tag"
            type="text"
            placeholder="Enter your question"
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            className="btn"
            onClick={() => {
              AnswerQuestion();
              handleSpeak();
            }}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}

export default App
