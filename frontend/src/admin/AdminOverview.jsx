import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  ArrowRight, AlertTriangle, PackageCheck, ExternalLink,
} from 'lucide-react';
import { RevenueChart, CategoryDonut } from './charts.jsx';

const STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join('') || '?';

const timeAgo = (d) => {
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (Number.isNaN(s)) return '';
  if (s < 60) return "à l'instant";
  const m = Math.floor(s / 60);
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h} h`;
  const j = Math.floor(h / 24);
  if (j === 1) return 'hier';
  if (j < 30) return `il y a ${j} j`;
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
};

export default function AdminOverview({ onGoOrders }) {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/products'), api.get('/orders', token)])
      .then(([prods, ords]) => {
        setProducts(prods);
        setOrders(ords);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const catSplit = useMemo(() => {
    const byCat = {};
    products.forEach((p) => {
      const c = p.category || 'Autres';
      byCat[c] = (byCat[c] || 0) + 1;
    });
    const PALETTE = ['#d0aa6d', '#a98a54', '#7d9464', '#8a7346'];
    const sorted = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
    const out = sorted.slice(0, 4).map(([label, value], i) => ({ label, value, color: PALETTE[i] }));
    const rest = sorted.slice(4).reduce((s, [, v]) => s + v, 0);
    if (rest > 0) out.push({ label: 'Autres', value: rest, color: '#55503f' });
    return out;
  }, [products]);

  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6),
    [orders],
  );

  const lowStock = products.filter((p) => p.inStock === false);
  const periodTotal = recentOrders.length ? orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0) : 0;

  if (loading) {
    return (
      <>
        <div className="ov-grid">
          <div className="chart-card skeleton" style={{ height: 320 }} />
          <div className="chart-card skeleton" style={{ height: 320 }} />
        </div>
        <div className="ov-grid">
          <div className="chart-card skeleton" style={{ height: 300 }} />
          <div className="chart-card skeleton" style={{ height: 300 }} />
        </div>
      </>
    );
  }

  return (
    <>
      {/* ── Revenus + Répartition ── */}
      <div className="ov-grid">
        <div className="chart-card">
          <div className="chart-head">
            <div>
              <h3 className="chart-title">Revenus — 6 derniers mois</h3>
              <span className="chart-sub">Commandes non annulées · survolez les points</span>
            </div>
            <span className="period-total">{periodTotal.toFixed(3).replace('.', ',')} DT</span>
          </div>
          <RevenueChart series={catSeries(orders)} />
        </div>

        <div className="chart-card">
          <div className="chart-head">
            <h3 className="chart-title">La collection</h3>
            <span className="chart-sub">Répartition par catégorie</span>
          </div>
          {catSplit.length ? (
            <CategoryDonut segments={catSplit} />
          ) : (
            <p className="ov-empty">Ajoutez des pièces pour voir la répartition.</p>
          )}
        </div>
      </div>

      {/* ── Dernières commandes + colonne latérale ── */}
      <div className="ov-grid" style={{ marginTop: '1.4rem' }}>
        <div className="chart-card">
          <div className="chart-head">
            <h3 className="chart-title">Dernières commandes</h3>
            <button onClick={onGoOrders} className="link-underline" style={{ color: 'var(--vip-gold)', fontSize: '0.62rem' }}>
              Tout voir
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <p className="ov-empty">Aucune commande pour l'instant.</p>
          ) : (
            <div className="list-tight">
              {recentOrders.map((o) => (
                <div className="row-item" key={o._id}>
                  <span className="avatar-init">{initials(o.customerName)}</span>
                  <div className="row-main">
                    <span className="row-title">{o.customerName}</span>
                    <span className="row-sub">
                      #{o._id.slice(-6)} · {timeAgo(o.createdAt)}
                    </span>
                  </div>
                  <span className={`status-badge ${o.status}`}>{STATUS_LABELS[o.status]}</span>
                  <span className="row-end">{(o.total || 0).toFixed(3).replace('.', ',')} DT</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          {/* Vigilance stock */}
          <div className="chart-card" style={{ flex: 1 }}>
            <div className="chart-head">
              <h3 className="chart-title">Vigilance stock</h3>
              <PackageCheck size={18} strokeWidth={1.6} style={{ color: 'var(--vip-text-3)' }} />
            </div>
            {lowStock.length === 0 ? (
              <p className="ov-empty">Toutes les pièces sont disponibles.</p>
            ) : (
              <div className="list-tight">
                {lowStock.slice(0, 3).map((p) => (
                  <div className="row-item" key={p._id}>
                    <img src={p.image} alt="" className="row-thumb" />
                    <div className="row-main">
                      <span className="row-title">{p.name}</span>
                      <span className="row-sub" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <AlertTriangle size={11} style={{ color: '#e0b877' }} /> épuisée
                      </span>
                    </div>
                    <span className="chip">Gérer</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Raccourcis */}
          <div className="chart-card">
            <div className="chart-head"><h3 className="chart-title">Raccourcis</h3></div>
            <div style={{ display: 'grid', gap: '0.7rem', paddingTop: '0.25rem' }}>
              <button onClick={onGoOrders} className="btn btn-outline btn-sm btn-block" style={{ justifyContent: 'space-between' }}>
                Traiter les commandes
                <ArrowRight size={14} strokeWidth={1.8} />
              </button>
              <Link to="/" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm btn-block" style={{ justifyContent: 'space-between' }}>
                Voir la boutique
                <ExternalLink size={13} strokeWidth={1.6} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function catSeries(orders) {
  const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const now = new Date();
  const buckets = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ label: MONTHS[d.getMonth()], key: `${d.getFullYear()}-${d.getMonth()}`, value: 0 });
  }
  orders.forEach((o) => {
    if (o.status === 'cancelled') return;
    const d = new Date(o.createdAt);
    const b = buckets.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (b) b.value += o.total || 0;
  });
  return buckets;
}
