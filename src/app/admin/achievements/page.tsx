'use client';

import React, { useEffect, useState } from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useTranslation } from '@/hooks/useTranslation';
import { resolveText } from '@/lib/localizedText';
import { fetchUsers } from '@/services/userService';
import { TrashIcon, PencilSimpleIcon, CheckCircleIcon, XCircleIcon } from '@phosphor-icons/react';
import type { Achievement, AchievementTrigger, User } from '@/types';

const TRIGGERS: AchievementTrigger[] = [
  'first_qcm_done',
  'perfect_score',
  'streak_7_days',
  'first_qcm_created',
  'complete_N_qcms',
  'rocket_click',
  'manual',
];

const emptyForm = (): Omit<Achievement, 'id' | 'createdAt'> => ({
  label: { fr: '', en: '' },
  description: { fr: '', en: '' },
  icon: 'Trophy',
  color: '#FFE600',
  secret: false,
  descriptionHidden: false,
  unique: false,
  stackable: false,
  active: true,
  trigger: 'manual',
});

export default function AdminAchievementsPage() {
  const { t, i18n } = useTranslation();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Achievement | null>(null);
  const [form, setForm] = useState<Omit<Achievement, 'id' | 'createdAt'>>(emptyForm());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [grantUserId, setGrantUserId] = useState('');
  const [grantAchId, setGrantAchId] = useState('');
  const [grantMsg, setGrantMsg] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/achievements/manage').then(r => r.json()),
      fetchUsers(),
    ])
      .then(([achs, usrs]) => {
        setAchievements(achs as Achievement[]);
        setUsers(usrs as User[]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleOpenCreate = () => {
    setEditTarget(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const handleOpenEdit = (ach: Achievement) => {
    setEditTarget(ach);
    const { id: _id, createdAt: _c, ...rest } = ach;
    setForm(rest);
    setShowForm(true);
  };

  const handleSave = async () => {
    const method = editTarget ? 'PUT' : 'POST';
    const url = editTarget
      ? `/api/achievements/manage/${editTarget.id}`
      : '/api/achievements/manage';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const saved = await res.json() as Achievement;
      setAchievements(prev =>
        editTarget ? prev.map(a => (a.id === saved.id ? saved : a)) : [...prev, saved],
      );
      setShowForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/achievements/manage/${id}`, { method: 'DELETE' });
    setAchievements(prev => prev.filter(a => a.id !== id));
    setDeleteConfirm(null);
  };

  const handleToggleActive = async (ach: Achievement) => {
    const res = await fetch(`/api/achievements/manage/${ach.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !ach.active }),
    });
    if (res.ok) {
      const updated = await res.json() as Achievement;
      setAchievements(prev => prev.map(a => (a.id === updated.id ? updated : a)));
    }
  };

  const handleGrant = async () => {
    setGrantMsg('');
    const res = await fetch('/api/achievements/grant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: grantUserId, achievementId: grantAchId }),
    });
    setGrantMsg(res.ok ? t('achievements.grantSuccess') : t('common.error'));
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="memphis-heading text-3xl">{t('achievements.adminTitle')}</h1>
          <Button variant="primary" size="sm" onClick={handleOpenCreate}>
            + {t('achievements.createBadge')}
          </Button>
        </div>

        {loading ? (
          <p className="font-bold">{t('common.loading')}</p>
        ) : (
          <div className="overflow-x-auto mb-12">
            <table className="memphis-table">
              <thead>
                <tr>
                  <th>{t('admin.title')}</th>
                  <th>{t('achievements.badgeTrigger')}</th>
                  <th>Secret</th>
                  <th>Unique</th>
                  <th>{t('achievements.badgeActive')}</th>
                  <th>{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map(ach => (
                  <tr key={ach.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 border-2 border-black flex items-center justify-center text-xs font-black shrink-0"
                          style={{ backgroundColor: ach.active ? ach.color : '#e5e7eb' }}
                        >
                          {ach.icon.slice(0, 2)}
                        </div>
                        <span className="font-black">{resolveText(ach.label, i18n.language)}</span>
                      </div>
                    </td>
                    <td className="text-xs font-black">{ach.trigger ?? '—'}</td>
                    <td>{ach.secret ? '🔒' : '—'}</td>
                    <td>{ach.unique ? '1' : '∞'}</td>
                    <td>
                      <button onClick={() => void handleToggleActive(ach)}>
                        {ach.active
                          ? <CheckCircleIcon size={18} weight="bold" className="text-[var(--memphis-green)]" />
                          : <XCircleIcon size={18} weight="bold" className="opacity-40" />
                        }
                      </button>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          className="p-1.5 border-2 border-black hover:bg-black hover:text-white transition-colors"
                          onClick={() => handleOpenEdit(ach)}
                        >
                          <PencilSimpleIcon size={14} weight="bold" />
                        </button>
                        <button
                          className="p-1.5 border-2 border-black hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                          style={{ height: 'fit-content' }}
                          onClick={() => setDeleteConfirm(ach.id)}
                        >
                          <TrashIcon size={14} weight="bold" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Manual grant */}
        <div className="border-2 border-black p-6 shadow-[4px_4px_0px_#111]">
          <h2 className="memphis-heading text-xl mb-4">{t('achievements.grantBadge')}</h2>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-black uppercase">{t('achievements.grantUser')}</label>
              <select
                className="memphis-input"
                value={grantUserId}
                onChange={e => setGrantUserId(e.target.value)}
              >
                <option value="">— Choisir —</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-black uppercase">{t('achievements.grantAchievement')}</label>
              <select
                className="memphis-input"
                value={grantAchId}
                onChange={e => setGrantAchId(e.target.value)}
              >
                <option value="">— Choisir —</option>
                {achievements.map(a => (
                  <option key={a.id} value={a.id}>{resolveText(a.label, i18n.language)}</option>
                ))}
              </select>
            </div>
            <Button
              variant="primary"
              size="sm"
              disabled={!grantUserId || !grantAchId}
              onClick={() => void handleGrant()}
            >
              {t('achievements.grantBadge')}
            </Button>
          </div>
          {grantMsg && <p className="mt-3 font-bold text-sm text-[var(--memphis-green)]">{grantMsg}</p>}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editTarget ? t('common.edit') : t('achievements.createBadge')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowForm(false)}>{t('common.cancel')}</Button>
            <Button variant="primary" onClick={() => void handleSave()}>{t('common.save')}</Button>
          </>
        }
      >
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nom (FR)" value={form.label.fr}
              onChange={e => setForm(f => ({ ...f, label: { ...f.label, fr: e.target.value } }))}
            />
            <Input
              label="Name (EN)" value={form.label.en}
              onChange={e => setForm(f => ({ ...f, label: { ...f.label, en: e.target.value } }))}
            />
            <Input
              label="Description (FR)" value={form.description.fr}
              onChange={e => setForm(f => ({ ...f, description: { ...f.description, fr: e.target.value } }))}
            />
            <Input
              label="Description (EN)" value={form.description.en}
              onChange={e => setForm(f => ({ ...f, description: { ...f.description, en: e.target.value } }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t('achievements.badgeIcon')} value={form.icon}
              onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
              placeholder="ex: Trophy, Rocket, Star..."
            />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-black uppercase">{t('achievements.badgeColor')}</label>
              <input
                type="color" value={form.color}
                onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                className="h-10 w-full border-2 border-black cursor-pointer"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-black uppercase">{t('achievements.badgeTrigger')}</label>
            <select
              className="memphis-input" value={form.trigger ?? ''}
              onChange={e => setForm(f => ({ ...f, trigger: (e.target.value || null) as AchievementTrigger | null }))}
            >
              <option value="">— Aucun —</option>
              {TRIGGERS.map(tr => (
                <option key={tr} value={tr}>{t(`achievements.triggers.${tr}`)}</option>
              ))}
            </select>
          </div>
          {form.trigger === 'complete_N_qcms' && (
            <Input
              label={t('achievements.badgeTriggerThreshold')}
              type="number" min={1}
              value={String(form.triggerThreshold ?? 5)}
              onChange={e => setForm(f => ({ ...f, triggerThreshold: Number(e.target.value) }))}
            />
          )}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Disponible à partir du" type="date" value={form.availableFrom ?? ''}
              onChange={e => setForm(f => ({ ...f, availableFrom: e.target.value || undefined }))}
            />
            <Input
              label="Disponible jusqu'au" type="date" value={form.availableTo ?? ''}
              onChange={e => setForm(f => ({ ...f, availableTo: e.target.value || undefined }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm font-bold">
            {([
              ['secret', t('achievements.badgeSecret')],
              ['descriptionHidden', t('achievements.badgeHideDescription')],
              ['unique', t('achievements.badgeUnique')],
              ['stackable', t('achievements.badgeStackable')],
              ['active', t('achievements.badgeActive')],
            ] as [keyof typeof form, string][]).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                  className="w-4 h-4"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title={t('common.delete')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>{t('common.cancel')}</Button>
            <Button
              variant="danger"
              onClick={() => { if (deleteConfirm) void handleDelete(deleteConfirm); }}
            >
              {t('common.confirm')}
            </Button>
          </>
        }
      >
        <p className="font-bold">{t('admin.confirmDelete')}</p>
      </Modal>
    </RoleGuard>
  );
}
