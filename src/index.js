import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserContextProvider } from './context/userContext';
import { FriendsContextProvider } from './context/chatContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserContextProvider>
    <FriendsContextProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </FriendsContextProvider>
  </UserContextProvider>
);

reportWebVitals();
