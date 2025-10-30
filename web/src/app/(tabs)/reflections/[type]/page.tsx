'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { insertReflection, getCurrentUser } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';

export default function ReflectionFormPage() {
  const params = useParams<{ type: 'morning' | 'evening' }>();
  const router = useRouter();
  const type = useMemo(() => (params?.type === 'evening' ? 'evening' : 'morning'), [params]);

  const [steps, setSteps] = useState<Record<string, string>>({
    intention: '',
    focus: '',
    gratitude: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Redirect to auth if unauthenticated
    (async () => {
      const { user } = await getCurrentUser();
      if (!user) router.replace('/auth');
    })();
  }, [router]);

  async function handleSave() {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const { error: insertError } = await insertReflection({ type, steps });
      if (insertError) throw insertError;
      setSuccess(true);
      trackEvent('reflection_saved', { type });
      // Return to list after short pause
      setTimeout(() => router.replace('/reflections'), 600);
    } catch (e: any) {
      setError(e?.message || 'Не удалось сохранить. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 pt-6 pb-20 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        {type === 'morning' ? 'Утренняя рефлексия' : 'Вечерняя рефлексия'}
      </h1>
      <p className="text-gray-600 text-sm mb-6">
        Короткие ответы помогут настроить мышление
      </p>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <label className="block text-sm text-gray-700 mb-2">Намерение на сегодня</label>
          <textarea
            className="w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 text-sm"
            rows={3}
            value={steps.intention}
            onChange={(e) => setSteps((s) => ({ ...s, intention: e.target.value }))}
            placeholder="Например: сохранять спокойствие в любой ситуации"
          />
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <label className="block text-sm text-gray-700 mb-2">Фокус</label>
          <textarea
            className="w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 text-sm"
            rows={3}
            value={steps.focus}
            onChange={(e) => setSteps((s) => ({ ...s, focus: e.target.value }))}
            placeholder="Что важно помнить и контролировать сегодня?"
          />
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <label className="block text-sm text-gray-700 mb-2">Благодарность</label>
          <textarea
            className="w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 text-sm"
            rows={3}
            value={steps.gratitude}
            onChange={(e) => setSteps((s) => ({ ...s, gratitude: e.target.value }))}
            placeholder="За что вы благодарны прямо сейчас?"
          />
        </div>

        {error && (
          <div className="text-sm text-red-600">{error}</div>
        )}
        {success && (
          <div className="text-sm text-green-600">Сохранено</div>
        )}

        <button
          onClick={handleSave}
          disabled={loading}
          aria-label="Сохранить рефлексию"
          className="w-full py-3 rounded-lg bg-yellow-600 text-white font-medium disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500"
        >
          {loading ? 'Сохранение…' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
}


