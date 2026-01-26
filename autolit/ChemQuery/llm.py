from openai import OpenAI
from typing import List, Union
import json
from utils.slogpkg import GoStyleLogger


# --------------------------------------------------------------------------- #
# Helper Functions
# --------------------------------------------------------------------------- #
def remove_reasoning(slog: GoStyleLogger, response):
    try:
        text_response = response.choices[0].message.content
        if not text_response:
            slog.Error("No message content in response. Check LMStudio.")
            raise RuntimeError("No message content in response. Check LMStudio.")

        # if the response has reasoning, remove it
        elif text_response.find("<think>") != -1:
            end_think = "</think>"
            start = text_response.rfind(end_think)
            text_response = text_response[start + len(end_think) :].strip()

            start_json_block = "```json"
            if text_response.find(start_json_block) != -1:
                text_response = text_response[len("```json") : -4]

        json_response = json.loads(text_response)
        return json_response
    except json.JSONDecodeError:
        # Fallback: return the raw content as a list (if JSON parsing fails)
        slog.Error(
            "Could not parse JSON response. Consider changing models",
            content=response.choices[0].message.content,
        )
        raise RuntimeError(
            f"Could not parse JSON response. Consider changing models. Raw response content: {response.choices[0].message.content}"
        )


# --------------------------------------------------------------------------- #
# Keyword Generation
# TODO: generate_keywords needs to be able to support longer queries from the user, probably by generating multiple sets of keywords
#       then the PMC search needs to be able to join the results of several searches (probably using set union)
# TODO: probably a feedback loop where it generates a set of keywords, if the number of results isn't high enough
# then it regenerates? Or do we ask it how many sets of keywords it thinks it should generate from the get-go?
# --------------------------------------------------------------------------- #
# def generate_keywords(n=1):
#     """

#     Can generate more sets of keywords if the user has a very broad query (e.g., if the user wants both degraders and molecular glues, we might have to do more than one search, so we'd need more than one set of keywords.)
#     """


def generate_keywords(
    slog: GoStyleLogger, client: OpenAI, model: str, target: str, query: str
) -> List[str]:
    sysprompt = """ 
    You are a chemical biology research assistant helping a pharmaceutical chemist search for relevant scientific literature regarding the drug targets of interest.
    You are an expert at generating structured, semantically rich keywords for literature searches.
    Your response must be valid JSON that can be directly parsed.
    """

    userprompt = f"""
    Create a comprehensive list of keywords for drug target "{target}".
    
    Additional context/query: "{query}"
    
    Generate a JSON object with the following structure:
    {{
      "target": "{target}",
      "keywords": [
        "keyword1",
        "keyword2",
        "keyword3"
      ],
      "search_strategy": "description of how these keywords capture the target and query"
    }}
    
    INSTRUCTIONS FOR KEYWORD GENERATION:
    
    1. LIMIT YOURSELF to just a few keywords (1-5). Too many keywords leads to zero search results.
    2. Aim for a precise search
    3. The more keywords you generate, the more comprehensive your literature search will be
    4. The fewer keywords you generate, the more focused your literature search will be
    5. Aim for MAXIMUM RECALL - capture all potentially relevant papers
    6. Aim for MAXIMUM PRECISION - do not include extraneous papers
    7. Include: target names, synonyms, gene symbols, protein families, pathways, disease contexts, therapeutic approaches
    8. DO NOT include: synonyms or expansions of abbreviations.
    
    Example of what TO DO: ["BRAF", "vemurafenib", "melanoma"]
    Example of what NOT to do: ["BRAF", "vemurafenib", "melanoma", "BRAF V600E", "ERK pathway", 
    "kinase inhibitors", "MAPK signaling", "NRAS", "CDKN2A", "PD-1", "immune checkpoint"]
    Example of what NOT to do: ["HIV", "Human Immunodeficiency Virus", ...]
    
    Return ONLY valid JSON - no other text, explanations, or formatting.
    """
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": sysprompt},
            {"role": "user", "content": userprompt},
        ],
    )

    # Parse the JSON response
    json_response = remove_reasoning(slog, response)
    return json_response.get("keywords", [])


# --------------------------------------------------------------------------- #
# Paper Summarization + Information Extraction
# --------------------------------------------------------------------------- #
def generate_paper_summary(
    slog: GoStyleLogger, client: OpenAI, model: str, paper_xml: str
) -> str:
    """
    Generate a comprehensive summary of a scientific paper from XML content.
    The summary is optimized for downstream information extraction tasks.

    Args:
        paper_xml (str): XML content of the scientific paper
        model (str): The LLM model to use

    Returns:
        str: Comprehensive paper summary optimized for downstream extraction
    """

    sysprompt = """ 
    You are a chemical biology research assistant specializing in extracting and synthesizing information from scientific literature.
    Your primary task is to create summaries that will be used by downstream systems to extract specific information from papers.
    The summary should capture all key elements that might be needed for downstream analysis, particularly focusing on drug target relevance.
    """

    userprompt = f"""
    Please analyze the following scientific paper XML content and create a comprehensive summary optimized for downstream information extraction.
    
    The summary should be structured to support efficient downstream processing and should include:
    
    1. **Core Scientific Elements**: All key experimental findings, results, and data points that might be needed for downstream analysis
    2. **Drug Target Relevance**: Any mentions of drug targets, binding affinities, or target-specific information that would be valuable for pharmaceutical research
    3. **Chemical Biology Focus**: Key compounds, structures, mechanisms, or chemical properties relevant to drug discovery
    4. **Methodological Details**: Essential experimental methods, assay conditions, or measurement techniques that might be needed for verification
    5. **Statistical Significance**: Any p-values, confidence intervals, or statistical measures that would be important for downstream analysis
    
    The paper XML content is:
    {paper_xml}
    
    Please provide your summary in the following JSON format that prioritizes downstream extraction:
    {{
      "title": "Paper Title",
      "key_findings": [
        "Finding 1: Detailed description with any quantitative data",
        "Finding 2: Detailed description with any quantitative data"
      ],
      "drug_target_info": [
        "Target name: Description of target relevance",
        "Binding affinity data if available"
      ],
      "chemical_biology_info": [
        "Compound/structure information",
        "Mechanism of action if specified"
      ],
      "methodology": [
        "Key experimental methods",
        "Assay conditions",
        "Statistical approaches"
      ],
      "significance": "Importance for drug target research and pharmaceutical applications",
      "data_points": [
        "Quantitative measurements: value and units",
        "Statistical results: p-values, confidence intervals"
      ]
    }}
    
    Focus on creating a summary that would make downstream extraction as efficient as possible.
    Include all potentially relevant information that might be needed for drug target and pharmaceutical research analysis.
    Prioritize completeness over brevity - capture what might be needed for future processing, even if it seems redundant.
    
    Return ONLY valid JSON - no other text, explanations, or formatting.
    """

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": sysprompt},
            {"role": "user", "content": userprompt},
        ],
    )

    # Parse the JSON response
    json_response = remove_reasoning(slog, response)

    # Create a formatted summary string from the JSON
    summary = f"""
Title: {json_response.get("title", "N/A")}

Key Findings:
{chr(10).join([f"- {finding}" for finding in json_response.get("key_findings", [])])}

Drug Target Information:
{chr(10).join([f"- {info}" for info in json_response.get("drug_target_info", [])])}

Chemical Biology Information:
{chr(10).join([f"- {info}" for info in json_response.get("chemical_biology_info", [])])}

Methodology:
{chr(10).join([f"- {method}" for method in json_response.get("methodology", [])])}

Significance: {json_response.get("significance", "N/A")}

Data Points:
{chr(10).join([f"- {data}" for data in json_response.get("data_points", [])])}
        """
    return summary.strip()


def generate_paper_compounds(
    slog: GoStyleLogger, client: OpenAI, model: str, paper_xml: str, paper_summary: str
) -> Union[int, None]:
    """
    Extract compound information from a paper using the paper summary first.
    If no compounds found in summary, check full paper content and retry.
    Returns the number of compounds found, or None if extraction fails.

    Args:
        paper_xml (str): XML content of the scientific paper
        paper_summary (str): Summary generated by previous function
        model (str): The LLM model to use

    Returns:
        Union[int, None]: Number of compounds found, or None if extraction fails
    """

    sysprompt = """ 
    You are a chemical biology research assistant specializing in extracting compound information from scientific literature.
    Your task is to identify and count all compounds mentioned in the paper that are relevant to drug target research.
    """

    # First attempt: Use only the paper summary
    userprompt = f"""
    Extract compound information from the paper summary provided.
    
    The paper summary contains:
    {paper_summary}
    
    Your task is to identify all compounds mentioned in the paper that are relevant to drug target research.
    
    Please analyze ONLY the summary content and extract:
    1. Compound names (chemical names, systematic names)
    2. Compound structures (SMILES strings, molecular formulas)
    3. Key properties (binding affinities, IC50 values, Ki values)
    4. Target information for each compound (which drug targets they interact with)
    
    Return ONLY a JSON object with the following structure:
    {{
      "retry": false,
      "compound_count": 5,
      "compounds": [
        {{
          "name": "Compound A",
          "smiles": "CC(C)(C)OC(=O)Nc1ccccc1",
          "molecular_formula": "C17H19N3O3",
          "target": "Target X",
          "affinity": "IC50 = 1.2 nM"
        }}
      ]
    }}
    
    If you cannot find any compounds in the summary, return:
    {{
      "retry": true,
      "compound_count": 0,
      "compounds": []
    }}
    
    Return ONLY valid JSON - no other text, explanations, or formatting.
    """
    # First attempt with summary only
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": sysprompt},
            {"role": "user", "content": userprompt},
        ],
    )

    # Parse the JSON response
    json_response = remove_reasoning(slog, response)

    # If retry is true, attempt with full paper content
    if json_response.get("retry", False):
        # Second attempt: Use the full paper XML content
        userprompt_retry = f"""
        Extract compound information from the full paper content.
        
        The paper XML contains:
        {paper_xml}
        
        Your task is to identify all compounds mentioned in the paper that are relevant to drug target research.
        
        Please analyze ONLY the XML content and extract:
        1. Compound names (chemical names, systematic names)
        2. Compound structures (SMILES strings, molecular formulas)
        3. Key properties (binding affinities, IC50 values, DC50 values, Ki values)
        4. Target information for each compound (which drug targets they interact with)
        
        Return ONLY a JSON object with the following structure:
        {{
          "retry": false,
          "compound_count": 5,
          "compounds": [
            {{
              "name": "Compound A",
              "smiles": "CC(C)(C)OC(=O)Nc1ccccc1",
              "molecular_formula": "C17H19N3O3",
              "target": "Target X",
              "affinity": "IC50 = 1.2 nM"
            }}
          ]
        }}
        
        If you cannot find any compounds in the XML content, return:
        {{
          "retry": false,
          "compound_count": 0,
          "compounds": []
        }}
        
        Return ONLY valid JSON - no other text, explanations, or formatting.
        """

        retry_response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": sysprompt},
                {"role": "user", "content": userprompt_retry},
            ],
        )

        retry_json = remove_reasoning(slog, retry_response)
        return retry_json.get("compound_count")

    # If no retry needed, return the count from first attempt
    return json_response.get("compound_count")
