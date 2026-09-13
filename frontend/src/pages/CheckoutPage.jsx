import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Lock } from 'lucide-react';
import { api } from '../api.js';
import { useCart } from '../context/CartContext.jsx';

export default function CheckoutPage() {
  const { items, total, shippingCost, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const shipping = shippingCost;
  const grandTotal = total + shipping;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      const order = await api.post('/orders', {
        ...form,
        items,
        total: grandTotal,
      });
      clearCart();
      navigate(`/merci/${order._id}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container page-checkout">
        <div className="empty-state" style={{ padding: '7rem 2rem' }}>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '0.9rem' }}>Votre panier est vide</h2>
          <p>
            Ajoutez une fragrance de votre sélection avant de finaliser votre commande.
          </p>
          <Link to="/produits" className="btn btn-primary">Voir la collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-checkout">

      <nav className="breadcrumbs" aria-label="Fil d'Ariane">
        <Link to="/">Accueil</Link>
        <ChevronRight size={12} />
        <Link to="/produits">Boutique</Link>
        <ChevronRight size={12} />
        <span className="current">Finalisation</span>
      </nav>

      <header className="checkout-head">
        <span className="eyebrow">Dernière étape</span>
        <h1>
          Finaliser votre <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>commande</em>
        </h1>
        <p>Renseignez vos coordonnées — nous vous contacterons pour confirmer l'expédition.</p>
      </header>

      <div className="checkout-grid">
        <form onSubmit={submit}>
          <div className="panel">
            <h2 className="panel-title">
              <Lock size={19} strokeWidth={1.6} />
              Vos coordonnées
            </h2>

            <div className="form-grid">
              <div className="field span-2">
                <label htmlFor="co-name">Nom complet <em>*</em></label>
                <input
                  id="co-name"
                  required
                  className="input"
                  value={form.customerName}
                  onChange={set('customerName')}
                  placeholder="Votre nom et prénom"
                  autoComplete="name"
                />
              </div>

              <div className="field">
                <label htmlFor="co-email">E-mail <em>*</em></label>
                <input
                  id="co-email"
                  required
                  type="email"
                  className="input"
                  value={form.customerEmail}
                  onChange={set('customerEmail')}
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                />
              </div>

              <div className="field">
                <label htmlFor="co-phone">Téléphone <em>*</em></label>
                <input
                  id="co-phone"
                  required
                  className="input"
                  value={form.customerPhone}
                  onChange={set('customerPhone')}
                  placeholder="06 12 34 56 78"
                  autoComplete="tel"
                />
              </div>

              <div className="field span-2">
                <label htmlFor="co-address">Adresse de livraison <em>*</em></label>
                <textarea
                  id="co-address"
                  required
                  rows={3}
                  className="input"
                  value={form.shippingAddress}
                  onChange={set('shippingAddress')}
                  placeholder="Numéro, rue, ville, code postal…"
                  autoComplete="street-address"
                />
              </div>

              <div className="field span-2">
                <label htmlFor="co-notes">Note pour la maison <span style={{ color: 'var(--text-muted)', textTransform: 'none', letterSpacing: 0 }}>(facultatif)</span></label>
                <textarea
                  id="co-notes"
                  rows={2}
                  className="input"
                  value={form.notes}
                  onChange={set('notes')}
                  placeholder="Une demande d’emballage cadeau, un parfum de préférence, une précision…"
                />
              </div>
            </div>

            {error && (
              <div
                role="alert"
                style={{
                  marginTop: '1.5rem',
                  padding: '0.9rem 1.2rem',
                  background: 'rgba(192, 86, 74, 0.08)',
                  border: '1px solid rgba(192, 86, 74, 0.3)',
                  color: '#a8443a',
                  fontSize: '0.9rem',
                }}
              >
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={submitting}
            style={{ marginTop: '1.75rem', padding: '1.15rem' }}
          >
            {submitting ? 'Envoi en cours…' : `Confirmer — ${grandTotal.toFixed(3).replace('.', ',')} DT`}
          </button>

          <p style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.55rem', marginTop: '1rem',
            color: 'var(--text-muted)', fontSize: '0.78rem',
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            <ShieldCheck size={15} strokeWidth={1.6} />
            Paiement sécurisé à la livraison
          </p>
        </form>

        {/* ── Récapitulatif ── */}
        <aside className="summary-card" aria-label="Récapitulatif de commande">
          <h2 className="panel-title">Récapitulatif</h2>

          <div className="summary-lines">
            {items.map((i) => (
              <div key={i.productId} className="summary-line">
                <img src={i.image} alt="" className="summary-thumb" />
                <div className="summary-info">
                  <div className="summary-name">{i.name}</div>
                  <div className="summary-qty">Quantité : {i.quantity}</div>
                </div>
                <span className="summary-price">
                  {(i.price * i.quantity).toFixed(3).replace('.', ',')} DT
                </span>
              </div>
            ))}
          </div>

          <div className="summary-divider" />

          <div className="summary-sub">
            <span>Sous-total</span>
            <span>{total.toFixed(3).replace('.', ',')} DT</span>
          </div>
          <div className="summary-sub">
            <span>Livraison suivie</span>
            <span>{shipping.toFixed(3).replace('.', ',')} DT</span>
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span>Total à régler</span>
            <span>{grandTotal.toFixed(3).replace('.', ',')} DT</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
