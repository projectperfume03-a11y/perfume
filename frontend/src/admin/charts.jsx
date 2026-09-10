/* Graphiques SVG du panel admin — sans dépendance externe */

function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

export function RevenueChart({ series, height = 240 }) {
  const W = 640;
  const H = height;
  const P = { t: 16, r: 16, b: 34, l: 16 };
  const max = Math.max(...series.map((s) => s.value), 1);
  const nice = max * 1.18;
  const xs = (i) => P.l + (i * (W - P.l - P.r)) / Math.max(series.length - 1, 1);
  const ys = (v) => H - P.b - (v / nice) * (H - P.t - P.b);

  const pts = series.map((s, i) => [xs(i), ys(s.value)]);
  const line = smoothPath(pts);
  const area = `${line} L${pts[pts.length - 1][0]},${H - P.b} L${pts[0][0]},${H - P.b} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
      role="img"
      aria-label="Évolution des revenus sur six mois"
    >
      <defs>
        <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d0aa6d" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#d0aa6d" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a98a54" />
          <stop offset="55%" stopColor="#e2c084" />
          <stop offset="100%" stopColor="#b08d57" />
        </linearGradient>
      </defs>

      {/* Grille pointillée */}
      {[0.25, 0.5, 0.75, 1].map((f) => {
        const y = P.t + (H - P.t - P.b) * f;
        return (
          <line
            key={f}
            x1={P.l} x2={W - P.r} y1={y} y2={y}
            stroke="rgba(201,171,119,0.12)"
            strokeDasharray="3 6"
          />
        );
      })}
      <line
        x1={P.l} x2={W - P.r} y1={H - P.b} y2={H - P.b}
        stroke="rgba(201,171,119,0.28)"
      />

      <path d={area} fill="url(#goldArea)" />
      <path d={line} fill="none" stroke="url(#goldLine)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Points interactifs */}
      {series.map((s, i) => (
        <g key={s.key}>
          <circle cx={xs(i)} cy={ys(s.value)} r="9" fill="transparent">
            <title>{`${s.label} — ${s.value.toFixed(3)} DT (${s.count} commande${s.count > 1 ? 's' : ''})`}</title>
          </circle>
          <circle
            cx={xs(i)} cy={ys(s.value)}
            r={i === series.length - 1 ? 5 : 3.5}
            fill="#191009"
            stroke={i === series.length - 1 ? '#e2c084' : '#d0aa6d'}
            strokeWidth="2"
            style={{ transition: 'r .2s' }}
          >
            <title>{`${s.label} — ${s.value.toFixed(3)} DT`}</title>
          </circle>
        </g>
      ))}

      {/* Mois */}
      {series.map((s, i) => (
        <text
          key={`l-${s.key}`}
          x={xs(i)} y={H - 10}
          textAnchor="middle"
          fontSize="11"
          letterSpacing="1"
          fill="#837359"
          fontFamily="Jost, sans-serif"
          style={{ textTransform: 'uppercase' }}
        >
          {s.label}
        </text>
      ))}
    </svg>
  );
}

export function CategoryDonut({ segments }) {
  const R = 52;
  const CIRC = 2 * Math.PI * R;
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = 0;

  return (
    <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <svg width="150" height="150" viewBox="0 0 140 140" role="img" aria-label="Répartition par catégorie">
        <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(201,171,119,0.09)" strokeWidth="15" />
        {segments.map((s) => {
          const frac = total ? s.value / total : 0;
          const dash = frac * CIRC;
          const el = (
            <circle
              key={s.label}
              cx="70" cy="70" r={R}
              fill="none"
              stroke={s.color}
              strokeWidth="15"
              strokeDasharray={`${Math.max(dash - 2, 0)} ${CIRC - dash + 2}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 70 70)"
            />
          );
          offset += dash;
          return el;
        })}
        <text x="70" y="68" textAnchor="middle" fill="#efe6d8" fontSize="27" fontWeight="600" fontFamily="'Cormorant Garamond', serif">
          {total}
        </text>
        <text x="70" y="88" textAnchor="middle" fill="#837359" fontSize="7.5" letterSpacing="2.5" fontFamily="Jost, sans-serif">
          PIÈCES
        </text>
      </svg>

      <ul className="donut-legend" style={{ flex: 1, minWidth: 170 }}>
        {segments.map((s) => (
          <li className="donut-row" key={s.label}>
            <span className="dot" style={{ background: s.color }} />
            <span className="donut-label">{s.label}</span>
            <span className="donut-val">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
