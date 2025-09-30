import sys
import pandas as pd
import numpy as np
import os
from rdkit import Chem
import pickle
from rdkit.Chem import AllChem, DataStructs
import Levenshtein
import argparse


parser = argparse.ArgumentParser("Calculate similarity of SMILES using Morganfinger prints and string similarity across a predicted SMILE and the true SMILE")
parser.add_argument('--molnextr_results',required=True,help='.pkl file for the prediction results',default="molnextr_results.pkl")
parser.add_argument('--ground_truth',required=True,help='.csv with a SMILES column containing correct SMILES',default='SMILES.csv')
parser.add_argument('--output',required=True,help='output_name',default='smiles_similarity.csv')
args = parser.parse_args()

#Load MolNexTR Predictions
with open(args.molnextr_results, "rb") as f:
    loaded_results = pickle.load(f)

#Load Ground Truth
df = pd.read_csv(args.ground_truth)

df["filename"] = df["file_path"].apply(lambda x: os.path.splitext(os.path.basename(x))[0])

#Map filenames to dictionary entries
df["prediction"] = df["filename"].map(loaded_results)

#Expand dictionary entries into new columns
df = pd.concat([df.drop(columns=["prediction"]), df["prediction"].apply(pd.Series)], axis=1)

similarities = []
similarities_rad1 = []
string_similarities = []

for idx in df.index:
    smiles_true = df.loc[idx, "SMILES"]
    smiles_pred = df.loc[idx, "predicted_smiles"]

    # Convert SMILES to RDKit Mol objects
    mol_true = Chem.MolFromSmiles(smiles_true)
    mol_pred = Chem.MolFromSmiles(smiles_pred)

    if mol_true is None or mol_pred is None:
        similarity = "Not Valid"
        similarity_rad1 = "Not Valid"
        print('Similarity is Not Valid')
    else:
        #Radius 2
        fp1 = AllChem.GetMorganFingerprintAsBitVect(mol_true, radius=2, nBits=2048)
        fp2 = AllChem.GetMorganFingerprintAsBitVect(mol_pred, radius=2, nBits=2048)
        similarity = DataStructs.TanimotoSimilarity(fp1, fp2)
        
        #Radius 1
        fp1_rad1 = AllChem.GetMorganFingerprintAsBitVect(mol_true, radius=1, nBits=2048)
        fp2_rad1 = AllChem.GetMorganFingerprintAsBitVect(mol_pred, radius=1, nBits=2048)
        similarity_rad1 = DataStructs.TanimotoSimilarity(fp1_rad1, fp2_rad1)

    similarities.append(similarity)
    similarities_rad1.append(similarity_rad1)

    distance = Levenshtein.distance(smiles_true, smiles_pred)

    # Normalized similarity (0–1)
    string_similarity = 1 - distance / max(len(smiles_true), len(smiles_pred))
    string_similarities.append(string_similarity)


# Add results as a new column
df["morganfingerprint_similarity_rad2"] = similarities
df["morganfingerprint_similarity_rad1"] = similarities_rad1
df['string_similarity'] = string_similarities


# Save to CSV
df.to_csv(args.output, index=False)

print("Similarity values added and saved")
