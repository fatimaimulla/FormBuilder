import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import SharedForm from './components/SharedForm.jsx';
import LandingPage from './components/LandingPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
import LoginPage from './components/LoginPage.jsx';
import MyFormsPage from './components/MyFormsPage.jsx';
import FormResponsesPage from './components/FormResponsesPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/build-forms"
            element={(
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/dashboard/forms"
            element={(
              <ProtectedRoute>
                <MyFormsPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/dashboard/forms/:formId/responses"
            element={(
              <ProtectedRoute>
                <FormResponsesPage />
              </ProtectedRoute>
            )}
          />
          <Route path="/shared" element={<SharedForm />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
