import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GlobalStyle } from '@/styles/GlobalStyle';
import AppRoutes from './router';
import { Toaster } from '@/components/ui/toaster';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
