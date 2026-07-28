'use client';

import PocketBase from 'pocketbase';

// Postavi ovdje svoj PocketBase URL
// Za lokalni development: http://127.0.0.1:8090
// Za produkciju: https://tvoj-pb-server.com
const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

let pbInstance: PocketBase | null = null;

export function getPocketBase(): PocketBase {
  if (typeof window === 'undefined') {
    // Server-side: uvijek novi instance
    return new PocketBase(POCKETBASE_URL);
  }
  
  if (!pbInstance) {
    pbInstance = new PocketBase(POCKETBASE_URL);
    
    // Auto-obnova auth tokena i sinkronizacija s cookie-jem za middleware
    pbInstance.authStore.onChange((token, model) => {
      if (typeof document !== 'undefined') {
        document.cookie = pbInstance!.authStore.exportToCookie({ httpOnly: false, secure: false });
      }
    });
  }
  
  return pbInstance;
}

export { POCKETBASE_URL };
