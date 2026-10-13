import { POCKETBASE_URL } from '@/pocketbase/config';

export const isDummyPlaceholderPhoto = (url: string | null | undefined): boolean => {
  if (!url || typeof url !== 'string' || !url.trim()) return true;
  // Statičke placeholder slike iz javnih foldera
  if (url.startsWith('/cities/') || url.startsWith('/islands/')) return true;
  // Poznate zamjenske/testne fotografije (odijelo, buldog, tropski bungalov, yosemite...)
  if (
    url.includes('split_nlvc5gl6vg') ||
    url.includes('rovinj_5zf8u5llsi') ||
    url.includes('varazdin_ye6xvp9z2k') ||
    url.includes('hvar_yjgpnluhiv') ||
    url.includes('cres_swkm9fkk8d') ||
    url.includes('krk_5wat5fshmt') ||
    url.includes('mljet_yaq2teuiv2') ||
    url.includes('picsum.photos')
  ) {
    return true;
  }
  return false;
};

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

  // If it's a blocked Google Maps Street View URL, ignore it so the fallback image shows
  if (filename.includes('maps.googleapis.com') || isDummyPlaceholderPhoto(filename)) {
    return '';
  }

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

