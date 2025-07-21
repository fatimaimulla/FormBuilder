import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import SharedForm from './components/SharedForm.jsx';
import LandingPage from './components/LandingPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/build-forms" element={<App />} />
        <Route path="/forms/shared" element={<SharedForm />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
