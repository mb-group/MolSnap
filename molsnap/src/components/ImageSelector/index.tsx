import React from "react";
import Grid from "@mui/material/Grid";
import {
    Card,
    CardMedia,
    CardActions,
    Checkbox,
    Button,
    Typography,
    Box,
    Chip,
    Divider,
} from "@mui/material";
import { API_ENDPOINTS } from "../../constants";

export interface ImageGroup {
    id: string;
    label: string;
    images: string[];
}

interface ImageSelectorProps {
    images: string[];
    selectedImages: string[];
    /** Optional per-document grouping. When provided, images render under a
     *  heading per document (with its own "Select all") while selection is
     *  still tracked as one flat list across all documents. */
    groups?: ImageGroup[];
    onSelectionChange?: (selected: string[]) => void; // optional callback
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ images, selectedImages, groups, onSelectionChange }) => {
    // Toggle individual selection
    const handleToggle = (url: string) => {
        const newSelection = selectedImages.includes(url)
            ? selectedImages.filter((img) => img !== url)
            : [...selectedImages, url];
        onSelectionChange?.(newSelection);
    };

    // Select / Deselect all (across every document)
    const handleSelectAll = () => {
        const newSelection = selectedImages.length === images.length ? [] : [...images];
        onSelectionChange?.(newSelection);
    };

    // Select / Deselect all images within a single document group
    const handleSelectAllInGroup = (groupImages: string[]) => {
        const allSelected = groupImages.every((url) => selectedImages.includes(url));
        const withoutGroup = selectedImages.filter((url) => !groupImages.includes(url));
        const newSelection = allSelected ? withoutGroup : [...withoutGroup, ...groupImages];
        onSelectionChange?.(newSelection);
    };

    const renderImageCard = (url: string, index: number) => {
        const fullUrl = API_ENDPOINTS.DECIMER_API_URL + '/' + url; // prepend base URL
        return (
            <Grid sx={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={url ?? index}>
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
    };

    const hasGroups = groups && groups.length > 0;

    return (
        <div style={{ padding: 20 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 2, flexWrap: "wrap" }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Parsed Images {images.length > 0 && `(${images.length})`}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSelectAll}
                >
                    {selectedImages.length === images.length && images.length > 0 ? "Deselect All" : "Select All"}
                </Button>
            </Box>

            {hasGroups ? (
                groups!.map((group, gIdx) => {
                    const groupSelectedCount = group.images.filter((url) => selectedImages.includes(url)).length;
                    const allGroupSelected = group.images.length > 0 && groupSelectedCount === group.images.length;
                    return (
                        <Box key={group.id} sx={{ mb: 4 }}>
                            {gIdx > 0 && <Divider sx={{ mb: 3 }} />}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }} title={group.label} noWrap>
                                    {group.label}
                                </Typography>
                                <Chip size="small" label={`${group.images.length} image${group.images.length === 1 ? "" : "s"}`} />
                                {groupSelectedCount > 0 && (
                                    <Chip size="small" color="primary" label={`${groupSelectedCount} selected`} />
                                )}
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleSelectAllInGroup(group.images)}
                                    sx={{ ml: "auto" }}
                                >
                                    {allGroupSelected ? "Deselect all in document" : "Select all in document"}
                                </Button>
                            </Box>
                            <Grid container spacing={2}>
                                {group.images.map((url, index) => renderImageCard(url, index))}
                            </Grid>
                        </Box>
                    );
                })
            ) : (
                <Grid container spacing={2}>
                    {images.map((url, index) => renderImageCard(url, index))}
                </Grid>
            )}
        </div>
    );
};

export default ImageSelector;
