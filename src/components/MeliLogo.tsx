import React from 'react';

type Size = 'sm' | 'md' | 'lg' | 'xl';

interface MeliLogoProps {
  size?: Size;
  light?: boolean;
  withText?: boolean;
  subtitle?: string;
  tag?: string;
}

const SIZES: Record<Size, { pin: number; text: number; gap: number }> = {
  sm: { pin: 22, text: 20, gap: 8 },
  md: { pin: 28, text: 24, gap: 10 },
  lg: { pin: 36, text: 32, gap: 12 },
  xl: { pin: 48, text: 42, gap: 14 },
};

export const MeliLogo: React.FC<MeliLogoProps> = ({
  size = 'md',
  light = false,
  withText = true,
  subtitle,
  tag,
}) => {
  const metrics = SIZES[size];
  const color = light ? '#FFFFFF' : '#FF6B00';
  const innerColor = light ? 'rgba(255, 255, 255, 0.6)' : '#3D3D42';

  const stroke = Math.max(2.4, metrics.pin * 0.11);
  const inner = metrics.pin * 0.4;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: `${metrics.gap}px` }}>
      {/* Meli Pin Vector Icon */}
      <div
        style={{
          width: `${metrics.pin}px`,
          height: `${metrics.pin * 1.28}px`,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        {/* Main Circle */}
        <div
          style={{
            width: `${metrics.pin}px`,
            height: `${metrics.pin}px`,
            borderRadius: '50%',
            border: `${stroke}px solid ${color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            backgroundColor: light ? 'transparent' : '#FFFFFF',
            boxShadow: '0 2px 8px rgba(255, 107, 0, 0.25)',
          }}
        >
          {/* Inner ring */}
          <div
            style={{
              width: `${inner}px`,
              height: `${inner}px`,
              borderRadius: '50%',
              border: `${stroke * 0.85}px solid ${innerColor}`,
            }}
          />
        </div>

        {/* Pin Bottom Needle Triangle */}
        <div
          style={{
            position: 'absolute',
            bottom: '2px',
            width: `${metrics.pin * 0.34}px`,
            height: `${metrics.pin * 0.34}px`,
            borderRight: `${stroke}px solid ${color}`,
            borderBottom: `${stroke}px solid ${color}`,
            transform: 'rotate(45deg)',
            zIndex: 1,
          }}
        />
      </div>

      {/* Brand Name Text */}
      {withText && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: `${metrics.text}px`,
                fontWeight: 800,
                letterSpacing: '-0.6px',
                color: color,
                lineHeight: 1,
              }}
            >
              meli
            </span>
            {tag && (
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
          {subtitle && (
            <span
              style={{
                fontSize: '0.72rem',
                color: light ? '#E8E8ED' : 'var(--text-muted)',
                fontWeight: 500,
                marginTop: '3px',
                whiteSpace: 'nowrap',
                letterSpacing: '0.01em',
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
