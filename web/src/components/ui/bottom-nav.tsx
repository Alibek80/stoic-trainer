'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sun, Compass, BrainCircuit, BarChart2, BookText } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Главная', icon: Home },
  { href: '/reflections', label: 'Рефлексия', icon: Sun },
  { href: '/virtues', label: 'Добродетели', icon: Compass },
  { href: '/cognitive', label: 'Практики', icon: BrainCircuit },
  { href: '/analytics', label: 'Аналитика', icon: BarChart2 },
  { href: '/quotes', label: 'Цитаты', icon: BookText },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe" role="navigation" aria-label="Основная навигация">
      <div className="mx-auto max-w-md grid grid-cols-6">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center py-2.5 min-h-12 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 ${
                isActive 
                  ? 'text-yellow-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon aria-hidden className={`w-5 h-5 mb-1 ${isActive ? 'text-yellow-600' : 'text-gray-500'}`} />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
