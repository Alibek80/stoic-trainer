import Link from 'next/link';
import { Sun, Moon, Clock, CheckCircle } from 'lucide-react';

export default function ReflectionsPage() {
  const reflectionTypes = [
    {
      type: 'morning',
      title: 'Утренняя рефлексия',
      description: 'Начните день с осознанности и намерений',
      icon: Sun,
      color: 'bg-yellow-100 text-yellow-600',
      completed: true,
    },
    {
      type: 'evening',
      title: 'Вечерняя рефлексия',
      description: 'Подведите итоги дня и извлеките уроки',
      icon: Moon,
      color: 'bg-blue-100 text-blue-600',
      completed: false,
    },
  ];

  return (
    <div className="mx-auto max-w-md px-4 pt-6 pb-20 min-h-screen bg-gray-50">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
          <Sun className="w-8 h-8 text-yellow-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Рефлексия
        </h1>
        <p className="text-gray-600 text-sm">
          Ежедневные практики осознанности
        </p>
      </div>

      <div className="space-y-4">
        {reflectionTypes.map((reflection) => {
          const Icon = reflection.icon;
          return (
            <Link
              key={reflection.type}
              href={`/reflections/${reflection.type}`}
              className="block bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-lg ${reflection.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {reflection.title}
                    </h3>
                    {reflection.completed && (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {reflection.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {reflection.type === 'morning' ? '5 мин' : '7 мин'}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-lg p-4 mt-6 shadow-sm border">
        <h3 className="font-medium text-gray-900 mb-3">Сегодняшний прогресс</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Утренняя рефлексия</span>
            <span className="text-green-600 font-medium">✓ Завершено</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Вечерняя рефлексия</span>
            <span className="text-gray-500">⏳ Ожидает</span>
          </div>
        </div>
      </div>
    </div>
  );
}
