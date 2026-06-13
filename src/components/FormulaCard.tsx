import type { ReactNode } from 'react';

interface FormulaCardProps {
  id: string;
  title: string;
  formula?: string;
  children: ReactNode;
  accent?: 'gold' | 'blue' | 'green' | 'yellow' | 'red' | 'gray';
}

const ACCENT_COLORS: Record<string, string> = {
  gold:  '#D4A62A',
  blue:  '#2563eb',
  green: '#16a34a',
  yellow:'#d97706',
  red:   '#dc2626',
  gray:  '#6b7280',
};

/* Gold is relatively light, so use a dark text for the badge. */
const BADGE_TEXT: Record<string, string> = {
  gold:  '#111827',
  blue:  'white',
  green: 'white',
  yellow:'white',
  red:   'white',
  gray:  'white',
};

export function FormulaCard({ id, title, formula, children, accent = 'gold' }: FormulaCardProps) {
  const accentColor = ACCENT_COLORS[accent];
  const badgeText   = BADGE_TEXT[accent];

  return (
    <div className="formula-card">
      <div
        className="formula-card-accent"
        style={{ backgroundColor: accentColor }}
      />
      <div className="formula-card-content">
        <div className="formula-card-header">
          <span
            className="formula-card-id"
            style={{ backgroundColor: accentColor, color: badgeText }}
          >
            {id}
          </span>
          <h3 className="formula-card-title">{title}</h3>
        </div>
        {formula && (
          <div className="formula-box">
            <code>{formula}</code>
          </div>
        )}
        <div className="formula-card-body">{children}</div>
      </div>
    </div>
  );
}
