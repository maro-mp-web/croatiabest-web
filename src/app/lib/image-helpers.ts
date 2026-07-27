import { POCKETBASE_URL } from '@/pocketbase/config';

export const getFirstPhoto = (record: any, fieldName: string = 'photoUrls') => {
  if (!record) return '';
  
  let val = record[fieldName];
  if (!val && fieldName === 'photoUrls') {
      val = record['image']; // Fallback for cities/islands which use 'image'
  }
  
  let filename = '';
  
  try {
    if (Array.isArray(val) && val.length > 0) filename = val[0];
    else if (typeof val === 'string') {
      if (val.trim().startsWith('[')) {
        const parsed = JSON.parse(val);
        filename = parsed[0] || '';
      } else {
        filename = val;
      }
    }
  } catch (e) {}

  if (!filename) return '';

  // If it's already an absolute URL, relative path starting with /, or data URI, return it
  if (filename.startsWith('http') || filename.startsWith('data:') || filename.startsWith('/')) {
    return filename;
  }

  // Otherwise, assume it's a native PocketBase filename
  const cid = record.collectionId || record.collectionName;
  if (cid && record.id) {
    return `${POCKETBASE_URL}/api/files/${cid}/${record.id}/${filename}`;
  }

  return filename;
};
