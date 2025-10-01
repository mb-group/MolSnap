import { useState } from "react";
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
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  Download,
  ContentCopy,
  CheckCircle,
  Warning,
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
    const csvContent = "data:text/csv;charset=utf-8,"
      + "File Name,SMILES,SELFIES,Confidence,Processing Time\n"
      + results.map(result =>
        `"${result.fileName}","${result.smiles}","${result.selfies}",${result.confidence},${result.processingTime}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "chemical_conversion_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                      <Box
                        component="img"
                        src={result.imageUrl}
                        alt={result.fileName}
                        sx={{
                          width: 64,
                          height: 64,
                          objectFit: 'cover',
                          borderRadius: 2,
                          bgcolor: 'grey.100'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                        {result.fileName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={result.smiles}
                      >
                        {result.smiles}
                      </Typography>
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
      </Container>
    </Box>
  );
}

export default ResultsPage;