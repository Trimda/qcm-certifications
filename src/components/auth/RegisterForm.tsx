'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { CheckIcon, XIcon } from '@phosphor-icons/react';
import type { Role } from '@/types';

export const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('user');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordMinLength = 8;
  const rules = [
    { key: 'minLength', ok: password.length >= passwordMinLength, label: t('auth.ruleMinLength') },
    { key: 'match',     ok: confirmPassword.length > 0 && password === confirmPassword, label: t('auth.ruleMatch') },
  ];
  const allRulesOk = rules.every(r => r.ok);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!allRulesOk) return;
    setIsLoading(true);
    try {
      await register(username, email, password, role);
      router.push('/dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg === 'Username already taken') setError(t('account.usernameExists'));
      else if (msg === 'Email already exists') setError(t('auth.emailExists'));
      else setError(t('auth.registerError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <h1 className="memphis-heading text-2xl mb-6">{t('auth.registerTitle')}</h1>
      <form onSubmit={(e) => { void handleSubmit(e); }} className="flex flex-col gap-4">
        <Input
          id="username"
          type="text"
          label={t('auth.username')}
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          autoComplete="username"
        />
        <Input
          id="email"
          type="email"
          label={t('auth.email')}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <PasswordInput
          id="password"
          label={t('auth.password')}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <PasswordInput
          id="confirmPassword"
          label={t('auth.confirmPassword')}
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        {/* Validation rules */}
        {(password.length > 0 || confirmPassword.length > 0) && (
          <ul className="flex flex-col gap-1">
            {rules.map(rule => (
              <li key={rule.key} className={`text-xs font-bold flex items-center gap-1.5 ${
                rule.ok ? 'text-[var(--memphis-green)]' : 'text-[var(--memphis-red)]'
              }`}>
                {rule.ok
                  ? <CheckIcon size={14} weight="bold" />
                  : <XIcon size={14} weight="bold" />
                }
                <span>{rule.label}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="role" className="font-black text-sm uppercase tracking-wide">
            {t('auth.role')}
          </label>
          <select
            id="role"
            value={role}
            onChange={e => setRole(e.target.value as Role)}
            className="memphis-input"
          >
            <option value="user">User</option>
            <option value="contributor">Contributor</option>
          </select>
        </div>
        {error && (
          <p className="text-[var(--memphis-red)] font-bold text-sm">{error}</p>
        )}
        <Button type="submit" variant="primary" disabled={isLoading || !allRulesOk}>
          {isLoading ? t('common.loading') : t('auth.registerButton')}
        </Button>
      </form>
      <p className="mt-4 text-sm font-bold">
        {t('auth.alreadyAccount')}{' '}
        <Link href="/login" className="underline font-black">
          {t('nav.login')}
        </Link>
      </p>
    </Card>
  );
};
