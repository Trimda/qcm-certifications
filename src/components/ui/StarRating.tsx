'use client';

import React, { useState } from 'react';
import { StarIcon } from '@phosphor-icons/react';

interface StarRatingProps {
  /** 0 = unrated, 1-5 = rated */
  value: number;
  /** Omit to render as read-only */
  onChange?: (v: number) => void;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ value, onChange, size = 20 }) => {
  const [hovered, setHovered] = useState(0);
  const isReadOnly = !onChange;
  const displayed = hovered > 0 ? hovered : value;

  return (
    <div
      className={`flex items-center gap-0.5 ${isReadOnly ? '' : 'cursor-pointer select-none'}`}
      onMouseLeave={() => { if (!isReadOnly) setHovered(0); }}
    >
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onMouseEnter={() => { if (!isReadOnly) setHovered(star); }}
          onClick={() => { if (!isReadOnly && onChange) onChange(star); }}
          style={{ color: star <= displayed ? '#FFD600' : 'currentColor', opacity: star <= displayed ? 1 : 0.25 }}
        >
          <StarIcon size={size} weight={star <= displayed ? 'fill' : 'bold'} />
        </span>
      ))}
    </div>
  );
};