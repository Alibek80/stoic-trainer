"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getWeeklyVirtues, getReflections } from '@/lib/supabase';

type VirtueEntry = { date: string; wisdom: number; courage: number; justice: number; temperance: number };

export default function AnalyticsPage() {
  const router = useRouter();
  const [virtues, setVirtues] = useState<VirtueEntry[]>([]);
  const [morningCount, setMorningCount] = useState(0);
  const [eveningCount, setEveningCount] = useState(0);

  useEffect(() => {
    (async () => {
      const { user } = await getCurrentUser();
      if (!user) {
        router.replace('/auth');
        return;
      }
      const { data: v } = await getWeeklyVirtues();
      if (v) setVirtues((v as any).map((x: any) => ({ date: x.date, wisdom: x.wisdom, courage: x.courage, justice: x.justice, temperance: x.temperance })));
      const mr = await getReflections('morning');
      const er = await getReflections('evening');
      setMorningCount((mr.data as any[])?.length || 0);
      setEveningCount((er.data as any[])?.length || 0);
    })();
  }, [router]);

  const days = useMemo(() => {
    // Normalize last 7 days labels
    const map: Record<string, VirtueEntry> = {};
    for (const v of virtues) map[v.date] = v;
    const res: VirtueEntry[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const found = map[key];
      res.push(
        found || { date: key, wisdom: 0, courage: 0, justice: 0, temperance: 0 }
      );
    }
    return res;
  }, [virtues]);

  function Bar({ value, color }: { value: number; color: string }) {
    const width = `${(Math.max(0, Math.min(5, value)) / 5) * 100}%`;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width }} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 pt-6 pb-20 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Аналитика</h1>
      <p className="text-gray-600 text-sm mb-6">Последние 7 дней</p>

      <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Рефлексия</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700">Утренние</span>
          <span className="text-gray-900 font-medium">{morningCount}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-700">Вечерние</span>
          <span className="text-gray-900 font-medium">{eveningCount}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <h3 className="font-medium text-gray-900 mb-3">Добродетели (1–5)</h3>
        <div className="space-y-4">
          {days.map((d) => (
            <div key={d.date} className="text-sm">
              <div className="text-gray-500 mb-1">{new Date(d.date).toLocaleDateString()}</div>
              <div className="grid grid-cols-4 gap-2 items-center">
                <div>
                  <div className="text-gray-700">Мудр.</div>
                  <Bar value={d.wisdom} color="bg-blue-500" />
                </div>
                <div>
                  <div className="text-gray-700">Муж.</div>
                  <Bar value={d.courage} color="bg-red-500" />
                </div>
                <div>
                  <div className="text-gray-700">Справ.</div>
                  <Bar value={d.justice} color="bg-green-500" />
                </div>
                <div>
                  <div className="text-gray-700">Умер.</div>
                  <Bar value={d.temperance} color="bg-purple-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


