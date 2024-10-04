// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import Bootstrap for global styling
import 'bootstrap/dist/css/bootstrap.min.css'; 

// Import global custom styles
import './index.css'; 

// Render the root of the React app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />  {/* Main Application Component */}
  </React.StrictMode>
);
