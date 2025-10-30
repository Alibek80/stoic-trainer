'use client';

/**
 * Authentication form component
 */

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Mail, Loader2, CheckCircle } from 'lucide-react';

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await signIn(email);
      if (error) {
        setMessage({
          type: 'error',
          text: error.message || 'Произошла ошибка при входе',
        });
      } else {
        setMessage({
          type: 'success',
          text: 'Проверьте вашу почту! Мы отправили вам ссылку для входа.',
        });
        setEmail('');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Произошла непредвиденная ошибка',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 pt-20">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Вход в Stoic Trainer
          </h1>
          <p className="text-gray-600 text-sm">
            Введите ваш email для получения ссылки входа
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-red-600">⚠️</span>
                )}
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-yellow-500 text-white py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Отправка...</span>
              </>
            ) : (
              <span>Получить ссылку входа</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Ссылка действительна в течение 24 часов
          </p>
        </div>
      </div>
    </div>
  );
}



