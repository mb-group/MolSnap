import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import {
    Card,
    CardMedia,
    CardActions,
    Checkbox,
    Button,
    Typography,
} from "@mui/material";
import { API_ENDPOINTS } from "../../constants";

interface ImageSelectorProps {
    images: string[];
    onSelectionChange?: (selected: string[]) => void; // optional callback
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ images, onSelectionChange }) => {
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    // Toggle individual selection
    const handleToggle = (url: string) => {
        setSelectedImages((prev) => {
            const newSelection = prev.includes(url)
                ? prev.filter((img) => img !== url)
                : [...prev, url];

            if (onSelectionChange) {
                onSelectionChange(newSelection);
            }
            return newSelection;
        });
    };

    // Select / Deselect all
    const handleSelectAll = () => {
        let newSelection: string[];
        if (selectedImages.length === images.length) {
            newSelection = [];
        } else {
            newSelection = [...images];
        }
        setSelectedImages(newSelection);
        if (onSelectionChange) {
            onSelectionChange(newSelection);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSelectAll}
                >
                    {selectedImages.length === images.length ? "Deselect All" : "Select All"}
                </Button>
                {/* <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSubmit}
                >
                    Get SMILES 
                </Button> */}
            </div>

            <Grid container spacing={2}>
                {images.map((url, index) => {
                    const fullUrl = API_ENDPOINTS.DECIMER_API_URL + '/' + url; // prepend base URL
                    return (
                        <Grid sx={{xs:12, sm: 6, md: 4, lg: 3}} key={index}>
                            <Card
                                sx={{
                                    border: "2px solid",
                                    borderColor: selectedImages.includes(url) ? "blue" : "transparent",
                                    boxShadow: selectedImages.includes(url) ? "0 0 8px rgba(0,0,255,0.2)" : "none",
                                    transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
                                    "&:hover": { transform: "scale(1.02)" },
                                    cursor: "pointer",
                                }}
                                onClick={() => handleToggle(url)}
                            >
                                <CardMedia
                                    component="img"
                                    height="160"
                                    image={fullUrl}
                                    alt={`img-${index}`}
                                />
                                <CardActions sx={{ justifyContent: "center" }}>
                                    <Checkbox
                                        checked={selectedImages.includes(url)}
                                        onChange={() => handleToggle(url)}
                                        onClick={(e) => e.stopPropagation()} // prevent double toggle when clicking checkbox
                                    />
                                    <Typography variant="body2">Select</Typography>
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </div>
    );
};

export default ImageSelector;
