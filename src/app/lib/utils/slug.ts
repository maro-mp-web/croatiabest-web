export function generateListingUrl(category: string, name: string, id: string): string {
  const safeCategory = (category || 'ostalo').toLowerCase();
  
  // Normalize string to remove diacritics (e.g. š -> s, č -> c)
  const slug = (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphen
    .replace(/(^-|-$)+/g, ''); // Trim leading and trailing hyphens
    
  return `/listing/${safeCategory}/${slug}-${id}`;
}
