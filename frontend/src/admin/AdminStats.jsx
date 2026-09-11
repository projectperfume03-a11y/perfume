import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Package2, ShoppingCart, BadgeDollarSign, Clock } from 'lucide-react';

/* ── Sparkline SVG minimaliste ── */
function Spark({ points, up = true }) {
  const max = Math.max(...points, 1);
  const step = 100 / (points.length - 1 || 1);
  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${(30 - (p / max) * 26).toFixed(1)}`)
    .join(' ');
  const color = up ? '#8fc97c' : '#e0968d';
  return (
    <svg
      className="spark"
      width="88"
      height="32"
      viewBox="0 0 100 30"
      fill="none"
      aria-hidden="true"
    >
      <path d={path} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      <circle
        cx={(points.length - 1) * step}
        cy={(30 - (points[points.length - 1] / max) * 26)}
        r="3"
        fill={color}
        opacity="0.9"
      />
    </svg>
  );
}

/* ── Compteur animé ── */
function CountUp({ target, duration = 900, prefix = '', suffix = '' }) {
  const [val, setVal] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = typeof target === 'number' ? target : 0;

    const tick = (now) => {
      const pct = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      setVal(from + (to - from) * ease);
      if (pct < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  if (typeof target !== 'number') return <>{target}</>;

  const display = suffix === ' DT'
    ? val.toLocaleString('fr-FR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
    : Math.round(val);

  return <>{prefix}{display}{suffix}</>;
}

const fmtDT = (n) => Number(n || 0).toLocaleString('fr-FR', {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

export default function AdminStats({ stats, insight, loading }) {

  const deltaChip = (delta) => {
    if (delta === null || delta === undefined || Number.isNaN(delta)) return null;
    if (delta === 0) return <span className="trend-chip">stable</span>;
    const up = delta > 0;
    return (
      <span className={`trend-chip ${up ? 'up' : 'down'}`}>
        {up ? <TrendingUp size={10} strokeWidth={2.2} /> : <TrendingDown size={10} strokeWidth={2.2} />}
        {up ? '+' : ''}{delta}%
      </span>
    );
  };

  const items = [
    {
      key: 'products',
      label: 'Créations en vitrine',
      value: stats.products,
      isNum: true,
      hint: 'références actives',
      icon: <Package2 size={17} strokeWidth={1.5} />,
      chip: null,
      up: true,
      spark: [3, 4, 4, 6, 5, 7, stats.products || 8],
    },
    {
      key: 'orders',
      label: 'Commandes',
      value: stats.orders,
      isNum: true,
      hint: insight ? `panier moyen ${fmtDT(insight.avgBasket)} DT` : '—',
      icon: <ShoppingCart size={17} strokeWidth={1.5} />,
      chip: insight ? deltaChip(insight.ordDelta) : null,
      up: (insight?.ordDelta || 0) >= 0,
      spark: [2, 3, 3, 5, 4, 6, stats.orders || 7],
    },
    {
      key: 'revenue',
      label: "Chiffre d'affaires",
      value: stats.revenue,
      isNum: true,
      suffix: ' DT',
      hint: insight ? `ce mois : ${fmtDT(insight.revThis)} DT` : '—',
      icon: <BadgeDollarSign size={17} strokeWidth={1.5} />,
      chip: insight ? deltaChip(insight.revDelta) : null,
      up: (insight?.revDelta || 0) >= 0,
      spark: [2, 3, 5, 4, 7, 6, stats.revenue ? 9 : 0],
    },
    {
      key: 'pending',
      label: 'En attente',
      value: stats.pending,
      isNum: true,
      hint: stats.pending > 0 ? 'action requise' : 'tout est traité ✓',
      icon: <Clock size={17} strokeWidth={1.5} />,
      chip: (
        <span className={`trend-chip ${stats.pending > 0 ? 'warn' : 'up'}`}>
          {stats.pending > 0 ? 'à traiter' : 'à jour'}
        </span>
      ),
      up: stats.pending === 0,
      spark: [5, 4, 6, 3, 4, 2, stats.pending || 0],
    },
  ];

  if (loading) {
    return (
      <div className="stats-grid">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="stat-card skeleton" style={{ minHeight: 160 }} />
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
          <strong className="stat-value gold">
            {it.isNum && typeof it.value === 'number' ? (
              <CountUp target={it.value} suffix={it.suffix || ''} />
            ) : (
              it.value
            )}
          </strong>
          <span className="stat-hint">{it.hint}</span>
          <Spark points={it.spark} up={it.up} />
        </article>
      ))}
    </div>
  );
}
