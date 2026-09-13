import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const {
    items, isOpen, setIsOpen, updateQuantity, removeItem, total, count, shippingCost, grandTotal,
  } = useCart();

  return (
    <>
      <div
        className={`drawer-backdrop ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`cart-drawer ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen}
        aria-label="Panier"
      >
        <div className="cart-head">
          <h2>
            Votre panier {count > 0 && <span>({count})</span>}
          </h2>
          <button className="icon-btn" onClick={() => setIsOpen(false)} aria-label="Fermer le panier">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={52} strokeWidth={1} />
            <p>Votre panier attend ses premières pièces…</p>
            <button className="btn btn-primary" onClick={() => setIsOpen(false)}>
              Découvrir la collection
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.productId} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <div className="cart-item-title">{item.name}</div>
                    <div className="cart-item-unit">
                      {item.price.toFixed(3).replace('.', ',')} DT / pièce
                    </div>
                    <div className="cart-item-row">
                      <div className="qty-mini">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          aria-label="Diminuer la quantité"
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          aria-label="Augmenter la quantité"
                        >
                          +
                        </button>
                      </div>
                      <span className="cart-item-price">
                        {(item.price * item.quantity).toFixed(3).replace('.', ',')} DT
                      </span>
                      <button
                        className="remove-link"
                        onClick={() => removeItem(item.productId)}
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-foot">
              <div className="cart-total-line">
                <span>Sous-total</span>
                <span>{total.toFixed(3).replace('.', ',')} DT</span>
              </div>
              <div className="cart-total-line" style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <span>Livraison sécurisée</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                  {shippingCost.toFixed(3).replace('.', ',')} DT
                </span>
              </div>
              <div className="cart-total-line" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.65rem', marginTop: '0.4rem' }}>
                <span style={{ fontWeight: 600 }}>Total à régler</span>
                <span style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '1.1rem' }}>
                  {grandTotal.toFixed(3).replace('.', ',')} DT
                </span>
              </div>
              <Link to="/commande" onClick={() => setIsOpen(false)} className="btn btn-primary btn-block" style={{ marginTop: '0.85rem' }}>
                Passer commande <ArrowRight size={15} strokeWidth={1.8} />
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
