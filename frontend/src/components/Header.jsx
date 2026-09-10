import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { ShoppingBag } from 'lucide-react';

export default function Header() {
  const { count, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen && document.activeElement?.closest('.mobile-panel')) {
      menuButtonRef.current?.focus();
    }
  }, [menuOpen]);

  const navClass = ({ isActive }) => isActive ? 'nav-link active' : 'nav-link';

  return (
    <>
      <div className="announce-bar">
        Livraison offerte dès <em>200 DT</em> · Parfums de marques sélectionnés pour vous
      </div>

      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          <Link to="/" aria-label="ROYA — Accueil">
            <img src="/roya-wordmark-gold.png" alt="ROYA" className="logo-img" />
          </Link>

          <nav className="main-nav desktop-only" aria-label="Navigation principale">
            <NavLink to="/" end className={navClass}>Accueil</NavLink>
            <NavLink to="/produits" className={navClass}>Collection</NavLink>
            <NavLink to="/contact" className={navClass}>Contact</NavLink>
          </nav>

          <div className="header-actions">
            <button
              className="cart-btn"
              onClick={() => setIsOpen(true)}
              aria-label={`Ouvrir le panier (${count} article${count > 1 ? 's' : ''})`}
            >
              <ShoppingBag size={21} strokeWidth={1.4} />
              {count > 0 && <span className="cart-badge">{count}</span>}
            </button>

            <button
              ref={menuButtonRef}
              className={`burger-toggle mobile-only ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <span className="burger-line" />
              <span className="burger-line" />
              <span className="burger-line" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-panel ${menuOpen ? 'is-open' : ''}`}
        inert={!menuOpen ? '' : undefined}
        onClick={(e) => { if (e.target.closest('a')) setMenuOpen(false); }}
      >
        <div className="mobile-panel-inner">
          <span className="mobile-panel-label">Navigation</span>

          <nav className="mobile-panel-nav" aria-label="Navigation mobile">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Accueil</Link>
            <Link to="/produits" className={location.pathname.startsWith('/produits') ? 'active' : ''}>Collection</Link>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
          </nav>

          <div className="mobile-panel-footer">
            <p className="mp-tagline">
              Élégance et parfum,
              <br />
              sélectionnés parmi les maisons les plus désirées.
            </p>
            <div className="mp-socials">
              <a href="#">Instagram</a>
              <a href="#">Facebook</a>
              <a href="#">Pinterest</a>
            </div>
            <span className="mp-copy">
              © {new Date().getFullYear()} ROYA — Maison de parfums de luxe
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
