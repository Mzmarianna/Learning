import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App';
import '../styles/globals.css';
import { initializeGemini } from '../lib/ai/gemini-service';

// Initialize Gemini AI with API key from environment variable
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (GEMINI_API_KEY) {
  initializeGemini(GEMINI_API_KEY);
  console.log('🦉 WOWL AI initialized and ready!');
} else {
  console.warn('⚠️ No Gemini API key found, WOWL will use fallback responses');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);