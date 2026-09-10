import { TrendingUp, TrendingDown } from 'lucide-react';

const Spark = ({ points, up = true }) => {
  const max = Math.max(...points, 1);
  const step = 100 / (points.length - 1 || 1);
  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${(30 - (p / max) * 26).toFixed(1)}`)
    .join(' ');
  return (
    <svg className="spark" width="86" height="32" viewBox="0 0 100 30" fill="none" aria-hidden="true">
      <path d={path} stroke={up ? '#a9c48d' : '#e0968d'} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
};

const ICONS = {
  products: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.3 7 12 12l8.7-5" />
      <path d="M12 22V12" />
    </svg>
  ),
  orders: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1.5" />
      <circle cx="20" cy="21" r="1.5" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  ),
  revenue: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12M15.5 8.8c-.7-1-2-1.6-3.5-1.6-2 0-3.5 1-3.5 2.4S10 11.8 12 12s3.5.9 3.5 2.4-1.5 2.4-3.5 2.4c-1.5 0-2.8-.6-3.5-1.6" />
    </svg>
  ),
  pending: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
};

const fmtDT = (n) => `${Number(n || 0).toFixed(3).replace('.', ',')} DT`;

export default function AdminStats({ stats, insight, loading }) {
  const deltaChip = (delta) => {
    if (delta === null || Number.isNaN(delta)) return null;
    if (delta === 0) return <span className="trend-chip up">stable</span>;
    const up = delta > 0;
    return (
      <span className={`trend-chip ${up ? 'up' : 'down'}`}>
        {up ? <TrendingUp size={11} strokeWidth={2.2} /> : <TrendingDown size={11} strokeWidth={2.2} />}
        {up ? '+' : ''}{delta}%
      </span>
    );
  };

  const items = [
    {
      key: 'products',
      label: 'Créations',
      value: stats.products,
      hint: 'en vitrine',
      icon: ICONS.products,
      chip: null,
      up: true,
      spark: [3, 4, 4, 6, 5, 7, 8],
    },
    {
      key: 'orders',
      label: 'Commandes',
      value: stats.orders,
      hint: insight ? `panier moyen ${fmtDT(insight.avgBasket)}` : '—',
      icon: ICONS.orders,
      chip: insight ? deltaChip(insight.ordDelta) : null,
      up: true,
      spark: [2, 3, 3, 5, 4, 6, 7],
    },
    {
      key: 'revenue',
      label: "Chiffre d'affaires",
      value: fmtDT(stats.revenue),
      hint: insight ? `ce mois : ${fmtDT(insight.revThis)}` : '—',
      icon: ICONS.revenue,
      chip: insight ? deltaChip(insight.revDelta) : null,
      up: true,
      spark: [2, 3, 5, 4, 7, 6, 9],
    },
    {
      key: 'pending',
      label: 'En attente',
      value: stats.pending,
      hint: stats.pending > 0 ? 'action requise' : 'tout est traité',
      icon: ICONS.pending,
      chip: (
        <span className={`trend-chip ${stats.pending > 0 ? 'warn' : 'up'}`}>
          {stats.pending > 0 ? 'à traiter' : 'à jour'}
        </span>
      ),
      up: false,
      spark: [5, 4, 6, 3, 4, 2, 3],
    },
  ];

  if (loading) {
    return (
      <div className="stats-grid">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="stat-card skeleton stat-skeleton" />
        ))}
      </div>
    );
  }

  return (
    <div className="stats-grid">
      {items.map((it) => (
        <article className="stat-card" key={it.key}>
          <div className="stat-head">
            <span className="stat-icon-ring">{it.icon}</span>
            {it.chip}
          </div>
          <span className="stat-label">{it.label}</span>
          <strong className="stat-value gold">{it.value}</strong>
          <span className="stat-hint">{it.hint}</span>
          <Spark points={it.spark} up={it.up} />
        </article>
      ))}
    </div>
  );
}
