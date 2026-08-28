'use server'
import fs from 'fs';
export async function logError(payload: any, error: any) {
  const logData = {
    timestamp: new Date().toISOString(),
    payload,
    error
  };
  fs.appendFileSync('pb-error.log', JSON.stringify(logData, null, 2) + '\n\n');
}
