'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PasswordInput } from '@/components/ui/PasswordInput';

const ROLE_BADGE: Record<string, 'scrum' | 'devops' | 'safe'> = {
  admin: 'safe',
  contributor: 'devops',
  user: 'scrum',
};

const AccountPage: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { t } = useTranslation();

  // ── Username form ─────────────────────────────────────────────────────────
  const [username, setUsername] = useState(currentUser?.username ?? '');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);

  // ── Password form ─────────────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const mapApiError = (err: string): string => {
    if (err === 'Username already taken') return t('account.usernameExists');
    if (err === 'Username must be at least 2 characters') return t('account.usernameTooShort');
    if (err === 'Current password is incorrect') return t('account.wrongPassword');
    if (err === 'Password must be at least 6 characters') return t('account.passwordTooShort');
    return t('common.error');
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError('');
    setUsernameSuccess('');
    setUsernameLoading(true);
    try {
      const res = await fetch('/api/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) {
        setUsernameError(mapApiError(data.error ?? ''));
      } else {
        setUsernameSuccess(t('account.usernameSuccess'));
        await refreshUser();
      }
    } finally {
      setUsernameLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError(t('account.passwordMismatch'));
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError(t('account.passwordTooShort'));
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) {
        setPasswordError(mapApiError(data.error ?? ''));
      } else {
        setPasswordSuccess(t('account.passwordSuccess'));
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['admin', 'contributor', 'user']}>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="memphis-heading text-3xl mb-8">{t('account.title')}</h1>

        {/* ── Section Profil ──────────────────────────────────────────────── */}
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="memphis-heading text-xl">{t('account.profileSection')}</h2>
            {currentUser?.role && (
              <Badge variant={ROLE_BADGE[currentUser.role] ?? 'scrum'}>
                {currentUser.role}
              </Badge>
            )}
          </div>

          {/* Email (non modifiable) */}
          <div className="mb-4">
            <label className="block text-xs font-black uppercase mb-1">{t('auth.email')}</label>
            <input
              type="email"
              value={currentUser?.email ?? ''}
              readOnly
              className="memphis-input w-full opacity-60 cursor-not-allowed"
            />
            <p className="text-xs mt-1 text-gray-500 font-bold">{t('account.emailReadOnly')}</p>
          </div>

          {/* Username (modifiable) */}
          <form onSubmit={(e) => { void handleUsernameSubmit(e); }} className="flex flex-col gap-3">
            <Input
              label={t('auth.username')}
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              minLength={2}
              error={usernameError || undefined}
            />
            {usernameSuccess && (
              <p className="text-[var(--memphis-green)] font-bold text-sm">{usernameSuccess}</p>
            )}
            <div>
              <Button type="submit" variant="primary" size="sm" disabled={usernameLoading}>
                {usernameLoading ? t('common.loading') : t('account.saveUsername')}
              </Button>
            </div>
          </form>
        </Card>

        {/* ── Section Mot de passe ────────────────────────────────────────── */}
        <Card>
          <h2 className="memphis-heading text-xl mb-5">{t('account.passwordSection')}</h2>
          <form onSubmit={(e) => { void handlePasswordSubmit(e); }} className="flex flex-col gap-3">
            <PasswordInput
              label={t('account.currentPassword')}
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <PasswordInput
              label={t('account.newPassword')}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
            <PasswordInput
              label={t('account.confirmPassword')}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              error={passwordError || undefined}
            />
            {passwordSuccess && (
              <p className="text-[var(--memphis-green)] font-bold text-sm">{passwordSuccess}</p>
            )}
            <div>
              <Button type="submit" variant="secondary" size="sm" disabled={passwordLoading}>
                {passwordLoading ? t('common.loading') : t('account.savePassword')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </RoleGuard>
  );
};

export default AccountPage;
