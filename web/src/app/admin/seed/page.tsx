'use client';

import { useState } from 'react';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  async function runSeed(batch = 100, start = 0) {
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/seed-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: batch, offset: start }),
      });
      const json = await res.json();
      setResult(JSON.stringify(json, null, 2));
    } catch (e: any) {
      setResult(e?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  async function translateMissing() {
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/translate-missing', { method: 'POST' });
      const json = await res.json();
      setResult(JSON.stringify(json, null, 2));
    } catch (e: any) {
      setResult(e?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 pt-6 pb-20 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Seed Quotes</h1>
      <p className="text-gray-600 text-sm mb-4">Импортировать и перевести цитаты в базу</p>

      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => runSeed(100, 0)} disabled={loading} className="px-3 py-2 rounded-md bg-yellow-600 text-white text-sm disabled:opacity-50">
          {loading ? 'Выполняется…' : 'Импортировать 100'}
        </button>
        <button onClick={() => runSeed(500, 0)} disabled={loading} className="px-3 py-2 rounded-md bg-yellow-600 text-white text-sm disabled:opacity-50">
          {loading ? 'Выполняется…' : 'Импортировать 500'}
        </button>
        <button onClick={translateMissing} disabled={loading} className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm disabled:opacity-50">
          {loading ? 'Выполняется…' : 'Перевести существующие'}
        </button>
      </div>

      {!!result && (
        <pre className="text-xs bg-white rounded-md p-3 border shadow-sm whitespace-pre-wrap">{result}</pre>
      )}
    </div>
  );
}


