import type { StatusLevel } from '../engineering/types';

interface ResultBadgeProps {
  status: StatusLevel;
  label: string;
}

const STATUS_CONFIG: Record<StatusLevel, { bg: string; color: string; border: string }> = {
  ok: { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  warning: { bg: '#fffbeb', color: '#92400e', border: '#fde68a' },
  danger: { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
  info: { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
};

export function ResultBadge({ status, label }: ResultBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '999px',
        fontSize: '0.78rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        backgroundColor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
      }}
    >
      {label}
    </span>
  );
}
