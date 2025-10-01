"""
* This Software is under the MIT License
* Refer to LICENSE or https://opensource.org/licenses/MIT for more information
* Written by ©Kohulan Rajan 2020
"""

import sys
import os
import argparse
import pymupdf  # PyMuPDF
from pathlib import Path
from decimer_segmentation import segment_chemical_structures_from_file
from decimer_segmentation import save_images, get_bnw_image, get_square_image

async def pdf_extract(pdf, segments):
    """
    Extract pages from a PDF using PyMuPDF

    Args:
        pdf: str | Path - path to the input PDF file
        segments: list of tuples or dicts - [(start, end), {'start': int, 'end': int}]
    """
    pdf_path = Path(pdf)

    # Open the source PDF
    src_doc = pymupdf.open(pdf)
    
    # Create separate output files for each segment
    # Create a single output document for all segments
    output_doc = pymupdf.open()

    for segment in segments:
        # Support both dict format {'start': 3, 'end': 3} and tuple format (start, end)
        try:
            start_page, end_page = segment["startPage"], segment["endPage"]
        except (TypeError, KeyError):
            start_page, end_page = segment

        # Convert to 0-based indexing and copy pages
        for page_num in range(start_page - 1, end_page):
            if page_num < src_doc.page_count:  # Check if page exists
                output_doc.insert_pdf(src_doc, from_page=page_num, to_page=page_num)

    # Save the combined document
    output_path = pdf_path.parent / f"{pdf_path.stem}_extracted.pdf"
    output_doc.save(output_path)
    output_doc.close()
    print(f"Combined extraction saved to: {output_path}")
    # Close the source document
    src_doc.close()
    return output_path

def run_extraction(input_path, startPage=1, endPage=1):
    """
    Run the extraction process on the specified PDF document.
    """
    # Step 1: Extract pages from the PDF
    trimmed_pdf_path = pdf_extract(input_path, [(startPage, endPage)])


    return trimmed_pdf_path

def run_segmentation(input_path, output_dir=None):    
    try:
        # Extract chemical structure depictions and save them
        print(f"Processing: {input_path}")
        raw_segments = segment_chemical_structures_from_file(input_path)

        if not raw_segments:
            print("No chemical structures found in the document.")
            return

        # Determine output directory
        if output_dir:
            segment_dir = os.path.join(output_dir, "segments")
        else:
            segment_dir = os.path.join(f"{input_path}_output", "segments")

        # Create output directory if it doesn't exist
        os.makedirs(segment_dir, exist_ok=True)

        filename_base = os.path.splitext(os.path.basename(input_path))[0]

        print(f"Found {len(raw_segments)} chemical structure(s). Saving segments...")

        # Save original segments and store file paths
        file_paths = save_images(raw_segments, segment_dir, f"{filename_base}_orig")

        # Create list of file names for saved segments
        file_names = [os.path.join(segment_dir, f"{filename_base}_orig_{i}.png") for i in range(len(raw_segments))]
        return file_names
    
    except Exception as e:
        print(f"Error processing document: {str(e)}")
        sys.exit(1)


def run_segment_with_extraction(input_path, output_dir=None, startPage=1, endPage=1):
    """
    This script segments chemical structures in a document, saves the original
    segmented images as well as a binarized image and a an undistorted square
    image
    """
    # parser = argparse.ArgumentParser(
    #     description="Segment chemical structures from documents"
    # )
    # parser.add_argument("input_path", help="Path to the input document (PDF or image)")
    # parser.add_argument("--output_dir", help="Custom output directory (optional)")

    # # If no arguments provided, show help
    # if len(sys.argv) == 1:
    #     parser.print_help()
    #     sys.exit(1)

    # args = parser.parse_args()

    # Check if input file exists
    # if not os.path.exists(args.input_path):
    #     print(f"Error: Input file '{args.input_path}' does not exist.")
    #     sys.exit(1)
    
    trimmed_pdf_path = input_path
    # try:
    #     trimmed_pdf_path = await pdf_extract(input_path, [(startPage, endPage)])
    # except Exception as e:
    #     print(f"Error extracting PDF pages: {str(e)}")

    try:
        # Extract chemical structure depictions and save them
        print(f"Processing: {trimmed_pdf_path}")
        raw_segments = segment_chemical_structures_from_file(trimmed_pdf_path)

        if not raw_segments:
            print("No chemical structures found in the document.")
            return

        # Determine output directory
        if output_dir:
            segment_dir = os.path.join(output_dir, "segments")
        else:
            segment_dir = os.path.join(f"{trimmed_pdf_path}_output", "segments")

        # Create output directory if it doesn't exist
        os.makedirs(segment_dir, exist_ok=True)

        filename_base = os.path.splitext(os.path.basename(trimmed_pdf_path))[0]

        print(f"Found {len(raw_segments)} chemical structure(s). Saving segments...")

        # Save original segments and store file paths
        file_paths = save_images(raw_segments, segment_dir, f"{filename_base}_orig")

        # Create list of file names for saved segments
        file_names = [os.path.join(segment_dir, f"{filename_base}_orig_{i}.png") for i in range(len(raw_segments))]
        return file_names
        #print("Original segments saved:")
        #print(file_names)

        # Get binarized segment images
        # binarized_segments = [get_bnw_image(segment) for segment in raw_segments]
        # save_images(binarized_segments, segment_dir, f"{filename_base}_bnw")

        # # Get segments in size 299*299 and save them
        # normalized_segments = [
        #     get_square_image(segment, 299) for segment in raw_segments
        # ]
        # save_images(normalized_segments, segment_dir, f"{filename_base}_norm")

        #print(f"Segments saved at {segment_dir}")

    except Exception as e:
        print(f"Error processing document: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    run_segment()
