'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch {
      setError(t('auth.loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <h1 className="memphis-heading text-2xl mb-6">{t('auth.loginTitle')}</h1>
      <form onSubmit={(e) => { void handleSubmit(e); }} className="flex flex-col gap-4">
        <Input
          id="email"
          type="email"
          label={t('auth.email')}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          id="password"
          type="password"
          label={t('auth.password')}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        {error && (
          <p className="text-[var(--memphis-red)] font-bold text-sm">{error}</p>
        )}
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? t('common.loading') : t('auth.loginButton')}
        </Button>
      </form>
      <p className="mt-4 text-sm font-bold">
        {t('auth.noAccount')}{' '}
        <Link href="/register" className="underline font-black">
          {t('nav.register')}
        </Link>
      </p>
    </Card>
  );
};
