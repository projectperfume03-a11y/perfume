import { NavLink, useLocation } from 'react-router-dom';
import { Home, Sparkles, Compass, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function MobileBottomBar() {
  const { count, setIsOpen } = useCart();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const currentGenre = searchParams.get('genre');

  return (
    <>
      {/* Bouton WhatsApp flottant pour conseils olfactifs instantanés */}
      <a
        href="https://wa.me/?text=Bonjour%20Maison%20ROYA,%20je%20souhaite%20un%20conseil%20pour%20choisir%20un%20parfum"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-contact-btn"
        aria-label="Conseils personnalisés sur WhatsApp"
        title="Conseils personnalisés WhatsApp"
      >
        <MessageCircle size={24} strokeWidth={2} />
      </a>

      {/* Barre de navigation inférieure fixe */}
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
          to="/produits?genre=femme"
          className={`mb-item femme ${location.pathname === '/produits' && currentGenre === 'femme' ? 'active' : ''}`}
        >
          <Sparkles size={20} strokeWidth={1.7} />
          <span>Pour Elle</span>
        </NavLink>

        <NavLink
          to="/produits?genre=homme"
          className={`mb-item ${location.pathname === '/produits' && currentGenre === 'homme' ? 'active' : ''}`}
        >
          <Compass size={20} strokeWidth={1.7} />
          <span>Pour Lui</span>
        </NavLink>

        <NavLink
          to="/produits"
          end={!currentGenre}
          className={`mb-item ${location.pathname === '/produits' && !currentGenre ? 'active' : ''}`}
        >
          <Compass size={20} strokeWidth={1.7} />
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
    </>
  );
}
