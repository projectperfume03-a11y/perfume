import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const MONTHS_SHORT = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

function buildSeries(orders) {
  const now = new Date();
  const buckets = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      label: MONTHS_SHORT[d.getMonth()],
      key: `${d.getFullYear()}-${d.getMonth()}`,
      value: 0,
      count: 0,
    });
  }
  orders.forEach((o) => {
    if (o.status === 'cancelled') return;
    const d = new Date(o.createdAt);
    const b = buckets.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (b) {
      b.value += o.total || 0;
      b.count += 1;
    }
  });
  return buckets;
}

function pctDelta(current, previous) {
  if (previous > 0) return Math.round(((current - previous) / previous) * 100);
  if (current > 0) return 100;
  return 0;
}

export function useAdminStats() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 });
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    Promise.all([api.get('/products'), api.get('/orders', token)])
      .then(([products, orders]) => {
        const valid = orders.filter((o) => o.status !== 'cancelled');
        const revenue = valid.reduce((s, o) => s + o.total, 0);
        const pending = orders.filter((o) => o.status === 'pending').length;

        const series = buildSeries(orders);
        const revThis = series[5].value;
        const revLast = series[4].value;
        const ordThis = series[5].count;
        const ordLast = series[4].count;

        // Répartition de la collection par catégorie (top 4 + autres)
        const byCat = {};
        products.forEach((p) => {
          const c = p.category || 'Autres';
          byCat[c] = (byCat[c] || 0) + 1;
        });
        const sorted = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
        const PALETTE = ['#d0aa6d', '#a98a54', '#7d9464', '#8a7346'];
        const catSplit = sorted.slice(0, 4).map(([label, value], i) => ({
          label,
          value,
          color: PALETTE[i],
        }));
        const rest = sorted.slice(4).reduce((s, [, v]) => s + v, 0);
        if (rest > 0) catSplit.push({ label: 'Autres', value: rest, color: '#55503f' });

        setStats({ products: products.length, orders: orders.length, revenue, pending });
        setInsight({
          revDelta: pctDelta(revThis, revLast),
          ordDelta: pctDelta(ordThis, ordLast),
          avgBasket: valid.length ? revenue / valid.length : 0,
          series,
          catSplit,
          revThis,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, insight, loading, refresh };
}

