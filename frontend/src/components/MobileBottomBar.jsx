import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Store } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function MobileBottomBar() {
  const { count, setIsOpen } = useCart();

  return (
    <nav className="mobile-bottom-bar" aria-label="Navigation mobile principale">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `mb-item ${isActive ? 'active' : ''}`}
      >
        <Home size={20} strokeWidth={1.7} />
        <span>Accueil</span>
      </NavLink>

      <NavLink
        to="/produits"
        className={({ isActive }) => `mb-item ${isActive ? 'active' : ''}`}
      >
        <Store size={20} strokeWidth={1.7} />
        <span>Boutique</span>
      </NavLink>

      <button
        className="mb-item"
        onClick={() => setIsOpen(true)}
        aria-label={`Panier (${count} articles)`}
      >
        <ShoppingBag size={20} strokeWidth={1.7} />
        <span>Panier</span>
        {count > 0 && <span className="mb-badge">{count}</span>}
      </button>
    </nav>
  );
}
