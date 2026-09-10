import { useEffect, useRef, useState } from "react";
import SmilesDrawer from "smiles-drawer";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Avatar,
  Tooltip,
  Modal
} from '@mui/material';
import {
  ArrowBack,
  Download,
  ContentCopy,
  CheckCircle,
  Warning,
  Close,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useNavigate } from "react-router";
import { mockConvertToSMILES, type ConversionResult } from "../utils/mockConversion";
import { useResultsContext } from "@context/Results";

interface ResultsPageProps {
  onBack: () => void;
  onNewUpload: () => void;
  results: ConversionResult[];
}

// Renders a SMILES string as an SVG structure using smiles-drawer
const MoleculeStructure = ({ smiles, width, height }: { smiles: string; width: number; height: number }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.innerHTML = '';
    SmilesDrawer.parse(smiles, (tree) => {
      const drawer = new SmilesDrawer.SvgDrawer({ width, height });
      drawer.draw(tree, svg, 'light', false);
    }, (err) => {
      console.error('Failed to parse SMILES:', smiles, err);
    });
  }, [smiles, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ display: 'block' }}
    />
  );
};

const ResultsPage = () => {

  const navigate = useNavigate();
  // const [results, setResults] = useState<ConversionResult[]>([]);
  const { results, dispatch: dispatchForResults } = useResultsContext<ConversionResult>();

  const onBack = () => {
    // Navigate to landing page
    navigate('/upload');
  }

  const onNewUpload = () => {
    // Navigate to upload page
    navigate('/upload');
  }

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<ConversionResult | null>(null);
  const [compareResult, setCompareResult] = useState<ConversionResult | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadResults = () => {
    // Quote fields and escape embedded quotes so commas/newlines in values stay intact
    const csvField = (value: string | number) => `"${String(value ?? '').replace(/"/g, '""')}"`;

    const header = ["File Name", "SMILES", "Confidence", "Processing Time"]
      .map(csvField)
      .join(",");
    const rows = results.map(result =>
      [result.fileName, result.smiles, result.confidence, result.processingTime]
        .map(csvField)
        .join(",")
    );
    const csvContent = [header, ...rows].join("\r\n");

    // Use a Blob instead of a data: URI — encodeURI doesn't escape '#', which
    // appears in SMILES triple bonds (e.g. "C#N") and truncated the CSV there.
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "chemical_conversion_results.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />;
      case 'warning':
        return <Warning sx={{ color: 'warning.main', fontSize: 16 }} />;
      case 'error':
        return <ErrorIcon sx={{ color: 'error.main', fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'success':
        return <Chip label="Success" color="success" size="small" />;
      case 'warning':
        return <Chip label="Warning" color="warning" size="small" />;
      case 'error':
        return <Chip label="Error" color="error" size="small" />;
      default:
        return <Chip label="Unknown" size="small" />;
    }
  };


  console.log('res..here', results);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={onBack}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Conversion Results
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Chemical structure conversion completed
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={downloadResults}
            >
              Download CSV
            </Button>
            <Button variant="contained" onClick={onNewUpload}>
              Upload Another
            </Button>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Images
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {results.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <CheckCircle sx={{ color: 'primary.main' }} />
                </Avatar>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Successful
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                    {results && results.filter(r => r.status === 'success').length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <CheckCircle sx={{ color: 'success.main' }} />
                </Avatar>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Avg Confidence
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {results && Math.round(results.reduce((sum, r) => sum + r.confidence, 0) / results.length)}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light' }}>
                  <Warning sx={{ color: 'info.main' }} />
                </Avatar>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Avg Time
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {results && (results.reduce((sum, r) => sum + r.processingTime, 0) / results.length).toFixed(1)}s
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light' }}>
                  <Warning sx={{ color: 'warning.main' }} />
                </Avatar>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Results Table */}
        <Paper elevation={2} sx={{ mb: 4 }}>
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Detailed Results
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click the copy button to copy SMILES or SELFIES codes to clipboard
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>File Name</TableCell>
                  <TableCell>SMILES</TableCell>
                  <TableCell>Structure</TableCell>
                  {/* <TableCell>SELFIES</TableCell> */}
                  <TableCell>Confidence</TableCell>
                  <TableCell>Status</TableCell>
                  {/* <TableCell>Time</TableCell> */}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results && results.map((result) => (
                  <TableRow key={result.id} hover>
                    <TableCell>
                      <Tooltip title="Click to enlarge">
                        <Box
                          component="img"
                          src={result.imageUrl}
                          alt={result.fileName}
                          onClick={() => setPreviewImage(result)}
                          sx={{
                            width: 64,
                            height: 64,
                            objectFit: 'cover',
                            borderRadius: 2,
                            bgcolor: 'grey.100',
                            cursor: 'zoom-in',
                            '&:hover': { opacity: 0.85 }
                          }}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          maxWidth: 220,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={result.fileName}
                      >
                        {result.fileName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          wordBreak: 'break-all'
                        }}
                      >
                        {result.smiles}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Click to compare original vs predicted">
                        <Box
                          onClick={() => setCompareResult(result)}
                          sx={{
                            width: 96,
                            height: 72,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'common.white',
                            cursor: 'zoom-in',
                            overflow: 'hidden',
                            '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.light' }
                          }}
                        >
                          <MoleculeStructure smiles={result.smiles} width={92} height={68} />
                        </Box>
                      </Tooltip>
                    </TableCell>
                    {/* <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={result.selfies}
                      >
                        {result.selfies}
                      </Typography>
                    </TableCell> */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(result.status)}
                        <Typography variant="body2">{result.confidence}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(result.status)}
                    </TableCell>
                    {/* <TableCell>
                      <Typography variant="body2">{result.processingTime}s</Typography>
                    </TableCell> */}
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Copy SMILES">
                          <IconButton
                            size="small"
                            onClick={() => copyToClipboard(result.smiles, result.id + '-smiles')}
                          >
                            {copiedId === result.id + '-smiles' ? (
                              <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                            ) : (
                              <ContentCopy sx={{ fontSize: 16 }} />
                            )}
                          </IconButton>
                        </Tooltip>
                        {/* <Tooltip title="Copy SELFIES">
                          <IconButton
                            size="small"
                            onClick={() => copyToClipboard(result.selfies, result.id + '-selfies')}
                          >
                            {copiedId === result.id + '-selfies' ? (
                              <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                            ) : (
                              <ContentCopy sx={{ fontSize: 16 }} />
                            )}
                          </IconButton>
                        </Tooltip> */}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Additional Actions */}
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            What's Next?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
            Your chemical structures have been successfully converted. You can now use these SMILES codes
            in your cheminformatics workflows, molecular databases, or chemical analysis tools.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" onClick={onNewUpload}>
              Convert More Structures
            </Button>
            <Button variant="outlined" onClick={downloadResults}>
              Export All Results
            </Button>
          </Box>
        </Paper>

        {/* Image preview modal */}
        <Modal
          open={previewImage !== null}
          onClose={() => setPreviewImage(null)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none'
          }}
        >
          <Box
            onClick={() => setPreviewImage(null)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
              cursor: 'zoom-out',
              maxWidth: '90vw',
              maxHeight: '90vh'
            }}
          >
            {previewImage && (
              <>
                <Box
                  component="img"
                  src={previewImage.imageUrl}
                  alt={previewImage.fileName}
                  sx={{
                    maxWidth: '85vw',
                    maxHeight: '75vh',
                    objectFit: 'contain',
                    borderRadius: 1
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                  {previewImage.fileName}
                </Typography>
              </>
            )}
          </Box>
        </Modal>

        {/* Original vs predicted comparison modal */}
        <Modal
          open={compareResult !== null}
          onClose={() => setCompareResult(null)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none'
          }}
        >
          <Box
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              maxWidth: '95vw',
              maxHeight: '92vh',
              overflow: 'auto'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Original vs Predicted
              </Typography>
              <IconButton size="small" onClick={() => setCompareResult(null)}>
                <Close />
              </IconButton>
            </Box>

            {compareResult && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 3,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Original
                    </Typography>
                    <Box
                      component="img"
                      src={compareResult.imageUrl}
                      alt={compareResult.fileName}
                      sx={{
                        width: 320,
                        height: 280,
                        objectFit: 'contain',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'grey.100'
                      }}
                    />
                  </Box>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Predicted
                    </Typography>
                    <Box
                      sx={{
                        width: 320,
                        height: 280,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'common.white'
                      }}
                    >
                      <MoleculeStructure smiles={compareResult.smiles} width={316} height={276} />
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'monospace', wordBreak: 'break-all', textAlign: 'center' }}
                  >
                    {compareResult.smiles}
                  </Typography>
                  <Tooltip title={copiedId === compareResult.id + '-compare-smiles' ? 'Copied!' : 'Copy SMILES'}>
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(compareResult.smiles, compareResult.id + '-compare-smiles')}
                    >
                      {copiedId === compareResult.id + '-compare-smiles' ? (
                        <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                      ) : (
                        <ContentCopy sx={{ fontSize: 16 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all', textAlign: 'center' }}>
                  {compareResult.fileName}
                </Typography>
              </>
            )}
          </Box>
        </Modal>
      </Container>
    </Box>
  );
}

export default ResultsPage;