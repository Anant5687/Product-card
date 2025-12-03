import { NextResponse } from 'next/server';
import { encrypt, DUMMY_RECORDS } from '@/lib/encryption';

export async function GET() {
  try {
    const jsonPayload = JSON.stringify(DUMMY_RECORDS);

    const encryptedPayload = encrypt(jsonPayload);

    return NextResponse.json({ 
      data: encryptedPayload,
      message: 'Data encrypted and served.' 
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to encrypt and serve data' }, 
      { status: 500 }
    );
  }
}