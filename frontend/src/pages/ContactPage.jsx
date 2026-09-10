import { Link } from 'react-router-dom';
import { Phone, Mail, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container page-contact">

      <header className="contact-hero">
        <span className="eyebrow">Maison ROYA</span>
        <h1>
          Contact & <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>conseil parfum</em>
        </h1>
        <p>
          Une question sur une fragrance, une commande en cours ou un conseil de sélection ?
          Notre équipe vous accompagne avec bienveillance et expertise.
        </p>
      </header>

      <div className="contact-grid">
        <a href="tel:12345678" className="contact-card">
          <span className="contact-ring">
            <Phone size={21} strokeWidth={1.4} />
          </span>
          <h2>Téléphone</h2>
          <p>Pour un échange direct avec notre équipe</p>
          <span className="contact-value">12 345 678</span>
        </a>

        <a href="mailto:bonjour@roya-parfum.com" className="contact-card">
          <span className="contact-ring">
            <Mail size={21} strokeWidth={1.4} />
          </span>
          <h2>E-mail</h2>
          <p>Pour toute question ou demande particulière</p>
          <span className="contact-value">bonjour@roya-parfum.com</span>
        </a>
      </div>

      <div className="custom-project">
        <h3>
          Une fragrance <em>signature</em> ?
        </h3>
        <p>
          Nous sélectionnons pour vous les parfums les plus raffinés, des notes florales
          aux ambres les plus enveloppantes, pour trouver l’élégance qui vous ressemble.
          Décrivez-nous votre univers olfactif et nous vous guiderons vers la bonne création.
        </p>
        <Link to="/produits" className="btn btn-gold" style={{ position: 'relative', zIndex: 1 }}>
          Découvrir la collection
          <ArrowRight size={15} strokeWidth={1.8} />
        </Link>
      </div>

    </div>
  );
}
