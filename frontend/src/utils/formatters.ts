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

export function formatDate(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}
