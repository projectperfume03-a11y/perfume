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
        Livraison Prestige Offerte dès <em>200 DT</em> · Curation Haute Parfumerie Pour Elle & Pour Lui
      </div>

      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          <Link to="/" aria-label="ROYA — Accueil">
            <img src="/roya-wordmark-gold.png" alt="ROYA Haute Parfumerie" className="logo-img" />
          </Link>

          <nav className="main-nav desktop-only" aria-label="Navigation principale">
            <NavLink to="/" end className={navClass}>Accueil</NavLink>
            <NavLink to="/produits?genre=femme" className="nav-link nav-link-femme">
              Pour Elle <span className="nav-pill-mini">60%</span>
            </NavLink>
            <NavLink to="/produits?genre=homme" className="nav-link nav-link-homme">
              Pour Lui <span className="nav-pill-mini">40%</span>
            </NavLink>
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
          <div className="mp-header-brand">
            <img src="/roya-wordmark-gold.png" alt="ROYA" className="mp-logo" />
            <span className="mobile-panel-label">Haute Parfumerie</span>
          </div>

          <nav className="mobile-panel-nav" aria-label="Navigation mobile">
            <Link to="/" className={location.pathname === '/' && !location.search ? 'active' : ''}>
              <span>Accueil</span>
            </Link>
            <Link
              to="/produits?genre=femme"
              className={`mp-link-femme ${location.search.includes('genre=femme') ? 'active' : ''}`}
            >
              <span>Pour Elle</span>
              <span className="mp-badge-tag rose">60% Curation</span>
            </Link>
            <Link
              to="/produits?genre=homme"
              className={`mp-link-homme ${location.search.includes('genre=homme') ? 'active' : ''}`}
            >
              <span>Pour Lui</span>
              <span className="mp-badge-tag gold">40% Curation</span>
            </Link>
            <Link
              to="/produits"
              className={location.pathname === '/produits' && !location.search ? 'active' : ''}
            >
              <span>Toute la Collection</span>
            </Link>
            <Link
              to="/contact"
              className={location.pathname === '/contact' ? 'active' : ''}
            >
              <span>Conseil & Atelier</span>
            </Link>
          </nav>

          <div className="mobile-panel-footer">
            <p className="mp-tagline">
              L'excellence du parfum de marque,
              <br />
              sublimé pour chaque personnalité.
            </p>
            <div className="mp-socials">
              <a href="#">Instagram</a>
              <a href="#">WhatsApp</a>
              <a href="#">Facebook</a>
            </div>
            <span className="mp-copy">
              © {new Date().getFullYear()} ROYA — Maison de Haute Parfumerie
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
