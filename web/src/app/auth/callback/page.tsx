'use client';

/**
 * Auth callback page for handling Supabase email verification
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after a short delay
    const timer = setTimeout(() => {
      router.push('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="mx-auto max-w-md px-4 pt-20">
      <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
        <Loader2 className="w-12 h-12 text-yellow-600 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Подтверждение входа...
        </h2>
        <p className="text-gray-600 text-sm">
          Вы будете перенаправлены на главную страницу
        </p>
      </div>
    </div>
  );
}



