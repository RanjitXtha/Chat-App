import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserContextProvider } from './context/userContext';
import { FriendsContextProvider } from './context/chatContext';
import { GroupContextProvider } from './context/groupContext';
import {CGToggleContextProvider} from './context/chatGroupToggle';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserContextProvider>
    <CGToggleContextProvider>
    <GroupContextProvider>
    <FriendsContextProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </FriendsContextProvider>
  </GroupContextProvider>
  </CGToggleContextProvider>
  </UserContextProvider>
);

reportWebVitals();
