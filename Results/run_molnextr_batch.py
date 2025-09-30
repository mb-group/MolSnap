import sys
import torch
from MolNexTR import molnextr
import pandas as pd
import os
import pickle
import argparse
from datetime import datetime
import time

parser = argparse.ArgumentParser("Run MolNexTR on a folder of .pngs  and save results in a .pkl file")
parser.add_argument('--smiles_folder',required=True,help='A folder with .pngs to process',default="real/")
parser.add_argument('--ground_truth',required=True,help='.csv with a SMILES column containing correct SMILES',default='SMILES.csv')
parser.add_argument('--output',required=True,help='output_name',default='molnextr_results.pkl')
parser.add_argument('--batch_size', type=int, default=100, help='Number of images per batch')
parser.add_argument('--batch', type=int, required=True, help='Which batch index to run (1-based)')

args = parser.parse_args()

# Start timer
batch_start = time.time()

smiles_data = pd.read_csv(args.ground_truth)
input_folder= args.smiles_folder

# Collect and sort files
all_files = [f for f in os.listdir(input_folder) if f.lower().endswith(".png")]
all_files.sort()

# Calculate slice
start = (args.batch - 1) * args.batch_size
end = min(args.batch * args.batch_size, len(all_files))
batch_files = all_files[start:end]

if not batch_files:
    print(f"No files left for batch {args.batch}. Total files = {len(all_files)}")
    sys.exit(0)

#Which model?
MODEL = './checkpoints/molnextr_best.pth'
device = torch.device('cpu')
model = molnextr(MODEL, device)

results = {}
for filename in batch_files:
    base_name = os.path.splitext(filename)[0]
    input_path = os.path.join(input_folder, filename)

    IMAGE = input_path
    predictions = model.predict_final_results(IMAGE, return_atoms_bonds=True)

    results[base_name] = predictions
    
# Timestamp for uniqueness
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
batch_output = f"{args.output}_batch{args.batch}_{timestamp}.pkl"

with open(os.path.join('chemdraw/', batch_output), "wb") as f:
    pickle.dump(results, f)

# End timer
batch_end = time.time()
elapsed = batch_end - batch_start

print(f"Processed batch {args.batch}, saved to {batch_output}")
print(f"Batch {args.batch} runtime: {elapsed:.2f} seconds ({elapsed/60:.2f} minutes)")



