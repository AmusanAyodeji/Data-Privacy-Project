# ndpa/xai_client.py

import os
from openai import OpenAI

# Load key for OpenRouter
OPENROUTER_KEY = os.getenv("OPENROUTER_API_KEY")
if not OPENROUTER_KEY:
    raise RuntimeError("OPENROUTER_API_KEY is missing from .env")

# Configure client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_KEY,
)

MODEL = "x-ai/grok-4.1-fast:free"


def call_xai_compare(system_prompt: str, user_prompt: str) -> str:
    """
    Sends system + user prompt to Grok for NDPA comparison.
    """
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            extra_body={"reasoning": {"enabled": True}},
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"LLM call failed: {str(e)}"


def call_xai_analyze(messages: list) -> str:
    """
    Sends a full multi-message analysis to Grok.
    """
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            extra_body={"reasoning": {"enabled": True}},
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"LLM call failed: {str(e)}"
