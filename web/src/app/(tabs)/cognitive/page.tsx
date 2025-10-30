"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, insertReframe, getReframes } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';

export default function CognitivePage() {
  const router = useRouter();
  const [situation, setSituation] = useState('');
  const [reaction, setReaction] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [history, setHistory] = useState<Array<{ id: string; situation: string; reaction: string; ai_response: string; created_at: string }>>([]);

  useEffect(() => {
    (async () => {
      const { user } = await getCurrentUser();
      if (!user) {
        router.replace('/auth');
        return;
      }
      const { data } = await getReframes(20);
      if (data) setHistory(data as any);
    })();
  }, [router]);

  async function handleSave() {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const { error: insertError } = await insertReframe({ situation, reaction, ai_response: aiResponse });
      if (insertError) throw insertError;
      setSuccess(true);
      trackEvent('reframe_saved');
      setSituation('');
      setReaction('');
      setAiResponse('');
      const { data } = await getReframes(20);
      if (data) setHistory(data as any);
    } catch (e: any) {
      setError(e?.message || 'Не удалось сохранить.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 pt-6 pb-20 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Когнитивное переосмысление</h1>
      <p className="text-gray-600 text-sm mb-6">Опишите ситуацию, свою реакцию и рациональный ответ</p>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <label className="block text-sm text-gray-700 mb-2">Ситуация</label>
          <textarea
            className="w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 text-sm"
            rows={3}
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="Кратко опишите событие"
          />
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <label className="block text-sm text-gray-700 mb-2">Моя реакция</label>
          <textarea
            className="w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 text-sm"
            rows={3}
            value={reaction}
            onChange={(e) => setReaction(e.target.value)}
            placeholder="Эмоции, мысли, действия"
          />
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <label className="block text-sm text-gray-700 mb-2">Рациональный ответ</label>
          <textarea
            className="w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 text-sm"
            rows={3}
            value={aiResponse}
            onChange={(e) => setAiResponse(e.target.value)}
            placeholder="В духе стоицизма: что в моей власти?"
          />
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}
        {success && <div className="text-sm text-green-600">Сохранено</div>}

        <button
          onClick={handleSave}
          disabled={loading || !situation || !reaction || !aiResponse}
          aria-label="Сохранить запись переосмысления"
          className="w-full py-3 rounded-lg bg-yellow-600 text-white font-medium disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500"
        >
          {loading ? 'Сохранение…' : 'Сохранить'}
        </button>
      </div>

      {history.length === 0 && (
        <div className="text-sm text-gray-500 mt-6">Пока нет записей. Добавьте первую практику переосмысления.</div>
      )}
      {!!history.length && (
        <div className="bg-white rounded-lg p-4 mt-6 shadow-sm border">
          <h3 className="font-medium text-gray-900 mb-3">Недавние записи</h3>
          <div className="space-y-3">
            {history.map((h) => (
              <div key={h.id} className="text-sm">
                <div className="text-gray-700">{new Date(h.created_at).toLocaleString()}</div>
                <div className="text-gray-900 mt-1">Ситуация: {h.situation}</div>
                <div className="text-gray-900">Реакция: {h.reaction}</div>
                <div className="text-gray-700">Рациональный ответ: {h.ai_response}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


