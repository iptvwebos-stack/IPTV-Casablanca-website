import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

// Clé de site publique (utiliser la vraie clé en prod, celle-ci est une clé de test de Google qui renvoie toujours un score)
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      <App />
    </GoogleReCaptchaProvider>
  </StrictMode>,
);
