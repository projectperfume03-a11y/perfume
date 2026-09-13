import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';
import { PRESTIGE_PRODUCTS, CATEGORIES_SHOWCASE, TOP_BRANDS } from '../data/mockProducts.js';
import {
  Sparkles, ShieldCheck, ArrowRight, Heart, Crown, Clock, CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    api
      .get('/products')
      .then((data) => {
        // Filtrer les anciens produits de test de planches en bois
        const valid = (data || []).filter(
          (p) =>
            p.name &&
            !['ds5', 'raz'].includes(p.name.toLowerCase()) &&
            !p.image?.includes('cutting_board') &&
            !p.image?.includes('Priviet')
        );
        if (valid.length > 0) {
          // Fusionner avec les données de prestige pour un catalogue somptueux
          setProducts(valid);
        } else {
          setProducts(PRESTIGE_PRODUCTS);
        }
        setLoading(false);
      })
      .catch(() => {
        setProducts(PRESTIGE_PRODUCTS);
        setLoading(false);
      });
  }, []);

  const displayedProducts = useMemo(() => {
    const sourceProducts = products.length > 0 ? products : PRESTIGE_PRODUCTS;

    const getBestSellerScore = (product) => {
      if (Number.isFinite(Number(product.bestSellerRank))) {
        return Number(product.bestSellerRank) * 1000000;
      }
      if (Number.isFinite(Number(product.sales))) {
        return Number(product.sales) * 1000;
      }
      if (Number.isFinite(Number(product.popularity))) {
        return Number(product.popularity) * 1000;
      }
      if (Number.isFinite(Number(product.rating))) {
        return Number(product.rating) * 1000;
      }
      if (product.createdAt || product.updatedAt) {
        return new Date(product.updatedAt || product.createdAt).getTime();
      }
      return Number(product.price || 0);
    };

    let filtered = [...sourceProducts].sort((a, b) => {
      const scoreA = getBestSellerScore(a);
      const scoreB = getBestSellerScore(b);
      return scoreB - scoreA;
    });

    if (activeTab === 'femme') {
      filtered = filtered.filter((p) => p.gender === 'femme' || p.category?.toLowerCase().includes('elle'));
    }
    if (activeTab === 'homme') {
      filtered = filtered.filter((p) => p.gender === 'homme' || p.category?.toLowerCase().includes('lui'));
    }

    return filtered.slice(0, 4);
  }, [products, activeTab]);

  return (
    <>
      {/* ── Hero Principal Haute Parfumerie ── */}
      <section className="hero-home perfume-hero">
        <div className="hero-media">
          <img
            src="/roya-hero-luxury.jpg"
            alt="Flacons de Haute Parfumerie ROYA — Rose Éternelle & Noir Nocturne"
            className="hero-img-responsive"
          />
        </div>
        <div className="hero-overlay" />
        <span className="hero-frame" />

        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              L’Émotion Pure,
              <br />
              <em>Pour Elle & Pour Lui</em>
            </h1>

            <p className="hero-sub">
              Une sélection exclusive des plus grandes maisons de luxe. 60% d'essences
              féminines lumineuses et sensuelles, harmonisées à 40% de sillages masculins
              profonds et captivants.
            </p>

            <div className="hero-actions">
              <Link to="/produits?genre=femme" className="btn btn-rose hero-btn-main">
                Découvrir Pour Elle
              </Link>
              <Link to="/produits?genre=homme" className="btn btn-outline hero-btn-sub">
                Explorer Pour Lui
              </Link>
            </div>

            <div className="hero-facts">
              <div className="fact">
                <b>Bonne</b>
                <span>Authenticité</span>
              </div>
              
              <div className="fact">
                <b>48h</b>
                <span>Livraison Suivie</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Univers d'Auteur : Pour Elle (60%) & Pour Lui (40%) ── */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Les Univers ROYA</span>
            <h2>Une Curation <em>sur-mesure</em></h2>
            <p>
              Parce que chaque personnalité mérite un sillage qui lui ressemble, explorez
              nos collections dédiées avec la plus grande exigence olfactive.
            </p>
          </div>

          <div className="cat-grid-luxury">
            {CATEGORIES_SHOWCASE.map((cat) => (
              <Link to={cat.link} className="cat-card-luxury" key={cat.name}>
                <div className="cat-img-wrapper">
                  <img src={cat.img} alt={cat.name} loading="lazy" />
                  {cat.subtitle && <span className="cat-pill-ratio">{cat.subtitle}</span>}
                </div>
                <div className="cat-card-body">
                  {cat.count && (
                    <div className="cat-card-top">
                      <span className="cat-count-badge">{cat.count}</span>
                    </div>
                  )}
                  <h3 className="cat-title-luxe">{cat.name}</h3>
                  <p className="cat-tagline-luxe">{cat.tagline}</p>
                  <span className="cat-link-cta">
                    Explorer la collection
                    <ArrowRight size={14} strokeWidth={2} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Défilé des Grandes Maisons de Parfumerie ── */}
      <section className="section section-alt brand-showcase">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Maisons Emblématiques</span>
            <h2>Les Signatures qui font <em>Rêver</em></h2>
          </div>

          <div className="brand-strip-container">
            <div className="brand-strip-track" aria-label="Grandes marques de parfum">
              {TOP_BRANDS.map((brand) => (
                <Link
                  to={`/produits?q=${encodeURIComponent(brand.name)}`}
                  key={brand.name}
                  className="brand-card-pill"
                >
                  <span className="bcp-name">{brand.name}</span>
                  <span className="bcp-origin">{brand.origin}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Sélection Signature / Best-sellers avec Tabs Rapides ── */}
      <section className="section signature-products-section">
        <div className="container">
          <div className="section-head-row">
            <div className="section-head" style={{ marginBottom: 0 }}>
              <span className="eyebrow">Haute Curation</span>
              <h2>La Sélection <em>Prestige</em></h2>
              <p>
                Les fragrances les plus prisées de la maison, alliant élégance,
                tenue remarquable et sillage mémorable.
              </p>
            </div>

            {/* Onglets Filtres Rapides (Très ergonomique sur mobile) */}
            <div className="luxury-tabs-bar" role="tablist">
              <button
                className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                Tous
              </button>
              <button
                className={`tab-btn tab-femme ${activeTab === 'femme' ? 'active' : ''}`}
                onClick={() => setActiveTab('femme')}
              >
                Pour Elle
              </button>
              <button
                className={`tab-btn tab-homme ${activeTab === 'homme' ? 'active' : ''}`}
                onClick={() => setActiveTab('homme')}
              >
                Pour Lui
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid-placeholder">Préparation de votre sélection olfactive…</div>
          ) : (
            <div className="grid-products">
              {displayedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          <div className="section-footer-cta text-center">
            <Link to="/produits" className="btn btn-outline btn-lg-luxury">
              Découvrir les 50+ Fragrances
              <ArrowRight size={16} strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Curation ROYA / Confiance & Conseils ── */}
      <section className="section concierge-section">
        <div className="container">
          <div className="concierge-box-luxury">
            <div className="concierge-content">
              <span className="eyebrow">Conseil & Conciergerie</span>
              <h2>
                Hésitez-vous entre <em>deux créations</em> ?
              </h2>
              <p>
                Nos conseillers en haute parfumerie vous accompagnent directement sur
                WhatsApp ou par message pour trouver la fragrance idéale selon vos goûts,
                votre peau et l'occasion.
              </p>
              <div className="concierge-features-list">
                <div className="c-item">
                  <CheckCircle2 size={18} color="var(--gold)" />
                  <span>Conseil personnalisé selon la saison & le style</span>
                </div>
                <div className="c-item">
                  <CheckCircle2 size={18} color="var(--gold)" />
                  <span>Écrin cadeau & emballage haute couture offert</span>
                </div>
                <div className="c-item">
                  <CheckCircle2 size={18} color="var(--gold)" />
                  <span>Possibilité de tester avant confirmation</span>
                </div>
              </div>

              <div className="concierge-actions">
                <a
                  href="https://wa.me/?text=Bonjour%20Maison%20ROYA,%20je%20souhaite%20un%20conseil%20personnalis%C3%A9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold"
                >
                  Contacter un Conseiller
                  <ArrowRight size={15} strokeWidth={2} />
                </a>
                <Link to="/contact" className="link-underline">
                  En savoir plus sur la Maison
                </Link>
              </div>
            </div>

            <div className="concierge-media">
              <img
                src="/roya-cat-femme.jpg"
                alt="Flacon de parfum dans son écrin de velours"
                loading="lazy"
              />
              <div className="concierge-float-badge">
                <Heart size={18} color="#e5987d" fill="#e5987d" />
                <div>
                  <strong>98%</strong>
                  <span>Coups de cœur</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

