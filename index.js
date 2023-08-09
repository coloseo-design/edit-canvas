import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Demo from './src/demo';
import Test from './src/test';



ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path='/' element={<Demo />} />
      <Route path='/test' element={<Test />} />
    </Routes>
  </HashRouter>,
  document.getElementById('root'),
);
