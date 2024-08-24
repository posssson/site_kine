// client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css'; // Assurez-vous que ce fichier existe ou modifiez le chemin
import App from './App';
import { AuthProvider } from './context/AuthContext';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
