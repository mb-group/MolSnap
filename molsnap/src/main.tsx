import { useEffect, StrictMode } from 'react'
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
import { UploadProvider } from '@context/Upload';


declare global {
  interface Window {
    _mtm?: any[];
  }
}


const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <LoadingProvider>
        <UploadProvider>
          <ResultsProvider>
            {children}
          </ResultsProvider>
        </UploadProvider>
      </LoadingProvider>
    </>
  );
}

const Main = () => {

  const { protocol, hostname } = window.location;

  useEffect(() => {
    window._mtm = window._mtm || [];
    window._mtm.push({
      "mtm.startTime": new Date().getTime(),
      event: "mtm.Start",
    });

    const d = document;
    const g = d.createElement("script");
    const s = d.getElementsByTagName("script")[0];

    g.async = true;

    // THIS IS MOTOMO CONTAINER URL
    g.src = `${protocol}//${hostname}:8004/js/container_GFc2xMyk.js`;

    if (s?.parentNode) {
      s.parentNode.insertBefore(g, s);
    }
  }, []);

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
