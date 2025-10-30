import Link from 'next/link';
import BottomNav from '@/components/ui/bottom-nav';
import { Sun, Moon, Compass, BrainCircuit, BookText, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const quickActions = [
    {
      href: '/reflections',
      title: 'Утреннее упражнение',
      description: 'Начните день с осознанности',
      icon: Sun,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      href: '/reflections',
      title: 'Вечерняя рефлексия',
      description: 'Подведите итоги дня',
      icon: Moon,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      href: '/virtues',
      title: 'Журнал добродетелей',
      description: 'Оцените свои качества',
      icon: Compass,
      color: 'bg-green-100 text-green-600',
    },
    {
      href: '/cognitive',
      title: 'Практики',
      description: 'Переосмыслите ситуации',
      icon: BrainCircuit,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      href: '/quotes',
      title: 'Библиотека цитат',
      description: 'Найдите вдохновение',
      icon: BookText,
      color: 'bg-pink-100 text-pink-600',
    },
  ];

  return (
    <>
      <div className="mx-auto max-w-md px-4 pt-6 pb-20 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Stoic Trainer
          </h1>
          <p className="text-gray-600 text-sm">
            Развивайте внутреннюю устойчивость
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Прогресс недели</span>
            <span className="text-sm text-gray-500">3/7 дней</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '43%' }}></div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Практики</h2>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="block bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {action.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Daily Quote */}
        <div className="bg-white rounded-lg p-4 mt-6 shadow-sm border">
          <div className="text-center">
            <div className="text-2xl text-gray-400 mb-2">&ldquo;</div>
            <blockquote className="text-gray-700 italic font-medium mb-2">
              &ldquo;Счастье зависит от нас самих.&rdquo;
            </blockquote>
            <cite className="text-sm text-gray-500">— Аристотель</cite>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
