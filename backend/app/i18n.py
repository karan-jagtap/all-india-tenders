"""
Backend i18n translation utility for All India Tenders.
Loads shared translation definitions from frontend/src/i18n/en.json
to keep backend generated documents (PDFs, notifications) and frontend in sync.
"""

import json
import os
import re
from functools import lru_cache
from typing import Any, Dict

# Candidate paths where translation dictionary resides
_CANDIDATE_PATHS = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "src", "i18n", "en.json")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "data", "en.json")),
    os.path.abspath(os.path.join(os.getcwd(), "frontend", "src", "i18n", "en.json")),
]

_FALLBACK_TRANSLATIONS: Dict[str, Any] = {
    "ai": "[AI]",
    "common": {
        "ai": "[AI]"
    }
}


@lru_cache(maxsize=1)
def get_translations() -> Dict[str, Any]:
    """Loads and caches the i18n JSON translations from disk."""
    for path in _CANDIDATE_PATHS:
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                continue
    return _FALLBACK_TRANSLATIONS


def t(key: str, default: str = "", **kwargs: Any) -> str:
    """
    Look up a key in the translation dictionary using dot-notation.
    Recursively resolves nested $t(...) references and interpolates {{variable}} placeholders.

    Example:
        t("common.ai") -> "[AI]"
        t("wholeTenderDoc.previewTitle", nitNumber="NIT-123") -> "[AI] Whole Tender Document Preview - NIT-123"
    """
    translations = get_translations()
    parts = key.split(".")
    curr: Any = translations

    for part in parts:
        if isinstance(curr, dict) and part in curr:
            curr = curr[part]
        else:
            return default or key

    if isinstance(curr, str):
        # Resolve nested $t(...) references
        if "$t(" in curr:
            curr = re.sub(r"\$t\((.*?)\)", lambda m: t(m.group(1).strip()), curr)
        # Interpolate {{param}} placeholders
        for k, v in kwargs.items():
            curr = curr.replace(f"{{{{{k}}}}}", str(v))
        return curr

    return str(curr)
