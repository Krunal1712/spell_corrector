import { useState } from 'react';
import { diffWords } from 'diff';
import './index.css';

function App() {
  const [text, setText] = useState('');
  const [originalTextForDiff, setOriginalTextForDiff] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCorrectSpelling = async () => {
    if (!text) return;
    
    setIsLoading(true);
    setOriginalTextForDiff(text);
    try {
      // Backend URL ko env variable ya dynamic hostname ke aadhar par fetch karein
      const backendUrl = import.meta.env.VITE_BACKEND_URL 
        ? `${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '')}/correct-spelling/`
        : `http://${window.location.hostname}:8000/correct-spelling/`;
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
      });
      
      const data = await response.json();
      setCorrectedText(data.corrected);
    } catch (error) {
      console.error("Error correcting text:", error);
      setCorrectedText("Server connect nahi ho raha. Kya aapne backend (uvicorn main:app --reload) start kiya hai?");
    } finally {
      setIsLoading(false);
    }
  };

  const renderHighlightedText = () => {
    if (!originalTextForDiff || !correctedText || correctedText.includes("Error")) {
      return correctedText;
    }
    const diffs = diffWords(originalTextForDiff, correctedText);
    return diffs.map((part, index) => {
      if (part.added) {
        return <span key={index} className="highlight-added">{part.value}</span>;
      }
      if (part.removed) {
        return <span key={index} className="highlight-removed">{part.value}</span>;
      }
      return <span key={index}>{part.value}</span>;
    });
  };

  const handleListen = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(correctedText);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Aapka browser text-to-speech support nahi karta.");
    }
  };

  return (
    <div className="app-container">
      <div className="glass-panel">
        <h1 className="title">AI Spell Corrector</h1>
        <p className="subtitle">Apna text yahan likhein aur AI uski spelling theek kar dega. ✨</p>
        
        <div className="input-group">
          <textarea 
            className="text-input" 
            placeholder="Apna galat text yahan type karein..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>
        
        <button 
          className="correct-btn" 
          onClick={handleCorrectSpelling}
          disabled={isLoading || !text}
        >
          {isLoading ? 'Correcting...' : 'Correct Spelling ✨'}
        </button>
        
        {correctedText && (
          <div className="result-group">
            <h3>Corrected Text:</h3>
            <div className="result-box">
              {renderHighlightedText()}
            </div>
            <div className="action-buttons">
              <button 
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText(correctedText)}
              >
                Copy to Clipboard
              </button>
              <button 
                className="listen-btn"
                onClick={handleListen}
              >
                Listen 🔊
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
