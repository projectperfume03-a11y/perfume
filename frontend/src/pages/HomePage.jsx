import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';
import {
  Sparkles, Leaf, Flame, ShieldCheck, ArrowRight,
} from 'lucide-react';

const FEATURES = [
  { icon: Sparkles, title: 'Formules signatures', desc: 'Des accords d’exception' },
  { icon: Leaf, title: 'Ingrédients nobles', desc: 'Essences sélectionnées' },
  { icon: Flame, title: 'Sillage captivant', desc: 'Une présence durable' },
  { icon: ShieldCheck, title: 'Livraison premium', desc: 'Sous 48h partout' },
];

const CATEGORIES = [
  { name: 'Floral', img: '/roya-atelier.jpg' },
  { name: 'Oriental', img: '/roya-hero-bottle.jpg' },
  { name: 'Boisé', img: '/roya-full-dark.png' },
];

const BRANDS = ['Dior', 'YSL', 'Chanel', 'Gucci', 'Hermès', 'Tom Ford'];

const NOTES = [
  { title: 'Fleurs blanches', text: 'Narcisse, jasmin et rose pour un éclat lumineux et aérien.' },
  { title: 'Oriental', text: 'Ambre, vanille et santal pour un sillage profond et chic.' },
  { title: 'Boisé', text: 'Cèdre, patchouli et vetiver pour une élégance persistante.' },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/products')
      .then((data) => {
        setProducts(data.slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero-home perfume-hero">
        <div className="hero-media">
          <img src="/roya-hero-bottle.jpg" alt="Flacon de parfum premium ROYA" />
        </div>
        <div className="hero-overlay" />
        <span className="hero-frame" />

        <div className="container">
          <div className="hero-content">
            <span className="eyebrow">Maison de parfums de luxe</span>
            <h1 className="hero-title">
              Éclat,
              <br />
              <em>romance et sensualité</em>
            </h1>
            <p className="hero-sub">
              Des fragrances signées par des maisons emblématiques, soigneusement
              sélectionnées pour sublimer chaque instant avec élégance et caractère.
            </p>
            <div className="hero-actions">
              <Link to="/produits" className="btn btn-gold">
                Découvrir la collection
              </Link>
              <Link to="/contact" className="link-underline">
                Notre savoir-faire
                <ArrowRight size={14} strokeWidth={1.8} />
              </Link>
            </div>

            <div className="hero-facts">
              <div className="fact">
                <b>50+</b>
                <span>Fragrances prestige</span>
              </div>
              <div className="fact">
                <b>96%</b>
                <span>Clients satisfaits</span>
              </div>
              <div className="fact">
                <b>24h</b>
                <span>Livraison express</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-scroll-hint">Défiler</div>
      </section>

      <section className="strip">
        <div className="container" style={{ padding: 0 }}>
          <div className="strip-inner">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div className="strip-item" key={title}>
                <Icon className="strip-icon" size={26} strokeWidth={1.3} />
                <div>
                  <div className="strip-title">{title}</div>
                  <div className="strip-desc">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Les univers ROYA</span>
            <h2>Parfums pour <em>chaque signature</em></h2>
            <p>
              Des notes lumineuses, ambrées, florales et boisées créées pour laisser
              une impression durable, raffinée et inoubliable.
            </p>
          </div>

          <div className="cat-grid">
            {CATEGORIES.map((cat) => (
              <Link to={`/produits?categorie=${cat.name}`} className="cat-card" key={cat.name}>
                <img src={cat.img} alt={cat.name} loading="lazy" />
                <span className="cat-frame" />
                <div className="cat-body">
                  <span className="cat-kicker">Collection</span>
                  <h3 className="cat-name">{cat.name}</h3>
                  <span className="cat-link">
                    Découvrir
                    <ArrowRight size={13} strokeWidth={1.8} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt brand-showcase">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Maisons de prestige</span>
            <h2>Les marques qui font <em>luxe</em></h2>
          </div>

          <div className="brand-strip" aria-label="Marques de parfum"> 
            {BRANDS.map((brand) => (
              <div key={brand} className="brand-pill">{brand}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="section concierge-section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">L’excellence ROYA</span>
            <h2>Une <em>curation</em> pensée pour les sens</h2>
          </div>

          <div className="concierge-grid">
            <div className="concierge-card concierge-featured">
              <span className="concierge-tag">Signature</span>
              <h3>Parfums edités pour votre identité</h3>
              <p>
                Chaque fragrance est sélectionnée selon sa profondeur, son sillage et sa capacité
                à laisser une trace aussi mémorable que discrète.
              </p>
            </div>

            <div className="concierge-card">
              <span className="concierge-tag">Conseille</span>
              <h3>Le bon accord selon votre style</h3>
              <p>Floral, oriental, boisé ou musqué : nous guidons chaque choix avec élégance.</p>
            </div>

            <div className="concierge-card">
              <span className="concierge-tag">Offre</span>
              <h3>Édition limitée & coffret cadeau</h3>
              <p>Des présentations raffinées pour offrir un instant délicat, chic et personnel.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head-row">
            <div className="section-head" style={{ marginBottom: 0 }}>
              <span className="eyebrow">Les plus prisés</span>
              <h2>La sélection <em>signature</em></h2>
              <p>
                Les parfums les plus convoités de la maison, conçus pour séduire le
                plus exigeant des sens et évoquer un style de vie chic et confident.
              </p>
            </div>
            <Link to="/produits" className="btn btn-outline">
              Voir toute la collection
              <ArrowRight size={15} strokeWidth={1.8} />
            </Link>
          </div>

          {loading ? (
            <div className="grid-placeholder">Sélection de nos fragrances en cours…</div>
          ) : (
            <div className="grid-products">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section notes-section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Le langage des notes</span>
            <h2>Une fragrance pour <em>chaque moment</em></h2>
          </div>

          <div className="notes-grid">
            {NOTES.map(({ title, text }, index) => (
              <div className="notes-panel" key={title}>
                <span className="notes-index">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="story-grid">
            <div className="story-media">
              <img src="/roya-atelier.jpg" alt="Atelier de création d'une fragrance couture" loading="lazy" />
              <div className="story-badge">
                <strong>15</strong>
                <span>ans de<br />maîtrise</span>
              </div>
            </div>

            <div>
              <span className="eyebrow">Notre maison</span>
              <h2 style={{ fontSize: 'clamp(2.2rem, 3.6vw, 3rem)', margin: '1.15rem 0 1.25rem' }}>
                La beauté du parfum,
                <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}> dans un écrin de luxe</em>
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontWeight: 300, fontSize: '1.02rem' }}>
                ROYA réunit la noblesse des parfums de marques iconiques et la précision
                d’un atelier exigeant. Chaque création est pensée pour évoquer un souvenir,
                une émotion et un style de vie élégant et discret.
              </p>

              <div className="story-stats">
                <div className="story-stat">
                  <strong>50+</strong>
                  <span>Fragrances</span>
                </div>
                <div className="story-stat">
                  <strong>100%</strong>
                  <span>Authentiques</span>
                </div>
                <div className="story-stat">
                  <strong>24/7</strong>
                  <span>Service client</span>
                </div>
              </div>

              <Link to="/produits" className="btn btn-primary">
                Explorer la boutique
                <ArrowRight size={15} strokeWidth={1.8} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
