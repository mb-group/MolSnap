## MolNexTR Results on the Validation Datasets. 

### Analysis
run_molnextr.py -- run inside the MolNexTR github folder, make sure checkpoint model is uploaded in checkpoints/

```bash
python ./run_molnextr.py --smiles_folder '../KIDS25-Team6/Validation-Data/real/CLEF/'
--ground_truth '../KIDS25-Team6/Validation-Data/real/CLEF.csv'
--output "../KIDS25-Team6/Results/CLEF/CLEF_molnextr_results.pkl"
```

smiles_similarity.py 

```bash
python ./smiles_similarity.py --molnextr_results ‘Results/CLEF_molnextr_results.pkl’ 
--ground_truth 'Validation-Data/real/CLEF.csv' 
--output ‘Results/CLEF/CLEF_validation_smiles_similarity.csv’
```
### Outputs
Inside each origin dataset folder:
  - .pkl file - MolNexTR results.
  - .csv - The comparison of the true SMILES and the predicted SMILES. Comparison using Tanimoto similarity of Morgan fingerprints ECFP4 and ECFP2, as well normalized Levenshtein distance for string similarity.
  - .docx - document with image comparison of the true SMILES (left) and predicted SMILES (right). molecules_filtered only has molecules with a differing similarity.
