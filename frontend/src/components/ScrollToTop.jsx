import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Remonter en haut de page au changement d'URL
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Gérer l'affichage du bouton
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Remonter en haut"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        background: 'var(--accent-primary)',
        color: '#fff',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 9999,
        transition: 'transform 0.3s, background 0.3s, opacity 0.3s, visibility 0.3s',
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
      }}
      onMouseOver={(e) => {
        if (isVisible) {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.background = 'var(--accent-gold)';
        }
      }}
      onMouseOut={(e) => {
        if (isVisible) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.background = 'var(--accent-primary)';
        }
      }}
    >
      <ArrowUp size={20} strokeWidth={2.5} />
    </button>
  );
}
