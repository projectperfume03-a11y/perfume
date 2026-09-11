import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, ExternalLink, LogOut, Bell, Menu, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useAdminStats } from './useAdminStats.js';
import AdminStats from './AdminStats.jsx';
import AdminOverview from './AdminOverview.jsx';
import ProductsAdmin from './ProductsAdmin.jsx';
import OrdersAdmin from './OrdersAdmin.jsx';
import '../styles/admin.css';

const TAB_META = {
  overview: {
    title: "Vue d'ensemble",
    subtitle: 'La santé de votre boutique en un regard',
  },
  products: {
    title: 'Collection',
    subtitle: 'Créez, modifiez et organisez votre sélection parfum',
  },
  orders: {
    title: 'Commandes',
    subtitle: 'Suivez et préparez les commandes de vos clients',
  },
};

const todayLabel = new Date().toLocaleDateString('fr-FR', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});

export default function AdminDashboard() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { stats, insight, loading: statsLoading, refresh } = useAdminStats();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const switchTab = (t) => {
    setTab(t);
    setMobileMenuOpen(false);
  };

  return (
    <div className="admin-shell">

      {/* ── Sidebar ── */}
      <aside className="vip-sidebar">
        {/* Brand */}
        <div className="vip-brand">
          <img src="/roya-crest-gold.png" alt="ROYA" className="vip-brand-mark" />
          <div>
            <div className="vip-brand-name">ROYA</div>
            <span className="vip-brand-sub">Administration</span>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <p className="vip-nav-label">Pilotage</p>
          <nav className="vip-nav" aria-label="Navigation admin">
            <button
              className={tab === 'overview' ? 'active' : ''}
              onClick={() => switchTab('overview')}
            >
              <LayoutDashboard size={17} strokeWidth={1.6} />
              Aperçu
            </button>
            <button
              className={tab === 'products' ? 'active' : ''}
              onClick={() => switchTab('products')}
            >
              <Package size={17} strokeWidth={1.6} />
              Collection
              {stats.products > 0 && (
                <span className="vip-nav-count">{stats.products}</span>
              )}
            </button>
            <button
              className={tab === 'orders' ? 'active' : ''}
              onClick={() => switchTab('orders')}
            >
              <ShoppingBag size={17} strokeWidth={1.6} />
              Commandes
              {stats.orders > 0 && (
                <span className="vip-nav-count">{stats.orders}</span>
              )}
            </button>
          </nav>
        </div>

        {/* Pied de sidebar */}
        <div className="vip-sidebar-foot">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-sm btn-block"
            style={{ justifyContent: 'flex-start', gap: '0.7rem' }}
          >
            <ExternalLink size={14} strokeWidth={1.6} />
            Voir la boutique
          </Link>
          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-sm btn-block"
            style={{ justifyContent: 'flex-start', gap: '0.7rem', color: 'var(--adm-text-2)' }}
          >
            <LogOut size={14} strokeWidth={1.6} />
            Déconnexion
          </button>
          <span className="vip-sidebar-version">Maison ROYA · v3</span>
        </div>
      </aside>

      {/* ── Zone principale ── */}
      <div className="vip-main">

        {/* Topbar */}
        <header className="vip-topbar">
          <div className="vip-topbar-title">
            <h1>{TAB_META[tab].title}</h1>
            <p>{TAB_META[tab].subtitle}</p>
          </div>

          <div className="vip-top-actions">
            <span className="vip-topbar-date">{todayLabel}</span>

            <button
              className="bell-btn"
              onClick={() => switchTab('orders')}
              aria-label={`${stats.pending} commande(s) en attente`}
              title="Commandes en attente"
            >
              <Bell size={17} strokeWidth={1.6} />
              {stats.pending > 0 && (
                <span className="bell-dot">{stats.pending}</span>
              )}
            </button>

            <div className="vip-userchip">
              <span className="vip-avatar">{(username || 'A').charAt(0).toUpperCase()}</span>
              <div>
                <small>Session</small>
                <strong>{username}</strong>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu */}
        <main className="vip-content">
          <AdminStats stats={stats} insight={insight} loading={statsLoading} />

          {tab === 'overview' && <AdminOverview onGoOrders={() => switchTab('orders')} />}
          {tab === 'products' && <ProductsAdmin refreshStats={refresh} />}
          {tab === 'orders' && <OrdersAdmin refreshStats={refresh} />}
        </main>
      </div>
    </div>
  );
}
