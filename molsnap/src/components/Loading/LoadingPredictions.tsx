import { Box, Container, CircularProgress, Typography } from "@mui/material";

const LoadingPredictions = () => {
    return (
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
    );
}

export default LoadingPredictions;