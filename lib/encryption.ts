import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const TAG_POSITION = IV_LENGTH;
const ENCRYPTED_POSITION = IV_LENGTH + TAG_LENGTH;

const ENCRYPTION_KEY_HEX = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY_HEX || ENCRYPTION_KEY_HEX.length !== 64) {
  throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes) in .env.local');
}

const key = Buffer.from(ENCRYPTION_KEY_HEX, 'hex');

export function encrypt(text: string): string {
  if (!text) return '';

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  const tag = cipher.getAuthTag();

  const fullPayload = Buffer.concat([iv, tag, Buffer.from(encrypted, 'base64')]);
  return fullPayload.toString('base64');
}

export function decrypt(encryptedBase64: string): string {
  if (!encryptedBase64) return '';

  const fullPayload = Buffer.from(encryptedBase64, 'base64');
  
  if (fullPayload.length < ENCRYPTED_POSITION) {
      throw new Error('Invalid encrypted payload length');
  }

  const iv = fullPayload.subarray(0, IV_LENGTH);
  const tag = fullPayload.subarray(TAG_POSITION, ENCRYPTED_POSITION);
  const encryptedText = fullPayload.subarray(ENCRYPTED_POSITION).toString('base64');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

export interface RecordItem {
  id: number;
  title: string;
  date: string;
  snippet: string;
  image: string;
}

export const DUMMY_RECORDS: RecordItem[] = [
  { id: 1, title: 'Patient Record Alpha', date: '2025-10-01', snippet: 'Diagnosis: Elevated Creatinine. Follow up required in 2 weeks.', image: 'https://picsum.photos/seed/record1/400/300' },
  { id: 2, title: 'Medical Survey Beta', date: '2025-10-15', snippet: 'Survey Response: High stress levels reported, moderate physical activity.', image: 'https://picsum.photos/seed/record2/400/300' },
  { id: 3, title: 'Lab Results Gamma', date: '2025-10-22', snippet: 'Result: All key markers within the normal range. No immediate concern.', image: 'https://picsum.photos/seed/record3/400/300' },
  { id: 4, title: 'Patient Record Delta', date: '2025-11-05', snippet: 'Diagnosis: Seasonal Flu. Prescribed Oseltamivir for 5 days.', image: 'https://picsum.photos/seed/record4/400/300' },
];