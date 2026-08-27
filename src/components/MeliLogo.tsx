import React from 'react';
import logoFull from '../assets/meli-logo.png';
import logoIcon from '../assets/meli-icon.png';

type Size = 'sm' | 'md' | 'lg' | 'xl';

interface MeliLogoProps {
  size?: Size;
  light?: boolean;
  withText?: boolean;
  subtitle?: string;
  tag?: string;
}

const SIZES: Record<Size, { height: number }> = {
  sm: { height: 28 },
  md: { height: 40 },
  lg: { height: 56 },
  xl: { height: 72 },
};

export const MeliLogo: React.FC<MeliLogoProps> = ({
  size = 'md',
  light = false,
  withText = true,
  subtitle,
  tag,
}) => {
  const metrics = SIZES[size];
  const src = withText ? logoFull : logoIcon;

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: subtitle && withText ? '4px' : 0,
      }}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <img
          src={src}
          alt="meli"
          draggable={false}
          style={{
            height: `${metrics.height}px`,
            width: 'auto',
            display: 'block',
            flexShrink: 0,
            userSelect: 'none',
            objectFit: 'contain',
          }}
        />
        {tag && withText && (
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              backgroundColor: light ? 'rgba(255, 255, 255, 0.2)' : 'var(--primary-soft)',
              color: light ? '#FFFFFF' : 'var(--primary)',
              padding: '1px 6px',
              borderRadius: 'var(--radius-sm)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {tag}
          </span>
        )}
      </div>
      {subtitle && withText && (
        <span
          style={{
            fontSize: '0.72rem',
            color: light ? '#E8E8ED' : 'var(--text-muted)',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            letterSpacing: '0.01em',
          }}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
};
