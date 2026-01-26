# Downloading the Data from [NCBI](https://ftp.ncbi.nlm.nih.gov/pubchem/Literature/)
- `cid_literature.tsv.gz`
- `literature_linked_to_cid.tsv.gz`

```sh
curl -O https://ftp.ncbi.nlm.nih.gov/pubchem/Literature/cid_literature.tsv.gz --output-dir raw/
curl -O https://ftp.ncbi.nlm.nih.gov/pubchem/Literature/literature_linked_to_cid.tsv.gz --output-dir raw/
cd raw/
gzip -d cid_literature.tsv.gz
gzip -d literature_linked_to_cid.tsv.gz
```

# Sanity Checks
```bash
head -n 5 cid_literature.tsv
# cid     pclid
# 158981804       100
# 857560  100
# 111063  10000
# 129628165       10000

head -n 15 literature_linked_to_cid.tsv 
# pclid   pmids   dois    pmcid   citation
# 100     459668                  Labar B, Nazor A, Reiner Z, Popijac S, Polovina J. [Enzyme activities in the erythrocytes of patients with hemolysis (author's transl)]. Lijec Vjesn. 1979 Feb;101(2):101–4. PMID: 459668.
# 10000   469572  10.1007/bf01175560              Crow T, Heldman E, Hacopian V, Enos R, Alkon DL. Ultrastructure of photoreceptors in the eye of Hermissenda labelled with intracellular injections of horseradish peroxidase. J Neurocytol. 1979 Apr;8(2):181–95. doi: 10.1007/bf01175560. PMID: 469572.
# 1000000 16323252        10.1002/gps.1424                Baldwin RC, Gallagley A, Gourlay M, Jackson A, Burns A. Prognosis of late life depression: a three-year cohort study of outcome and potential predictors. Int J Geriatr Psychiatry. 2006 Jan;21(1):57–63. doi: 10.1002/gps.1424. PMID: 16323252.
# 10000000        23402441        10.1586/erp.12.89               Henriksson M, Janzon M. Cost–effectiveness of ticagrelor in acute coronary syndromes. Expert Review of Pharmacoeconomics & Outcomes Research. 2013 Feb;13(1):9–18. doi: 10.1586/erp.12.89.
# 10000002        23402443        10.1586/erp.12.79               Marshall S, Fearon P, Dawson J, Quinn TJ. Stop the clots, but at what cost? Pharmacoeconomics of dabigatran etexilate for the prevention of stroke in subjects with atrial fibrillation: a systematic literature review. Expert Review of Pharmacoeconomics & Outcomes Research. 2013 Feb;13(1):29–42. doi: 10.1586/erp.12.79.
# 1000001 16323253        10.1002/gps.1402                Takeda A, Loveman E, Clegg A, Kirby J, Picot J, Payne E, Green C. A systematic review of the clinical effectiveness of donepezil, rivastigmine and galantamine on cognition, quality of life and adverse events in Alzheimer's disease. Int J Geriat Psychiatry. 2005 Dec 02;21(1):17–28. doi: 10.1002/gps.1402.
# 10000012        23402452        10.1586/erp.12.80               Willis WD, Diago-Cabezudo JI, Madec-Hily A, Aslam A. Medical resource use, disturbance of daily life and burden of hypoglycemia in insulin-treated patients with diabetes: results from a European online survey. Expert Review of Pharmacoeconomics & Outcomes Research. 2013 Feb;13(1):123–30. doi: 10.1586/erp.12.80.
# 10000018        23402460        10.1016/j.pop.2012.11.010               Nicklas JM, Bleske BE, Van Harrison R, Hogikyan RV, Kwok Y, Chavey WE. Heart failure: clinical problem and management issues. Prim Care. 2013 Mar;40(1):17–42. doi: 10.1016/j.pop.2012.11.010. PMID: 23402460.
# 10000022        23402464        10.1016/j.pop.2012.11.011               Dittus C, Ansell J. The Evolution of Oral Anticoagulant Therapy. Primary Care: Clinics in Office Practice. 2013 Mar;40(1):109–34. doi: 10.1016/j.pop.2012.11.011.
# 10000027        23402469        10.1016/j.pop.2012.11.003       PMC3572442      Nelson RH. Hyperlipidemia as a Risk Factor for Cardiovascular Disease. Primary Care: Clinics in Office Practice. 2013 Mar;40(1):195–211. doi: 10.1016/j.pop.2012.11.003.
# 10000031        23402473        10.1021/jf304997r               Song Y, Liu M, Wang S. Surface plasmon resonance sensor for phosmet of agricultural products at the ppt detection level. J Agric Food Chem. 2013 Mar 20;61(11):2625–30. doi: 10.1021/jf304997r. PMID: 23402473.
# 10000032        23402474        10.1186/1745-6215-14-41 PMC3598957      Richards SM, Burrett JA. A proposal for reducing the effect of one of many causes of publication bias. Trials. 2013 Feb 12;14():41. PMID: 23402474; PMCID: PMC3598957.
# 10000033        23402475        10.1021/jp3113655               Souza MI, Jaques YM, de Andrade GP, Ribeiro AO, da Silva ER, Fileti EE, Ávilla Éde S, Pinheiro MV, Krambrock K, Alves WA. Structural and photophysical properties of peptide micro/nanotubes functionalized with hypericin. J Phys Chem B. 2013 Mar 07;117(9):2605–14. doi: 10.1021/jp3113655. PMID: 23402475.
# 10000034        23402476        10.3109/10641963.2013.764892            Okura T, Miyoshi K, Irita J, Enomoto D, Jotoku M, Nagao T, Watanabe K, Matsuoka H, Ashihara T, Higaki J; Ehime Study, Effect of Anti-hypertensive therapy on Regression of Cardiac Hypertrophy (E-SEARCH) trial investigators. Comparison of the effect of combination therapy with an angiotensin II receptor blocker and either a low-dose diuretic or calcium channel blocker on cardiac hypertrophy in patients with hypertension. Clin Exp Hypertens. 2013;35(8):563–9. doi: 10.3109/10641963.2013.764892. PMID: 23402476.

wc -l cid_literature.tsv
# 89418022 cid_literature.tsv

wc -l head -n 5 literature_linked_to_cid.tsv
# 16564667 literature_linked_to_cid.tsv
```
$\frac{89418022 \text{ CIDs}}{16564667 \text{ PCLIDs}} \approx 5.4$ compounds per paper, which seems feasible.