import { useState, useCallback, useEffect, useRef } from "react";
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
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  CloudUpload,
  Image,
  Description,
  ArrowBack,
  Close,
  CheckCircle,
  RestartAlt
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
import ImageSelector, { type ImageGroup } from "@components/ImageSelector";

import { useResultsContext } from "@context/Results";
import { useLoadingContext } from "../context/Loading";
import { useUploadContext } from "../context/Upload";
import { API_ENDPOINTS } from "../constants";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface UploadPageProps {
  onBack: () => void;
  onUpload: (file: File) => void;
}

const UploadPage = () => {

  const navigate = useNavigate();
  const { dispatch: dispatchForResults } = useResultsContext();
  const { isLoading, data: loadingData, dispatch: dispatchForLoading } = useLoadingContext();
  const { selected, parsed, checkpoints, files, activeFileId, parseSettings, parsedByFile, dispatch: dispatchUpload } = useUploadContext();
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


  interface UploadedFile {
    id: string;
    file: File;
    previewUrl: string;
  }

  interface FileParseSettings {
    startPage: number;
    endPage: number;
    pageCount: number;
  }

  const [dragActive, setDragActive] = useState(false);

  const [parsing, setParsing] = useState(false);
  const [parseFeedback, setParseFeedback] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>(
    { open: false, message: '', severity: 'success' }
  );
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  const imageSelectorRef = useRef<HTMLDivElement | null>(null);
  const scrollToImages = () => {
    imageSelectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeFile: UploadedFile | null = files.find((f: UploadedFile) => f.id === activeFileId) ?? null;
  const activeSettings: FileParseSettings | undefined = activeFileId ? parseSettings[activeFileId] : undefined;
  const startPage = activeSettings?.startPage ?? 1;
  const endPage = activeSettings?.endPage ?? 1;
  const pageCount = activeSettings?.pageCount ?? 1;

  // Group parsed images by their source document (in tab order) so the
  // selector can show a "Select all in document" action per PDF/image.
  const imageGroups: ImageGroup[] = files
    .filter((f: UploadedFile) => (parsedByFile[f.id]?.length ?? 0) > 0)
    .map((f: UploadedFile) => ({ id: f.id, label: f.file.name, images: parsedByFile[f.id] }));

  const addFiles = useCallback((fileList: FileList) => {
    const accepted = Array.from(fileList).filter(
      f => f.type.startsWith('image/') || f.type === 'application/pdf'
    );
    if (accepted.length === 0) return;

    const isDuplicate = (f: File) =>
      files.some((p: UploadedFile) => p.file.name === f.name && p.file.size === f.size && p.file.lastModified === f.lastModified) ||
      accepted.some(o => o !== f && o.name === f.name && o.size === f.size && o.lastModified === f.lastModified);

    const newFiles: UploadedFile[] = accepted
      .filter(f => !isDuplicate(f))
      .map(f => ({
        id: `${f.name}-${f.size}-${f.lastModified}`,
        file: f,
        previewUrl: URL.createObjectURL(f),
      }));
    if (newFiles.length === 0) return;

    dispatchUpload({ type: 'UPLOAD.FILES.ADD', payload: newFiles });
    if (!activeFileId) {
      dispatchUpload({ type: 'UPLOAD.ACTIVE_FILE.SET', payload: newFiles[0].id });
    }
  }, [files, activeFileId, dispatchUpload]);

  const removeFile = useCallback((id: string) => {
    const target = files.find((f: UploadedFile) => f.id === id);
    if (target) URL.revokeObjectURL(target.previewUrl);

    dispatchUpload({ type: 'UPLOAD.FILES.REMOVE', payload: id });
  }, [files, dispatchUpload]);

  const handleClearAll = useCallback(() => {
    files.forEach((f: UploadedFile) => URL.revokeObjectURL(f.previewUrl));
    dispatchUpload({ type: 'UPLOAD.RESET', payload: null });
    setIsClearConfirmOpen(false);
    setParseFeedback({ open: false, message: '', severity: 'success' });
  }, [files, dispatchUpload]);

  // Keep the shared context in sync: aggregate parsed images from all files
  useEffect(() => {
    const nextParsed = Object.values(parsedByFile).flat() as string[];
    dispatchUpload({ type: 'UPLOAD.PARSED.REPLACE', payload: nextParsed });

    const validSelection = selected.images.filter((image: string) => nextParsed.includes(image));
    if (validSelection.length !== selected.images.length) {
      dispatchUpload({ type: 'UPLOAD.SELECTED.IMAGE.UPDATE', payload: validSelection });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedByFile]);

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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      // allow selecting the same file again later
      e.target.value = '';
    }
  }, [addFiles]);

  const handleUpload = () => {
    if (activeFile) {
      console.log('Uploading file:', activeFile.file);
      onUpload(activeFile.file);
    }
  };



  const handleStartPageChange = (e: any) => {
    if (!activeFileId) return;
    dispatchUpload({
      type: 'UPLOAD.PARSE_SETTINGS.UPDATE',
      payload: { id: activeFileId, settings: { startPage: Number(e.target.value) } }
    });
  };
  const handleEndPageChange = (e: any) => {
    if (!activeFileId) return;
    dispatchUpload({
      type: 'UPLOAD.PARSE_SETTINGS.UPDATE',
      payload: { id: activeFileId, settings: { endPage: Number(e.target.value) } }
    });
  };

  const handleParseNow = () => {

    if (!activeFile) return;

    setParsing(true);

    const fileId = activeFile.id;
    const formData = new FormData();
    formData.append('file', activeFile.file);
    formData.append('startPage', String(startPage));
    formData.append('endPage', String(endPage));

    fetch(API_ENDPOINTS.CHEMICAL_IMAGE_UPLOAD_PARSE, {
      method: 'POST',
      body: formData,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Failed to parse document');
        const data = await response.json();

        // Store this file's images; the useEffect below aggregates images
        // across all parsed files into the shared context.
        dispatchUpload({ type: 'UPLOAD.PARSED_BY_FILE.SET', payload: { id: fileId, images: data.images } });
        dispatchUpload({ type: 'UPLOAD.CHECKPOINTS.UPDATE', payload: data.checkpoints });

        const count = data.images?.length ?? 0;
        setParseFeedback({
          open: true,
          severity: count > 0 ? 'success' : 'error',
          message: count > 0
            ? `Found ${count} chemical image${count === 1 ? '' : 's'} in ${activeFile.file.name}. Scroll down to select images.`
            : `No chemical images were found in ${activeFile.file.name}.`,
        });
        setParsing(false);
        if (count > 0) {
          // Give the DOM a tick to render the ImageSelector before scrolling to it
          setTimeout(scrollToImages, 150);
        }
      })
      .catch((error) => {
        console.error('Error parsing document:', error);
        setParsing(false);
        setParseFeedback({ open: true, severity: 'error', message: 'Failed to parse document. Please try again.' });
      });
  };

  const handleImageSelectionChange = (selected: string[]) => {
    // console.log("Parent got selection:", selected);
    dispatchUpload({ type: 'UPLOAD.SELECTED.IMAGE.UPDATE', payload: selected });
  };

  const handleModelSelectionChange = (e: any) => {
    dispatchUpload({ type: 'UPLOAD.SELECTED.MODEL.UPDATE', payload: e.target.value });
  }

  const handleGetSmiles = () => {
    // Implement the logic to get SMILES for the selected images
    console.log("Getting SMILES for:", selected);

    dispatchForLoading({ type: 'LOADING.UPDATE', payload: { isLoading: true, data: {} } });
    // navigate('/results');

    if (selected.images.length !== 0) {
      const formData = new FormData();
      formData.append('images', JSON.stringify(selected.images));
      formData.append('model', String(selected.model));

      fetch(API_ENDPOINTS.PREDICTION_ONLY, {
        method: 'POST',
        body: formData,
      })
        .then(async (response) => {
          if (!response.ok) throw new Error('Failed to parse document');
          const data = await response.json();

          dispatchForResults({ type: 'RESULTS.UPDATE', payload: data.results });
          dispatchForLoading({ type: 'LOADING.UPDATE', payload: { isLoading: false, data: {} } });
          navigate('/results');

          // console.log('Parsed chemical images:', data);
          // setParsing(false);
          // You can dispatch results or navigate as needed here
        })
        .catch((error) => {
          console.error('Error parsing document:', error);
          dispatchForLoading({ type: 'LOADING.UPDATE', payload: { isLoading: false, data: {} } });
          // setParsing(false);
          // Handle error UI here if needed
        });
    }
  };

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
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Upload Chemical Structure
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Upload an image of a chemical structure to convert to SMILES format
            </Typography>
          </Box>
          {files.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<RestartAlt />}
              onClick={() => setIsClearConfirmOpen(true)}
            >
              Clear All
            </Button>
          )}
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
                  multiple
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

                {files.length > 0 ? (
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
                      {activeFile?.file.type === 'application/pdf' ? (
                        <Description sx={{ color: 'success.main', fontSize: 32 }} />
                      ) : (
                        <Image sx={{ color: 'success.main', fontSize: 32 }} />
                      )}
                    </Paper>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {activeFile?.file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {((activeFile?.file.size ?? 0) / 1024 / 1024).toFixed(2)} MB
                        {files.length > 1 && ` — ${files.length} files selected`}
                      </Typography>
                    </Box>
                    {activeFile && parsedByFile[activeFile.id]?.length > 0 ? (
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          {parsedByFile[activeFile.id].length} chemical image{parsedByFile[activeFile.id].length === 1 ? '' : 's'} already parsed for this file.
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary">
                          Preview your file and parse it below
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Want to upload more files?</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Drag and drop more images or PDFs, or click to browse — they will be added to the list
                        </Typography>
                      </Box>
                    )}


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
                      <Typography variant="h6">Drop images or PDFs here</Typography>
                      <Typography variant="body2" color="text.secondary">
                        or click to browse files — you can select multiple
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.75, mt: 0.5 }}>
                      <Chip label="PDF" size="small" variant="outlined" />
                      <Chip label="PNG" size="small" variant="outlined" />
                      <Chip label="JPG" size="small" variant="outlined" />
                      <Chip label="JPEG" size="small" variant="outlined" />
                    </Box>
                  </Box>
                )}
              </Paper>

              {/* File tabs */}
              {files.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Tabs
                    value={activeFileId === null ? false : activeFileId}
                    onChange={(_, id) => dispatchUpload({ type: 'UPLOAD.ACTIVE_FILE.SET', payload: id })}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ minHeight: 40, '.MuiTab-root': { minHeight: 40 } }}
                  >
                    {files.map((f: UploadedFile) => (
                      <Tab
                        key={f.id}
                        value={f.id}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: 200 }}>
                            <Typography
                              variant="body2"
                              noWrap
                              title={f.file.name}
                              sx={{ maxWidth: 140 }}
                            >
                              {f.file.name}
                            </Typography>
                            {parsedByFile[f.id]?.length > 0 && (
                              <Chip
                                size="small"
                                color="success"
                                label={parsedByFile[f.id].length}
                              />
                            )}
                            {/* Plain element (not IconButton) to avoid nesting a <button>
                                inside the Tab's own <button> element, which is invalid HTML
                                and triggers a React hydration warning. */}
                            <Box
                              component="span"
                              role="button"
                              tabIndex={0}
                              aria-label={`Remove ${f.file.name}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(f.id);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  removeFile(f.id);
                                }
                              }}
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                cursor: 'pointer',
                                '&:hover': { bgcolor: 'action.hover' },
                              }}
                            >
                              <Close sx={{ fontSize: 14 }} />
                            </Box>
                          </Box>
                        }
                      />
                    ))}
                  </Tabs>
                </Box>
              )}

              {/* Parse settings + document preview for the active file, combined into the same card */}
              {activeFile && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Parse Setting — {activeFile.file.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {activeFile.file.type === 'application/pdf'
                          ? 'Choose the page range to extract chemical images from this document'
                          : 'Extract chemical structure images from this file'}
                      </Typography>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 2 }}>
                        {activeFile.file.type === 'application/pdf' && (
                          <>
                            <FormControl sx={{ minWidth: 120, height: 40 }}>
                              <InputLabel id="start-page-label">Start Page</InputLabel>
                              <Select
                                labelId="start-page-label"
                                value={startPage}
                                label="Start Page"
                                onChange={handleStartPageChange}
                                sx={{ height: 40, '& .MuiSelect-select': { height: 40, display: 'flex', alignItems: 'center' } }}
                              >
                                {[...Array(pageCount)].map((_, i) => (
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
                                {[...Array(pageCount)].map((_, i) => (
                                  <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </>
                        )}
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
                      {!parsing && activeFileId && parsedByFile[activeFileId]?.length > 0 && (
                        <Alert
                          severity="success"
                          icon={<CheckCircle fontSize="inherit" />}
                          sx={{ mt: 2 }}
                          action={
                            <Button color="inherit" size="small" onClick={scrollToImages}>
                              VIEW
                            </Button>
                          }
                        >
                          {parsedByFile[activeFileId].length} chemical image{parsedByFile[activeFileId].length === 1 ? '' : 's'} found — ready to select below.
                        </Alert>
                      )}
                    </Grid>

                    <Grid size={{ xs: 12, md: 7 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Document Preview
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        Review the selected document before parsing
                      </Typography>
                      {activeFile.file.type === 'application/pdf' ? (
                        <Box>
                          {/* PDF Preview using react-pdf — only the active tab's file is mounted */}
                          <PdfViewer
                            file={activeFile.file}
                            initialScale={1.0}
                            onLoadSuccess={({ numPages }: { numPages: number }) => {
                              if (!activeFileId) return;
                              dispatchUpload({
                                type: 'UPLOAD.PARSE_SETTINGS.UPDATE',
                                payload: {
                                  id: activeFileId,
                                  settings: {
                                    startPage: parseSettings[activeFileId]?.startPage ?? 1,
                                    endPage: parseSettings[activeFileId]?.endPage ?? numPages,
                                    pageCount: numPages,
                                  }
                                }
                              });
                            }}
                          />
                        </Box>
                      ) : (
                        <img
                          src={activeFile.previewUrl}
                          alt={activeFile.file.name}
                          style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8 }}
                        />
                      )}
                    </Grid>
                  </Grid>
                </>
              )}
            </Paper>
          </Grid>

          {parsed.length > 0 && (
            <>
              <Box ref={imageSelectorRef} sx={{ width: '100%' }}>
                <ImageSelector
                  images={parsed}
                  selectedImages={selected.images}
                  groups={imageGroups}
                  onSelectionChange={handleImageSelectionChange}
                />
              </Box>

              {checkpoints?.files?.length > 0 && (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ my: 2, display: 'flex', alignItems: 'flex-start', gap: 2, maxWidth: 500 }}>
                    <FormControl sx={{ flex: 1, minWidth: 220 }}>
                      <InputLabel id="model-select-label">Select Model</InputLabel>
                      <Select
                        labelId="model-select-label"
                        value={selected.model}
                        label="Select Model"
                        onChange={handleModelSelectionChange}
                        sx={{ minWidth: 220 }}
                      >
                        {checkpoints.files.map((model: string) => (
                          <MenuItem key={model} value={model}>
                            {model}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleGetSmiles}
                      sx={{ marginTop: 0, height: 56 }}
                      disabled={selected.images.length === 0}
                    >
                      Get SMILES {selected.images.length > 0 ? `(${selected.images.length})` : ""}
                    </Button>
                  </Box>
                </Grid>
              )}
            </>
          )}



          {/* Guidelines shown until a file is selected; preview/parse settings now live in the upload card above */}
          {!activeFile && (
            <Grid size={{ xs: 12 }}>
              <Guidelines />
            </Grid>
          )}
        </Grid>
      </Container>

      <Snackbar
        open={parseFeedback.open}
        autoHideDuration={5000}
        onClose={() => setParseFeedback(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setParseFeedback(prev => ({ ...prev, open: false }))}
          severity={parseFeedback.severity}
          variant="filled"
          sx={{ width: '100%' }}
          action={
            parseFeedback.severity === 'success' ? (
              <Button color="inherit" size="small" onClick={() => { scrollToImages(); setParseFeedback(prev => ({ ...prev, open: false })); }}>
                VIEW
              </Button>
            ) : undefined
          }
        >
          {parseFeedback.message}
        </Alert>
      </Snackbar>

      <Dialog open={isClearConfirmOpen} onClose={() => setIsClearConfirmOpen(false)}>
        <DialogTitle>Clear all uploaded files?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will remove all uploaded files, parsed images, and selections. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsClearConfirmOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleClearAll}>
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UploadPage;