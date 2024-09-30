import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [timer, setTimer] = useState(15); // Timer set to 15 seconds for each word

  const uploadFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      setWords(text.split('\n').filter(word => word.trim() !== ''));
    };
    reader.readAsText(file);
  };

  const startTest = () => {
    setTestStarted(true);
    setTimer(15); // Initialize the timer
    pronounceWord();
  };

  const pronounceWord = () => {
    if (currentWordIndex < words.length) {
      const word = words[currentWordIndex];
      axios.post('http://127.0.0.1:5000/api/pronounce', { word })
      .then(() => {
        setTimeout(() => {
          setCurrentWordIndex(prevIndex => prevIndex + 1);
          setTimer(15); // Reset the timer for the next word
        }, 15000);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    } else {
      alert("Test finished!");
    }
  };

  useEffect(() => {
    if (testStarted && currentWordIndex < words.length) {
      pronounceWord();
    }
  }, [currentWordIndex, testStarted, words.length]);

  useEffect(() => {
    if (testStarted && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [testStarted, timer]);

  return (
    <div className="App">
      <h1>Dictation Tool</h1>
      <input type="file" onChange={uploadFile} />
      <button onClick={startTest}>Start Test</button>
      {testStarted && words.length > 0 && (
        <>
          <p>Pronouncing word {currentWordIndex + 1} out of {words.length}</p>
          <p>Time remaining: {timer} seconds</p>
        </>
      )}
    </div>
  );
}

export default App;