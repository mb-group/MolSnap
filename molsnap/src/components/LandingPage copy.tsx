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

interface LandingPageProps {
    onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Navigation */}
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent' }}>
                <Container maxWidth="xl">
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
            <Container maxWidth="xl" sx={{ py: 8 }}>
                <Grid container spacing={8} alignItems="center">
                    {/* Left Content */}
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Box sx={{ mb: 4 }}>
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
                                Chemical image to<br />
                                SMILES converter<br />
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
                                MolSnap simplifies workflows for cheminformatics experts, medicinal chemists,
                                and researchers in chemistry and chemical biology. Automatically scan and interpret
                                images of chemical structures from research articles and convert them into
                                SMILES, SELFIES, or SDF formats with stereochemical precision.
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
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                            {/* Top - Document/Presentation */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        bgcolor: 'primary.main',
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2
                                    }}
                                >
                                    <Slideshow sx={{ color: 'common.white', fontSize: 32 }} />
                                </Paper>
                            </Box>

                            {/* Connecting Lines */}
                            <Box sx={{ position: 'relative', width: '100%', height: 128 }}>
                                {/* Vertical line down */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: '50%',
                                        top: 0,
                                        width: 2,
                                        height: 32,
                                        bgcolor: 'grey.400',
                                        transform: 'translateX(-50%)'
                                    }}
                                />

                                {/* Horizontal line */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: '25%',
                                        top: 32,
                                        width: '50%',
                                        height: 2,
                                        bgcolor: 'grey.400'
                                    }}
                                />

                                {/* Three vertical lines down */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: '25%',
                                        top: 32,
                                        width: 2,
                                        height: 32,
                                        bgcolor: 'success.main',
                                        transform: 'translateX(-50%)'
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: '50%',
                                        top: 32,
                                        width: 2,
                                        height: 32,
                                        bgcolor: 'warning.main',
                                        transform: 'translateX(-50%)'
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        right: '25%',
                                        top: 32,
                                        width: 2,
                                        height: 32,
                                        bgcolor: 'primary.main',
                                        transform: 'translateX(50%)'
                                    }}
                                />
                            </Box>

                            {/* Three Processing Steps */}
                            <Grid container spacing={4}>
                                {/* Molecular Detection */}
                                <Grid size={{ xs: 4 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                        <Paper
                                            elevation={1}
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                bgcolor: 'success.light',
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mb: 1.5
                                            }}
                                        >
                                            <Science sx={{ color: 'success.main', fontSize: 24 }} />
                                        </Paper>
                                        <Typography variant="caption" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                                            Image Scanning<br />and Interpretation
                                        </Typography>
                                    </Box>
                                </Grid>

                                {/* Chemical Reaction Extraction */}
                                <Grid size={{ xs: 4 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                        <Paper
                                            elevation={1}
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                bgcolor: 'warning.light',
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mb: 1.5
                                            }}
                                        >
                                            <Biotech sx={{ color: 'warning.main', fontSize: 24 }} />
                                        </Paper>
                                        <Typography variant="caption" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                                            Format Conversion<br />SMILES • SELFIES • SDF
                                        </Typography>
                                    </Box>
                                </Grid>

                                {/* Global Molecular Correlation */}
                                <Grid size={{ xs: 4 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                        <Paper
                                            elevation={1}
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                bgcolor: 'primary.light',
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mb: 1.5
                                            }}
                                        >
                                            <Public sx={{ color: 'primary.main', fontSize: 24 }} />
                                        </Paper>
                                        <Typography variant="caption" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                                            Workflow Integration<br />ChemDraw • Excel
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Connecting Lines to Output */}
                            <Box sx={{ position: 'relative', width: '100%', height: 64 }}>
                                {/* Three vertical lines down */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: '25%',
                                        top: 0,
                                        width: 2,
                                        height: 32,
                                        bgcolor: 'success.main',
                                        transform: 'translateX(-50%)'
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: '50%',
                                        top: 0,
                                        width: 2,
                                        height: 32,
                                        bgcolor: 'warning.main',
                                        transform: 'translateX(-50%)'
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        right: '25%',
                                        top: 0,
                                        width: 2,
                                        height: 32,
                                        bgcolor: 'primary.main',
                                        transform: 'translateX(50%)'
                                    }}
                                />

                                {/* Horizontal line */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: '25%',
                                        top: 32,
                                        width: '50%',
                                        height: 2,
                                        bgcolor: 'grey.400'
                                    }}
                                />

                                {/* Final vertical line down */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: '50%',
                                        top: 32,
                                        width: 2,
                                        height: 32,
                                        bgcolor: 'grey.400',
                                        transform: 'translateX(-50%)'
                                    }}
                                />
                            </Box>

                            {/* Bottom - Structured Output */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Paper
                                    elevation={1}
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        bgcolor: 'grey.100',
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 1.5
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 32,
                                            height: 24,
                                            bgcolor: 'grey.400',
                                            borderRadius: 0.5
                                        }}
                                    />
                                </Paper>
                                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                    Ready-to-Use Output
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Bottom Section */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
                {/* <Box sx={{ textAlign: "center", mb: 6 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Key Features
                    </Typography>
                </Box>

                {/* Feature Cards */}
                <Grid container spacing={4} justifyContent="center">
                    {[
                        {
                            title: "Stereochemical Precision",
                            desc: "Accurate recognition of stereochemistry and atom positioning",
                            items: [
                                "Chiral center detection",
                                "Bond angle recognition",
                                "Aromatic system detection",
                            ],
                        },
                        {
                            title: "Seamless Integration",
                            desc: "Easy integration with existing chemistry tools and workflows",
                            items: [
                                "ChemDraw compatibility",
                                "Excel export ready",
                                "Multiple output formats",
                            ],
                        },
                        {
                            title: "Scalable Solution",
                            desc: "Handle diverse chemical datasets with high accuracy",
                            items: [
                                "Batch processing",
                                "High-resolution support",
                                "API access available",
                            ],
                        },
                    ].map((feature, index) => (
                        <Grid sx={{ md: 4 }} key={index}>
                            <Card elevation={2} sx={{ height: "100%" }}>
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        gutterBottom
                                        align="center"
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        align="center"
                                        gutterBottom
                                    >
                                        {feature.desc}
                                    </Typography>
                                    <List dense>
                                        {feature.items.map((item, i) => (
                                            <ListItem key={i}>
                                                <ListItemIcon>
                                                    <CheckCircleIcon color="success" fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText primary={item} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid> 

                {/* How It Works */}
                <Box sx={{ textAlign: "center", mt: 10 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        How It Works
                    </Typography>
                    <Grid container spacing={6} justifyContent="center" sx={{ mt: 4 }}>
                        {[
                            {
                                step: "1",
                                title: "Upload Image",
                                desc: "Upload chemical structure images from research articles, drawings, or screenshots",
                            },
                            {
                                step: "2",
                                title: "AI Processing",
                                desc: "Our deep learning model analyzes the structure with stereochemical precision",
                            },
                            {
                                step: "3",
                                title: "Get Results",
                                desc: "Receive accurate SMILES, SELFIES, or SDF format output ready for your workflow",
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
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
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
                    >
                        Start Your First Conversion
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}