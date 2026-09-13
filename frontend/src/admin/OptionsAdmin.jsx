import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { useCart } from '../context/CartContext.jsx';
import {
  Truck, ShieldCheck, Save, Sparkles, AlertCircle, CheckCircle2,
  Clock, MapPin, CreditCard, RotateCcw
} from 'lucide-react';

export default function OptionsAdmin() {
  const { token } = useAuth();
  const { push } = useToast();
  const { refreshShippingCost } = useCart();

  const [shippingCost, setShippingCost] = useState(7);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/settings')
      .then((data) => {
        if (data && typeof data.shippingCost === 'number') {
          setShippingCost(data.shippingCost);
        }
      })
      .catch((err) => {
        push(err.message || 'Impossible de charger les paramètres', 'error');
      })
      .finally(() => setLoading(false));
  }, [push]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = parseFloat(shippingCost);
    if (isNaN(num) || num < 0) {
      push('Veuillez saisir un montant de livraison valide', 'error');
      return;
    }

    setSaving(true);
    setSavedSuccess(false);

    try {
      const updated = await api.patch('/settings', { shippingCost: num }, token);
      if (updated && typeof updated.shippingCost === 'number') {
        setShippingCost(updated.shippingCost);
      }
      localStorage.setItem('roya_shipping_cost', num.toString());
      if (refreshShippingCost) refreshShippingCost();

      setSavedSuccess(true);
      push(`Frais de livraison mis à jour : ${num.toFixed(3).replace('.', ',')} DT ✓`);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      push(err.message || 'Erreur lors de la sauvegarde des paramètres', 'error');
    } finally {
      setSaving(false);
    }
  };

  const sampleSubtotal = 180;
  const simulatedShipping = parseFloat(shippingCost) || 0;
  const simulatedTotal = sampleSubtotal + simulatedShipping;

  return (
    <div style={{ display: 'grid', gap: '2rem', maxWidth: 960, margin: '0 auto' }}>

      {/* ── En-tête principal Options ── */}
      <div className="vip-panel">
        <div className="vip-panel-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'rgba(201, 156, 130, 0.15)',
              border: '1px solid rgba(201, 156, 130, 0.25)',
              display: 'grid', placeItems: 'center', color: 'var(--adm-gold)'
            }}>
              <Truck size={20} strokeWidth={1.7} />
            </span>
            <div>
              <h2 className="vip-panel-title" style={{ fontSize: '1.4rem' }}>
                Frais de Livraison & Expédition
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--adm-text-3)', margin: '0.2rem 0 0 0' }}>
                Politique tarifaire pour les envois de Haute Parfumerie
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.35rem 0.75rem', borderRadius: 999,
              background: 'rgba(192, 86, 74, 0.08)',
              border: '1px solid rgba(192, 86, 74, 0.2)',
              color: '#c0564a', fontSize: '0.72rem', fontWeight: 600
            }}>
              <AlertCircle size={13} strokeWidth={2} />
              Livraison gratuite désactivée
            </span>
          </div>
        </div>

        <div className="vip-panel-body">
          {loading ? (
            <div style={{ padding: '2rem 0', display: 'grid', gap: '1rem' }}>
              <div className="skeleton" style={{ height: 48, borderRadius: 10 }} />
              <div className="skeleton" style={{ height: 120, borderRadius: 10 }} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.75rem' }}>

              {/* Notice explicative */}
              <div style={{
                padding: '1.1rem 1.35rem',
                borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(255, 253, 248, 0.9), rgba(250, 247, 242, 0.95))',
                border: '1px solid rgba(188, 156, 130, 0.2)',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start'
              }}>
                <Sparkles size={18} strokeWidth={1.8} style={{ color: 'var(--adm-gold)', flexShrink: 0, marginTop: '0.15rem' }} />
                <div style={{ fontSize: '0.84rem', lineHeight: 1.6, color: 'var(--adm-text-2)' }}>
                  <strong style={{ color: 'var(--adm-text)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                    Tarification fixe appliquée à chaque panier client
                  </strong>
                  Conformément à la politique de la Maison ROYA, la livraison gratuite est retirée. Chaque commande client
                  se voit automatiquement facturer le montant défini ci-dessous, qu'elle contienne 1 ou plusieurs flacons.
                </div>
              </div>

              {/* Champ Saisie Frais de livraison */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                alignItems: 'start'
              }}>
                <div>
                  <label
                    htmlFor="opt-shipping"
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--adm-text)',
                      marginBottom: '0.5rem',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase'
                    }}
                  >
                    Montant de la livraison (DT) <span style={{ color: '#c0564a' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="opt-shipping"
                      type="number"
                      min="0"
                      step="0.100"
                      required
                      value={shippingCost}
                      onChange={(e) => setShippingCost(e.target.value)}
                      placeholder="Ex : 7.000"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        fontFamily: 'inherit',
                        color: 'var(--adm-text)',
                        background: '#ffffff',
                        border: '1px solid rgba(188, 156, 130, 0.3)',
                        borderRadius: 10,
                        boxShadow: '0 2px 8px rgba(188, 156, 130, 0.06)',
                        outline: 'none',
                        transition: 'all 0.25s ease',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--adm-gold)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(201, 168, 124, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(188, 156, 130, 0.3)';
                        e.target.style.boxShadow = '0 2px 8px rgba(188, 156, 130, 0.06)';
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--adm-gold)',
                      pointerEvents: 'none'
                    }}>
                      DT
                    </span>
                  </div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--adm-text-3)', marginTop: '0.45rem' }}>
                    Ce tarif est immédiatement synchronisé avec le panier et la page de commande client.
                  </span>
                </div>

                {/* Simulation Panier en direct */}
                <div style={{
                  padding: '1.25rem 1.4rem',
                  borderRadius: 14,
                  background: 'linear-gradient(145deg, #fffdfa, #f9f5ed)',
                  border: '1px solid rgba(201, 156, 130, 0.25)',
                  boxShadow: '0 4px 16px rgba(188, 156, 130, 0.06)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.85rem'
                  }}>
                    <span style={{
                      fontSize: '0.65rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--adm-text-3)',
                      fontWeight: 600
                    }}>
                      Simulation Panier Client
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--adm-gold)', fontWeight: 600 }}>
                      Aperçu live
                    </span>
                  </div>

                  <div style={{ display: 'grid', gap: '0.55rem', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--adm-text-2)' }}>
                      <span>Exemple : 1 flacon signature</span>
                      <span>{sampleSubtotal.toFixed(3).replace('.', ',')} DT</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: 'var(--adm-text)',
                      fontWeight: 500
                    }}>
                      <span>Frais de livraison</span>
                      <strong style={{ color: 'var(--adm-gold)' }}>
                        +{simulatedShipping.toFixed(3).replace('.', ',')} DT
                      </strong>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderTop: '1px solid rgba(188, 156, 130, 0.2)',
                      paddingTop: '0.65rem',
                      marginTop: '0.2rem',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: 'var(--adm-text)'
                    }}>
                      <span>Total à régler</span>
                      <span>{simulatedTotal.toFixed(3).replace('.', ',')} DT</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bouton Enregistrer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '1rem',
                borderTop: '1px solid var(--adm-border-2)',
                paddingTop: '1.25rem'
              }}>
                {savedSuccess && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.78rem',
                    color: '#8fc97c',
                    fontWeight: 600
                  }}>
                    <CheckCircle2 size={16} strokeWidth={2} />
                    Modifications enregistrées
                  </span>
                )}

                <button
                  type="submit"
                  className="btn btn-gold"
                  disabled={saving}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.75rem 1.75rem',
                    fontSize: '0.82rem',
                    fontWeight: 600
                  }}
                >
                  <Save size={16} strokeWidth={1.8} />
                  {saving ? 'Enregistrement…' : 'Enregistrer les options'}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>

      {/* ── Récapitulatif des conditions d'expédition ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem'
      }}>
        <div className="stat-card" style={{ minHeight: 'auto', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.6rem' }}>
            <Clock size={16} strokeWidth={1.8} style={{ color: 'var(--adm-gold)' }} />
            <strong style={{ fontSize: '0.85rem', color: 'var(--adm-text)' }}>Délai d'expédition</strong>
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--adm-text-3)', lineHeight: 1.5, margin: 0 }}>
            Préparation soignée et acheminement en 24h à 48h ouvrées sur l'ensemble du territoire tunisien.
          </p>
        </div>

        <div className="stat-card" style={{ minHeight: 'auto', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.6rem' }}>
            <CreditCard size={16} strokeWidth={1.8} style={{ color: 'var(--adm-gold)' }} />
            <strong style={{ fontSize: '0.85rem', color: 'var(--adm-text)' }}>Mode de règlement</strong>
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--adm-text-3)', lineHeight: 1.5, margin: 0 }}>
            Paiement comptant sécurisé à la livraison après vérification du colis par le destinataire.
          </p>
        </div>

        <div className="stat-card" style={{ minHeight: 'auto', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.6rem' }}>
            <ShieldCheck size={16} strokeWidth={1.8} style={{ color: 'var(--adm-gold)' }} />
            <strong style={{ fontSize: '0.85rem', color: 'var(--adm-text)' }}>Garantie d'intégrité</strong>
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--adm-text-3)', lineHeight: 1.5, margin: 0 }}>
            Flacons protégés dans des écrins doublés sur-mesure pour préserver l'intégrité des jus nobles.
          </p>
        </div>
      </div>

    </div>
  );
}
