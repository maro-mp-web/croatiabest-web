export function generateSlug(name: string): string {
  return (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function generateListingUrl(category: string, name: string, id?: string): string {
  const safeCategory = (category || 'ostalo').toLowerCase();
  const slug = generateSlug(name);
  return `/listing/${safeCategory}/${slug}`;
}
