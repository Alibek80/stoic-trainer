'use client';

/**
 * Authentication page
 */

import { AuthForm } from '@/components/auth/auth-form';
import { AuthProvider } from '@/contexts/auth-context';

export default function AuthPage() {
  return (
    <AuthProvider>
      <AuthForm />
    </AuthProvider>
  );
}



