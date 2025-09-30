import sys
import torch
from MolNexTR import molnextr
import pandas as pd
import os
import pickle
import argparse

parser = argparse.ArgumentParser("Run MolNexTR on a folder of .pngs  and save results in a .pkl file")
parser.add_argument('--smiles_folder',required=True,help='A folder with .pngs to process',default="real/")
parser.add_argument('--ground_truth',required=True,help='.csv with a SMILES column containing correct SMILES',default='SMILES.csv')
parser.add_argument('--output',required=True,help='output_name',default='molnextr_results.pkl')
args = parser.parse_args()

smiles_data = pd.read_csv(args.ground_truth)
input_folder= args.smiles_folder

#Which model?
MODEL = './checkpoints/molnextr_best.pth'
device = torch.device('cpu')
model = molnextr(MODEL, device)

results = {}

for filename in os.listdir(input_folder):
    if filename.lower().endswith(".png"):
        base_name = os.path.splitext(filename)[0]
        input_path = os.path.join(input_folder, filename)

        IMAGE = input_path
        predictions = model.predict_final_results(IMAGE, return_atoms_bonds=True)

        results[base_name] = predictions

with open(args.output, "wb") as f:
    pickle.dump(results, f)


