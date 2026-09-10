import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { Plus, Star } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const outOfStock = product.inStock === false;
  const imageSrc = product.image || '/roya-hero-bottle.jpg';

  const getBadge = (name) => {
    const n = name.toLowerCase();
    if (n.includes('amber') || n.includes('oriental')) return { text: 'Best-seller', cls: 'badge-dark' };
    if (n.includes('rose') || n.includes('floral')) return { text: 'Signature', cls: 'badge-dark' };
    if (n.includes('noir') || n.includes('wood')) return { text: 'Nouveauté', cls: 'badge-gold' };
    return { text: 'Exclusivité', cls: 'badge-gold' };
  };
  const badge = getBadge(product.name);
  const rating = product.rating || 5;

  return (
    <article className="product-card">
      <div className="pc-media">
        <Link to={`/produit/${product._id}`} aria-label={product.name}>
          <img src={imageSrc} alt={product.name} className="pc-img" loading="lazy" />
        </Link>

        <div className="pc-badges">
          <span className={`badge ${badge.cls}`}>{badge.text}</span>
        </div>

        {!outOfStock && (
          <button
            className="quick-add"
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <Plus size={14} strokeWidth={2} />
            Ajouter au panier
          </button>
        )}

        {outOfStock && (
          <div className="pc-soldout-veil">
            <span className="pc-soldout-tag">Épuisé</span>
          </div>
        )}
      </div>

      <div className="pc-info">
        <span className="pc-cat">{product.category || 'Parfum de luxe'}</span>
        <h3 className="pc-name">
          <Link to={`/produit/${product._id}`}>{product.name}</Link>
        </h3>
        <p className="pc-price">
          <strong>{product.price.toFixed(3).replace('.', ',')} DT</strong>
        </p>
        <span className="pc-rating" aria-label={`Note de ${rating} sur 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={11} fill={i < rating ? 'currentColor' : 'none'} strokeWidth={1.2} />
          ))}
        </span>
      </div>
    </article>
  );
}
