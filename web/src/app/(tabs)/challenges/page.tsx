"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getChallenges, insertChallenge, updateChallengeStatus } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';

export default function ChallengesPage() {
  const router = useRouter();
  const [title, setTitle] = useState('Практиковать принятие неизбежного');
  const [description, setDescription] = useState('Замечать, что вне моего контроля, и отпускать.');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [list, setList] = useState<Array<{ id: string; title: string; description: string; date: string; accepted: boolean; completed: boolean }>>([]);

  useEffect(() => {
    (async () => {
      const { user } = await getCurrentUser();
      if (!user) {
        router.replace('/auth');
        return;
      }
      const { data } = await getChallenges(14);
      if (data) setList(data as any);
    })();
  }, [router]);

  async function handleCreate() {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const { error: insertErr } = await insertChallenge({ title, description, date });
      if (insertErr) throw insertErr;
      setSuccess(true);
      trackEvent('challenge_created', { date });
      const { data } = await getChallenges(14);
      if (data) setList(data as any);
    } catch (e: any) {
      setError(e?.message || 'Не удалось создать вызов.');
    } finally {
      setLoading(false);
    }
  }

  async function toggle(id: string, field: 'accepted' | 'completed', current: boolean) {
    setError(null);
    try {
      await updateChallengeStatus(id, { [field]: !current });
      trackEvent('challenge_updated', { id, field, value: !current });
      const { data } = await getChallenges(14);
      if (data) setList(data as any);
    } catch (e: any) {
      setError(e?.message || 'Не удалось обновить.');
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 pt-6 pb-20 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Stoic Challenges</h1>
      <p className="text-gray-600 text-sm mb-6">Создайте задание дня и отмечайте прогресс</p>

      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="grid gap-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Дата</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Заголовок</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Описание</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 text-sm" />
          </div>
        </div>
        {error && <div className="text-sm text-red-600 mt-3">{error}</div>}
        {success && <div className="text-sm text-green-600 mt-3">Создано</div>}
        <button onClick={handleCreate} disabled={loading || !title || !description} aria-label="Создать вызов" className="w-full mt-4 py-3 rounded-lg bg-yellow-600 text-white font-medium disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500">{loading ? 'Создание…' : 'Создать'}</button>
      </div>

      {list.length === 0 && (
        <div className="text-sm text-gray-500 mt-6">Нет вызовов. Создайте первый вызов на сегодня.</div>
      )}
      {!!list.length && (
        <div className="bg-white rounded-lg p-4 mt-6 shadow-sm border">
          <h3 className="font-medium text-gray-900 mb-3">Недавние</h3>
          <div className="space-y-3">
            {list.map((c) => (
              <div key={c.id} className="border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">{new Date(c.date).toLocaleDateString()}</div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggle(c.id, 'accepted', c.accepted)} aria-pressed={c.accepted} aria-label="Принять вызов" className={`px-3 py-2 rounded text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 ${c.accepted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{c.accepted ? 'Принято' : 'Принять'}</button>
                    <button onClick={() => toggle(c.id, 'completed', c.completed)} aria-pressed={c.completed} aria-label="Отметить выполненным" className={`px-3 py-2 rounded text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 ${c.completed ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{c.completed ? 'Сделано' : 'Сделать'}</button>
                  </div>
                </div>
                <div className="font-medium text-gray-900 mt-1">{c.title}</div>
                <div className="text-sm text-gray-700">{c.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


