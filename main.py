import os
import google.generativeai as genai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load .env file for API Key
load_dotenv()

app = FastAPI(title="Gemini AI Spell Corrector")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini API setup
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")

class TextRequest(BaseModel):
    text: str

@app.post("/correct-spelling/")
async def correct_spelling(request: TextRequest):
    original_text = request.text
    
    if not GOOGLE_API_KEY or GOOGLE_API_KEY == "yahan_apni_api_key_paste_karein":
        return {
            "original": original_text,
            "corrected": "⚠️ Error: API Key missing. Please open .env file and add your GEMINI_API_KEY."
        }
    
    try:
        # AI ko configure karna
        genai.configure(api_key=GOOGLE_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # AI ko instruction (Prompt) dena
        prompt = f"Please correct the spelling and grammar of the following text. Do not add any extra explanations, just return the corrected text directly:\n\n{original_text}"
        
        # AI se response lena
        response = model.generate_content(prompt)
        corrected_text = response.text.strip()
        
        return {
            "original": original_text,
            "corrected": corrected_text
        }
    except Exception as e:
        return {
            "original": original_text,
            "corrected": f"Error from AI: {str(e)}"
        }
