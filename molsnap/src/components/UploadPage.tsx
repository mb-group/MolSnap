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

interface UploadPageProps {
  onBack: () => void;
  onUpload: (file: File) => void;
}

export function UploadPage({ onBack, onUpload }: UploadPageProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
      }
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
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
          <Grid item xs={12} lg={6}>
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
                  accept="image/*"
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
                      <Image sx={{ color: 'success.main', fontSize: 32 }} />
                    </Paper>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {selectedFile.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      onClick={handleUpload}
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      Convert to SMILES
                    </Button>
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
                      <Typography variant="h6">Drop your image here</Typography>
                      <Typography variant="body2" color="text.secondary">
                        or click to browse files
                      </Typography>
                    </Box>
                    <Button variant="outlined">
                      Choose File
                    </Button>
                  </Box>
                )}
              </Paper>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Supported formats:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip label="PNG" size="small" />
                  <Chip label="JPG" size="small" />
                  <Chip label="JPEG" size="small" />
                  <Chip label="GIF" size="small" />
                  <Chip label="BMP" size="small" />
                  <Chip label="WEBP" size="small" />
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Guidelines */}
          <Grid item xs={12} lg={6}>
            <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Description />
                <Typography variant="h6">Upload Guidelines</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Follow these tips for best conversion results
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Image Quality
                </Typography>
                <List dense sx={{ pl: 1 }}>
                  <ListItem disablePadding>
                    <ListItemText 
                      primary="• Use high-resolution images (minimum 300 DPI)" 
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText 
                      primary="• Ensure clear, sharp chemical structures" 
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText 
                      primary="• Avoid blurry or pixelated images" 
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    />
                  </ListItem>
                </List>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Structure Requirements
                </Typography>
                <List dense sx={{ pl: 1 }}>
                  <ListItem disablePadding>
                    <ListItemText 
                      primary="• Clean, uncluttered chemical drawings" 
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText 
                      primary="• Clear bond connections and atom labels" 
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText 
                      primary="• Proper stereochemical annotations" 
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    />
                  </ListItem>
                </List>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Background
                </Typography>
                <List dense sx={{ pl: 1 }}>
                  <ListItem disablePadding>
                    <ListItemText 
                      primary="• White or light-colored backgrounds work best" 
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText 
                      primary="• Remove unnecessary text or labels" 
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText 
                      primary="• Crop image to focus on the structure" 
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    />
                  </ListItem>
                </List>
              </Box>

              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Pro Tip
                </Typography>
                <Typography variant="body2">
                  For best results, use structures exported from ChemDraw, 
                  ChemSketch, or similar chemical drawing software.
                </Typography>
              </Alert>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}