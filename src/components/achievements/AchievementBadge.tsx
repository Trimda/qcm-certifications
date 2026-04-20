'use client';

import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { resolveText } from '@/lib/localizedText';
import { ACHIEVEMENT_ICONS, DEFAULT_ICON } from '@/lib/achievementIcons';
import type { AchievementWithStatus } from '@/app/api/achievements/route';

interface AchievementBadgeProps {
  achievement: AchievementWithStatus;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const { t, i18n } = useTranslation();
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties | null>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  const IconComponent = ACHIEVEMENT_ICONS[achievement.icon] ?? DEFAULT_ICON;
  const label = resolveText(achievement.label, i18n.language);
  const description = resolveText(achievement.description, i18n.language);

  const displayDescription = !achievement.unlocked && achievement.descriptionHidden
    ? t('achievements.secretDescription')
    : description;

  const handleMouseEnter = () => {
    if (!badgeRef.current) return;
    const rect = badgeRef.current.getBoundingClientRect();
    setTooltipStyle({
      position: 'fixed',
      bottom: window.innerHeight - rect.top + 8,
      left: rect.left + rect.width / 2,
      transform: 'translateX(-50%)',
      zIndex: 9999,
    });
  };

  const handleMouseLeave = () => setTooltipStyle(null);

  const tooltip = tooltipStyle ? createPortal(
    <div
      className="w-52 bg-white border-2 border-black p-3 shadow-[3px_3px_0px_#111] pointer-events-none"
      style={tooltipStyle}
    >
      <p className="font-black text-xs uppercase mb-1">{label}</p>
      <p className="font-bold text-xs leading-tight opacity-70">{displayDescription}</p>
      {achievement.unlocked && achievement.unlockedAt && (
        <p className="text-xs font-bold mt-2 text-[var(--memphis-green)]">
          ✓ {t('achievements.unlocked', { date: new Date(achievement.unlockedAt).toLocaleDateString() })}
        </p>
      )}
      {!achievement.unlocked && (
        <p className="text-xs font-bold mt-2 opacity-40">{t('achievements.locked')}</p>
      )}
    </div>,
    document.body
  ) : null;

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Badge */}
      <div
        ref={badgeRef}
        className={`
          relative w-16 h-16 border-2 border-black flex items-center justify-center cursor-default
          transition-all duration-150
          ${achievement.unlocked ? 'shadow-[3px_3px_0px_#111]' : 'grayscale opacity-40'}
        `}
        style={achievement.unlocked ? { backgroundColor: achievement.color } : { backgroundColor: '#e5e7eb' }}
      >
        <IconComponent size={28} weight="bold" />
        {/* Level for stackable */}
        {achievement.stackable && achievement.unlocked && achievement.level && achievement.level > 1 && (
          <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-black px-1 border border-black leading-tight">
            ×{achievement.level}
          </span>
        )}
      </div>

      {tooltip}
    </div>
  );
};
