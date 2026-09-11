import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { PRESTIGE_PRODUCTS } from '../data/mockProducts.js';
import {
  LayoutGrid, List, ChevronRight, Search, ShoppingCart,
  SearchX, X, Sparkles, SlidersHorizontal, Check,
} from 'lucide-react';

const MAX_PRICE = 600;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get('categorie') || '';
  const activeGenre = searchParams.get('genre') || '';
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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
        const validProds = (prods || []).filter(
          (p) =>
            p.name &&
            !['ds5', 'raz'].includes(p.name.toLowerCase()) &&
            !p.image?.includes('cutting_board') &&
            !p.image?.includes('Priviet')
        );

        if (validProds.length > 0) {
          setProducts(validProds);
        } else {
          setProducts(PRESTIGE_PRODUCTS);
        }

        const validCats = (cats || []).filter(
          (c) => c && !['85', 'test', 'Planches'].includes(c)
        );
        setCategories(
          validCats.length > 0
            ? validCats
            : ['Pour Elle', 'Pour Lui', 'Niche & Mixte', 'Floraux', 'Boisés']
        );
        setLoading(false);
      })
      .catch(() => {
        setProducts(PRESTIGE_PRODUCTS);
        setCategories(['Pour Elle', 'Pour Lui', 'Niche & Mixte', 'Floraux', 'Boisés']);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      // Filtre genre (60% Femme, 40% Homme)
      let matchesGenre = true;
      if (activeGenre === 'femme') {
        matchesGenre = p.gender === 'femme' || p.category?.toLowerCase().includes('elle');
      } else if (activeGenre === 'homme') {
        matchesGenre = p.gender === 'homme' || p.category?.toLowerCase().includes('lui');
      } else if (activeGenre === 'mixte') {
        matchesGenre = p.gender === 'mixte' || p.category?.toLowerCase().includes('mixte') || p.category?.toLowerCase().includes('niche');
      }

      const matchesCat = !activeCategory || p.category === activeCategory;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.family && p.family.toLowerCase().includes(q));

      const matchesPrice = p.price <= priceRange;
      const matchesStock = !inStockOnly || p.inStock !== false;

      return matchesGenre && matchesCat && matchesSearch && matchesPrice && matchesStock;
    });

    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }
    return result;
  }, [products, activeGenre, activeCategory, search, priceRange, inStockOnly, sortOption]);

  const setGenre = (genre) => {
    const params = new URLSearchParams(searchParams);
    if (genre && genre !== activeGenre) {
      params.set('genre', genre);
    } else {
      params.delete('genre');
    }
    setSearchParams(params);
  };

  const setCategory = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat && cat !== activeCategory) {
      params.set('categorie', cat);
    } else {
      params.delete('categorie');
    }
    setSearchParams(params);
  };

  const hasActiveFilters =
    Boolean(activeGenre) ||
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
    setMobileFilterOpen(false);
  };

  return (
    <div className="container page-collection">
      <nav className="breadcrumbs" aria-label="Fil d'Ariane">
        <Link to="/">Accueil</Link>
        <ChevronRight size={12} />
        <span className="current">Haute Curation Parfums</span>
      </nav>

      <header className="collection-head">
        <span className="eyebrow">Haute Parfumerie</span>
        <h1 className="collection-title">
          Le Vestiaire des <em>Grandes Émotions</em>
        </h1>
        <p className="collection-lead">
          Une collection exclusive 60% féminine et 40% masculine, sélectionnée parmi les
          plus grandes maisons de parfum du monde pour sublimer votre présence.
        </p>
        <div className="ornament left"><i /></div>

        {/* ── Puces Filtres Rapides par Genre (Mobile-First) ── */}
        <div className="genre-filter-bar">
          <button
            className={`genre-pill ${!activeGenre ? 'active' : ''}`}
            onClick={() => setGenre('')}
          >
            Tous les Sillages ({products.length})
          </button>
          <button
            className={`genre-pill femme ${activeGenre === 'femme' ? 'active' : ''}`}
            onClick={() => setGenre('femme')}
          >
            <Sparkles size={13} />
            Pour Elle <span className="pill-percent">60%</span>
          </button>
          <button
            className={`genre-pill homme ${activeGenre === 'homme' ? 'active' : ''}`}
            onClick={() => setGenre('homme')}
          >
            Pour Lui <span className="pill-percent">40%</span>
          </button>
          <button
            className={`genre-pill mixte ${activeGenre === 'mixte' ? 'active' : ''}`}
            onClick={() => setGenre('mixte')}
          >
            Niche & Unisexe
          </button>
        </div>
      </header>

      {/* ── Barre d'outils Collection ── */}
      <div className="collection-toolbar">
        <div className="toolbar-left">
          <button
            className="mobile-filter-trigger mobile-only"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            aria-label="Ouvrir les filtres de recherche"
          >
            <SlidersHorizontal size={15} />
            <span>Filtres & Budget</span>
            {hasActiveFilters && <span className="filter-count-dot" />}
          </button>

          <span className="toolbar-count desktop-only">
            {loading
              ? 'Sélection…'
              : `${filtered.length} fragrance${filtered.length > 1 ? 's' : ''}${activeGenre ? ` · ${activeGenre === 'femme' ? 'Pour Elle' : 'Pour Lui'}` : ''}`}
          </span>
        </div>

        <div className="toolbar-right">
          <label className="toolbar-sort">
            <span>Trier</span>
            <select className="sort-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="popularity">Popularité & Signatures</option>
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
              <LayoutGrid size={16} strokeWidth={1.7} />
            </button>
            <button
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
              title="Affichage liste"
            >
              <List size={16} strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Puces de filtres actifs ── */}
      {hasActiveFilters && (
        <div className="active-chips">
          {activeGenre && (
            <span className="filter-chip">
              Sélection : <b>{activeGenre === 'femme' ? 'Pour Elle (60%)' : activeGenre === 'homme' ? 'Pour Lui (40%)' : 'Niche'}</b>
              <button onClick={() => setGenre('')} aria-label="Retirer le genre">
                <X size={12} strokeWidth={2} />
              </button>
            </span>
          )}
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
              Budget : <b>≤ {priceRange} DT</b>
              <button onClick={() => setPriceRange(MAX_PRICE)} aria-label="Retirer le budget">
                <X size={12} strokeWidth={2} />
              </button>
            </span>
          )}
          {inStockOnly && (
            <span className="filter-chip">
              <b>En stock</b>
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
        {/* ── Sidebar Filtres (Desktop + Drawer Mobile) ── */}
        <aside className={`filters ${mobileFilterOpen ? 'mobile-open' : ''}`}>
          <div className="filters-drawer-header mobile-only">
            <h3>Filtrer la Curation</h3>
            <button onClick={() => setMobileFilterOpen(false)} aria-label="Fermer les filtres">
              <X size={20} />
            </button>
          </div>

          <div className="filter-block">
            <h3 className="filter-title">Recherche Fragrance / Marque</h3>
            <div className="search-field">
              <Search size={15} strokeWidth={1.6} />
              <input
                type="text"
                className="input"
                placeholder="Dior, Chanel, Rose, Oud…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-block">
            <h3 className="filter-title">Univers Olfactifs</h3>
            <ul className="cat-list">
              <li>
                <button className={!activeCategory ? 'active' : ''} onClick={() => { setCategory(''); setMobileFilterOpen(false); }}>
                  Toutes les familles
                  <span className="cat-count">{products.length}</span>
                </button>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <button
                    className={activeCategory === c ? 'active' : ''}
                    onClick={() => { setCategory(c); setMobileFilterOpen(false); }}
                  >
                    {c}
                    <span className="cat-count">{products.filter((p) => p.category === c).length}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-block">
            <h3 className="filter-title">Budget Maximum</h3>
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
              <span>Jusqu'à <b style={{ color: 'var(--rose-gold)', fontWeight: 600 }}>{priceRange} DT</b></span>
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

          <div className="mobile-only" style={{ marginTop: '1.5rem' }}>
            <button
              className="btn btn-primary btn-block"
              onClick={() => setMobileFilterOpen(false)}
            >
              Afficher {filtered.length} résultats
            </button>
          </div>
        </aside>

        {/* ── Résultats ── */}
        <main className="shop-main">
          {loading ? (
            <div className="grid-products">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: '3 / 4',
                    background: 'linear-gradient(100deg, var(--sand) 40%, var(--linen) 50%, var(--sand) 60%)',
                    backgroundSize: '200% 100%',
                    borderRadius: 'var(--radius-sm)',
                    animation: 'shimmerBg 1.4s infinite',
                  }}
                />
              ))}
              <style>{`@keyframes shimmerBg { to { background-position: -200% 0; } }`}</style>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <SearchX size={44} strokeWidth={1.1} style={{ color: 'var(--rose-gold)', margin: '0 auto 1.4rem' }} />
              <h3 style={{ fontSize: '1.7rem', marginBottom: '0.7rem' }}>Aucune fragrance correspondante</h3>
              <p>Essayez d’élargir votre budget ou d'ajuster le filtre de sélection.</p>
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
                      <img src={p.image || '/roya-cat-niche.jpg'} alt={p.name} loading="lazy" />
                    </Link>

                    <div className="list-item-body">
                      <span className="pc-cat" style={{ textAlign: 'left' }}>
                        {p.brand || p.category || 'Maison de Haute Parfumerie'}
                      </span>
                      <h3 className="pc-name" style={{ fontSize: '1.55rem' }}>
                        <Link to={`/produit/${p._id}`}>{p.name}</Link>
                      </h3>
                      {p.family && <span className="pc-family">{p.family}</span>}
                      <p className="list-item-desc">
                        {shortDesc || 'Une fragrance d’exception créée pour laisser un sillage raffiné et inoubliable.'}
                      </p>
                    </div>

                    <div className="list-item-actions">
                      <div className="list-item-price">
                        {p.price.toFixed(3).replace('.', ',')} DT
                      </div>
                      <Link to={`/produit/${p._id}`} className="btn btn-outline btn-sm btn-block">
                        Découvrir le flacon
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
