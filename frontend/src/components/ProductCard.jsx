import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from './Toast.jsx';
import { Plus, Star, Sparkles } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { push } = useToast();
  const outOfStock = product.inStock === false;
  const imageSrc = product.image || '/roya-cat-niche.jpg';

  const getBadge = () => {
    if (product.badge) return product.badge;
    const n = (product.name || '').toLowerCase();
    const g = product.gender || '';
    if (g === 'femme' || n.includes('rose') || n.includes('mademoiselle') || n.includes('delina')) {
      return { text: '60% Pour Elle', cls: 'badge-rose' };
    }
    if (g === 'homme' || n.includes('sauvage') || n.includes('oud') || n.includes('bleu')) {
      return { text: '40% Pour Lui', cls: 'badge-dark' };
    }
    return { text: 'Haute Signature', cls: 'badge-gold' };
  };

  const badge = getBadge();
  const rating = product.rating || 5;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    push(`${product.name} ajouté au panier`);
  };

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
            onClick={handleQuickAdd}
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <Plus size={15} strokeWidth={2.2} />
            <span>Ajouter</span>
          </button>
        )}

        {outOfStock && (
          <div className="pc-soldout-veil">
            <span className="pc-soldout-tag">Édition épuisée</span>
          </div>
        )}
      </div>

      <div className="pc-info">
        <div className="pc-top-meta">
          <span className="pc-cat">{product.brand || product.category || 'Maison de Luxe'}</span>
          <span className="pc-rating" aria-label={`Note de ${rating} sur 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={10} fill="currentColor" color="var(--gold)" strokeWidth={1} />
            ))}
          </span>
        </div>

        <h3 className="pc-name">
          <Link to={`/produit/${product._id}`}>{product.name}</Link>
        </h3>

        {product.family && (
          <span className="pc-family">{product.family}</span>
        )}

        <div className="pc-bottom-row">
          <p className="pc-price">
            <strong>{product.price.toFixed(3).replace('.', ',')} DT</strong>
          </p>

          <button
            className="mobile-quick-btn"
            onClick={handleQuickAdd}
            aria-label={`Ajouter ${product.name}`}
            title="Ajouter au panier"
          >
            <Plus size={16} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </article>
  );
}
