import re
import json
from pathlib import Path
from typing import Dict, Any
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# change 

load_dotenv()

from .xai_client import call_xai_compare

def read_file(path: str) -> str:
    return Path(path).read_text(encoding="utf-8")

def scrape_policy_from_url(url: str) -> str:
    try:
        headers = {"User-Agent": "shadow-data-ndpa-checker/1.0"}
        resp = requests.get(url, timeout=12, headers=headers)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        for tag in soup(["script", "style", "noscript", "header", "footer", "nav", "form"]):
            tag.extract()

        text = soup.get_text(separator="\n", strip=True)
        text = re.sub(r'\n\s*\n+', '\n\n', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    except Exception as e:
        raise RuntimeError(f"Error scraping URL: {e}")

# -------------------------
# System prompt
# -------------------------

SYSTEM_PROMPT = (
    "You are the policy analysis engine for Shadow Data. Your job: read a privacy policy and return a single JSON object "
    "that explains the policy in simple language, extracts key UI details, and assesses both NDPR and GDPR compliance. "
    "You MUST include the fields 'changes_needed_to_be_ndpr_compliant' and 'changes_needed_to_be_gdpr_compliant'. "
    "Return ONLY valid JSON with no commentary."
)

# -------------------------
# Main LLM prompt template
# -------------------------

_PROMPT_TEMPLATE = """
INPUT_POLICY_TEXT:
{policy_text}

INSTRUCTIONS:
Return EXACTLY one JSON object only (no markdown, no commentary). The object must follow this schema:

{{
  "explanation": "string, 1–3 sentences explaining the policy in simple language",

  "data_they_collect": {{
    "items": ["string list of data types"]
  }},

  "usage_and_sharing": {{
    "usage_purposes": ["string list"],
    "third_parties": ["string list"]
  }},

  "deletion_and_your_rights": {{
    "data_retention": "string or 'Not specified'",
    "your_rights": ["string list"]
  }},

  "ndpr_check": {{
    "overall_compliance": "Strong | Partial | Weak | Unknown",
    "strengths": ["string list"],
    "gaps": ["string list"],
    "questions_to_ask": ["string list"]
  }},

  "gdpr_check": {{
    "overall_compliance": "Strong | Partial | Weak | Unknown",
    "strengths": ["string list"],
    "gaps": ["string list"],
    "questions_to_ask": ["string list"]
  }},

  "changes_needed_to_be_ndpr_compliant": [
    "list missing disclosures, rights, processes required under NDPR"
  ],

  "changes_needed_to_be_gdpr_compliant": [
    "list missing disclosures, rights, processes required under GDPR"
  ]
}}

Rules:
- Use [] for missing lists and "Not specified" for missing fields.
- Keep answers neutral and non-legal.
- NDPR evaluation: consent, processing rules, breach reporting, accuracy, minimisation, retention, transfers, DPO/contact person.
- GDPR evaluation: Articles 5–30.
- Output ONLY valid JSON.
"""


# -------------------------
# Call model + parse JSON
# -------------------------

def call_policy_analyzer(policy_text: str) -> Dict[str, Any]:
    user_prompt = _PROMPT_TEMPLATE.format(policy_text=policy_text)
    raw = call_xai_compare(SYSTEM_PROMPT, user_prompt)
    try:
        parsed = json.loads(raw)
    except:
        m = re.search(r'(\{.*\})', raw, re.S)
        parsed = json.loads(m.group(1)) if m else None

    if not isinstance(parsed, dict):
        return {
            "explanation": "Not specified",
            "data_they_collect": {"items": []},
            "usage_and_sharing": {"usage_purposes": [], "third_parties": []},
            "deletion_and_your_rights": {"data_retention": "Not specified", "your_rights": []},
            "ndpr_check": {"overall_compliance": "Unknown", "strengths": [], "gaps": ["Model did not return valid JSON."], "questions_to_ask": []},
            "gdpr_check": {"overall_compliance": "Unknown", "strengths": [], "gaps": ["Model did not return valid JSON."], "questions_to_ask": []},
            "changes_needed_to_be_ndpr_compliant": [],
            "changes_needed_to_be_gdpr_compliant": []
        }

    final = {
        "explanation": parsed.get("explanation", "Not specified"),
        "data_they_collect": parsed.get("data_they_collect", {"items": []}),
        "usage_and_sharing": parsed.get("usage_and_sharing", {"usage_purposes": [], "third_parties": []}),
        "deletion_and_your_rights": parsed.get("deletion_and_your_rights", {"data_retention": "Not specified", "your_rights": []}),
        "ndpr_check": parsed.get("ndpr_check", {"overall_compliance": "Unknown", "strengths": [], "gaps": [], "questions_to_ask": []}),
        "gdpr_check": parsed.get("gdpr_check", {"overall_compliance": "Unknown", "strengths": [], "gaps": [], "questions_to_ask": []}),
        "changes_needed_to_be_ndpr_compliant": parsed.get("changes_needed_to_be_ndpr_compliant", []),
        "changes_needed_to_be_gdpr_compliant": parsed.get("changes_needed_to_be_gdpr_compliant", []),
    }

    def normalize(v):
        if not isinstance(v, str): return "Unknown"
        v = v.lower()
        if v.startswith("strong"): return "Strong"
        if v.startswith("partial"): return "Partial"
        if v.startswith("weak"): return "Weak"
        return "Unknown"

    final["ndpr_check"]["overall_compliance"] = normalize(final["ndpr_check"].get("overall_compliance"))
    final["gdpr_check"]["overall_compliance"] = normalize(final["gdpr_check"].get("overall_compliance"))

    return final

# -------------------------
# Entrypoint
# -------------------------

def analyze_policy_input(input_value: str) -> Dict[str, Any]:
    if input_value.lower().startswith(("http://", "https://")):
        try:
            policy_text = scrape_policy_from_url(input_value)
        except Exception as e:
            return {
                "explanation": "Not specified",
                "data_they_collect": {"items": []},
                "usage_and_sharing": {"usage_purposes": [], "third_parties": []},
                "deletion_and_your_rights": {"data_retention": "Not specified", "your_rights": []},
                "ndpr_check": {"overall_compliance": "Unknown", "strengths": [], "gaps": [str(e)], "questions_to_ask": []},
                "gdpr_check": {"overall_compliance": "Unknown", "strengths": [], "gaps": [str(e)], "questions_to_ask": []},
                "changes_needed_to_be_ndpr_compliant": [],
                "changes_needed_to_be_gdpr_compliant": []
            }
    else:
        policy_text = input_value

    if len(policy_text) > 120000:
        policy_text = policy_text[:120000] + "\n\n[TRUNCATED]"

    return call_policy_analyzer(policy_text)

