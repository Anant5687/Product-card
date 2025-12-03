import { decrypt, RecordItem } from '@/lib/encryption';
import CardList from './components/CardList';

async function getDecryptedRecords(): Promise<RecordItem[]> {
  const apiRoute = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/records`;
  
  try {
    const res = await fetch(apiRoute, { cache: 'no-store' })
    
    if (!res.ok) {
      throw new Error(`API fetch failed with status: ${res.status}`);
    }

    const { data: encryptedPayload } = await res.json();
    
    const decryptedJsonString = decrypt(encryptedPayload);
    
    const records: RecordItem[] = JSON.parse(decryptedJsonString);
    
    return records;
  } catch (error) {
    console.error('SERVER-SIDE DECRYPTION FAILED:', error);
    return []; 
  }
}

export default async function Home() {
  const records = await getDecryptedRecords();

  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Secure Patient Records
      </h1>
      
      <CardList initialRecords={records} />
    </main>
  );
}