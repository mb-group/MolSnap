from ML_model import prediction
import pickle
import os
import glob
import pandas as pd
import random
import argparse
random.seed(42)


parser = argparse.ArgumentParser("Run MolNexTR on a folder of .pngs  and save results in a .pkl file")
parser.add_argument('--folder_path',required=True,help='A folder with .pngs to process',default="real/")
parser.add_argument('--model_path', required=True,help='Model to predict',default="checkpoints/molnextr_best.pth")
parser.add_argument('--output',required=True,help='output_name',default='molnextr_results.csv')
args = parser.parse_args()


# get all image file paths (jpg, png, jpeg, gif, etc.)
image_extensions = ["*.jpg", "*.jpeg", "*.png", "*.gif", "*.bmp", "*.tiff"]

image_paths = []
for ext in image_extensions:
    image_paths.extend(glob.glob(os.path.join(args.folder_path, ext)))


def chunk_list(lst, chunk_size):
    for i in range(0, len(lst), chunk_size):
        yield lst[i:i + chunk_size]

all_results = []
for batch in chunk_list(image_paths, 100):
    print(len(batch))
    print('running')
    #results = prediction.predict_from_image_files(batch, '../MolNexTR/checkpoints/molnextr_best.pth')
    results = prediction.predict_from_image_files(batch, args.model_path)
    all_results.extend(results)   # store results from each batch

df = pd.DataFrame(all_results)
#df['file_path'] = image_paths

# Extract filename and id
filepaths = [os.path.basename(path) for path in image_paths]   # keep filename
image_ids = [os.path.splitext(os.path.basename(path))[0] for path in image_paths]  # remove extension

# Add them to DataFrame
df["filepath"] = filepaths
df["image_id"] = image_ids

# Save to CSV
df.to_csv(args.output, index=False)
