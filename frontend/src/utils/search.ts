import { CurrentTender } from '../types/tender';

export function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildSearchBlob(tender: CurrentTender): string {
  return [
    tender.title,
    tender.organization,
    tender.ministry || '',
    tender.nit_number,
    tender.state || '',
    tender.city || '',
    tender.source_portal,
    tender.category,
    tender.scope_summary || '',
    tender.ogd_resource_id || '',
    tender.departmental_channel || ''
  ]
    .join(' ')
    .toLowerCase();
}
