'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { resolveText } from '@/lib/localizedText';
import { ACHIEVEMENT_ICONS, DEFAULT_ICON } from '@/lib/achievementIcons';
import { useToast, type AchievementToast } from '@/contexts/ToastContext';
import { XIcon } from '@phosphor-icons/react';

const SingleToast: React.FC<{ toast: AchievementToast }> = ({ toast }) => {
  const { t, i18n } = useTranslation();
  const { removeToast } = useToast();
  const [visible, setVisible] = useState(false);

  const IconComponent = ACHIEVEMENT_ICONS[toast.achievement.icon] ?? DEFAULT_ICON;
  const label = resolveText(toast.achievement.label, i18n.language);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => removeToast(toast.id), 300);
  };

  return (
    <div
      className="flex items-center gap-3 bg-white border-2 border-black shadow-[4px_4px_0px_#111] px-4 py-3 min-w-[260px] max-w-[320px]"
      style={{
        transition: 'transform 0.3s ease, opacity 0.3s ease',
        transform: visible ? 'translateX(0)' : 'translateX(120%)',
        opacity: visible ? 1 : 0,
      }}
    >
      {/* Badge icon */}
      <div
        className="w-10 h-10 border-2 border-black flex items-center justify-center shrink-0"
        style={{ backgroundColor: toast.achievement.color }}
      >
        <IconComponent size={20} weight="bold" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black uppercase opacity-60 leading-none mb-0.5">
          {t('achievements.toastTitle')}
        </p>
        <p className="font-black text-sm leading-tight truncate">{label}</p>
        {toast.level && toast.level > 1 && (
          <p className="text-xs font-bold opacity-60">
            {t('achievements.level', { level: toast.level })}
          </p>
        )}
      </div>

      {/* Close */}
      <button
        onClick={handleClose}
        className="shrink-0 opacity-40 hover:opacity-100 transition-opacity"
      >
        <XIcon size={14} weight="bold" />
      </button>
    </div>
  );
};

export const AchievementToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <SingleToast toast={toast} />
        </div>
      ))}
    </div>
  );
};
