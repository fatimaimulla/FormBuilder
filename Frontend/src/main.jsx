import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import SharedForm from './components/SharedForm.jsx';
import LandingPage from './components/LandingPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/build-forms"
            element={(
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            )}
          />
          <Route path="/shared" element={<SharedForm />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
