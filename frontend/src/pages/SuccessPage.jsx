import { Link, useParams } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function SuccessPage() {
  const { orderId } = useParams();

  return (
    <div className="success-wrap">
      <div className="success-card">
        <div className="success-seal">
          <Check size={38} strokeWidth={1.4} />
        </div>

        <h1>Merci infiniment</h1>
        <p className="success-ref">
          Commande n° {orderId ? `#${String(orderId).slice(-6).toUpperCase()}` : '—'}
        </p>

        <p>
          Votre commande a bien été enregistrée. Notre maison prépare votre sélection
          avec le plus grand soin — chaque flacon est vérifié, emballé avec élégance
          et préparé pour une livraison raffinée. Nous vous contacterons très prochainement
          pour la confirmation et l’envoi.
        </p>

        <Link to="/produits" className="btn btn-primary">
          Poursuivre ma découverte
        </Link>
      </div>
    </div>
  );
}
