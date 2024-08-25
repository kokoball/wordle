import React from 'react';
import { Route, Routes } from 'react-router-dom';
import IntroMenu from './pages/IntroMenu';
import Wordle from './pages/Wordle';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<IntroMenu />} />
      <Route path={`/wordle/:word`} element={<Wordle />} />
    </Routes>
  );
};

export default AppRoutes;
