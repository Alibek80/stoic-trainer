"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, TrendingUp, Target, Shield } from 'lucide-react';
import { getCurrentUser, insertVirtue, getVirtues } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';

type VirtueKey = 'wisdom' | 'courage' | 'justice' | 'temperance';

export default function VirtuesPage() {
  const router = useRouter();
  const [values, setValues] = useState<Record<VirtueKey, number>>({
    wisdom: 3,
    courage: 3,
    justice: 3,
    temperance: 3,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [history, setHistory] = useState<Array<{ id: string; date: string; wisdom: number; courage: number; justice: number; temperance: number }>>([]);

  useEffect(() => {
    (async () => {
      const { user } = await getCurrentUser();
      if (!user) {
        router.replace('/auth');
        return;
      }
      const { data } = await getVirtues(7);
      if (data) setHistory(data as any);
    })();
  }, [router]);

  const items = useMemo(
    () => [
      { key: 'wisdom' as const, name: 'Мудрость', description: 'Принимать правильные решения', icon: Compass, color: 'bg-blue-100 text-blue-600' },
      { key: 'courage' as const, name: 'Мужество', description: 'Смелость перед трудностями', icon: Shield, color: 'bg-red-100 text-red-600' },
      { key: 'justice' as const, name: 'Справедливость', description: 'Честность и равенство', icon: Target, color: 'bg-green-100 text-green-600' },
      { key: 'temperance' as const, name: 'Умеренность', description: 'Контроль эмоций и желаний', icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
    ],
    []
  );

  async function handleSave() {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const { error: insertError } = await insertVirtue({ ...values, date: today });
      if (insertError) throw insertError;
      setSuccess(true);
      trackEvent('virtue_saved', { date: today, ...values });
      const { data } = await getVirtues(7);
      if (data) setHistory(data as any);
    } catch (e: any) {
      setError(e?.message || 'Не удалось сохранить. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 pt-6 pb-20 min-h-screen bg-gray-50">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <Compass className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Добродетели
        </h1>
        <p className="text-gray-600 text-sm">
          Оцените свои качества и отслеживайте прогресс
        </p>
      </div>

      <div className="space-y-4">
        {items.map(({ key, name, description, icon: Icon, color }) => {
          const value = values[key];
          return (
            <div key={key} className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center space-x-4 mb-3">
                <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">{name}</h3>
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-gray-900">{value}</div>
                  <div className="text-xs text-gray-500">из 5</div>
                </div>
              </div>

              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={value}
                onChange={(e) => setValues((v) => ({ ...v, [key]: Number(e.target.value) }))}
                aria-label={name}
                className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
              />
            </div>
          );
        })}
      </div>

      {error && <div className="text-sm text-red-600 mt-4">{error}</div>}
      {success && <div className="text-sm text-green-600 mt-4">Сохранено</div>}

      <button
        onClick={handleSave}
        disabled={loading}
        aria-label="Сохранить оценки добродетелей"
        className="w-full mt-4 py-3 rounded-lg bg-yellow-600 text-white font-medium disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500"
      >
        {loading ? 'Сохранение…' : 'Сохранить на сегодня'}
      </button>

      {history.length === 0 && (
        <div className="text-sm text-gray-500 mt-6">Пока нет записей. Сохраните первую оценку за сегодня.</div>
      )}
      {!!history.length && (
        <div className="bg-white rounded-lg p-4 mt-6 shadow-sm border">
          <h3 className="font-medium text-gray-900 mb-3">Последние записи</h3>
          <div className="space-y-3">
            {history.map((h) => (
              <div key={h.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{new Date(h.date).toLocaleDateString()}</span>
                <span className="text-gray-500">W {h.wisdom} · C {h.courage} · J {h.justice} · T {h.temperance}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
