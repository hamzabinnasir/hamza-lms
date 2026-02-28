import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LMScontextProvider from './context/LMScontextProvider';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LMScontextProvider>
      <App />
    </LMScontextProvider>
  </React.StrictMode>
);

