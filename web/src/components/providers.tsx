'use client';

/**
 * Root providers component
 */

import { ReactNode, useEffect } from 'react';
import { AuthProvider } from '@/contexts/auth-context';
import { ErrorBoundary } from '@/components/error-boundary';
import { initAnalytics, identifyUser } from '@/lib/analytics';
import { getCurrentUser } from '@/lib/supabase';

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    initAnalytics();
    (async () => {
      try {
        const { user } = await getCurrentUser();
        if (user) identifyUser(user.id);
      } catch {}
    })();
  }, []);

  return (
    <AuthProvider>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </AuthProvider>
  );
}



