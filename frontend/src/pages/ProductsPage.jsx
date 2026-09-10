import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../components/Toast.jsx';
import {
  LayoutGrid, List, ChevronRight, Search, ShoppingCart,
  SearchX, X, Sparkles,
} from 'lucide-react';

const MAX_PRICE = 600;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('categorie') || '';
  const [search, setSearch] = useState('');

  const [viewMode, setViewModeState] = useState(() => localStorage.getItem('roya_view_mode') || 'grid');
  const setViewMode = (mode) => {
    setViewModeState(mode);
    localStorage.setItem('roya_view_mode', mode);
  };

  const [sortOption, setSortOption] = useState('popularity');
  const [priceRange, setPriceRange] = useState(MAX_PRICE);
  const [inStockOnly, setInStockOnly] = useState(false);

  const { addItem } = useCart();
  const { push } = useToast();

  useEffect(() => {
    Promise.all([api.get('/products'), api.get('/products/categories')])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCat = !activeCategory || p.category === activeCategory;
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || p.name.toLowerCase().includes(q);
      const matchesPrice = p.price <= priceRange;
      const matchesStock = !inStockOnly || p.inStock !== false;
      return matchesCat && matchesSearch && matchesPrice && matchesStock;
    });

    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }
    return result;
  }, [products, activeCategory, search, priceRange, inStockOnly, sortOption]);

  const setCategory = (cat) => {
    setSearchParams(cat && cat !== activeCategory ? { categorie: cat } : {});
  };

  const hasActiveFilters =
    Boolean(activeCategory) ||
    Boolean(search.trim()) ||
    priceRange < MAX_PRICE ||
    inStockOnly;

  const resetFilters = () => {
    setPriceRange(MAX_PRICE);
    setInStockOnly(false);
    setSortOption('popularity');
    setSearch('');
    setSearchParams({});
  };

  return (
    <div className="container page-collection">

      <nav className="breadcrumbs" aria-label="Fil d'Ariane">
        <Link to="/">Accueil</Link>
        <ChevronRight size={12} />
        <span className="current">Collection</span>
      </nav>

      <header className="collection-head">
        <span className="eyebrow">La maison ROYA</span>
        <h1 className="collection-title">
          Une fragrance pour <em>chaque émotion</em>
        </h1>
        <p className="collection-lead">
          Une sélection raffinée de parfums de marques iconiques, conçus pour offrir
          une présence élégante, mémorable et profondément personnelle.
        </p>
        <div className="ornament left"><i /></div>
      </header>

      {/* ── Barre d'outils ── */}
      <div className="collection-toolbar">
        <span className="toolbar-count">
          {loading
            ? 'Sélection…'
            : `${filtered.length} résultat${filtered.length > 1 ? 's' : ''}${activeCategory ? ` — ${activeCategory}` : ''}`}
        </span>

        <div className="toolbar-right">
          <label className="toolbar-sort">
            <span>Trier par</span>
            <select className="sort-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="popularity">Popularité</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </label>

          <div className="view-toggle" role="group" aria-label="Mode d'affichage">
            <button
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
              title="Affichage grille"
            >
              <LayoutGrid size={17} strokeWidth={1.6} />
            </button>
            <button
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
              title="Affichage liste"
            >
              <List size={17} strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Puces de filtres actifs ── */}
      {hasActiveFilters && (
        <div className="active-chips">
          {activeCategory && (
            <span className="filter-chip">
              Catégorie : <b>{activeCategory}</b>
              <button onClick={() => setCategory('')} aria-label="Retirer la catégorie">
                <X size={12} strokeWidth={2} />
              </button>
            </span>
          )}
          {search.trim() && (
            <span className="filter-chip">
              Recherche : <b>« {search.trim()} »</b>
              <button onClick={() => setSearch('')} aria-label="Effacer la recherche">
                <X size={12} strokeWidth={2} />
              </button>
            </span>
          )}
          {priceRange < MAX_PRICE && (
            <span className="filter-chip">
              Budget : <b>jusqu'à {priceRange} DT</b>
              <button onClick={() => setPriceRange(MAX_PRICE)} aria-label="Retirer le budget">
                <X size={12} strokeWidth={2} />
              </button>
            </span>
          )}
          {inStockOnly && (
            <span className="filter-chip">
              <b>En stock uniquement</b>
              <button onClick={() => setInStockOnly(false)} aria-label="Retirer le filtre stock">
                <X size={12} strokeWidth={2} />
              </button>
            </span>
          )}
          <button className="clear-all" onClick={resetFilters}>
            Tout effacer
          </button>
        </div>
      )}

      <div className="shop-layout">

        {/* ── Filtres ── */}
        <aside className="filters">
          <div className="filter-block">
            <h3 className="filter-title">Recherche</h3>
            <div className="search-field">
              <Search size={15} strokeWidth={1.6} />
              <input
                type="text"
                className="input"
                placeholder="Chercher un parfum…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-block">
            <h3 className="filter-title">Catégories</h3>
            <ul className="cat-list">
              <li>
                <button className={!activeCategory ? 'active' : ''} onClick={() => setCategory('')}>
                  Toute la collection
                  <span className="cat-count">{products.length}</span>
                </button>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <button
                    className={activeCategory === c ? 'active' : ''}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                    <span className="cat-count">{products.filter((p) => p.category === c).length}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-block">
            <h3 className="filter-title">Budget</h3>
            <input
              type="range"
              className="price-slider"
              min="0"
              max={MAX_PRICE}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              style={{ '--fill': `${(priceRange / MAX_PRICE) * 100}%` }}
              aria-label="Prix maximum"
            />
            <div className="price-values">
              <span>0 DT</span>
              <span>Jusqu'à <b style={{ color: 'var(--ink)', fontWeight: 500 }}>{priceRange} DT</b></span>
            </div>
          </div>

          <div className="filter-block" style={{ borderBottom: 'none' }}>
            <h3 className="filter-title">Disponibilité</h3>
            <label className="stock-filter">
              En stock uniquement
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                hidden
              />
              <span className="switch" aria-hidden="true" />
            </label>
            {hasActiveFilters && (
              <button
                className="btn btn-outline btn-sm btn-block"
                style={{ marginTop: '1.4rem' }}
                onClick={resetFilters}
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </aside>

        {/* ── Résultats ── */}
        <main>
          {loading ? (
            <div className="grid-products">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i}>
                  <div
                    style={{
                      aspectRatio: '4 / 5',
                      background: 'linear-gradient(100deg, var(--sand) 40%, var(--linen) 50%, var(--sand) 60%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmerBg 1.4s infinite',
                    }}
                  />
                  <div style={{
                    height: 13, width: '55%', margin: '1.25rem auto 0.7rem',
                    background: 'var(--sand)', animation: 'shimmerBg 1.4s infinite',
                    backgroundSize: '200% 100%',
                  }} />
                  <div style={{
                    height: 11, width: '35%', margin: '0 auto',
                    background: 'var(--sand)', backgroundSize: '200% 100%',
                    animation: 'shimmerBg 1.4s infinite',
                  }} />
                </div>
              ))}
              <style>{`@keyframes shimmerBg { to { background-position: -200% 0; } }`}</style>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <SearchX size={44} strokeWidth={1.1} style={{ color: 'var(--gold)', margin: '0 auto 1.4rem' }} />
              <h3 style={{ fontSize: '1.7rem', marginBottom: '0.7rem' }}>Aucun parfum trouvé</h3>
              <p>Essayez d’élargir votre budget ou retirez un ou deux filtres.</p>
              <button className="btn btn-primary" onClick={resetFilters}>
                <Sparkles size={14} strokeWidth={1.8} />
                Réinitialiser les filtres
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid-products">
              {filtered.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="list-products">
              {filtered.map((p) => {
                const outOfStock = p.inStock === false;
                const desc = (p.description || '').trim();
                const descWords = desc.split(/\s+/);
                const needsMore = descWords.length > 22;
                const shortDesc = needsMore ? `${descWords.slice(0, 22).join(' ')}…` : desc;

                return (
                  <article className="list-item" key={p._id}>
                    <Link to={`/produit/${p._id}`} className="list-item-media">
                      <img src={p.image || '/roya-hero-bottle.jpg'} alt={p.name} loading="lazy" />
                    </Link>

                    <div className="list-item-body">
                      <span className="pc-cat" style={{ textAlign: 'left' }}>
                        {p.category || 'Parfum de luxe'}
                      </span>
                      <h3 className="pc-name" style={{ fontSize: '1.55rem' }}>
                        <Link to={`/produit/${p._id}`}>{p.name}</Link>
                      </h3>
                      <p className="list-item-desc">
                        {shortDesc || 'Un parfum élégant qui se distingue par son sillage raffiné et sa signature distinctive.'}{' '}
                        {(needsMore || !desc) && (
                          <Link to={`/produit/${p._id}`} className="list-item-more">
                            Lire la suite
                          </Link>
                        )}
                      </p>
                    </div>

                    <div className="list-item-actions">
                      <div className="list-item-price">
                        {p.price.toFixed(3).replace('.', ',')} DT
                      </div>
                      <Link to={`/produit/${p._id}`} className="btn btn-outline btn-sm btn-block">
                        Voir la pièce
                      </Link>
                      <button
                        className={`btn ${outOfStock ? 'btn-light' : 'btn-primary'} btn-sm btn-block`}
                        disabled={outOfStock}
                        onClick={() => {
                          addItem(p);
                          push(`${p.name} ajouté au panier`);
                        }}
                      >
                        <ShoppingCart size={14} strokeWidth={1.8} />
                        {outOfStock ? 'Épuisé' : 'Ajouter'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
