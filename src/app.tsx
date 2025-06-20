import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css'

const root = createRoot(document.body);

const App = () => {
  return (
    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
  )
};

root.render(<App />);
