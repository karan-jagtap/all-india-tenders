"""
Common Filter Utilities for Backend Services
Provides reusable search matching, string normalization, and faceted filter checks.
"""

from typing import Optional, List, Any, Dict


def normalize_filter_val(val: Optional[str]) -> Optional[str]:
    """Normalizes filter value; returns None if empty or 'ALL'."""
    if not val:
        return None
    s = val.strip()
    if s.upper() == "ALL" or not s:
        return None
    return s


def matches_keyword_search(item_fields: List[Optional[str]], query: Optional[str]) -> bool:
    """Checks whether any item field contains the query terms (case-insensitive)."""
    if not query or not query.strip():
        return True
    
    q_tokens = [tok.lower() for tok in query.strip().split() if tok]
    search_corpus = " ".join([f.lower() for f in item_fields if f])
    
    # All search words must be present in the corpus
    return all(tok in search_corpus for tok in q_tokens)


def matches_exact_or_all(item_value: Optional[str], filter_value: Optional[str]) -> bool:
    """Checks if item_value matches filter_value, ignoring case and treating 'ALL'/None as match."""
    normalized = normalize_filter_val(filter_value)
    if normalized is None:
        return True
    if item_value is None:
        return False
    return item_value.strip().lower() == normalized.strip().lower()
