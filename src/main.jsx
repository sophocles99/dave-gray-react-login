import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext.jsx';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        {/* <Routes>
          <Route path="/*" element={<App />} />
        </Routes> */}
        <App />
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
