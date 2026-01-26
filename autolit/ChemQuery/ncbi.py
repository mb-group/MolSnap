from Bio import Entrez
from typing import List, Dict
import xml.etree.ElementTree as ET


# --------------------------------------------------------------------------- #
# Helper Functions
# --------------------------------------------------------------------------- #
def generate_search_term(keywords: List[str], open_access=True) -> str:
    if open_access:
        keywords.append("open access[filter]")
    search_term = " AND ".join(keywords)
    return search_term


def batch_pmcids(pmcids: List[str], batch_size: int) -> List[List[str]]:
    batch_sizes = [batch_size] * (len(pmcids) // batch_size)
    batch_sizes.append(len(pmcids) % batch_size)
    batch_start_indices = [sum(batch_sizes[0:i]) for i in range(len(batch_sizes))]

    batches = []
    for i in range(len(batch_sizes)):
        start: int = batch_start_indices[i]
        end: int = batch_start_indices[i] + batch_sizes[i]
        batch: List[str] = list(pmcids[start:end])
        batches.append(batch)

    return batches


# --------------------------------------------------------------------------- #
# Search by query and and Fetch by PMCID
# --------------------------------------------------------------------------- #
def search_pmc(search_term: str, start_year: int, end_year: int) -> List[str]:
    handle = Entrez.esearch(
        db="pmc", term=search_term, mindate=str(start_year), maxdate=str(end_year)
    )
    record = Entrez.read(handle)
    if not record:
        raise RuntimeError("E-Utilities search returned null result")
    pmcids = [str(id) for id in record["IdList"]]  # type: ignore # is actually a dictionary but wtv.
    handle.close()

    return pmcids


def fetch_by_pmcid(batch: List[str]) -> List[Dict[str, str]]:
    ids = ",".join(batch)

    # NCBI E-Utilties: get paper summarries for metadata
    handle = Entrez.esummary(
        db="pmc", id=ids, retmode="xml", retmax=min(10000, len(batch))
    )
    records = [r for r in Entrez.parse(handle)]

    handle.close()

    # NCBI E-Utilties: fetch the paper XMLs corresp. to the PMCIDs
    handle = Entrez.efetch(
        db="pmc", id=ids, retmode="xml", retmax=min(10000, len(batch))
    )
    raw_xml = handle.read()
    handle.close()

    # Parse the XML
    root = ET.fromstring(raw_xml)

    article_elements = root.findall(".//article") or [root]

    papers = []
    for paper_pmcid, article, record in zip(batch, article_elements, records):
        # Sanity Check
        assert paper_pmcid == record["Id"], (
            f"Expected paper PMCID {paper_pmcid} == record['Id'] {record['Id']}"
        )

        paper_content = []

        # keep the asbtract if possible
        front_element = root.find("front")
        if front_element:
            abstract = front_element.find("abstract")
            if abstract:
                abstract_content = ET.tostring(abstract, encoding="unicode")
                paper_content.append(abstract_content)

        # ignore all the metadata stuff which we can get from esummary, which is tagged with <front></front>
        # just keep the body if we can
        whole_content = ET.tostring(article, encoding="unicode")
        try:
            body_element = root.find("body")
            if body_element:
                paper_content.append(ET.tostring(body_element, encoding="unicode"))
        except ET.ParseError:
            body_string = "<body>"
            paper_content.append(
                whole_content[whole_content.find(body_string) + len(body_string) :]
            )

        # fallback: if we have no paper content,
        # just extract the XML content as string
        if not paper_content:
            paper_content.append(whole_content)

        xml_content = "".join(paper_content)

        papers.append(
            {
                "PMCID": paper_pmcid,
                "Title": record["Title"],
                "Year": record["PubDate"][:4],  # first 4 chars,
                "DOI": record["DOI"],
                "XML_Content": xml_content,
            }
        )

    return papers
