import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Demo from './src/demo';
import PixiDemo from './src/pixi-demo';



ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path='/' element={<PixiDemo />} />
      <Route path='/test' element={<Demo />} />
    </Routes>
  </HashRouter>,
  document.getElementById('root'),
);
