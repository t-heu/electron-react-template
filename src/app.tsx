import React from 'react';
import { createRoot } from 'react-dom/client';

import './styles/global.scss'

import Home from './pages/home'; 

const root = createRoot(document.body);

const App = () => {
  return (
    <Home />
  )
};

root.render(<App />);
