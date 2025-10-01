import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Container,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    AppBar,
    Toolbar,
    IconButton,
    Paper
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
    Slideshow,
    Science,
    Biotech,
    Public,
    DarkMode,
    AccountCircle,
    CheckCircle,
    Bolt,
    TrendingUp,
    CloudUpload,
    Psychology,
    GetApp
} from '@mui/icons-material';
import molsnap from '../assets/molsnap.png';
import { useNavigate } from "react-router";

const LandingPage = () => {
    const navigate = useNavigate();

    const onGetStarted = () => {
        // Navigate to upload page
        navigate('/upload');
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Navigation */}
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent' }}>
                <Container maxWidth="xl" >
                    <Toolbar sx={{ justifyContent: 'space-between', py: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                                sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor: 'common.black',
                                    borderRadius: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Science sx={{ color: 'common.white', fontSize: 20 }} />
                            </Box>
                            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                                MolSnap
                            </Typography>
                        </Box>

                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
                            <Button color="inherit" sx={{ color: 'text.secondary' }}>Home</Button>
                            <Button color="inherit" sx={{ color: 'text.secondary' }}>Core Features</Button>
                            <Button color="inherit" sx={{ color: 'text.secondary' }}>Collaboration</Button>
                            <Button color="inherit" sx={{ color: 'text.secondary' }}>Contact</Button>
                        </Box>

                        {/* <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                                sx={{
                                    width: 32,
                                    height: 32,
                                    border: 1,
                                    borderColor: 'grey.300'
                                }}
                            >
                                <DarkMode sx={{ fontSize: 16 }} />
                            </IconButton>
                            <IconButton
                                sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor: 'warning.main'
                                }}
                            >
                                <AccountCircle sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Box> */}
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Main Content */}
            <Container maxWidth="xl" sx={{ py: 8, paddingLeft: { md: 6 }, paddingRight: { md: 6 } }}>
                <Grid container spacing={8} alignItems="center">
                    {/* Left Content */}
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    lineHeight: 1.2,
                                    mb: 3,
                                    color: 'primary.main',
                                    fontWeight: 600
                                }}
                            >
                                Easy SMILES extraction 
                                <br />
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: '1.125rem',
                                    lineHeight: 1.6,
                                    color: 'text.secondary',
                                    maxWidth: 600,
                                    mb: 4
                                }}
                            >
                               MolSnap is an interactive cheminformatics tools to seamlessly extract, convert and export lists of chemical structures from multi-page documents.
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={onGetStarted}
                                sx={{
                                    bgcolor: 'common.black',
                                    color: 'common.white',
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    '&:hover': {
                                        bgcolor: 'grey.800'
                                    }
                                }}
                            >
                                START CONVERTING →
                            </Button>
                        </Box>
                    </Grid>

                    {/* Right Content - Workflow Diagram */}
                    <Grid size={{ xs: 12, lg: 6 }} >
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img
                                src={molsnap}
                                alt="MolSnap workflow"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    borderRadius: 16,
                                    // boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Bottom Section */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
                {/* How It Works */}
                <Box sx={{ textAlign: "center", mt: 10 }}>
                    <Typography
                                variant="h2"
                                sx={{
                                    fontSize: { xs: '2rem', md: '2rem' },
                                    lineHeight: 1.2,
                                    mb: 3,
                                    fontWeight: 600
                                }}
                            >
                        How It Works
                    </Typography>
                    <Grid container spacing={6} justifyContent="center" sx={{ mt: 4 }}>
                        {[
                            {
                                step: "1",
                                title: "Upload Document",
                                desc: "Upload PDF from chemical structure diagrams.",
                            },
                            {
                                step: "2",
                                title: "Select images & AI model",
                                desc: "Choose from our specialized deep learning models for complex classes",
                            },
                            {
                                step: "3",
                                title: "Convert images to SMILES",
                                desc: "Export results in tabular form, with associated confidence metrics.",
                            },
                        ].map((process, index) => (
                            <Grid sx={{ xs: 12, sm: 4 }} key={index}>
                                <Box>
                                    <Box
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: "50%",
                                            backgroundColor: "primary.main",
                                            color: "white",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: "bold",
                                            fontSize: "18px",
                                            mx: "auto",
                                            mb: 2,
                                        }}
                                    >
                                        {process.step}
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        {process.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {process.desc}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Call to Action */}
                <Box
                    sx={{
                        mt: 10,
                        py: 6,
                        px: 4,
                        bgcolor: "grey.100",
                        borderRadius: 2,
                        textAlign: "center",
                    }}
                >
                   <Typography
                                variant="h2"
                                sx={{
                                    fontSize: { xs: '2rem', md: '2rem' },
                                    lineHeight: 1.2,
                                    mb: 3,
                                    fontWeight: 600
                                }}
                            >
                        Ready to Transform Your Workflow?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Join thousands of chemists and researchers who are already using
                        ChemSMILES Converter to accelerate their chemical structure analysis.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{ mt: 2, textTransform: "none" }}
                        onClick={onGetStarted}
                    >
                        Start Your First Conversion
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default LandingPage;