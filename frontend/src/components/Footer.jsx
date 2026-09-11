import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">

          <div className="footer-brand">
            <img src="/roya-wordmark-gold.png" alt="ROYA" />
            <p>
              Une sélection de parfums de marques iconiques pour une présence raffinée,
              mémorable et intemporelle au quotidien.
            </p>
          </div>

          <div className="footer-col">
            <h4>La Curation</h4>
            <ul>
              <li><Link to="/produits?genre=femme">Pour Elle (60%)</Link></li>
              <li><Link to="/produits?genre=homme">Pour Lui (40%)</Link></li>
              <li><Link to="/produits?genre=mixte">Niche & Extraits</Link></li>
              <li><Link to="/produits">Toute la Collection</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Conciergerie</h4>
            <ul>
              <li><Link to="/contact">Nous Contacter</Link></li>
              <li><a href="https://wa.me/?text=Bonjour%20Maison%20ROYA" target="_blank" rel="noopener noreferrer">Conseiller WhatsApp</a></li>
              <li><a href="#">Livraison Prestige 48h</a></li>
              <li><a href="#">Paiement à la Livraison</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Cercle Privilège</h4>
            <p style={{ fontSize: '0.88rem', marginBottom: '1.4rem', fontWeight: 300 }}>
              Recevez les invitations privées et les éditions rares de la maison ROYA.
            </p>
            <div className="newsletter-line">
              <input type="email" placeholder="Votre adresse e-mail" aria-label="Adresse e-mail" />
              <button aria-label="S'inscrire à la newsletter"><ArrowRight size={17} strokeWidth={1.6} /></button>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <div className="footer-socials">
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">Pinterest</a>
          </div>
          <div className="footer-copy">
            © {new Date().getFullYear()} ROYA — Tous droits réservés ·{' '}
            <Link to="/admin/login">Administration</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
