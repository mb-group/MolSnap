import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Container, Typography, CircularProgress } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router';

import theme from './theme';

import LandingPage from '@pages/LandingPage.tsx';
import ResultsPage from '@pages/ResultsPage.tsx';
import UploadPage from '@pages/UploadPage.tsx';

import { ResultsProvider } from '@context/Results';
import { LoadingProvider } from '@context/Loading';


const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <LoadingProvider>
        <ResultsProvider>
          {children}
        </ResultsProvider>
      </LoadingProvider>
    </>
  );
}

const Main = () => {
  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppProviders>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<LandingPage />} />
              <Route path='/results' element={<ResultsPage />} />
              <Route path='/upload' element={<UploadPage />} />
            </Routes>
          </BrowserRouter>
        </AppProviders>
      </ThemeProvider>

    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Main />
  </StrictMode>,
)
