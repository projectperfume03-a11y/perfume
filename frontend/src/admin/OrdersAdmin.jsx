import { useCallback, useEffect, useState, Fragment } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { ChevronDown, Trash2, Eye } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal.jsx';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

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
    setConfirm((prev) => ({ ...prev, isLoading: true }));
    try {
      const updated = await api.patch(`/orders/${order._id}/status`, { status }, token);
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      push(`Commande marquée ${STATUS_LABELS[status].toLowerCase()}`);
      if (refreshStats) refreshStats();
      setConfirm(null);
    } catch (e) {
      push(e.message, 'error');
      setConfirm((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const executeRemove = async (order) => {
    setConfirm((prev) => ({ ...prev, isLoading: true }));
    try {
      await api.del(`/orders/${order._id}`, token);
      push('Commande supprimée');
      afterChange();
      setConfirm(null);
    } catch (e) {
      push(e.message, 'error');
      setConfirm((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const confirmChangeStatus = (order, newStatus) => {
    if (order.status === newStatus) return;
    setConfirm({
      isOpen: true,
      title: 'Mettre à jour le statut',
      message: `La commande #${order._id.slice(-6)} passera au statut « ${STATUS_LABELS[newStatus]} ».`,
      confirmText: 'Mettre à jour',
      onConfirm: () => executeChangeStatus(order, newStatus),
      onCancel: () => setConfirm(null),
    });
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

  return (
    <div className="vip-panel">
      <div className="vip-panel-head">
        <div className="status-pills" role="group" aria-label="Filtrer par statut">
          <button className={!filter ? 'active' : ''} onClick={() => setFilter('')}>Toutes</button>
          {STATUSES.map((s) => (
            <button key={s} className={filter === s ? 'active' : ''} onClick={() => setFilter(s)}>
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        <span className="chip">
          {orders.length} commande{orders.length > 1 ? 's' : ''}
          {' · '}
          CA&nbsp;
          <strong style={{ color: 'var(--vip-gold)', fontWeight: 600 }}>
            {revenue.toFixed(3)} DT
          </strong>
        </span>
      </div>

      {loading ? (
        <div className="vip-panel-body" style={{ display: 'grid', gap: '0.8rem' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton" style={{ height: 58 }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="vip-panel-body" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--vip-text-3)' }}>
          Aucune commande pour ce filtre.
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
                  <tr>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <span className="cell-name">#{o._id.slice(-6)}</span>
                        <span style={{ fontSize: '0.74rem', color: 'var(--vip-text-3)' }}>
                          {new Date(o.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="cell-customer">
                        <span className="avatar-init">
                          {(o.customerName || '?').trim().split(/\s+/).slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join('')}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <span style={{ fontWeight: 500 }}>{o.customerName}</span>
                          <span style={{ fontSize: '0.76rem', color: 'var(--vip-text-3)' }}>{o.customerEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <select
                        className={`status-select`}
                        value={o.status}
                        onChange={(e) => confirmChangeStatus(o, e.target.value)}
                        aria-label={`Statut de la commande ${o._id.slice(-6)}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="cell-price">{o.total.toFixed(3).replace('.', ',')} DT</td>
                    <td>
                      <div className="cell-actions">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setExpanded(expanded === o._id ? null : o._id)}
                        >
                          {expanded === o._id ? <ChevronDown size={13} /> : <Eye size={13} />}
                          {expanded === o._id ? 'Fermer' : 'Détails'}
                        </button>
                        <button className="btn btn-vip-danger btn-sm" onClick={() => confirmRemove(o)} aria-label="Supprimer">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expanded === o._id && (
                    <tr style={{ background: 'rgba(201, 171, 119, 0.03)' }}>
                      <td colSpan={5}>
                        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', padding: '0.5rem 0' }}>

                          <div style={{ flex: 1, minWidth: 250 }}>
                            <h4 style={{
                              fontFamily: 'var(--font-sans)',
                              fontSize: '0.64rem', letterSpacing: '0.24em',
                              textTransform: 'uppercase', marginBottom: '1.1rem',
                              color: 'var(--vip-text-3)',
                            }}>
                              Livraison
                            </h4>
                            <p style={{ margin: '0 0 0.55rem', fontSize: '0.88rem' }}>
                              <strong style={{ color: 'var(--vip-text-3)', fontWeight: 500 }}>Téléphone — </strong>
                              {o.customerPhone}
                            </p>
                            <p style={{ margin: '0 0 0.55rem', fontSize: '0.88rem', lineHeight: 1.6 }}>
                              <strong style={{ color: 'var(--vip-text-3)', fontWeight: 500 }}>Adresse — </strong>
                              {o.shippingAddress}
                            </p>
                            {o.notes && (
                              <p style={{
                                margin: 0, fontSize: '0.88rem', lineHeight: 1.6,
                                fontStyle: 'italic', color: '#e0b877',
                              }}>
                                « {o.notes} »
                              </p>
                            )}
                          </div>

                          <div style={{ flex: 2, minWidth: 300 }}>
                            <h4 style={{
                              fontFamily: 'var(--font-sans)',
                              fontSize: '0.64rem', letterSpacing: '0.24em',
                              textTransform: 'uppercase', marginBottom: '1.1rem',
                              color: 'var(--vip-text-3)',
                            }}>
                              Articles ({o.items.reduce((s, i) => s + i.quantity, 0)})
                            </h4>
                            <div className="list-tight">
                              {o.items.map((it) => (
                                <div className="row-item" key={it.productId + it.name}>
                                  <img src={it.image} alt="" className="row-thumb" />
                                  <div className="row-main">
                                    <span className="row-title">{it.name}</span>
                                    <span className="row-sub">Quantité : {it.quantity}</span>
                                  </div>
                                  <span className="row-end">
                                    {(it.price * it.quantity).toFixed(3).replace('.', ',')} DT
                                  </span>
                                </div>
                              ))}
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
