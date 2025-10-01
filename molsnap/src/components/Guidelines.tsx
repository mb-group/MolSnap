import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Alert
} from '@mui/material';
import {
  Description,
} from '@mui/icons-material';

const Guidelines = () => {
    return (
        <Grid sx={{xs:12}}>
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
    )
}

export default Guidelines;