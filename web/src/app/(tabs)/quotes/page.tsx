"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getQuotes, toggleFavoriteQuote } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';

export default function QuotesPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Array<{ id: string; author: string; text: string; favorited_by: string[] }>>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { user } = await getCurrentUser();
      if (!user) {
        router.replace('/auth');
        return;
      }
      setUserId(user.id);
      await loadQuotes();
    })();
  }, [router]);

  async function loadQuotes(search?: string) {
    setLoading(true);
    const { data } = await getQuotes(search || undefined, 50);
    if (data) setList(data as any);
    setLoading(false);
  }

  async function toggleFav(id: string) {
    await toggleFavoriteQuote(id);
    await loadQuotes(query || undefined);
    trackEvent('quote_favorited', { id });
  }

  const filtered = useMemo(() => list, [list]);

  return (
    <div className="mx-auto max-w-md px-4 pt-6 pb-20 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Библиотека цитат</h1>
      <p className="text-gray-600 text-sm mb-4">Ищите по авторам и добавляйте в избранное</p>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по автору"
          className="flex-1 rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 text-sm"
        />
        <button onClick={() => loadQuotes(query || undefined)} aria-label="Найти цитаты" className="px-3 py-2 rounded-md bg-yellow-600 text-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500">Найти</button>
      </div>

      {loading && <div className="text-sm text-gray-500">Загрузка…</div>}

      <div className="space-y-3">
        {filtered.map((q) => {
          const isFav = userId ? (q.favorited_by || []).includes(userId) : false;
          return (
            <div key={q.id} className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="text-sm text-gray-500 mb-1">{q.author}</div>
              <div className="text-gray-900">{q.text}</div>
              <div className="mt-3">
                <button
                  onClick={() => toggleFav(q.id)}
                  aria-pressed={isFav}
                  aria-label={isFav ? 'Убрать из избранного' : 'Добавить в избранное'}
                  className={`px-3 py-2 rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 ${isFav ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  {isFav ? 'Убрать из избранного' : 'В избранное'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


