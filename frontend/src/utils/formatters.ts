export function formatINR(val?: number): string {
  if (val === undefined || val === null || val === 0) return '₹ 0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
}

export function formatCr(val?: number): string {
  if (!val) return '₹ 0 Cr';
  return `₹ ${(val / 10000000).toFixed(2)} Cr`;
}

export function formatCroresShort(val?: number): string {
  if (!val) return '₹ 0 Cr';
  return `₹ ${(val / 10000000).toFixed(1)} Cr`;
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return 'N/A';
  const cleanStr = String(dateStr).trim();
  if (!cleanStr) return 'N/A';

  // Match ISO YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = cleanStr.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`;
  }

  // Match DD-MM-YYYY or DD/MM/YYYY (normalize delimiters to -)
  const dmyMatch = cleanStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    return `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`;
  }

  // Fallback to JS Date parsing
  try {
    const d = new Date(cleanStr);
    if (isNaN(d.getTime())) return cleanStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return cleanStr;
  }
}
