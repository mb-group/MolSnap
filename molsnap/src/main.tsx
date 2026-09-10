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
    __matomoInjected?: boolean;
  }
}

// Initialize Matomo data layer once at module load, before the container script runs.
window._mtm = window._mtm || [];
window._mtm.push({
  "mtm.startTime": new Date().getTime(),
  event: "mtm.Start",
});

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
    // Prevent double-injection under React StrictMode, which can cause the
    // Matomo container script to load twice and corrupt its internal state.
    if (window.__matomoInjected) return;
    window.__matomoInjected = true;

    const d = document;
    const g = d.createElement("script");
    const s = d.getElementsByTagName("script")[0];

    g.async = true;

    // THIS IS MOTOMO CONTAINER URL
    // const defaultContainer = 'j0M0XEK0';
    const molsnapContainer = 'GFc2xMyk';
    g.src = `${protocol}//${hostname}:8004/js/container_${molsnapContainer}.js`;
    console.log("Loading Matomo script from:", g.src);

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
