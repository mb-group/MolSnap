import { useState, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert
} from '@mui/material';
import {
  CloudUpload,
  Image,
  Description,
  ArrowBack
} from '@mui/icons-material';

import PdfViewer from "@components/PdfViewer";

import { Document } from 'react-pdf'

import Guidelines from "@components/Guidelines";

import { pdfjs } from 'react-pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router";
import { mockConvertToSMILES, type ConversionResult } from "../utils/mockConversion";
import LoadingPredictions from "@components/Loading/LoadingPredictions";

import { useResultsContext } from "@context/Results";
import { useLoadingContext } from "../context/Loading";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface UploadPageProps {
  onBack: () => void;
  onUpload: (file: File) => void;
}

const UploadPage = () => {

  const navigate = useNavigate();
  const { dispatch: dispatchForResults } = useResultsContext();
  const { isLoading, data: loadingData, dispatch: dispatchForLoading } = useLoadingContext();
  // const [isProcessing, setIsProcessing] = useState(false);
  // const [results, setResults] = useState<ConversionResult[]>([]);

  const onBack = () => {
    // Navigate to landing page
    navigate('/');
  }

  const onUpload = async (file: File) => {
    // setIsProcessing(true);
    dispatchForLoading({ type: 'LOADING.UPDATE', payload: { isLoading: true, data: {} } });
    try {
      const result = await mockConvertToSMILES(file);
      console.log('Conversion result:', result);
      // setResults([result]);
      dispatchForResults({ type: 'RESULTS.UPDATE', payload: [result] });
    } catch (error) {
      console.error('Conversion failed:', error);
      // In a real app, you'd show an error message here
    } finally {
      dispatchForLoading({ type: 'LOADING.UPDATE', payload: { isLoading: false, data: {} } });
      navigate('/results');
    }
  };

  // const onUpload = (file: File) => {
  //   // Navigate to results page after upload
  //   navigate('/results');
  // }


  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [parsing, setParsing] = useState(false);
  const [isParseSettingsOpen, setIsParseSettingsOpen] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        setSelectedFile(file);
      }
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        setSelectedFile(file);
      }
    }
  }, []);

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile);
      onUpload(selectedFile);
    }
  };



  const handleStartPageChange = (e: any) => setStartPage(Number(e.target.value));
  const handleEndPageChange = (e: any) => setEndPage(Number(e.target.value));

  const handleParseNow = () => {
    setParsing(true);
    // Simulate parsing delay
    setTimeout(() => setParsing(false), 2000);
  };

  const handleOpenParseSettings = () => {
    setIsParseSettingsOpen(true);
  }

  if (isLoading) {
    return (
      <LoadingPredictions />
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <IconButton onClick={onBack}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Upload Chemical Structure
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Upload an image of a chemical structure to convert to SMILES format
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Upload Area */}
          <Grid size={{ xs: 12 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CloudUpload />
                <Typography variant="h6">Upload Image</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Drag and drop your chemical structure image or click to browse
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  position: 'relative',
                  border: 2,
                  borderStyle: 'dashed',
                  borderColor: dragActive ? 'primary.main' : 'grey.300',
                  bgcolor: dragActive ? 'primary.light' : 'transparent',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'grey.400'
                  }
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileInput}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />

                {selectedFile ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Paper
                      elevation={1}
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: 'success.light',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {selectedFile.type === 'application/pdf' ? (
                        <Description sx={{ color: 'success.main', fontSize: 32 }} />
                      ) : (
                        <Image sx={{ color: 'success.main', fontSize: 32 }} />
                      )}
                    </Paper>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {selectedFile.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </Box>
                    {/* <Button
                      variant="contained"
                      onClick={handleOpenParseSettings}
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      Preview and Parse
                    </Button> */}
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="text.secondary">
                        Preview your file and adjust parse settings below
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Want to upload a different file?</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Drag and drop a new image or PDF, or click to browse
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: 'grey.100',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <CloudUpload sx={{ color: 'text.disabled', fontSize: 32 }} />
                    </Paper>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6">Drop your image or PDF here</Typography>
                      <Typography variant="body2" color="text.secondary">
                        or click to browse files
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Paper>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Supported formats:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip label="PDF" size="small" />
                  <Chip label="PNG" size="small" />
                  <Chip label="JPG" size="small" />
                  <Chip label="JPEG" size="small" />
                </Box>
              </Box>
            </Paper>
          </Grid>


          {/* Parse pdf configuration */}
          {selectedFile && (
            <Grid size={{ xs: 12 }}>
                <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Parse Configuration
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Drag and drop your chemical structure image or click to browse
              </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <FormControl sx={{ minWidth: 120, height: 40 }}>
                  <InputLabel id="start-page-label">Start Page</InputLabel>
                  <Select
                    labelId="start-page-label"
                    value={startPage}
                    label="Start Page"
                    onChange={handleStartPageChange}
                    sx={{ height: 40, '& .MuiSelect-select': { height: 40, display: 'flex', alignItems: 'center' } }}
                  >
                    {[...Array(20)].map((_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                    ))}
                  </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: 120, height: 40 }}>
                  <InputLabel id="end-page-label">End Page</InputLabel>
                  <Select
                    labelId="end-page-label"
                    value={endPage}
                    label="End Page"
                    onChange={handleEndPageChange}
                    sx={{ height: 40, '& .MuiSelect-select': { height: 40, display: 'flex', alignItems: 'center' } }}
                  >
                    {[...Array(20)].map((_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                    ))}
                  </Select>
                  </FormControl>
                  <Button
                  variant="contained"
                  color="primary"
                  onClick={handleParseNow}
                  disabled={parsing}
                  sx={{ height: 40, minWidth: 180 }}
                  >
                  Parse Chemical Images
                  </Button>
                </Box>
                {parsing && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  <Typography>Parsing document...</Typography>
                  </Box>
                )}
                </Paper>
            </Grid>
          )}

          {/* Guidelines or Selected Image Preview */}
          <Grid size={{ xs: 12 }}>
            {selectedFile ? (
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Document Preview
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Review the selected document before parsing
                  </Typography>
                </Box>
                {selectedFile.type === 'application/pdf' ? (
                  <Box sx={{ mt: 2 }}>
                    {/* PDF Preview using react-pdf */}
                    <PdfViewer file={selectedFile} initialScale={1.0} />
                  </Box>
                ) : (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt={selectedFile.name}
                    style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8 }}
                  />
                )}
              </Paper>
            ) : (
              <Guidelines />
            )}
          </Grid>




        </Grid>
      </Container>
    </Box>
  );
}

export default UploadPage;