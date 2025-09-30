import { useState } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Container, Typography, CircularProgress } from '@mui/material';
import { LandingPage } from "./components/LandingPage";
import { UploadPage } from "./components/UploadPage";
import { ResultsPage } from "./components/ResultsPage";
import { mockConvertToSMILES, type ConversionResult } from "./utils/mockConversion";

// Create MUI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

type Page = 'landing' | 'upload' | 'results';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGetStarted = () => {
    setCurrentPage('upload');
  };

  const handleBack = () => {
    if (currentPage === 'upload') {
      setCurrentPage('landing');
    } else if (currentPage === 'results') {
      setCurrentPage('upload');
    }
  };

  const handleUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const result = await mockConvertToSMILES(file);
      console.log('Conversion result:', result);
      setResults([result]);
      setCurrentPage('results');
    } catch (error) {
      console.error('Conversion failed:', error);
      // In a real app, you'd show an error message here
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewUpload = () => {
    setCurrentPage('upload');
    setResults([]);
  };

  if (isProcessing) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            bgcolor: 'grey.50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Container maxWidth="sm">
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CircularProgress
                size={64}
                sx={{ mb: 3, color: 'primary.main' }}
              />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Converting Chemical Structure...
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Our AI is analyzing your image and generating SMILES code
              </Typography>
            </Box>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onGetStarted={handleGetStarted} />;
      case 'upload':
        return <UploadPage onBack={handleBack} onUpload={handleUpload} />;
      case 'results':
        return <ResultsPage onBack={handleBack} onNewUpload={handleNewUpload} results={results} />;
      default:
        return <LandingPage onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {renderPage()}
    </ThemeProvider>
  );
}