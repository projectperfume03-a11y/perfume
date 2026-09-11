import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck, HeartHandshake, Sparkles, ChevronRight,
  ShoppingCart, Star, Truck, PackageX, Droplets, Wind, Crown,
} from 'lucide-react';
import { api } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../components/Toast.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { PRESTIGE_PRODUCTS } from '../data/mockProducts.js';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { push } = useToast();

  useEffect(() => {
    let active = true;
    window.scrollTo(0, 0);
    setQty(1);

    // Essayer l'API
    api
      .get(`/products/${id}`)
      .then((p) => {
        if (!active) return;
        setProduct(p);
        setSelectedImg(p.image);
        return api.get('/products').then((all) => {
          if (active) {
            const family = (all || []).filter(
              (x) => x._id !== p._id && x.category === p.category
            );
            setRelated(family.slice(0, 4));
          }
        });
      })
      .catch(() => {
        // Fallback sur le catalogue de prestige
        if (!active) return;
        const local = PRESTIGE_PRODUCTS.find((p) => p._id === id);
        if (local) {
          setProduct(local);
          setSelectedImg(local.image);
          const relatedProds = PRESTIGE_PRODUCTS.filter(
            (x) => x._id !== local._id && (x.gender === local.gender || x.category === local.category)
          );
          setRelated(relatedProds.slice(0, 4));
        } else {
          setNotFound(true);
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (notFound) {
    return (
      <div className="container page-detail">
        <div className="empty-state" style={{ padding: '7rem 2rem' }}>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '0.9rem' }}>Fragrance introuvable</h2>
          <p>Ce parfum n’est plus disponible ou a été retiré de la collection.</p>
          <Link to="/produits" className="btn btn-primary">Explorer la collection</Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container page-detail">
        <div className="grid-placeholder">Préparation de la fragrance…</div>
      </div>
    );
  }

  const outOfStock = product.inStock === false;
  const rating = product.rating || 5;
  const heroImage = product.image || '/roya-cat-niche.jpg';

  const currentImg = selectedImg || heroImage;
  const thumbnails =
    product.images && product.images.length >= 2
      ? product.images
      : [heroImage, '/roya-hero-luxury.jpg'];

  const handleAddToCart = () => {
    addItem(product, qty);
    push(`${qty}x ${product.name} ajouté au panier`);
  };

  return (
    <div className="container page-detail">
      <nav className="breadcrumbs" aria-label="Fil d'Ariane">
        <Link to="/">Accueil</Link>
        <ChevronRight size={12} />
        <Link to="/produits">Collection</Link>
        <ChevronRight size={12} />
        <span className="current">{product.name}</span>
      </nav>

      <div className="detail-grid">
        {/* ── Galerie Photos ── */}
        <div className="d-gallery">
          <div className="d-main">
            <img src={currentImg} alt={product.name} />
            {outOfStock && (
              <div className="pc-soldout-veil">
                <span className="pc-soldout-tag">Édition épuisée</span>
              </div>
            )}
            <span className="d-brand-tag">{product.brand || 'Maison de Haute Parfumerie'}</span>
          </div>

          <div className="d-thumbs">
            {thumbnails.map((imgUrl, idx) => (
              <button
                key={idx}
                className={`d-thumb ${currentImg === imgUrl ? 'active' : ''}`}
                onClick={() => setSelectedImg(imgUrl)}
                title={`Aperçu ${idx + 1}`}
                aria-label={`Aperçu ${idx + 1}`}
              >
                <img src={imgUrl} alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Fiche Descriptive ── */}
        <div className="d-info">
          <div className="d-meta-header">
            <span className="eyebrow">{product.category || 'Haute Parfumerie'}</span>
            {product.gender && (
              <span className={`d-gender-pill ${product.gender}`}>
                {product.gender === 'femme' ? '60% Pour Elle' : product.gender === 'homme' ? '40% Pour Lui' : 'Mixte'}
              </span>
            )}
          </div>

          <h1 className="d-title">{product.name}</h1>

          <div className="d-rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={15} fill="currentColor" color="var(--gold)" strokeWidth={1} />
            ))}
            <span>Signature Certifiée</span>
          </div>

          <p className="d-price">
            {product.price.toFixed(3).replace('.', ',')} DT
            <small>TTC · Livraison suivie sous 24h-48h</small>
          </p>

          <p className="d-desc">
            {product.description ||
              'Une fragrance d’exception, lumineuse et racée, pensée pour laisser un sillage captivant et raffiné dès le premier souffle.'}
          </p>

          {/* ── Pyramide Olfactive ── */}
          {product.notes && (
            <div className="olfactory-pyramid">
              <h3 className="pyramid-title">
                <Droplets size={16} color="var(--rose-gold)" />
                Pyramide Olfactive
              </h3>
              <div className="pyramid-rows">
                <div className="pyramid-row">
                  <span className="p-label">Notes de Tête</span>
                  <span className="p-value">{product.notes.head}</span>
                </div>
                <div className="pyramid-row">
                  <span className="p-label">Notes de Cœur</span>
                  <span className="p-value">{product.notes.heart}</span>
                </div>
                <div className="pyramid-row">
                  <span className="p-label">Notes de Fond</span>
                  <span className="p-value">{product.notes.base}</span>
                </div>
              </div>
            </div>
          )}

          {outOfStock ? (
            <span className="stock-chip out">
              <PackageX size={15} strokeWidth={1.8} />
              Édition temporairement épuisée
            </span>
          ) : (
            <span className="stock-chip ok">
              <ShieldCheck size={15} strokeWidth={1.8} />
              En stock — Expédition express sous 24h
            </span>
          )}

          <div className="buy-row">
            <div className="qty-box">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuer">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Augmenter">+</button>
            </div>

            <button
              className={`btn ${outOfStock ? 'btn-outline' : 'btn-rose'} btn-buy-main`}
              disabled={outOfStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart size={18} strokeWidth={1.8} />
              {outOfStock ? 'Indisponible' : 'Ajouter au panier'}
            </button>
          </div>

          <ul className="d-perks">
            <li>
              <Crown size={20} strokeWidth={1.5} color="var(--gold)" />
              Flacon 100% authentique sous scellé d'origine
            </li>
            <li>
              <Sparkles size={20} strokeWidth={1.5} color="var(--rose-gold)" />
              Curation olfactive d’une tenue et projection remarquables
            </li>
            <li>
              <Truck size={20} strokeWidth={1.5} color="var(--gold)" />
              Livraison suivie à domicile & paiement à la livraison
            </li>
            <li>
              <HeartHandshake size={20} strokeWidth={1.5} color="var(--rose-gold)" />
              Écrin cadeau et échantillon découverte inclus
            </li>
          </ul>
        </div>
      </div>

      {/* ── Produits Similaires ── */}
      {related.length > 0 && (
        <section className="related-section">
          <div className="section-head center" style={{ marginBottom: '3rem' }}>
            <span className="eyebrow">Harmonies Complémentaires</span>
            <h2>
              Autres <em>Sillages d’Exception</em>
            </h2>
          </div>
          <div className="grid-products compact">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── Barre Achat Flottante Mobile ── */}
      <div className="mobile-sticky-buy-bar mobile-only">
        <div className="msb-info">
          <span className="msb-name">{product.name}</span>
          <span className="msb-price">{(product.price * qty).toFixed(3).replace('.', ',')} DT</span>
        </div>
        <button
          className="btn btn-rose btn-sm"
          disabled={outOfStock}
          onClick={handleAddToCart}
        >
          <ShoppingCart size={16} />
          {outOfStock ? 'Épuisé' : 'Ajouter'}
        </button>
      </div>
    </div>
  );
}

