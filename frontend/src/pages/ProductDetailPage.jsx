import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck, HeartHandshake, Leaf, ChevronRight,
  ShoppingCart, Star, Truck, PackageX,
} from 'lucide-react';
import { api } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../components/Toast.jsx';
import ProductCard from '../components/ProductCard.jsx';

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
    api
      .get(`/products/${id}`)
      .then((p) => {
        if (!active) return;
        setProduct(p);
        setSelectedImg(p.image);
        return api.get('/products').then((all) => {
          if (active) {
            const family = all.filter((x) => x._id !== p._id && x.category === p.category);
            setRelated(family.slice(0, 4));
          }
        });
      })
      .catch(() => active && setNotFound(true));
    return () => { active = false; };
  }, [id]);

  if (notFound) {
    return (
      <div className="container page-detail">
        <div className="empty-state" style={{ padding: '7rem 2rem' }}>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '0.9rem' }}>Parfum introuvable</h2>
          <p>Cette fragrance n’est plus disponible ou a été retirée de la collection.</p>
          <Link to="/produits" className="btn btn-primary">Retour à la boutique</Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container page-detail">
        <div className="grid-placeholder">La fragrance arrive…</div>
      </div>
    );
  }

  const outOfStock = product.inStock === false;
  const rating = product.rating || 5;
  const heroImage = product.image || '/roya-hero-bottle.jpg';

  const currentImg = selectedImg || heroImage;
  const thumbnails = (product.images && product.images.length >= 3)
    ? product.images.slice(0, 3)
    : [
      heroImage,
      product.images?.[1] || heroImage,
      product.images?.[2] || heroImage,
    ];
  const thumbLabels = ['Face', 'Profil', 'Détail'];

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

        {/* ── Galerie ── */}
        <div className="d-gallery">
          <div className="d-main">
            <img src={currentImg} alt={product.name} />
            {outOfStock && (
              <div className="pc-soldout-veil">
                <span className="pc-soldout-tag">Pièce épuisée</span>
              </div>
            )}
          </div>

          <div className="d-thumbs">
            {thumbnails.map((imgUrl, idx) => (
              <button
                key={idx}
                className={`d-thumb ${currentImg === imgUrl ? 'active' : ''}`}
                onClick={() => setSelectedImg(imgUrl)}
                title={`Vue ${thumbLabels[idx]}`}
                aria-label={`Vue ${thumbLabels[idx]}`}
              >
                <img src={imgUrl} alt="" />
                <span className="d-thumb-label">{thumbLabels[idx]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Informations ── */}
        <div className="d-info">
          <span className="eyebrow">{product.category || 'Parfum de luxe'}</span>
          <h1 className="d-title">{product.name}</h1>

          <div className="d-rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={15} fill={i < rating ? 'currentColor' : 'none'} strokeWidth={1.3} />
            ))}
            <span>Signature olfactive</span>
          </div>

          <p className="d-price">
            {product.price.toFixed(3).replace('.', ',')} DT
            <small>TTC · Livraison premium</small>
          </p>

          <p className="d-desc">
            {product.description ||
              'Une fragrance élégante, lumineuse et sophistiquée, pensée pour laisser une impression durable et distinguée à chaque rencontre.'}
          </p>

          {outOfStock ? (
            <span className="stock-chip out">
              <PackageX size={15} strokeWidth={1.8} />
              Épuisé temporairement
            </span>
          ) : (
            <span className="stock-chip ok">
              <ShieldCheck size={15} strokeWidth={1.8} />
              En stock — expédition sous 24 h
            </span>
          )}

          <div className="buy-row">
            <div className="qty-box">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuer">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Augmenter">+</button>
            </div>

            <button
              className={`btn ${outOfStock ? 'btn-outline' : 'btn-primary'}`}
              disabled={outOfStock}
              onClick={() => {
                addItem(product, qty);
                push(`${product.name} ajouté au panier`);
              }}
            >
              <ShoppingCart size={17} strokeWidth={1.7} />
              {outOfStock ? 'Indisponible' : 'Ajouter au panier'}
            </button>
          </div>

          <ul className="d-perks">
            <li>
              <HeartHandshake size={22} strokeWidth={1.3} />
              Sélectionnée pour une présence élégante et durable
            </li>
            <li>
              <Leaf size={22} strokeWidth={1.3} />
              Formule élaborée à partir d’ingrédients nobles et raffinés
            </li>
            <li>
              <Truck size={22} strokeWidth={1.3} />
              Emballage premium & livraison suivie partout
            </li>
            <li>
              <ShieldCheck size={22} strokeWidth={1.3} />
              Authentique, luxueuse et conçue pour une impression mémorable
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="related-section">
          <div className="section-head center" style={{ marginBottom: '3.5rem' }}>
            <span className="eyebrow">Compléter l’élégance</span>
            <h2>
              D’autres <em>finitions</em> à découvrir
            </h2>
          </div>
          <div className="grid-products compact">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
