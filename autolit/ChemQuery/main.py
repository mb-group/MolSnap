"""
Literature Review Automation

This script aims to give a general overview of the academic literature surrounding the user's desired drug target(s) and relavant related keyword(s).
This script's output is an Excel (.xlsx) spreadsheet containing summaries of relevant literature.
"""

import llm
import ncbi
import utils.slogpkg as slogpkg

from openai import OpenAI
from Bio import Entrez
import pandas as pd
from tqdm import tqdm
import dotenv
import ray
import os

from typing import Dict

# --------------------------------------------------------------------------- #
# LLM + NCBI E-Utilities Constants
# --------------------------------------------------------------------------- #
slog = slogpkg.GoStyleLogger(log_file="./logs/run_4.log")
slog.Info("\nBEGIN EXECUTION")

env: Dict[str, str] = {
    "OPENAI_URL": "",
    "OPENAI_API_KEY": "",
    "MODEL_NAME": "",
    "NCBI_EMAIL": "",
    "NCBI_API_KEY": "",
}

for var in env.keys():
    env[var] = dotenv.get_key(".env", var)  # type: ignore # can be str or None
    if not env[var]:
        slog.Error("Missing required environment variable", variable=var)
        raise RuntimeError(f"Missing environment variable: {var}")


def create_llm_client():
    return OpenAI(base_url=env['OPENAI_URL'], api_key=env["OPENAI_API_KEY"])


global_client = create_llm_client()
slog.Info("Model in use", model=env["MODEL_NAME"])
Entrez.email = env["NCBI_EMAIL"]
Entrez.api_key = env["NCBI_API_KEY"]

ray.shutdown()
os.environ["RAY_DISABLE_METRICS"] = "1"
os.environ["RAY_ACCEL_ENV_VAR_OVERRIDE_ON_ZERO"] = "0"
ray.init(
    ignore_reinit_error=True,
)

# --------------------------------------------------------------------------- #
# User Input
# --------------------------------------------------------------------------- #
target = "CK1α"
query = "Candidate compounds for CK1α degraders"
start_year = 2015
end_year = 2025
slog.Info(
    "Begin pipeline",
    target=target,
    query=query,
    start_year=start_year,
    end_year=end_year,
)

# --------------------------------------------------------------------------- #
# Metadata Setup
# --------------------------------------------------------------------------- #
instance = f"{target}-{query}-{start_year}-{end_year}"
OUTPUT_EXCEL_PATH = instance + ".xlsx"
OUTPUT_METADATA_PATH = instance + ".txt"

# --------------------------------------------------------------------------- #
# Generate (lists of) keywords to search based on user's target and query
# --------------------------------------------------------------------------- #
slog.Info("Generating keywords", model=env["MODEL_NAME"])
keywords = llm.generate_keywords(slog, global_client, env["MODEL_NAME"], target, query)
search_term = ncbi.generate_search_term(keywords, open_access=True)
slog.Info(
    "Constructed search term from keywords", keywords=keywords, search_term=search_term
)

# --------------------------------------------------------------------------- #
# Search PMC for relevant papers and fetch relevant papers in batches
# In Parallel: Process each paper in the batch
# --------------------------------------------------------------------------- #
slog.Info("Searching PMC", query=search_term, start=start_year, end=end_year)
pmcids = ncbi.search_pmc(search_term, start_year, end_year)
n = len(pmcids)
slog.Info("PMC Search Complete", found=n, first10=pmcids[:10])

batch_size = n  # just one batch for now
""" 
Setting the Batch Size

https://biopython.org/docs/1.76/api/Bio.Entrez.html
For Entrez.efetch, automatically uses HTTP POST instead of GET if over 200 identifiers.
Set batch size for batched NCBI E-Utilities fetch requests accordingly.

The P6000 has 96 GB of VRAM, qwenlong-l1.5-30b-a3b is a 32 GB model,
using context size 100k. Set the batch size intelligently to avoid OOM errors from too many concurrent requests.

Note that LMStudio's batched inference support is kind of weak, so for now,
the batch size is just n (so there is only one batch), and each paper is processed sequentially.
"""
slog.Info("Batch size set", size=n)

batches = ncbi.batch_pmcids(pmcids, batch_size=batch_size)


@ray.remote
def process_paper(paper: Dict[str, str]) -> Dict[str, str]:
    # set variables for each worker
    Entrez.email = env["NCBI_EMAIL"]
    Entrez.api_key = env["NCBI_API_KEY"]
    client = create_llm_client()

    pid = os.getpid()
    slog.Info("Set environment for Ray worker", pid=pid)

    # Generate a summary for each paper
    paper_summary: str = llm.generate_paper_summary(
        slog, client, env["MODEL_NAME"], paper["XML_Content"]
    )
    slog.Info("Paper summary complete")

    # Use the summary + original paper to count the number of compounds screened
    res = llm.generate_paper_compounds(
        slog, client, env["MODEL_NAME"], paper["XML_Content"], paper_summary
    )
    n_screened = res if res else 0
    slog.Info("Compounds screened complete")

    processed_paper = paper.copy()
    processed_paper["Summary"] = paper_summary
    processed_paper["Number of Compounds Screened"] = str(n_screened)

    slog.Info("Exiting Ray Worker", pid=pid)
    return processed_paper


first_batch = True

for i, batch in tqdm(enumerate(batches)):
    slog.Info(f"{i} batches processed so far. Begin processing batch {i + 1}:")
    papers = ncbi.fetch_by_pmcid(batch)
    futures = [process_paper.remote(paper) for paper in papers]
    batch_results = ray.get(futures)

    # Convert to DataFrame
    df_batch = pd.DataFrame(batch_results)

    # Save to Excel (append mode for Excel)
    if first_batch:
        # Write first batch with headers
        df_batch.to_excel(OUTPUT_EXCEL_PATH, index=False)
        first_batch = False
    else:
        # Append subsequent batches
        with pd.ExcelWriter(
            OUTPUT_EXCEL_PATH, mode="a", engine="openpyxl", if_sheet_exists="overlay"
        ) as writer:
            # Get current sheet length
            existing_df = pd.read_excel(OUTPUT_EXCEL_PATH)
            start_row = len(existing_df) + 1  # +1 for header
            df_batch.to_excel(writer, index=False, header=False, startrow=start_row)

slog.Info("Paper processing done.")

# --------------------------------------------------------------------------- #
# Write output
# --------------------------------------------------------------------------- #
with open(OUTPUT_METADATA_PATH, "w") as f:
    f.write(f"Metadata for {instance}.csv\n")
    f.write(f"Start Year: {start_year}\n")
    f.write(f"End Year: {end_year}\n")
    f.write(f"User requested target: {target}\n")
    f.write(f"User query: {query}\n")
    f.write("\nKeywords:\n")
    for keyword in keywords:
        f.write(f"  {keyword}\n")
    f.write("\nPMCIDs:\n")
    for pmcid in pmcids:
        f.write(f"  {pmcid}\n")
    f.close()
slog.Info("Metadata writing done.")
