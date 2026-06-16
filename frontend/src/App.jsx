import { useState } from 'react';
import './index.css';

function App() {
  const [text, setText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCorrectSpelling = async () => {
    if (!text) return;
    
    setIsLoading(true);
    try {
      // Yeh humare Python Backend (FastAPI) ko text bhej raha hai
      const response = await fetch('http://127.0.0.1:8000/correct-spelling/', {
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
              {correctedText}
            </div>
            <button 
              className="copy-btn"
              onClick={() => navigator.clipboard.writeText(correctedText)}
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
