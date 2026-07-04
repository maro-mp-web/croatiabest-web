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
    
    // Auto-obnova auth tokena
    pbInstance.authStore.onChange(() => {
      // Možeš dodati custom logiku ako treba
    });
  }
  
  return pbInstance;
}

export { POCKETBASE_URL };
