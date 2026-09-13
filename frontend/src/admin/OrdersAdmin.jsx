import { useCallback, useEffect, useState, Fragment } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { ChevronDown, ChevronUp, Trash2, MapPin, Phone, MessageSquare, Package } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal.jsx';
import AdminSelect from './AdminSelect.jsx';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const STATUS_META = {
  pending:   { label: 'En attente',  color: '#d4a050', bg: 'rgba(212,160,80,0.1)',   border: 'rgba(212,160,80,0.22)' },
  confirmed: { label: 'Confirmée',   color: '#8fc97c', bg: 'rgba(100,160,85,0.1)',   border: 'rgba(100,160,85,0.22)' },
  shipped:   { label: 'Expédiée',    color: '#80b4d4', bg: 'rgba(80,140,200,0.1)',   border: 'rgba(80,140,200,0.22)' },
  delivered: { label: 'Livrée',      color: '#a9c48d', bg: 'rgba(120,180,100,0.1)',  border: 'rgba(120,180,100,0.22)' },
  cancelled: { label: 'Annulée',     color: '#e0968d', bg: 'rgba(192,86,74,0.1)',    border: 'rgba(192,86,74,0.22)' },
};

const STATUS_OPTIONS = STATUSES.map((s) => ({
  value: s,
  label: STATUS_META[s].label,
  color: STATUS_META[s].color,
  bg: STATUS_META[s].bg,
}));

function StatusBadgeInline({ status }) {
  const m = STATUS_META[status] || STATUS_META.pending;
  return (
    <span style={{
      padding: '0.28rem 0.6rem',
      borderRadius: '4px',
      fontSize: '0.6rem',
      fontWeight: 500,
      letterSpacing: '0.05em',
      color: m.color,
      background: m.bg,
      border: `1px solid ${m.border}`,
      whiteSpace: 'nowrap',
    }}>
      {m.label}
    </span>
  );
}

export default function OrdersAdmin({ refreshStats }) {
  const { token } = useAuth();
  const { push } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get(filter ? `/orders?status=${filter}` : '/orders', token)
      .then(setOrders)
      .catch((e) => push(e.message, 'error'))
      .finally(() => setLoading(false));
  }, [filter, token, push]);

  useEffect(load, [load]);

  const afterChange = () => {
    load();
    if (refreshStats) refreshStats();
  };

  const executeChangeStatus = async (order, status) => {
    if (order.status === status) return;
    try {
      const updated = await api.patch(`/orders/${order._id}/status`, { status }, token);
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      push(`Statut de la commande #${order._id.slice(-6)} : ${STATUS_META[status]?.label || status} ✓`);
      if (refreshStats) refreshStats();
    } catch (e) {
      push(e.message, 'error');
    }
  };

  const confirmRemove = (order) => {
    setConfirm({
      isOpen: true,
      title: 'Supprimer la commande',
      message: `La commande #${order._id.slice(-6)} sera définitivement effacée. Cette action est irréversible.`,
      isDanger: true,
      confirmText: 'Supprimer',
      onConfirm: () => executeRemove(order),
      onCancel: () => setConfirm(null),
    });
  };

  const revenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((s, o) => s + o.total, 0);

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <div className="vip-panel">
      {/* ── En-tête + filtres ── */}
      <div className="vip-panel-head" style={{ flexDirection: 'column', gap: '1rem', alignItems: 'stretch' }}>
        {/* Ligne 1 : titre + CA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2 className="vip-panel-title">Commandes</h2>
          <span className="chip" style={{ fontSize: '0.72rem' }}>
            {orders.length} commande{orders.length !== 1 ? 's' : ''}
            {' · '}CA&nbsp;
            <strong style={{ color: 'var(--adm-gold)', fontWeight: 600 }}>
              {revenue.toLocaleString('fr-FR', { minimumFractionDigits: 3 })} DT
            </strong>
          </span>
        </div>

        {/* Ligne 2 : pills de filtre */}
        <div className="status-pills" role="group" aria-label="Filtrer par statut">
          <button
            className={!filter ? 'active' : ''}
            onClick={() => setFilter('')}
          >
            Toutes
            <span className="vip-nav-count" style={{ marginLeft: '0.4rem' }}>{orders.length}</span>
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              className={filter === s ? 'active' : ''}
              onClick={() => setFilter(s === filter ? '' : s)}
            >
              {STATUS_META[s].label}
              {counts[s] > 0 && (
                <span className="vip-nav-count" style={{ marginLeft: '0.4rem' }}>{counts[s]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Contenu ── */}
      {loading ? (
        <div className="vip-panel-body" style={{ display: 'grid', gap: '0.8rem' }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 62, borderRadius: 6 }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="vip-panel-body" style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--adm-text-3)' }}>
          <Package size={36} strokeWidth={1.2} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <p style={{ fontSize: '0.9rem' }}>Aucune commande pour ce filtre.</p>
          {filter && (
            <button className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }} onClick={() => setFilter('')}>
              Voir toutes les commandes
            </button>
          )}
        </div>
      ) : (
        <div className="vip-table-wrap">
          <table className="vip-table">
            <thead>
              <tr>
                <th>Commande</th>
                <th>Client</th>
                <th>Statut</th>
                <th>Montant</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <Fragment key={o._id}>
                  {/* Ligne principale */}
                  <tr>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <span className="cell-name">#{o._id.slice(-6)}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)' }}>
                          {new Date(o.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="cell-customer">
                        <span className="avatar-init">
                          {(o.customerName || '?').trim().split(/\s+/).slice(0, 2)
                            .map((w) => w.charAt(0).toUpperCase()).join('')}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                          <span style={{ fontWeight: 500, fontSize: '0.82rem', color: 'var(--adm-text)' }}>
                            {o.customerName}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--adm-text-3)' }}>
                            {o.customerEmail}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <AdminSelect
                        value={o.status}
                        onChange={(e) => executeChangeStatus(o, e.target.value)}
                        options={STATUS_OPTIONS}
                        size="sm"
                        className="status-admin-select"
                      />
                    </td>
                    <td className="cell-price">
                      {(o.total || 0).toLocaleString('fr-FR', { minimumFractionDigits: 3 })} DT
                    </td>
                    <td>
                      <div className="cell-actions">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setExpanded(expanded === o._id ? null : o._id)}
                          aria-label={expanded === o._id ? 'Fermer détails' : 'Voir détails'}
                        >
                          {expanded === o._id
                            ? <ChevronUp size={13} strokeWidth={2} />
                            : <ChevronDown size={13} strokeWidth={2} />}
                          {expanded === o._id ? 'Fermer' : 'Détails'}
                        </button>
                        <button
                          className="btn btn-vip-danger btn-sm"
                          onClick={() => confirmRemove(o)}
                          aria-label="Supprimer cette commande"
                        >
                          <Trash2 size={13} strokeWidth={1.6} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Ligne détails expansible */}
                  {expanded === o._id && (
                    <tr style={{ background: 'rgba(212, 175, 117, 0.025)' }}>
                      <td colSpan={5} style={{ padding: '0' }}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(220px, 0.7fr) 1fr',
                          gap: '2rem',
                          padding: '1.35rem 1.5rem',
                          borderTop: '1px solid rgba(212,175,117,0.1)',
                        }}>
                          {/* Informations de livraison */}
                          <div>
                            <h4 style={{
                              fontSize: '0.62rem',
                              letterSpacing: '0.22em',
                              textTransform: 'uppercase',
                              marginBottom: '1rem',
                              color: 'var(--adm-text-3)',
                            }}>
                              Informations livraison
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                              {o.customerPhone && (
                                <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'flex-start' }}>
                                  <Phone size={13} strokeWidth={1.6} style={{ color: 'var(--adm-text-3)', marginTop: '0.1rem', flexShrink: 0 }} />
                                  <span style={{ fontSize: '0.84rem', color: 'var(--adm-text-2)' }}>{o.customerPhone}</span>
                                </div>
                              )}
                              {o.shippingAddress && (
                                <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'flex-start' }}>
                                  <MapPin size={13} strokeWidth={1.6} style={{ color: 'var(--adm-text-3)', marginTop: '0.1rem', flexShrink: 0 }} />
                                  <span style={{ fontSize: '0.84rem', color: 'var(--adm-text-2)', lineHeight: 1.55 }}>{o.shippingAddress}</span>
                                </div>
                              )}
                              {o.notes && (
                                <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'flex-start' }}>
                                  <MessageSquare size={13} strokeWidth={1.6} style={{ color: 'var(--adm-text-3)', marginTop: '0.1rem', flexShrink: 0 }} />
                                  <span style={{ fontSize: '0.84rem', color: '#d4a050', fontStyle: 'italic', lineHeight: 1.55 }}>
                                    « {o.notes} »
                                  </span>
                                </div>
                              )}
                              <div style={{ marginTop: '0.65rem' }}>
                                <span style={{ display: 'block', fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--adm-text-3)', marginBottom: '0.45rem' }}>
                                  Modifier le statut :
                                </span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                  {STATUSES.map((st) => {
                                    const isCur = o.status === st;
                                    const meta = STATUS_META[st];
                                    return (
                                      <button
                                        key={st}
                                        type="button"
                                        onClick={() => executeChangeStatus(o, st)}
                                        style={{
                                          padding: '0.3rem 0.65rem',
                                          borderRadius: '6px',
                                          fontSize: '0.68rem',
                                          fontWeight: isCur ? 700 : 500,
                                          color: isCur ? meta.color : 'var(--adm-text-2)',
                                          background: isCur ? meta.bg : 'rgba(255,255,255,0.7)',
                                          border: `1px solid ${isCur ? meta.border : 'rgba(188,156,130,0.2)'}`,
                                          cursor: isCur ? 'default' : 'pointer',
                                          transition: 'all 0.2s',
                                        }}
                                        title={`Passer au statut ${meta.label}`}
                                      >
                                        {meta.label} {isCur && '✓'}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Articles commandés */}
                          <div>
                            <h4 style={{
                              fontSize: '0.62rem',
                              letterSpacing: '0.22em',
                              textTransform: 'uppercase',
                              marginBottom: '1rem',
                              color: 'var(--adm-text-3)',
                            }}>
                              Articles ({o.items.reduce((s, i) => s + i.quantity, 0)})
                            </h4>
                            <div className="list-tight">
                              {o.items.map((it) => (
                                <div className="row-item" key={it.productId + it.name}>
                                  {it.image && <img src={it.image} alt="" className="row-thumb" />}
                                  <div className="row-main">
                                    <span className="row-title">{it.name}</span>
                                    <span className="row-sub">
                                      Qté : {it.quantity} · {(it.price).toLocaleString('fr-FR', { minimumFractionDigits: 3 })} DT/u
                                    </span>
                                  </div>
                                  <span className="row-end">
                                    {(it.price * it.quantity).toLocaleString('fr-FR', { minimumFractionDigits: 3 })} DT
                                  </span>
                                </div>
                              ))}
                            </div>
                            {/* Sous-total */}
                            <div style={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              paddingTop: '0.85rem',
                              borderTop: '1px solid rgba(212,175,117,0.12)',
                              marginTop: '0.5rem',
                            }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-3)', marginRight: '0.75rem' }}>Total</span>
                              <strong style={{ color: 'var(--adm-gold)', fontFamily: 'var(--font-serif)', fontSize: '1.05rem' }}>
                                {(o.total || 0).toLocaleString('fr-FR', { minimumFractionDigits: 3 })} DT
                              </strong>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirm && <ConfirmModal {...confirm} dark />}
    </div>
  );
}
