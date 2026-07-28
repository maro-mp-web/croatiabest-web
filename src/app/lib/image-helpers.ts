import { POCKETBASE_URL } from '@/pocketbase/config';

export const getFirstPhoto = (record: any, fieldName: string = 'photoUrls') => {
  if (!record) return '';
  
  let val = record[fieldName];
  if (!val || (Array.isArray(val) && val.length === 0)) {
    val = record['photoUrls'] || record['photos'] || record['image'] || record['gallery'] || record['media'];
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

  // If it's already an absolute URL or data URI, return it
  if (filename.startsWith('http') || filename.startsWith('data:')) {
    return filename;
  }

  // If it's a relative PocketBase URL (from our migration scripts)
  if (filename.startsWith('/api/files/')) {
    return `${POCKETBASE_URL}${filename}`;
  }

  if (filename.startsWith('/')) {
    return filename;
  }

  // Otherwise, assume it's a native PocketBase filename
  const cid = record.collectionId || record.collectionName;
  if (cid && record.id) {
    return `${POCKETBASE_URL}/api/files/${cid}/${record.id}/${filename}`;
  }

  return filename;
};

export const getAllPhotos = (record: any): string[] => {
  if (!record) return [];
  
  let val = record['photoUrls'] || record['photos'] || record['image'] || record['gallery'] || record['media'];
  if (!val) return [];

  let filenames: string[] = [];
  try {
    if (Array.isArray(val)) {
      filenames = val;
    } else if (typeof val === 'string') {
      if (val.trim().startsWith('[')) {
        filenames = JSON.parse(val);
      } else {
        filenames = [val];
      }
    }
  } catch (e) {}

  const cid = record.collectionId || record.collectionName;
  
  return filenames.map(filename => {
    if (filename.startsWith('http') || filename.startsWith('data:')) {
      return filename;
    }
    
    if (filename.startsWith('/api/files/')) {
      return `${POCKETBASE_URL}${filename}`;
    }

    if (filename.startsWith('/')) {
      return filename;
    }
    
    if (cid && record.id) {
      return `${POCKETBASE_URL}/api/files/${cid}/${record.id}/${filename}`;
    }
    return filename;
  }).filter(Boolean);
};

